import { Arrayable } from "@lib/core/types"
import * as theme from "."

export const parseCssValue = (val:undefined | number | string) => val == undefined ? undefined : (typeof val === `string` ? val : `${val}px`)
export const parseCssProperty = (key:string, val:undefined | number | string) => val == undefined ? undefined : `${key}: ` + parseCssValue( val )


const cssScopes:string[] = []

cssScopes.push( stringifyCssValues( theme.colors, (k, v) => parseCssProperty( `--color-${k}`, v ) ) )
cssScopes.push( stringifyCssValues( theme.border, (k, v) => parseCssProperty( `--border-${k}`, v ) ) )
cssScopes.push( stringifyCssValues( theme.fonts as Record<string, theme.FontConfig>, (k, v) => [
  parseCssProperty( `--typography-${k}-family`, v.fontFamily ),
  parseCssProperty( `--typography-${k}-weight`, v.fontWeight ? `${v.fontWeight}` : undefined ),
  parseCssProperty( `--typography-${k}-size`, v.fontSize ),
  parseCssProperty( `--typography-${k}-lineHeight`, v.lineHeight ),
  parseCssProperty( `--typography-${k}-letterSpacing`, v.letterSpacing ),
  [
    `--font-${k}:`,
    v.fontWeight,
    parseCssValue( v.fontSize ),
    v.lineHeight !== undefined && `/ ${parseCssValue( v.lineHeight )}`,
    v.fontFamily,
  ].filter( (v): v is string => !!v ).join( ` ` ),
] ) )
cssScopes.push( stringifyCssValues( theme.custom, (k, v) => parseCssProperty( `--${k}`, v ) ) )

export const themeCss = `:root {\n  ${cssScopes.join( `;\n  ` )};\n}`
export function StyleTheme() {
  return <style dangerouslySetInnerHTML={{ __html:themeCss }} />
}

function stringifyCssValues<T extends Record<string, unknown>>( obj:T, cb:(key:keyof T, value:T[keyof T]) => Arrayable<undefined | string> ) {
  return Object.entries( obj ).flatMap( ([ k, v ]) => cb( k as keyof T, v as T[keyof T] ) ).filter( Boolean ).join( `;\n  ` )
}
