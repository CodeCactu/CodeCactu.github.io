import createDatasetAttributes, { Dataset } from "@lib/core/functions/createDatasetAttributes"
import { cn } from "@lib/core/functions"
import Link from "@lib/core/controls/Link"
import classes from "./Surface.module.css"

export type SurfaceProps = {
  children: React.ReactNode
  className?: string
  href?: string
  dataset?: Dataset
}

export default function Surface( props:SurfaceProps ) {
  if (props.href) return (
    <Link className={cn( classes.surface, props.className )} dataset={props.dataset} href={props.href}>
      {props.children}
    </Link>
  )

  return (
    <div className={cn( classes.surface, props.className )} {...createDatasetAttributes( props.dataset )}>
      {props.children}
    </div>
  )
}
