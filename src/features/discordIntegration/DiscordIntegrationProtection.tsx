import { ReactNode } from "react"
import isIntegrated from "./isIntegrated"

export type DiscordIntegrationProtectionProps = {
  children: ReactNode
  fallback?: ReactNode
}

export default function DiscordIntegrationProtection({ children, fallback }:DiscordIntegrationProtectionProps) {
  return <>{isIntegrated() ? children : fallback}</>
}
