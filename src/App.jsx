import { useEffect } from 'react'
import { toTicker, toTrade } from './lib/kraken.js'
import { tickerStore } from './lib/tickerStore.js'
import { initWebSocket } from './lib/websocket.js'
import MarketStats from './components/market/stats'
import TickerTable from './components/ticker/table'

const resortIntervalMs = 5000

export default function App() {

  useEffect(() => {
    const closeWebSocket = initWebSocket({
      handleTickerMessage: ticker => tickerStore.update(ticker.symbol, toTicker(ticker)),
      handleTradeMessage: trade => tickerStore.recordTrade(trade.symbol, toTrade(trade))
    })

    const resortTimer = setInterval(tickerStore.resort, resortIntervalMs)

    return () => {
      clearInterval(resortTimer)
      closeWebSocket()
    }
  }, [])

  return (
    <div className="@container p-2 font-mono text-[clamp(10px,3vw,12px)]/4">
      <MarketStats />
      <TickerTable />
    </div>
  )
}
