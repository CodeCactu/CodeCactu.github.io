import { DiscordUser } from "./loadDiscordUser"
import fetchDiscord from "./fetchDiscord"

type OAuth2Res = {
  token_type: string
  access_token: string
}

export type ErrorRes = { code: number }

export default async function loadDiscordUserOAuth( clientId:string, clientSecret:string, code:string, redirectUri:string ) {
  const discordParams = {
    grant_type: `authorization_code`,
    redirect_uri: redirectUri,
    code,
    scope: `identify`,
  }

  const authInfo = await fetchDiscord<OAuth2Res>( `/oauth2/token`, {
    method: `POST`,
    headers: {
      "Content-Type": `application/x-www-form-urlencoded`,
      Authorization: `Basic ${btoa( `${clientId}:${clientSecret}` )}`,
    },
    body: new URLSearchParams( discordParams ),
  } )

  const discordUserRes = await fetchDiscord<DiscordUser | ErrorRes>( `/users/@me`, {
    headers: {
      authorization: `${authInfo.token_type} ${authInfo.access_token}`,
    },
  } )

  if (`code` in discordUserRes) throw discordUserRes
  return discordUserRes
}
