import { gql, makeExecutableSchema } from "apollo-server-micro"
import { posts, users, resources } from "./data"

const typeDefs = gql`
  type Query {
    posts: [Post!]!
    recentPosts(limit: Int = 3): [Post!]!
    resources: [Resource!]!
    users: [User!]!
  }

  type User {
    id: ID!
    name: String
    avatar: String
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

  type Resource {
    id: ID!
    title: String!
    teaser: String!
    url: String!
    hostname: String!
    image: String
    categories: [String!]
    createdAt: String!
  }
`

const resolvers = {
  Query: {
    posts() {
      return posts.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
    },

    recentPosts(_parent, args) {
      const orderedPosts = posts.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      return orderedPosts.slice(0, args.limit)
    },

    resources() {
      return resources
    },

    users() {
      return users
    },
  },

  Post: {
    author(parent) {
      const authorId = parent.authorIds[0]
      return users.find((user) => user.id === authorId)
    },
  },
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })
