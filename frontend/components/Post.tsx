import { ReactElement } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime) // For fromNow()
dayjs.extend(utc) // From Timezone
dayjs.extend(timezone)

function Post({ post }): ReactElement {
  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
      <div className="flex-shrink-0">
        <a href={post.url}>
          <img
            className="h-48 w-full object-cover"
            src={post.image}
            alt="foo"
          />
        </a>
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <a href={post.url} className="block">
            <h3 className="mt-2 text-xl leading-7 font-semibold text-gray-900">
              {post.title}
            </h3>
            <p className="mt-3 text-base leading-6 text-gray-500">
              {post.summary}
            </p>
          </a>
        </div>
        <div className="mt-6 flex items-center">
          <div className="ml-0">
            <div className="flex text-sm leading-5 text-gray-500">
              added&nbsp;
              <time dateTime={dayjs(post.createdAt).format("YYYY-MM-DD HH:mm")}>
                {dayjs(post.createdAt).fromNow()}
              </time>
              <span className="mx-1">&middot;</span>
              <a href={post.url}>{post.hostname}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
