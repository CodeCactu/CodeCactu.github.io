import { ReactNode } from "react"
import { filterObject } from "@lib/core/functions/objectUtils"
import { getTextContainerStyles } from "../typography/TextContainer"
import { cn, createStylesHook, CSSProperties } from "../../theming"
import select from "../../core/functions/select"
import { getContainerJustification, Justification, useContainerStyles } from "./Container"

export type Padding = number | { top?: undefined | number; right?: undefined | number; bottom?: undefined | number; left?: undefined | number }
export type VerticallJustification = `top` | `center` | `bottom`
export type ColumnProps = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  verticallJustify?: VerticallJustification
  justify?: Justification
  compact?: boolean
  narrow?: boolean
  width?: string
  verticallOrder?: number
  paddingFactors?: Padding
}

export default function Column({ className, style:freezedStyle, children, verticallJustify, compact, narrow, justify, width, verticallOrder, paddingFactors }:ColumnProps) {
  const [ containerClasses ] = useContainerStyles()
  const [ classes ] = useStyles()

  const style = { ...freezedStyle } as CSSProperties
  const normalTextContainer = !verticallJustify || verticallJustify == `top`
  const justifyClassName = getContainerJustification( justify, containerClasses )
  const verticallJustifyClassName = select( verticallJustify, {
    top: classes.isToTop,
    center: classes.isToVertCenter,
    bottom: classes.isToBottom,
  } )

  if (narrow) width = `max-content`
  if (width) {
    // This is the only found way to do responsive columns layout with fixed width
    // It enables columns wrap and auto height

    if (typeof width == `number`) width = width + `px`
    if (/^\d+(?:\.\d+)?%$/.test( width )) style.flexGrow = Number( width.match( /\d+(?:\.\d+)?/ )![ 0 ] ) / 100
    else {
      if (width === `max-content`) {
        style.flexBasis = `max-content`
      } else {
        style.maxWidth = width
        // style.flexBasis = width
        // style.minWidth = width
      }
    }
  }

  if (verticallOrder) style[ `--mobile-order` ] = verticallOrder
  if (paddingFactors) {
    if (typeof paddingFactors === `number`) style[ `padding` ] = `calc( var( --gap, 1em ) * ${paddingFactors} )`
    else Object.entries( filterObject( paddingFactors ) ).forEach( ([ k, v ]) => style[ `padding` + k.charAt( 0 ).toUpperCase() + k.slice( 1 ) ] = `calc( var( --gap, 1em ) * ${v} )` )
  }

  const fullInternalClassName = cn(
    classes.column,
    compact && classes.isCompact,
    // narrow && classes.isNarrow,
    justifyClassName,
  )

  if (normalTextContainer) {
    return (
      <div className={cn( fullInternalClassName, className )} style={style}>
        {children}
      </div>
    )
  }

  return (
    <div className={cn( fullInternalClassName, verticallJustifyClassName, className )} style={style}>
      <div className={classes.vertJustifyHelper}>
        {children}
      </div>
    </div>
  )
}

const useStyles = createStylesHook( ({ components }) => ({
  column: {
    wordBreak: `break-word`,
    flexBasis: 0,
    maxWidth: `100%`,

    "&:not([style*='flex-basis'])": {
      flexGrow: 1,
    },

    // "--log": console.log( getTextContainerStyles( components ) ),
    ...getTextContainerStyles( components ),
    ...components.Column,
  },
  vertJustifyHelper: {
    width: `100%`,

    ...getTextContainerStyles( components ),
  },

  isToTop: {
    display: `flex`,
    alignItems: `start`,
  },
  isToVertCenter: {
    display: `flex`,
    alignItems: `center`,
  },
  isToBottom: {
    display: `flex`,
    alignItems: `end`,
  },

  isNarrow: {
    width: `max-content`,
    flexGrow: 0,
    flexBasis: `auto`,
  },

  isCompact: {
    "& > *": {
      marginTop: 0,
      marginBottom: 0,
    },
  },
}), `lib::Column` )
