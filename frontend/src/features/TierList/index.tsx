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
          {
            item.description && <Text looksLike="body-2">
              {item.description.length > 203 ? item.description.slice( 0, 260 ) + `...` : item.description}
            </Text>
          }
          <small>~{item.author.name}</small>
          {item.author.avatarUri && <Image src={item.author.avatarUri} alt={`${item.author.name}'s avatar`} width={256} height={256} />}
        </address>
      </article>
    )
  } )

  return (
    <article ref={dragAndDropContainerRef} className={classes.dragArea}>
      <div className={classes.tiers}>
        <div className={classes.legend}>
          <p>Słabsze</p>
          <p>Lepsze</p>
        </div>

        {
          Array.from( { length:highestValue + 1 }, (_, i) => highestValue - i ).map( tier => (
            <section key={tier} className={classes.row}>
              <p className={classes.label}>{tier}</p>
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

      <section className={classes.smallScreenInfo}>
        Tabela niedostępna na małych ekranach
      </section>
    </article>
  )
}

export function OverviewAnchor() {
  return (
    <div>
      <aside className={classes.overviewAnchor}>
        Najedź wskaźnikiem myszy nad element tabeli aby zobaczyć jego opis
      </aside>
    </div>
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
    let draggingItemAnimation:null | Animation = null

    const dropAreas = document.querySelectorAll( `[data-drop-area]` )

    dropAreas.forEach( dragArea => {
      if (!(dragArea instanceof HTMLElement)) return

      dragArea.addEventListener( `dragenter`, e => {
        e.preventDefault()

        const target = e.target
        if (!draggingItem || !(target instanceof HTMLElement)) return

        let underDrag = target.closest<HTMLElement>( `.${classes.item}, [data-drop-area]` )
        if (!underDrag) return

        let isUnderDragDropArea = `dropArea` in underDrag.dataset

        if (isUnderDragDropArea) underDrag.classList.add( classes.isDragOver )
        if (underDrag === draggingItem.parentElement || activeAnimations.has( underDrag )) return

        const draggingRect = draggingItem.getBoundingClientRect()
        const targetRect = (() => {
          const rect = underDrag.getBoundingClientRect()
          const styles = window.getComputedStyle( underDrag )

          return {
            x: rect.left + parseInt( styles.paddingLeft ?? `0` ),
            y: rect.top + parseInt( styles.paddingTop ?? `0` ),
          }
        })()

        const animationOptions = {
          duration: 200,
          easing: `cubic-bezier( 0.2, 0, 0, 1 )`,
        }

        if (isUnderDragDropArea && underDrag.childNodes.length) {
          const last = underDrag.childNodes[ underDrag.childNodes.length - 1 ]
          if (last instanceof HTMLElement) underDrag = last
          isUnderDragDropArea = `dropArea` in underDrag.dataset
        }

        if (isUnderDragDropArea) {
          underDrag.insertAdjacentElement( `afterbegin`, draggingItem )
        } else {
          const insertHere = draggingItem.parentElement === underDrag.parentElement && (draggingRect.top < targetRect.y || draggingRect.left < targetRect.x) ? `afterend` : `beforebegin`

          underDrag.insertAdjacentElement( insertHere, draggingItem )

          const targetRectAfter = underDrag.getBoundingClientRect()
          const targetDeltaX = targetRect.x - targetRectAfter.left
          const targetDeltaY = targetRect.y - targetRectAfter.top

          const targetAnim = underDrag.animate( [
            { transform:`translate(${targetDeltaX}px,${targetDeltaY}px)` },
            { transform:`translate(0,0)` },
          ], animationOptions )

          underDrag.classList.add( classes.isDragging )
          activeAnimations.set( underDrag, targetAnim )

          targetAnim.onfinish = () => {
            activeAnimations.delete( underDrag )
            underDrag.classList.remove( classes.isDragging )
          }
        }

        const deltaX = draggingRect.left - targetRect.x
        const deltaY = draggingRect.top - targetRect.y

        draggingItemAnimation = draggingItem.animate( [
          { transform:`translate(${deltaX}px,${deltaY}px)` },
          { transform:`translate(0,0)` },
        ], animationOptions )

        draggingItemAnimation.addEventListener( `finish`, () => draggingItemAnimation = null )
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
      const removeClassName = () => {
        draggingItem?.classList.remove( classes.isDragging )

        if (onDragEnd) onDragEnd( getDragAreasLists( container ) )
        container.querySelector( `.${classes.isDragOver}` )?.classList.remove( classes.isDragOver )

        draggingItem = null
      }

      if (!draggingItemAnimation) removeClassName()
      else draggingItemAnimation.addEventListener( `finish`, removeClassName )
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
