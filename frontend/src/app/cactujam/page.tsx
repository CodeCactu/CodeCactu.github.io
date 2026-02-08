import { Text } from "@fet/flow/Text"
import Surface from "@fet/flow/Surface"
import TierList from "@fet/TierList"

export default function CactuJamPage() {
  return (
    <main>
      <Text as="h1">CactuJam</Text>

      <Surface>
        <TierList />
      </Surface>
    </main>
  )
}
