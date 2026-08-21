import React, { ReactElement } from "react"
import Link from 'next/link'

function CreateContent(): ReactElement {
  return (
    <>
      <div className="bg-gray-50">
        <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <h2 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 text-center">
            Share Your CDK Content
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Have you created or discovered interesting CDK content? Share it with the community by tagging @cdk.dev on Bluesky. We&apos;ll quote your post and automatically publish it on this site. You can{' '}
            <Link
              href="https://bsky.app/intent/compose?text=Check%20out%20my%20CDK%20content!%20%23aws-cdk%20%2Fcc%20%40cdk.dev"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              start a new post
            </Link>
            {' '}or see an example below:
          </p>
          <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-800 font-medium">
              Just published a new blog post about using CDK to deploy serverless applications! Check it out here: [link]
              <br/><br/>
              #aws-cdk #infrastructure
              <br/>
              /cc @cdk.dev
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateContent
