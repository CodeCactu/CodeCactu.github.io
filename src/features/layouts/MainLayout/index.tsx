import { ReactNode } from "react"
import cn from "@lib/theming/createClassName"
import PopupsRoot from "@lib/Popup/components/PopupsRoot"
import { createStylesHook } from "@fet/theming"
import BlinkingLinesBgr from "@fet/dynamicBackground/BlinkingLinesBgr"
import Nav from "./Nav"
import AppConfig from "./AppConfig"

export type MainLayoutFlow = `row` | `column`
export type MainLayoutProps = {
  children: ReactNode
  flow?: MainLayoutFlow
}

function RealMainLayout({ children, flow }:MainLayoutProps) {
  const [ classes ] = useStyles()

  const contentFullClassName = cn(
    flow === `column` && classes.isColumn,
    classes.content,
  )

  return (
    <div className={classes.mainLayout}>
      <BlinkingLinesBgr />

      <Nav />

      <div className={contentFullClassName}>
        {children}
      </div>
    </div>
  )
}

export default function MainLayout({ children, flow }:MainLayoutProps) {
  return (
    <AppConfig>
      <PopupsRoot>
        <RealMainLayout flow={flow}>
          {children}
        </RealMainLayout>
      </PopupsRoot>
    </AppConfig>
  )
}

const useStyles = createStylesHook( ({ atoms }) => ({
  "@global": {
    '@font-face': {
      fontFamily: `Coconut`,
      src: `url( /fonts/Coconut.ttf )`,
    },

    "*": {
      boxSizing: `border-box`,
    },

    body: {
      margin: 0,
      backgroundColor: atoms.colors.background.main,
      backgroundImage: `linear-gradient( 135deg, ${atoms.colors.background.dark}, ${atoms.colors.background.light} )`,
      fontFamily: `sans-serif`,
    },
  },
  mainLayout: {
    display: `flex`,
    minHeight: `100vh`,
  },
  content: {
    position: `relative`,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
    flexGrow: 1,
  },
  isColumn: {
    flexDirection: `column`,
  },
}) )
