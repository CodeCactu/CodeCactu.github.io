import { useEffect, useState, useRef } from "react"
import { usePopupsContext } from "@lib/Popup/PopupsContext"
import { createStylesHook } from "@fet/theming"
import Row from "@fet/flow/Row"
import { useIntegratedUserContext } from "@fet/discordIntegration/IntegratedUserContext"
import DiscordAvatar from "@fet/discordIntegration/DiscordAvatar"
import Button from "@fet/controls/Button"
import VoteTile from "./VoteTile"
import { categories, GameItemWithNullableVotes, Votes } from "./GameJamVoting"
import DescriptionPopup from "./DescriptionPopup"

export type GamesListRowProps = {
  game: GameItemWithNullableVotes
  onUpdate?: (game) => void
}

export default function GamesListRow({ game, onUpdate }:GamesListRowProps) {
  const [ classes ] = useStyles()
  const [ votes, setVotes ] = useState<null | Votes>( game.votes )
  const { createPopup } = usePopupsContext()
  const { user:discorduser } = useIntegratedUserContext()
  const firstRenderRef = useRef( true )

  const { user } = game
  const votesIsNotConsideredColor = !votes || Object.values( votes ).includes( null )
  const showDescription = () => createPopup( <DescriptionPopup /> )
  const updateVote = (categoryName:string, score:number) => {
    setVotes( v => !v ? null : {
      ...v,
      [ categoryName ]: score,
    } )
  }

  useEffect( () => { setVotes( game.votes ) }, [ game.votes && Object.values( game.votes ).reduce( (str, n) => str + (n ?? `X`), `` ) ] )
  useEffect( () => {
    if (!votes) return
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    onUpdate?.({ ...game, votes })
  }, [ votes ] )

  return (
    <div className={classes.row}>
      <DiscordAvatar className={classes.avatar} userId={user.id} avatarId={user.avatar} username={user.username} />

      <div className={classes.userData}>
        <div>Praca użytkownika {user.username}</div>

        {
          discorduser && (
            <Row spaced justify="center" className={classes.votes}>
              {categories.map( c => <VoteTile key={c.name} notConsidered={votesIsNotConsideredColor} category={c} score={votes?.[ c.name ] ?? `-`} onUpdateVote={updateVote} /> )}
            </Row>
          )
        }
      </div>

      <Button className={classes.description} variant="outlined" onClick={() => showDescription()} body="Opis kategorii" />

      {/* <Button className={classes.download} variant="outlined" onClick={() => download( filename, `${getServerUrl()}/cactujam/games/${filename}` )} body="Pobierz" /> */}
    </div>
  )
}



const useStyles = createStylesHook( ({ atoms }) => ({
  row: {
    position: `relative`,
    display: `grid`,
    gridTemplate: `"avatar data desc down" / 50px 1fr max-content`,
    alignItems: `center`,
    gap: atoms.spacing.main,

    [ atoms.breakpoints.bigMobile.mediaQueryMax ]: {
      gridTemplate: `"avatar desc" "data data" / 1fr max-content`,
    },

    "&:not( :first-child )::before": {
      content: `""`,
      position: `absolute`,
      left: `50%`,
      top: -atoms.spacing.main,
      transform: `translateX( -50% )`,
      width: `90%`,
      height: 1,
      backgroundColor: atoms.colors.rest.green,

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
