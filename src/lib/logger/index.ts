import { backgroundColors, BgColor, FgColor, foregroundColors } from "./colors"

export type AlignConfig = {
  align?: `left` | `center` | `right`
  minLength?: number
  maxLength?: number
}

export type LogConfig = AlignConfig & {
  value: string | (() => string)
  color?: FgColor
  bgColor?: BgColor
  style?: Record<string, string>
}

export type LoggerSimpleValue = string | number | boolean
export type LoggerItem = LoggerSimpleValue | LogConfig | unknown[]

const inBrowser = typeof window !== `undefined`

export default function log( ...items:LoggerItem[] ) {
  const itemsCopy = [ ...items ]
  const results:unknown[] = []
  let pattern = ``

  for (const item of itemsCopy) {
    if (Array.isArray( item )) {
      for (const value of item) {
        results.push( ``, value )
        pattern += getPatternPart( pattern, value )
      }

      continue
    }

    if (item && typeof item === `object`) {
      const value = typeof item.value === `function` ? item.value() : item.value
      const data = processData( value, item )
      results.push( data.css, data.value )
    } else {
      results.push( ``, item )
    }

    pattern += getPatternPart( pattern, results.at( -1 ) )
  }

  console.log( pattern, ...results )
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

function getPatternPart( pattern:string, last:unknown ) {
  if (typeof last === `string`) return `%c%s`
  if (pattern.at( -1 ) === ` `) return `%c%o `
  return `%c %o `
}

function processData( rawValue:LoggerSimpleValue, config:LogConfig ) {
  const css:string[] = []

  const value = typeof rawValue !== `string` ? rawValue : align( rawValue, config )
  if (config.color) css.push( `color:${inBrowser ? config.color : foregroundColors[ config.color ] ?? config.color}` )
  if (config.bgColor) css.push( `background-color:${inBrowser ? config.bgColor : backgroundColors[ config.bgColor ] ?? config.bgColor}` )
  if (config.style) {
    Object.entries( config.style ).forEach( ([ k, v ]) => {
      const key = k.replace( /[A-Z]/g, m => `-${m.toLowerCase()}` )
      css.push( `${key}:${v}` )
    } )
  }

  return { value, css:css.join( `;` ) }
}
