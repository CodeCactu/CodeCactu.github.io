import { cn } from "@lib/theming"
import { createStylesHook } from "@fet/theming"
import { useUIControllerHandler } from "../UIController"
import CactuGradientsController from "./logic"

export type CactuGradientsProps = {
  className?: string
}

export default function CactuGradients({ className }:CactuGradientsProps) {
  const [ classes ] = useStyles()
  const [ handleRef ] = useUIControllerHandler<HTMLCanvasElement, CactuGradientsController>(
    canvas => new CactuGradientsController( canvas ),
  )

  return <canvas className={cn( classes.cactuGradients, className )} ref={handleRef} />
}

const useStyles = createStylesHook({
  cactuGradients: {
    display: `block`,
    width: `100%`,
    height: `100%`,
  },
})
