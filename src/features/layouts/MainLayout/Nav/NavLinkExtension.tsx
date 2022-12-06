import { ReactNode } from "react"
import { createStylesHook } from "@fet/theming"

export type NavLinkExtensionProps = {
  children?: ReactNode
  body?: ReactNode
}

export default function NavLinkExtension({ children, body }:NavLinkExtensionProps) {
  children ||= body

  const [ classes ] = useStyles()

  return (
    <div className={classes.navLinkExtension}>
      {children}
    </div>
  )
}

const useStyles = createStylesHook( ({ atoms }) => ({
  navLinkExtension: {
    position: `absolute`,
    left: `100%`,
    top: 10,
    bottom: 10,
    display: `flex`,
    alignItems: `center`,
    padding: 10,
    backgroundColor: atoms.colors.surface.main,
    color: atoms.colors.surface.text,

    [ atoms.breakpoints.tablet.mediaQueryMax ]: {
      display: `none`,
    },
  },
}) )
