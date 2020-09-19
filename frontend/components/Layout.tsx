import React, { ReactElement } from "react"
import Footer from './Footer'
import Head from 'next/head'

export default ({ children }): ReactElement => (
  <>
    <Head>
      <title>cdk.dev</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css"/>
    </Head>
    <div className="min-h-screen bg-white">
      { children }
      <Footer />
    </div>
  </>
)