export default function TickerCell({ className, data }) {

  const isFloat = data =>
    !isNaN(data) && !Number.isInteger(Number(data))

  const splitNumber = n =>
    n.match(/(?<value>.*?\.0?\d*?)(?<trailingZeroes>0*)$/).groups

  const dimTrailingZeroes = n => {
    const { value, trailingZeroes } = splitNumber(n)
    return (
      <>
        {value}
        <span className="text-gray-200">{trailingZeroes}</span>
      </>
    )
  }

  return (
    <td className={`px-4 py-1 border-gray-600 border-r last:border-0 ${className ?? ''}`}>
      {isFloat(data) ? dimTrailingZeroes(data) : data}
    </td>
  )
}
