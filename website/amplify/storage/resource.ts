import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'cdk-dev-assets',
  access: (allow) => ({
    'content/*': [
        allow.guest.to(['read']),
        allow.authenticated.to(['read', 'write']),
    ]
  }),
});