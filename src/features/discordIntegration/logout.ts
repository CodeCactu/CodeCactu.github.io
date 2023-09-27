import { getServerApiUrl } from "../../config"
import getSessionToken from "./getSessionToken"
import { discordStorage } from "./discordStorage"

export default async function logout() {
  const sessionToken = getSessionToken()

  if (!sessionToken) return

  await fetch( `${getServerApiUrl()}/discord/integrate`, {
    method: `DELETE`,
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  } )

  discordStorage.clear()
}
