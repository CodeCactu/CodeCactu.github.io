import db from "@/db"

export type CategoryName = string
export type GameId = string
export type UserVotes = Record<
  CategoryName,
  Record<`` | string, GameId[]>
>

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

const initialVotes = {
  theme: {
    uncategorised: [ `1`, `2`, `3` ],
  },
} satisfies UserVotes


export function getVotes( userId?:string ) {
  const lastVotesResult = userId
    ? getVotesQuery.get( userId ) as null | { userId: string, votesJson: string }
    : getAllVotesQuery.get() as null | { userId: string, votesJson: string }

  if (!lastVotesResult) return initialVotes

  const lastVotes = JSON.parse( lastVotesResult.votesJson )
  return lastVotes
}

export function saveVotes( userId:string, votes:UserVotes ) {
  saveVotesQuery.run({ $userId:userId, $votes:JSON.stringify( votes ) })
}
