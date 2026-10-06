<script lang="ts">
    import { loadCactuJamCategories, type CactuJamCategory } from "@fet/backends/cactu/cactuJamCategory";
  import { type CactuJamGame } from "@fet/backends/cactu/cactuJamGame"
  import { loadCactuJamGames } from "@fet/backends/cactu/cactuJamGame"
  import { loadCactuJamUserVotes, type CactuJamUserVotes } from "@fet/backends/cactu/cactuJamVotes"
  import TierLadder from "@fet/tierLadder/TierLadder.svelte"

  type TierladderData = {
    games: CactuJamGame[]
    userVotes?: CactuJamUserVotes
    categories: CactuJamCategory[]
  }

  let tierLadderData = $state<undefined | TierladderData>( undefined )

  Promise.all([
    loadCactuJamGames(),
    loadCactuJamUserVotes(),
    loadCactuJamCategories(),
  ]).then( ([games, userVotes, categories]) => {
    console.log(categories)
    tierLadderData = { games, userVotes, categories }
  })
</script>

{#if tierLadderData}
  <!-- <TierLadder highestValue={5} items={tierLadderData.games} assignments={tierLadderData.userVotes?.theme ?? {}} /> -->

  {#each tierLadderData.categories as category}
    <TierLadder
      name={category.name}
      highestValue={category.highestValue}
      items={tierLadderData.games}
      assignments={tierLadderData.userVotes?.[ category.name ] ?? {}}
    />
  {/each}
{/if}
