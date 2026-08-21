'use server'

import { XRPC, CredentialManager } from '@atcute/client';
import '@atcute/bluesky/lexicons';

type BlueskyFacet = {
  index: {
    byteStart: number;
    byteEnd: number;
  };
  features: Array<{
    $type: string;
    tag?: string;
    uri?: string;
  }>;
};

type BlueskyFeedItem = {
  post: {
    uri: string;
    record: {
      text: string;
      createdAt: string;
      facets?: BlueskyFacet[];
      embed?: {
        $type: string;
        images?: { alt: string; image: { ref: { $link: string } }; }[];
        external?: {
          uri: string;
          title: string;
          description: string;
          thumb?: {
            $type: string;
            ref: { $link: string };
            mimeType: string;
          };
        };
      };
    };
    author: {
      did: string;
      handle: string;
      displayName: string;
      avatar: string;
    };
    replyCount: number;
    repostCount: number;
    likeCount: number;
    quoteCount: number;
  };
};

type FeedResponse = {
  cursor?: string;
  feed: BlueskyFeedItem[];
};

export const fetchBlueskyPosts = async (limit: number = 20, cursor?: string) => {
  const manager = new CredentialManager({ service: 'https://public.api.bsky.app' });
  const rpc = new XRPC({ handler: manager });

  try {
    const response = await rpc.get('app.bsky.feed.getAuthorFeed', {
      params: {
        actor: 'cdk.dev',
        limit: Math.min(limit, 100),
        cursor,
        filter: 'posts_no_replies'
      }
    }) as { data: FeedResponse };

    console.log('Fetched posts count:', response.data.feed.length);
    console.log('Next cursor:', response.data.cursor);

    return {
      posts: response.data.feed.map((item) => ({
        id: item.post.uri,
        title: '',
        content: item.post.record.text,
        createdAt: item.post.record.createdAt,
        author: {
          did: item.post.author.did,
          name: item.post.author.displayName,
          avatar: item.post.author.avatar,
          handle: item.post.author.handle
        },
        engagement: {
          replies: item.post.replyCount,
          reposts: item.post.repostCount,
          likes: item.post.likeCount,
          quotes: item.post.quoteCount
        },
        embed: item.post.record.embed,
        facets: item.post.record.facets
      })),
      cursor: response.data.cursor
    };
  } catch (error) {
    console.error('Error fetching Bluesky posts:', error);
    return { posts: [], cursor: undefined };
  }
};

export const fetchMostRecentPosts = async (limit: number = 20, cursor?: string) => {
  return fetchBlueskyPosts(limit, cursor);
};