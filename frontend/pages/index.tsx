import Hero from "../components/Hero"
import Logos from "../components/Logos"
import Layout from "../components/Layout"
import queryGraphql from "../graphql"
import { ReactElement } from "react"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime) // For fromNow()
dayjs.extend(utc) // From Timezone
dayjs.extend(timezone)

function Post({ post }): ReactElement {
  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
      <div className="flex-shrink-0">
        <img className="h-48 w-full object-cover" src={post.image} alt="foo" />
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <div>
            {post.categories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium leading-5 bg-indigo-100 text-indigo-800 mr-2"
              >
                {category}
              </span>
            ))}
          </div>
          <a href={post.url} className="block">
            <h3 className="mt-2 text-xl leading-7 font-semibold text-gray-900">
              {post.title}
            </h3>
            <p className="mt-3 text-base leading-6 text-gray-500">
              {post.excerpt}
            </p>
          </a>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <a href={post.url}>
              <img
                className="h-10 w-10 rounded-full"
                src={post.author.avatar}
                alt=""
              />
            </a>
          </div>
          <div className="ml-3">
            <p className="text-sm leading-5 font-medium text-gray-900">
              <a href={post.url} className="hover:underline">
                {post.author.name}
              </a>
            </p>
            <div className="flex text-sm leading-5 text-gray-500">
              added&nbsp;
              <time dateTime={dayjs(post.createdAt).format("YYYY-MM-DD HH:mm")}>
                {dayjs(post.createdAt).fromNow()}
              </time>
              <span className="mx-1">&middot;</span>
              <a href={post.url}>{post.hostname}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ({ posts }) => (
  <Layout>
    <Hero />
    <Logos />

    <div className="relative bg-gray-50 pt-16 pb-4 px-4 sm:px-6 lg:pt-24 lg:pb-6 lg:px-8">
      <div className="absolute inset-0">
        <div className="bg-white h-1/3 sm:h-2/3"></div>
      </div>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl leading-9 tracking-tight font-extrabold text-gray-900 sm:text-4xl sm:leading-10">
            Recent Community Blog Posts
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl leading-7 text-gray-500 sm:mt-4">
            What's been talked about in the CDK ecosytem
          </p>
        </div>
        <div className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
          {posts.map((post) => (
            <Post key={post.title} post={post} />
          ))}
        </div>
      </div>
    </div>

    <div className="bg-gray-50">
      <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
          Created or seen other CDK related content?
          <br />
          <span className="text-indigo-600">Share it with the community</span>
        </h2>
        <div className="mt-8 flex lg:flex-shrink-0 lg:mt-0">
          <div className="inline-flex rounded-md shadow">
            <a
              href="https://github.com/cdk-dev/website/issues/new?assignees=&labels=content&template=content.md&title="
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
              Create Pull Request
            </a>
          </div>
        </div>
      </div>
    </div>
  </Layout>
)

export async function getStaticProps() {
  const { recentPosts } = await queryGraphql(`
    query {
      recentPosts(limit: 3) {
        title
        excerpt
        url
        image
        categories
        hostname
        createdAt
        author {
          id
          name
          avatar
        }
      }
    }
  `)
  return { props: { posts: recentPosts } }
}
