/* eslint-disable @typescript-eslint/no-empty-object-type */


import { FilterObject, Primitive } from "../types"

const caseKey = `base`
export interface ResponsiveAreas {}
export type ResponsiveArea = keyof { [K in keyof ResponsiveAreas as ResponsiveAreas[K] extends false ? never : K]:ResponsiveAreas[K] }

export interface SpacingNames {}
export type SpacingName = keyof { [K in keyof SpacingNames as SpacingNames[K] extends false ? never : K]:SpacingNames[K] }

export type ResponsivePropertyValue<T, RWDKeys extends string = ResponsiveArea> = T | ({ [K in ResponsiveArea as `_${K}`]?:T } & {  [K in `_${typeof caseKey}`]?:T })
export type WithResponsiveProperties<
  Props extends Record<string, unknown>,
  RWDProps extends keyof FilterObject<Required<Props>, Primitive>,
  RWDKeys extends string = ResponsiveArea,
> = { [K in keyof Props]:K extends RWDProps
  ? (Props[K] extends undefined | Primitive ? ResponsivePropertyValue<Props[K], RWDKeys> : Props[K])
  : Props[K]
}

export type ResponsivePropertyName = string

export type ValueParser<T> = (value:ResponsivePropertyValue<T>) => undefined | false | number | string | React.CSSProperties

export function parseResponsiveAlignAsCSSVar<T extends undefined | `left` | `center` | `right`>( property:ResponsivePropertyValue<T>, justText = false ) {
  if (!property) return
  if (typeof property !== `object`) return {
    [ `--align` ]: property,
    [ `--align-margin-${property}` ]: justText ? undefined : `auto`,
    // [ `--rwd-align-margin-` + `${property}`.charAt( 0 ) ]: justText ? undefined : `auto`,
  }

  const entries = Object.entries( property ).flatMap( ([ k, v ]) => {
    if (k === `_${caseKey}`) return [
      [ `--align`, v ],
      v && !justText ? [ `--align-margin-${v}`, `auto` ] : [],
    ]

    const entries = [ [ `--rwd-align-${k.slice( 1 )}`, v ] ]

    if (v && !justText) {
      if (v === `left`) {
        entries.push( [ `--rwd-align-${k.slice( 1 )}-margin-left`, `auto` ], [ `--rwd-align-${k.slice( 1 )}-margin-right`, `0` ] )
      } else if (v === `right`) {
        entries.push( [ `--rwd-align-${k.slice( 1 )}-margin-left`, `0` ], [ `--rwd-align-${k.slice( 1 )}-margin-right`, `auto` ] )
      } else {
        entries.push([ `--rwd-align-${k.slice( 1 )}-margin-center`, `auto` ])
      }
    }


    return entries
  } )

  return Object.fromEntries( entries )
}

export function parseResponsivePropertyAsCssVar<T>( varName:ResponsivePropertyName, property:ResponsivePropertyValue<T>, mainPparser?:ValueParser<T>, rwdParser?:ValueParser<T> ) {
  if (property == undefined) return {}
  if (typeof property !== `object`) {
    return { [ varName ]:mainPparser?.( property ) ?? property }
  }

  const nonVariableVarName = varName.startsWith( `--` ) ? varName.slice( 2 ) : varName
  const properties:Record<string, unknown> = {}
  const parse = (v:T) => {
    const parsedValue = rwdParser?.( v ) ?? mainPparser?.( v ) ?? v
    if ([ `number`, `string` ].includes( typeof parsedValue )) return parsedValue
    return undefined
  }

  if (mainPparser) {
    const parsedValue = mainPparser( property )

    if (parsedValue) {
      if (typeof parsedValue === `object`) Object.assign( properties, parsedValue )
      else properties[ varName ] = parsedValue
    }
  }

  for (const field in property) {
    if (field.charAt( 0 ) !== `_`) continue

    const value = property[ field as keyof typeof property ] as T

    if (field === `_${caseKey}`) {
      properties[ varName ] = mainPparser?.( value ) ?? value
    } else {
      const key = `--rwd-${nonVariableVarName}-${field.slice( 1 )}`

      if (typeof value === `object`) {
        for (const subField in value) {
          properties[ `${key}-${subField}` ] = parse( value[ subField ] as T )
        }
      } else {
        properties[ `--rwd-${nonVariableVarName}-${field.slice( 1 )}` ] = parse( value )
      }
    }
  }

  return properties as React.CSSProperties
}

export function updateResponsivePropertiesToStyle<T>( style:React.CSSProperties, varName:ResponsivePropertyName, property:undefined | ResponsivePropertyValue<T>, mainPparser?:ValueParser<T>, rwdParser?:ValueParser<T> ) {
  if (property == undefined) return style

  const rwdObj = parseResponsivePropertyAsCssVar( varName, property, mainPparser, rwdParser )
  if (varName === `margin` && property === 0) console.log({ varName, property, rwdObj })

  for (const property in rwdObj) {
    if (rwdObj[ property as `all` ]) style[ property as `all` ] = rwdObj[ property as `all` ]
  }
}

export function addResponsivePropertiesToStyle<T>( style:undefined | React.CSSProperties, varName:ResponsivePropertyName, property:undefined | ResponsivePropertyValue<T>, mainPparser?:ValueParser<T>, rwdParser?:ValueParser<T> ) {
  if (!property) return style
  return { ...style, ...parseResponsivePropertyAsCssVar( varName, property, mainPparser, rwdParser ) }
}
