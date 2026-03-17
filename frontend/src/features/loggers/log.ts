import libLog, { LogConfig, LoggerItem } from "@lib/logger"

export { type LoggerItem }

export const logColorDimmed  = `oklch( 0.5 0 0 )`
const titlePadding = 10

export default function log( title:string | LogConfig, ...items:LoggerItem[] ) {
  const titleConfig = typeof title === `string` ? { value:title } : structuredClone( title )

  titleConfig.style ||= {}
  Object.assign( titleConfig.style, {
    marginInline: `1em`,
    paddingInline: `1em`,
    fontWeight: `bold`,
  } )

  libLog(
    { value: new Date().toISOString(), style: {
      color: logColorDimmed,
    } },
    { value:` `.padStart( titlePadding - titleConfig.value.length ) },
    titleConfig,
    ...items,
  )
}

declare global {
  interface Window {
    log: typeof log
  }
}

if (typeof window !== `undefined`) window.log = log
