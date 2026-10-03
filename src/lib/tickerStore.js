import { usdVolume } from '../utils/usdVolume.js'

const notify = listener => listener()

const sameSequence = (a, b) =>
  a.length === b.length && a.every((item, index) => item === b[index])

export function createTickerStore({ scheduleFrame = callback => requestAnimationFrame(callback) } = {}) {

  const tickers = new Map()
  const pairListeners = new Map()
  const orderListeners = new Set()
  const dirtyPairs = new Set()

  let order = []
  let orderChanged = false
  let frameScheduled = false

  const setTicker = (pair, ticker) => {
    tickers.set(pair, ticker)
    dirtyPairs.add(pair)
  }

  const refreshUsdVolumes = () => {
    tickers.forEach((ticker, pair) => {
      const last24UsdVolume = usdVolume(pair, ticker, tickers)
      if (last24UsdVolume !== ticker.last24UsdVolume) {
        setTicker(pair, { ...ticker, last24UsdVolume })
      }
    })
  }

  const byUsdVolumeDescending = (a, b) =>
    (tickers.get(b).last24UsdVolume ?? -1) - (tickers.get(a).last24UsdVolume ?? -1)

  const sort = () => {
    refreshUsdVolumes()
    const sorted = [...tickers.keys()].sort(byUsdVolumeDescending)
    if (!sameSequence(sorted, order)) {
      order = sorted
      orderChanged = true
    }
  }

  const flush = () => {
    frameScheduled = false

    if (tickers.size > order.length) {
      sort()
    }

    if (orderChanged) {
      orderChanged = false
      orderListeners.forEach(notify)
    }

    const pairs = [...dirtyPairs]
    dirtyPairs.clear()
    pairs.forEach(pair => pairListeners.get(pair)?.forEach(notify))
  }

  const requestFlush = () => {
    if (!frameScheduled) {
      frameScheduled = true
      scheduleFrame(flush)
    }
  }

  return {

    update(pair, ticker) {
      setTicker(pair, { ...ticker, last24UsdVolume: usdVolume(pair, ticker, tickers) })
      requestFlush()
    },

    resort() {
      sort()
      requestFlush()
    },

    getTicker: pair => tickers.get(pair),

    getOrder: () => order,

    subscribeToPair(pair, listener) {
      if (!pairListeners.has(pair)) {
        pairListeners.set(pair, new Set())
      }
      pairListeners.get(pair).add(listener)
      return () => pairListeners.get(pair).delete(listener)
    },

    subscribeToOrder(listener) {
      orderListeners.add(listener)
      return () => orderListeners.delete(listener)
    },
  }
}

export const tickerStore = createTickerStore()
