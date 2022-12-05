import { createStylesHook } from "@fet/theming"
import Button from "@fet/controls/Button"

export type VoteTileProps = {
  title: string
  score: number
}

export default function VoteTile({ title, score }:VoteTileProps) {
  const [ classes ] = useStyles()

  return (
    <Button variant="outlined" className={classes.voteTile}>
      <span className={classes.score}>{score}</span>
      <span className={classes.title}>{title}</span>
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
