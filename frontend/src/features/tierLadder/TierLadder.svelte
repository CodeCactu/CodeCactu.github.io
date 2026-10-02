<script lang="ts">
  import { onMount } from "svelte"
  import classes from "./TierLadder.module.css"
  import type { CactuJamGame } from "@fet/backends/cactu/cactuJamGame"
  import { clientConfig } from "@/config.client"

  export type DragItem = CactuJamGame
  export type DragItemTierAssignments = Record<string, DragItem["id"][]>
  export type DragAreaLists = Record<string, string[]>

  let { highestValue, items, assignments, onDragEnd }: {
    highestValue: number
    items: DragItem[]
    assignments: DragItemTierAssignments
    onDragEnd?: (lists: DragAreaLists) => void
  } = $props()

  let container: HTMLElement | undefined

  function getItem(id: DragItem["id"]) {
    const item = items.find((item) => item.id == id)

    if (!item) {
      console.log( id, items.at( -1 ), items )
      throw new Error( `item "${id}" not found` )
    }

    return item
  }

  function getDescription(item: DragItem): string | undefined {
    if (!item.description) return

    return item.description.length > 203
      ? item.description.slice( 0, 260 ) + "..."
      : item.description
  }

  function getTable(element: Element | null) {
    return element?.closest<HTMLElement>( "[data-tier-table]" ) || null
  }

  function getTableId(element: Element | null) {
    return getTable( element )?.dataset.tierTable
  }

  function getDragAreasLists(table: HTMLElement) {
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

  onMount(() => {
    if (!container) return

    const abortController = new AbortController()
    const activeAnimations = new WeakMap<HTMLElement, Animation>()

    let draggingItem: HTMLElement | null = null
    let draggingOriginal: HTMLElement | null = null
    let draggingClone: HTMLElement | null = null
    let draggingTable: HTMLElement | null = null
    let draggingTableId: string | undefined
    let draggingFromSource = false
    let draggingOverSource = false
    let draggingItemAnimation: Animation | null = null

    const isDraggingClass = `isDragging`
    const isDraggingOverSourceClass = `isOverSource`
    const animationOptions: KeyframeAnimationOptions = {
      duration: 200,
      easing: `cubic-bezier( 0.2, 0, 0, 1 )`,
    }

    function resetDragState() {
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
    }

    function notifyDragEnd() {
      if (!draggingTable || !onDragEnd) return

      onDragEnd( getDragAreasLists( draggingTable ) )
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
        const newRect = a.getBoundingClientRect()
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

    function flyInElement(element:HTMLElement, x:number, y:number) {
      element.style.transition = `none`
      element.style.transform = `translate(${x}px, ${y}px)`;

      element.offsetWidth;

      requestAnimationFrame( () => {
        element.classList.add( isDraggingClass )
        element.style.transition = `transform ${animationOptions.duration}ms cubic-bezier(.2, .8, .2, 1)`
        element.style.transform = `translate(0, 0)`
      } )

      element.addEventListener( `transitionend`, () => {
        element.classList.remove( isDraggingClass )
        element.style.transition = ``
        element.style.transform = ``
      }, {once:true} )
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



    // Handlers

    function handleDragOverDropArea( element:HTMLElement, dropArea:HTMLElement ) {
      if (dropArea.childElementCount !== 0) return


      // Source -> empty drop area
      if (draggingFromSource) {
        if (!draggingOriginal) return

        const clone = element.cloneNode( true ) as HTMLElement

        dropArea.insertAdjacentElement( "afterbegin", clone )

        const sourceRect = draggingOriginal.getBoundingClientRect()
        const cloneRect = clone.getBoundingClientRect()

        flyInElement( clone, sourceRect.x - cloneRect.x, sourceRect.y - cloneRect.y )

        draggingFromSource = false
        draggingItem = clone
      }

      const sourceDropArea = element.parentElement
      if (!sourceDropArea || !(`dropArea` in sourceDropArea.dataset)) return


      // Drop area A -> drop area B
      animateMovedSiblings( sourceDropArea, element, () => {
        if (!draggingOriginal) return
        const sourceRect = element.getBoundingClientRect()

        dropArea.insertAdjacentElement( "afterbegin", element )

        const insertedRect = element.getBoundingClientRect()

        flyInElement( element, sourceRect.x - insertedRect.x, sourceRect.y - insertedRect.y )
      })
    }

    function handleDragOverDragItem( element:HTMLElement, itemBelow:HTMLElement ) {
      if (!element?.dataset.dragId) return

      const targetDropArea = itemBelow.parentElement
      if (!targetDropArea || !(`dropArea` in targetDropArea.dataset)) return

      // Source -> item in drop area
      if (draggingFromSource) {
        if (!draggingOriginal || getContainerItem( targetDropArea, element.dataset.dragId )) return

        animateMovedSiblings( targetDropArea, element, () => {
          if (!draggingOriginal) return

          const clone = element.cloneNode( true ) as HTMLElement

          insertElement( targetDropArea, clone, Array.from( targetDropArea.children ).indexOf( itemBelow ) )

          const sourceRect = draggingOriginal.getBoundingClientRect()
          const cloneRect = clone.getBoundingClientRect()

          flyInElement( clone, sourceRect.x - cloneRect.x, sourceRect.y - cloneRect.y )

          draggingFromSource = false
          draggingItem = clone
        })

        return
      }

      const sourceDropArea = element.parentElement
      if (!sourceDropArea || !(`dropArea` in sourceDropArea.dataset)) return


      // Items from different drop area
      if (targetDropArea !== sourceDropArea) {
        animateMovedSiblings( targetDropArea, element, () => {
          if (!draggingOriginal) return
          const sourceRect = element.getBoundingClientRect()

          animateMovedSiblings( sourceDropArea, element, () => {
            insertElement( targetDropArea, element, Array.from( targetDropArea.children ).indexOf( itemBelow ) )
          })

          const insertedRect = element.getBoundingClientRect()

          flyInElement( element, sourceRect.x - insertedRect.x, sourceRect.y - insertedRect.y )
        })

        return
      }


      // Two items in the same drop area
      swapElements( element, itemBelow )
    }

    function handleDragEnterSource( element:HTMLElement ) {
      element.classList.add( isDraggingOverSourceClass )
    }

    function handleDragLeaveSource( element:HTMLElement ) {
      element.classList.remove( isDraggingOverSourceClass )
    }

    function handleDropOnSource( element:HTMLElement ) {
      const sourceDropArea = element.parentElement
      if (!sourceDropArea || !(`dropArea` in sourceDropArea.dataset)) return

      animateMovedSiblings( sourceDropArea, element, () => element.remove() )
    }



    // Events

    document.addEventListener( "dragenter",
      (event) => {
        if (!(event.target instanceof HTMLElement)) return
        if (!draggingItem) return

        event.preventDefault()

        const source = event.target.closest<HTMLElement>( "[data-source-area]" )
        if (source) {
          draggingOverSource = true

          if (!draggingFromSource) handleDragEnterSource( draggingItem )

          return
        }

        if (event.target.dataset.dragId === draggingItem.dataset.dragId) return

        const dragItem = event.target.closest<HTMLElement>( "[data-drag-id]" )
        if (dragItem) return handleDragOverDragItem( draggingItem, dragItem )

        const dragArea = event.target.closest<HTMLElement>( "[data-drop-area]" )
        if (dragArea) return handleDragOverDropArea( draggingItem, dragArea )
      },
      { signal: abortController.signal },
    )

    document.addEventListener( "dragleave",
      (event) => {
        if (!(event.target instanceof HTMLElement)) return

        const source = event.target.closest<HTMLElement>( "[data-source-area]" )
        if (!source) return

        const related = event.relatedTarget
        if (related instanceof Node && source.contains( related )) return

        if (draggingItem) {
          if (related) handleDragLeaveSource( draggingItem )
          else handleDropOnSource( draggingItem )
        }

        draggingOverSource = false
        source.classList.remove( classes.isDragOver )
      },
      { signal: abortController.signal },
    )

    document.addEventListener( "dragstart",
      ({ target }) => {
        if (!(target instanceof HTMLElement) || !target.draggable) return

        draggingOriginal = target
        draggingItem = target

        draggingTable = getTable( target )
        draggingTableId = draggingTable?.dataset.tierTable

        draggingFromSource = !draggingTable
        draggingOverSource = false

        console.log(`start`, draggingItem)
        draggingItem.classList.add( isDraggingClass )
      },
      { signal: abortController.signal },
    )

    document.addEventListener( "dragend",
      () => {
        const table = draggingTable
        const overSource = draggingOverSource
        const clone = draggingClone

        const removeClassName = () => {
          document
            .querySelectorAll<HTMLElement>( `.${classes.isDragOver}` )
            .forEach((element) => element.classList.remove( classes.isDragOver ))

          /*
           * Przeciągnięcie z listy źródłowej do tabeli:
           * kopia zostaje.
           */
          if (draggingFromSource && !overSource) {
            if (table) notifyDragEnd()

            resetDragState()
            return
          }

          /*
           * Przeciągnięcie istniejącego elementu do listy źródłowej:
           * usuwamy jego kopię z tabeli.
           */
          if (overSource && clone) {
            clone.remove()

            if (table && onDragEnd) onDragEnd( getDragAreasLists( table ) )

            resetDragState()
            return
          }

          /*
           * Zwykłe przesunięcie elementu wewnątrz tabeli.
           */
          if (table) notifyDragEnd()

          resetDragState()
        }

        if (!draggingItemAnimation) {
          removeClassName()
          return
        }

        draggingItemAnimation.addEventListener( "finish", removeClassName, { once: true } )
      },
      { signal: abortController.signal },
    )

    return () => abortController.abort()
  })
</script>

<article bind:this={container} class={classes.dragArea} data-tier-table="category-name">
  <div class={classes.tiers}>
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

                {#if getDescription(item)}
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
