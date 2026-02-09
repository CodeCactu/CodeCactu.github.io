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
}

export type HttpBodyMethod = Omit<HttpConfig, `method`>
export type HttpWithoutBodyMethod = Omit<HttpConfig, `method` | `body`>

export type HttpResponse<T = unknown> = Promise<[T, HttpResponseInfo]>
export type HttpResponseInfo<T = unknown> = T & {
  url: string
  headers: Headers
  status: HTTPStatusCode
  ok: boolean
}

export type HttpRequestMiddleware = (config:HttpConfig) => (undefined | HttpConfig)
export type HttpResponseMiddleware = (res:Awaited<HttpResponse>) => (undefined | Awaited<HttpResponse>)
export type HttpManagerConfig = {
  reqMiddleware?: HttpRequestMiddleware
  resMiddleware?: HttpResponseMiddleware
}

export class HttpManager {
  #middlewares = {
    request: [] as HttpRequestMiddleware[],
    response: [] as HttpResponseMiddleware[],
  }

  constructor( { reqMiddleware, resMiddleware }:HttpManagerConfig = {} ) {
    if (reqMiddleware) this.#middlewares.request.push( reqMiddleware )
    if (resMiddleware) this.#middlewares.response.push( resMiddleware )
  }

  post<T = unknown>( config:HttpBodyMethod ): HttpResponse<T>
  post<T = unknown>( url:string, body?:Body, config?:HttpConfig ): HttpResponse<T>
  post<T = unknown>( urlOrConfig:string | HttpBodyMethod, body?:Body, config?:HttpConfig ): HttpResponse<T> {
    const fullConfig:HttpConfig = {
      ...config,
      method: `POST`,
      url: typeof urlOrConfig === `string` ? urlOrConfig : urlOrConfig.url,
      body: body || config?.body || (typeof urlOrConfig === `string` ? undefined : urlOrConfig.body),
    }

    return this.fetchWithResHandler<T>( fullConfig )
  }

  get<T = unknown>( config:HttpWithoutBodyMethod ): HttpResponse<T>
  get<T = unknown>( url:string, config?:Omit<HttpWithoutBodyMethod, `url`> ): HttpResponse<T>
  get<T = unknown>( urlOrConfig:string | HttpWithoutBodyMethod, config?:Omit<HttpWithoutBodyMethod, `url`> ): HttpResponse<T> {
    const fullConfig:HttpConfig = {
      ...config,
      method: `GET`,
      url: typeof urlOrConfig === `string` ? urlOrConfig : urlOrConfig.url,
    }

    return this.fetchWithResHandler<T>( fullConfig )
  }

  put<T = unknown>( config:HttpBodyMethod ): HttpResponse<T>
  put<T = unknown>( url:string, body?:Body, config?:HttpConfig ): HttpResponse<T>
  put<T = unknown>( urlOrConfig:string | HttpBodyMethod, body?:Body, config?:HttpConfig ): HttpResponse<T> {
    const fullConfig:HttpConfig = {
      ...config,
      method: `PUT`,
      url: typeof urlOrConfig === `string` ? urlOrConfig : urlOrConfig.url,
      body: body || config?.body || (typeof urlOrConfig === `string` ? undefined : urlOrConfig.body),
    }

    return this.fetchWithResHandler<T>( fullConfig )
  }

  patch<T = unknown>( config:HttpBodyMethod ): HttpResponse<T>
  patch<T = unknown>( url:string, body?:Body, config?:HttpConfig ): HttpResponse<T>
  patch<T = unknown>( urlOrConfig:string | HttpBodyMethod, body?:Body, config?:HttpConfig ): HttpResponse<T> {
    const fullConfig:HttpConfig = {
      ...config,
      method: `PATCH`,
      url: typeof urlOrConfig === `string` ? urlOrConfig : urlOrConfig.url,
      body: body || config?.body || (typeof urlOrConfig === `string` ? undefined : urlOrConfig.body),
    }

    return this.fetchWithResHandler<T>( fullConfig )
  }

  delete<T = unknown>( config:HttpWithoutBodyMethod ): HttpResponse<T>
  delete<T = unknown>( url:string, config?:Omit<HttpWithoutBodyMethod, `url`> ): HttpResponse<T>
  delete<T = unknown>( urlOrConfig:string | HttpWithoutBodyMethod, config?:Omit<HttpWithoutBodyMethod, `url`> ): HttpResponse<T> {
    const fullConfig:HttpConfig = {
      ...config,
      method: `DELETE`,
      url: typeof urlOrConfig === `string` ? urlOrConfig : urlOrConfig.url,
    }

    return this.fetchWithResHandler<T>( fullConfig )
  }

  async fetchWithResHandler<T = unknown>( config:HttpConfig ) {
    this.#middlewares.request.forEach( fn => fn( config ) )
    const res = await HttpManager.fetchWithResHandler<T>( config )
    this.#middlewares.response.forEach( fn => fn( res ) )
    return res
  }

  static async fetchWithResHandler<T = unknown>( { url, ...config }:HttpConfig ): HttpResponse<T> {
    const isFormData = typeof FormData !== `undefined` && config.body instanceof FormData

    if (!isFormData && !Object.keys( config.headers ?? {} ).find( h => h.toLowerCase() === `content-type` )) {
      config.headers ||= {}
      config.headers[ `Content-Type` ] = `application/json`
    }

    const finalBody = !config.body ? undefined : (isFormData ? config.body : JSON.stringify( config.body ))
    const response = await fetch( url, {
      ...config,
      headers: config.headers as Record<string, string>,
      body: finalBody,
    } )


    const contentType = response.headers.get( `content-type` )
    const data = await (contentType?.includes( `json` ) ? response.json() : response.text())

    return [
      data,
      {
        url,
        headers: response.headers,
        status: response.status as HTTPStatusCode,
        ok: response.ok,
      },
    ]
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
