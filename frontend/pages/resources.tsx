import React, { ReactElement } from "react"

import Nav from "../components/Nav"
import Layout from "../components/Layout"

interface Props {}

interface ResourceProps {
    title: string
    description: string
    href: string
}

const Tabs = ({ color }) => {
    const [openTab, setOpenTab] = React.useState(1);
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full">
                    <ul
                        className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                        role="tablist"
                    >
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                                className={
                                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                    (openTab === 1
                                        ? "text-white bg-" + color + "-600"
                                        : "text-" + color + "-600 bg-gray")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(1);
                                }}
                                data-toggle="tab"
                                href="#link1"
                                role="tablist"
                            >
                                Typescript
              </a>
                        </li>
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                                className={
                                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                    (openTab === 2
                                        ? "text-white bg-" + color + "-600"
                                        : "text-" + color + "-600 bg-gray")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(2);
                                }}
                                data-toggle="tab"
                                href="#link2"
                                role="tablist"
                            >
                                Python
              </a>
                        </li>
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                                className={
                                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                    (openTab === 3
                                        ? "text-white bg-" + color + "-600"
                                        : "text-" + color + "-600 bg-gray")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(3);
                                }}
                                data-toggle="tab"
                                href="#link3"
                                role="tablist"
                            >
                                Java
              </a>
                        </li>
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                                className={
                                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                    (openTab === 4
                                        ? "text-white bg-" + color + "-600"
                                        : "text-" + color + "-600 bg-grey")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(4);
                                }}
                                data-toggle="tab"
                                href="#link4"
                                role="tablist"
                            >
                                .NET
              </a>
                        </li>
                    </ul>
                    <div className="relative flex flex-col min-w-0 break-words bg-gray w-full mb-6 shadow-lg rounded">
                        <div className="px-4 py-5 flex-auto">
                            <div className="tab-content tab-space">
                                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                                    <p>
                                        <div className="flex flex-row mb-8">
                                            {typescriptresources.map(project => (
                                                <Project {...project} />
                                            ))}
                                        </div>
                  </p>
                                </div>
                                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                                    <p>
                                        <div className="flex flex-row mb-8">
                                            {pythonresources.map(project => (
                                                <Project {...project} />
                                            ))}
                                        </div>
                  </p>
                                </div>
                                <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                                    <p>
                                        <div className="flex flex-row mb-8">
                                            {javaresources.map(project => (
                                                <Project {...project} />
                                            ))}
                                        </div>
                  </p>
                                </div>
                                <div className={openTab === 4 ? "block" : "hidden"} id="link4">
                                    <p>
                                        <div className="flex flex-row mb-8">
                                            {dotnetresources.map(project => (
                                                <Project {...project} />
                                            ))}
                                        </div>
                  </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


function Project({ title, href, description }: ResourceProps): ReactElement {
    return (
        <div className="rounded-lg bg-gray-900 mb-4 p-4 flex-1 m-2 flex flex-col items-start justify-between">
            <div className="flex-1 mb-8">
                <h3 className="text-2xl mb-4">{title}</h3>
                <p>{description}</p>
            </div>
            <a href={href}>
                <div className={`rounded-full bg-gray-700 inline-block px-4 py-2`}>
                    Visit
        </div>
            </a>
        </div>
    )
}

// Getting started:
const projects: ResourceProps[] = [
    {
        title: "AWS CDK Workshop",
        description: "Beginner AWS CDK workshop that build a serverless solution step-by-step. Supports all languages",
        href: `https://cdkworkshop.com/`,
    },
    {
        title: "Awesome CDK",
        description: "Awesome collection of useful links for the AWS-CDK",
        href: `https://github.com/kolomied/awesome-cdk`,
    },
    {
        title: "AWS CDK Examples",
        description: "Collection of code templates and example projects for the AWS CDK",
        href: `https://github.com/aws-samples/aws-cdk-examples`,
    },
    {
        title: "CDK Patterns",
        description: "Collection of CDK Patterns focused on serverless solutions and created with the Well Architected Framework in mind",
        href: `https://cdkpatterns.com/`,
    },
]
// Language specific resources:
// Typescript
const typescriptresources: ResourceProps[] = [
    {
        title: "Contribute to the AWS CDK (Video)",
        description: "Ever wondering how to create a pull request for AWS CDK? In this video, we'll walk you through all the primary steps to submit your first AWS CDK pull request",
        href: `https://youtu.be/OXQSSibrt-A`,
    },
    {
        title: "CDK Pipelines: Continuous delivery for AWS CDK applications",
        description: "Blogpost with step-by-step tutorial to create a pipeline in the AWS CDK",
        href: `https://aws.amazon.com/blogs/developer/cdk-pipelines-continuous-delivery-for-aws-cdk-applications/`,
    },
    {
        title: "Let's Check out CDK Pipelines (Video)",
        description: "Live coding a CDK CI/CD pipeline",
        href: `https://www.twitch.tv/videos/737014680`,
    },
    {
        title: "How to Create CDK Constructs",
        description: "Learn to create a JSII module, build and publish it. Create a secure S3 bucket and publish it to multiple languages ",
        href: `https://www.matthewbonig.com/2020/01/11/creating-constructs/`,
    },
]
// Python
const pythonresources: ResourceProps[] = [
    {
        title: "Enhanced CI/CD with AWS CDK (Video)",
        description: "AWS Online Tech Talk about CI/CD pipelines in AWS CDK with live demo and example code repo",
        href: `https://youtu.be/1ps0Wh19MHQ`,
    },
    {
        title: "Supercharging Your ECS Applications with the AWS CDK - AWS Online Tech Talks (Video)",
        description: "AWS Online Tech Talk: Learn how to deploy your containerized applications to ECS using the AWS CDK ",
        href: `https://youtu.be/NkI5yeMFRK8`,
    },
    {
        title: "AWS CDK Workshop",
        description: "Beginner AWS CDK workshop that build a serverless solution step-by-step. Supports all languages",
        href: `https://cdkworkshop.com/`,
    },
]
// Java
const javaresources: ResourceProps[] = [
    {
        title: "AWS CDK Workshop",
        description: "Beginner AWS CDK workshop that build a serverless solution step-by-step. Supports all languages",
        href: `https://cdkworkshop.com/`,
    },
]

// .net
const dotnetresources: ResourceProps[] = [
    {
        title: "AWS CDK Workshop",
        description: "Beginner AWS CDK workshop that build a serverless solution step-by-step. Supports all languages",
        href: `https://cdkworkshop.com/`,
    },
]

function Resources(props: Props): ReactElement {
    return (
        <Layout>
            <Nav title="Resources" />

            <section className="flex-grow px-4 flex flex-col w-screen justify-start bg-gray-800 text-gray-100">
                <div className="p-6">
                    <h1 className="text-6xl mb-2">CDK Resources</h1>
                    <p className="mb-8">
                        This is a collection of resources to help getting started with the AWS CDK. Here you find workshops, tutorials and live coding streams.
          </p>
                    <h1 className="text-4xl mb-2">Getting Started</h1>

                </div>
                {/*  Getting started resources: */}
                <div className="flex flex-row mb-8">
                    {projects.map(project => (
                        <Project {...project} />
                    ))}
                </div>
                    <h1 className="text-4xl mb-2">Resources per Language</h1>
                {/* Tabs contains all language specific content */}
                <>
                    <Tabs color="grey" />
                </>
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
        </Layout>
    )
}

export default Resources
