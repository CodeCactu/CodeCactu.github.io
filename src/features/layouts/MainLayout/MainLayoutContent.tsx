import { ReactNode } from "react"
import isIntegrated from "@fet/discordIntegration/isIntegrated"
import { IntegratedUserContextProvider } from "@fet/discordIntegration/IntegratedUserContext"
import DiscordLinking from "@fet/discordIntegration/DiscordLinking"

export type MainLayoutProtection = `discord`
export type MainLayoutContentProps = {
  body: ReactNode
  protection?: MainLayoutProtection
}

export default function MainLayoutContent({ body, protection }:MainLayoutContentProps) {
  if (protection) switch (protection) {
    case `discord`: {
      if (!isIntegrated()) return <DiscordLinking />
      return <IntegratedUserContextProvider children={body} />
    }
  }

  return <>{body}</>
}
