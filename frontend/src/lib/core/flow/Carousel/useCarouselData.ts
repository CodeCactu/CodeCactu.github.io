import { useRef, useState, RefObject, useCallback, useEffect } from "react"

export type ScrollFn = (jump:number, options?:{ smooth?: boolean, toIndex?: boolean }) => void
export type CarouselEnds = { left: boolean, right: boolean }
export type CarouselDataHookReturnValue = {
  scroll: ScrollFn
  updateCurrentCardIndex: () => void
  getAdditionalShift: () => number
  currentCardIndex: number
  scrollableAreaRef: RefObject<null | HTMLDivElement>
  maxVisibleCount: number
  minCardWidth: undefined | number
  cardsCountToShow: number
  extrasCount: number
  gap?: number
  offsets: undefined | number[]
  areCardsBiggerThanContainer: boolean
  noloop: boolean
}

export type CarouselDataHookConfig = {
  maxVisibleCount?: number
  minCardWidth?: number
  centered?: boolean
  noloop?: boolean
  gap?: number
}

export default function useCarouselData( { maxVisibleCount = 4, minCardWidth, centered, noloop = false, gap }:CarouselDataHookConfig = {} ) {
  const [ offsets, setOffsets ] = useState<undefined | number[]>( undefined )
  const [ cardsCountToShow, setCardsCountToShow ] = useState( maxVisibleCount )
  const [ areCardsBiggerThanContainer, setCardsBiggerThanContainer ] = useState( false )
  const scrollableAreaRef = useRef<HTMLDivElement>( null )
  const [ currentCardIndex, setCurrentCardIndex ] = useState<number>( 0 )
  const [ extrasCount, setExtrasCount ] = useState<number>( Math.ceil( cardsCountToShow ) )

  const getIndexWithitsOffset = (jump:number, toIndex = false) => {
    const scrollArea = scrollableAreaRef.current
    if (!scrollArea || !offsets) return { newIndex:-1, scrollOffsetIndex:-1 }

    const oneSideOffsetElements = noloop ? 0 : Math.ceil( extrasCount )
    const scrollValue = scrollArea.scrollLeft + getAdditionalShift() - 5
    const scrollOffsetIndex = toIndex ? oneSideOffsetElements + jump : offsets.findIndex( o => o >= scrollValue ) + jump
    const carouselElements = offsets.length - oneSideOffsetElements * 2
    if (!carouselElements) return { newIndex:-1, scrollOffsetIndex:-1 }

    const unbalancedNewIndex = (scrollOffsetIndex - oneSideOffsetElements) % carouselElements
    const newIndex = unbalancedNewIndex < 0 ? carouselElements + unbalancedNewIndex : unbalancedNewIndex

    return { newIndex, scrollOffsetIndex }
  }

  const updateCurrentCardIndex = useCallback( () => {
    const { newIndex } = getIndexWithitsOffset( 0 )
    if (newIndex !== -1) setCurrentCardIndex( newIndex )
  }, [ offsets?.length, offsets?.[ 1 ] ] )

  const getAdditionalShift = () => {
    const scrollArea = scrollableAreaRef.current
    if (!scrollArea) return 0
    return !centered ? 0 : (scrollArea.clientWidth / 2 - (gap ?? 0) / 2 )
  }

  const scroll = useCallback( (jump:number, { smooth = true, toIndex = false } = {}) => {
    const scrollArea = scrollableAreaRef.current
    if (!scrollArea || !offsets) return

    const { newIndex, scrollOffsetIndex } = getIndexWithitsOffset( jump, toIndex )
    if (newIndex === -1) return

    scrollArea.scrollTo({
      left: offsets[ scrollOffsetIndex ] - getAdditionalShift(),
      behavior: smooth ? `smooth` : `instant` as ScrollBehavior,
    })

    setCurrentCardIndex( newIndex )
  }, [ offsets?.length, offsets?.[ 1 ] ] )

  useEffect( () => {
    const handler = () => {
      const scrollArea = scrollableAreaRef.current
      if (!scrollArea) return

      let areCardsBiggerThanContainer = false
      const offsets = Array.from( scrollArea.childNodes ).map( node => {
        if (node.nodeType !== Node.ELEMENT_NODE) throw new Error( `Carousel nodes should be elements only` )
        const ele = node as HTMLElement

        areCardsBiggerThanContainer = ele.offsetLeft + ele.offsetWidth > ele.parentElement!.offsetWidth

        return ele.offsetLeft - ele.parentElement!.offsetLeft
      } )

      if (maxVisibleCount !== 0) {
        let newCardsCountToShow = maxVisibleCount
        if (minCardWidth) while (scrollArea.offsetWidth / newCardsCountToShow < minCardWidth) newCardsCountToShow--
        setCardsCountToShow( newCardsCountToShow )
      } else {
        let count = cardsCountToShow
        for (const offset of offsets) {
          if (offset > window.innerWidth) break
          count++
        }

        setExtrasCount( count )
      }

      setOffsets( offsets )
      setCardsBiggerThanContainer( areCardsBiggerThanContainer )
    }

    handler()
    window.addEventListener( `resize`, handler )
    return () => window.removeEventListener( `resize`, handler )
  }, [ scrollableAreaRef.current, scrollableAreaRef.current?.childNodes.length ] )

  const ctxValue:CarouselDataHookReturnValue = {
    scroll,
    updateCurrentCardIndex,
    getAdditionalShift,
    scrollableAreaRef,
    maxVisibleCount,
    minCardWidth,
    cardsCountToShow,
    extrasCount,
    offsets,
    areCardsBiggerThanContainer,
    noloop,
    currentCardIndex,
    gap,
  }

  return ctxValue
}
