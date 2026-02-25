import { useQuery } from "@tanstack/react-query"
import httpBackend from "./httpBackend"

export type CactuJamUserVotes = Record<
  string,
  Record<string, string[]>
>

const cactuJamUserVotesUrl = `/games/votes/@my`
export function loadCactuJamUserVotes() {
  return httpBackend.get<{ votes: CactuJamUserVotes }>( cactuJamUserVotesUrl, { credentials:`include` } )
    .then( r => r.votes )
}

export function saveCactuJamUserVotes( votes:CactuJamUserVotes ) {
  return httpBackend.put( cactuJamUserVotesUrl, { votes }, { credentials:`include` } )
}

export function useUserCactuJamUserVotes( isUser:boolean ) {
  return useQuery({
    enabled: isUser,
    queryKey: [ cactuJamUserVotesUrl ],
    queryFn: () => loadCactuJamUserVotes(),
  })
}
