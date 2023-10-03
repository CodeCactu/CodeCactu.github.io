import { ReactNode } from "react"
import { createStylesHook } from "@fet/theming"
import CactuBlinkingLines from "@fet/dynamicBackgrounds/CactuBlinkingLines"
import MainNav from "./MainNav"

export type MainLayoutProps = {
  children: ReactNode
}

export default function MainLayout({ children }:MainLayoutProps) {
  const [ classes ] = useStyles()

  return (
    <>
      <CactuBlinkingLines className={classes.background} />

      <MainNav />

      {children}
    </>
  )
}

const useStyles = createStylesHook( ({ atoms }) => ({
  "@global": {
    "*": {
      boxSizing: `border-box`,
    },

    "#__next": {
      display: `grid`,
      minHeight: `100vh`,

      "& > *": {
        minHeight: `auto`,
      },
    },

    body: {
      margin: 0,
    },
  },

  background: {
    position: `absolute`,
    top: 0,
    left: 0,
    width: `100%`,
    height: `100dvh`,
    background: atoms.colors.background.main,
    zIndex: -1,
  },
}) )
