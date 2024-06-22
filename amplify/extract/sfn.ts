import { Duration } from 'aws-cdk-lib'
import * as logs from 'aws-cdk-lib/aws-logs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class ExtractContentLambda extends Construct {
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
  
export class ConvertHtmlToMarkdownLambda extends Construct {
    public readonly lambdaFunction: lambda.IFunction;
  
    constructor(scope: Construct, id: string, bucket: s3.IBucket) {
      super(scope, id);
  
      this.lambdaFunction = new NodejsFunction(this, 'ConvertHtmlToMarkdownLambda', {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: 'amplify/extract/converter/index.ts',
        handler: 'handler',
        memorySize: 512,
        timeout: Duration.seconds(10),
        environment: {
          BUCKET_NAME: bucket.bucketName,
        },
      });
  
      bucket.grantReadWrite(this.lambdaFunction);
    }
  }

export class ExtractContentStateMachine extends Construct {
  public readonly stateMachine: sfn.IStateMachine;

  constructor(scope: Construct, id: string, bucket: s3.IBucket) {
    super(scope, id);

    const extractContentLambda = new ExtractContentLambda(this, 'ExtractContentLambda', bucket);
    const convertHtmlToMarkdownLambda = new ConvertHtmlToMarkdownLambda(this, 'ConvertHtmlToMarkdownLambda', bucket);

    const extractContentTask = new tasks.LambdaInvoke(this, 'ExtractContentTask', {
      lambdaFunction: extractContentLambda.lambdaFunction,
      outputPath: '$.Payload',
      payload: sfn.TaskInput.fromObject({
        id: sfn.JsonPath.stringAt('$.dynamodb.NewImage.id.S'),
        url: sfn.JsonPath.stringAt('$.dynamodb.NewImage.url.S'),
        comment: sfn.JsonPath.stringAt('$.dynamodb.NewImage.comment.S'),
      }),
    });

    const parseBody = new sfn.Pass(this, 'ParseBody', {
      parameters: {
        'parsedBody.$': 'States.StringToJson($.body)',
        'statusCode.$': '$.statusCode',
      },
    });

    const convertHtmlToMarkdownTask = new tasks.LambdaInvoke(this, 'ConvertHtmlToMarkdownTask', {
      lambdaFunction: convertHtmlToMarkdownLambda.lambdaFunction,
      outputPath: '$.Payload',
      payload: sfn.TaskInput.fromObject({
        "id.$": "$.parsedBody.id",
      }),
    });

    const checkLambdaSuccess = new sfn.Choice(this, 'CheckLambdaSuccess')
      .when(sfn.Condition.numberEquals('$.statusCode', 200), parseBody.next(convertHtmlToMarkdownTask))
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
