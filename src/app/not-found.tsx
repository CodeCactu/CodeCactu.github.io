import CactuBanner from "@fet/CactuBanner"
import classes from "./page.module.css"

export default function Home() {
  return (
    <main className={classes.content}>
      <header>
        <CactuBanner />
      </header>

      Not found
    </main>
  )
}
