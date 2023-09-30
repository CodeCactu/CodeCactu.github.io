import { cn } from "@lib/theming"
import { useUiManager } from "@lib/dynamicUi"
import { createStylesHook } from "@fet/theming"
import CactuGradientsController from "./logic"

export type CactuGradientsProps = {
  className?: string
}

export default function CactuGradients({ className }:CactuGradientsProps) {
  const [ classes ] = useStyles()
  const [ handleRef ] = useUiManager<HTMLDivElement, CactuGradientsController>(
    rootElement => new CactuGradientsController( rootElement ),
  )

  return (
    <div ref={handleRef}>
      <canvas className={cn( classes.cactuGradients, className )} />
    </div>
  )
}

const useStyles = createStylesHook({
  cactuGradients: {
    display: `block`,
    width: `100%`,
    height: `100dvh`,
  },
})
