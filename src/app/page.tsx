import CactuBanner from "@fet/CactuBanner"
import Link from "@fet/controls/Link"
import classes from "./page.module.css"
import "./page.css"

export default function Home() {
  return (
    <main className={classes.content}>
      <header>
        <CactuBanner />
      </header>

      <nav>
        <Link href="/CactuJam">cactujam</Link>
      </nav>
    </main>
  )
}
