/* eslint @stylistic/quotes: ["error", "double"] */

import localFont from "next/font/local"

export const cactuFont = localFont({
  // src: "./font/icomoon.ttf",
  // src: "./font/Glyphter.woff",
  // src: "./font/fontello.ttf",
  variable: "--font-cactu",
  src: [ { path:"./font/cactu.woff" } ],
})
