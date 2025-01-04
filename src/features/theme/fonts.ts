/* eslint @stylistic/quotes: ["error", "double"] */

import { Geist, Geist_Mono } from "next/font/google"
import localFont from "next/font/local"

export const geistSansFont = Geist({
  variable: "--font-geist-sans",
  subsets: [ "latin" ],
})

export const geistMonoFont = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: [ "latin" ],
})

export const cactuFont = localFont({
  // src: "./font/icomoon.ttf",
  // src: "./font/Glyphter.woff",
  // src: "./font/fontello.ttf",
  variable: "--font-cactu",
  src: [ { path:"./font/cactu.woff" } ],
})
