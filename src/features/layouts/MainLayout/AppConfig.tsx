import { IconContext } from "react-icons/lib"
import { ReactNode } from "react"
import ThemeProvider from "@lib/theming/ThemeProvider"
import { themeConfig } from "@fet/theming"

export type AppConfigProps = {
  children: ReactNode
}

export default function AppConfig({ children }:AppConfigProps) {
  return (
    <IconContext.Provider value={{ color:`currentColor` }}>
      <ThemeProvider themeConfig={themeConfig}>
        {children}
      </ThemeProvider>
    </IconContext.Provider>
  )
}
