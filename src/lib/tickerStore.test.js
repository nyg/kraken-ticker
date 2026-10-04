import { expect, test, vi } from 'vitest'
import { createTickerStore } from './tickerStore.js'

test('should_notify_pair_listener_once_per_frame_when_pair_is_updated_several_times', () => {
  // Given
  const frames = []
  const unit = createTickerStore({ scheduleFrame: frame => frames.push(frame) })
  const listener = vi.fn()
  unit.subscribeToPair('XBT/USD', listener)

  // When
  unit.update('XBT/USD', { last24Volume: 1, last24VWAP: 50000, lastTradePrice: 50000 })
  unit.update('XBT/USD', { last24Volume: 2, last24VWAP: 50000, lastTradePrice: 50001 })
  frames.forEach(frame => frame())

  // Then
  expect(frames).toHaveLength(1)
  expect(listener).toHaveBeenCalledOnce()
  expect(unit.getTicker('XBT/USD').lastTradePrice).toBe(50001)
})

test('should_not_notify_listener_of_other_pair_when_pair_is_updated', () => {
  // Given
  const frames = []
  const unit = createTickerStore({ scheduleFrame: frame => frames.push(frame) })
  unit.update('XBT/USD', { last24Volume: 1, last24VWAP: 50000, lastTradePrice: 50000 })
  unit.update('ETH/USD', { last24Volume: 1, last24VWAP: 2000, lastTradePrice: 2000 })
  frames.splice(0).forEach(frame => frame())
  const listener = vi.fn()
  unit.subscribeToPair('ETH/USD', listener)

  // When
  unit.update('XBT/USD', { last24Volume: 1, last24VWAP: 50000, lastTradePrice: 50002 })
  frames.forEach(frame => frame())

  // Then
  expect(listener).not.toHaveBeenCalled()
})

test('should_not_notify_before_frame_when_pair_is_updated', () => {
  // Given
  const unit = createTickerStore({ scheduleFrame: () => { } })
  const listener = vi.fn()
  unit.subscribeToPair('XBT/USD', listener)

  // When
  unit.update('XBT/USD', { last24Volume: 1, last24VWAP: 50000, lastTradePrice: 50000 })

  // Then
  expect(listener).not.toHaveBeenCalled()
})

test('should_order_pairs_by_usd_volume_descending_when_new_pairs_arrive', () => {
  // Given
  const frames = []
  const unit = createTickerStore({ scheduleFrame: frame => frames.push(frame) })

  // When
  unit.update('ETH/USD', { last24Volume: 100, last24VWAP: 2000, lastTradePrice: 2000 })
  unit.update('XBT/EUR', { last24Volume: 10, last24VWAP: 40000, lastTradePrice: 40000 })
  unit.update('DOGE/GBP', { last24Volume: 1000000, last24VWAP: 1, lastTradePrice: 1 })
  unit.update('EUR/USD', { last24Volume: 1000, last24VWAP: 1.25, lastTradePrice: 1.25 })
  frames.forEach(frame => frame())

  // Then
  expect(unit.getOrder()).toEqual(['XBT/EUR', 'ETH/USD', 'EUR/USD', 'DOGE/GBP'])
  expect(unit.getTicker('XBT/EUR').last24UsdVolume).toBe(500000)
  expect(unit.getTicker('DOGE/GBP').last24UsdVolume).toBeUndefined()
})

test('should_keep_order_until_resort_when_volumes_change', () => {
  // Given
  const frames = []
  const unit = createTickerStore({ scheduleFrame: frame => frames.push(frame) })
  const listener = vi.fn()
  unit.update('XBT/USD', { last24Volume: 10, last24VWAP: 50000, lastTradePrice: 50000 })
  unit.update('ETH/USD', { last24Volume: 100, last24VWAP: 2000, lastTradePrice: 2000 })
  frames.splice(0).forEach(frame => frame())
  unit.subscribeToOrder(listener)

  // When
  unit.update('ETH/USD', { last24Volume: 1000, last24VWAP: 2000, lastTradePrice: 2000 })
  frames.splice(0).forEach(frame => frame())
  const orderBeforeResort = unit.getOrder()
  unit.resort()
  frames.splice(0).forEach(frame => frame())

  // Then
  expect(orderBeforeResort).toEqual(['XBT/USD', 'ETH/USD'])
  expect(unit.getOrder()).toEqual(['ETH/USD', 'XBT/USD'])
  expect(listener).toHaveBeenCalledOnce()
})

test('should_keep_order_identity_and_not_notify_when_resort_changes_nothing', () => {
  // Given
  const frames = []
  const unit = createTickerStore({ scheduleFrame: frame => frames.push(frame) })
  const listener = vi.fn()
  unit.update('XBT/USD', { last24Volume: 10, last24VWAP: 50000, lastTradePrice: 50000 })
  unit.update('ETH/USD', { last24Volume: 100, last24VWAP: 2000, lastTradePrice: 2000 })
  frames.splice(0).forEach(frame => frame())
  const order = unit.getOrder()
  unit.subscribeToOrder(listener)

  // When
  unit.resort()
  frames.splice(0).forEach(frame => frame())

  // Then
  expect(unit.getOrder()).toBe(order)
  expect(listener).not.toHaveBeenCalled()
})

