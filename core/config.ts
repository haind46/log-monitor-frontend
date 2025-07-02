import { DefaultOptions } from '@tanstack/react-query'

export const DEFAULT_QUERY_OPTIONS: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  },
}
