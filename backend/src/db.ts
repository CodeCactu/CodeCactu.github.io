import { Database } from "bun:sqlite"

const db = new Database( `data/db.sqlite`, { create:true } )

export default db
