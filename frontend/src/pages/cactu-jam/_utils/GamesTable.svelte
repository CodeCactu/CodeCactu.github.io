<script lang="ts">
  import { onMount } from "svelte"
  import { createTranslator } from "@fet/translation"
  import TierLadder, { getDragAreasLists, type AssignementSummary, type TierLadderTier } from "@fet/tierLadder/TierLadder.svelte"
  import { loadCactuJamUserVotes, saveCactuJamUserVotes, type CactuJamUserVotes } from "@fet/backends/cactu/cactuJamVotes"
  import { type CactuJamGame } from "@fet/backends/cactu/cactuJamGame"
  import { type CactuJamCategory } from "@fet/backends/cactu/cactuJamCategory"
  import { auth } from "@fet/auth/authRune.svelte"
  import translation from "../_translation"

  let { games, categories }:{
    games: CactuJamGame[]
    categories: CactuJamCategory[]
  } = $props()

  const t = createTranslator( translation )

  let userVotes = $state<undefined | CactuJamUserVotes>( undefined )

  const ladders = $derived(
    categories.map( category => {
      const categoryKey = `categories.${category.name}`
      const categoryVotes = userVotes?.[ category.name ]
      const ratings = Array.from( { length:category.highestValue + 1 }, (_, index) => category.highestValue - index )

      return {
        label: textOr( `${categoryKey}.name`, category.name ),
        name: category.name,
        description: textOr( `${categoryKey}.description`, null ),
        tiers: ratings.map<TierLadderTier>( rating => ({
          description: textOr( `${categoryKey}.tiers.t${rating}`, `` ),
          assignments: categoryVotes?.[ `t${rating}` ]
            .map( v => games.find( g => g.id === v ) )
            .filter( g => !!g )
            .map<AssignementSummary>( g => ({ id:g.id, thumbnailUri:g.thumbnailUri }) )
            ?? [],
        }) ),
      }
    } ),
  )

  function textOr<Fallback>( key:string, fallback:Fallback ) {
    return t.has( key ) ? t( key ) : fallback
  }

  function handleDragEnd() {
    const ladders = getDragAreasLists()
    console.log( `Votes update`, ladders )
    saveCactuJamUserVotes( ladders )
  }

  onMount( () => {
    if (!auth.session) return
    loadCactuJamUserVotes().then( uv => userVotes = uv )
  } )
  $effect( () => userVotes && console.log({ ladders }) )
  $effect( () => {
    if (!auth.session && userVotes) userVotes = undefined
  } )
</script>

{#each ladders as ladder}
  <TierLadder
    label={ladder.label}
    name={ladder.name}
    tiers={ladder.tiers}
    description={ladder.description}
    onDragEnd={handleDragEnd}
  />
{/each}
