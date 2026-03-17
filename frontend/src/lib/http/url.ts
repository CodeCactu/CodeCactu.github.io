import { filterObject } from "../core/functions/objectUtils"
import getWindow from "../core/functions/getWindow"

export type QueryObj = Record<string, string | number | boolean | null | undefined>

export function doURL( paths:string[], queryObj?:QueryObj ):string
export function doURL( path:string, queryObj?:QueryObj ):string
export function doURL( path:string | string[], queryObj?:QueryObj ) {
  return fixPathOrigin( typeof path === `string` ? path : path.join( `/` ) ) + objToQuery( queryObj, true )
}

export function fixPathOrigin( path:string ) {
  const location = getWindow()?.location

  if (!location) return path

  const originWithoutPort = `${location.protocol}//${location.hostname}`

  if (path.startsWith( `/` )) path = location.origin + path
  if (path.startsWith( `:` )) path = originWithoutPort + path

  return path
}

export function objToQuery( queryObj:undefined | null | QueryObj, includeQuestionmark = false ) {
  if (!queryObj) return ``

  const searchEntries = Object.entries( filterObject( queryObj ) )

  if (!searchEntries.length) return ``

  const queryStr = searchEntries.map( pair => pair[ 1 ] === true ? pair[ 0 ] : pair.join( `=` ) ).join( `&` )

  return !queryStr ? queryStr : (includeQuestionmark ? `?` : ``) + queryStr
}

export function normalizeSlashes( path:string, { start = true, end = false } = {} ) {
  if (start !== undefined) {
    const starts = path.startsWith( `/` )

    if (start) {
      if (!starts) path = `/` + path
    } else if (starts) path = path.slice( 1 )
  }

  if (end !== undefined) {
    const ends = path.startsWith( `/` )

    if (end) {
      if (!ends) path = path + `/`
    } else if (ends) path = path.slice( 1 )
  }

  return path
}

export function getQueryFlags<T extends string>(queryObj:Record<string, unknown>, fields:T[]) {
  return fields.reduce( (obj, field) => ({ ...obj, [ field ]:queryObj[ field ] === `` }), {} ) as Record<T, boolean>
}

export function updateQuery( url:string, queryObj:Record<string, string | number | boolean | null | undefined> ) {
  let [ path, queryStr ] = url.split( `?` )

  if (queryStr === undefined) {
    if (!path.includes( `/` )) [ path, queryStr ] = [ ``, path ]
    else queryStr = ``
  }

  const query = Object.fromEntries( queryStr.split( `&` ).map( pair => pair.split( `=` ) ) )

  Object.entries( queryObj ).forEach( ([ k, v ]) => query[ k ] = v )

  return path + objToQuery( query, true )
}
