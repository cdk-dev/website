import React, { ReactElement } from "react"
import Link from "next/link"
import { useState } from "react"
import { Transition } from "@tailwindui/react"

export interface NavProps {
  title?: string
}

function HeroPattern(): ReactElement {
  return (
    <div className="hidden sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full">
      <div className="relative h-full max-w-screen-xl mx-auto">
        <svg
          className="absolute transform right-full translate-y-1/4 translate-x-1/4 lg:translate-x-1/2"
          width="404"
          height="784"
          fill="none"
          viewBox="0 0 404 784"
        >
          <defs>
            <pattern
              id="f210dbf6-a58d-4871-961e-36d5016a0f49"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="0"
                y="0"
                width="4"
                height="4"
                className="text-gray-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width="404"
            height="784"
            fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
          />
        </svg>
        <svg
          className="absolute transform left-full -translate-y-3/4 -translate-x-1/4 md:-translate-y-1/2 lg:-translate-x-1/2"
          width="404"
          height="784"
          fill="none"
          viewBox="0 0 404 784"
        >
          <defs>
            <pattern
              id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="0"
                y="0"
                width="4"
                height="4"
                className="text-gray-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width="404"
            height="784"
            fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)"
          />
        </svg>
      </div>
    </div>
  )
}

function Nav({ title }: NavProps): ReactElement {
  const pageTitle = title || ""
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="relative overflow-hidden bg-gray-50">
        <HeroPattern />
        <div className="relative pt-6 pb-12 sm:pb-16 md:pb-20">
          <div className="max-w-screen-xl px-4 mx-auto sm:px-6">
            <nav className="relative flex items-center justify-between sm:h-10 md:justify-center">
              <div className="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
                <div className="flex items-center justify-between w-full md:w-auto">
                  <a href="/" aria-label="Home">
                    <img
                      className="w-auto h-8 sm:h-10"
                      src="/cdkdevlogo.svg"
                      alt="cdk.dev"
                    />
                  </a>
                  <div className="flex items-center -mr-2 md:hidden">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
                      id="main-menu"
                      aria-label="Main menu"
                      aria-haspopup="true"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <svg
                        className="w-6 h-6"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex md:space-x-10">
                <a
                  href="/posts"
                  className="font-medium text-gray-500 transition duration-150 ease-in-out hover:text-gray-900"
                >
                  Posts
                </a>
                <a
                  href="/archive"
                  className="font-medium text-gray-500 transition duration-150 ease-in-out hover:text-gray-900"
                >
                  Archive
                </a>
                <a
                  href="/resources"
                  className="font-medium text-gray-500 transition duration-150 ease-in-out hover:text-gray-900"
                >
                  Resources
                </a>
                <a
                  href="/codeofconduct"
                  className="font-medium text-gray-500 transition duration-150 ease-in-out hover:text-gray-900"
                >
                  Code of Conduct
                </a>
                <a
                  href="https://github.com/cdk-dev"
                  className="font-medium text-gray-500 transition duration-150 ease-in-out hover:text-gray-900"
                >
                  Github
                </a>
                <a
                  href="https://cdkday.com"
                  className="font-medium text-gray-500 transition duration-150 ease-in-out hover:text-gray-900"
                >
                  CDK Day
                </a>
              </div>
            </nav>
          </div>

          <Transition
            show={isOpen}
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {(ref) => (
              <div
                ref={ref}
                className="absolute inset-x-0 top-0 p-2 transition origin-top-right transform md:hidden"
              >
                <div className="rounded-lg shadow-md">
                  <div
                    className="overflow-hidden bg-white rounded-lg shadow-xs"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="main-menu"
                  >
                    <div className="flex items-center justify-between px-5 pt-4">
                      <div>
                        <img
                          className="w-auto h-8"
                          src="/cdkdevlogo.svg"
                          alt="cdk.dev"
                        />
                      </div>
                      <div className="-mr-2">
                        <button
                          type="button"
                          onClick={() => setIsOpen(!isOpen)}
                          className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
                          aria-label="Close menu"
                        >
                          <svg
                            className="w-6 h-6"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="px-2 pt-2 pb-3">
                      <a
                        href="/posts"
                        className="block px-3 py-2 text-base font-medium text-gray-700 transition duration-150 ease-in-out rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50"
                        role="menuitem"
                      >
                        Posts
                      </a>
                      <a
                        href="/resources"
                        className="block px-3 py-2 mt-1 text-base font-medium text-gray-700 transition duration-150 ease-in-out rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50"
                        role="menuitem"
                      >
                        Resources
                      </a>
                      <a
                        href="https://github.com/cdk-dev"
                        className="block px-3 py-2 mt-1 text-base font-medium text-gray-700 transition duration-150 ease-in-out rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50"
                        role="menuitem"
                      >
                        Github
                      </a>
                      <a
                        href="https://cdkday.com"
                        className="block px-3 py-2 mt-1 text-base font-medium text-gray-700 transition duration-150 ease-in-out rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50"
                        role="menuitem"
                      >
                        CDK Day
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Transition>
          <main className="max-w-screen-xl px-4 mx-auto mt-10 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold leading-10 tracking-tight text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
                Welcome to cdk
                <span className="text-indigo-600">.dev</span>
              </h2>
              <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                The community driven hub around the Cloud Development Kit (CDK)
                ecosystem. This site brings together all the latest blogs,
                videos, and educational content. Connect with the community of
                AWS CDK, CDK for Kubernetes (cdk8s) and CDK for Terraform
                (cdktf).
              </p>

              <div className="max-w-md mx-auto mt-5 sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <a
                    href="https://join.slack.com/t/cdk-dev/shared_invite/zt-1mvwihbtu-DKhqC~KdwbO4rY837rAQRg"
                    className="flex items-center justify-center w-full px-8 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo md:py-4 md:text-lg md:px-10"
                  >
                    Join Slack
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default Nav
