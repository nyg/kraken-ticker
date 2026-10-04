import { useCallback, useSyncExternalStore } from 'react'
import { tickerStore } from './tickerStore.js'

export function useTicker(pair) {
  const subscribe = useCallback(listener => tickerStore.subscribeToPair(pair, listener), [pair])
  return useSyncExternalStore(subscribe, () => tickerStore.getTicker(pair))
}

export function useTickerOrder() {
  return useSyncExternalStore(tickerStore.subscribeToOrder, tickerStore.getOrder)
}

export function useMarketStats() {
  return useSyncExternalStore(tickerStore.subscribeToStats, tickerStore.getStats)
}
