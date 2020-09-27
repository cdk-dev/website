import { gql, makeExecutableSchema } from "apollo-server-micro"
import { posts } from "./data"

const typeDefs = gql`
  type Query {
    posts: [Post!]!
  }

  type User {
    name: String
    username: String
  }

  type Post {
    title: String!
    excerpt: String!
    url: String!
    hostname: String!
    author: User!
    image: String
    categories: [String!]
    createdAt: String!
  }
`

const resolvers = {
  Query: {
    posts() {
      return posts
    },
  },
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })
