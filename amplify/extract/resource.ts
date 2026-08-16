import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as pipes from 'aws-cdk-lib/aws-pipes';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { ExtractContentStateMachine } from './sfn';


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

    const stateMachine = new ExtractContentStateMachine(this, 'ExtractContentStateMachine', bucket);
    new DdbToSfnPipe(this, 'DdbToSfnPipe', table, stateMachine.stateMachine);
  }
}