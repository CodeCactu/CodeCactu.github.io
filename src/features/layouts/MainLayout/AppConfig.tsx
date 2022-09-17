import { ReactNode } from "react"
import ThemeProvider from "@lib/theming/ThemeProvider"
import { themeConfig } from "@fet/theming"

export type AppConfigProps = {
  children: ReactNode
}

export default function AppConfig({ children }:AppConfigProps) {
  return (
    <ThemeProvider themeConfig={themeConfig}>
      {children}
    </ThemeProvider>
  )
}
