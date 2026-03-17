import { useEffect, useState } from "react"
import { CarouselDataHookReturnValue } from "@lib/core/flow/Carousel/useCarouselData"

export default function useCarouselTimer( seconds:number, { scroll, currentCardIndex }:CarouselDataHookReturnValue, initialWorkingState = true ) {
  if (seconds <= 0) throw new Error( `Secounds should be bigger than 0.` )

  const [ isWorking, setIsWorking ] = useState( initialWorkingState )

  useEffect( () => {
    if (!isWorking) return

    const timeoutId = window.setTimeout( () => scroll( 1 ), 1000 * seconds )
    return () => window.clearTimeout( timeoutId )
  }, [ scroll, currentCardIndex, seconds, isWorking ] )

  return [ isWorking, setIsWorking ] as const
}
