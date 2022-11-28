import { ReactNode } from "react"
import { createStylesHook } from "@fet/theming"
import BlinkingLinesBgr from "@fet/dynamicBackground/BlinkingLinesBgr"
import Nav from "./Nav"
import MainLayoutContent, { MainLayoutProtection } from "./MainLayoutContent"
import AppConfig from "./AppConfig"

export type MainLayoutProps = {
  children: ReactNode
  protection?: MainLayoutProtection
}

function RealMainLayout({ children, protection }:MainLayoutProps) {
  const [ classes ] = useStyles()


  return (
    <div className={classes.mainLayout}>
      <BlinkingLinesBgr />

      <Nav />

      <div className={classes.content}>
        <MainLayoutContent body={children} protection={protection} />
      </div>
    </div>
  )
}

export default function MainLayout({ children, protection }:MainLayoutProps) {
  return (
    <AppConfig>
      <RealMainLayout protection={protection}>
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
}) )
