import { useEffect, useRef } from "react"

export type ElementClickHookCallback = (clickedInside:boolean) => void

export type ElementClickHookConfig<TRef extends HTMLElement> = {
  cb: ElementClickHookCallback
  ref?: TRef
  activate: boolean
  withFocusChanges?: boolean
}

export default function useElementClick<TRef extends HTMLElement>({ cb, withFocusChanges, activate, ref }:ElementClickHookConfig<TRef> ) {
  const elementRef = useRef<TRef>( ref ?? null )

  useEffect( () => {
    if (activate !== undefined && !activate) return

    const element = elementRef.current
    if (!element) return

    const handleClick = (e:MouseEvent) => cb( e.composedPath().includes( element ) )
    const handleFocus = (e:FocusEvent) => cb( e.composedPath().includes( element ) )

    document.addEventListener( `click`, handleClick )
    if (withFocusChanges) document.addEventListener( `focusin`, handleFocus )

    return () => {
      document.removeEventListener( `click`, handleClick )
      if (withFocusChanges) document.removeEventListener( `focusin`, handleFocus )
    }
  }, [ activate, elementRef.current, withFocusChanges ] )

  return elementRef
}
