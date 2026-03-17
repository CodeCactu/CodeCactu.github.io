import NextLink from "next/link"
import createDatasetAttributes, { Dataset } from "../functions/createDatasetAttributes"
import cn from "../functions/createClassName"

export type LinkTarget = `_blank` | `_self` | `_parent` | `_top`
export type LinkProps = {
  children?: React.ReactNode
  body?: React.ReactNode
  href?: string
  download?: boolean | string
  className?: string
  style?: React.CSSProperties
  ariaLabel?: string
  ariaCurrent?: `page` | `step` | `location` | `date` | `time` | boolean
  disabled?: boolean
  target?: LinkTarget
  rel?: string
  onClick?: () => void
  formAction?: () => void
  buttonType?: `submit` | `button`
  locale?: false | string
  dataset?: Dataset
}

export default function Link({ children, style, rel, className, href, download, target, onClick, formAction, ...props }:LinkProps) {
  children ||= props.body

  const commonProps = { className, children, style, ...createDatasetAttributes( props.dataset ) }
  const nonLinkClassName = cn( `as-a`, className )

  if (props.disabled) return <span {...commonProps} className={nonLinkClassName} aria-disabled="true" />
  if (onClick || formAction) return <button type={props.buttonType} {...commonProps} className={nonLinkClassName} onClick={onClick} formAction={formAction} />
  if (!href) return <span {...commonProps} className={nonLinkClassName} />

  const justLinksProps = {
    ...commonProps,
    "aria-label": props.ariaLabel,
    "aria-current": props.ariaCurrent || undefined,
    download,
    rel,
    target,
    href,
  }

  if (download || /^https?:\/\/|^\w+:/.test( href )) return <a {...justLinksProps} />
  return <NextLink {...justLinksProps} locale={props.locale} />
}
