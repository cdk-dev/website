import { gql, makeExecutableSchema } from "apollo-server-micro"
import { posts, users } from "./data"

const typeDefs = gql`
  type Query {
    posts: [Post!]!
    recentPosts(limit: Int = 3): [Post!]!
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
`

const resolvers = {
  Query: {
    posts() {
      return posts
    },

    recentPosts(_parent, args) {
      const orderedPosts = posts.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      return orderedPosts.slice(0, args.limit)
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
