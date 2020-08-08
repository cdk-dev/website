import React, { ReactElement, useState } from "react"

interface Props {}

function Index({}: Props): ReactElement {
  const [isMenuOpen, setMenuOpen] = useState(false)
  return (
    <>
      <section
        class="homescreen m-0 flex flex-col w-screen justify-center bg-gray-800 h-screen text-gray-100 "
      >
        <nav>
          <ul class="flex justify-between text-xl py-8 px-8 md:px-48 ">
            <li>
              cdk.dev
            </li>
            <li>
              <a href="https://github.com/cdk-dev" target="_blank" rel="noopener noreferrer">Made with 💚 by cdk.dev Team</a>
            </li>
          </ul>
        </nav>
        <h1 class="text-6xl my-auto mx-auto  md:mx-48 ">
          We're just getting started.<br />
          <span class="text-teal-400"><a href="https://github.com/cdk-dev/website">You can contribute!</a></span>
        </h1>
      </section>
    </>
  )
}

export default Index
