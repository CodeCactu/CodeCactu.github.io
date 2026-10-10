import { prepareConfig } from "@lib/prepareConfig"

export const [ clientConfig ] = prepareConfig({
  BACKEND_ORIGIN: {
    rawValue: typeof process === `undefined` ? undefined : process.env.BACKEND_ORIGIN,
  },
})
