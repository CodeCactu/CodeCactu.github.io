import { filterObject } from "../core/functions/objectUtils"
import fixUri from "./uri"
import { HTTPMethod, httpMethods, httpMethodsWithBody, HTTPStatusCode } from "./HTTPConsts"

export type EnhancedFetchMiddleware = (req:EnhancedFetchRequest) => EnhancedFetchRequest
export type EnhancedFetchInitConfigPart = {
  // fullRequestData: boolean
}
export type EnhancedFetchInitReqPart = {
  method: HTTPMethod
  uri: string
  headers?: Record<string, string>
  body?: unknown
  data?: NonNullable<any>
  middleware?: EnhancedFetchMiddleware
}
export type EnhancedFetchInit = EnhancedFetchInitConfigPart & EnhancedFetchInitReqPart
export type EnhancedFetchRequest = {
  method: HTTPMethod
  uri: string
  headers: Record<string, string>
  body: unknown
}
export type EnhancedFetchResponse<TData = unknown> = {
  method: HTTPMethod
  status: null | HTTPStatusCode
  uri: string
  headers: null | Record<string, string>
  data: null | TData
  error: null | Error
}

// type FetchReturnValue<TData, Config extends undefined | EnhancedFetchInitConfigPart> = Promise<Config extends EnhancedFetchInitConfigPart
//   ? (Config["fullRequestData"] extends true ? [TData, EnhancedFetchResponse<TData>] : TData)
//   : TData
// >

export async function enhancedFetch<TData=unknown>( init:EnhancedFetchInit ):Promise<[TData, EnhancedFetchResponse<TData>]>
export async function enhancedFetch<TData=unknown>( uri:string, init?:Omit<EnhancedFetchInit, "uri"> ):Promise<[TData, EnhancedFetchResponse<TData>]>
export async function enhancedFetch<TData=unknown>( method:HTTPMethod, uri:string, init?:Omit<EnhancedFetchInit, "uri" | "method"> ):Promise<[TData, EnhancedFetchResponse<TData>]>
export async function enhancedFetch<TData=unknown>( methodOrUriOrInit:string | EnhancedFetchInit, uriOrInit?:string | Omit<EnhancedFetchInit, "uri">, maybeInit?:Omit<EnhancedFetchInit, "uri" | "method"> ): Promise<[null | TData, EnhancedFetchResponse<TData>]> {
  const { req } = createRequest( methodOrUriOrInit, uriOrInit, maybeInit )

  req.headers ||= {}
  req.headers[ `Content-Type` ] = `application/json`

  const response = await fetch( req.uri, {
    method: req.method,
    headers: req.headers,
    body: req.body ? JSON.stringify( typeof req.body === `object` && !Array.isArray( req.body ) ? filterObject( req.body ) : req.body ) : undefined,
  } ).catch( error => ({ error }) )

  if (`error` in response) {
    const info:EnhancedFetchResponse<TData> = {
      uri: req.uri,
      method: req.method,
      status: null,
      headers: null,
      data: null,
      error: response.error,
    }

    return [ null, info ]
  }

  const contentType = response.headers.get( `content-type` )
  let responseData:null | TData = null

  try {
    if (contentType?.includes( `application/json` )) responseData = await response.json()
    else responseData = await response.text() as any as TData
  } catch {
    responseData = await response.text() as any as TData
  }

  const info:EnhancedFetchResponse<TData> = {
    uri: req.uri,
    method: req.method,
    status: response.status as HTTPStatusCode,
    headers: Object.fromEntries( response.headers.entries() ),
    data: responseData,
    error: null,
  }

  return [ responseData, info ]
}

function createRequest( methodOrUriOrInit:string | EnhancedFetchInit, uriOrInit?:string | Omit<EnhancedFetchInit, "uri">, maybeInit?:Omit<EnhancedFetchInit, "uri" | "method"> ): {req: EnhancedFetchRequest; config: EnhancedFetchInitConfigPart} {
  let partialInit:Partial<EnhancedFetchInit> = {}
  let req = {
    method: `GET`,
    headers: {},
  } as EnhancedFetchRequest
  let config:EnhancedFetchInitConfigPart = {
    fullRequestData: false,
  }

  const processInit = (init:Partial<EnhancedFetchInit>) => {
    partialInit = init

    if (init.body) req.body = init.body
    if (init.headers) req.headers = init.headers
    if (init.method) req.method = init.method
    if (init.uri) req.uri = init.uri

    // if (init.fullRequestData) config.fullRequestData = init.fullRequestData
  }

  if (typeof methodOrUriOrInit === `string`) {
    if (httpMethods.includes( methodOrUriOrInit as HTTPMethod )) req.method = methodOrUriOrInit as HTTPMethod
    else req.uri = methodOrUriOrInit
  } else {
    processInit( methodOrUriOrInit )
  }

  if (typeof uriOrInit === `string`) {
    req.uri = uriOrInit
  } else if (uriOrInit) {
    processInit( uriOrInit )
  }

  if (maybeInit) {
    processInit( maybeInit )
  }

  if (partialInit.data && httpMethodsWithBody.includes( req.method )) {
    req.body = partialInit.data
  }

  if (httpMethodsWithBody.includes( req.method ) && (!req.headers || !(`content-type` in req.headers))) {
    req.headers ||= {}
    req.headers[ `content-type` ] = `application/json`
  }

  if (partialInit.middleware) {
    req = partialInit.middleware( req )
  }

  if (partialInit.data) {
    if (!httpMethodsWithBody.includes( req.method )) req.uri = fixUri( req.uri, partialInit.data )
  } else {
    req.uri = fixUri( req.uri )
  }

  return { req, config }
}
