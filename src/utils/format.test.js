import { expect, test } from 'vitest'
import { splitTrailingZeroes } from './format.js'

test('should_split_after_last_significant_digit_when_fraction_ends_with_zeroes', () => {
  // When
  const result = splitTrailingZeroes('1,034.50000')

  // Then
  expect(result).toEqual({ value: '1,034.5', trailingZeroes: '0000' })
})

test('should_keep_one_fraction_zero_when_fraction_is_all_zeroes', () => {
  // When
  const result = splitTrailingZeroes('67,000.00000')

  // Then
  expect(result).toEqual({ value: '67,000.0', trailingZeroes: '0000' })
})

test('should_return_no_trailing_zeroes_when_last_digit_is_significant', () => {
  // When
  const result = splitTrailingZeroes('0.12345')

  // Then
  expect(result).toEqual({ value: '0.12345', trailingZeroes: '' })
})

test('should_split_when_decimal_separator_is_a_comma', () => {
  // When
  const result = splitTrailingZeroes('1 034,50000')

  // Then
  expect(result).toEqual({ value: '1 034,5', trailingZeroes: '0000' })
})
