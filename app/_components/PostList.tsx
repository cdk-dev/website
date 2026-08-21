'use client'

import { useState, useTransition } from 'react'
import Post from './Post'
import { fetchMostRecentPosts } from '@/app/_actions/actions'

type Post = {
  id: string
  title: string
  content: string
  createdAt: string
  author: {
    did: string
    name: string
    avatar: string
    handle: string
  }
  engagement: {
    replies: number
    reposts: number
    likes: number
    quotes: number
  }
  embed?: any
  facets?: any
}

type PostListProps = {
  initialPosts: Post[]
  initialCursor?: string
}

export default function PostList({ initialPosts, initialCursor }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [cursor, setCursor] = useState<string | undefined>(initialCursor)
  const [isPending, startTransition] = useTransition()
  const [hasMore, setHasMore] = useState(true)

  console.log(cursor, posts.length)

  async function loadMore(formData: FormData) {
    startTransition(async () => {
      const currentCursor = formData.get('cursor') as string
      const data = await fetchMostRecentPosts(12, currentCursor)

      if (data.posts.length === 0) {
        setHasMore(false)
        return
      }

      setPosts((prevPosts: Post[]) => {
        const newPosts = data.posts.filter(
          (newPost) => !prevPosts.some((existingPost: Post) => existingPost.id === newPost.id)
        )
        return [...prevPosts, ...newPosts]
      })

      setCursor(data.cursor)
      if (!data.cursor) {
        setHasMore(false)
      }
    })
  }

  return (
    <>
      <div className="mt-0 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
        {posts.map((post: Post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>

      {hasMore && cursor && (
        <div className="flex justify-center mt-8">
          <form action={loadMore}>
            <input type="hidden" name="cursor" value={cursor} />
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {isPending ? 'Loading...' : 'Load More'}
            </button>
          </form>
        </div>
      )}
    </>
  )
}