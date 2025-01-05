import { getAuthHeader, User } from "@fet/auth/useDiscordLinking"
import { BACKEND_ORIGIN } from "../../config"
import { CactuJamCategory } from "./cactuJamCategories"

export function voteOnGame( user:User, category:CactuJamCategory, value:number ) {
  return fetch( `${BACKEND_ORIGIN}/api/voteOnGame/${user.id}`, {
    method: `PUT`,
    headers: { "Content-Type":`application/json`, ...getAuthHeader() },
    body: JSON.stringify({ categories:{ [ category.name ]:value } }),
  } ).then( res => res.json() )
}

export function getCurrentUserVotes() {
  return fetch( `${BACKEND_ORIGIN}/api/getMyVotes`, {
    method: `GET`,
    headers: { "Content-Type":`application/json`, ...getAuthHeader() },
  } ).then( res => res.json() )
}
