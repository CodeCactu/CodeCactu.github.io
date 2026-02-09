import { Game } from "./Game"

export async function getGamesEndpoint() {
  return Response.json({ games:await Game.getGames() })
}
