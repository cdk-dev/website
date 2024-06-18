// Prompt Instructions:
// use the latest version of the AWS CDK
// the ddb payload looks like this
// [
//   {
//     "eventID": "60f8a40b6e9b225e47fab440921bd144",
//     "eventName": "INSERT",
//     "eventVersion": "1.1",
//     "eventSource": "aws:dynamodb",
//     "awsRegion": "eu-central-1",
//     "dynamodb": {
//       "ApproximateCreationDateTime": 1718738391,
//       "Keys": {
//         "id": {
//           "S": "4b3ebdeb-37b9-42b9-8b59-1c27cb650063"
//         }
//       },
//       "NewImage": {
//         "createdAt": {
//           "S": "2024-06-18T19:19:51.123Z"
//         },
//         "__typename": {
//           "S": "LinkSuggestion"
//         },
//         "comment": {
//           "S": ""
//         },
//         "id": {
//           "S": "4b3ebdeb-37b9-42b9-8b59-1c27cb650063"
//         },
//         "url": {
//           "S": "https://hamburg.onruby.de/"
//         },
//         "updatedAt": {
//           "S": "2024-06-18T19:19:51.123Z"
//         }
//       },
//       "SequenceNumber": "24446300000000067178597388",
//       "SizeBytes": 202,
//       "StreamViewType": "NEW_AND_OLD_IMAGES"
//     },
//     "eventSourceARN": "arn:aws:dynamodb:eu-central-1:951516604408:table/LinkSuggestion-solb3gvnrfc73d74revv2a7cfm-NONE/stream/2024-06-13T12:55:33.458"
//   }
// ]

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

export class ProcessLinks extends Construct {
  constructor(scope: Construct, id: string, props: { table: dynamodb.ITable }) {
    super(scope, id);

    const { table } = props;

    const pipeRole = new iam.Role(this, 'PipeRole', {
      assumedBy: new iam.ServicePrincipal('pipes.amazonaws.com'),
    });

    table.grantStreamRead(pipeRole);

    const logGroup = new logs.LogGroup(this, 'PipeLogGroup', {
      retention: logs.RetentionDays.ONE_WEEK,
    });

    const bucket = new s3.Bucket(this, 'AssetsBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const extractContentLambda = new lambda.DockerImageFunction(this, 'ExtractContentLambda', {
      code: lambda.DockerImageCode.fromImageAsset('amplify/extract/scraper'),
      memorySize: 2048,
      timeout: Duration.seconds(60),
      tracing: lambda.Tracing.ACTIVE,
      logRetention: logs.RetentionDays.ONE_WEEK,
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    bucket.grantWrite(extractContentLambda);

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
      inputPath: '$.records', // Process the records array
      itemsPath: '$', // Each item in the array
      resultPath: '$.processed',
      maxConcurrency: 1,
    });

    // Set the item processor for the Map state
    mapState.itemProcessor(checkNewImage);

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

    const stateMachine = new sfn.StateMachine(this, 'ExtractContentStateMachine', {
      definition,
      timeout: Duration.minutes(5),
      tracingEnabled: true,
      stateMachineType: sfn.StateMachineType.STANDARD,
      logs: {
        destination: stateMachineLogGroup,
        level: sfn.LogLevel.ALL,
      },
    });

    stateMachine.grantStartExecution(pipeRole);

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
