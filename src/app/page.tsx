import CactuBanner from "@fet/CactuBanner"
import Link from "@fet/controls/Link"
import "./page.css"

export default function Home() {
  return (
    <main>
      <header>
        <CactuBanner />
      </header>

      <nav>
        <Link href="/CactuJam">cactujam</Link>
      </nav>
    </main>
  )
}
