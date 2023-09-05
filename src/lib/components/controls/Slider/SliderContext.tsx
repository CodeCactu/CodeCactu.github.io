import { createContext, useContext, ReactNode, useRef, useState, RefObject, MutableRefObject } from "react"

export type ScrollFn = (jump:number, ends?:{ smooth?: boolean; toIndex?: boolean }) => void
export type SliderEnds = { left: boolean; right: boolean }
export type SliderContextValue = {
  scroll: ScrollFn
  setReachedEnds: (ends:SliderEnds) => void
  reachedEnds: SliderEnds
  scrollableAreaRef: RefObject<HTMLDivElement>
  scrollableAreaGapRef: MutableRefObject<number>
}

export type SliderContextProviderProps = {
  children: ReactNode
  noloop?: boolean
}

export const SliderContext = createContext<SliderContextValue | undefined>( undefined )
export default SliderContext

export function SliderContextProvider({ children, noloop = false }:SliderContextProviderProps) {
  const [ reachedEnds, setReachedEnds ] = useState({ left:noloop, right:noloop })
  const scrollableAreaRef = useRef<HTMLDivElement>( null )
  const scrollableAreaGapRef = useRef( 0 )

  const scroll = (jump:number, { smooth = true, toIndex = false } = {}) => {
    const scrollArea = scrollableAreaRef.current

    if (!scrollArea) return

    const firstChild = scrollArea.children[ 0 ] as HTMLDivElement
    const scrollingFn = toIndex ? `scrollTo` : `scrollBy`
    const scrollLeft = (firstChild.offsetWidth + scrollableAreaGapRef.current) * jump

    scrollArea[ scrollingFn ]({
      left: scrollLeft,
      behavior: smooth ? `smooth` : `instant` as ScrollBehavior,
    })

    if (noloop) {
      if (scrollArea.scrollLeft === 0 && scrollLeft > 0) setReachedEnds({ left:false, right:false })
      else if (scrollArea.scrollWidth - scrollArea.clientWidth === scrollArea.scrollLeft && scrollLeft < 0) setReachedEnds({ left:false, right:false })
    }
  }

  const ctxValue:SliderContextValue = {
    scroll,
    setReachedEnds,
    reachedEnds,
    scrollableAreaRef,
    scrollableAreaGapRef,
  }

  return (
    <SliderContext.Provider value={ctxValue}>
      {children}
    </SliderContext.Provider>
  )
}

export function useSliderContext() {
  const ctx = useContext( SliderContext )
  if (!ctx) throw new Error( `Cannot use slider context outside slider context` )
  return ctx
}
