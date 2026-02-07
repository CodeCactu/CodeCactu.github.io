import { prepareConfig } from "@lib/prepareConfig"

export const [ configClient ] = prepareConfig({
  BACKEND_ORIGIN: {
    rawValue: process.env.NEXT_PUBLIC_BACKEND_ORIGIN,
  },
})
