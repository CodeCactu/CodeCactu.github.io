import { usePopupsRootContext } from "@lib/popups"
import classes from "./Dialog.module.css"
import { PopupAdditionalProps, PopupResolverValue } from "@lib/popups/PopupsRootContext"
import cn from "@lib/core/functions/createClassName"

export type DialogProps = {
  children: React.ReactNode
}

export default function Dialog({ children }:DialogProps) {
  return (
    <div className={classes.dialogSurface}>
      {children}
    </div>
  )
}

export function useDialogsRootContext() {
  const { createPopup, ...rest } = usePopupsRootContext()

  return {
    createPopup: <T = PopupResolverValue, > (dialog:React.ReactNode, props?:PopupAdditionalProps) => createPopup<T>( dialog, { ...props, className:cn( classes.dialog, props?.className ) } ),
    ...rest,
  }
}
