const locales = typeof navigator !== 'undefined' ? navigator.language : 'en-GB'

/* Number */

const decimalFormatter = new Intl.NumberFormat(locales, { minimumFractionDigits: 5, maximumFractionDigits: 5 })
export function asDecimal(number) {
  return decimalFormatter.format(number)
}

const integerFormatter = new Intl.NumberFormat(locales, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
export function asInteger(number) {
  return integerFormatter.format(number)
}
