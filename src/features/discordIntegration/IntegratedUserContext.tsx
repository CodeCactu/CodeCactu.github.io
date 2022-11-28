import { createContext, useContext, ReactNode } from "react"

export type IntegratedUserContextValue = {
}

export type IntegratedUserContextProviderProps = {
  children: ReactNode
}

export const IntegratedUserContext = createContext<IntegratedUserContextValue | undefined>( undefined )
export default IntegratedUserContext

export function IntegratedUserContextProvider({ children }:IntegratedUserContextProviderProps) {
  return (
    <IntegratedUserContext.Provider value={undefined}>
      {children}
    </IntegratedUserContext.Provider>
  )
}

export function useIntegratedUserContext() {
  return useContext( IntegratedUserContext )
}
