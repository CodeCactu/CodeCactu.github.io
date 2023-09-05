import { ReactNode } from "react"
import { CSSClassesValues } from "@lib/theming/types"
import { cn, createStylesHook, CSSProperties } from "../../theming"
import { blockTextElements, getTextTagsStyles, textElements } from "."

export type TextContainerProps = {
  className?: string
  style?: CSSProperties
  children: ReactNode
  as?: keyof JSX.IntrinsicElements
}

export default function TextContainer({ className, style, children, as:As = `div` }:TextContainerProps) {
  const [ classes ] = useTextContainerStyles()

  return <As className={cn( classes.textContainer, className )} style={style}>{children}</As>
}

export function getTextContainerStyles( components:Record<string, CSSClassesValues> = {} ) {
  return {
    "& > :first-child": {
      marginTop: 0,
    },

    "& > :last-child": {
      marginBottom: 0,
    },

    ...Object.fromEntries( Object.entries( getTextTagsStyles( components ) )
      .filter( ([ k ]) => k in textElements )
      .map( ([ selector, v ]) => {
        if (selector in blockTextElements) {
          return [ `:where( & > ${selector} )`, v ]
        }

        const complexSelector = `& > ${selector}, ` + Object.values( blockTextElements ).map( ele => `& > ${ele} ${selector}` ).join()

        return [ complexSelector, v ]
      } ),
    ),
  } as CSSProperties
}
export const useTextContainerStyles = createStylesHook( ({ components }) => ({
  textContainer: {
    ...getTextContainerStyles( components ),
  },
}), `lib::TextContainer` )
