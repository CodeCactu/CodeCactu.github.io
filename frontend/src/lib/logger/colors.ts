import { capitalize } from "@lib/core/functions"

export const foregroundColors = {
  black: `\x1b[30m`,
  red: `\x1b[31m`,
  green: `\x1b[32m`,
  yellow: `\x1b[33m`,
  blue: `\x1b[34m`,
  magenta: `\x1b[35m`,
  cyan: `\x1b[36m`,
  white: `\x1b[37m`,
}

export const backgroundColors = {
  black: `\x1b[40m`,
  red: `\x1b[41m`,
  green: `\x1b[42m`,
  yellow: `\x1b[43m`,
  blue: `\x1b[44m`,
  magenta: `\x1b[45m`,
  cyan: `\x1b[46m`,
  white: `\x1b[47m`,
}

export const colorModificators = {
  reset: `\x1b[0m`,
  bright: `\x1b[1m`,
  dim: `\x1b[2m`,
  underscore: `\x1b[4m`,
  blink: `\x1b[5m`,
  reverse: `\x1b[7m`,
  hidden: `\x1b[8m`,
} as const

export type ColorModificator = keyof typeof colorModificators
export type FgColor = keyof typeof foregroundColors
export type BgColor = keyof typeof backgroundColors
export type Color = `fg${Capitalize<FgColor>}` | `bg${Capitalize<BgColor>}`
export type ColorData = Color | ColorModificator

export const colors:Record<ColorData, string> = {
  ...colorModificators,
  ...Object.fromEntries( Object.entries( foregroundColors ).map( ([ k, v ]) => [ `fg${capitalize( k )}`, v ] ) ) as Record<`fg${Capitalize<FgColor>}`, string>,
  ...Object.fromEntries( Object.entries( backgroundColors ).map( ([ k, v ]) => [ `fg${capitalize( k )}`, v ] ) ) as Record<`bg${Capitalize<BgColor>}`, string>,
}

export const colorsReg = new RegExp( [
  `\\[(?<fragColor>`,
  [
    Object.keys( colorModificators ).join( `|` ),
    Object.keys( foregroundColors ).map( c => `fg${capitalize( c )}` ).join( `|` ),
    Object.keys( backgroundColors ).map( c => `bg${capitalize( c )}` ).join( `|` ),
  ].join( `|` ),
  `})](?<data>.*?)\\[]`,
].join( `` ), `gs` )
