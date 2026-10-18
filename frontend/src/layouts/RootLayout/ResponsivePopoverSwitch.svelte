<script lang="ts">
  import { onMount } from "svelte"

  let { mediaQuery = `(max-aspect-ratio: 2 / 3)` }:{
    mediaQuery?: string
  } = $props()

  onMount( () => {
    const mediaQueryList = window.matchMedia( mediaQuery )
    const elements = document.querySelectorAll<HTMLElement>( `[data-responsive-popover]` )

    const initialPopoverValues = new WeakMap<HTMLElement, string | null>()

    elements.forEach( ( el ) => {
      initialPopoverValues.set( el, el.getAttribute( `popover` ) )
    } )

    const handleMediaQueryChange = ( matches: boolean ) => {
      elements.forEach( ( el ) => {
        if ( matches ) {
          const originalVal = initialPopoverValues.get( el )
          el.setAttribute( `popover`, originalVal !== null ? ( originalVal || `auto` ) : `auto` )
        } else {
          el.removeAttribute( `popover` )
        }
      } )
    }

    handleMediaQueryChange( mediaQueryList.matches )

    const listener = ( e: MediaQueryListEvent ) => handleMediaQueryChange( e.matches )
    mediaQueryList.addEventListener( `change`, listener )

    return () => {
      mediaQueryList.removeEventListener( `change`, listener )
    }
  } )
</script>