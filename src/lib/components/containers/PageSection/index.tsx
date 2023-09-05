import { ContainerProps } from "../Container"
import { getTextContainerStyles } from "../../typography/TextContainer"
import { cn, createStylesHook, CSSProperties } from "../../../theming"

export { default as PageSectionDecorations } from "./PageSectionDecorations"

export type PageSectionElement = `header` | `section` | `footer` | `aside` | `div`
export type PageSectionProps = ContainerProps & {
  as?: PageSectionElement
}

export default function PageSection({ children, as:As = `section`, className }:PageSectionProps) {
  const [ classes ] = useStyles()
  useStyles()

  return (
    <As className={cn( classes.pageSection, className )}>
      {children}
    </As>
  )
}

export function getPageSectionStyles( components:Record<string, any> = {}, defaultSectionMaxWidth?:number ) {
  return {
    position: `relative`,
    width: `100%`,

    ...components.PageSection,
    ...getTextContainerStyles( components ),

    "& > :first-child": {
      marginTop: 0,

      ...components.PageSection?.[ `& > :first-child` ],
    },

    ":where( & > *:not( img ) )": { // This line is used in PageSectionDecorations component!
      marginLeft: `auto`,
      marginRight: `auto`,
      maxWidth: defaultSectionMaxWidth ? `${defaultSectionMaxWidth}px` : `var( --max-width )`,

      ...components.PageSection?.[ `& > *` ],
    },

    "& > :last-child": {
      marginBottom: 0,

      ...components.PageSection?.[ `& > :last-child` ],
    },
  }
}

const useStyles = createStylesHook( ({ components }) => ({
  pageSection: getPageSectionStyles( components ) as unknown as Record<string, CSSProperties>,

  // ...Object.entries( components.Section )
  //   .filter( ([ k ]) => /--variant-\w+/.test( k ) )
  //   .reduce( (classNames, [ variable, colors ]) => ({ ...classNames, [ `is${variable.match( /--variant-(\w+)/ )![ 1 ]}` ]:colors }), {} ),
}), `lib::PageSection` )
