import { useMarketStats } from '../../lib/useTickerStore.js'
import * as format from '../../utils/format.js'

const cell = 'px-[1ch] py-1 border-gray-600 border-r last:border-r-0'

export default function MarketStats() {

  const stats = useMarketStats()

  return (
    <table className="mb-4 text-right tabular-nums whitespace-nowrap">
      <thead className="border-b border-gray-600">
        <tr>
          <td className={cell} />
          <th scope="col" className={`${cell} min-w-[13ch]`}>Trades</th>
          <th scope="col" className={`${cell} min-w-[15ch]`}>Volume (USD)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" className={`${cell} text-left`}>Since page load</th>
          <td className={cell}>{format.asInteger(stats.sessionTradeCount)}</td>
          <td className={cell}>{format.asInteger(stats.sessionUsdVolume)}</td>
        </tr>
        <tr>
          <th scope="row" className={`${cell} text-left`}>Last 24 hours</th>
          <td className={cell}>{format.asInteger(stats.last24TradeCount)}</td>
          <td className={cell}>{format.asInteger(stats.last24UsdVolume)}</td>
        </tr>
      </tbody>
    </table>
  )
}
