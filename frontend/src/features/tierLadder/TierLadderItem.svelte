<script lang="ts">
  import classes from "./TierLadderItem.module.css"
  import type { Assignement, AssignementSummary } from "./TierLadder.svelte"
  import { clientConfig } from "@/config.client"

  let { assignment }: {
    assignment: AssignementSummary | Assignement
  } = $props()
</script>

<li
  class={classes.game}
  data-drag-id={assignment.id}
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

      <div class={classes.comment}>
        <h4>Komentarz dla uczestnika</h4>
        <textarea name="comment"></textarea>
      </div>
    </address>
  {/if}
</li>
