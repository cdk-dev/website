import React, { ReactElement } from "react"
import {
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/client-dynamodb"

import Nav from "../components/Nav"
import Layout from "../components/Layout"
import CreateContent from "../components/CreateContent"
import Newsletter from "../components/Newsletter"

const ddbClient = new DynamoDBClient({ region: "us-east-1" })

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

  const params: ScanCommandInput = {
    TableName: "TestSlackDB",
  }

  const data = await ddbClient.send(new ScanCommand(params))

  // Get and transform non-thread messages
  const nonThreadmessages = data.Items.filter(
    (item) => Number(item.thread_ts.N) === 0
  ).map<Message>((item) => {
    return {
      channelName: item.channel_name?.S ?? "no channel name",
      author: item.user?.S,
      timestamp: Number(item.ts?.N),
      text: item.text?.S,
    }
  })

  // Get and transform thread messages
  const parentThreadMessages = data.Items.filter(
    (item) => Number(item.ts.N) === Number(item.thread_ts.N)
  )

  const threadMessages = parentThreadMessages.map<Message>((parentThreadMessage) => {
    // Get children messages
    const childrenThreadMessages = data.Items.filter(
      (item) =>
        Number(parentThreadMessage.ts.N) === Number(item.ts.N) &&
        Number(item.thread_ts.N) !== Number(item.ts.N)
    ).map<ThreadMessage>((childThreadMessage) => {
      return {
        author: childThreadMessage.user?.S,
        timestamp: Number(childThreadMessage.ts?.N),
        text: childThreadMessage.text?.S,
      }
    })
    return {
      channelName: parentThreadMessage.channel_name?.S ?? "no channel name",
      author: parentThreadMessage.user?.S,
      timestamp: Number(parentThreadMessage.ts?.N),
      text: parentThreadMessage.text?.S,
      thread: childrenThreadMessages,
    }
  })

  const archiveMessages = [...nonThreadmessages, ...threadMessages]

  return { props: { archiveMessages } }
}

interface Message {
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
