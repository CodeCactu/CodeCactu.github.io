import { createContext, useContext, ReactNode } from "react"
import JSONValue from "@lib/types/JSONValue"

export type PopupResolverValue = void | JSONValue
export type PopupDeleter = (popupPromise:Promise<PopupResolverValue>) => void
export type PopupCreator = <T=PopupResolverValue>(popup:ReactNode) => Promise<T>
export type PopupsContextValue = {
  deleteModal: PopupDeleter
  createPopup: PopupCreator
}

export type PopupsContextProviderProps = {
  deleteModal: PopupDeleter
  createPopup: PopupCreator
  children: ReactNode
}

export const PopupsContext = createContext<PopupsContextValue | undefined>( undefined )
export default PopupsContext

export function PopupsContextProvider({ children, createPopup, deleteModal }:PopupsContextProviderProps) {
  return (
    <PopupsContext.Provider value={{ createPopup, deleteModal }}>
      {children}
    </PopupsContext.Provider>
  )
}

export function usePopupsContext() {
  const ctx = useContext( PopupsContext )
  if (!ctx) throw new Error( `Cannot use popups context outside popups root` )
  return ctx
}
