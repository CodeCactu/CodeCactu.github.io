import crypto from "crypto"
import db from "@/db"

export type User = {
  id: string
  displayName: string
  avatarHash: string
  accentColor: null | string
}

db.run( `
  CREATE TABLE IF NOT EXISTS sessions (
    token       TEXT PRIMARY KEY,
    expiresAt   TEXT NOT NULL,
    userId      TEXT NOT NULL
  )
` )

export class Session {
  static readonly expirationTimeMinutes = 30
  static readonly #deleteOutdatedQuery = db.prepare( `DELETE FROM sessions WHERE DATETIME( expiresAt ) <= DATETIME( "now" )` )
  static readonly #deletebyUserQuery = db.prepare( `DELETE FROM sessions WHERE userId = ?` )
  static readonly #inserQuery = db.prepare( `INSERT INTO sessions (token, expiresAt, userId) VALUES ($token, $expiresAt, $userId)` )
  static readonly #updateExpirationQuery = db.prepare( `
    UPDATE sessions
    SET expiresAt = DATETIME( "now", ? )
    WHERE token = ? AND expiresAt > DATETIME( "now" )
    RETURNING userId
  ` )
  static readonly #updateExpirationByUserQuery = db.prepare( `
    UPDATE sessions
    SET expiresAt = DATETIME( "now", ? )
    WHERE userId = ? AND expiresAt > DATETIME( "now" )
    RETURNING token
  ` )

  static get expirationTimeMilis() {
    return 1000 * 60 * Session.expirationTimeMinutes
  }

  expiresAt = new Date( Date.now() + Session.expirationTimeMilis )

  constructor(
    public token:string,
    public userId:string,
  ) {}

  static async create( userId:string ) {
    const activeSession = Session.getByUser( userId )
    if (activeSession) return activeSession

    const token = crypto.randomUUID()
    const session = new Session( token, userId )

    Session.#inserQuery.run({ $token:session.token, $userId:session.userId, $expiresAt:session.expiresAt.toISOString() })

    return session
  }

  static get( token:string ) {
    const session = Session.#updateExpirationQuery.get( `+${Session.expirationTimeMinutes} minutes`, token ) as { userId: string } | null
    return session && new Session( token, session.userId )
  }

  static getByUser( userId:string ) {
    const session = Session.#updateExpirationByUserQuery.get( `+${Session.expirationTimeMinutes} minutes`, userId ) as { token: string } | null
    return session && new Session( session.token, userId )
  }

  static deleteByUser( id:string ) {
    Session.#deletebyUserQuery.run( id )
  }

  static filterByTime() {
    Session.#deleteOutdatedQuery.run()
  }
}

Session.filterByTime()
setInterval( () => Session.filterByTime(), 1000 * 60 * 15 )
