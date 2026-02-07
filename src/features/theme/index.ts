export { default as fonts } from "./fonts"
export * from "./fonts"

export type ColorName = keyof typeof colors
export const colors = {
  "primary": `#5da234`,
  "secondary": `#444`,
  "surface": `#0001`,
  "surface-e100": `#0004`,
  "accent": `color-mix( in srgb, var( --color-secondary ), white 10% )`,
} as const satisfies Record<string, string>


export const border = {
  width: 1,
  radius: 5,
}

export const custom = {
  maxPageSectionWidth: `1166px`,
  minPageSectionWidthPadding: `24px`,
  rootHeaderheight: `60px`,
  popupShadow: `0px 0px 8px #C3C3C380`,
  "textContainer-margin": `16px`,
}
