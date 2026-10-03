const usd = 'USD'

export function usdVolume(pair, ticker, tickers) {
  const rate = usdRate(quoteOf(pair), tickers)
  return rate === undefined ? undefined : ticker.last24Volume * ticker.last24VWAP * rate
}

function quoteOf(pair) {
  return pair.split('/')[1]
}

function usdRate(quote, tickers) {
  if (quote === usd) {
    return 1
  }

  const direct = tickers.get(`${quote}/${usd}`)
  if (direct) {
    return direct.lastTradePrice
  }

  const inverse = tickers.get(`${usd}/${quote}`)
  return inverse?.lastTradePrice ? 1 / inverse.lastTradePrice : undefined
}
