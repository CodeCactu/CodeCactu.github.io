export type SpacingType = `padding` | `margin`

export type Spacings = {
  top?: number | string
  bottom?: number | string
  inline?: number | `auto` | (string & {})
  block?: number | `auto` | (string & {})
}

export type SpacingsSimpleValue = true | number | string
export type SpacingsValue = SpacingsSimpleValue | (Spacings & Record<string, unknown>)

export function makeStyleSpacingsInline( spacings:undefined | SpacingsValue ) {
  if (typeof spacings === `object`) {
    const parseSpacing = (sp?:number | string) => sp === `auto` ? sp : makeSpacing( sp )
    const top = parseSpacing( spacings.top ?? spacings.block ) ?? 0
    const bottom = parseSpacing( spacings.bottom ?? spacings.block ) ?? 0
    const left = parseSpacing( spacings.inline ) ?? 0
    const right = parseSpacing( spacings.inline ) ?? 0

    const getPart = (part:string | number) => `${typeof part === `number` ? `${part}px` : part}`

    return `${getPart( top )} ${getPart( right )} ${getPart( bottom )} ${getPart( left )}`
  }

  return makeSpacing( spacings )
}

export function makeStyleSpacings( spacings:undefined | SpacingsValue, styleBaseWord:SpacingType ): React.CSSProperties {
  const madeSpacings:React.CSSProperties = {}

  if (typeof spacings === `object`) {
    const parseSpacing = (sp?:number | string) => sp === `auto` ? sp : makeSpacing( sp )
    const top = parseSpacing( spacings.top )
    const bottom = parseSpacing( spacings.bottom )

    if (top === bottom) {
      if (top !== undefined) madeSpacings[ `${styleBaseWord}Block` ] = top
    } else {
      if (top) madeSpacings[ `${styleBaseWord}Top` ] = top
      if (bottom) madeSpacings[ `${styleBaseWord}Bottom` ] = bottom
    }

    if (spacings.inline !== undefined) madeSpacings[ `${styleBaseWord}Inline` ] = parseSpacing( spacings.inline )
    if (spacings.block !== undefined) madeSpacings[ `${styleBaseWord}Block` ] = parseSpacing( spacings.block )

    return madeSpacings
  }

  madeSpacings[ `${styleBaseWord}Block` ] = makeSpacing( spacings )
  return madeSpacings
}

export function makeSpacing( spacing:undefined | SpacingsSimpleValue ) {
  if (spacing === undefined) return
  if (typeof spacing === `number`) return `${spacing}px`
  return spacing === true ? `var( --space )` : spacing
}

export function addGapToStyles( style:undefined | React.CSSProperties, gap:undefined | SpacingsSimpleValue ): React.CSSProperties {
  return { ...style, gap:makeSpacing( gap ) }
}

export function addPaddingsToStyles( style:undefined | React.CSSProperties, paddings:undefined | SpacingsValue ): React.CSSProperties {
  return { ...style, ...makeStyleSpacings( paddings, `padding` ) }
}

export function addMarginsToStyles( style:undefined | React.CSSProperties, margins:undefined | SpacingsValue ): React.CSSProperties {
  return { ...style, ...makeStyleSpacings( margins, `margin` ) }
}

export function addMarginsAndPaddingsToStyles( style:undefined | React.CSSProperties, margins:undefined | SpacingsValue, paddings:undefined | SpacingsValue ): React.CSSProperties {
  return { ...style, ...makeStyleSpacings( margins, `margin` ), ...makeStyleSpacings( paddings, `padding` ) }
}
