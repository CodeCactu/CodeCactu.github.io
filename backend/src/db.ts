import { Database } from "bun:sqlite"

const db = new Database( `db.sqlite`, { create:true } )

export default db
