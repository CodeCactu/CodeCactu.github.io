import { prepareConfig } from "@lib/prepareConfig"

export const [ clientConfig ] = prepareConfig( {
  BACKEND_ORIGIN: {
    rawValue: import.meta.env.PUBLIC_BACKEND_ORIGIN,
  },
})
