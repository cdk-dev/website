import { ReactElement } from "react";
import Link from "next/link";

interface HostnameLinkProps {
  url: string;
}

function HostnameLink({ url }: HostnameLinkProps): ReactElement {
  const hostname = new URL(url).hostname;
  return (
    <Link href={url}>
      {hostname}
    </Link>
  );
}

export default HostnameLink;