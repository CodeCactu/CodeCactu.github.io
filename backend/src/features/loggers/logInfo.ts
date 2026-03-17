import { TrueColor } from "@lib/logger"
import log, { LoggerItem } from "@fet/loggers/log"

export const logColorInfo:TrueColor = [ 0, 230, 255 ]

export default function logInfo( ...items:LoggerItem[] ) {
  log(
    { value: ` INFO `, style: {
      fg: logColorInfo,
      bg: [ 40, 40, 200 ],
      isBold: true,
    } },
    ...items,
  )
}
