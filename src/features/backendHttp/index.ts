import http from "@lib/http"
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

export default backendHttp
