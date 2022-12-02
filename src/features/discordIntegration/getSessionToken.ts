import getWindow from "@lib/core/functions/getWindow"
import { discordIntegrationStorageSessionKey } from "./isIntegrated"

export default function getSessionToken() {
  return getWindow()?.localStorage.getItem( discordIntegrationStorageSessionKey )
}
