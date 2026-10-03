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
