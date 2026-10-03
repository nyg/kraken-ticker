import { memo } from 'react'
import { useTicker } from '../../lib/useTickerStore.js'
import TickerCell from './cell'

export default memo(function TickerRow({ pair }) {

  const ticker = useTicker(pair)

  return (
    <tr role="row" className="grid grid-cols-(--ticker-columns) h-7 contain-strict">
      <TickerCell data={pair} />
      <TickerCell decimal data={ticker.lastTradePrice} />
      <TickerCell decimal data={ticker.lastTradeVolume} />
      <TickerCell decimal data={ticker.bidPrice} />
      <TickerCell decimal data={ticker.askPrice} />
      <TickerCell integer data={ticker.last24UsdVolume} />
      <TickerCell decimal data={ticker.last24Volume} />
      <TickerCell decimal data={ticker.last24VWAP} />
      <TickerCell integer data={ticker.last24TradeCount} />
      <TickerCell decimal data={ticker.last24LowPrice} />
      <TickerCell decimal data={ticker.last24HighPrice} />
    </tr>
  )
})
