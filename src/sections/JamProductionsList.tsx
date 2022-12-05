import { useEffect } from "react"
import http from "@lib/http"
import useArrayState from "@lib/core/hooks/useArrayState"
import { createStylesHook } from "@fet/theming"
import GamesListRow from "@fet/gameJam/GamesListRow"
import { GameItemWithVotes, GameVote } from "@fet/gameJam/GameJamVoting"
import { User } from "@fet/discordIntegration/DiscordLinking"
import Surface from "@fet/contentContainers/Surface"
import backendHttp from "@fet/backendHttp"
import { getServerApiUrl  } from "../config"

export type GameItem = {
  id: number
  filename: string
  user: User
}

export default function JamProductionList() {
  const [ list, { push, clear } ] = useArrayState<GameItemWithVotes>()
  const [ classes ] = useStyles()

  useEffect( () => {
    Promise.all([
      backendHttp.get<{games: GameItem[]}>( `/cactujam/games` ),
      backendHttp.get<{votes: GameVote[]}>( `/cactujam/games/votes` ),
    ]).then( ([ itemsReqRes, votesReqRes ]) => {
      const [ itemsRes, votesRes ] = [ itemsReqRes[ 0 ], votesReqRes[ 0 ] ]

      if (!itemsRes?.games || !votesRes?.votes) return

      const gamesWithVotes = itemsRes.games.map( g => ({
        ...g,
        votes: votesRes.votes.find( v => v.gameId === g.id ) ?? {
          impressions: null,
          readability: null,
          realisation: null,
          subject: null,
        },
      }) )

      clear()
      push( ...gamesWithVotes )
    } )
  }, [] )

  return (
    <Surface className={classes.jamProductionsList}>
      {list.map( g => <GamesListRow key={g.filename} game={g} /> )}
    </Surface>
  )
}

const useStyles = createStylesHook( ({ atoms }) => ({
  jamProductionsList: {
    width: atoms.sizes.columnWidth,
    marginTop: atoms.spacing.main,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: `50%`,
  },
}) )
