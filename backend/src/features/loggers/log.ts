import libLog, { LogConfig, LoggerItem, TrueColor } from "@lib/logger"

export { type LoggerItem }

export const logColorPositive:TrueColor = [ 25, 250, 25 ]
export const logColorNegative:TrueColor = [ 255, 25, 25 ]
export const logColorDimmed:TrueColor = [ 25, 25, 25 ]
const titlePadding = 10

export default function log( title:string | LogConfig, ...items:LoggerItem[] ) {
  const titleConfig = typeof title === `string` ? { value:title } : structuredClone( title )

  libLog(
    { value:new Date().toISOString(), color:[ 25, 25, 25 ] },
    { value:` `.padStart( titlePadding - titleConfig.value.length ) },
    titleConfig,
    ` | `,
    ...items,
  )
}
