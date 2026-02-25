import logInfo from "@fet/loggers/logInfo"

const CORS_ORIGINS = [ `http://localhost:3000`, `http://192.168.1.100:3000`, `https://cactu.cc` ]
const CORS_HEADERS = {
  "Access-Control-Allow-Methods": `GET, POST, PUT, PATCH, DELETE, OPTIONS`,
  "Access-Control-Allow-Headers": `Content-Type, Authorization, Accept, X-Requested-With, X-Forwarded-For`,
  "Access-Control-Allow-Credentials": `true`,
  "Access-Control-Max-Age": `600`,
  "Vary": `Origin`,
}

export function getApiError( code:string ) {
  return Response.json({ code })
}

export function checkCors( req:Request ): `SAME_ORIGIN` | (string & {}) | null {
  const origin = req.headers.get( `origin` )

  if (!origin) return `SAME_ORIGIN`
  if (!CORS_ORIGINS.includes( origin )) return null
  return origin
}

export function withCors( handler:(req:Bun.BunRequest<any>) => Response | Promise<Response> ) { // eslint-disable-line @typescript-eslint/no-explicit-any -- It can be any path
  return async(req:Bun.BunRequest) => {
    const origin = checkCors( req )

    if (!origin) {
      logInfo( `CORS block. Request from`, [ { origin:req.headers.get( `origin` ) } ] )
      return new Response( null, { status:401 } )
    }

    const res = await handler( req )

    if (origin === `SAME_ORIGIN`) return res
    return withCorsHeaders( origin, res )
  }
}

export function withCorsHeaders( origin:string, res:Response ) {
  res.headers.append( `Access-Control-Allow-Origin`, origin )

  for (const [ key, value ] of Object.entries( CORS_HEADERS )) {
    res.headers.set( key, value )
  }

  return res
}
