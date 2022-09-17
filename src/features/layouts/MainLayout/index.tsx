import { ReactNode } from "react"
import { createStylesHook } from "@fet/theming"
import BlinkingLinesBgr from "@fet/dynamicBackground/BlinkingLinesBgr"
import AppConfig from "./AppConfig"

export type MainLayoutProps = {
  children: ReactNode
}

function RealMainLayout({ children }:MainLayoutProps) {
  const [ classes ] = useStyles()

  return (
    <div className={classes.mainLayout}>
      <BlinkingLinesBgr />
      {children}
    </div>
  )
}

export default function MainLayout({ children }:MainLayoutProps) {
  return (
    <AppConfig>
      <RealMainLayout>
        {children}
      </RealMainLayout>
    </AppConfig>
  )
}

const useStyles = createStylesHook({
  "@global": {
    '@font-face': {
      fontFamily: `Coconut`,
      src: `url( /fonts/Coconut.ttf )`,
    },

    body: {
      backgroundColor: `#212226`,
      margin: 0,
    },
  },
  mainLayout: {
    minHeight: `100vh`,
  },
})
