/* eslint-disable @typescript-eslint/no-explicit-any */

import { IncomingHttpHeaders } from "http"
import { JSONValue } from "../core/types"
import getWindow from "../core/functions/getWindow"
import { HttpMethod, HTTPStatusCode } from "./enums"

export type HttpBodyValue = { [x:string]: undefined | JSONValue | File | HttpBodyValue }
type Body = FormData | JSONValue | HttpBodyValue
type StandardHeaders = {
  // copy every declared property from http.IncomingHttpHeaders
  // but remove index signatures
  [K in keyof IncomingHttpHeaders as string extends K
    ? never
    : number extends K
      ? never
      : K]:IncomingHttpHeaders[K];
}

export type HttpHeaders = Partial<Record<keyof StandardHeaders | ({} & string), string>>
export type HttpConfig = Omit<RequestInit, `method` | `body` | `headers`> & {
  url: string
  method: HttpMethod
  headers?: HttpHeaders
  body?: any
  next?: NextFetchRequestConfig | undefined
  middlewares?: {
    request: HttpRequestMiddleware[]
    response: HttpResponseMiddleware[]
  }
}

export type HttpBodyMethod = Omit<HttpConfig, `middlewares` | `method`>
export type HttpWithoutBodyMethod = Omit<HttpConfig, `middlewares` | `method` | `body`>

export type HttpResponse<T = unknown> = Promise<T> & { getMeta: () => Promise<HttpResponseInfo> }
export type HttpResponseInfo = {
  url: string
  headers: Headers
  status: HTTPStatusCode
  ok: boolean
}


export type HttpRequestMiddleware = (config:HttpConfig) => void
export type HttpResponseMiddleware<T = unknown> = (res:Awaited<{ data: T, readonly resInfo: HttpResponseInfo }>) => void
export type HttpManagerConfig = {
  reqMiddleware?: HttpRequestMiddleware
  resMiddleware?: HttpResponseMiddleware
}

export class HttpManager {
  #middlewares: NonNullable<HttpConfig[`middlewares`]> = {
    request: [],
    response: [],
  }

  constructor( { reqMiddleware, resMiddleware }:HttpManagerConfig = {} ) {
    if (reqMiddleware) this.#middlewares.request.push( reqMiddleware )
    if (resMiddleware) this.#middlewares.response.push( resMiddleware )
  }

  post<T = unknown>( config:HttpBodyMethod ): HttpResponse<T>
  post<T = unknown>( url:string, body?:Body, config?:Omit<HttpWithoutBodyMethod, `url`> ): HttpResponse<T>
  post<T = unknown>( urlOrConfig:string | HttpBodyMethod, body?:Body, config?:HttpConfig ) {
    return HttpManager.fetchWithResHandler<T>({
      ...config,
      method: `POST`,
      url: typeof urlOrConfig === `string` ? urlOrConfig : urlOrConfig.url,
      body: body || config?.body || (typeof urlOrConfig === `string` ? undefined : urlOrConfig.body),
      middlewares: this.#middlewares,
    })
  }

  get<T = unknown>( config:HttpWithoutBodyMethod ): HttpResponse<T>
  get<T = unknown>( url:string, config?:Omit<HttpWithoutBodyMethod, `url`> ): HttpResponse<T>
  get<T = unknown>( urlOrConfig:string | HttpWithoutBodyMethod, config?:Omit<HttpWithoutBodyMethod, `url`> ) {
    return HttpManager.fetchWithResHandler<T>({
      ...config,
      method: `GET`,
      url: typeof urlOrConfig === `string` ? urlOrConfig : urlOrConfig.url,
      middlewares: this.#middlewares,
    })
  }

  put<T = unknown>( config:HttpBodyMethod ): HttpResponse<T>
  put<T = unknown>( url:string, body?:Body, config?:Omit<HttpWithoutBodyMethod, `url`> ): HttpResponse<T>
  put<T = unknown>( urlOrConfig:string | HttpBodyMethod, body?:Body, config?:HttpConfig ) {
    return HttpManager.fetchWithResHandler<T>({
      ...config,
      method: `PUT`,
      url: typeof urlOrConfig === `string` ? urlOrConfig : urlOrConfig.url,
      body: body || config?.body || (typeof urlOrConfig === `string` ? undefined : urlOrConfig.body),
      middlewares: this.#middlewares,
    })
  }

  patch<T = unknown>( config:HttpBodyMethod ): HttpResponse<T>
  patch<T = unknown>( url:string, body?:Body, config?:Omit<HttpWithoutBodyMethod, `url`> ): HttpResponse<T>
  patch<T = unknown>( urlOrConfig:string | HttpBodyMethod, body?:Body, config?:HttpConfig ) {
    return HttpManager.fetchWithResHandler<T>({
      ...config,
      method: `PATCH`,
      url: typeof urlOrConfig === `string` ? urlOrConfig : urlOrConfig.url,
      body: body || config?.body || (typeof urlOrConfig === `string` ? undefined : urlOrConfig.body),
      middlewares: this.#middlewares,
    })
  }

  delete<T = unknown>( config:HttpWithoutBodyMethod ): HttpResponse<T>
  delete<T = unknown>( url:string, config?:Omit<HttpWithoutBodyMethod, `url`> ): HttpResponse<T>
  delete<T = unknown>( urlOrConfig:string | HttpWithoutBodyMethod, config?:Omit<HttpWithoutBodyMethod, `url`> ) {
    return HttpManager.fetchWithResHandler<T>({
      ...config,
      url: typeof urlOrConfig === `string` ? urlOrConfig : urlOrConfig.url,
      method: `DELETE`,
      middlewares: this.#middlewares,
    })
  }

  static fetchWithResHandler<T = unknown>( { middlewares, ...fullConfig }:HttpConfig ) {
    middlewares?.request.forEach( mw => mw( fullConfig ) )

    const { url, ...config } = fullConfig
    const isFormData = typeof FormData !== `undefined` && fullConfig.body instanceof FormData

    if (!isFormData && !Object.keys( config.headers ?? {} ).find( h => h.toLowerCase() === `content-type` )) {
      config.headers ||= {}
      config.headers[ `Content-Type` ] = `application/json`
    }

    const finalBody = !config.body ? undefined : (isFormData ? config.body : JSON.stringify( config.body ))
    const fetchPromise = fetch( url, {
      ...config,
      headers: config.headers as Record<string, string>,
      body: finalBody,
    } ).then( async r => {
      const contentType = r.headers.get( `content-type` )

      const responseObj = {
        data: await (contentType?.includes( `json` ) ? r.json() : r.text()) as T,
        get resInfo() {
          return {
            url,
            headers: r.headers,
            status: r.status as HTTPStatusCode,
            ok: r.ok,
          }
        },
      }

      middlewares?.response.forEach( mw => mw( responseObj ) )

      return responseObj
    } )

    const dataPromise = fetchPromise.then( r => r.data ) as HttpResponse<T>
    dataPromise.getMeta = () => fetchPromise.then( r => r.resInfo )

    return dataPromise
  }
}

const http = new HttpManager()
export default http

declare global {
  interface Window {
    http: HttpManager
  }
}

if (getWindow()) window.http = http
