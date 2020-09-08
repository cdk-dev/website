import Nav from "../components/Nav"
import Layout from "../components/Layout"

export default () => (
  <Layout>
    <section className="flex-grow homescreen m-0 px-4 flex flex-col w-screen justify-center bg-gray-800 text-gray-100 ">
      <Nav title="Home" />

      <h1 className="text-6xl my-auto mx-auto  md:mx-48 ">
        We're just{" "}
        <a href="https://dev.to/skorfmann/cdk-dev-call-for-contributors-4c46">
          getting started
        </a>
        .<br />
        <span className="text-teal-400">
          <a href="https://github.com/cdk-dev/base">You can contribute</a>
        </span>
        <br />
        and
        <span className="text-teal-400">
          <a
            className="ml-4"
            href="https://join.slack.com/t/cdk-dev/shared_invite/zt-gff3dtkw-MsEPa5Id1Aey8HQUDEck1Q"
          >
            join our Slack
          </a>
        </span>
        or
        <span className="text-teal-400">
          <a className="ml-4 mr-4"
              href="https://discord.gg/Y4Yc26p"
          >Discord</a>
        </span>
      </h1>
    </section>
  </Layout>
)