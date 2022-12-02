import { ReactNode } from "react"
import cn from "@lib/theming/createClassName"
import { createStylesHook } from "@fet/theming"

export type SurfaceProps = {
  children: ReactNode
  className?: string
}

export default function Surface({ children, className }:SurfaceProps) {
  const [ classes ] = useStyles()

  return (
    <div className={cn( classes.surface, className )}>
      {children}
    </div>
  )
}

export const useStyles = createStylesHook( ({ mixins }) => ({
  surface: {
    ...mixins.surface,
  },
}) )
