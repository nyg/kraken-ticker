import { memo } from 'react'
import { useTicker } from '../../lib/useTickerStore.js'
import TickerCell from './cell'

export default memo(function TickerRow({ pair }) {

  const ticker = useTicker(pair)

  return (
    <tr role="row" className="grid grid-cols-(--ticker-columns) h-6 contain-strict">
      <TickerCell data={pair} />
      <TickerCell decimal data={ticker.lastTradePrice} />
      <TickerCell className="hidden @last-volume:block" decimal data={ticker.lastTradeVolume} />
      <TickerCell className="hidden @bid-ask:block" decimal data={ticker.bidPrice} />
      <TickerCell className="hidden @bid-ask:block" decimal data={ticker.askPrice} />
      <TickerCell className="@max-low-high:border-r-0" integer data={ticker.last24UsdVolume} />
      <TickerCell className="hidden @volume:block" decimal data={ticker.last24Volume} />
      <TickerCell className="hidden @vwap-trades:block" decimal data={ticker.last24VWAP} />
      <TickerCell className="hidden @vwap-trades:block" integer data={ticker.last24TradeCount} />
      <TickerCell className="hidden @low-high:block" decimal data={ticker.last24LowPrice} />
      <TickerCell className="hidden @low-high:block" decimal data={ticker.last24HighPrice} />
    </tr>
  )
})
