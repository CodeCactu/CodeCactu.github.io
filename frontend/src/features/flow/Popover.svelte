<script lang="ts">
  import type { Snippet } from "svelte"
  import classes from "./Popover.module.css"
  import cn from "@lib/core/functions/createClassName"

  let { children }:{
    children: Snippet
  } = $props()
</script>

<div class={cn( "notched", classes.popover )}>
  {@render children()}
</div>
