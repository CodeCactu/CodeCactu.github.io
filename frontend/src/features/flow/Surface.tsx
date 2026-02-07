import { cn, makeKebabCaseFromCamelCase } from "@lib/core/functions"
import classes from "./Surface.module.css"

export type SurfaceProps = {
  children: React.ReactNode
  className?: string
  href?: string
  dataset?: Record<string, string | number>
}

export default function Surface( props:SurfaceProps ) {
  const dataset = Object.fromEntries(
    Object.entries( props.dataset ?? {} ).map( ([ k, v ]) => [ `data-${makeKebabCaseFromCamelCase( k )}`, v ] ),
  )

  const As = props.href ? `a` : `div`

  return (
    <As className={cn( classes.surface, props.className )} {...dataset} href={props.href}>
      {props.children}
    </As>
  )
}
