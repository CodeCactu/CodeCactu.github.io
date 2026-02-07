import { getCookie } from "@lib/core/functions"
import { configClient } from "@/config.client"

type RawUser = {
  name: string
  discordId: string
  avatarHash: string
}

export type SessionData = { expiresAt: number, user: RawUser }
type SessionRes = { code: string } | SessionData

export default class Session {
  static readonly expirationCookiename = `sessionExpiresAt`
  static loaded: undefined | null | SessionData = undefined // eslint-disable-line sonarjs/public-static-readonly -- Global value for entire app
  static #pendingDiscordUser: null | Promise<null | SessionData> = null // eslint-disable-line sonarjs/public-static-readonly -- Global value for entire app

  static create( code:string ) {
    if (Session.#pendingDiscordUser) return Session.#pendingDiscordUser

    Session.#pendingDiscordUser = fetch( `${configClient.BACKEND_ORIGIN}/api/auth/sessions`, {
      method: `POST`,
      credentials: `include`,
      body: JSON.stringify({ code }),
    } ).then<SessionRes>( res => res.json() )
      .then( data => {
        if (`code` in data) { // Error
          Session.loaded = null
        } else {
          Session.loaded = data
        }

        return Session.loaded
      } )
      .finally( () => Session.#pendingDiscordUser = null )

    return Session.#pendingDiscordUser
  }

  static get() {
    return fetch( `${configClient.BACKEND_ORIGIN}/api/auth/sessions/my`, { credentials:`include` } )
      .then<SessionRes>( res => res.json() )
      .then( data => `code` in data ? null : data )
  }

  static delete() {
    return fetch( `${configClient.BACKEND_ORIGIN}/api/auth/sessions/my`, { credentials:`include`, method:`DELETE` } )
  }

  static checkExistance() {
    return !!getCookie( Session.expirationCookiename )
  }

  static checkIsInitialised() {
    return Session.loaded !== undefined
  }

  static getExpirationDate() {
    const expiration = getCookie( Session.expirationCookiename )
    return !expiration ? null : new Date( expiration )
  }

  static runExpirationTimer( cb?:() => void ) {
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

    window.setTimeout( () => Session.runExpirationTimer( cb ), expirationTime )
  }
}
