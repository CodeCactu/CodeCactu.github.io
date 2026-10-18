<script lang="ts">
  import cn from "@lib/core/functions/createClassName"
  import classes from "./Button.module.css"
  import { select } from "@lib/core/functions"
    import type { Snippet } from "svelte";


  let { class:externalClassName, popovertarget, variant, style, disabled, href, children }:{
    variant?: "yellow" | "green" | "brown" | "blue" | "purple"
    style?: string
    disabled?: boolean
    href?: string
    class?: string
    popovertarget?: string
    children: Snippet
  } = $props()

  const variantClassName = $derived(
    select( variant, {
      green: undefined,
      purple: classes.isPurple,
      yellow: classes.isYellow,
      brown: classes.isBrown,
      blue: classes.isBlue,
    } )
  )

  const className = $derived( cn( `button`, variantClassName, externalClassName ) )
</script>

{#if href}
  <a class={className} {style} {href}>
    {@render children()}
  </a>
{:else}
  <button class={className} {style} {disabled} {popovertarget}>
    {@render children()}
  </button>
{/if}
