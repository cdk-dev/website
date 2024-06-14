import { ReactElement } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import relativeTime from "dayjs/plugin/relativeTime"
import Avatar from "./Avatar"
import PostImage from "./PostImage"
import HostnameLink from "./HostnameLink"
import Link from "next/link"

dayjs.extend(relativeTime) // For fromNow()
dayjs.extend(utc) // From Timezone
dayjs.extend(timezone)

interface PostProps {
  post: {
    url: string;
    title: string;
    excerpt: string;
    categories: string[];
    author: {
      avatar: string;
      name: string;
    };
    createdAt: string;
  };
}

function Post({ post }: PostProps): ReactElement {
  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
      <div className="flex-shrink-0">
        <Link href={post.url}>
          <PostImage
            postTitle={post.title}
            postKey={undefined}
          />
        </Link>
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <Link href={post.url} className="block">
            <h3 className="mt-2 text-xl leading-7 font-semibold text-gray-900">
              {post.title}
            </h3>
            <p className="mt-3 text-base leading-6 text-gray-500">
              {post.excerpt}
            </p>
          </Link>
        </div>
        <div>
          {post.categories.map((category, index) => (
            <span
              key={`${category}-${index}`}
              className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium leading-5 bg-indigo-100 text-indigo-800 mr-2"
            >
              {category}
            </span>
          ))}
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <Link href={post.url}>
              <Avatar
                avatarKey={post.author.avatar}
              />
            </Link>
          </div>
          <div className="ml-3">
            <p className="text-sm leading-5 font-medium text-gray-900">
              <Link href={post.url} className="hover:underline">
                {post.author.name}
              </Link>
            </p>
            <div className="flex text-sm leading-5 text-gray-500">
              added&nbsp;
              <time dateTime={dayjs(post.createdAt).format("YYYY-MM-DD HH:mm")}>
                {dayjs(post.createdAt).fromNow()}
              </time>
              <span className="mx-1">&middot;</span>
              <HostnameLink url={post.url} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
