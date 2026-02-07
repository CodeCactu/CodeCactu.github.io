/* eslint @stylistic/quotes: ["error", "double"] */

import localFont from "next/font/local"

export const cactuFont = localFont({
  // src: "./font/icomoon.ttf",
  // src: "./font/Glyphter.woff",
  // src: "./font/fontello.ttf",
  variable: "--font-cactu",
  src: [ { path:"./font/cactu.woff" } ],
})

export type FontConfig = {
  fontFamily?: string
  fontWeight?: number | "lighter" | "normal" | "bold" | "bolder"
  fontSize: number | string
  lineHeight?: number | string
  letterSpacing?: number | string
}

const fonts = {
  body: {
    fontSize: 14,
    fontFamily: "consolas",
  },
} as const satisfies Record<string, FontConfig>

export type FontName = keyof typeof fonts

export default fonts
