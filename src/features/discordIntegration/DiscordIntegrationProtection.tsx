import { ReactNode } from "react"
import isIntegrated from "./isIntegrated"
import { IntegratedUserContextProvider } from "./IntegratedUserContext"
import DiscordLinking from "./DiscordLinking"

export type DiscordIntegrationProtectionProps = {
  children: ReactNode
}

export default function DiscordIntegrationProtection({ children }:DiscordIntegrationProtectionProps) {
  return isIntegrated() ? <IntegratedUserContextProvider children={children} /> : <DiscordLinking />
}
