import React, { ReactNode, useEffect, useMemo, useRef } from "react"
import { ResponsivePropertyValue, updateResponsivePropertiesToStyle } from "@lib/core/flow/ResponsiveAreaNames"
import { makeSpacing, makeStyleSpacings, SpacingsValue } from "../makeStyleSpacings"
import cn from "../../functions/createClassName"
import { CarouselDataHookReturnValue } from "./useCarouselData"
import classes from "./Carousel.module.css"

export type CarouselProps = CarouselDataHookReturnValue & {
  children: React.ReactNode
  className?: string | { override: string }
  style?: React.CSSProperties
  noloop?: boolean
  margin?: ResponsivePropertyValue<SpacingsValue>
}

export default function Carousel({ children, className, style, cardsCountToShow, extrasCount, margin, offsets, noloop, scroll, getAdditionalShift, updateCurrentCardIndex, scrollableAreaRef, minCardWidth, gap }:CarouselProps) {
  const childArr = useMemo( () => React.Children.toArray( children ), [ children ] )
  const summarizedMainElementsIntersectionRatioRef = useRef( 0 )

  const finalClassname = typeof className === `object`
    ? cn( classes.itemContainer, className.override )
    : cn( classes.carousel, classes.itemContainer, className )

  const finalStyle = {
    ...style,
    "--count": cardsCountToShow === 0 ? undefined : cardsCountToShow,
    "--minCardWidth": !minCardWidth ? undefined : `${minCardWidth}px`,
    "--carousel-gap": !gap ? undefined : `${gap}px`,
  } as React.CSSProperties

  updateResponsivePropertiesToStyle( finalStyle, `margin`, margin, m => makeStyleSpacings( m, `margin` ), v => typeof v !== `object` && makeSpacing( v ) )

  useEffect( () => { // Initialisation, setting first card
    if (noloop) return

    const scrollArea = scrollableAreaRef.current
    if (!scrollArea) return

    scroll( 0, { smooth:false, toIndex:true } )
  }, [ children, noloop, scroll, cardsCountToShow ] ) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect( () => { // Scrolling detection and reaction
    const scrollArea = scrollableAreaRef.current
    if (!scrollArea || !offsets) return

    let scrollTimeout:number

    const handler = (e:Event) => {
      const target = (e.target as HTMLElement)
      const atSnappingPoint = target.scrollLeft % target.offsetWidth === 0
      const timeout = atSnappingPoint ? 150 : 140

      clearTimeout( scrollTimeout )
      scrollTimeout = window.setTimeout( () => {
        if (noloop || summarizedMainElementsIntersectionRatioRef.current > 0.5) return updateCurrentCardIndex()

        const currentOffsetIdx = offsets.findIndex( o => o >= scrollArea.scrollLeft + getAdditionalShift() - 5 )
        const newIndex = scrollArea.scrollLeft >= offsets[ extrasCount ]
          ? offsets.length - currentOffsetIdx - 1
          : offsets.length - extrasCount * 2 - Math.ceil( extrasCount / 2 )

        scroll( newIndex, { smooth:false, toIndex:true } )
      }, timeout )
    }

    scrollArea.addEventListener( `scroll`, handler )

    return () => {
      clearTimeout( scrollTimeout )
      scrollArea.removeEventListener( `scroll`, handler )
    }
  }, [ !!offsets, noloop, scroll, updateCurrentCardIndex ] ) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect( () => { // Setting intersection observer and calculating intersections
    if (!scrollableAreaRef.current) return

    const mainElementsIntersectionRatios = new Map()
    const cb = (entries:IntersectionObserverEntry[]) => {
      entries.forEach( e => mainElementsIntersectionRatios.set( e.target, e.intersectionRatio ) )
      const summarizedRatio = Array.from( mainElementsIntersectionRatios.values() ).reduce( (sum, v) => sum + v, 0 )
      summarizedMainElementsIntersectionRatioRef.current = summarizedRatio
    }

    const mainElements = scrollableAreaRef.current?.querySelectorAll( `:scope > :nth-child( n + ${extrasCount + 1} ):nth-last-child( n + ${extrasCount + 1} )` )
    const observer = new IntersectionObserver( cb, {
      root: scrollableAreaRef.current,
      threshold: [ 0, 0.01, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99, 1 ],
    } )

    Array.from( mainElements ).forEach( e => observer.observe( e ) )

    return () => observer.disconnect()
  }, [ !!scrollableAreaRef.current ] ) // eslint-disable-line react-hooks/exhaustive-deps

  if (noloop) return (
    <div ref={scrollableAreaRef} className={cn( finalClassname )} style={finalStyle}>
      {children}
    </div>
  )

  const [ extraPrev, extraNext ] = (() => {
    const prev:ReactNode[] = []
    const next:ReactNode[] = []

    for (let index = 0;  index < extrasCount;  index++) {
      prev.push( childArr[ childArr.length - 1 - index ] )
      next.push( childArr[ index ] )
    }

    prev.reverse()

    return [ prev, next ]
  })()

  return (
    <div ref={scrollableAreaRef} className={finalClassname} style={finalStyle}>
      {extraPrev}
      {children}
      {extraNext}
    </div>
  )
}
