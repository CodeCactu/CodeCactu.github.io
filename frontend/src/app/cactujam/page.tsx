import "./page.css"
import { Text } from "@fet/flow/Text"
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

      <TierLists games={games} categories={categories} />
    </main>
  )
}
