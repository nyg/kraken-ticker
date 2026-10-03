import { memo } from 'react'
import * as format from '../../utils/format.js'

const dimTrailingZeroes = n => {
  const { value, trailingZeroes } = format.splitTrailingZeroes(n)
  return (
    <>
      {value}
      <span className="text-gray-200">{trailingZeroes}</span>
    </>
  )
}

const render = (data, { decimal, integer }) => {
  if (data === undefined) {
    return null
  }
  if (decimal) {
    return dimTrailingZeroes(format.asDecimal(data))
  }
  return integer ? format.asInteger(data) : data
}

export default memo(function TickerCell({ className, decimal, integer, data }) {

  return (
    <td role="cell" className={`px-4 py-1 border-gray-600 border-r last:border-0 ${className ?? ''}`}>
      {render(data, { decimal, integer })}
    </td>
  )
})
