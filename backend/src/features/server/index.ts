import { IncomingMessage } from "http"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": `http://localhost:3000`,
  "Access-Control-Allow-Methods": `GET, POST, DELETE, OPTIONS`,
  "Access-Control-Allow-Headers": `Content-Type, Authorization`,
  "Access-Control-Allow-Credentials": `true`,
}

export function getReqOrigin( req:IncomingMessage ) {
  const headers = req.headers

  return headers.host?.includes( `localhost` )
    ? `http://localhost:3000`
    : headers.referer?.match( /(?<origin>https?:\/\/(?<host>localhost|\d+\.\d+\.\d+\.\d+)(?::(?<port>\d+))?)/ )?.groups?.origin ?? `*`
}

export function getApiError( code:string ) {
  return Response.json({ code })
}

export function withCors( handler:(req:Bun.BunRequest) => Response | Promise<Response> ) {
  return async(req:Bun.BunRequest) => {
    return withCorsHeaders( await handler( req ) )
  }
}

export function withCorsHeaders( res:Response ) {
  for (const [ key, value ] of Object.entries( CORS_HEADERS )) {
    res.headers.append( key, value )
  }

  return res
}
