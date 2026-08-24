<script lang="ts">
  import { auth } from './authRune.svelte'

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

{#if auth.session === undefined}
  <div>
    <span class="spinner"></span>
    Sprawdzanie sesji...
  </div>
{:else if auth.session === null}
  <a href={auth.getDiscordIntegrationLink()}>Zaloguj się</a>
{:else}
  {const user = auth.session.user ?? auth.session}

  <div>
    <img
      src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatarHash}.png?size=1024`}
      alt={user.name}
      class="notched"
      width="40"
      height="40"
      onerror={e => (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/40'}
    />

    <span>Witaj, {user.name}!</span>
    <button onclick={auth.logout}>Wyloguj</button>
  </div>
{/if}
