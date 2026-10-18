import { queryClient } from "../queryClient"
import fetchCactu from "./fetchCactu"

export type CactuJamGameAuthor = {
  id: string
  name: string
  avatarUri: null | string
}

export type CactuJamGame = {
  id: string
  name: string
  description?: string
  author: CactuJamGameAuthor
  thumbnailUri: null | string
}

const urn = `/api/games`

export function loadCactuJamGames() {
  return fetchCactu<{ games: CactuJamGame[] }>( urn ).then( r => r.games )
}

export function queryCactuJamGames() {
  return queryClient.query({
    queryKey: [ urn ],
    queryFn: () => loadCactuJamGames(),
  })
}
