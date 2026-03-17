import httpBackend from "./httpBackend"

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

export function loadCactuJamGames() {
  return httpBackend.get<{ games: CactuJamGame[] }>( `/games` ).then( r => r.games )
}
