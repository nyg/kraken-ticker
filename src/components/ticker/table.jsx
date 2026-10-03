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
    <table role="table" className="block w-full min-w-(--ticker-min-width) text-right tabular-nums">
      <thead role="rowgroup" className="grid grid-cols-(--ticker-columns) border-b border-gray-600">
        <tr role="row" className="contents">
          <TickerHeader className="row-span-2" rowSpan="2">Pairs</TickerHeader>
          <TickerHeader className="col-span-2 border-b" colSpan="2">Last Trade</TickerHeader>
          <TickerHeader className="row-span-2" rowSpan="2">Buying</TickerHeader>
          <TickerHeader className="row-span-2" rowSpan="2">Selling</TickerHeader>
          <TickerHeader className="col-span-6 border-b" colSpan="6">Last 24 Hours</TickerHeader>
        </tr>
        <tr role="row" className="contents">
          <TickerHeader>Price</TickerHeader>
          <TickerHeader>Volume</TickerHeader>
          <TickerHeader>Volume (USD)</TickerHeader>
          <TickerHeader>Volume</TickerHeader>
          <TickerHeader>VWA</TickerHeader>
          <TickerHeader>Trades</TickerHeader>
          <TickerHeader>Lowest</TickerHeader>
          <TickerHeader>Highest</TickerHeader>
        </tr>
      </thead>
      <tbody role="rowgroup" className="block">
        {pairs.slice(0, mountedRowCount).map(pair => <TickerRow key={pair} pair={pair} />)}
      </tbody>
    </table>
  )
}
