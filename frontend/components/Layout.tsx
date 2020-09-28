import React, { ReactElement } from "react"
import Footer from "./Footer"
import Head from "next/head"

export default ({ children, url }): ReactElement => (
  <>
    <Head>
      <title>cdk.dev</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@cdkdev_" />
      <meta name="og:title" content="cdk.dev" />
      <meta
        name="og:description"
        content="The community driven hub around the Cloud Development Kit (CDK) ecosystem. This site brings together all the latest blogs, videos, and educational content. Connect with the community of AWS CDK, CDK for Kubernetes (cdk8s) and CDK for Terraform (cdktf)."
      />
      <meta name="og:image" content={`${url}/og.png`}></meta>
    </Head>
    <div className="min-h-screen bg-white">
      {children}
      <Footer />
    </div>
  </>
)

export async function getStaticProps() {
  return {
    props: { url: process.env.DEPLOY_PRIME_URL || "http://localhost:3000" },
  }
}
