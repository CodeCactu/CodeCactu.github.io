import { logColorInfo } from "@fet/loggers/logInfo"
import { logColorNegative } from "@fet/loggers/log"
import { authReq } from "."
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
  if (session) {
    const user = User.get( session.userId )
    if (!user) return Response.json( `Error` )

    logAuth( { value:`- `, color:logColorNegative }, `User logged out (`, { value:user.name, color:logColorInfo }, `)` )
    Session.deleteByUser( session.userId )
  }
  return Response.json( `` )
}



// Helpers



export function getUserSession( user:User ) {
  return {
    expiresAt: Date.now() + Session.expirationTimeMilis,
    user: user.publicData,
  }
}
