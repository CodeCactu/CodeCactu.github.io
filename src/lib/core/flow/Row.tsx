import { ResponsivePropertyValue, updateResponsivePropertiesToStyle } from "@lib/core/flow/ResponsiveAreaNames"
import cn from "../functions/createClassName"
import { HorizontalAlign, VerticallAlign, checkIsCustomHorizontalAlign, getGap } from "./utils"
import { makeSpacing, makeStyleSpacings, SpacingsValue } from "./makeStyleSpacings"
import classes from "./Row.module.css"

type ContainerProps = {
  as?: keyof React.JSX.IntrinsicElements
  children: React.ReactNode
  className?: string | { override: undefined | string }
  style?: React.CSSProperties
}

export type RowProps = ContainerProps & {
  resizeChildren?: boolean
  align?: HorizontalAlign
  verticallAlign?: VerticallAlign
  wrap?: boolean | `wrap-reverse`
  gap?: string | boolean | number
  margin?: ResponsivePropertyValue<SpacingsValue>
}

export default function Row({ as:As = `div`, className, style, children, align, verticallAlign, gap, wrap, resizeChildren, margin }:RowProps) {

  const isCustomAligning = checkIsCustomHorizontalAlign( align )
  const finalClassName = typeof className === `object`
    ? className.override
    : cn( isCustomAligning ? classes.stretchedRow : (resizeChildren ? classes.resizeableRow : classes.row), className )

  const finalStyle:React.CSSProperties = {
    ...style,
    gap: getGap( gap ),
    flexWrap: wrap === true ? `wrap`
      : wrap === false ? undefined
        : wrap ?? style?.flexWrap,
  }

  updateResponsivePropertiesToStyle( finalStyle, `margin`, margin, m => makeStyleSpacings( m, `margin` ), v => typeof v !== `object` && makeSpacing( v ) )

  if (align && !isCustomAligning) finalStyle.justifyContent = align
  if (verticallAlign) finalStyle.alignItems = verticallAlign

  return (
    <As className={finalClassName} style={finalStyle}>
      {children}
    </As>
  )
}
