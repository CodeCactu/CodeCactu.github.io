import { getApiError } from "@fet/server"
import { User } from "./user"
import { Session } from "./session"

export function getSessionToken( req:Bun.BunRequest ) {
  return req.cookies.get( `sessionToken` )
}

export function authReq( req:Bun.BunRequest ) {
  const token = getSessionToken( req )
  if (!token) return null

  return Session.get( token )
}

export function getSessionHeadersInit( session:Session ) {
  const expiresAt = session.expiresAt.toUTCString()

  return [
    [ `set-cookie`, `sessionToken=${session.token}; Expires=${expiresAt}; Path=/; HttpOnly` ],
    [ `set-cookie`, `sessionExpiresAt=${expiresAt}; Expires=${expiresAt}; Path=/` ],
  ] satisfies HeadersInit
}

export function withAuth( handler:(req:Bun.BunRequest, user:User) => Response | Promise<Response> ) {
  return async(req:Bun.BunRequest) => {
    const session = authReq( req )
    if (!session) return getApiError( `UNAUTHORIZED` )

    const user = User.get( session.userId )
    if (!user) return getApiError( `UNAUTHORIZED` )

    const res = await handler( req, user )

    for (const [ key, value ] of getSessionHeadersInit( session )) res.headers.append( key, value )

    return res
  }
}
