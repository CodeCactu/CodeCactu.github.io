"use client"

import { useEffect, useRef } from "react"
import classes from "./TierList.module.css"

interface Game {
  id: number
  title: string
}

const tiers = [ `S`, `A`, `B` ]
const initialGames:Game[] = [
  { id:1, title:`Cyber Pustynia 2077` },
  { id:2, title:`Symulator Gotowania Ziemniaków` },
  { id:3, title:`Kosmiczny Skoczek` },
  { id:4, title:`Przygoda w Labiryncie` },
]

export default function TierList() {
  const dragAndDropContainerRef = useDragAndDrop()

  return (
    <div ref={dragAndDropContainerRef} className={classes.wrapper}>
      {
        tiers.map( tier => (
          <div key={tier} className={classes.tierRow}>
            <div className={classes.label}>{tier}</div>
            <div className={classes.dropArea} data-drop>
              {
                (tier === `S` ? initialGames.slice( 0, 1 ) : tier === `A` ? initialGames.slice( 1 ) : null)?.map( game => (
                  <div key={game.id} draggable className={classes.item}>
                    <span>{game.title}</span>
                    <span className={classes.handle}>☰</span>
                  </div>
                ) )
              }
            </div>
          </div>
        ) )
      }
    </div>
  )
}

function useDragAndDrop() {
  const containerRef = useRef<HTMLDivElement>( null )

  useEffect( () => {
    const container = containerRef.current
    if (!container) return

    const abortController = new AbortController()
    const activeAnimations = new WeakMap<HTMLElement, Animation>()
    let draggingElement:null | HTMLDivElement = null

    container.childNodes.forEach( child => {
      if (!(child instanceof HTMLElement)) return

      child.addEventListener( `dragenter`, e => {
        e.preventDefault()

        const target = e.target
        if (!(target instanceof HTMLElement)) return

        const underDrag = target.closest( `.${classes.item}, [data-drop]:empty` )
        if (!(underDrag instanceof HTMLElement)) return
        if (!draggingElement || underDrag === draggingElement || activeAnimations.has( underDrag )) return

        const draggingRect = draggingElement.getBoundingClientRect()
        const targetRect = underDrag.getBoundingClientRect()
        const animationOptions = {
          duration: 200,
          easing: `cubic-bezier(0.2, 0, 0, 1)`,
        }

        if (`drop` in underDrag.dataset) {
          /*
            Future code
            const offsets = { x:0, y:0 }
            const computedStyles = window.getComputedStyle( underDrag )
            offsets.x = parseInt( computedStyles.padding )
            offsets.y = parseInt( computedStyles.padding )
          */
          underDrag.insertAdjacentElement( `afterbegin`, draggingElement )
        } else {
          const insertEhere = draggingElement.parentElement === underDrag.parentElement && draggingRect.top < targetRect.top ? `afterend` : `beforebegin`

          underDrag.classList.add( classes.isDragOver )
          underDrag.insertAdjacentElement( insertEhere, draggingElement )

          const targetRectAfter = underDrag.getBoundingClientRect()
          const targetDeltaY = targetRect.top - targetRectAfter.top

          const targetAnim = underDrag.animate( [
            { transform:`translateY(${targetDeltaY}px)` },
            { transform:`translateY(0)` },
          ], animationOptions )

          activeAnimations.set( underDrag, targetAnim )

          targetAnim.onfinish = () => activeAnimations.delete( underDrag )
        }


        const deltaY = draggingRect.top - targetRect.top

        draggingElement.animate( [
          { transform:`translateY(${deltaY}px)` },
          { transform:`translateY(0)` },
        ], animationOptions )

      } )

      child.addEventListener( `dragleave`, e => {
        const related = e.relatedTarget

        if (related instanceof Node && !child.contains( related )) {
          child.classList.remove( classes.isDragOver )
        }
      } )
    } )

    container.addEventListener( `dragstart`, ({ target }) => {
      if (target instanceof HTMLDivElement && target.draggable) {
        draggingElement = target
      }
    }, { signal:abortController.signal } )

    container.addEventListener( `dragend`, () => {
      draggingElement = null
    }, { signal:abortController.signal } )

    return () => abortController.abort()
  }, [] )

  return containerRef
}
