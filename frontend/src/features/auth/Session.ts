import { clientConfig } from "@/config.client"
import { getCookie } from "@lib/core/functions"

type RawUser = {
  name: string
  discordId: string
  avatarHash: string
}

export type SessionData = { expiresAt:number, user:RawUser }
type SessionRes = { code: string } | SessionData

export default class Session {
  static readonly expirationCookiename = `sessionExpiresAt`
  static #expirationTimerId = -1
  static #data: undefined | null | Promise<null | SessionData> = undefined

  static create( code:string ) {
    Session.#data = fetch( `${clientConfig.BACKEND_ORIGIN}/api/auth/sessions`, {
      method: `POST`,
      credentials: `include`,
      body: JSON.stringify({ code }),
    } ).then<SessionRes>( res => res.json() )
      .then( data => `code` in data ? null : data )
      .catch( () => null )

    return Session.#data
  }

  static get() {
    if (!Session.checkExistance()) return null
    if (Session.checkIsInitialised()) return Session.#data

    Session.#data = fetch( `${clientConfig.BACKEND_ORIGIN}/api/auth/sessions/@my`, { credentials:`include` } )
      .then<SessionRes>( res => res.json() )
      .then( data => `code` in data ? null : data )
      .catch( () => null )

    return Session.#data
  }

  static delete() {
    return fetch( `${clientConfig.BACKEND_ORIGIN}/api/auth/sessions/@my`, { credentials:`include`, method:`DELETE` } )
  }

  static checkExistance() {
    const existance = !!getCookie( Session.expirationCookiename )
    if (!existance) Session.#data = null
    return !!existance
  }

  static checkIsInitialised() {
    return Session.#data === null || Session.#data instanceof Promise
  }

  static getExpirationDate() {
    const expiration = getCookie( Session.expirationCookiename )
    return !expiration ? null : new Date( expiration )
  }

  static resetExpirationTimer( cb?:() => void ) {
    const expiresAt = getCookie( Session.expirationCookiename )
    if (!expiresAt) {
      cb?.()
      return Session.delete()
    }

    const expirationTime = new Date( expiresAt ).getTime() - Date.now()
    if (expirationTime < 1000 * 10) {
      cb?.()
      return Session.delete()
    }

    window.clearTimeout( Session.#expirationTimerId )
    Session.#expirationTimerId = window.setTimeout( () => Session.resetExpirationTimer( cb ), expirationTime )
  }
}
