import cn from "@lib/theming/createClassName"
import { usePopupsContext } from "@lib/Popup/PopupsContext"
import { createStylesHook } from "@fet/theming"
import Button from "@fet/controls/Button"
import VotingPopup from "./VotingPopup"
import { Category } from "./GameJamVoting"

export type VoteTileProps = {
  category: Category
  score: number
  notConsidered?: boolean
  onUpdateVote: (categoryName:string, score:number) => void
}

export default function VoteTile({ category, score, notConsidered, onUpdateVote }:VoteTileProps) {
  const [ classes ] = useStyles()
  const { createPopup } = usePopupsContext()

  console.log({ notConsidered })
  const fullClassName = cn( classes.voteTile, notConsidered && classes.notConsidered )
  const showVoteOptions = () => createPopup( <VotingPopup category={category} /> )
    .then( score => onUpdateVote( category.name, score ) )

  return (
    <Button variant="outlined" className={fullClassName} onClick={() => showVoteOptions()}>
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

  notConsidered: {
    "--color": atoms.colors.rest.red,
    color: `var( --color )`,
    borderColor: `var( --color )`,

    "&:hover": {
      "--color": atoms.colors.primary.main,
    },
  },

  score: {
    color: `var( --color, ${atoms.colors.primary.main} )`,
  },

  title: {
    fontSize: `0.5em`,
  },
}) )
