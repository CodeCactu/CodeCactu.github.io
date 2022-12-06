import PopupCloseButton from "@lib/Popup/components/PopupCloseButton"
import { createStylesHook } from "@fet/theming"
import Surface from "@fet/contentContainers/Surface"

export type VotingPopupProps = {}

export default function DescriptionPopup() {
  const [ classes ] = useStyles()

  return (
    <Surface className={classes.popup}>
      <PopupCloseButton />

      <dl>
        <dt>Temat</dt>
        <dd>Opis tematu</dd>

        <dt>Temat</dt>
        <dd>Opis tematu</dd>
      </dl>
    </Surface>
  )
}

const useStyles = createStylesHook({
  popup: {
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    width: `100vw`,
    height: `100vh`,
    zIndex: 1000,
    backdropFilter: `blur( 3px )`,
  },
})
