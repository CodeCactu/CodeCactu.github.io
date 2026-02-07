"use client"

import { useEffect } from "react"

export type ButtonProps = {
  ref?: React.Ref<HTMLButtonElement>
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  onClick?: null | ((e?:React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void)
  onKey?: string
  disabled?: boolean
  type?: `submit` | `button`
  ariaLabel?: string
  ariaCurrent?: `page` | `step` | `location` | `date` | `time` | boolean
}

export default function ButtonInteractions({ onKey, onClick, ariaCurrent, ariaLabel, ...props }:ButtonProps) {
  useEffect( () => {
    if (!onKey) return

    const handler = (e:KeyboardEvent) => {
      if (onKey !== e.key) return

      e.preventDefault()
      e.stopPropagation()
      onClick?.()
    }

    window.addEventListener( `keydown`, handler )
    return () => window.removeEventListener( `keydown`, handler )
  }, [ onKey, onClick ] )

  return (
    <button
      {...props}
      onClick={onClick || undefined}
      aria-disabled={props.disabled ? true : undefined}
      aria-current={ariaCurrent}
      aria-label={ariaLabel}
    >
      {props.children}
    </button>
  )
}
