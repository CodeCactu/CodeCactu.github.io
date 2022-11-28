import { IconType } from "react-icons/lib"
import { ReactNode } from "react"
import { CSSProperties } from "@lib/theming/types"
import cn from "@lib/theming/createClassName"
import { createStylesHook } from "@fet/theming"
import Link from "@fet/controls/Link"

export type CardLinkProps = {
  className?: string
  to: string
  icon?: IconType
  children?: ReactNode
  body?: ReactNode
  color?: string
}

export default function CardLink({ children, body, className, icon:Icon, color, to }:CardLinkProps) {
  children ||= body

  const [ classes ] = useStyles()

  return (
    <Link className={cn( classes.linkCard, className )} style={{ "--color":color } as CSSProperties} to={to}>
      {Icon && <Icon className={classes.icon} color={color} />}
      {children}
    </Link>
  )
}

const useStyles = createStylesHook(({
  linkCard: {
    display: `flex`,
    gap: 10,
    alignItems: `center`,
    padding: 10,
    backgroundColor: `#0005`,
    color: `inherit`,
    textDecoration: `none`,
    transition: `color 0.2s`,

    "&:hover $icon": {
      scale: 1.2,
    },
    "&:hover": {
      color: `var( --color )`,
    },
  },
  icon: {
    width: 30,
    height: 30,
    transition: `scale 0.2s`,
  },
}) )
