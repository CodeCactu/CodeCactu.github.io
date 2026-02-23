"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { cn } from "@lib/core/functions"
import { Text } from "@fet/flow/Text"
import { CactuJamGame } from "@fet/backend/games"
import { configClient } from "@/config.client"
import classes from "./TierList.module.css"

export type DragItem = CactuJamGame
export type DragItemTierAssignements = Record<string, DragItem[`name`][]>

export type DragAreaLists = Record<string, string[]>

type DragAndDropHookConfig = {
  onDragEnd?: (lists:DragAreaLists) => void
}

export type TierListProps = DragAndDropHookConfig & {
  highestValue: number
  items: DragItem[]
  assignements: DragItemTierAssignements
}

export default function TierList({ highestValue, items, assignements, ...dragAndDropHookConfig }:TierListProps) {
  const dragAndDropContainerRef = useDragAndDrop( dragAndDropHookConfig )

  const renderdropArea = (ids:undefined | DragItem[`id`][]) => ids?.map( id => {
    const item = items.find( i => i.id == id )
    if (!item) throw new Error( `item "${id}" not found` )
    return (
      <article
        key={item.id}
        draggable
        data-drag-id={item.id}
        className={classes.item}
        style={{ "--bgr":`url( ${configClient.BACKEND_ORIGIN}${item.thumbnailUri} )` } as React.CSSProperties}
      >
        <span className={classes.handle}>☰</span>

        <address className={cn( `textContainer`, classes.overview )}>
          <h3>{item.name}</h3>
          {item.description && <Text looksLike="body-2">{item.description}</Text>}
          <small>~{item.author.name}</small>
          {item.author.avatarUri && <Image src={item.author.avatarUri} alt={`${item.author.name}'s avatar`} width={75} height={75} />}
        </address>
      </article>
    )
  } )

  return (
    <article ref={dragAndDropContainerRef} className={classes.dragArea}>
      <aside className={classes.overview} />

      <div className={classes.results}>
        <div className={classes.resultsLegend}>
          <p>Słabsze</p>
          <p>Lepsze</p>
        </div>

        {
          Array.from( { length:highestValue + 1 }, (_, i) => highestValue - i ).map( tier => (
            <section key={tier}>
              <p className={classes.rowLabel}>{tier}</p>
              <div className={classes.dropArea} data-drop-area={`t${tier}`}>
                {renderdropArea( assignements[ `t${tier}` ] )}
              </div>
            </section>
          ) )
        }
      </div>

      <section className={classes.uncategorised}>
        <p>Nieskategoryzowani</p>
        <div className={classes.dropArea} data-drop-area="uncategorised">
          {renderdropArea( assignements[ `uncategorised` ] )}
        </div>
      </section>
    </article>
  )
}

function useDragAndDrop( { onDragEnd }:DragAndDropHookConfig = {} ) {
  const containerRef = useRef<HTMLDivElement>( null )

  useEffect( () => {
    const container = containerRef.current
    if (!container) return

    const abortController = new AbortController()
    const activeAnimations = new WeakMap<HTMLElement, Animation>()
    let draggingItem:null | HTMLElement = null

    const dropAreas = document.querySelectorAll( `[data-drop-area]` )

    dropAreas.forEach( dragArea => {
      if (!(dragArea instanceof HTMLElement)) return

      dragArea.addEventListener( `dragenter`, e => {
        e.preventDefault()

        const target = e.target
        if (!(target instanceof HTMLElement)) return

        let underDrag = target.closest<HTMLElement>( `.${classes.item}, [data-drop-area]` )
        if (!draggingItem || !underDrag || underDrag === draggingItem || activeAnimations.has( underDrag )) return

        const draggingRect = draggingItem.getBoundingClientRect()
        const targetRect = underDrag.getBoundingClientRect()
        const animationOptions = {
          duration: 200,
          easing: `cubic-bezier( 0.2, 0, 0, 1 )`,
        }

        if (`dropArea` in underDrag.dataset && underDrag.childNodes.length) {
          const last = underDrag.childNodes[ underDrag.childNodes.length - 1 ]
          if (last instanceof HTMLElement) underDrag = last
        }

        if (`dropArea` in underDrag.dataset) {
          underDrag.insertAdjacentElement( `afterbegin`, draggingItem )
        } else {
          const insertEhere = draggingItem.parentElement === underDrag.parentElement && (draggingRect.top < targetRect.top || draggingRect.left < targetRect.left) ? `afterend` : `beforebegin`

          underDrag.insertAdjacentElement( insertEhere, draggingItem )

          const targetRectAfter = underDrag.getBoundingClientRect()
          const targetDeltaX = targetRect.left - targetRectAfter.left
          const targetDeltaY = targetRect.top - targetRectAfter.top

          const targetAnim = underDrag.animate( [
            { transform:`translate(${targetDeltaX}px,${targetDeltaY}px)` },
            { transform:`translate(0,0)` },
          ], animationOptions )

          activeAnimations.set( underDrag, targetAnim )

          targetAnim.onfinish = () => activeAnimations.delete( underDrag )
        }

        const deltaX = draggingRect.left - targetRect.left
        const deltaY = draggingRect.top - targetRect.top

        draggingItem.animate( [
          { transform:`translate(${deltaX}px,${deltaY}px)` },
          { transform:`translate(0,0)` },
        ], animationOptions )

      } )

      dragArea.addEventListener( `dragleave`, e => {
        const related = e.relatedTarget

        if (related instanceof Node && !dragArea.contains( related )) {
          dragArea.classList.remove( classes.isDragOver )
        }
      } )
    } )

    container.addEventListener( `dragstart`, ({ target }) => {
      if (target instanceof HTMLElement && target.draggable) {
        draggingItem = target
        draggingItem.classList.add( classes.isDragging )
      }
    }, { signal:abortController.signal } )

    container.addEventListener( `dragend`, () => {
      draggingItem?.classList.remove( classes.isDragging )
      draggingItem = null
      if (onDragEnd) onDragEnd( getDragAreasLists( container ) )
    }, { signal:abortController.signal } )

    return () => abortController.abort()
  }, [ onDragEnd ] )

  return containerRef
}

function getDragAreasLists( container:HTMLElement ) {
  const dropAreas = Array.from( container.querySelectorAll<HTMLElement>( `[data-drop-area]` ) )
  const dragAreas:DragAreaLists = {}

  dropAreas.forEach( area => {
    const id = area.dataset.dropArea as string
    const items = Array.from( area.querySelectorAll<HTMLElement>( `[data-drag-id]` ) ).map( i => i.dataset.dragId as string )

    dragAreas[ id ] = items
  } )

  return dragAreas
}
