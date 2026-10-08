<script lang="ts">
  import classes from "./TierLadderItem.module.css"
  import type { Assignement, AssignementSummary } from "./TierLadder.svelte"
  import { clientConfig } from "@/config.client"
  import { queryCactuJamComments, saveCactuJamUserComment } from "@fet/backends/cactu/cactuJamComments"
    import { auth } from "@fet/auth/authRune.svelte";

  let { assignment }: {
    assignment: AssignementSummary | Assignement
  } = $props()

  let comment = $state<string>( `` )
  let isLoaded = false
  const isWithPopover = $derived( `name` in assignment )

  $effect(() => {
    if (!isWithPopover || !auth.session) return

    isLoaded = false
    let active = true

    queryCactuJamComments().then( c => {
      if (!active) return

      comment = c[ assignment.id ] ?? ``
      queueMicrotask( () => isLoaded = true )
    })

    return () => active = false
  })

  $effect( () => {
    if (!isWithPopover) return

    const currentComment = comment

    if (!isLoaded) return

    const timeoutId = setTimeout(() => {
      saveCactuJamUserComment( assignment.id, currentComment )
    }, 1000 )

    return () => clearTimeout( timeoutId )
  })
</script>


<li
  class={classes.game}
  data-drag-id={auth.session ? assignment.id : undefined}
  style={assignment.thumbnailUri && `--bgr: url(${clientConfig.BACKEND_ORIGIN}${assignment.thumbnailUri})`}
>
  <button class={classes.handle} popovertarget={`game-${assignment.id}`}>
    ☰
  </button>

  {#if `name` in assignment}
    <address
      popover
      class={`prose ${classes.overview}`}
      id={`game-${assignment.id}`}
      data-drag-ignore
    >
      {#if assignment.author.avatarUri}
        <img
          src={assignment.author.avatarUri}
          alt={`${assignment.author.name}'s avatar`}
          width="128"
          height="128"
        />
      {/if}

      <h3>{assignment.name}</h3>

      {#if assignment.description}
        <div>{assignment.description}</div>
      {/if}

      <small>~{assignment.author.name}</small>

      {#if auth.session}
        <div class={classes.comment}>
          <h4>Komentarz dla uczestnika</h4>
          <textarea name="comment" bind:value={comment}></textarea>
        </div>
      {/if}
    </address>
  {/if}
</li>
