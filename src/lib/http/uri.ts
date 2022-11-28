import { filterObject } from "../core/functions/objectUtils"
import getWindow from "../core/functions/getWindow"

export type QueryObj = Record<string, string | number | boolean | null | undefined>

export default fixUri
export function fixUri( path:string, queryObj:QueryObj = {} ) {
  // path = fixPathSlashes( path )
  path = fixpathOrigin( path )

  if (!queryObj) return path

  const query = createQueryFromObject( queryObj )

  if (query) path = `${path}?${query}`

  return path
}

export function fixPathSlashes( path:string, { start = true, end = false } = {} ) {
  path = !start ? path : (path.startsWith( `/` ) ? path.slice( 1 ) : path)
  path = !end ? path : path.endsWith( `/` ) ? path : `${path}/`

  return path
}

export function fixpathOrigin( path:string ) {
  const location = getWindow()?.location

  if (!location) return path

  const originWithoutPort = `${location.protocol}//${location.hostname}`

  if (path.startsWith( `/` )) path = location.origin + path
  if (path.startsWith( `:` )) path = originWithoutPort + path

  return path
}

export function createQueryFromObject( queryObj:QueryObj ) {
  const searchEntries = Object.entries( filterObject( queryObj ) )

  if (!searchEntries.length) return ``

  const queryStr = searchEntries.reduce( (str, [ k, v ]) => `${str}&${k}=${v}`, `` )

  return queryStr
}
