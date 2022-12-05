import { ReactNode } from "react"
import createStylesHook from "@lib/theming/createStylesHook"
import useArrayState from "@lib/core/hooks/useArrayState"
import createId, { Snowflake } from "@lib/core/functions/createId"
import { PopupCreator, PopupResolverValue, PopupsContextProvider } from "../PopupsContext"
import Popup from ".."

export type PopupsRootProps = {
  children: ReactNode
}

export type ModalData<T> = {
  id: string
  resolver: (data:T) => void
  promise: Promise<T>
  body: ReactNode
}

export default function PopupsRoot({ children }:PopupsRootProps) {
  const [ classes ] = useStyles()
  const [ modalsDataset, modalsDatasetActions ] = useArrayState<ModalData<any>>()

  const deleteModal = (modalPromiseOrId:Snowflake | Promise<PopupResolverValue>) => {
    if (modalPromiseOrId instanceof Promise) return modalsDatasetActions.removeFound( it => it.promise === modalPromiseOrId )
    return modalsDatasetActions.removeFound( it => it.id === modalPromiseOrId )
  }
  const createPopup:PopupCreator = <T, >(popupBody) => {
    const modalData:Partial<ModalData<T>> = {
      body: popupBody,
      id: createId( `modal` ),
    }

    modalData.promise = new Promise<T>( resolve => modalData.resolver = resolve ).then( value => {
      deleteModal( modalData.id! )
      return value
    } )

    modalsDatasetActions.push( modalData as ModalData<T> )

    return modalData.promise
  }

  return (
    <PopupsContextProvider createPopup={createPopup} deleteModal={deleteModal}>
      {children}

      {
        !!modalsDataset.length && (
          <article className={classes.popupsRoot}>
            {modalsDataset.map( it => <Popup key={it.id} resolver={it.resolver} body={it.body} /> )}
          </article>
        )
      }
    </PopupsContextProvider>
  )
}

const useStyles = createStylesHook({
  popupsRoot: {
  },
  underPopupsContentWrapper: {
    maxHeight: `min( 100%, 100vh )`,
    overflow: `hidden`,
  },
})
