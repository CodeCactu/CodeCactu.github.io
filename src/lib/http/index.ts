import getWindow from "../core/functions/getWindow"
import { QueryObj } from "./uri"
import { enhancedFetch, EnhancedFetchInit, EnhancedFetchMiddleware } from "./enhancedFetch"
import { HTTPStatusCode } from "./HTTPConsts"

export type { HTTPStatusCode }

export type AnyData = Record<string, unknown>


function createHTTP( middleware?:EnhancedFetchMiddleware ) {
  function http<TData=unknown>(uri:string, init:Omit<EnhancedFetchInit, "uri"> ) {
    return enhancedFetch<TData>({ middleware, ...init, uri })
  }

  const createBodiedReq   = method => <TData=unknown>( uri:string, data:AnyData = {})       => http<TData>( uri, { method, data } )
  const createQueriedReq  = method => <TData=unknown>( uri:string, queryObj:QueryObj = {} ) => http<TData>( uri, { method, data:queryObj } )

  http.post     = createBodiedReq( `POST` )
  http.get      = createQueriedReq( `GET` )
  http.put      = createBodiedReq( `PUT` )
  http.delete   = createQueriedReq( `DELETE` )
  http.options  = createQueriedReq( `OPTIONS` )
  http.path     = createBodiedReq( `PATH` )

  http.createMiddlewaredHttp = createHTTP

  return http
}

const http = createHTTP()
const window = getWindow()

declare global {
  interface Window {
    http: typeof http
  }
}

if (window) window.http = http

export default http
