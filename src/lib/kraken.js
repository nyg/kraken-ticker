export function toTicker(message) {
  return {
    askPrice: message.ask,
    bidPrice: message.bid,
    lastTradePrice: message.last,
    last24Volume: message.volume,
    last24VWAP: message.vwap,
    last24TradeCount: message.trades,
    last24LowPrice: message.low,
    last24HighPrice: message.high,
  }
}
