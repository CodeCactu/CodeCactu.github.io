"use client"

import { useUiManager } from "@lib/dynamicUi"
import CactuBlinkingLinesController from "./CactuBlinkingLinesController"
import classes from "./CactuBlinkingLines.module.css"

export type CactuBlinkingLinesProps = {
  className?: string
}

export default function CactuBlinkingLines({ className }:CactuBlinkingLinesProps) {
  const [ refhandler ] = useUiManager<HTMLDivElement, CactuBlinkingLinesController>( div => new CactuBlinkingLinesController( div ))

  return (
    <div ref={refhandler} className={className}>
      <canvas className={classes.canvas} />
    </div>
  )
}
