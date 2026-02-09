type CachedDataResolver<T = unknown> = (value:T | PromiseLike<T>) => void
type CachedData<T = unknown> = {
  queueData: null | { abortController: AbortController, queue: CachedDataResolver<T>[] }
  updatedAt: number
  data: T
}

type Loader<T> = (abortSignal:AbortSignal) => Promise<T>
type CachedLoaderConfig = {
  revalidateTime?: number
  treesholdMs?: number
  abortTimeSeconds?: number
}


type CacheKey = symbol | string
const candlesRequestsCache = new Map<CacheKey, CachedData<any>>() // eslint-disable-line @typescript-eslint/no-explicit-any

export type CachedLoaderReturnValue<T> = [ Promise<T>, null | AbortController ]

export default function loadCached<T = unknown>( key:CacheKey, loader:Loader<T>, { abortTimeSeconds = 20, treesholdMs = 0, revalidateTime = 1000 * 60 }:CachedLoaderConfig = {} ) {
  if (!candlesRequestsCache.has( key )) candlesRequestsCache.set( key, {
    updatedAt: Date.now(),
    data: undefined,
    queueData: null,
  } )

  const cachedData = candlesRequestsCache.get( key ) as CachedData<T>

  if (cachedData.queueData !== null) {
    let resolve:CachedDataResolver<T> = () => {}
    const promise = new Promise<T>( r => { resolve = r } )

    cachedData.queueData.queue.push( resolve )

    return [ promise, cachedData.queueData.abortController ] as CachedLoaderReturnValue<T>
  }

  if (cachedData.data !== undefined && cachedData.updatedAt > Date.now() - revalidateTime) {
    return [ Promise.resolve( cachedData.data ), null ] as CachedLoaderReturnValue<T>
  }

  cachedData.queueData = {
    abortController: new AbortController(),
    queue: [],
  }

  const abortCtrl = cachedData.queueData.abortController
  const abortTimerId = setTimeout( () => abortCtrl.abort(), 1000 * abortTimeSeconds )

  return [
    new Promise<T>( r => setTimeout( () => r( loader( abortCtrl.signal ) ), treesholdMs ) ).then( res => {
      clearTimeout( abortTimerId )

      cachedData.updatedAt = Date.now()
      cachedData.data = res
      cachedData.queueData?.queue.forEach( fn => fn( cachedData.data ) )
      cachedData.queueData = null

      return res
    } ),
    abortCtrl,
  ] as CachedLoaderReturnValue<T>
}

export function clearCache( ...keys:CacheKey[] ) {
  if (!keys.length) candlesRequestsCache.clear()
  else keys.forEach( k => candlesRequestsCache.delete( k ) )
}

export function getCache<T>( key:CacheKey ) {
  return candlesRequestsCache.get( key )?.data as undefined | T
}
