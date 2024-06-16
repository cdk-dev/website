import { getUrl } from 'aws-amplify/storage/server';
import Image from 'next/image';
import { runWithAmplifyServerContext } from '@/utils/amplifyServerUtils';
import GeoPattern from "geopattern"

// Re-render this page every 60 minutes
export const revalidate = 60 * 60; // in seconds

export default async function PostImage({ postTitle, postKey }: { postTitle: string, postKey: string | null }) {
  try {
    if (!postKey) {
      const pattern = GeoPattern.generate(postTitle)
      const postImageUrl = pattern.toDataUri()
      return <Image
        src={postImageUrl}
        alt="Post Image"
        width={0}
        height={0}
        sizes="100vw"
        className="h-48 w-full object-cover"
      />
    }

    const postImageUrl = await runWithAmplifyServerContext({
      nextServerContext: null,
      operation: (contextSpec) =>
        getUrl(contextSpec, {
          path: postKey
        })
    });

    return (
      <Image
        src={postImageUrl.url.toString()}
        alt={postTitle}
        width={0}
        height={0}
        sizes="100vw"
        className="h-48 w-full object-cover"
      />
    );
  } catch (error) {
    console.error(error);
    return <p>Something went wrong...</p>;
  }
}