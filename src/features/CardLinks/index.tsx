import { IconType } from "react-icons/lib"
import { ReactNode } from "react"
import { CSSProperties } from "@lib/theming/types"
import cn from "@lib/theming/createClassName"
import { createStylesHook } from "@fet/theming"
import Link from "@fet/controls/Link"
import Button from "@fet/controls/Button"

export type CardLinkProps = {
  className?: string
  href?: string
  icon?: IconType
  children?: ReactNode
  body?: ReactNode
  disabled?: boolean
  color?: string
  onClick?: () => void
}

export default function CardLink({ children, body, className, icon:Icon, color, disabled, href, onClick }:CardLinkProps) {
  children ||= body

  const [ classes ] = useStyles()

  const fullClassname = cn(
    disabled && classes.isDisabled,
    classes.linkCard,
    className,
  )

  if (onClick) return (
    <Button variant="clean" className={fullClassname} style={{ "--color":color } as CSSProperties} onClick={onClick}>
      {Icon && <Icon className={classes.icon} color={color} />}
      {children}
    </Button>
  )

  if (href) return (
    <Link className={fullClassname} style={{ "--color":color } as CSSProperties} to={href}>
      {Icon && <Icon className={classes.icon} color={color} />}
      {children}
    </Link>
  )

  return (
    <div className={fullClassname} style={{ "--color":color } as CSSProperties}>
      {Icon && <Icon className={classes.icon} color={color} />}
      {children}
    </div>
  )
}

const useStyles = createStylesHook(({
  linkCard: {
    display: `flex`,
    gap: 10,
    alignItems: `center`,
    padding: 10,
    paddingRight: 20,
    backgroundColor: `#0005`,
    color: `inherit`,
    textDecoration: `none`,
    transition: `color 0.2s`,
    width: `max-content`,

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

  isDisabled: {
    opacity: 0.2,
  },
}) )
