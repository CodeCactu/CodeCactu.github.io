import httpBackend from "./httpBackend"

export type CactuJamUserVotes = Record<
  string,
  Record<string, string[]>
>

export function loadCactuJamUserVotes() {
  return httpBackend.get<{ votes: CactuJamUserVotes }>( `/games/votes/@my`, { credentials:`include` } )
    .then( r => r.votes )
}

export function saveCactuJamUserVotes( votes:CactuJamUserVotes ) {
  return httpBackend.put( `/games/votes/@my`, { votes }, { credentials:`include` } )
}
