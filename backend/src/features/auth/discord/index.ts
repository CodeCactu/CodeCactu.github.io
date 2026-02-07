import z from "zod"
import { getApiError } from "@fet/server"
import { logColorInfo } from "@fet/loggers/logInfo"
import { logColorDimmed, logColorPositive } from "@fet/loggers/log"
import { User } from "../user"
import { Session } from "../session"
import logAuth from "../logAuth"
import { getUserSession } from "../endpoints"
import { getSessionHeadersInit } from ".."
import config from "@/config"

export type DiscordUser = {
  id: string
  username: string
  global_name: string
  avatar: string
  discriminator: string
  public_flags: number
  flags: string
  accent_color: number
}

const createSessionBodyScheme = z.object({ code:z.string() })

export default async function createSessionWithDiscordEndpoint( req:Bun.BunRequest ) {
  const body = createSessionBodyScheme.safeParse( await req.json() )
  if (body.error) return getApiError( `MISSING_CODE` )

  const discordUser = await authorizeByDiscord( req.headers.get( `origin` ) ?? ``, body.data.code )
  if (discordUser instanceof Response) return discordUser

  const user = await User.getOrCreate( discordUser.id, discordUser.global_name, discordUser.avatar )
  const session = await Session.create( user.id )

  logAuth(
    { value:`+ `, color:logColorPositive },
    `User logged in (`,
    { value:user.id, color:logColorDimmed },
    ` | `,
    { value:user.name, color:logColorInfo },
    `)`,
  )

  return Response.json( getUserSession( user ), {
    status: 201,
    headers: new Headers( getSessionHeadersInit( session ) ),
  } )
}

export async function authorizeByDiscord( redirectUri:string, code:string ) {
  const discordParams = {
    grant_type: `authorization_code`,
    redirect_uri: redirectUri,
    code,
    scope: `identify`,
  }

  const authInfo = await fetch( `https://discord.com/api/v10/oauth2/token`, {
    method: `POST`,
    headers: {
      "Content-Type": `application/x-www-form-urlencoded`,
      Authorization: `Basic ${btoa( `${config.clientId}:${config.clientSecret}` )}`,
    },
    body: new URLSearchParams( discordParams ),
  } ).then( res => res.json() )

  const discordUser = await fetch( `https://discord.com/api/v10/users/@me`, {
    headers: {
      authorization: `${authInfo.token_type} ${authInfo.access_token}`,
    },
  } ).then<DiscordUser | { code: number }>( res => res.json() )

  if (`code` in discordUser) {
    logAuth( `Cannot log in`, [ { discordParams, discordResponse:discordUser } ] )
    if (discordUser.code === 0) return getApiError( `OBSOLETE_CODE` )
    return getApiError( `UNKNOWN_FAILURE` )
  }

  return discordUser
}
