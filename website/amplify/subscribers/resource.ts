import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as pipes from 'aws-cdk-lib/aws-pipes';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export class ContentSubscribers extends Construct {
  constructor(scope: Construct, id: string, props: { table: dynamodb.ITable, topic: sns.ITopic }) {
    super(scope, id);

    const { table, topic } = props;

    const pipeRole = new iam.Role(this, 'PipeRole', {
      assumedBy: new iam.ServicePrincipal('pipes.amazonaws.com'),
    });

    table.grantStreamRead(pipeRole);
    topic.grantPublish(pipeRole);

    // Create a CloudWatch Log Group
    const logGroup = new logs.LogGroup(this, 'PipeLogGroup', {
      retention: logs.RetentionDays.ONE_WEEK,
    });

    new pipes.CfnPipe(this, 'DdbToSnsPipe', {
      roleArn: pipeRole.roleArn,
      source: table.tableStreamArn!,
      sourceParameters: {
        dynamoDbStreamParameters: {
          startingPosition: 'LATEST',
        },
      },
      target: topic.topicArn,
      targetParameters: {
        inputTemplate: 'A new post with the title "<$.dynamodb.NewImage.title.S>" has been added to https://cdk.dev - check it out now',
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
