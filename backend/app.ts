import { withCors, withCorsHeaders } from "@fet/server"
import logInfo from "@fet/loggers/logInfo"
import { getGamesEndpoint } from "@fet/games/endpoints"
import { createUserSessionEndpoint, deleteUserSessionEndpoint, getUserSessionEndpoint } from "@fet/auth/endpoints"
import { withAuth } from "@fet/auth"

const server = Bun.serve({
  port: 3001,

  routes: {
    "/api/auth/sessions": {
      POST: withCors( createUserSessionEndpoint ),
    },
    "/api/auth/sessions/my": {
      GET: withCors( withAuth( getUserSessionEndpoint ) ),
      DELETE: withCors( deleteUserSessionEndpoint ),
    },
    "/api/games": {
      GET: withCors( getGamesEndpoint ),
    },
  },

  fetch( req ) {
    if (req.method === `OPTIONS`) return withCorsHeaders( new Response( null ) )
    return new Response( null, { status:404 } )
  },
})

logInfo( `Started on port ${server.port}` )
