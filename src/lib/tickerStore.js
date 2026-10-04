import { usdValue, usdVolume } from '../utils/usdVolume.js'

const notify = listener => listener()

const sameSequence = (a, b) =>
  a.length === b.length && a.every((item, index) => item === b[index])

const shareOf = (part, total) =>
  part === undefined || !total ? undefined : part / total

export function createTickerStore({ scheduleFrame = callback => requestAnimationFrame(callback) } = {}) {

  const tickers = new Map()
  const pairListeners = new Map()
  const orderListeners = new Set()
  const statsListeners = new Set()
  const dirtyPairs = new Set()

  let order = []
  let orderChanged = false
  let stats = { sessionTradeCount: 0, sessionUsdVolume: 0, last24TradeCount: 0, last24UsdVolume: 0 }
  let statsChanged = false
  let frameScheduled = false

  const setTicker = (pair, ticker) => {
    tickers.set(pair, ticker)
    dirtyPairs.add(pair)
  }

  const setStats = changes => {
    stats = { ...stats, ...changes }
    statsChanged = true
  }

  const refreshUsdVolumes = () => {
    tickers.forEach((ticker, pair) => {
      const last24UsdVolume = usdVolume(pair, ticker, tickers)
      if (last24UsdVolume !== ticker.last24UsdVolume) {
        setTicker(pair, { ...ticker, last24UsdVolume })
      }
    })
  }

  const refreshLast24Totals = () => {
    let last24TradeCount = 0
    let last24UsdVolume = 0
    tickers.forEach(ticker => {
      last24TradeCount += ticker.last24TradeCount ?? 0
      last24UsdVolume += ticker.last24UsdVolume ?? 0
    })
    setStats({ last24TradeCount, last24UsdVolume })
  }

  const refreshUsdVolumeShares = () => {
    tickers.forEach((ticker, pair) => {
      const last24UsdVolumeShare = shareOf(ticker.last24UsdVolume, stats.last24UsdVolume)
      if (last24UsdVolumeShare !== ticker.last24UsdVolumeShare) {
        setTicker(pair, { ...ticker, last24UsdVolumeShare })
      }
    })
  }

  const byUsdVolumeDescending = (a, b) =>
    (tickers.get(b).last24UsdVolume ?? -1) - (tickers.get(a).last24UsdVolume ?? -1)

  const sort = () => {
    refreshUsdVolumes()
    refreshLast24Totals()
    refreshUsdVolumeShares()
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

    if (statsChanged) {
      statsChanged = false
      statsListeners.forEach(notify)
    }
  }

  const requestFlush = () => {
    if (!frameScheduled) {
      frameScheduled = true
      scheduleFrame(flush)
    }
  }

  return {

    update(pair, ticker) {
      const last24UsdVolume = usdVolume(pair, ticker, tickers)
      const last24UsdVolumeShare = shareOf(last24UsdVolume, stats.last24UsdVolume)
      setTicker(pair, { ...ticker, last24UsdVolume, last24UsdVolumeShare })
      requestFlush()
    },

    recordTrade(pair, { price, quantity }) {
      setStats({
        sessionTradeCount: stats.sessionTradeCount + 1,
        sessionUsdVolume: stats.sessionUsdVolume + (usdValue(pair, price * quantity, tickers) ?? 0),
      })
      requestFlush()
    },

    resort() {
      sort()
      requestFlush()
    },

    getTicker: pair => tickers.get(pair),

    getOrder: () => order,

    getStats: () => stats,

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

    subscribeToStats(listener) {
      statsListeners.add(listener)
      return () => statsListeners.delete(listener)
    },
  }
}

export const tickerStore = createTickerStore()
