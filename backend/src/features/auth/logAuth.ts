import log, { LoggerItem } from "@fet/loggers/log"

export default function logAuth( ...items:LoggerItem[] ) {
  log(
    { value: ` AUTH `, style: {
      fg: [ 255, 215, 0 ],
      bg: [ 95, 95, 30 ],
      isBold: true,
    } },
    ...items,
  )
}
