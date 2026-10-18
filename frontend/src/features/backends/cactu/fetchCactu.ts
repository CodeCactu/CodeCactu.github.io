import { clientConfig } from "@/config.client"

export type Init = Omit<RequestInit, `body`> & {
  body?: Record<string, unknown>
}

export default function fetchCactu<T>( urn:string, { body, ...init }:Init = {} ) {
  return fetch( clientConfig.BACKEND_ORIGIN + urn, { ...init, body:body && JSON.stringify( body ) } )
    .then<T>( r => r.json() )
}
