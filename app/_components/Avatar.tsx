import Image from 'next/image'
import { ReactElement } from 'react'

interface AvatarProps {
  avatarKey: string;
}

function Avatar({ avatarKey }: AvatarProps): ReactElement {
  return (
    <span className="inline-block h-10 w-10 rounded-full overflow-hidden">
      <Image
        className="h-full w-full object-cover"
        src={avatarKey}
        alt="Author avatar"
        width={40}
        height={40}
      />
    </span>
  )
}

export default Avatar