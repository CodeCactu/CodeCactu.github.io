import getWindow from "@lib/core/functions/getWindow"

export const discordIntegrationStorageKey = `user` as const
export type DiscordIntegrationStorageKey = typeof discordIntegrationStorageKey

export default function isIntegrated() {
  return !!getWindow()?.localStorage.getItem( discordIntegrationStorageKey )
}
