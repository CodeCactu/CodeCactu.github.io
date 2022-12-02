import { ReactNode } from "react"
import cn from "@lib/theming/createClassName"
import { createStylesHook } from "@fet/theming"
import BlinkingLinesBgr from "@fet/dynamicBackground/BlinkingLinesBgr"
import Nav from "./Nav"
import MainLayoutContent, { MainLayoutProtection } from "./MainLayoutContent"
import AppConfig from "./AppConfig"

export type MainLayoutFlow = `row` | `column`
export type MainLayoutProps = {
  children: ReactNode
  protection?: MainLayoutProtection
  flow?: MainLayoutFlow
}

function RealMainLayout({ children, protection, flow }:MainLayoutProps) {
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
        <MainLayoutContent body={children} protection={protection} />
      </div>
    </div>
  )
}

export default function MainLayout({ children, protection, flow }:MainLayoutProps) {
  return (
    <AppConfig>
      <RealMainLayout protection={protection} flow={flow}>
        {children}
      </RealMainLayout>
    </AppConfig>
  )
}

const useStyles = createStylesHook( ({ atoms }) => ({
  "@global": {
    '@font-face': {
      fontFamily: `Coconut`,
      src: `url( /fonts/Coconut.ttf )`,
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
