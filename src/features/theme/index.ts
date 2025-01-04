import "@lib/core/flow/ResponsiveAreaNames"



/*\
 * Spacing
\*/



export const spacing = {
  "normal": 5,
}

declare module "@lib/core/flow/ResponsiveAreaNames" {
  type _Spacings = { [K in keyof typeof spacing]:true }
  export interface SpacingNames extends _Spacings { _:false }
}



/*\
 * Colors
\*/



export const colors = {
  "background": `#212225`,
  "red": `#b66141`,
  "green": "#5da234",
  "blue": "#5574ac",
  "yellow": "#e6bf4b",
  "purple": "#6c52ec",
  "white": "#fefefe",
} as const



/*\
 * Fonts
\*/



export const fonts = {
  cactu: {
    fontFamily: `var( --font-cactu )`,
    fontWeight: 900,
    fontSize: 58,
    lineHeight: 68,
    letterSpacing: `0.01em`,
  },
}



/*\
 * Others
\*/



export const border = {
  radius: 8,
  "radius-s": 6,
  width: 2,
}

export const durations = {
  fast: 0.1
}