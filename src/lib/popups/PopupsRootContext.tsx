"use client"

import { createContext, useContext, ReactNode } from "react"
import { JSONValue } from "../core/types"
import { PopupProps } from "./PopupBase"

export type PopupAdditionalProps = Omit<PopupProps, `children` | `resolver`>
export type PopupResolverValue = void | JSONValue
export type PopupDeleter = (popupPromise:Promise<PopupResolverValue>) => void
export type PopupCreator = <T = PopupResolverValue>(popup:ReactNode, popupProps?:PopupAdditionalProps) => Promise<T>

export type PopupsRootContextValue = {
  deleteModal: PopupDeleter
  createPopup: PopupCreator
}

export type PopupsRootContextProviderProps = {
  deleteModal: PopupDeleter
  createPopup: PopupCreator
  children: ReactNode
}

export const PopupsRootContext = createContext<PopupsRootContextValue | undefined>( undefined )
export default PopupsRootContext

export function PopupsRootContextProvider({ children, createPopup, deleteModal }:PopupsRootContextProviderProps) {
  return (
    <PopupsRootContext.Provider value={{ createPopup, deleteModal }}>
      {children}
    </PopupsRootContext.Provider>
  )
}

export function usePopupsRootContext() {
  const ctx = useContext( PopupsRootContext )
  if (!ctx) throw new Error( `Cannot use popups context outside popups root` )
  return ctx
}
