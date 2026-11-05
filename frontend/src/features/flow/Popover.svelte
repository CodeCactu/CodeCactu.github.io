<script lang="ts">
  import cn from "@lib/core/functions/createClassName"
  import classes from "./Popover.module.css"
  import type { Snippet } from "svelte"

  let { children }:{
    children: Snippet
  } = $props()
</script>

<div class={cn( "notched", classes.popover )}>
  {@render children()}
</div>
