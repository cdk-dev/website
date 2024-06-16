import { usePathname } from "next/navigation"
import Link from "next/link"

type Props = {
  href: string
  linkName: string
}

const NavLink = ({ href, linkName }: Props) => {
  const activeClassName = "border-indigo-500",
    inactiveClassName = "border-transparent"

  const pathname = usePathname()

  const linkClasses = `inline-flex items-center px-1 pt-1 border-b-2 ${
    pathname === href ? activeClassName : inactiveClassName
  } text-sm font-medium leading-5 text-gray-900 focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out`

  return (
    <Link href={href} className={linkClasses}>
      {linkName}
    </Link>
  )
}

export default NavLink