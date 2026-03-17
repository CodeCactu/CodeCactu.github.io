import { checkCors, withCors, withCorsHeaders } from "@fet/server"
import logInfo from "@fet/loggers/logInfo"
import { getGamesCategoriesEndpoint, getGamesEndpoint, getMyGamesVotesEndpoint, getUploadedResource, updateMyGamesVotesEndpoint } from "@fet/games/endpoints"
import { createUserSessionEndpoint, deleteUserSessionEndpoint, getUserSessionEndpoint } from "@fet/auth/endpoints"
import { withAuth } from "@fet/auth"

const server = Bun.serve({
  port: 3001,
  hostname: `0.0.0.0`,

  routes: {
    "/api/ping": Response.json({ message:`Pong` }),
    "/api/auth/sessions": {
      POST: withCors( createUserSessionEndpoint ),
    },
    "/api/auth/sessions/@my": {
      GET: withCors( withAuth( getUserSessionEndpoint ) ),
      DELETE: withCors( deleteUserSessionEndpoint ),
    },
    "/api/games": {
      GET: withCors( getGamesEndpoint ),
    },
    "/api/games/categories": {
      GET: withCors( getGamesCategoriesEndpoint ),
    },
    "/api/games/votes/@my": {
      GET: withCors( withAuth( getMyGamesVotesEndpoint ) ),
      PUT: withCors( withAuth( updateMyGamesVotesEndpoint ) ),
    },
    "/uploads/games/:gameId/:filename": {
      GET: withCors( getUploadedResource ),
    },
  },

  fetch( req ) {
    if (req.method === `OPTIONS`) {
      const origin = checkCors( req )
      if (!origin) return new Response( null, { status:403 } )

      const res = new Response( null, { status:204 } )
      return origin === `SAME_ORIGIN` ? res : withCorsHeaders( origin, res )
    }

    return Response.json( { code:`NOT_FOUND` }, { status:404 } )
  },
})

logInfo( `Started on port ${server.port}` )
