import { createContext, useContext, ReactNode } from "react"
import useStorage from "@lib/storage/useStorage"
import { discordStorage } from "./discordStorage"
import { User } from "./DiscordLinking"

export type IntegratedUserContextValue = {
  user: null | User
}

export type IntegratedUserContextProviderProps = {
  children: ReactNode
}

export const IntegratedUserContext = createContext<IntegratedUserContextValue | undefined>( undefined )
export default IntegratedUserContext

export function IntegratedUserContextProvider({ children }:IntegratedUserContextProviderProps) {
  const [ storage ] = useStorage( discordStorage ) as any as [{ discordSession: IntegratedUserContextValue }, any]

  return (
    <IntegratedUserContext.Provider value={{ user:storage?.discordSession?.user }}>
      {children}
    </IntegratedUserContext.Provider>
  )
}

export function useIntegratedUserContext() {
  const ctx = useContext( IntegratedUserContext )

  if (!ctx) throw new Error( `Context invocation used outside context` )

  return ctx
}
