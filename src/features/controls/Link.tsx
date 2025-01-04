import LibLink, { LinkProps as LibLinkProps } from "@lib/core/controls/Link"
import classes from "./Link.module.css"
import cn from "@lib/core/functions/createClassName"

export type LinkProps = LibLinkProps

export default function Link({ className, ...props }:LinkProps) {
  return <LibLink {...props} className={cn( classes.link, className )} />
}
