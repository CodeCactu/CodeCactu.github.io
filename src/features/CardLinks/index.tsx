import { ReactNode } from "react"
import { Link } from "gatsby"
import cn from "@lib/theming/createClassName"
import { createStylesHook } from "@fet/theming"

export type CardLinkProps = {
  className?: string
  children: ReactNode
}

export default function CardLink({ className, children }:CardLinkProps) {
  const [ classes ] = useStyles()

  return (
    <Link className={cn( classes.linkCard, className )} to="#">{children}</Link>
  )
}

const useStyles = createStylesHook({
  linkCard: {
    display: `block`,
    padding: `10px`,
    backgroundColor: `#0005`,
  },
})
