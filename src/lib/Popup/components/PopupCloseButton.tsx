import { Promiseable } from "@lib/types/enhancedTypes"
import ElementChildren from "@lib/types/ElementChildren"
import Button, { ButtonProps } from "@fet/controls/Button"
import { usePopupContext } from "../PopupContext"

export type PopupCloseButtonProps = ElementChildren & ButtonProps & {
  onClick?: () => Promiseable<unknown>
}

export default function PopupCloseButton({ children, body, onClick, ...props }:PopupCloseButtonProps) {
  children ||= body

  const ctx = usePopupContext()

  if (!ctx) throw new Error( `Popup button cannot be used outside popup` )

  const handleOnClick = () => {
    ctx.resolve( onClick?.() )
  }

  return (
    <Button {...props} onClick={handleOnClick}>
      {children}
    </Button>
  )
}
