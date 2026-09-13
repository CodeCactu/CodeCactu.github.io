import { prepareConfig } from "@lib/prepareConfig"

export const [ clientConfig ] = prepareConfig({
  BACKEND_ORIGIN: {
    rawValue: import.meta.env.NEXT_PUBLIC_BACKEND_ORIGIN,
  },
})
