import { Promiseable } from "@lib/types/enhancedTypes"
import ElementChildren from "@lib/types/ElementChildren"
import { usePopupContext } from "../PopupContext"

export type PopupCloseButtonProps = ElementChildren & {
  onClick?: () => Promiseable<unknown>
}

export default function PopupCloseButton({ children, body, onClick }:PopupCloseButtonProps) {
  children ||= body

  const ctx = usePopupContext()

  if (!ctx) throw new Error( `Popup button cannot be used outside popup` )

  const handleOnClick = () => {
    ctx.resolve( onClick?.() )
  }

  return (
    <button onClick={handleOnClick}>
      {children}
    </button>
  )
}
