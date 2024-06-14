import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
});


const dataResources = backend.data.resources;

dataResources.cfnResources.cfnGraphqlApi.xrayEnabled = true;
Object.values(dataResources.cfnResources.amplifyDynamoDbTables).forEach((table) => {
  table.pointInTimeRecoveryEnabled = true;
});