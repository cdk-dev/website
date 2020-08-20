import React, { ReactElement } from "react"

// Components
import Nav from "../components/Nav"
import Footer from "../components/Footer"

interface Props {}

interface ProjectProps {
  title: string
  description: string
  href: string
}

function Project({ title, href, description }: ProjectProps): ReactElement {
  return (
    <div className="rounded-lg bg-gray-900 mb-4 p-4 flex-1 m-2 flex flex-col items-start justify-between">
      <div className="flex-1 mb-8">
        <h3 className="text-2xl mb-4">{title}</h3>
        <p>{description}</p>
      </div>

      <a href={href}>
        <div className={`rounded-full bg-gray-700 inline-block px-4 py-2`}>
          View Project
        </div>
      </a>
    </div>
  )
}

const cdkDevBase = "https://github.com/cdk-dev"
const projects: ProjectProps[] = [
  {
    title: "Bump CDK",
    description: " Easily manage AWS CDK Dependencies ",
    href: `${cdkDevBase}/bump-cdk`,
  },
  {
    title: "Bump CDK (Github Action)",
    description: " GitHub Action for automating cdk version management",
    href: `${cdkDevBase}/bump-cdk-action`,
  },
  {
    title: "Create CDK App",
    description: "Create CDK apps from templates",
    href: `${cdkDevBase}/create-cdk-app`,
  },
]

function Tools(props: Props): ReactElement {
  return (
    <>
      <Nav title="Tools" />

      <section className="px-4 flex flex-col w-screen justify-start bg-gray-800 text-gray-100">
        <div className="p-6">
          <h1 className="text-6xl mb-2">CDK Dev Tools</h1>
          <p className="mb-8">
            This is a collection of tools to help during the development of CDK
            applications.
          </p>
        </div>

        <div className="flex flex-row mb-8">
          {projects.map(project => (
            <Project {...project} />
          ))}
        </div>

        <div className="p-8 flex flex-col">
          <h3 className="text-3xl mb-6 text-center">
            Want to contribute or learn more?
          </h3>

          <a href="https://github.com/cdk-dev" className="mx-auto mb-4">
            <div className={`rounded-full bg-gray-700 inline-block px-6 py-3`}>
              View on GitHub
            </div>
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Tools
