import { ReactNode, useRef } from "react"
import { usePopupContext } from "./PopupContext"

export type PopupProps = {
  children: ReactNode
  className?: string
  stayOpenAfterClickOutside?: boolean
}

export default function PopupBase({ children, className, stayOpenAfterClickOutside }:PopupProps) {
  const dialogRef = useRef( null )
  const ctx = usePopupContext()

  const handleClick:React.MouseEventHandler<HTMLDialogElement> = e => {
    if (e.target === dialogRef.current) ctx.resolve( undefined )
  }

  return (
    <dialog ref={dialogRef} open className={className} onClick={stayOpenAfterClickOutside ? undefined : handleClick}>
      {children}
    </dialog>
  )
}
