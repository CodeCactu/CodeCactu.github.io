import { usePopupsContext } from "@lib/Popup/PopupsContext"
import { createStylesHook } from "@fet/theming"
import Button from "@fet/controls/Button"
import VotingPopup from "./VotingPopup"
import { Category } from "./GameJamVoting"

export type VoteTileProps = {
  category: Category
  score: number
}

export default function VoteTile({ category, score }:VoteTileProps) {
  const [ classes ] = useStyles()
  const { createPopup } = usePopupsContext()

  const showVoteOptions = () => createPopup( <VotingPopup category={category} /> )

  return (
    <Button variant="outlined" className={classes.voteTile} onClick={() => showVoteOptions()}>
      <span className={classes.score}>{score}</span>
      <span className={classes.title}>{category.title}</span>
    </Button>
  )
}

const useStyles = createStylesHook( ({ atoms }) => ({
  voteTile: {
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
    borderWidth: 1,
    padding: 0,
    width: 45,
  },

  score: {
    color: atoms.colors.primary.main,
  },

  title: {
    fontSize: `0.5em`,
  },
}) )
