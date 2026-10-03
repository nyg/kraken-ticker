export default function TickerHeader({ className, colSpan, rowSpan, children }) {

  return (
    <th
      role="columnheader"
      className={`content-end whitespace-nowrap px-[1ch] py-1 border-gray-600 border-r last:border-r-0 ${className ?? ''}`}
      colSpan={colSpan} rowSpan={rowSpan}>
      {children}
    </th>
  )
}
