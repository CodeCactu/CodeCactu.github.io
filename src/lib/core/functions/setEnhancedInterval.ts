import { Promiseable } from "../types"

export type State = `break`
export type Interval = {
  count?: number
  ms: number
}

export default function setEnhancedInterval( cb:() => Promiseable<void | State>, times:number | Interval[] ) {
  const currentInterval = { index:0, count:0 }
  let timeoutId = -1

  const setTimeout = () => {
    timeoutId = window.setTimeout( async() => {
      const timerState = await cb()

      if (timerState === `break`) return

      currentInterval.count++

      if (typeof times !== `number` && currentInterval.count > (times[ currentInterval.index ].count ?? 1)) {
        currentInterval.count = 0
        currentInterval.index++

        if (!times[ currentInterval.index ]) return
      }

      setTimeout()
    }, typeof times === `number` ? times : times[ currentInterval.index ].ms )
  }

  setTimeout()

  return [ () => window.clearTimeout( timeoutId ), timeoutId ] as const
}
