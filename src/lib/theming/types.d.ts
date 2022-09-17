import React from "react"

type Primitive = string | number | boolean
export type CSSProperties = React.CSSProperties
type SpecialStyles = {
  "@global"?: Classes
  "@keyframes $NAME"?: {
    from: CSSProperties
    to: CSSProperties
  }
}
type SpecialCSSProperties = {
  "&:active"?: CSSProperties
  "&::after"?: CSSProperties
  "&::before"?: CSSProperties
  "&:checked"?: CSSProperties
  "&:default"?: CSSProperties
  "&:disabled"?: CSSProperties
  "&:empty"?: CSSProperties
  "&:enabled"?: CSSProperties
  "&:first-child"?: CSSProperties
  "&::first-letter"?: CSSProperties
  "&::first-line"?: CSSProperties
  "&:first-of-type"?: CSSProperties
  "&:focus"?: CSSProperties
  "&:fullscreen"?: CSSProperties
  "&:hover"?: CSSProperties
  "&:in-range"?: CSSProperties
  "&:indeterminate"?: CSSProperties
  "&:invalid"?: CSSProperties
  "&:lang("?: CSSProperties
  "&:last-child"?: CSSProperties
  "&:last-of-type"?: CSSProperties
  "&:link"?: CSSProperties
  "&::marker"?: CSSProperties
  "&:not( $ )"?: CSSProperties
  "&:nth-child( $ )"?: CSSProperties
  "&:nth-last-child( $ )"?: CSSProperties
  "&:nth-last-of-type( $ )"?: CSSProperties
  "&:nth-of-type( $ )"?: CSSProperties
  "&:only-of-type"?: CSSProperties
  "&:only-child"?: CSSProperties
  "&:optional"?: CSSProperties
  "&:out-of-range"?: CSSProperties
  "&::placeholder"?: CSSProperties
  "&:read-only"?: CSSProperties
  "&:require"?: CSSProperties
  "&:root"?: CSSProperties
  "&::selection"?: CSSProperties
  "&:target"?: CSSProperties
  "&:valid"?: CSSProperties
  "&:visited"?: CSSProperties
  "--var"?: string | number
} & { [x in `--${string}`]:string | number }
export type Classes = { [Key:string]: (CSSProperties & SpecialCSSProperties) | Classes }
export type UserDefinedStyles = SpecialStyles & Classes
export type Color = CSSProperties["color"]
export type AtomsStruct = { [Key:string]: Primitive | AtomsStruct }

export type ThemeConfig<
  State extends Record<string, Primitive>,
  Atoms extends AtomsStruct,
  Mixins extends UserDefinedStyles,
  Components extends UserDefinedStyles,
> = {
  state?: State
  atoms?: (atomsData:{state: State}) => Atoms
  mixins?: (mixinsData:{state: State; atoms: Atoms}) => Mixins
  components?: (componentsData:{state: State; atoms: Atoms; mixins: Mixins}) => Components
  onStateChange?: (state:State) => void
}

export type Theme<
  State extends Record<string, Primitive>,
  Atoms extends AtomsStruct,
  Mixins extends UserDefinedStyles,
  Components extends UserDefinedStyles,
> = {
  state: State
  atoms: Atoms
  mixins: Mixins
  components: Components
}

export type ThemeStateSetter<State extends Record<string, Primitive>> = (key:keyof State, value:State[typeof key]) => void
export type ThemeWithActions<
  State extends Record<string, Primitive>,
  Atoms extends AtomsStruct,
  Mixins extends UserDefinedStyles,
  Components extends UserDefinedStyles,
> = Theme<State, Atoms, Mixins, Components> & {
  setState: ThemeStateSetter<State>
}
export type ThemeWithActionsFrom<Them extends null | Theme<any, any, any, any>> = Them extends Theme<infer S, infer A, infer M, infer C> ? ThemeWithActions<S, A, M, C> : null

export type StylesCreator<Them extends Theme<any>, ReturnedStyles extends UserDefinedStyles> = (theme:Them) => ReturnedStyles
