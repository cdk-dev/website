import React, { ReactElement } from "react"
import { Link } from "gatsby"

function Footer(): ReactElement {
  return (
    <footer className="bg-gray-900 text-gray-100 p-8">
      {/* Links */}
      <div className="container mx-auto px-4">
        <div className="flex flex-row mb-8">
          <div className="flex flex-col flex-1">
            <h3 className="text-gray-600 mb-2">Navigation</h3>
            <Link to="/">Home</Link>
            <Link to="/tools">Tools</Link>
            <a href="https://www.cdkday.com/">CDK Day 2020</a>
          </div>

          <div className="flex flex-col flex-1">
            <h3 className="text-gray-600 mb-2">Links</h3>
            <a href="https://github.com/cdk-dev">GitHub</a>
            <a href="https://join.slack.com/t/cdk-dev/shared_invite/zt-gff3dtkw-MsEPa5Id1Aey8HQUDEck1Q">
              Slack
            </a>
            <a href="https://twitter.com/cdk-dev">Twitter</a>
          </div>

          <div className="flex flex-col flex-1">
            <h3 className="text-gray-600 mb-2">Frameworks</h3>
            <a href="https://aws.amazon.com/cdk/">AWS CDK</a>
            <a href="https://cdk8s.io">CDK8s</a>
            <a href="https://cdk.tf">Terraform CDK</a>
          </div>

          <div className="flex-1"></div>
        </div>

        <div className="text-gray-500">
          <a
            href="https://github.com/cdk-dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Made with{" "}
            <span role="img" aria-label="Green Heart Emoji">
              💚
            </span>{" "}
            by cdk.dev Community
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
