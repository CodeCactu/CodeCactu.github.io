import { prepareConfig } from "@lib/prepareConfig"

export const [ clientConfig ] = prepareConfig({
  BACKEND_ORIGIN: {
    rawValue: process.env.BACKEND_ORIGIN,
  },
})
