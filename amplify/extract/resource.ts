import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import * as pipes from 'aws-cdk-lib/aws-pipes';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

class ExtractContentLambda extends Construct {
  public readonly lambdaFunction: lambda.IFunction;

  constructor(scope: Construct, id: string, bucket: s3.IBucket) {
    super(scope, id);

    this.lambdaFunction = new lambda.DockerImageFunction(this, 'ExtractContentLambda', {
      code: lambda.DockerImageCode.fromImageAsset('amplify/extract/scraper'),
      memorySize: 2048,
      timeout: Duration.seconds(60),
      tracing: lambda.Tracing.ACTIVE,
      logRetention: logs.RetentionDays.ONE_WEEK,
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    bucket.grantWrite(this.lambdaFunction);
  }
}

class ExtractContentStateMachine extends Construct {
  public readonly stateMachine: sfn.IStateMachine;

  constructor(scope: Construct, id: string, extractContentLambda: lambda.IFunction) {
    super(scope, id);

    const extractContentTask = new tasks.LambdaInvoke(this, 'ExtractContentTask', {
      lambdaFunction: extractContentLambda,
      outputPath: '$.Payload',
      payload: sfn.TaskInput.fromObject({
        id: sfn.JsonPath.stringAt('$.dynamodb.NewImage.id.S'),
        url: sfn.JsonPath.stringAt('$.dynamodb.NewImage.url.S'),
        comment: sfn.JsonPath.stringAt('$.dynamodb.NewImage.comment.S'),
      }),
    });

    const checkLambdaSuccess = new sfn.Choice(this, 'CheckLambdaSuccess')
      .when(sfn.Condition.numberEquals('$.statusCode', 200), new sfn.Pass(this, 'Success'))
      .otherwise(new sfn.Fail(this, 'LambdaFailed', {
        error: 'LambdaError',
        cause: 'The Lambda function returned an error',
      }));

    const checkNewImage = new sfn.Choice(this, 'CheckNewImage')
      .when(sfn.Condition.isPresent('$.dynamodb.NewImage'), extractContentTask.next(checkLambdaSuccess))
      .otherwise(new sfn.Pass(this, 'NoNewImage'));

    const mapState = new sfn.Map(this, 'MapState', {
      inputPath: '$.records',
      itemsPath: '$',
      resultPath: '$.processed',
      maxConcurrency: 1,
    });

    mapState.iterator(checkNewImage);

    const transformInput = new sfn.Pass(this, 'TransformInput', {
      resultPath: '$',
      parameters: {
        records: sfn.JsonPath.entirePayload,
      },
    });

    const definition = transformInput.next(mapState);

    const stateMachineLogGroup = new logs.LogGroup(this, 'StateMachineLogGroup', {
      retention: logs.RetentionDays.ONE_WEEK,
    });

    this.stateMachine = new sfn.StateMachine(this, 'ExtractContentStateMachine', {
      definition,
      timeout: Duration.minutes(5),
      tracingEnabled: true,
      stateMachineType: sfn.StateMachineType.STANDARD,
      logs: {
        destination: stateMachineLogGroup,
        level: sfn.LogLevel.ALL,
      },
    });
  }
}

class DdbToSfnPipe extends Construct {
  constructor(scope: Construct, id: string, table: dynamodb.ITable, stateMachine: sfn.IStateMachine) {
    super(scope, id);

    const pipeRole = new iam.Role(this, 'PipeRole', {
      assumedBy: new iam.ServicePrincipal('pipes.amazonaws.com'),
    });

    table.grantStreamRead(pipeRole);
    stateMachine.grantStartExecution(pipeRole);

    const logGroup = new logs.LogGroup(this, 'PipeLogGroup', {
      retention: logs.RetentionDays.ONE_WEEK,
    });

    new pipes.CfnPipe(this, 'DdbToSfnPipe', {
      roleArn: pipeRole.roleArn,
      source: table.tableStreamArn!,
      sourceParameters: {
        dynamoDbStreamParameters: {
          startingPosition: 'LATEST',
        },
      },
      target: stateMachine.stateMachineArn,
      targetParameters: {
        stepFunctionStateMachineParameters: {
          invocationType: 'FIRE_AND_FORGET',
        },
      },
      logConfiguration: {
        cloudwatchLogsLogDestination: {
          logGroupArn: logGroup.logGroupArn,
        },
        level: 'INFO',
      },
    });
  }
}

export class ProcessLinks extends Construct {
  constructor(scope: Construct, id: string, props: { table: dynamodb.ITable }) {
    super(scope, id);

    const { table } = props;

    const bucket = new s3.Bucket(this, 'AssetsBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const extractContentLambda = new ExtractContentLambda(this, 'ExtractContentLambda', bucket);
    const stateMachine = new ExtractContentStateMachine(this, 'ExtractContentStateMachine', extractContentLambda.lambdaFunction);
    new DdbToSfnPipe(this, 'DdbToSfnPipe', table, stateMachine.stateMachine);
  }
}