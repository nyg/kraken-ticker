const locales = typeof navigator !== 'undefined' ? navigator.language : 'en-GB'

/* Number */

const decimalFormatter = new Intl.NumberFormat(locales, { minimumFractionDigits: 5, maximumFractionDigits: 5 })

const smallestFixedDecimal = 0.00001

// "0." plus 14 fraction digits fills the 16ch price columns of index.css
const tinyDecimalFormatter = new Intl.NumberFormat(locales, {
  minimumSignificantDigits: 5,
  maximumSignificantDigits: 5,
  minimumFractionDigits: 14,
  maximumFractionDigits: 14,
  roundingPriority: 'lessPrecision',
})

const isTiny = number => number !== 0 && Math.abs(number) < smallestFixedDecimal

export function asDecimal(number) {
  return isTiny(number) ? tinyDecimalFormatter.format(number) : decimalFormatter.format(number)
}

const integerFormatter = new Intl.NumberFormat(locales, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
export function asInteger(number) {
  return integerFormatter.format(number)
}

// Appends the sign itself: the percent style adds a space in some locales and would overflow the share box.
const percentFormatter = new Intl.NumberFormat(locales, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export function asPercent(ratio) {
  return `${percentFormatter.format(ratio * 100)}%`
}

export function splitTrailingZeroes(decimal) {
  return decimal.match(/^(?<value>.*\D0|.*[^0])(?<trailingZeroes>0*)$/).groups
}
