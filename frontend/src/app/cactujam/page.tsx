import { Text } from "@fet/flow/Text"
import Surface from "@fet/flow/Surface"
import { loadCactuJamGames } from "@fet/backend/games"
import { loadCactuJamCategories } from "@fet/backend/categories"
import TierLists from "./TierLists"

export default async function CactuJamPage() {
  const [ games, categories ] = await Promise.all([
    loadCactuJamGames(),
    loadCactuJamCategories(),
  ])

  return (
    <main>
      <Text as="h1">CactuJam</Text>

      <Surface>
        <TierLists games={games} categories={categories} />
      </Surface>
    </main>
  )
}
