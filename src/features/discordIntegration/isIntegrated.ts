import getWindow from "@lib/core/functions/getWindow"
import { discordIntegrationStorageUserKey, discordStorage } from "./discordStorage"

export default function isIntegrated() {
  const storage = getWindow()?.localStorage

  if (!storage) return false

  return !!discordStorage.get( discordIntegrationStorageUserKey )
}
