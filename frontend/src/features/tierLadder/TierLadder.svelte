<script lang="ts">
  import { onMount } from "svelte"
  import classes from "./TierLadder.module.css"
  import type { CactuJamGame } from "@fet/backends/cactu/cactuJamGame"
  import { clientConfig } from "@/config.client";

  export type DragItem = CactuJamGame
  export type DragItemTierAssignments = Record<string, DragItem["id"][]>
  export type DragAreaLists = Record<string, string[]>

  type DragAndDropHookConfig = {
    onDragEnd?: (lists: DragAreaLists) => void
  }

  let {
    highestValue,
    items,
    assignements,
    onDragEnd,
  }: {
    highestValue: number
    items: DragItem[]
    assignements: DragItemTierAssignments
  } & DragAndDropHookConfig = $props()

  let container: HTMLElement | undefined

  function getItem(id: DragItem["id"]): DragItem {
    const item = items.find((item) => item.id == id)

    if (!item) {
      console.log(id, items.at( -1 ), items)
      throw new Error(`item "${id}" not found`)
    }

    console.log(item)
    return item
  }

  function getDescription(item: DragItem): string | undefined {
    if (!item.description) {
      return undefined
    }

    return item.description.length > 203
      ? item.description.slice(0, 260) + "..."
      : item.description
  }

  function getDragAreasLists(container: HTMLElement): DragAreaLists {
    const dropAreas = Array.from(
      container.querySelectorAll<HTMLElement>("[data-drop-area]")
    )

    const dragAreas: DragAreaLists = {}

    for (const area of dropAreas) {
      const id = area.dataset.dropArea

      if (!id) {
        continue
      }

      dragAreas[id] = Array.from(
        area.querySelectorAll<HTMLElement>("[data-drag-id]")
      ).map((item) => item.dataset.dragId!)
    }

    return dragAreas
  }

  onMount(() => {
    if (!container) {
      return
    }

    const abortController = new AbortController()
    const activeAnimations = new WeakMap<HTMLElement, Animation>()

    let draggingItem: HTMLElement | null = null
    let draggingItemAnimation: Animation | null = null

    /*
     * W Reactowym kodzie było:
     *
     * document.querySelectorAll(...)
     *
     * Tutaj celowo ograniczamy wyszukiwanie do tego komponentu.
     */
    const dropAreas = container.querySelectorAll<HTMLElement>(
      "[data-drop-area]"
    )

    const animationOptions: KeyframeAnimationOptions = {
      duration: 200,
      easing: "cubic-bezier(0.2, 0, 0, 1)",
    }

    for (const dragArea of dropAreas) {
      dragArea.addEventListener(
        "dragenter",
        (event) => {
          event.preventDefault()

          const target = event.target

          if (!draggingItem || !(target instanceof HTMLElement)) {
            return
          }

          let underDrag = target.closest<HTMLElement>(
            `.${classes.item}, [data-drop-area]`
          )

          if (!underDrag) {
            return
          }

          let isUnderDragDropArea =
            "dropArea" in underDrag.dataset

          if (isUnderDragDropArea) {
            underDrag.classList.add(classes.isDragOver)
          }

          if (
            underDrag === draggingItem.parentElement ||
            activeAnimations.has(underDrag)
          ) {
            return
          }

          const draggingRect = draggingItem.getBoundingClientRect()

          const targetRect = (() => {
            const rect = underDrag.getBoundingClientRect()
            const styles = window.getComputedStyle(underDrag)

            return {
              x:
                rect.left +
                Number.parseInt(styles.paddingLeft || "0"),
              y:
                rect.top +
                Number.parseInt(styles.paddingTop || "0"),
            }
          })()

          if (
            isUnderDragDropArea &&
            underDrag.childNodes.length
          ) {
            const last =
              underDrag.childNodes[underDrag.childNodes.length - 1]

            if (last instanceof HTMLElement) {
              underDrag = last
            }

            isUnderDragDropArea =
              "dropArea" in underDrag.dataset
          }

          if (isUnderDragDropArea) {
            underDrag.insertAdjacentElement(
              "afterbegin",
              draggingItem
            )
          } else {
            const insertHere =
              draggingItem.parentElement ===
                underDrag.parentElement &&
              (
                draggingRect.top < targetRect.y ||
                draggingRect.left < targetRect.x
              )
                ? "afterend"
                : "beforebegin"

            underDrag.insertAdjacentElement(
              insertHere,
              draggingItem
            )

            const targetRectAfter =
              underDrag.getBoundingClientRect()

            const targetDeltaX =
              targetRect.x - targetRectAfter.left

            const targetDeltaY =
              targetRect.y - targetRectAfter.top

            const targetAnimation = underDrag.animate(
              [
                {
                  transform: `translate(${targetDeltaX}px,${targetDeltaY}px)`,
                },
                {
                  transform: "translate(0,0)",
                },
              ],
              animationOptions
            )

            underDrag.classList.add(classes.isDragging)

            activeAnimations.set(
              underDrag,
              targetAnimation
            )

            targetAnimation.onfinish = () => {
              activeAnimations.delete(underDrag)
              underDrag.classList.remove(classes.isDragging)
            }
          }

          const deltaX =
            draggingRect.left - targetRect.x

          const deltaY =
            draggingRect.top - targetRect.y

          draggingItemAnimation = draggingItem.animate(
            [
              {
                transform: `translate(${deltaX}px,${deltaY}px)`,
              },
              {
                transform: "translate(0,0)",
              },
            ],
            animationOptions
          )

          draggingItemAnimation.addEventListener(
            "finish",
            () => {
              draggingItemAnimation = null
            },
            { once: true }
          )
        },
        { signal: abortController.signal }
      )

      dragArea.addEventListener(
        "dragleave",
        (event) => {
          const related = event.relatedTarget

          if (
            related instanceof Node &&
            !dragArea.contains(related)
          ) {
            dragArea.classList.remove(classes.isDragOver)
          }
        },
        { signal: abortController.signal }
      )
    }

    container.addEventListener(
      "dragstart",
      (event) => {
        const target = event.target

        if (
          target instanceof HTMLElement &&
          target.draggable
        ) {
          draggingItem = target
          draggingItem.classList.add(classes.isDragging)
        }
      },
      { signal: abortController.signal }
    )

    container.addEventListener(
      "dragend",
      () => {
        const removeClassName = () => {
          draggingItem?.classList.remove(classes.isDragging)

          if (onDragEnd) {
            onDragEnd(getDragAreasLists(container!))
          }

          container
            ?.querySelector<HTMLElement>(
              `.${classes.isDragOver}`
            )
            ?.classList.remove(classes.isDragOver)

          draggingItem = null
        }

        if (!draggingItemAnimation) {
          removeClassName()
        } else {
          draggingItemAnimation.addEventListener(
            "finish",
            removeClassName,
            { once: true }
          )
        }
      },
      { signal: abortController.signal }
    )

    return () => {
      abortController.abort()
    }
  })
</script>

<article bind:this={container} class={classes.dragArea}>
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
          {#each assignements[`t${tier}`] ?? [] as id}
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

  <section class={classes.uncategorised}>
    <p>Nieskategoryzowani</p>

    <div
      class={classes.dropArea}
      data-drop-area="uncategorised"
    >
      {#each assignements.uncategorised ?? [] as id}
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

  <section class={classes.smallScreenInfo}>
    Tabela niedostępna na małych ekranach
  </section>
</article>