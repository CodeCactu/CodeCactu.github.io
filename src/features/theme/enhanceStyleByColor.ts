import { colors } from "."

export type Color = keyof (typeof colors)
export type MaybeColor = Color | (string & {})

export default function enhanceStyleByColor( style:undefined | React.CSSProperties = {}, color?:undefined | MaybeColor, backgroundColor?:undefined | MaybeColor ) {
  if (color) style.color = color in colors ? `var( --color-${color} )` : color
  if (backgroundColor) style.backgroundColor = backgroundColor in colors ? `var( --color-${backgroundColor} )` : backgroundColor
  return style
}
