import { ReactNode } from "react"
import { createStylesHook } from "@fet/theming"

export type SurfaceProps = {
  children: ReactNode
}

export default function Surface({ children }) {
  const [ classes ] = useStyles()
  return (
    <div className={classes.surface}>
      {children}
    </div>
  )
}

export const useStyles = createStylesHook( ({ mixins }) => ({
  surface: {
    ...mixins.surface,
  },
}) )
