<script lang="ts">
    import { auth } from "@fet/auth/authRune.svelte";
  import { type CactuJamCategory } from "@fet/backends/cactu/cactuJamCategory";
  import { type CactuJamGame } from "@fet/backends/cactu/cactuJamGame"
  import { loadCactuJamUserVotes, saveCactuJamUserVotes, type CactuJamUserVotes } from "@fet/backends/cactu/cactuJamVotes"
  import TierLadder, { getDragAreasLists, type AssignementSummary, type TierLadderTier } from "@fet/tierLadder/TierLadder.svelte"
    import { onMount } from "svelte";

  let { games, categories }:{
    games: CactuJamGame[]
    categories: CactuJamCategory[]
  } = $props()

  const translation:Record<string,{ name:string, description:null | string, tiers:string[] }> = {
    theme: {
      name: `Temat`,
      description: `Zgodność z tematem, w tym tematami dodatkowymi`,
      tiers: [
        `Temat został zaimplementowany w mechanikach dzieła, mechaniki są spójne z tematem a ich podmiana zupełnie by zmieniła produkt.`,
        `Temat występuje przykładowo w tle, okala produkcję, gra jakoś nawiązuje do tematu.`,
        `Temat nie jest dostrzegalny, lub jest niezwykle szczątkowy`,
      ]
    },
    readability: {
      name: `Czytelność`,
      description: `Czytelność i jasność zasad. Czy wiadomo co robić (jeśli błądzisz, czy wiesz o tym ze czegoś szukasz)`,
      tiers: [
        `Nikt nic nie musi dopowiadać. Jeśli tak się dzieje, to tylko w sytuacji gdy z gry nie wynika że powinno się do czegoś dojść samemu.`,
        `Autor musi wyjaśnić drobne kwestie ale poza prostymi dopowiedzeniami produkt względnie się tłumaczy`,
        `Niczego nie zrozumiałeś. Produkt niczego nie tłumaczy i bez pomocy autora nic nie zrobisz.`,
      ],
    },
    impressions: {
      name: `Ogólne wrażenie`,
      description: ``,
      tiers: [
        `Chcesz więcej, nawet jeśli było coś nie tak to nie ma to zestawienia z plusami. Bardzo przyjemna gra.`,
        `Sympatyczna produkcja, wywołała przyjemne odczucia lub zachęciła do ponownej gry. Być może zagrałbyś w kontynuację lub wersję 2.0.`,
        `Nic dodać nic ująć -- wartość domyślna, zaznacz jeśli nic szczególnie nie wpłynęło na Twoje wrażenia.`,
        `Powiewa delikatną nudą, fajne ale nie rób więcej.`,
        `Monotonia, nuda, brak zaciekawienia odbiorcy, niechęć do przejścia całości lub przejście z trudem.`,
      ]
    },
    rules: {
      name: `Zgodność z zasadami`,
      description: null,
      tiers: [
        `Produkcja jest zdaje się być w zgodzie z ustalonymi zasadami -- wartość domyślna.`,
        `Praca budzi wątpliwości pod kątem ustalonych zasad.`,
        `Praca ewidentnie naruszyła zasady konkursu. Nadanie tej oceny to istotny zarzut konieczny do zweryfikowania.`,
      ]
    },
    realisation: {
      name: `Ogólna realizacja`,
      description: `Spójność produktu, dobrze dobrane wizualia.`,
      tiers: [
        `Wszystko świetnie ze sobą współgra razem tworząc jedność.`,
        `Dobrze dobrane elementy`,
        `Nic dodać nic ująć -- wartość domyślna, zaznacz jeśli nic szczególnie nie wpłynęło na Twoje wrażenia`,
        `Niektóre elementy do siebie nie pasują, całość nie współgra najlepiej.`,
        `Bez składu i ładu -- mało co do siebie pasuje.`,
      ]
    },
    bonus: {
      name: `Wyróżnienie`,
      description: `Okazja na docenienie/wyróżenienie czyjejś pracy/gry, możliwość przyznania osobistego bonusu`,
      tiers: [
        `Wyraz uznania dla danej produkcji. Można docenić grę lub autora za wykonaną pracę (zaleca się przydzielenie bonusów z oszczędnością; standardowo może 1, góra 2 wyróżnienia)`,
        `Brak bonusu, wartość domyślna.`,
      ]
    },
  }

  let userVotes = $state<undefined | CactuJamUserVotes>( undefined )

  const ladders = $derived(
    categories.map( category => {
      const t = translation[ category.name ]
      const categoryVotes = userVotes?.[ category.name ]

      const ladderData = {
        label: t.name,
        name: category.name,
        description: t.description,
        tiers: t.tiers.map<TierLadderTier>( (descriptionText, i) => ({
          description: descriptionText,
          assignments: categoryVotes?.[ `t${t.tiers.length - i - 1}` ]
            .map( v => games.find( g => g.id === v ) )
            .filter( g => !!g )
            .map<AssignementSummary>( g => ({ id:g.id, thumbnailUri:g.thumbnailUri }) )
            ?? []
        }) )
      }

      return ladderData
    })
  )

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
