import log, { LoggerItem } from "@fet/loggers/log"

export default function logAuth( ...items:LoggerItem[] ) {
  log(
    { value: `AUTH`, style: {
      backgroundColor: `oklch( 0.47 0.11 101.84 )`,
      color: `oklch( 0.92 0.52 102.15 )`,
    } },
    ...items,
  )
}

declare global {
  interface Window {
    authLog: typeof logAuth
  }
}

if (typeof window !== `undefined`) window.authLog = logAuth
