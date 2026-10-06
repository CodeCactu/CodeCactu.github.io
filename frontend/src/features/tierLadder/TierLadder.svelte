<script lang="ts" module>
  const DRAG_START_DISTANCE = 5

  const isDraggingClass = `isDragging`
  const isDraggingOverSourceClass = `isOverSource`

  const animationOptions: KeyframeAnimationOptions = {
    duration: 200,
    easing: `cubic-bezier( 0.2, 0, 0, 1 )`,
  }

  let draggingItem: HTMLElement | null = null
  let draggingOriginal: HTMLElement | null = null
  let draggingClone: HTMLElement | null = null

  let draggingTable: HTMLElement | null = null
  let draggingTableId: string | undefined
  let draggingFromSource = false
  let draggingOverSource = false
  let draggingItemAnimation: Animation | null = null

  let draggingPointerId: number | null = null
  let draggingOverElement: HTMLElement | null = null

  let draggingPlaceholder: HTMLElement | null = null
  let draggingPointerOffsetX = 0
  let draggingPointerOffsetY = 0
  let pointerDownX = 0
  let pointerDownY = 0
  let pointerDownElement:null | HTMLElement = null
  let isDragging = false

  function resetDragState() {
    removePlaceholder()

    draggingItem?.classList.remove( classes.isDragging )
    draggingClone?.classList.remove( classes.isDragging )

    draggingItem = null
    draggingOriginal = null
    draggingClone = null

    draggingTable = null
    draggingTableId = undefined
    draggingFromSource = false
    draggingOverSource = false
    draggingItemAnimation = null

    draggingPointerId = null
    draggingOverElement = null

    draggingPointerOffsetX = 0
    draggingPointerOffsetY = 0
  }

  function getDescription( item:DragItem ) {
    if (!item.description) return

    return item.description.length > 203
      ? item.description.slice( 0, 260 ) + "..."
      : item.description
  }

  function getTable( element:Element | null ) {
    return element?.closest<HTMLElement>( "[data-tier-table]" ) || null
  }

  function getTableId( element:Element | null ) {
    return getTable( element )?.dataset.tierTable
  }

  function swapElements( a:HTMLElement, b:HTMLElement ) {
    if (a === b) return

    const rectA = a.getBoundingClientRect()
    const rectB = b.getBoundingClientRect()

    const parentA = a.parentNode
    const parentB = b.parentNode
    if (!parentA || !parentB) return

    const nextA = a.nextSibling
    const nextB = b.nextSibling

    if (parentA === parentB) {
      if (nextA === b) {
        parentA.insertBefore( b, a )
      } else if (nextB === a) {
        parentA.insertBefore( a, b )
      } else {
        parentA.insertBefore( b, nextA )
        parentA.insertBefore( a, nextB )
      }
    } else {
      parentA.insertBefore( b, nextA )
      parentB.insertBefore( a, nextB )
    }

    const configElement = (ele:HTMLElement, oldRect:DOMRect) => {
      const newRect = ele.getBoundingClientRect()
      const deltaX = oldRect.left - newRect.left
      const deltaY = oldRect.top - newRect.top

      ele.style.transition = `none`
      ele.style.transform = `translate(${deltaX}px, ${deltaY}px)`

      ele.offsetWidth;

      requestAnimationFrame( () => {
        ele.classList.add( isDraggingClass )
        ele.style.transition = `transform ${animationOptions.duration}ms cubic-bezier(.2, .8, .2, 1)`
        ele.style.transform = `translate(0, 0)`
      } )

      ele.addEventListener( `transitionend`, (event) => {
        if (event.propertyName !== `transform`) return

        ele.classList.remove( isDraggingClass )
        ele.style.transition = ``
        ele.style.transform = ``
      }, { once:true } )
    }

    configElement( a, rectA )
    configElement( b, rectB )
  }

  function getDragAreasLists( table:HTMLElement ) {
    const dropAreas = Array.from(
      table.querySelectorAll<HTMLElement>( "[data-drop-area]" )
    )

    const dragAreas: DragAreaLists = {}

    for (const area of dropAreas) {
      const id = area.dataset.dropArea
      if (!id) continue

      dragAreas[id] = Array.from(
        area.querySelectorAll<HTMLElement>( "[data-drag-id]" )
      ).map((item) => item.dataset.dragId!)
    }

    return dragAreas
  }

  function getContainerItem( container:HTMLElement, itemId:DragItem["id"] ) {
    return container.querySelector( `[data-drag-id="${itemId}"]` )
  }

  function flyElementTo( element:HTMLElement, x:number, y:number ) {
    const { promise, resolve } = Promise.withResolvers<boolean>()

    requestAnimationFrame( () => {
      element.classList.add( isDraggingClass )
      element.style.transition = `transform ${animationOptions.duration}ms cubic-bezier(.2, .8, .2, 1)`
      element.style.transform = `translate(${x}px, ${y}px)`
    } )

    element.addEventListener( `transitionend`, () => resolve( true ), { once:true } )

    return promise
  }

  async function flyInElement( element:HTMLElement, x:number, y:number ) {
    const { promise, resolve } = Promise.withResolvers<boolean>()

    element.style.transition = `none`
    element.style.transform = `translate(${x}px, ${y}px)`

    element.offsetWidth

    requestAnimationFrame( () => {
      element.classList.add( isDraggingClass )
      element.style.transition = `transform ${animationOptions.duration}ms cubic-bezier(.2, .8, .2, 1)`
      element.style.transform = `translate(0, 0)`
    } )

    element.addEventListener( `transitionend`, () => {
      element.classList.remove( isDraggingClass )
      element.style.transition = ``
      element.style.transform = ``

      resolve( true )
    }, { once:true } )

    return promise
  }

  function insertElement( container:HTMLElement, element:HTMLElement, index:number ) {
    if (index >= container.children.length) {
      container.appendChild( element )
    } else {
      container.insertBefore( element, container.children[ index ] )
    }
  }

  function animateMovedSiblings( container:HTMLElement, movingElement:HTMLElement, cb:() => void ) {
    const oldPositions = new Map<HTMLElement,DOMRect>()

    for (const child of container.children) {
      if (!(child instanceof HTMLElement) || child === movingElement) continue
      oldPositions.set( child, child.getBoundingClientRect() )
    }

    cb()

    for (const [child, oldRect] of oldPositions.entries().toArray()) {
      const newRect = child.getBoundingClientRect()

      const dx = oldRect.left - newRect.left
      const dy = oldRect.top - newRect.top

      if (dx === 0 && dy === 0) oldPositions.delete( child )

      child.style.transition = `none`
      child.style.transform = `translate(${dx}px, ${dy}px)`
    }

    container.offsetWidth

    for (const child of oldPositions.keys()) {
      child.classList.add( isDraggingClass )
      child.style.transition = `transform ${animationOptions.duration}ms cubic-bezier(.2, .8, .2, 1)`
      child.style.transform = "translate(0, 0)"

      child.addEventListener( `transitionend`, () => {
        child.classList.remove( isDraggingClass )
        child.style.transition = ``
        child.style.transform = ``
      }, { once: true } )
    }
  }

  function createPreview( element:HTMLElement, x:number, y:number ) {
    const clone = element.cloneNode(true) as HTMLElement
    const rect = element.getBoundingClientRect()

    draggingPointerOffsetX = x - rect.left
    draggingPointerOffsetY = y - rect.top

    clone.style.position = "fixed"
    clone.style.left = `${x - draggingPointerOffsetX}px`
    clone.style.top = `${y - draggingPointerOffsetY}px`
    clone.style.width = `${rect.width}px`
    clone.style.height = `${rect.height}px`
    clone.style.margin = "0"
    clone.style.zIndex = "999999"
    clone.style.pointerEvents = "none"
    clone.dataset.isClone = `true`

    document.body.appendChild( clone )

    return clone
  }

  function removePlaceholder() {
    if (!draggingPlaceholder) return false

    draggingPlaceholder.remove()
    draggingPlaceholder = null

    return true
  }

  function createPlaceholder( element:HTMLElement ) {
    removePlaceholder()

    const rect = element.getBoundingClientRect()
    const placeholder = document.createElement( "div" )

    placeholder.style.width = `${rect.width}px`
    placeholder.style.height = `${rect.height}px`
    placeholder.style.flexShrink = `0`
    placeholder.style.outline = `1px dashed #aaa`
    placeholder.dataset.dragId = element.dataset.dragId

    draggingPlaceholder = placeholder

    return placeholder
  }

  function startDraggingItem( element:HTMLElement, x:number, y:number ) {
    const rect = element.getBoundingClientRect()

    draggingPointerOffsetX = x - rect.left
    draggingPointerOffsetY = y - rect.top

    const placeholder = createPlaceholder( element )

    draggingPlaceholder = placeholder
    element.parentNode?.insertBefore( placeholder, element )

    element.style.position = `fixed`
    element.style.left = `${rect.left}px`
    element.style.top = `${rect.top}px`
    element.style.width = `${rect.width}px`
    element.style.height = `${rect.height}px`
    element.style.margin = `0`
    element.style.zIndex = `999999`
    element.style.pointerEvents = `none`

    moveDraggingItem( element, x, y )
  }

  function moveDraggingItem( element:HTMLElement, x:number, y:number ) {
    element.style.left = `${x - draggingPointerOffsetX}px`
    element.style.top = `${y - draggingPointerOffsetY}px`
  }

  async function finishDraggingItem() {
    if (!draggingItem) return

    draggingItem.style.position = ``
    draggingItem.style.left = ``
    draggingItem.style.top = ``
    draggingItem.style.width = ``
    draggingItem.style.height = ``
    draggingItem.style.margin = ``
    draggingItem.style.zIndex = ``
    draggingItem.style.pointerEvents = ``

    const rect = draggingItem.getBoundingClientRect()
    const x = parseFloat( draggingItem.style.left )
    const y = parseFloat( draggingItem.style.top )

    await flyInElement( draggingItem, x - rect.x, y - rect.y )
  }

  function restoreDraggingItem() {
    if (!draggingItem) return

    if (draggingClone) {
      draggingItem.remove()
      return
    }

    if (!draggingPlaceholder?.parentNode) return

    draggingPlaceholder.parentNode.insertBefore( draggingItem, draggingPlaceholder )
  }

  function handleDragOverDropArea( element:HTMLElement, dropArea:HTMLElement ) {
    const dragId = element.dataset.dragId
    if (!dragId) return

    if (draggingPlaceholder) {
      const placeholderIndex = Array.from( dropArea.children ).indexOf( draggingPlaceholder )
      if (placeholderIndex !== -1) return
    }

    if (!draggingOriginal || (draggingOriginal.parentElement !== dropArea && getContainerItem( dropArea, dragId ))) return
    const placeholder = createPlaceholder( element )

    animateMovedSiblings( dropArea, placeholder, () => {
      dropArea.insertAdjacentElement( "afterbegin", placeholder )
    } )
  }

  function handleDragOverDragItem( element:HTMLElement, itemBelow:HTMLElement ) {
    if (draggingPlaceholder) {
      swapElements( draggingPlaceholder, itemBelow )
    }
  }

  function handleDragEnterSource( element:HTMLElement ) {
    element.classList.add( isDraggingOverSourceClass )
  }

  function handleDragLeaveSource( element:HTMLElement ) {
    element.classList.remove( isDraggingOverSourceClass )
  }

  function handlePointerDown( event:PointerEvent ) {
    if (!(event.target instanceof HTMLElement)) return
    if (event.button !== 0) return

    const target = event.target.closest<HTMLElement>( "[data-drag-id]" )
    if (!target) return

    pointerDownX = event.clientX
    pointerDownY = event.clientY
    pointerDownElement = target
    isDragging = false
  }

  function handlePointerMove( event:PointerEvent ) {
    if (!pointerDownElement) return

    if (!isDragging) {
      const dx = event.clientX - pointerDownX
      const dy = event.clientY - pointerDownY

      if (Math.hypot( dx, dy ) < DRAG_START_DISTANCE) return

      isDragging = true

      draggingPointerId = event.pointerId

      draggingOriginal = pointerDownElement
      draggingItem = pointerDownElement
      draggingClone = null

      draggingTable = getTable( pointerDownElement )
      draggingTableId = draggingTable?.dataset.tierTable

      draggingFromSource = !draggingTable
      draggingOverSource = false

      if (draggingFromSource && !draggingClone) {
        const preview = createPreview( draggingOriginal, event.clientX, event.clientY )

        draggingClone = preview
        draggingItem = preview
      } else {
        startDraggingItem( pointerDownElement, event.clientX, event.clientY )
      }

      console.log( `D&D`, `Start` )

      draggingItem.classList.add( isDraggingClass )

      pointerDownElement.setPointerCapture( event.pointerId )
      event.preventDefault()

      return
    }

    if (!draggingItem || draggingPointerId !== event.pointerId) return

    event.preventDefault()

    moveDraggingItem( draggingItem, event.clientX, event.clientY )

    const element = document.elementFromPoint( event.clientX, event.clientY )
    if (!(element instanceof HTMLElement)) return

    const source = element.closest<HTMLElement>( "[data-source-area]" )
    if (source) {
      if (draggingOverElement === source) return
      console.log( `D&D`, `Entering drag source` )

      draggingOverElement = source
      draggingOverSource = true

      if (!draggingFromSource) {
        draggingOverElement.classList.remove( classes.isDragOver )
        source.classList.add( classes.isDragOver )

        handleDragEnterSource( draggingItem )
      }

      return
    }

    if (element.dataset.dragId === draggingItem.dataset.dragId) return

    const dragItem = element.closest<HTMLElement>( "[data-drag-id]" )
    if (dragItem) {
      if (draggingOverElement === dragItem) return
      console.log( `D&D`, `Entering drag item` )

      if (draggingOverElement !== dragItem) {
        if (draggingOverElement) {
          draggingOverElement.classList.remove( classes.isDragOver )
        }

        draggingOverElement = dragItem
        dragItem.classList.add( classes.isDragOver )
      }

      handleDragOverDragItem( draggingItem, dragItem )

      return
    }

    const dragArea = element.closest<HTMLElement>( "[data-drop-area]" )
    if (dragArea) {
      if (draggingOverElement === dragArea) return
      console.log( `D&D`, `Entering drag area` )

      const nearesDragArea = draggingOverElement?.closest<HTMLElement>( "[data-drop-area]" )
      if (draggingOverElement && nearesDragArea !== dragArea) removePlaceholder()

      draggingOverElement = dragArea

      handleDragOverDropArea( draggingItem, dragArea )

      return
    }


    // Leaving
    if (draggingOverElement?.dataset.sourceArea !== undefined) {
      console.log( `D&D`, `Leaving drop source` )

      if (draggingOverSource) {
        draggingOverSource = false
        handleDragLeaveSource( draggingItem )
      }
    } if (draggingOverElement?.dataset.dragId) {
      console.log( `D&D`, `Leaving drop item` )
    } else if (draggingOverElement?.dataset.dropArea) {
      console.log( `D&D`, `Leaving drop area` )
    }

    if (draggingOverElement) {
      draggingOverElement.classList.remove( classes.isDragOver )
      draggingOverElement = null
    }
  }

  function handlePointerUp( event:PointerEvent, onDragEnd?:(list:DragAreaLists) => void ) {
    if (!pointerDownElement) return

    pointerDownElement.releasePointerCapture( event.pointerId )
    isDragging = false
    pointerDownElement = null

    if (!draggingItem || draggingPointerId !== event.pointerId) return

    const removeClassName = async () => {
      if (!draggingItem) return

      console.log( `D&D`, `End` )

      document
        .querySelectorAll<HTMLElement>( `.${classes.isDragOver}` )
        .forEach((element) => element.classList.remove( classes.isDragOver ))

      const dropArea = draggingPlaceholder?.parentElement?.dataset.dropArea ? draggingPlaceholder.parentElement : null

      if (draggingPlaceholder && dropArea) {
        if (draggingOverSource) {
          draggingItem.remove()
        } else {
          const placeholderIndex = Array.from( dropArea.children ).indexOf( draggingPlaceholder )

          insertElement( dropArea, draggingItem, placeholderIndex )
          finishDraggingItem()
        }

        removePlaceholder()
      } else {
        if (draggingOriginal) {
          const draggindItemRef = draggingItem
          const orgRect = draggingOriginal.getBoundingClientRect()
          const dragRect = draggindItemRef.getBoundingClientRect()

          await flyElementTo( draggindItemRef, orgRect.left - dragRect.left, orgRect.top - dragRect.top )

          draggindItemRef.addEventListener( `transitionend`, () => draggindItemRef.remove(), { once: true } )
        }
      }

      resetDragState()
      if (draggingTable && onDragEnd) onDragEnd( getDragAreasLists( draggingTable ) )
    }

    if (!draggingItemAnimation) return removeClassName()
    draggingItemAnimation.addEventListener( "finish", removeClassName, { once: true } )
  }

  function handlePointerCancel( event:PointerEvent ) {
    if (draggingPointerId !== event.pointerId) return
    if (!draggingItem) return

    restoreDraggingItem()

    finishDraggingItem()

    resetDragState()
  }
