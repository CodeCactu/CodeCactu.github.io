import { Arrayable } from "@lib/core/types"
import * as theme from "."

type CssValue = number | string
export const parseCssValue = (key:string, val:undefined | number | string) => val == undefined ? undefined : `${key}: ` + (typeof val === `string` ? val : `${val}px`)


const cssScopes:string[] = []

cssScopes.push( stringifyCssValues( theme.colors as Record<string, CssValue>, (k, v) => parseCssValue( `--color-${k}`, v ) ) )
// cssScopes.push( stringifyCssValues( theme.spacing as Record<string, CssValue>, (k, v) => parseCssValue( `  --space-${k}`, v ) ) )
cssScopes.push( stringifyCssValues( theme.border as Record<string, CssValue>, (k, v) => parseCssValue( `--border-${k}`, v ) ) )
cssScopes.push( stringifyCssValues( theme.fonts as Record<string, theme.FontConfig>, (k, v) => [
  parseCssValue( `--typography-${k}-family`, v.fontFamily ),
  parseCssValue( `--typography-${k}-weight`, v.fontWeight ? `${v.fontWeight}` : undefined ),
  parseCssValue( `--typography-${k}-size`, v.fontSize ),
  parseCssValue( `--typography-${k}-lineHeight`, v.lineHeight ),
  parseCssValue( `--typography-${k}-letterSpacing`, v.letterSpacing ),
] ) )
cssScopes.push( stringifyCssValues( theme.custom, (k, v) => parseCssValue( `--${k}`, v ) ) )

export const themeCss = `:root {\n  ${cssScopes.join( `;\n  ` )};\n}`
export function StyleTheme() {
  return <style dangerouslySetInnerHTML={{ __html:themeCss }} />
}


function stringifyCssValues<T extends Record<string, unknown>>( obj:T, cb:(key:keyof T, value:T[keyof T]) => Arrayable<undefined | string> ) {
  return Object.entries( obj ).flatMap( ([ k, v ]) => cb( k as keyof T, v as T[keyof T] ) ).filter( Boolean ).join( `;\n  ` )
}
