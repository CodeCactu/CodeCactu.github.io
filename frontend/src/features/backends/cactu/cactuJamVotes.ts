import { queryClient } from "../queryClient"
import fetchCactu from "./fetchCactu"

export type CategoryName = string
export type VotesInCategory = Record<string, string[]>
export type CactuJamUserVotes = Record<CategoryName, VotesInCategory>

const urn = `/api/games/votes/@my`

export function loadCactuJamUserVotes() {
  return fetchCactu<{ votes: CactuJamUserVotes }>( urn, { credentials:`include` } ).then( r => r.votes )
}

export function saveCactuJamUserVotes( votes:CactuJamUserVotes ) {
  return fetchCactu( urn, { method:`PUT`, body:{ votes }, credentials:`include` } )
}

export function queryCactuJamVotes() {
  return queryClient.query({
    queryKey: [ urn ],
    queryFn: () => loadCactuJamUserVotes(),
  })
}
