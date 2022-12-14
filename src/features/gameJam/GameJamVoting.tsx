import { TbHelp } from "react-icons/tb"
import { useState, useEffect } from "react"
import { usePopupsContext } from "@lib/Popup/PopupsContext"
import { createStylesHook } from "@fet/theming"
import Row from "@fet/flow/Row"
import Column from "@fet/flow/Column"
import { User } from "@fet/discordIntegration/DiscordLinking"
import Button from "@fet/controls/Button"
import Span from "@fet/Text/Span"
import VotingPopup from "./VotingPopup"

export type GameItem = {
  id: number
  filename: string
  user: User
}

export type Votes = {
  subject: null | number
  impressions: null | number
  realisation: null | number
  readability: null | number
}

export type GameVote = Votes & {
  id: number
  userId: string
  gameId: number
}

export type GameItemWithNullableVotes = GameItem & {
  votes: null | Votes
}

export type GameItemWithVotes = GameItem & {
  votes: Votes
}

export type GameJamVotingProps = {
  game: GameItemWithVotes
  onUpdate?: (votes:Votes) => void
}

export const categories = [
  { name:`subject`, scale:3, title:`Temat` },
  { name:`impressions`, scale:5, title:`Wrażenia` },
  { name:`realisation`, scale:5, title:`Realizacja` },
  { name:`readability`, scale:3, title:`Czytelność` },
]

export type Category = (typeof categories)[number]

export default function GameJamVoting({ game, onUpdate }:GameJamVotingProps) {
  const [ classes ] = useStyles()
  const { createPopup } = usePopupsContext()
  const [ votes, setVotes ] = useState<Votes>(
    categories.reduce( (obj, c) => ({ ...obj, [ c.name ]:game.votes?.[ c.name ] ?? null }), {} as Votes ),
  )

  const showVotes = (category:Category) => createPopup( <VotingPopup category={category} /> )
    .then( vote => setVotes( v => ({ ...v, [ category.name ]:vote }) ) )

  useEffect( () => {
    onUpdate?.( votes )
  }, [ votes ] )

  return (
    <Column>
      {
        categories.map( category => {
          const gameVote = votes[ category.name ] ?? `-`

          return (
            <Row key={category.name} spaced>
              <Span>{category.title}</Span>
              <Button variant="clean" className={classes.help} body={<TbHelp />} />
              <Button variant="outlined" onClick={() => showVotes( category )} body={gameVote} />
            </Row>
          )
        } )

      }
    </Column>
  )
}

const useStyles = createStylesHook( ({ atoms }) => ({
  help: {
    color: atoms.colors.primary.main,
  },
}) )
