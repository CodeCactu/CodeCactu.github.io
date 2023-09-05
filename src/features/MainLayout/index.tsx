import { ReactNode } from "react"
import { createStylesHook } from "@fet/theming"

export type MainLayoutProps = {
  children: ReactNode
  className?: string
}

export default function MainLayout({ children, className }:MainLayoutProps) {
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
      background: `#333`,

      "& > *": {
        minHeight: `auto`,
      },
    },

    body: {
      margin: 0,
    },
  },
}) )
