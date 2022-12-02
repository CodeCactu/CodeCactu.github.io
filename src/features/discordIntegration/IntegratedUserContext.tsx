import { createContext, useContext, ReactNode } from "react"
import getWindow from "@lib/core/functions/getWindow"
import { discordIntegrationStorageKey } from "./isIntegrated"
import { User } from "./DiscordLinking"

export type IntegratedUserContextValue = {
  user: User
}

export type IntegratedUserContextProviderProps = {
  children: ReactNode
}

export const IntegratedUserContext = createContext<IntegratedUserContextValue | undefined>( undefined )
export default IntegratedUserContext

export function IntegratedUserContextProvider({ children }:IntegratedUserContextProviderProps) {
  const storedUser = getWindow()?.localStorage.getItem( discordIntegrationStorageKey )

  if (!storedUser) throw new Error( `No integrated user stored in the browser` )

  const user = JSON.parse( storedUser )

  return (
    <IntegratedUserContext.Provider value={{ user }}>
      {children}
    </IntegratedUserContext.Provider>
  )
}

export function useIntegratedUserContext() {
  const ctx = useContext( IntegratedUserContext )

  if (!ctx) throw new Error( `Context invocation used outside context` )

  return ctx
}
