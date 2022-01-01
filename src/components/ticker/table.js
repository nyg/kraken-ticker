import TickerCell from './cell.js'
import TickerHeader from './header.js'


export default function TickerTable({ tickers }) {

  return (
    <table className="w-full border-collapse text-right">
      <thead className="border-b border-gray-600">
        <tr>
          <TickerHeader rowSpan="2">Pairs</TickerHeader>
          <TickerHeader className="border-b" colSpan="2">Last Trade</TickerHeader>
          <TickerHeader rowSpan="2">Buying</TickerHeader>
          <TickerHeader rowSpan="2">Selling</TickerHeader>
          <TickerHeader className="border-b" colSpan="5">Last 24 Hours</TickerHeader>
        </tr>
        <tr>
          <TickerHeader>Price</TickerHeader>
          <TickerHeader>Volume</TickerHeader>
          <TickerHeader>Volume</TickerHeader>
          <TickerHeader>VWA</TickerHeader>
          <TickerHeader>Trades</TickerHeader>
          <TickerHeader>Lowest</TickerHeader>
          <TickerHeader>Highest</TickerHeader>
        </tr>
      </thead>
      <tbody>
        {Object.keys(tickers).map(pair => (
          <tr key={pair}>
            <TickerCell data={pair} />
            <TickerCell data={tickers[pair].lastTradePrice} />
            <TickerCell data={tickers[pair].lastTradeVolume} />
            <TickerCell data={tickers[pair].bidPrice} />
            <TickerCell data={tickers[pair].askPrice} />
            <TickerCell data={tickers[pair].last24Volume} />
            <TickerCell data={tickers[pair].last24VWAP} />
            <TickerCell data={tickers[pair].last24TradeCount} />
            <TickerCell data={tickers[pair].last24LowPrice} />
            <TickerCell data={tickers[pair].last24HighPrice} />
          </tr>
        ))}
      </tbody>
    </table>
  )
}
