import { logColorInfo } from "@fet/loggers/logInfo"
import { logColorNegative } from "@fet/loggers/log"
import { authReq, getSessionDeletionHeadersInit } from "."
import { User } from "./user"
import { Session } from "./session"
import logAuth from "./logAuth"
import createSessionWithDiscordEndpoint from "./discord"

export function createUserSessionEndpoint( req:Bun.BunRequest ) {
  return createSessionWithDiscordEndpoint( req )
}

export function getUserSessionEndpoint( _req:Bun.BunRequest, user:User ) {
  return Response.json( getUserSession( user ) )
}

export function deleteUserSessionEndpoint( req:Bun.BunRequest ) {
  const session = authReq( req )
  if (!session) return Response.json( `` )

  const user = User.get( session.userId )
  if (!user) return Response.json( `Error` )

  logAuth( { value:`- `, color:logColorNegative }, `User logged out (`, { value:user.name, color:logColorInfo }, `)` )
  Session.deleteByUser( session.userId )

  const res = Response.json( `` )
  for (const [ key, value ] of getSessionDeletionHeadersInit()) res.headers.append( key, value )
  return res
}



// Helpers



export function getUserSession( user:User ) {
  return {
    expiresAt: Date.now() + Session.expirationTimeMilis,
    user: user.publicData,
  }
}
