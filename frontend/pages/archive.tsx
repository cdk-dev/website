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

  // fetch messages and threads from database
  // const archiveMessages: Message[] = [
  //   {
  //     // channelId: "1",
  //     channelName: "aws-cdk",
  //     author: "Matthew",
  //     timestamp: 1482960037,
  //     text: "hello world",
  //   },
  //   {
  //     // channelId: "2",
  //     channelName: "jobs",
  //     author: "Martin",
  //     timestamp: 1482960137, //  Wednesday, December 28, 2016 9:22:17 PM
  //     text: "need a job!",
  //     thread: [
  //       {
  //         author: "Matthew",
  //         timestamp: 1482960337,
  //         text: "I have carpenter position available",
  //       },
  //       {
  //         author: "John",
  //         timestamp: 1482960537,
  //         text: "McDonalds is looking as well",
  //       },
  //     ],
  //   },
  // ]

  const params: ScanCommandInput = {
    // Specify which items in the results are returned.
    // FilterExpression: "Subtitle = :topic AND Season = :s AND Episode = :e",
    // Define the expression attribute value, which are substitutes for the values you want to compare.
    // ExpressionAttributeValues: {
    //   ":topic": { S: "SubTitle2" },
    //   ":s": { N: "1" },
    //   ":e": { N: "2" },
    // },
    // Set the projection expression, which the the attributes that you want.
    // ProjectionExpression: "Season, Episode, Title, Subtitle",
    TableName: "TestSlackDB",
  }

  const data = await ddbClient.send(new ScanCommand(params))

  // .filter(item => Number(item.thread_ts.N) === 0)
  const archiveMessages = data.Items.map<Message>((item) => {
    return {
      channelName: item.channel_name.S,
      author: item.user.S,
      timestamp: Number(item.ts.N),
      text: item.text.S,
    }
  })

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
