<script lang="ts">
  import defaultAvatar from "@fet/auth/default-avatar.webp"
  import Loader from '@fet/flow/Loader.svelte'
  import Popover from '@fet/flow/Popover.svelte'
  import Button from '@fet/controls/Button.svelte'
  import MenuIcon from '@/icons/MenuIcon.svelte'
  import ButtonHole from '@fet/controls/ButtonHole.svelte'
  import { auth } from '@fet/auth/authRune.svelte'

  let { class:className }:{
    class?: string
  } = $props()

  const mobileBtnSrc = $derived(
    auth.session === undefined ? undefined
    : auth.session === null ? defaultAvatar.src
    : `https://cdn.discordapp.com/avatars/${auth.session.user.discordId}/${auth.session.user.avatarHash}.png?size=1024`
  )
</script>

<Button variant="blue" class={className} popovertarget="menu">
  <MenuIcon width="1.5em" height="1.5em" />

  <Popover>Menu</Popover>

  <ButtonHole>
    {#if mobileBtnSrc}
      <img src="{mobileBtnSrc}" width="35" height="35" alt="" />
    {:else}
      <Loader />
    {/if}
  </ButtonHole>
</Button>
