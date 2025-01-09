import { getAuthHeader, User } from "@fet/auth/useDiscordLinking"
import { BACKEND_ORIGIN } from "../../config"
import { CactuJamCategory } from "./cactuJamCategories"

export type UserVotes = Record<string, number>

export function voteOnGame( user:User, category:CactuJamCategory, value:number ) {
  type Success = { success:true, votes:Record<string, UserVotes> }

  return fetch( `${BACKEND_ORIGIN}/api/voteOnGame/${user.id}`, {
    method: `PUT`,
    headers: { "Content-Type":`application/json`, ...getAuthHeader() },
    body: JSON.stringify({ categories:{ [ category.name ]:value } }),
  } ).then<Success>( res => res.json() )
}

export function getCurrentUserVotes() {
  type Success = { success:true, votes:Record<string, UserVotes> }
  type Failure = { success:false }

  return fetch( `${BACKEND_ORIGIN}/api/getMyVotes`, {
    method: `GET`,
    headers: { "Content-Type":`application/json`, ...getAuthHeader() },
  } ).then<Success | Failure>( res => res.json() )
}

export function getAllVotes() {
  type Success = { success:true, votes:Record<string, UserVotes> }
  type Failure = { success:false }

  return fetch( `${BACKEND_ORIGIN}/api/getAllVotes`, {
    method: `GET`,
    headers: { "Content-Type":`application/json`, ...getAuthHeader() },
  } ).then<Success | Failure>( res => res.json() )
}

export type UserJamGames = {
  user: User
  games: []
}

export function getJamGames() {
  type Success = { success:true, usersGames:Record<string, UserJamGames> }

  return fetch( `${BACKEND_ORIGIN}/api/fetchGames`, {
    method: `GET`,
    headers: { "Content-Type":`application/json`, ...getAuthHeader() },
  } ).then<Success>( res => res.json() )
}
