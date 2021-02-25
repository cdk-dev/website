import Hero from "../components/Hero"
import Logos from "../components/Logos"
import Layout from "../components/Layout"
import queryGraphql from "../graphql"
import CreateContent from "../components/CreateContent"
import Post from "../components/Post"

const Index = ({ posts }) => (
  <Layout>
    <Hero />
    <Logos />
    <div className="relative bg-gray-50 pt-16 pb-4 px-4 sm:px-6 lg:pt-24 lg:pb-6 lg:px-8">
      <div className="absolute inset-0">
        <div className="bg-white h-1/3 sm:h-2/3"></div>
      </div>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl leading-9 tracking-tight font-extrabold text-gray-900 sm:text-4xl sm:leading-10">
            Recent Community Blog Posts
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl leading-7 text-gray-500 sm:mt-4">
            What's been talked about in the CDK ecosytem.{" "}
            <a className="italic underline" href="/posts">
              More...
            </a>
          </p>
        </div>
        <div className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
          {posts.map((post) => (
            <Post key={post.title} post={post} />
          ))}
        </div>
      </div>
    </div>
    <div className="bg-white">
      <div className="mx-auto py-12 px-4 max-w-screen-xl sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center">

          <h2 className="text-3xl leading-9 tracking-tight font-extrabold text-gray-900 sm:text-4xl sm:leading-10">
            Featured Contributors
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl leading-7 text-gray-500 pb-8 sm:mt-4">
            CDK.dev top contributors are chosen monthly by the community:</p>
          <ul className="text-left space-y-12 lg:grid lg:grid-cols-3 lg:items-start lg:gap-x-8 lg:gap-y-12 lg:space-y-0">
            <li>
              <div className="space-y-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0 lg:gap-8">
                <div className="relative h-0 pb-2/3 sm:pt-2/3">
                  <img className="absolute inset-0 object-cover h-full w-full shadow-lg rounded-lg" src="https://pbs.twimg.com/profile_images/954495772577402885/XYi3LKiO_400x400.jpg" alt="" />
                </div>
                <div className="sm:col-span-2">
                  <div className="space-y-4">
                    <div className="text-lg leading-6 font-medium space-y-1">
                      <h4>Thorsten Hoeger </h4>
                      <p className="text-base text-indigo-600">Cloud Evangelist, CEO @ Taimos GmbH</p>
                    </div>
                    <div className="text-base leading-7">
                      <p className="text-gray-500">AWS Community Hero - AWS, CDK, Serverless.</p>
                    </div>
                  </div>
                  <li>
                    <a href="https://twitter.com/hoegertn" className="text-gray-400 hover:text-gray-500 transition ease-in-out duration-150">
                      <span className="sr-only">Twitter</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </li>

                </div>

              </div>
            </li>
            <li>
              <div className="space-y-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0 lg:gap-8">
                <div className="relative h-0 pb-2/3 sm:pt-2/3">
                  <img className="absolute inset-0 object-cover h-full w-full shadow-lg rounded-lg" src="https://pbs.twimg.com/profile_images/1260277338488467456/dpaUtowG_400x400.jpg" alt="" />
                </div>
                <div className="sm:col-span-2">
                  <div className="space-y-4">
                    <div className="text-lg leading-6 font-medium space-y-1">
                      <h4>Matthew Bonig</h4>
                      <p className="text-base text-indigo-600">AWS consultant and Data Hero</p>
                    </div>
                    <div className="text-base leading-7">
                      <p className="text-gray-500">A technologist and love software development. </p>
                    </div>
                    <li>
                      <a href="https://twitter.com/mattbonig" className="text-gray-400 hover:text-gray-500 transition ease-in-out duration-150">
                        <span className="sr-only">Twitter</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    </li>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="space-y-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0 lg:gap-8">
                <div className="relative h-0 pb-2/3 sm:pt-2/3">
                  <img className="absolute inset-0 object-cover h-full w-full shadow-lg rounded-lg" src="https://pbs.twimg.com/profile_images/857486952790196228/C9EcWxUN_400x400.jpg" alt="" />
                </div>
                <div className="sm:col-span-2">
                  <div className="space-y-4">
                    <div className="text-lg leading-6 font-medium space-y-1">
                      <h4>Sebastian Korfmann</h4>
                      <p className="text-base text-indigo-600">Entrepreneurial Software Engineer</p>
                    </div>
                    <div className="text-base leading-7">
                      <p className="text-gray-500">Core Contributor to CDK.dev and Terraform CDK </p>
                    </div>
                  </div>
                  <li>
                    <a href="https://twitter.com/skorfmann" className="text-gray-400 hover:text-gray-500 transition ease-in-out duration-150">
                      <span className="sr-only">Twitter</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </li>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <CreateContent />
  </Layout>
)

export async function getStaticProps() {
  const { recentPosts } = await queryGraphql(`
    query {
      recentPosts(limit: 3) {
        title
        excerpt
        url
        image
        categories
        hostname
        createdAt
        author {
          id
          name
          avatar
        }
      }
    }
  `)
  return { props: { posts: recentPosts } }
}
export default Index;