import { useEffect, useState } from 'react'
import { initWebSocket } from './lib/websocket'
import TickerTable from './components/ticker/table.js'
import * as format from './utils/format.js'


export default function App() {

  console.log('Rendering!')

  const [tickers, setTickers] = useState({})
  const [assetPairs, setAssetPairs] = useState([])

  const sendTickerSubscription = ({ target: ws }) => {
    console.log('Sending subscription to tickers')
    ws.send(JSON.stringify({
      event: 'subscribe',
      pair: assetPairs,
      subscription: {
        name: 'ticker'
      }
    }))
  }

  function handleTickerMessage(ticker, pair) {

    setTickers(previousTicker => ({
      ...previousTicker,
      [pair]: {
        askPrice: format.asDecimal(ticker.a[0]),
        bidPrice: format.asDecimal(ticker.b[0]),
        lastTradePrice: format.asDecimal(ticker.c[0]),
        lastTradeVolume: format.asDecimal(ticker.c[1]),
        last24Volume: format.asDecimal(ticker.v[1]),
        last24VWAP: format.asDecimal(ticker.p[1]),
        last24TradeCount: format.asInteger(ticker.t[1]),
        last24LowPrice: format.asDecimal(ticker.l[1]),
        last24HighPrice: format.asDecimal(ticker.h[1])
      }
    }))
  }

  useEffect(() => {
    console.log('Fetching asset pairs')
    fetch('https://api.allorigins.win/raw?url=https://api.kraken.com/0/public/AssetPairs')
      .then(response => response.json())
      .then(json => {
        setAssetPairs(Object.values(json.result).map(pair => pair.wsname))
        initWebSocket({ onOpen: sendTickerSubscription, handleTickerMessage })
      })
  }, [])// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-4 text-sm font-mono">
      <TickerTable tickers={tickers} />
    </div>
  )
}
