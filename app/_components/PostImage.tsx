import { ReactElement } from 'react'

interface PostImageProps {
  postTitle: string;
  postKey: string | null;
}

function PostImage({ postTitle, postKey }: PostImageProps): ReactElement {
  if (!postKey) {
    return (
      <div className="h-48 w-full bg-gray-200" />
    )
  }

  return (
    <div className="h-48 w-full relative">
      <img
        className="w-full h-full object-cover absolute"
        src={postKey}
        alt={postTitle}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

export default PostImage