import { gql, makeExecutableSchema } from "apollo-server-micro"

const typeDefs = gql`
  type Query {
    posts: [Post!]!
  }

  type User {
    name: String
    username: String
  }

  type Post {
    title: String
    excerpt: String
    url: String
    author: User
  }
`

interface User {
  name: string
  username: string
}

const users: User[] = [
  { name: "Leeroy Jenkins", username: "leeroy" },
  { name: "Foo Bar", username: "foobar" },
]

interface Post {
  title: string
  excerpt: string
  url: string
  authorId: string
}

const posts: Post[] = [
  {
    title: "Foo",
    excerpt: "bar",
    url: "https://foo.bar",
    authorId: "1",
  },
  {
    title: "Foo",
    excerpt: "baz",
    url: "https://foo.baz",
    authorId: "2",
  },
]

const resolvers = {
  Query: {
    posts() {
      return posts
    },
  },
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })
