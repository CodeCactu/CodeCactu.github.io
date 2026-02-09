"use client"

import { useEffect } from "react"
import http, { HttpBodyMethod, HttpConfig, HttpManager, HttpResponseInfo, HttpWithoutBodyMethod } from "./http"
import { HttpMethod } from "./enums"

export type Callback<T> = (data:T, info:HttpResponseInfo) => void

export default useHttp
export function useHttp<T = unknown>( method:HttpMethod, url:string, cb:Callback<T>, deps?:unknown[] ):void
export function useHttp<T = unknown>( method:HttpMethod, url:string, config:HttpConfig, cb:Callback<T>, deps?:unknown[] ):void
export function useHttp<T = unknown>( method:HttpMethod, url:string, configOrCb:HttpConfig | Callback<T>, cbOrDeps?:Callback<T> | unknown[], maybeDeps:unknown[] = [] ): void {
  useCustomHttp(
    http,
    method,
    url,
    configOrCb as HttpConfig,
    cbOrDeps as Callback<T>,
    maybeDeps,
  )
}

export function useCustomHttp<T = unknown>( httpInstance:HttpManager, method:HttpMethod, url:string, cb:Callback<T>, deps?:unknown[] ):void
export function useCustomHttp<T = unknown>( httpInstance:HttpManager, method:HttpMethod, url:string, config:HttpConfig, cb:Callback<T>, deps?:unknown[] ):void
export function useCustomHttp<T = unknown>( httpInstance:HttpManager, method:HttpMethod, url:string, configOrCb:HttpConfig | Callback<T>, cbOrDeps?:Callback<T> | unknown[], maybeDeps?:unknown[] ): void {
  useEffect( () => {
    const config:Omit<HttpBodyMethod | HttpWithoutBodyMethod, `url`> = typeof configOrCb === `function` ? {} : { ...configOrCb }
    const cb = typeof configOrCb === `function` ? configOrCb : (typeof cbOrDeps === `function` ? cbOrDeps : undefined)

    if (!cb) throw new Error( `Missing cb in "useHttp" hook!` )

    const abortController = new AbortController()

    config.signal = abortController.signal
    httpInstance[ method.toLowerCase() as `get` ]( url, config ).then( ([ data, info ]) => cb( data as T, info ) )

    return () => abortController.abort()
  }, (typeof cbOrDeps === `function` ? maybeDeps : cbOrDeps) ?? [] )  // eslint-disable-line react-hooks/exhaustive-deps -- Works as needed
}
