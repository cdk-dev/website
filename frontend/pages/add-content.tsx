import React, { ReactElement } from "react"

import Nav from "../components/Nav"
import Layout from "../components/Layout"
import queryGraphql from "../graphql"
import Post from "../components/Post"
import CreateContent from "../components/CreateContent"

function Posts({ posts }): ReactElement {
  return (
    <Layout>
      <Nav title="Add Content" />

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Add Content
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 text-gray-900">
            <div className="px-4 py-6 sm:px-0">
              <p className="mb-8">
                Add a link to your blog post, tutorial, live stream, project or whatever you might have created which relates to the Cloud Developemnt Kit ecosystem. Share it with the community.
              </p>
            </div>

            <div className="mt-0 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
            <div>
              <label htmlFor="url" className="block text-sm font-medium leading-5 text-gray-700">URL</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input id="url" className="form-input block w-full sm:text-sm sm:leading-5" placeholder="https://yourwebsite.com/blog/post-1"/>
              </div>
            </div>
            </div>
          </div>
        </main>
      </div>

      <CreateContent />
    </Layout>
  )
}

export default Posts
