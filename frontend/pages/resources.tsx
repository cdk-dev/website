import React, { ReactElement } from "react"

import Nav from "../components/Nav"
import Layout from "../components/Layout"
import queryGraphql from "../graphql"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import relativeTime from "dayjs/plugin/relativeTime"
import CreateContent from "../components/CreateContent"
import Newsletter from "../components/Newsletter"
import { gql } from '@apollo/client';

dayjs.extend(relativeTime) // For fromNow()
dayjs.extend(utc) // From Timezone
dayjs.extend(timezone)

function Resource({ resource }): ReactElement {
  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
      <img
        className="h-48 w-full object-cover"
        src={resource.image}
        alt="foo"
      />
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <div className="flex-shrink-0"></div>
          <a href={resource.url} className="block">
            <h3 className="mt-2 text-xl leading-7 font-semibold text-gray-900">
              {resource.title}
            </h3>
            <p className="mt-3 text-base leading-6 text-gray-500">
              {resource.teaser}
            </p>
          </a>
        </div>

        <div className="mt-6 flex items-center">
          <div className="">
            <div className="flex text-sm leading-5 text-gray-500">
              <a href={resource.url}>{resource.hostname}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Tools({ resources }): ReactElement {
  return (
    <Layout>
      <Nav title="Resources" />

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              CDK Resources
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 text-gray-900">
            <div className="px-4 py-6 sm:px-0">
              <p className="mb-8">
                This is a collection of tools to help during the development of
                CDK applications.
              </p>
            </div>

            <div className="mt-0 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
              {resources.map((resource) => (
                <Resource key={resource.id} resource={resource} />
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

export default Tools

export async function getStaticProps() {
    const { space } = await queryGraphql(gql`
    query {
      space(slug: "cdk-dev/resources") {
        id
        public
        slug
        description
        elements(limit: 3) {
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
  `)

  const resources = space.elements.map((element) => ({
    summary: element.link.summary,
    url: element.link.url,
    hostname: new URL(element.link.url).hostname,
    createdAt: element.link.insertedAt,
    image: element.link.ogImage,
  }))

  return { props: { resources } }
}
