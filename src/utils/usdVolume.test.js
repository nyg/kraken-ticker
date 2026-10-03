import { expect, test } from 'vitest'
import { usdVolume } from './usdVolume.js'

test('should_multiply_volume_by_vwap_when_quote_is_usd', () => {
  // Given
  const ticker = { last24Volume: 10, last24VWAP: 50000 }

  // When
  const result = usdVolume('XBT/USD', ticker, new Map())

  // Then
  expect(result).toBe(500000)
})

test('should_convert_with_last_price_when_quote_has_direct_usd_pair', () => {
  // Given
  const ticker = { last24Volume: 10, last24VWAP: 40000 }
  const tickers = new Map([['EUR/USD', { lastTradePrice: 1.25 }]])

  // When
  const result = usdVolume('XBT/EUR', ticker, tickers)

  // Then
  expect(result).toBe(500000)
})

test('should_convert_with_inverted_last_price_when_quote_has_inverse_usd_pair', () => {
  // Given
  const ticker = { last24Volume: 10, last24VWAP: 8000000 }
  const tickers = new Map([['USD/JPY', { lastTradePrice: 160 }]])

  // When
  const result = usdVolume('XBT/JPY', ticker, tickers)

  // Then
  expect(result).toBe(500000)
})

test('should_return_undefined_when_quote_has_no_usd_rate', () => {
  // Given
  const ticker = { last24Volume: 10, last24VWAP: 40000 }

  // When
  const result = usdVolume('XBT/EUR', ticker, new Map())

  // Then
  expect(result).toBeUndefined()
})
