import cn from "@lib/theming/createClassName"
import download from "@lib/core/functions/download"
import { usePopupsContext } from "@lib/Popup/PopupsContext"
import { createStylesHook } from "@fet/theming"
import Row, { useRowStyles } from "@fet/flow/Row"
import DiscordAvatar from "@fet/discordIntegration/DiscordAvatar"
import Button from "@fet/controls/Button"
import { getServerUrl } from "../../config"
import VoteTile from "./VoteTile"
import { categories, GameItemWithVotes } from "./GameJamVoting"
import DescriptionPopup from "./DescriptionPopup"

export type GamesListRowProps = {
  game: GameItemWithVotes
}

export default function GamesListRow({ game:{ user, filename, votes } }:GamesListRowProps) {
  const [ rowClasses ] = useRowStyles()
  const [ classes ] = useStyles()
  const { createPopup } = usePopupsContext()

  const showDescription = () => createPopup( <DescriptionPopup /> )

  return (
    <div className={cn( rowClasses.row, rowClasses.isSpaced, rowClasses.isJustifiedSpaceBetween )}>
      <DiscordAvatar className={classes.avatar} userId={user.id} avatarId={user.avatar} username={user.username} />

      <div className={classes.userData}>
        <div>Praca użytkownika {user.username}</div>

        <Row spaced justify="center">
          {categories.map( c => <VoteTile key={c.name} category={c} score={votes?.[ c.name ] ?? `-`} /> )}
        </Row>
      </div>

      <Row spaced>
        <Button variant="outlined" onClick={() => showDescription()} body="Opis kategorii" />

        <Button variant="outlined" onClick={() => download( filename, `${getServerUrl()}/cactujam/games/${filename}` )} body="Pobierz" />
      </Row>
    </div>
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
  userData: {
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
    gap: atoms.spacing.main,
  },
}) )
