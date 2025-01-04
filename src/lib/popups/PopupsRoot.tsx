/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { ReactNode, useState } from "react"
import createId, { Snowflake } from "../core/functions/createId"
import classes from "./popups.module.scss"
import { PopupCreator, PopupAdditionalProps, PopupResolverValue, PopupsRootContextProvider } from "./PopupsRootContext"
import PopupBase from "./PopupBase"
import { PopupContextProvider } from "./PopupContext"

export type PopupsRootProps = {
  children: ReactNode
}

export type ModalData<T = any> = {
  id: string
  resolver: (data:T) => void
  promise: Promise<T>
  body: ReactNode
  props: PopupAdditionalProps
}

export default function PopupsRoot({ children }:PopupsRootProps) {
  const [ modalsDataset, setModalDataset ] = useState<ModalData[]>([])

  const deleteModal = (modalPromiseOrId:Snowflake | Promise<PopupResolverValue>) => {
    if (modalPromiseOrId instanceof Promise) return setModalDataset( modalsDataset.filter( ds => ds.promise === modalPromiseOrId ) )
    return setModalDataset( modalsDataset.filter( ds => ds.id === modalPromiseOrId ) )
  }

  const createPopup:PopupCreator = <T, >(popupBody:ReactNode, popupProps:PopupAdditionalProps = {}) => {
    const modalData:Partial<ModalData<T>> = {
      body: popupBody,
      id: createId( `modal` ),
      props: popupProps,
    }

    modalData.promise = new Promise<T>( resolve => modalData.resolver = resolve ).then( value => {
      deleteModal( modalData.id! )
      return value
    } )

    setModalDataset( ds => [ ...ds, modalData as ModalData<T> ] )

    return modalData.promise
  }


  return (
    <PopupsRootContextProvider createPopup={createPopup} deleteModal={deleteModal}>
      {children}

      {
        !!modalsDataset.length && (
          <aside className={classes.popupsRoot}>
            {
              modalsDataset.map( m => (
                <PopupContextProvider key={m.id} resolver={m.resolver}>
                  <PopupBase children={m.body} {...m.props} />
                </PopupContextProvider>
              ) )
            }
          </aside>
        )
      }
    </PopupsRootContextProvider>
  )
}
