import { useEffect } from 'react'
import { fetchAssetPairs, toTicker } from './lib/kraken.js'
import { tickerStore } from './lib/tickerStore.js'
import { initWebSocket } from './lib/websocket.js'
import TickerTable from './components/ticker/table'

const resortIntervalMs = 5000

export default function App() {

  useEffect(() => {
    let cancelled = false
    let closeWebSocket = () => { }

    fetchAssetPairs()
      .then(pairs => {
        if (!cancelled) {
          closeWebSocket = initWebSocket({
            pairs,
            handleTickerMessage: (ticker, pair) => tickerStore.update(pair, toTicker(ticker))
          })
        }
      })
      .catch(error => console.error('Could not fetch asset pairs', error))

    const resortTimer = setInterval(tickerStore.resort, resortIntervalMs)

    return () => {
      cancelled = true
      clearInterval(resortTimer)
      closeWebSocket()
    }
  }, [])

  return (
    <div className="p-4 text-sm font-mono">
      <TickerTable />
    </div>
  )
}
