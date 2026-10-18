import { queryClient } from "../queryClient"
import fetchCactu from "./fetchCactu"

export type GameId = string
export type CactuJamUserComments = Record<GameId, string>

const urn = `/api/games/comments/@my`

export function loadCactuJamUserComments() {
  return fetchCactu<{ comments: CactuJamUserComments }>( urn, { credentials:`include` } ).then( r => r.comments )
}

export function saveCactuJamUserComment( gameId:GameId, comment:string ) {
  return fetchCactu<{ gameId: string, comment: string }>( urn, {
    method: `PUT`,
    body: { gameId, comment },
    credentials: `include`,
  })
}

export function queryCactuJamComments() {
  return queryClient.query({
    queryKey: [ urn ],
    queryFn: () => loadCactuJamUserComments(),
  })
}
