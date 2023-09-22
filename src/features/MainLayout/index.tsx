import { ReactNode } from "react"
import { createStylesHook } from "@fet/theming"

export type MainLayoutProps = {
  children: ReactNode
}

export default function MainLayout({ children }:MainLayoutProps) {
  const [ classes ] = useStyles()

  return (
    <>
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
      background: atoms.colors.background.main,

      "& > *": {
        minHeight: `auto`,
      },
    },

    body: {
      margin: 0,
    },
  },
}) )
