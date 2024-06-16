import { getUrl } from 'aws-amplify/storage/server';
import Image from 'next/image';
import { runWithAmplifyServerContext } from '@/utils/amplifyServerUtils';

// Re-render this page every 60 minutes
export const revalidate = 60 * 60; // in seconds

export default async function Avatar({ avatarKey }: { avatarKey: string }) {
  try {
    const avatarUrl = await runWithAmplifyServerContext({
      nextServerContext: null,
      operation: (contextSpec) =>
        getUrl(contextSpec, {
          path: avatarKey
        })
    });

    return (
      <Image
        src={avatarUrl.url.toString()}
        alt="Avatar Image"
        className="h-10 w-10 rounded-full"
        width={40}
        height={40}
      />
    );
  } catch (error) {
    console.error(error);
    return <p>Something went wrong...</p>;
  }
}