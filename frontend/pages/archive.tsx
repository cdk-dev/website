import React, { ReactElement } from "react"

import Nav from "../components/Nav"
import Layout from "../components/Layout"
import CreateContent from "../components/CreateContent"
import Newsletter from "../components/Newsletter"

function Archive({
  archiveMessages,
}: {
  archiveMessages: Message[]
}): ReactElement {
  return (
    <Layout>
      <Nav title="Archive" />

      <div className="py-10">
        <header>
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Posts
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto text-gray-900 max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <p className="mb-8">Archived messages.</p>
            </div>

            <div className="grid max-w-lg gap-5 mx-auto mt-0 lg:grid-cols-3 lg:max-w-none">
              {archiveMessages.map((archivedMessage) => {
                return JSON.stringify(archivedMessage)
              })}
            </div>
          </div>
        </main>
      </div>

      <CreateContent />
      <Newsletter />
    </Layout>
  )
}

export default Archive

export async function getStaticProps() {
  // https://api.slack.com/messaging/retrieving#pulling_threads

  // fetch messages and threads from database
  const archiveMessages: Message[] = [
    {
      // channelId: "1",
      channelName: "aws-cdk",
      author: "Matthew",
      timestamp: 1482960137,
      text: "hello world",
    },
    {
      // channelId: "2",
      channelName: "jobs",
      author: "Martin",
      timestamp: 1482960137, //  Wednesday, December 28, 2016 9:22:17 PM
      text: "need a job!",
      thread: [
        {
          author: "Matthew",
          timestamp: 1482960337,
          text: "I have carpenter position available",
        },
        {
          author: "John",
          timestamp: 1482960537,
          text: "McDonalds is looking as well",
        },
      ],
    },
  ]

  return { props: { archiveMessages } }
}

interface Message {
  // channelId: string
  channelName: string
  author: string
  timestamp: number
  text: string
  thread?: ThreadMessage[]
}

interface ThreadMessage {
  author: string
  text: string
  timestamp: number
}
