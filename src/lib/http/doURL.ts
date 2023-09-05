import { filterObject } from "../core/functions/objectUtils"
import getWindow from "../core/functions/getWindow"

export type QueryObj = Record<string, string | number | boolean | null | undefined>

export default doURL
export function doURL( path:string, queryObj:QueryObj = {} ) {
  // path = fixPathSlashes( path )
  path = fixpathOrigin( path )

  if (!queryObj) return path

  const query = objToQuery( queryObj )

  if (query) path = `${path}?${query}`

  return path
}

export function normalizeSlashes( path:string, { start = true, end = false } = {} ) {
  path = !start ||  path.startsWith( `/` ) ? path : path.slice( 1 )
  path = !end   || !path.endsWith( `/` )   ? path : path + `/`

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

export function objToQuery( queryObj:QueryObj, includeQuestionmark = false ) {
  const searchEntries = Object.entries( filterObject( queryObj ) )

  if (!searchEntries.length) return ``

  const queryStr = searchEntries.map( pair => pair[ 1 ] === true ? pair[ 0 ] : pair.join( `=` ) ).join( `&` )

  return !queryStr ? queryStr : (includeQuestionmark ? `?` : ``) + queryStr
}
