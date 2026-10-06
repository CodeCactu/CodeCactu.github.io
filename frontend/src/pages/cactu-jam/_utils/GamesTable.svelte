<script lang="ts">
  import { type CactuJamGame } from "@fet/backends/cactu/cactuJamGame"
  import { loadCactuJamGames } from "@fet/backends/cactu/cactuJamGame"
  import { loadCactuJamUserVotes, type CactuJamUserVotes } from "@fet/backends/cactu/cactuJamVotes"
  import TierLadder from "@fet/tierLadder/TierLadder.svelte"

  type TierladderData = {
    games: CactuJamGame[]
    userVotes?: CactuJamUserVotes
  }

  let tierLadderData = $state<undefined | TierladderData>( undefined )

  Promise.all([
    loadCactuJamGames(),
    loadCactuJamUserVotes(),
  ]).then( ([games, userVotes]) => {
    tierLadderData = { games, userVotes }
  })
</script>

{#if tierLadderData}
  <TierLadder highestValue={5} items={tierLadderData.games} assignments={tierLadderData.userVotes?.theme ?? {}} />
{/if}
