import React, { ReactElement } from "react"

import Nav from "../components/Nav"
import Layout from "../components/Layout"
import queryGraphql from "../graphql"
import Post from "../components/Post"
import CreateContent from "../components/CreateContent"
import Newsletter from "../components/Newsletter"
import { gql } from '@apollo/client';

function Posts({ posts }): ReactElement {
  return (
    <Layout>
      <Nav title="Posts" />

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Posts
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 text-gray-900">
            <div className="px-4 py-6 sm:px-0">
              <p className="mb-8">
                This is a collection of posts, videos and similar content which
                has been published within the CDK ecosystem.
              </p>
            </div>

            <div className="mt-0 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
              {posts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          </div>
        </main>
      </div>

      <CreateContent />
      <Newsletter />
    </Layout>
  )
}

export default Posts

export async function getStaticProps() {
  const { space } = await queryGraphql(gql`
    query($slug: String!) {
      space(slug: $slug) {
        id
        public
        slug
        description
        elements(limit: 500) {
          link {
            summary
            updatedAt
            ogImage
            insertedAt
            url
          }
        }
      }
    }
  `, { slug: "cdk-dev/community" })

  // first 3 posts are featured
  const posts = space.elements.map((element) => ({
    summary: element.link.summary,
    url: element.link.url,
    hostname: new URL(element.link.url).hostname,
    createdAt: element.link.insertedAt,
    image: element.link.ogImage,
  }))

  return { props: { posts } }
}