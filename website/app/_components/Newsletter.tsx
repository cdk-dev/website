
import React, { ReactElement } from "react"
import { subscribeToNewsletter } from "../_actions/actions"

function Newsletter(): ReactElement {
  return (
    <div className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center">
        <div className="lg:w-0 lg:flex-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl" id="newsletter-headline">
                  Get notified about new posts
            </h2>
            <p className="mt-3 max-w-3xl text-lg leading-6 text-gray-300">
              No spam, no noise. Just the latest posts.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:ml-8">
            <form action={subscribeToNewsletter} className="sm:flex">
              <label htmlFor="emailAddress" className="sr-only">Email address</label>
              <input id="emailAddress" name="email" type="email" autoComplete="email" required className="w-full px-5 py-3 border border-transparent placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white focus:border-white sm:max-w-xs rounded-md" placeholder="Enter your email"/>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
              <button type="submit" className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500">
                Subscribe
              </button>
              </div>
            </form>
            <div className="mt-3 text-sm text-gray-300">
              <div className="revue-form-footer">By subscribing, you agree to receive the latest posts from the CDK team.</div>
            </div>
          </div>
        </div>
      </div>

  )
}

export default Newsletter