import { ReactNode } from "react"
import createStylesHook from "./createStylesHook"
import cn from "./createClassName"

export type RowProps = {
  className?: string
  as?: keyof JSX.IntrinsicElements
  children: ReactNode
}

export default function Row({ children, className, as = `div` }:RowProps) {
  const [ classes ] = useStyles()

  const As = as

  return (
    <As className={cn( classes.row, className )}>{children}</As>
  )
}

const useStyles = createStylesHook( theme => ({
  row: {
    alignItems: `center`,
    ...(theme?.components.Row ?? {}),
  },
}) )
