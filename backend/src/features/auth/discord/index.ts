import z from "zod"
import { getApiError } from "@fet/server"
import { logColorInfo } from "@fet/loggers/logInfo"
import { logColorDimmed, logColorPositive } from "@fet/loggers/log"
import loadDiscordUserOAuth from "@fet/discord/loadDiscordUserOAuth"
import { User } from "../user"
import { Session } from "../session"
import logAuth from "../logAuth"
import { getUserSession } from "../endpoints"
import { getSessionHeadersInit } from ".."
import config from "@/config"

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
  const discordUser = await loadDiscordUserOAuth( config.clientId, config.clientSecret, code, redirectUri )

  if (`code` in discordUser) {
    logAuth( `Cannot log in`, [ { discordResponse:discordUser } ] )
    if (discordUser.code === 0) return getApiError( `OBSOLETE_CODE` )
    return getApiError( `UNKNOWN_FAILURE` )
  }

  return discordUser
}
