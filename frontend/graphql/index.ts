import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

// Create an HTTP link to the Absinthe server.
const link = new HttpLink({
  uri: "https://www.hekto.co/graphql"
});

// Apollo also requires you to provide a cache implementation
// for caching query results. The InMemoryCache is suitable
// for most use cases.
const cache = new InMemoryCache();

// Create the client.
const client = new ApolloClient({
  link,
  cache
});

export default async (query: string, variables: any) => {
  const response = await client.query({
    query,
    variables
  });
  return response.data;
}