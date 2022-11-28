import { ReactNode } from "react"
import { createStylesHook } from "@fet/theming"

export type TextProps = {
  as?: keyof JSX.IntrinsicElements
  body?: ReactNode
  children?: ReactNode
}

export default function Text({ children, body, as:As = `p` }:TextProps) {
  children ||= body

  const [ classes ] = useStyles()
  const classname = classes[ As ]

  return (
    <As className={classname}>{children}</As>
  )
}

const computeMargins = (top, bottom) => ({
  "&:not( :first-child )": {
    marginTop: top,
  },

  "&:not( :last-child )": {
    marginBottom: bottom,
  },
})

const useStyles = createStylesHook({
  h1: {
    fontSize: 40,
    margin: 0,
    ...computeMargins( 10, 10 ),
  },
  p: {

  },
})
