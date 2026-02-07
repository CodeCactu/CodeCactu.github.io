import { ResponsivePropertyValue, updateResponsivePropertiesToStyle } from "@lib/core/flow/ResponsiveAreaNames"
import { makeSpacing, makeStyleSpacings, SpacingsValue } from "./makeStyleSpacings"

export const blockTextElements = {
  p: `p`, figcaption: `figcaption`,
  dt: `dt`, dd: `dd`,
  h1: `h1`, h2: `h2`, h3: `h3`, h4: `h4`, h5: `h5`, h6: `h6`,
} as const

export const inlineTextElements = {
  span: `span`, b: `b`,
  small: `small`, mark: `mark`, strong: `strong`, em: `em`,
} as const

export const textElements = { ...blockTextElements, ...inlineTextElements }
export type TextElement = keyof typeof textElements

export type TextAlign = `left` | `center` | `right` | `justify`
export type TextProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  id?: string
  as?: TextElement
  align?: ResponsivePropertyValue<TextAlign>
  minLines?: number
  width?: number
  margin?: ResponsivePropertyValue<SpacingsValue>
  bold?: boolean | number
  balanceWrap?: boolean
}

export default function Text({ children, className, id, style = {}, as:As = `p`, align, minLines, width, margin, bold, balanceWrap }:TextProps) {
  const finalStyle:React.CSSProperties = { ...style }
  updateResponsivePropertiesToStyle( finalStyle, `textAlign`, align )
  updateResponsivePropertiesToStyle( finalStyle, `margin`, margin, m => makeStyleSpacings( m, `margin` ), v => typeof v !== `object` && makeSpacing( v ) )

  if (minLines) finalStyle.minHeight = `calc( var( --line-height, 1em ) * ${minLines})`
  if (width) {
    finalStyle.maxWidth = typeof width === `string` ? width : `${width}px`
    if (align === `center`) finalStyle.marginInline = `auto`
    else if (align === `right`) finalStyle.marginLeft = `auto`
  }

  if (bold !== undefined) finalStyle.fontWeight = typeof bold === `number` ? bold : bold === false ? `normal` : `bold`
  if (balanceWrap !== undefined) finalStyle.textWrap = balanceWrap ? `balance` : `unset`

  return (
    <As
      className={className}
      id={id}
      style={finalStyle}
    >
      {children}
    </As>
  )
}
