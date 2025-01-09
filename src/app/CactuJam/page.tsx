import CactuJamTable from "@fet/CactuJam/CactuJamTable"
import classes from "./page.module.css"
import { Suspense } from "react"

export default function CactuJamPage() {
  return (
    <main className={classes.content}>
      <h1>cactujam</h1>

      <Suspense>
        <CactuJamTable />
      </Suspense>
    </main>
  )
}
