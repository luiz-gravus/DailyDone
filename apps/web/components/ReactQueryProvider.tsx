"use client"

import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // Opcional, para desenvolvimento

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  // Usamos useState para garantir que o QueryClient seja criado apenas uma vez por instância do componente,
  // e apenas no cliente, evitando problemas com SSR e múltiplas instâncias.
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Configurações globais para queries, se desejado
        // staleTime: 60 * 1000, // 1 minuto
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  )
} 