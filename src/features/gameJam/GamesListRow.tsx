import { useEffect, useState, useRef } from "react"
import download from "@lib/core/functions/download"
import { usePopupsContext } from "@lib/Popup/PopupsContext"
import { createStylesHook } from "@fet/theming"
import Row from "@fet/flow/Row"
import DiscordAvatar from "@fet/discordIntegration/DiscordAvatar"
import Button from "@fet/controls/Button"
import { getServerUrl } from "../../config"
import VoteTile from "./VoteTile"
import { categories, GameItemWithVotes } from "./GameJamVoting"
import DescriptionPopup from "./DescriptionPopup"

export type GamesListRowProps = {
  game: GameItemWithVotes
  onUpdate?: (game) => void
}

export default function GamesListRow({ game:orginalGame, onUpdate }:GamesListRowProps) {
  const [ classes ] = useStyles()
  const [ game, setGame ] = useState<GameItemWithVotes>( orginalGame )
  const { createPopup } = usePopupsContext()
  const firstRenderRef = useRef( true )

  const { filename, user, votes } = game
  const votesIsNotConsideredColor = Object.values( votes ).includes( null )
  const showDescription = () => createPopup( <DescriptionPopup /> )
  const updateVote = (categoryName:string, score:number) => {
    setGame( g => ({
      ...g,
      votes: {
        ...g.votes,
        [ categoryName ]: score,
      },
    }) )
  }

  useEffect( () => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    onUpdate?.( game )
  }, [ game ] )

  return (
    <div className={classes.row}>
      <DiscordAvatar className={classes.avatar} userId={user.id} avatarId={user.avatar} username={user.username} />

      <div className={classes.userData}>
        <div>Praca użytkownika {user.username}</div>

        <Row spaced justify="center" className={classes.votes}>
          {categories.map( c => <VoteTile key={c.name} notConsidered={votesIsNotConsideredColor} category={c} score={votes?.[ c.name ] ?? `-`} onUpdateVote={updateVote} /> )}
        </Row>
      </div>

      <Button className={classes.description} variant="outlined" onClick={() => showDescription()} body="Opis kategorii" />

      <Button className={classes.download} variant="outlined" onClick={() => download( filename, `${getServerUrl()}/cactujam/games/${filename}` )} body="Pobierz" />
    </div>
  )
}



const useStyles = createStylesHook( ({ atoms }) => ({
  row: {
    display: `grid`,
    gridTemplate: `"avatar data desc down" / 50px 1fr max-content`,
    alignItems: `center`,
    gap: atoms.spacing.main,

    [ atoms.breakpoints.bigMobile.mediaQueryMax ]: {
      gridTemplate: `"avatar desc" "data data" / 1fr max-content`,
    },
  },

  jamProductionsList: {
    width: atoms.sizes.columnWidth,
    marginTop: atoms.spacing.main,
  },
  avatar: {
    gridArea: `avatar`,
    width: 50,
    height: 50,
    borderRadius: `50%`,
  },
  userData: {
    gridArea: `data`,
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
    gap: atoms.spacing.main,
  },

  votes: {
    [ atoms.breakpoints.mobile.mediaQuery ]: {
      gap: atoms.spacing.main / 2,
    },
  },

  description: {
    gridArea: `desc`,
  },

  download: {
    gridArea: `down`,

    [ atoms.breakpoints.bigMobile.mediaQueryMax ]: {
      display: `none`,
    },
  },
}) )
