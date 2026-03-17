"use client"

import { useEffect } from "react"
import logInfo, { logInfoColor } from "@fet/loggers/logInfo"
import { logColorDimmed } from "@fet/loggers/log"

export type AppMetaLoggerProps = {
  logEntries: [string, unknown][]
}

export default function AppMetaLogger({ logEntries }:AppMetaLoggerProps) {
  useEffect( () => {
    for (const [ key, value ] of logEntries) {
      logInfo(
        { value:key, style:{ color:logInfoColor } },
        { value:`: `, style:{ color:logColorDimmed } },
        [ value ],
      )
    }
  } )

  return null
}
