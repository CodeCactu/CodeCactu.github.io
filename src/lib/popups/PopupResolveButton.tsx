"use client"

import { useEffect } from "react"
import Button, { ButtonProps } from "../core/controls/Button"
import { usePopupContext } from "./PopupContext"

export type PopupResolveButtonProps = ButtonProps

export default function PopupResolveButton({ children, body, onClick, ...btnProps }:PopupResolveButtonProps) {
  children ||= body

  const ctx = usePopupContext()

  return (
    <Button {...btnProps} onClick={() => ctx.resolve( onClick?.() )}>
      {children}
    </Button>
  )
}

export function usePopupResolver( escape:undefined | boolean ) {
  const ctx = usePopupContext()

  useEffect( () => {
    if (!escape) return

    const handler = (e:KeyboardEvent) => {
      if (e.key !== `Escape`) return

      e.preventDefault()
      e.stopPropagation()
      window.removeEventListener( `keydown`, handler )
      ctx.resolve( undefined )
    }

    window.addEventListener( `keydown`, handler )
    return () => window.removeEventListener( `keydown`, handler )
  }, [ escape ] )

  return ctx.resolve
}
