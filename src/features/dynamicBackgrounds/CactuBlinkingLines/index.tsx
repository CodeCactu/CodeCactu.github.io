import { useUiManager } from "@lib/dynamicUi"
import { createStylesHook } from "@fet/theming"
import CactuBlinkingLinesController from "./CactuBlinkingLinesController"

export type CactuBlinkingLinesProps = {
  className?: string
}

export default function CactuBlinkingLines({ className }:CactuBlinkingLinesProps) {
  const [ classes ] = useStyles()
  const [ refhandler ] = useUiManager<HTMLDivElement, CactuBlinkingLinesController>( div => new CactuBlinkingLinesController( div ))

  return (
    <div ref={refhandler} className={className}>
      <canvas className={classes.canvas} />
    </div>
  )
}

const useStyles = createStylesHook( () => ({
  canvas: {
    display: `block`,
    width: `100%`,
    height: `100dvh`,
  },
}) )
