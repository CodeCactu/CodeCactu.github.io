"use client"

import { useUiManager } from "@lib/dynamicUi"
import CactuGradientsController from "./logic"

export type CactuGradientsProps = {
  className?: string
}

export default function CactuShadyTrail({ className }:CactuGradientsProps) {
  const [ handleRef ] = useUiManager<HTMLDivElement, CactuGradientsController>(
    rootElement => new CactuGradientsController( rootElement ),
  )

  return (
    <div ref={handleRef}>
      <canvas className={className} />
    </div>
  )
}
