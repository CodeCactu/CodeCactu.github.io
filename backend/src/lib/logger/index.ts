import getTrueColor, { TrueColorConfig, TrueColor } from "./getTrueColor"
export { getTrueColor, type TrueColorConfig, type TrueColor }

export type AlignConfig = {
  align?: `left` | `center` | `right`
  minLength?: number
  maxLength?: number
}

export type LogConfig = AlignConfig & {
  value: string | (() => string)
  color?: TrueColorConfig[`fg`]
  bgColor?: TrueColorConfig[`bg`]
  style?: TrueColorConfig
}

export type LoggerSimpleValue = string | number | boolean
export type LoggerItem = LoggerSimpleValue | LogConfig | unknown[]

export default function log( ...items:LoggerItem[] ) {
  const itemsCopy = [ ...items ]
  const results:unknown[] = []

  for (const item of itemsCopy) {
    if (Array.isArray( item )) {
      for (const value of item) {
        results.push( value )
      }

      continue
    }

    if (item && typeof item === `object`) {
      const value = typeof item.value === `function` ? item.value() : item.value
      const data = processData( value, item )
      results.push( data.value )
    } else {
      results.push( item )
    }
  }

  const result:unknown[] = []
  for (const item of results) {
    const last = result.at( -1 )

    if (typeof last === `string` && typeof item === `string`) result[ result.length - 1 ] = last + item
    else result.push( item )
  }

  console.log( ...result )
}

function align( str:string, { align = `left`, minLength = 0, maxLength }:AlignConfig ) {
  const additionalSpace = Math.max( 0, minLength - str.length )

  if (maxLength && str.length >= maxLength) str = str.slice( 0, maxLength - 3 ) + `...`
  else switch (align) {
    case `left`:
      str += ` `.repeat( additionalSpace )
      break

    case `right`:
      str = ` `.repeat( additionalSpace ) + str
      break

    case `center`:
      const half = Math.floor( additionalSpace / 2 )
      str = ` `.repeat( half ) + str + ` `.repeat( additionalSpace - half )
  }

  return str
}

function processData( rawValue:LoggerSimpleValue, config:LogConfig ) {
  const value = typeof rawValue !== `string` ? rawValue : align( rawValue, config )
  const style = {
    fg: config.color,
    bg: config.bgColor,
    ...config.style,
  }

  return { value:getTrueColor( `${value}`, style ) }
}
