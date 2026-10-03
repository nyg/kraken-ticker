import { splitTrailingZeroes } from '../../utils/format.js'

export default function TickerCell({ className, decimal, data }) {

  const dimTrailingZeroes = n => {
    const { value, trailingZeroes } = splitTrailingZeroes(n)
    return (
      <>
        {value}
        <span className="text-gray-200">{trailingZeroes}</span>
      </>
    )
  }

  return (
    <td className={`px-4 py-1 border-gray-600 border-r last:border-0 ${className ?? ''}`}>
      {decimal ? dimTrailingZeroes(data) : data}
    </td>
  )
}
