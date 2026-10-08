import db from "@/db"

export type CategoryName = string
export type GameId = string
export type UserVotes = Record<CategoryName, Record<string, GameId[]>>

type UserVotesRow = {
  userId: string
  updatedAt: string
  votesJson: string
}

db.run( `
  CREATE TABLE IF NOT EXISTS userVotes (
    userId    TEXT PRIMARY KEY,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    votesJson TEXT
  )
` )

const getAllVotesQuery = db.prepare( `SELECT userId, votesJson FROM userVotes` )
const getVotesQuery = db.prepare( `SELECT votesJson FROM userVotes WHERE userId = ?` )
const saveVotesQuery = db.prepare( `
  INSERT INTO userVotes (userId, votesJson)
  VALUES ($userId, $votes)
  ON CONFLICT(userId) DO UPDATE SET
    updatedAt = CURRENT_TIMESTAMP,
    votesJson = $votes
` )

export function getUserVotes( userId:string ) {
  const row = getVotesQuery.get( userId ) as Pick<UserVotesRow, `votesJson`> | null | undefined
  const userVotes:UserVotes = row ? JSON.parse( row.votesJson ) : {}

  return userVotes
}

export function getAllVotes() {
  const rows = getAllVotesQuery.all() as Pick<UserVotesRow, `userId` | `votesJson`>[]
  const allVotes:Record<string, UserVotes> = {}

  for (const row of rows) {
    allVotes[ row.userId ] = JSON.parse( row.votesJson )
  }

  return allVotes
}

export function saveVotes( userId:string, votes:UserVotes ) {
  saveVotesQuery.run({ $userId:userId, $votes:JSON.stringify( votes ) })
}
