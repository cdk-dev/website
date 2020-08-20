import React, { ReactElement } from "react"
import { Link } from "gatsby"

export interface NavProps {
  title?: string
}

function Nav({ title }: NavProps): ReactElement {
  const pageTitle = title || ""

  return (
    <div className="px-10 flex flex-row justify-between p-4 bg-gray-800 text-gray-100">
      <div className="flex flex-row">
        <div className="mr-8">
          <Link to="/">cdk.dev</Link>
        </div>

        {pageTitle && (
          <>
            <div className="mr-8 text-gray-700">/</div>
            <div>{pageTitle}</div>
          </>
        )}
      </div>

      <nav>
        <ul className="flex">
          <li className="mr-4">
            <Link to="/tools">Tools</Link>
          </li>
          <li>
            <a href="https://cdkday.com">
              CDK Day{" "}
              <span role="img" aria-label="Party Popper Emoji">
                🎉
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Nav
