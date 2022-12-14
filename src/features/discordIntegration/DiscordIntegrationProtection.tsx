import { ReactNode } from "react"
import { useIntegratedUserContext } from "./IntegratedUserContext"

export type DiscordIntegrationProtectionProps = {
  children: ReactNode
  fallback?: ReactNode
}

export default function DiscordIntegrationProtection({ children, fallback }:DiscordIntegrationProtectionProps) {
  const ctx = useIntegratedUserContext()

  return <>{ctx.user ? children : fallback}</>
}
