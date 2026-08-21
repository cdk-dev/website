import React, { ReactElement } from "react"

function Newsletter(): ReactElement {
  return (
    <div className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center">
        <div className="lg:w-0 lg:flex-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl" id="newsletter-headline">
            Join our community on Bluesky
          </h2>
          <p className="mt-3 max-w-3xl text-lg leading-6 text-gray-300">
            Follow us for discussions, updates, and connect with fellow developers
          </p>
        </div>
        <div className="mt-8 lg:mt-0 lg:ml-8">
          <a
            href="https://bsky.app/profile/cdk.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center space-x-3 px-8 py-4 border-2 border-indigo-400 text-lg font-semibold rounded-xl text-white bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.05 13.05a6.75 6.75 0 1 1-8.1-8.1 6.75 6.75 0 0 1 8.1 8.1z"/>
            </svg>
            <span>Connect on Bluesky</span>
            <svg
              className="w-5 h-5 transform transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <p className="mt-4 text-sm text-gray-400 text-center lg:text-left">
            Join the conversation and never miss an update
          </p>
        </div>
      </div>
    </div>
  )
}

export default Newsletter