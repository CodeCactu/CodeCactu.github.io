import { useSyncExternalStore } from "react"

export function createStore<T>( initialValue:T ) {
  const subscribers = new Set<() => void>()
  let value = initialValue

  const updateStore = (newValue:T) => {
    value = newValue
    subscribers.forEach( s => s() )
  }

  const useStore = () => {
    const storeValue = useSyncExternalStore(
      subscriber => {
        subscribers.add( subscriber )
        return () => subscribers.delete( subscriber )
      },
      () => value,
      () => value,
    )

    return [ storeValue, updateStore ] as const
  }

  return [ useStore, updateStore ] as const
}
