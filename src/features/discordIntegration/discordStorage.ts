import { localStorage } from "@lib/storage/webStorage"

export const discordIntegrationStorageUserKey = `discordSession` as const
export type DiscordIntegrationStorageKey = typeof discordIntegrationStorageUserKey

export const discordStorage = localStorage.getSubstorageForKeys([ discordIntegrationStorageUserKey ])
