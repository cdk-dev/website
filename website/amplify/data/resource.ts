import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Author: a
    .model({
      name: a.string().required(),
      avatar: a.string().required(),
      posts: a.hasMany('Post', 'authorId'),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated('identityPool').to(['read']),
    ]),
  Post: a
    .model({
      title: a.string().required(),
      content: a.string().required(),
      url: a.string().required(),
      categories: a.string().required().array(),
      authorId: a.id().required(),
      author: a.belongsTo('Author', 'authorId'),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated('identityPool').to(['read']),
    ]),
  LinkSuggestion: a
    .model({
      url: a.string(),
      comment: a.string(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['create']),
      allow.owner(),
      allow.group('admins')
    ]),

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam'
  }
});


/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: posts } = await client.models.Post.list()

// return <ul>{posts.map(post => <li key={post.title}>{post.title} - {post.content}</li>)}</ul>

