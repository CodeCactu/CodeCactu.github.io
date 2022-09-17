import { useEffect, useRef } from "react"
import createStylesHook from "@lib/theming/createStylesHook"
import BlinkingLines from "./logic"

export type BlinkingLinesBgrProps = {}

export default function BlinkingLinesBgr() {
  const canvasRef = useRef<HTMLCanvasElement>( null )
  const logicRef = useRef<BlinkingLines>()
  const [ classes ] = useStyles()

  useEffect( () => {
    if (!canvasRef.current) return

    logicRef.current = new BlinkingLines( canvasRef.current )
    logicRef.current.enable()

    return () => logicRef.current?.disable()
  }, [ canvasRef.current ] )

  return <canvas className={classes.blinkingLinesBgr} ref={canvasRef} />
}

const useStyles = createStylesHook({
  blinkingLinesBgr: {
    position: `absolute`,
    left: 0,
    top: 0,
    width: `100%`,
    height: `100%`,
  },
})
