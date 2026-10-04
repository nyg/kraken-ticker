const usd = 'USD'

export function usdVolume(pair, ticker, tickers) {
  return usdValue(pair, ticker.last24Volume * ticker.last24VWAP, tickers)
}

export function usdValue(pair, quoteAmount, tickers) {
  const rate = usdRate(quoteOf(pair), tickers)
  return rate === undefined ? undefined : quoteAmount * rate
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
