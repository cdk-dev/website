import React, { ReactElement } from "react"
import NavLink from "./NavLink"
import { useState } from "react"
import { Transition } from "@tailwindui/react"

export interface NavProps {
  title?: string
}

function Nav({ title }: NavProps): ReactElement {
  const pageTitle = title || ""
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <nav className="bg-white shadow">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex items-center flex-shrink-0">
                <a href="/" aria-label="Home">
                  <img
                    className="w-auto h-8 sm:h-10"
                    src="/cdkdevlogo.svg"
                    alt="cdk.dev"
                  />
                </a>
              </div>
              <div className="hidden sm:ml-6 sm:flex">
                <NavLink href="/" linkName="Home" />
                <NavLink href="/posts" linkName="Posts" />
                <NavLink href="/archive" linkName="Archive" />
                <NavLink href="/resources" linkName="Resources" />
                <NavLink href="/codeofconduct" linkName="Code of Conduct" />
                <NavLink href="https://github.com/cdk-dev" linkName="Github" />
                <NavLink href="https://cdkday.com" linkName="CDK Day" />
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button
                className="p-1 text-gray-400 transition duration-150 ease-in-out border-2 border-transparent rounded-full hover:text-gray-500 focus:outline-none focus:text-gray-500 focus:bg-gray-100"
                aria-label="Notifications"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                ></svg>
              </button>
              <div className="relative ml-3">
                <div>
                  <button
                    className="flex text-sm transition duration-150 ease-in-out border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300"
                    id="user-menu"
                    aria-label="User menu"
                    aria-haspopup="true"
                  ></button>
                </div>
              </div>
            </div>
            <div className="flex items-center -mr-2 sm:hidden">
              <button
                className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
                aria-label="Main menu"
                aria-expanded="false"
                onClick={() => setIsOpen(!isOpen)}
              >
                <svg
                  className="block w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className="hidden w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
        </div>
      </nav>

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
                    href="/"
                    className="block px-3 py-2 text-base font-medium text-gray-700 transition duration-150 ease-in-out rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50"
                    role="menuitem"
                  >
                    Home
                  </a>
                  <a
                    href="/posts"
                    className="block px-3 py-2 text-base font-medium text-gray-700 transition duration-150 ease-in-out rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50"
                    role="menuitem"
                  >
                    Posts
                  </a>
                  <a
                    href="/archive"
                    className="block px-3 py-2 mt-1 text-base font-medium text-gray-700 transition duration-150 ease-in-out rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50"
                    role="menuitem"
                  >
                    Archive
                  </a>
                  <a
                    href="/resources"
                    className="block px-3 py-2 mt-1 text-base font-medium text-gray-700 transition duration-150 ease-in-out rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50"
                    role="menuitem"
                  >
                    Resources
                  </a>
                  <a
                    href="/codeofconduct"
                    className="block px-3 py-2 mt-1 text-base font-medium text-gray-700 transition duration-150 ease-in-out rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50"
                    role="menuitem"
                  >
                    Code of Conduct
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
    </>
  )
}

export default Nav
