"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export type TanstackQueryProviderProps = {
  children: React.ReactNode
}

const queryClient = new QueryClient()

export default function TanstackQueryProvider({ children }:TanstackQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
