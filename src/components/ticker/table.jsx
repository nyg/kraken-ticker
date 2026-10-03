import { useEffect, useState } from 'react'
import { useTickerOrder } from '../../lib/useTickerStore.js'
import TickerHeader from './header'
import TickerRow from './row'

const rowsMountedPerFrame = 50

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
    <table className="w-full border-collapse text-right tabular-nums">
      <thead className="border-b border-gray-600">
        <tr>
          <TickerHeader rowSpan="2">Pairs</TickerHeader>
          <TickerHeader className="border-b" colSpan="2">Last Trade</TickerHeader>
          <TickerHeader rowSpan="2">Buying</TickerHeader>
          <TickerHeader rowSpan="2">Selling</TickerHeader>
          <TickerHeader className="border-b" colSpan="6">Last 24 Hours</TickerHeader>
        </tr>
        <tr>
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
      <tbody>
        {pairs.slice(0, mountedRowCount).map(pair => <TickerRow key={pair} pair={pair} />)}
      </tbody>
    </table>
  )
}
