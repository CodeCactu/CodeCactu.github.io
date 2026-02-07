import log, { LoggerItem } from "@fet/loggers/log"

// export const logInfoColor = `oklch( 0.8 0.15 221.96 )`
export const logInfoColor = `cyan`

export default function logInfo( ...items:LoggerItem[] ) {
  log(
    { value: `INFO`, style: {
      backgroundColor: `oklch(0.39 0.14 255.37)`,
      color: logInfoColor,
    } },
    ...items,
  )
}

declare global {
  interface Window {
    authLog: typeof logInfo
  }
}

if (typeof window !== `undefined`) window.authLog = logInfo
