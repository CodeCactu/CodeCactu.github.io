import { discordIntegrationStorageUserKey, discordStorage } from "./discordStorage"

export default function getSessionToken() {
  const storedSession = discordStorage.get( discordIntegrationStorageUserKey ) as any
  return storedSession?.sessionToken as string
}
