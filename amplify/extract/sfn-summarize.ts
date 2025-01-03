import { Duration } from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';

export interface SfnSummarizeProps {
  bucket: s3.IBucket;
}

export class SfnSummarize extends Construct {
  public readonly stateMachine: sfn.IStateMachine;
  public readonly stateMachineArn: string;

  constructor(scope: Construct, id: string, props: SfnSummarizeProps) {
    super(scope, id);

    const { bucket } = props;

    const summarizeLambda = new NodejsFunction(this, 'SummarizeLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: 'amplify/extract/summarize/index.ts',
      handler: 'handler',
      memorySize: 512,
      timeout: Duration.seconds(120),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      }
    });

    // Update Bedrock permissions for the Lambda function
    summarizeLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'bedrock:InvokeModel',
      ],
      resources: ['*'], // You might want to restrict this to specific model ARNs
    }));

    bucket.grantRead(summarizeLambda);

    const summarizeTask = new tasks.LambdaInvoke(this, 'SummarizeTask', {
      lambdaFunction: summarizeLambda,
      payloadResponseOnly: true,
      payload: sfn.TaskInput.fromObject({
        id: sfn.JsonPath.stringAt('$.id'),
        key: sfn.JsonPath.stringAt('$.key'),
      }),
      resultPath: '$.taskResult',
      resultSelector: {
        'summary.$': '$.Payload.summary',
      },
    });

    const finalState = new sfn.Pass(this, 'FinalState', {
      parameters: {
        'result.$': '$.taskResult.summary',
      },
    });

    const definition = sfn.Chain.start(summarizeTask).next(finalState);

    const stateMachineLogGroup = new logs.LogGroup(this, 'StateMachineLogGroup', {
      retention: logs.RetentionDays.ONE_WEEK,
    });

    this.stateMachine = new sfn.StateMachine(this, 'SummarizeStateMachine', {
      definition,
      timeout: Duration.minutes(5),
      tracingEnabled: true,
      stateMachineType: sfn.StateMachineType.EXPRESS,
      logs: {
        destination: stateMachineLogGroup,
        level: sfn.LogLevel.ALL,
        includeExecutionData: true,
      },
    });

    this.stateMachineArn = this.stateMachine.stateMachineArn;
  }
}
