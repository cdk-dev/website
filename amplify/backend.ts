import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { TableNotifications } from './constructs/table-notifications';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { ProcessLinks } from './extract/resource';

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


// === Subscribers ===

const subscribers = backend.createStack('subscribers')
const topic = new sns.Topic(subscribers, 'DdbToSnsTopic', {
  displayName: 'New Post on cdk.dev',
});

new TableNotifications(subscribers, 'TableNotifications', {
  table: dataResources.tables['Post'],
  topic,
  message: 'A new post with the title "<$.dynamodb.NewImage.title.S>" has been added to https://cdk.dev - check it out now'
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

// === Link Notifications ===

const links = backend.createStack('links')
const t = new sns.Topic(links, 'DdbToSnsTopic', {
  displayName: 'New Link for cdk.dev',
});

t.addSubscription(new snsSubscriptions.EmailSubscription('sebastian@korfmann.net'));

new TableNotifications(links, 'TableNotifications', {
  table: dataResources.tables['LinkSuggestion'],
  topic: t,
  message: 'A new link with the url "<$.dynamodb.NewImage.url.S>" has been added to https://cdk.dev - check it out now'
})

export default backend;

// === Scraper ===

const scraper = backend.createStack('scraper')
new ProcessLinks(scraper, 'ProcessLinks', {
  table: dataResources.tables['LinkSuggestion'],
})