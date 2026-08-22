import { ReactElement } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import relativeTime from "dayjs/plugin/relativeTime"
import HostnameLink from "./HostnameLink"
import Link from "next/link"
import Avatar from "./Avatar"

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)

interface PostProps {
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {
      name: string;
      avatar: string;
      handle: string;
      did: string;
    };
    engagement: {
      replies: number;
      reposts: number;
      likes: number;
      quotes: number;
    };
    embed?: {
      $type: string;
      external?: {
        uri: string;
        title: string;
        description: string;
        thumb?: {
          ref: { $link: string };
        };
      };
      images?: { alt: string; image: { ref: { $link: string } } }[];
    };
    facets?: Array<{
      index: {
        byteStart: number;
        byteEnd: number;
      };
      features: Array<{
        $type: string;
        tag?: string;
        uri?: string;
      }>;
    }>;
  };
}

function Post({ post }: PostProps): ReactElement {
  const url = post.embed?.external?.uri || `https://bsky.app/profile/cdk.dev/post/${post.id.split('/').pop()}`;

  // Function to render text with facets
  const renderContent = (text: string, facets?: PostProps['post']['facets']) => {
    if (!facets?.length) return text;

    const segments: { text: string; type?: string; href?: string; className?: string }[] = [];
    let lastIndex = 0;

    facets.sort((a, b) => a.index.byteStart - b.index.byteStart).forEach(facet => {
      // Add text before the facet
      if (facet.index.byteStart > lastIndex) {
        segments.push({ text: text.slice(lastIndex, facet.index.byteStart) });
      }

      const feature = facet.features[0];
      const facetText = text.slice(facet.index.byteStart, facet.index.byteEnd);

      if (feature.$type === 'app.bsky.richtext.facet#tag') {
        segments.push({
          text: facetText,
          type: 'tag',
          className: 'text-blue-600 hover:underline',
          href: `https://bsky.app/search?q=${feature.tag}`
        });
      } else if (feature.$type === 'app.bsky.richtext.facet#link') {
        segments.push({
          text: facetText,
          type: 'link',
          className: 'text-blue-600 hover:underline',
          href: feature.uri
        });
      }

      lastIndex = facet.index.byteEnd;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      segments.push({ text: text.slice(lastIndex) });
    }

    return segments.map((segment, i) => {
      if (segment.type) {
        return (
          <a
            key={i}
            href={segment.href}
            className={segment.className}
            target="_blank"
            rel="noopener noreferrer"
          >
            {segment.text}
          </a>
        );
      }
      return <span key={i}>{segment.text}</span>;
    });
  };

  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
      {post.embed?.external?.thumb && (
        <div className="flex-shrink-0">
          <Link href={url}>
            <img
              className="h-48 w-full object-cover"
              src={`https://bsky.social/xrpc/com.atproto.sync.getBlob?did=${post.author.did}&cid=${post.embed.external.thumb.ref.$link}`}
              alt={post.embed.external.title || "Post thumbnail"}
            />
          </Link>
        </div>
      )}
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <h3 className="mt-2 text-xl leading-7 font-semibold text-gray-900 line-clamp-3">
            <Link href={url}>
              {post.embed?.external?.title || post.content.split('\n')[0]}
            </Link>
          </h3>
          <p className="mt-3 text-base leading-6 text-gray-500">
            {renderContent(post.content, post.facets)}
          </p>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <Link href={`https://bsky.app/profile/${post.author.handle}/post/${post.id.split('/').pop()}`}>
              <Avatar avatarKey={post.author.avatar} />
            </Link>
          </div>
          <div className="ml-3">
            <p className="text-sm leading-5 font-medium text-gray-900">
              <Link href={`https://bsky.app/profile/${post.author.handle}/post/${post.id.split('/').pop()}`} className="hover:underline">
                {post.author.name}
              </Link>
            </p>
            <div className="flex text-sm leading-5 text-gray-500">
              added&nbsp;
              <time dateTime={dayjs(post.createdAt).format("YYYY-MM-DD HH:mm")}>
                {dayjs(post.createdAt).fromNow()}
              </time>
              <span className="mx-1">&middot;</span>
              <HostnameLink url={url} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