test('should_stop_notifying_when_listener_unsubscribes', () => {
  // Given
  const frames = []
  const unit = createTickerStore({ scheduleFrame: frame => frames.push(frame) })
  const listener = vi.fn()
  const unsubscribe = unit.subscribeToPair('XBT/USD', listener)

  // When
  unsubscribe()
  unit.update('XBT/USD', { last24Volume: 1, last24VWAP: 50000, lastTradePrice: 50000 })
  frames.forEach(frame => frame())

  // Then
  expect(listener).not.toHaveBeenCalled()
})

test('should_count_trades_and_sum_usd_volume_when_trades_are_recorded', () => {
  // Given
  const unit = createTickerStore({ scheduleFrame: () => { } })
  unit.update('EUR/USD', { last24Volume: 1000, last24VWAP: 1.25, lastTradePrice: 1.25 })

  // When
  unit.recordTrade('XBT/USD', { price: 50000, quantity: 2 })
  unit.recordTrade('XBT/EUR', { price: 40000, quantity: 1 })

  // Then
  expect(unit.getStats()).toMatchObject({ sessionTradeCount: 2, sessionUsdVolume: 150000 })
})

test('should_count_trade_without_volume_when_quote_has_no_usd_rate', () => {
  // Given
  const unit = createTickerStore({ scheduleFrame: () => { } })

  // When
  unit.recordTrade('DOGE/GBP', { price: 1, quantity: 1000 })

  // Then
  expect(unit.getStats()).toMatchObject({ sessionTradeCount: 1, sessionUsdVolume: 0 })
})

test('should_notify_stats_listener_once_per_frame_when_several_trades_are_recorded', () => {
  // Given
  const frames = []
  const unit = createTickerStore({ scheduleFrame: frame => frames.push(frame) })
  const listener = vi.fn()
  unit.subscribeToStats(listener)

  // When
  unit.recordTrade('XBT/USD', { price: 50000, quantity: 1 })
  unit.recordTrade('XBT/USD', { price: 50001, quantity: 1 })
  frames.forEach(frame => frame())

  // Then
  expect(frames).toHaveLength(1)
  expect(listener).toHaveBeenCalledOnce()
})

test('should_total_last_24_hours_and_share_usd_volume_when_new_pairs_arrive', () => {
  // Given
  const frames = []
  const unit = createTickerStore({ scheduleFrame: frame => frames.push(frame) })

  // When
  unit.update('XBT/USD', { last24Volume: 6, last24VWAP: 50000, lastTradePrice: 50000, last24TradeCount: 30 })
  unit.update('ETH/USD', { last24Volume: 50, last24VWAP: 2000, lastTradePrice: 2000, last24TradeCount: 10 })
  unit.update('DOGE/GBP', { last24Volume: 1000000, last24VWAP: 1, lastTradePrice: 1, last24TradeCount: 5 })
  frames.forEach(frame => frame())

  // Then
  expect(unit.getStats()).toMatchObject({ last24TradeCount: 45, last24UsdVolume: 400000 })
  expect(unit.getTicker('XBT/USD').last24UsdVolumeShare).toBe(0.75)
  expect(unit.getTicker('ETH/USD').last24UsdVolumeShare).toBe(0.25)
  expect(unit.getTicker('DOGE/GBP').last24UsdVolumeShare).toBeUndefined()
})

test('should_keep_last_24_hours_totals_until_resort_when_volumes_change', () => {
  // Given
  const frames = []
  const unit = createTickerStore({ scheduleFrame: frame => frames.push(frame) })
  unit.update('XBT/USD', { last24Volume: 6, last24VWAP: 50000, lastTradePrice: 50000 })
  unit.update('ETH/USD', { last24Volume: 50, last24VWAP: 2000, lastTradePrice: 2000 })
  frames.splice(0).forEach(frame => frame())

  // When
  unit.update('ETH/USD', { last24Volume: 100, last24VWAP: 2000, lastTradePrice: 2000 })
  frames.splice(0).forEach(frame => frame())
  const statsBeforeResort = unit.getStats()
  const shareBeforeResort = unit.getTicker('ETH/USD').last24UsdVolumeShare
  unit.resort()

  // Then
  expect(statsBeforeResort.last24UsdVolume).toBe(400000)
  expect(shareBeforeResort).toBe(0.5)
  expect(unit.getStats().last24UsdVolume).toBe(500000)
  expect(unit.getTicker('ETH/USD').last24UsdVolumeShare).toBe(0.4)
  expect(unit.getTicker('XBT/USD').last24UsdVolumeShare).toBe(0.6)
})
