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
              cdk.dev - <a href="https://aws.amazon.com/cdk/">AWS CDK</a>, <a href="https:/cdk.tf">Terraform CDK</a> and <a href="https://cdk8s.io">CDK8s</a>
            </li>
            <li>
              <a href="https://github.com/cdk-dev" target="_blank" rel="noopener noreferrer">Made with 💚 by cdk.dev Community</a>
            </li>
          </ul>
        </nav>
        <h1 class="text-6xl my-auto mx-auto  md:mx-48 ">
          We're just getting started.<br />
          <span class="text-teal-400"><a href="https://github.com/cdk-dev/base">You can contribute</a></span>
          <span class="ml-4">and<span class="text-teal-400"><a class="ml-4" href="https://join.slack.com/t/cdk-dev/shared_invite/zt-gff3dtkw-MsEPa5Id1Aey8HQUDEck1Q">join our Slack</a></span></span>
        </h1>
      </section>
    </>
  )
}

export default Index
