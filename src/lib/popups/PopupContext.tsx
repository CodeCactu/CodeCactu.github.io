import { createContext, useContext, ReactNode } from "react"
import { Promiseable } from "../core/types"

export type PopupResolver = (data:Promiseable<unknown>) => void
export type PopupContextValue = {
  resolve: PopupResolver
}

export type PopupContextProviderProps = {
  resolver: PopupResolver
  children: ReactNode
}

export const PopupContext = createContext<PopupContextValue | undefined>( undefined )
export default PopupContext

export function PopupContextProvider({ children, resolver }:PopupContextProviderProps) {
  return (
    <PopupContext.Provider value={{ resolve:resolver }}>
      {children}
    </PopupContext.Provider>
  )
}

export function usePopupContext() {
  const ctx = useContext( PopupContext )
  if (!ctx) throw new Error( `Cannot use popup context outside popup` )
  return ctx
}
