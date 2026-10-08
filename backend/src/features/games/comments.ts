import db from "@/db"

export type GameId = string
export type UserComments = Record<GameId, string>

type UserCommentsRow = {
  userId: string
  gameId: string
  comment: string
  updatedAt: string
}

db.run( `
  CREATE TABLE IF NOT EXISTS userComments (
    userId    TEXT NOT NULL,
    gameId    TEXT NOT NULL,
    comment   TEXT NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, gameId)
  )
` )

const getAllCommentsQuery = db.prepare( `SELECT userId, gameId, comment FROM userComments` )
const getCommentsQuery = db.prepare( `SELECT gameId, comment FROM userComments WHERE userId = ?` )
const deleteCommentQuery = db.prepare( `DELETE FROM userComments WHERE userId = $userId AND gameId = $gameId` )
const saveCommentQuery = db.prepare( `
  INSERT INTO userComments (userId, gameId, comment)
  VALUES ($userId, $gameId, $comment)
  ON CONFLICT(userId, gameId) DO UPDATE SET
    updatedAt = CURRENT_TIMESTAMP,
    comment = $comment
` )

export function getUserComments( userId:string ) {
  const rows = getCommentsQuery.all( userId ) as Pick<UserCommentsRow, `gameId` | `comment`>[]
  const userComments:UserComments = {}

  for (const row of rows) {
    userComments[ row.gameId ] = row.comment
  }

  return userComments
}

export function getAllComments() {
  const rows = getAllCommentsQuery.all() as Pick<UserCommentsRow, `userId` | `gameId` | `comment`>[]
  const allComments:Record<string, UserComments> = {}

  for (const row of rows) {
    if (!allComments[ row.userId ]) allComments[ row.userId ] = {}
    allComments[ row.userId ][ row.gameId ] = row.comment
  }

  return allComments
}

export function saveComment( userId:string, gameId:GameId, comment:string ) {
  const trimmedComment = comment.trim()

  if (!trimmedComment) {
    deleteCommentQuery.run({ $userId:userId, $gameId:gameId })
    return
  }

  saveCommentQuery.run({ $userId:userId, $gameId:gameId, $comment:trimmedComment })
}
