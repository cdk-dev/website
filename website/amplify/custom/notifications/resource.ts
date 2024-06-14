import * as url from 'node:url';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';

// message to publish
export type Message = {
  subject: string;
  body: string;
  recipient: string;
};

type CustomNotificationsProps = {
  /**
   * The source email address to use for sending emails
   */
  sourceAddress: string;
};

export class CustomNotifications extends Construct {
  public readonly topic: sns.Topic;
  constructor(scope: Construct, id: string, props: CustomNotificationsProps) {
    super(scope, id);

    const { sourceAddress } = props;

    // Create SNS topic
    this.topic = new sns.Topic(this, 'NotificationTopic');
  }
}