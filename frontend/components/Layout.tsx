import React, { ReactElement } from "react"
import Footer from './Footer'

export default ({ children }): ReactElement => (
  <>
    <div className="flex flex-col h-screen justify-between">
      { children }
      <Footer />
    </div>
  </>
)