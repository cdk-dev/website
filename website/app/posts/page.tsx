import React, { ReactElement } from "react"

import Nav from "@/components/Nav"
import Layout from "@/components/Layout"
import Post from "@/components/Post"
import CreateContent from "@/components/CreateContent"
import Newsletter from "@/components/Newsletter"

function Posts(): ReactElement {
    const posts = [
        { id: 1, title: "Post 1", content: "Content 1", categories: ["Category1", "Category2"], author: {name: "Author 1", avatar: "Avatar1.png"} },
        { id: 2, title: "Post 2", content: "Content 2", categories: ["Category3", "Category4"], author: {name: "Author 2", avatar: "Avatar2.png"} },
        { id: 3, title: "Post 3", content: "Content 3", categories: ["Category5", "Category6"], author: {name: "Author 3", avatar: "Avatar3.png"} },
      ]
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