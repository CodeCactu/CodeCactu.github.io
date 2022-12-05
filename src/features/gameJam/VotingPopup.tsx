import { usePopupContext } from "@lib/Popup/PopupContext"
import { createStylesHook } from "@fet/theming"
import Row from "@fet/flow/Row"
import Column from "@fet/flow/Column"
import Button from "@fet/controls/Button"
import Surface from "@fet/contentContainers/Surface"
import Text from "@fet/Text"
import { Category } from "./GameJamVoting"

export type VotingPopupProps = {
  category: Category
}

export default function VotingPopup({ category:{ title, scale } }:VotingPopupProps) {
  const { resolve } = usePopupContext()
  const [ classes ] = useStyles()

  return (
    <Surface className={classes.popup}>
      <Column>
        <Text as="h3" body={title} />

        <Row spaced>
          {
            Array.from( { length:scale }, (_, i) => (
              <label key={i}>
                <input type="radio" hidden />
                <Button variant="outlined" onClick={() => resolve( i )} body={i} />
              </label>
            ) )
          }

        </Row>
      </Column>
    </Surface>
  )
}

const useStyles = createStylesHook( ({ atoms }) => ({
  popup: {
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    width: `100vw`,
    height: `100vh`,
    zIndex: 1000,
    backdropFilter: `blur( 3px )`,
  },
}) )
