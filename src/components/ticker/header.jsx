export default function TickerHeader({ className, colSpan, rowSpan, children }) {

  return (
    <th
      className={`align-bottom px-4 py-1 border-gray-600 border-r last:border-r-0 ${className ?? ''}`}
      colSpan={colSpan} rowSpan={rowSpan}>
      {children}
    </th>
  )
}
