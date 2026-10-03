import { expect, test, vi } from 'vitest'
import { asDecimal, splitTrailingZeroes } from './format.js'

vi.hoisted(() => vi.stubGlobal('navigator', { language: 'en-GB' }))

test('should_pad_to_five_fraction_digits_when_value_is_not_tiny', () => {
  // When
  const result = asDecimal(1034.5)

  // Then
  expect(result).toBe('1,034.50000')
})

test('should_keep_five_fraction_digits_when_value_is_smallest_fixed_decimal', () => {
  // When
  const result = asDecimal(0.00001)

  // Then
  expect(result).toBe('0.00001')
})

test('should_keep_five_fraction_digits_when_value_is_zero', () => {
  // When
  const result = asDecimal(0)

  // Then
  expect(result).toBe('0.00000')
})

test('should_pad_to_five_significant_digits_when_value_is_tiny', () => {
  // When
  const result = asDecimal(0.000004322)

  // Then
  expect(result).toBe('0.0000043220')
})

test('should_round_to_five_significant_digits_when_tiny_value_has_more', () => {
  // When
  const result = asDecimal(0.000003217657)

  // Then
  expect(result).toBe('0.0000032177')
})

test('should_stay_within_sixteen_characters_when_five_significant_digits_do_not_fit', () => {
  // When
  const result = asDecimal(0.000000000012345678)

  // Then
  expect(result).toBe('0.00000000001235')
})

test('should_split_tiny_decimal_after_last_significant_digit', () => {
  // When
  const result = splitTrailingZeroes(asDecimal(0.000000012))

  // Then
  expect(result).toEqual({ value: '0.000000012', trailingZeroes: '000' })
})

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
