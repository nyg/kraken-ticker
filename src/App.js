import { useEffect, useState } from "react"
import { initWebSocket } from "./websocket"


export default function App() {

  console.log('Rendering!')

  const [tickers, setTickers] = useState({})
  const [assetPairs, setAssetPairs] = useState([])

  const sendTickerSubscription = ({ target: ws }) => {
    ws.send(JSON.stringify({
      event: 'subscribe',
      pair: assetPairs.slice(0, 20),
      subscription: {
        name: 'ticker'
      }
    }))
  }

  function handleTickerMessage(ticker, pair) {

    setTickers(previousTicker => ({
      ...previousTicker,
      [pair]: {
        askPrice: ticker.a[0],
        bidPrice: ticker.b[0],
        lastTradePrice: ticker.c[0],
        lastTradeVolume: ticker.c[1],
        last24Volume: ticker.v[1],
        last24VWAP: ticker.p[1],
        last24TradeCount: ticker.t[1],
        last24LowPrice: ticker.l[1],
        last24HighPrice: ticker.h[1]
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
  }, [])

  return (
    <table>
      <thead>
        <tr>
          <th rowSpan="2"></th>
          <th rowSpan="2" colSpan="2">Last Trade</th>
          <th rowSpan="2">Buying</th>
          <th rowSpan="2">Selling</th>
          <th colSpan="5">Last 24 Hours</th>
        </tr>
        <tr>
          <th>Volume</th>
          <th>VWA</th>
          <th>Trades</th>
          <th>Lowest</th>
          <th>Highest</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(tickers).map(pair => (
          <tr key={pair}>
            <td>{pair}</td>
            <td colSpan="2">{tickers[pair].lastTradePrice}</td>
            <td>{tickers[pair].bidPrice}</td>
            <td>{tickers[pair].askPrice}</td>
            <td>{tickers[pair].last24Volume}</td>
            <td>{tickers[pair].last24VWAP}</td>
            <td>{tickers[pair].last24TradeCount}</td>
            <td>{tickers[pair].last24LowPrice}</td>
            <td>{tickers[pair].last24HighPrice}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
