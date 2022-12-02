import getWindow from "@lib/core/functions/getWindow"

export const discordIntegrationStorageUserKey = `user` as const
export const discordIntegrationStorageSessionKey = `integrationSessionToken` as const
export type DiscordIntegrationStorageKey = typeof discordIntegrationStorageUserKey

export default function isIntegrated() {
  const storage = getWindow()?.localStorage

  if (!storage) return false

  return !!storage.getItem( discordIntegrationStorageUserKey ) && !!storage.getItem( discordIntegrationStorageSessionKey )
}
