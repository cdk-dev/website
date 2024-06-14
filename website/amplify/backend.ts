import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { ContentSubscribers } from './subscribers/resource';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage
});


const dataResources = backend.data.resources;

dataResources.cfnResources.cfnGraphqlApi.xrayEnabled = true;
// Object.values(dataResources.cfnResources.amplifyDynamoDbTables).forEach((table) => {
//   table.pointInTimeRecoveryEnabled = true;
// });

const subscribers = backend.createStack('subscribers')
const topic = new sns.Topic(subscribers, 'DdbToSnsTopic', {
  displayName: 'New Post on cdk.dev',
});
new ContentSubscribers(subscribers, 'ContentSubscribers', {
  table: dataResources.tables['Post'],
  topic
})

const policy = new iam.Policy(subscribers, 'SubscribersPolicy', {
  document: new iam.PolicyDocument({
    statements: [new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [topic.topicArn],
      actions: ['sns:Subscribe'],
    })]
  }),
});

backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(policy)
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(policy);

backend.addOutput({
  custom: {
    subscribersTopicArn: topic.topicArn,
  }
})
export default backend;