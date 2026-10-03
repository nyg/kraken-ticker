import { useEffect, useState } from 'react'
import { useTickerOrder } from '../../lib/useTickerStore.js'
import TickerHeader from './header'
import TickerRow from './row'

const rowsMountedPerFrame = 25

export default function TickerTable() {

  const pairs = useTickerOrder()
  const [mountedRowCount, setMountedRowCount] = useState(rowsMountedPerFrame)

  useEffect(() => {
    if (mountedRowCount < pairs.length) {
      const frame = requestAnimationFrame(() => setMountedRowCount(mountedRowCount + rowsMountedPerFrame))
      return () => cancelAnimationFrame(frame)
    }
  }, [mountedRowCount, pairs.length])

  return (
    <table role="table" className="block w-full min-w-min text-right tabular-nums">
      <thead role="rowgroup" className="sticky top-0 z-10 grid grid-cols-(--ticker-columns) border-b border-gray-600 bg-white">
        <tr role="row" className="contents">
          <TickerHeader className="row-span-2" rowSpan="2">Pairs</TickerHeader>
          <TickerHeader className="@last-volume:col-span-2 border-b" colSpan="2">Last Trade</TickerHeader>
          <TickerHeader className="hidden @bid-ask:block row-span-2" rowSpan="2">Buying</TickerHeader>
          <TickerHeader className="hidden @bid-ask:block row-span-2" rowSpan="2">Selling</TickerHeader>
          <TickerHeader className="@low-high:col-span-3 @vwap-trades:col-span-5 @volume:col-span-6 border-b" colSpan="6">Last 24 Hours</TickerHeader>
        </tr>
        <tr role="row" className="contents">
          <TickerHeader>Price</TickerHeader>
          <TickerHeader className="hidden @last-volume:block">Volume</TickerHeader>
          <TickerHeader className="@max-low-high:border-r-0">Volume (USD)</TickerHeader>
          <TickerHeader className="hidden @volume:block">Volume</TickerHeader>
          <TickerHeader className="hidden @vwap-trades:block">VWA</TickerHeader>
          <TickerHeader className="hidden @vwap-trades:block">Trades</TickerHeader>
          <TickerHeader className="hidden @low-high:block">Lowest</TickerHeader>
          <TickerHeader className="hidden @low-high:block">Highest</TickerHeader>
        </tr>
      </thead>
      <tbody role="rowgroup" className="block">
        {pairs.slice(0, mountedRowCount).map(pair => <TickerRow key={pair} pair={pair} />)}
      </tbody>
    </table>
  )
}
