<script lang="ts">
  import cn from '@lib/core/functions/createClassName'
  import { auth } from './authRune.svelte'
  import defaultAvatar from "./default-avatar.webp"
  import classes from "./UserPanel.module.css"
  import LogoutIcon from "./logoutIcon.svelte"
  import LoginIcon from "./loginIcon.svelte"
  import Loader from '@fet/flow/Loader.svelte'
  import Popover from '@fet/flow/Popover.svelte'

  $effect( () => {
    const url = new URL( window.location.href )
    const code = url.searchParams.get( `code` )

    if (code) {
      url.searchParams.delete( `code` )
      window.history.replaceState( {}, '', url.pathname + url.search )
      auth.login( code )
    } else if (auth.session === undefined) {
      auth.loadSession()
    }
  } )
</script>

<div class={cn( classes.avatarArea, "notched" )}>
  {#if auth.session === undefined}
    <div class={cn( "notched", classes.avatar )}>
      <Loader />
    </div>
  {:else if auth.session === null}
    <img
      src={defaultAvatar.src}
      class={cn( "notched", classes.avatar )}
      width="40"
      height="40"
      alt={""}
      onerror={e => (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/40'}
    />

    <a class={classes.login} href={auth.getDiscordIntegrationLink()}>
      <LoginIcon width={16} height={16} />
      <Popover>Zaloguj</Popover>
    </a>
  {:else}
    {const user = auth.session.user ?? auth.session}

    <img
      src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatarHash}.png?size=1024`}
      class={cn( "notched", classes.avatar )}
      width="50"
      height="50"
      alt={user.name}
      onerror={e => (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/40'}
    >

    <button class={classes.logout} onclick={() => auth.logout()}>
      <LogoutIcon width={16} height={16} />
      <Popover>Wyloguj</Popover>
    </button>
  {/if}
</div>