</script>

<script lang="ts">
  import { onMount } from "svelte"
  import classes from "./TierLadder.module.css"
  import type { CactuJamGame } from "@fet/backends/cactu/cactuJamGame"
  import { clientConfig } from "@/config.client"

  export type DragItem = CactuJamGame
  export type DragItemTierAssignments = Record<string, DragItem["id"][]>
  export type DragAreaLists = Record<string, string[]>

  let { name, highestValue, items, assignments, onDragEnd }: {
    name: string
    highestValue: number
    items: DragItem[]
    assignments: DragItemTierAssignments
    onDragEnd?: (lists: DragAreaLists) => void
  } = $props()

  let container: HTMLElement | undefined

  function getItem( id:DragItem["id"] ) {
    const item = items.find((item) => item.id == id)

    if (!item) {
      console.log( id, items.at( -1 ), items )
      throw new Error( `item "${id}" not found` )
    }

    return item
  }

  onMount(() => {
    if (!container) return

    const abortController = new AbortController()

    document.addEventListener( "pointerdown", handlePointerDown, { signal: abortController.signal } )
    document.addEventListener( "pointermove", handlePointerMove, { signal: abortController.signal } )
    document.addEventListener( "pointerup", event => handlePointerUp( event, onDragEnd ), { signal: abortController.signal } )
    document.addEventListener( "pointercancel", handlePointerCancel, { signal: abortController.signal } )

    return () => abortController.abort()
  })
