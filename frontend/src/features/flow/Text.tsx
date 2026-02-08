import cn from "@lib/core/functions/createClassName"
import LibText, { TextProps as LibTextProps } from "@lib/core/flow/Text"
import { ColorName, FontName } from "@fet/theming"

export type TextProps = LibTextProps & {
  color?: ColorName
  looksLike?: FontName
}

export function Text({ color, style = {}, looksLike, className, ...props }:TextProps) {
  const finalStyle = structuredClone( style )
  if (color) finalStyle.color = `var( --color-${color} )`

  return (
    <LibText
      {...props}
      className={cn( looksLike && `as-${looksLike}`, className )}
      style={finalStyle}
    />
  )
}
