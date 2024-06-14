import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

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
Object.values(dataResources.cfnResources.amplifyDynamoDbTables).forEach((table) => {
  table.pointInTimeRecoveryEnabled = true;
});