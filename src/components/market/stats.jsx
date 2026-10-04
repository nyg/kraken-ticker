import { useMarketStats } from '../../lib/useTickerStore.js'
import * as format from '../../utils/format.js'

function PeriodStats({ label, tradeCount, usdVolume }) {

  return (
    <p>
      <span className="font-bold">{label}</span> {format.asInteger(tradeCount)} trades · {format.asInteger(usdVolume)} USD
    </p>
  )
}

export default function MarketStats() {

  const stats = useMarketStats()

  return (
    <header className="flex flex-wrap justify-between gap-x-[2ch] px-[1ch] py-1 border-b border-gray-600 tabular-nums">
      <PeriodStats label="Since page load" tradeCount={stats.sessionTradeCount} usdVolume={stats.sessionUsdVolume} />
      <PeriodStats label="Last 24 hours" tradeCount={stats.last24TradeCount} usdVolume={stats.last24UsdVolume} />
    </header>
  )
}
