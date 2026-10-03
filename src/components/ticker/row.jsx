import { memo } from 'react'
import { useTicker } from '../../lib/useTickerStore.js'
import * as format from '../../utils/format.js'
import TickerCell from './cell'

const asUsd = volume => volume === undefined ? '' : format.asInteger(volume)

export default memo(function TickerRow({ pair }) {

  const ticker = useTicker(pair)

  return (
    <tr>
      <TickerCell data={pair} />
      <TickerCell decimal data={format.asDecimal(ticker.lastTradePrice)} />
      <TickerCell decimal data={format.asDecimal(ticker.lastTradeVolume)} />
      <TickerCell decimal data={format.asDecimal(ticker.bidPrice)} />
      <TickerCell decimal data={format.asDecimal(ticker.askPrice)} />
      <TickerCell data={asUsd(ticker.last24UsdVolume)} />
      <TickerCell decimal data={format.asDecimal(ticker.last24Volume)} />
      <TickerCell decimal data={format.asDecimal(ticker.last24VWAP)} />
      <TickerCell data={format.asInteger(ticker.last24TradeCount)} />
      <TickerCell decimal data={format.asDecimal(ticker.last24LowPrice)} />
      <TickerCell decimal data={format.asDecimal(ticker.last24HighPrice)} />
    </tr>
  )
})
