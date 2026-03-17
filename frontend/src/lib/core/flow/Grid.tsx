import { ResponsivePropertyValue, updateResponsivePropertiesToStyle } from "@lib/core/flow/ResponsiveAreaNames"
import cn, { isOverrideableClassName } from "../functions/createClassName"
import { makeSpacing, makeStyleSpacings, makeStyleSpacingsInline, SpacingsSimpleValue, SpacingsValue } from "./makeStyleSpacings"
import classes from "./Grid.module.css"

export type GridProps = {
  as?: keyof React.JSX.IntrinsicElements
  children: React.ReactNode
  className?: string | { override?: string }
  style?: React.CSSProperties
  margin?: ResponsivePropertyValue<SpacingsValue>
  padding?: ResponsivePropertyValue<SpacingsValue>
  gap?: ResponsivePropertyValue<SpacingsSimpleValue>
  template: ResponsivePropertyValue<string>
  alignItems?: React.CSSProperties[`alignItems`]
}

export default function Grid({ as:As = `div`, children, className, alignItems, style, template, margin, padding, gap }:GridProps) {
  const finalClassname = isOverrideableClassName( className ) ? className.override : cn( classes.grid, className )

  const finalStyle:React.CSSProperties = { ...style }
  updateResponsivePropertiesToStyle( finalStyle, `--template`, template )
  updateResponsivePropertiesToStyle( finalStyle, `gap`, gap, v => typeof v !== `object` && makeSpacing( v ) )
  updateResponsivePropertiesToStyle( finalStyle, `padding`, padding, makeStyleSpacingsInline, v => typeof v !== `object` && makeSpacing( v ) )
  updateResponsivePropertiesToStyle( finalStyle, `margin`, margin, m => makeStyleSpacings( m, `margin` ), v => typeof v !== `object` && makeSpacing( v ) )

  if (alignItems) finalStyle.alignItems = alignItems

  return (
    <As className={finalClassname} style={finalStyle}>
      {children}
    </As>
  )
}