</script>

<article bind:this={container} class={classes.dragArea} data-tier-table={name}>
  <div class={classes.tiers}>
    {name}

    <div class={classes.legend}>
      <p>Słabsze</p>
      <p>Lepsze</p>
    </div>

    {#each Array.from(
      { length: highestValue + 1 },
      (_, i) => highestValue - i
    ) as tier}
      <section class={classes.row}>
        <p class={classes.label}>{tier}</p>

        <div
          class={classes.dropArea}
          data-drop-area={`t${tier}`}
        >
          {#each assignments[`t${tier}`] ?? [] as id}
            {@const item = getItem(id)}

            <article
              draggable="true"
              data-drag-id={item.id}
              class={classes.item}
              style={item.thumbnailUri && `--bgr: url(${clientConfig.BACKEND_ORIGIN}${item.thumbnailUri})`}
            >
              <span class={classes.handle}>☰</span>

              <address
                class={`textContainer ${classes.overview}`}
              >
                <h3>{item.name}</h3>

                {#if item.description}
                  <p>{getDescription(item)}</p>
                {/if}

                <small>~{item.author.name}</small>

                {#if item.author.avatarUri}
                  <img
                    src={item.author.avatarUri}
                    alt={`${item.author.name}'s avatar`}
                    width="256"
                    height="256"
                  />
                {/if}
              </address>
            </article>
          {/each}
        </div>
      </section>
    {/each}
  </div>
</article>
