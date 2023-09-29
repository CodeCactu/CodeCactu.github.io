import http from "@lib/http"
import getWindow from "@lib/core/functions/getWindow"
import getSessionToken from "@fet/discordIntegration/getSessionToken"
import { getServerApiUrl } from "../../config"

const backendHttp = http.createMiddlewaredHttp( req => {
  const sessionToken = getSessionToken()

  req.uri = getServerApiUrl() + req.uri

  if (sessionToken) {
    req.headers ||= {}
    req.headers[ `Authorization` ] = `Bearer ${sessionToken}`
  }

  return req
} )

if (getWindow()) (getWindow() as any ).backendHttp = backendHttp
export default backendHttp
