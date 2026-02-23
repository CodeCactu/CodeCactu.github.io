import { promises as fs } from "node:fs"
import z from "zod"
import logInfo, { logColorInfo } from "@fet/loggers/logInfo"
import { User } from "@fet/auth/user"
import { getVotes, saveVotes } from "./votes"
import { categories } from "./categories"
import { Game } from "./Game"

export async function getGamesEndpoint() {
  return Response.json({ games:await Game.getGames() })
}

export async function getGamesCategoriesEndpoint() {
  return Response.json({ categories })
}

export async function getMyGamesVotesEndpoint( _:Bun.BunRequest, user:User ) {
  return Response.json({ votes:getVotes( user.id ) })
}

const updateScheme = z.object({
  votes: z.record(
    z.string().min( 1 ),
    z.record(
      z.string().regex( /^\d*/ ),
      z.array( z.string() ),
    ),
  ),
})

export async function updateMyGamesVotesEndpoint( req:Bun.BunRequest, user:User ) {
  const body = await req.json()
  const parsedVotes = updateScheme.safeParse( body )
  if (!parsedVotes.success) return Response.json( { code:`BAD_REQUEST` }, { status:400 } )

  const votes = parsedVotes.data.votes

  logInfo( `User `, { value:user.name, color:logColorInfo }, ` updated their votes:`, [ votes ] )
  saveVotes( user.id, votes )

  return Response.json({ votes })
}


export async function getUploadedResource( req:Bun.BunRequest<`/uploads/games/:gameId/:filename`> ) {
  const gamesPath = `./uploads/games`
  const uploadsDir = await fs.readdir( gamesPath ).catch( () => null )
  if (!uploadsDir) throw new Error( `Games uploads directory not found` )

  const gameDirName = uploadsDir.find( d => d.startsWith( req.params.gameId ) )
  if (!gameDirName) return Response.json( { code:`NOT_FOUND` }, { status:404 } )

  const file = Bun.file( `${gamesPath}/${gameDirName}/${req.params.filename}` )
  if (!file) return Response.json( { code:`NOT_FOUND` }, { status:404 } )

  return new Response( file )
}
