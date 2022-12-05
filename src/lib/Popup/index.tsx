import { ReactNode } from "react"
import createStylesHook from "@lib/theming/createStylesHook"
import { PopupContextProvider, PopupResolver } from "./PopupContext"

export type PopupProps = {
  resolver: PopupResolver
  body: ReactNode
}

export default function Popup({ resolver, body }:PopupProps) {
  const [ classes ] = useStyles()
  return (
    <dialog className={classes.popup} open>
      <PopupContextProvider resolver={resolver}>
        {body}
      </PopupContextProvider>
    </dialog>
  )
}

const useStyles = createStylesHook({
  popup: {
    position: `fixed`,
    left: 0,
    top: 0,
    backgroundColor: `transparent`,
    border: `none`,
    zIndex: 1000,
    padding: 0,
  },
})
