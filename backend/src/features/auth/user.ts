import db from "@/db"

db.run( `
  CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    createdAt   TEXT NOT NULL,
    name        TEXT NOT NULL,
    avatarHash  TEXT
  )
` )

export class User {
  static readonly expirationTimeMinutes = 30
  static readonly #inserQuery = db.prepare( `INSERT INTO users (id, createdAt, name, avatarHash) VALUES ($id, $createdAt, $name, $avatarHash)` )
  static readonly #selectQuery = db.prepare( `SELECT * FROM users WHERE id = ?` )

  constructor(
    public id:string,
    public createdAt:Date,
    public name:string,
    public avatarHash:null | string,
  ) {}

  get publicData() {
    return {
      name: this.name,
      discordId: this.id,
      avatarHash: this.avatarHash,
    }
  }

  static async getOrCreate( id:string, name:string, avatarHash:null | string ) {
    const existingUser = User.get( id )
    if (existingUser) return existingUser

    const newUser = new User( id, new Date(), name, avatarHash )

    User.#inserQuery.run({ $id:newUser.id, $createdAt:newUser.createdAt.toISOString(), $name:newUser.name, $avatarHash:avatarHash })

    return newUser
  }

  static get( id:string ) {
    const existingUser = User.#selectQuery.get( id ) as User | null
    return existingUser && new User( existingUser.id, existingUser.createdAt, existingUser.name, existingUser.avatarHash )
  }
}
