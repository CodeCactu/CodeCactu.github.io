import { useEffect } from "react"
import useArrayState from "@lib/core/hooks/useArrayState"
import { createStylesHook } from "@fet/theming"
import GamesListRow from "@fet/gameJam/GamesListRow"
import { GameItemWithNullableVotes, GameItemWithVotes, GameVote } from "@fet/gameJam/GameJamVoting"
import logout from "@fet/discordIntegration/logout"
import { useIntegratedUserContext } from "@fet/discordIntegration/IntegratedUserContext"
import { User } from "@fet/discordIntegration/DiscordLinking"
import Surface from "@fet/contentContainers/Surface"
import backendHttp from "@fet/backendHttp"

export type GameItem = {
  id: number
  filename: string
  user: User
}

export default function JamProductionList() {
  const [ list, { push, clear } ] = useArrayState<GameItemWithNullableVotes>()
  const [ classes ] = useStyles()
  const { user } = useIntegratedUserContext()

  const fetchGames = async() => {
    type VoteRes = { votes: GameVote[] } | { code: 4030 }

    const [ itemsReqRes, votesReqRes ] = await Promise.all([
      backendHttp.get<{games: GameItem[]}>( `/cactujam/games` ),
      user && backendHttp.get<VoteRes>( `/cactujam/games/votes` ),
    ])

    const [ itemsRes, votesRes ] = [ itemsReqRes[ 0 ], votesReqRes?.[ 0 ] ]

    if (!itemsRes?.games) return
    if (votesRes && `code` in votesRes) {
      if (votesRes.code === 4030) return logout()
    }

    const gamesWithVotes = itemsRes.games.map( g => {
      const votes = !votesRes || !(`votes` in votesRes) ? undefined : (votesRes.votes.find( v => v.gameId === g.id ) ?? null)

      return {
        ...g,
        votes: votes === undefined ? null : {
          impressions: votes?.impressions ?? null,
          readability: votes?.readability ?? null,
          realisation: votes?.realisation ?? null,
          trait: votes?.trait ?? null,
          subject: votes?.subject ?? null,
        },
      }
    } )

    clear()
    push( ...gamesWithVotes )
  }

  const onUpdate = async(game:GameItemWithVotes) => {
    await backendHttp.put( `/cactujam/games/votes`, { gameId:game.id, votes:game.votes } )
    fetchGames()
  }

  useEffect( () => { fetchGames() }, [ user ] )

  return !list.length ? null : (
    <Surface className={classes.jamProductionsList}>
      {list.map( g => <GamesListRow key={g.filename} game={g} onUpdate={onUpdate} /> )}
    </Surface>
  )
}

const useStyles = createStylesHook( ({ atoms }) => ({
  jamProductionsList: {
    display: `flex`,
    flexDirection: `column`,
    gap: atoms.spacing.main * 2,
    width: atoms.sizes.columnWidth,
    marginTop: atoms.spacing.main,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: `50%`,
  },
}) )
