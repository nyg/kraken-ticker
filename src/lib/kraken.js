const assetPairsUrl = 'https://api.kraken.com/0/public/AssetPairs'

export async function fetchAssetPairs() {
  const response = await fetch(assetPairsUrl)
  const json = await response.json()

  if (json.error?.length) {
    throw new Error(json.error.join(', '))
  }

  return Object.values(json.result).map(pair => pair.wsname)
}

export function toTicker(message) {
  return {
    askPrice: Number(message.a[0]),
    bidPrice: Number(message.b[0]),
    lastTradePrice: Number(message.c[0]),
    lastTradeVolume: Number(message.c[1]),
    last24Volume: Number(message.v[1]),
    last24VWAP: Number(message.p[1]),
    last24TradeCount: Number(message.t[1]),
    last24LowPrice: Number(message.l[1]),
    last24HighPrice: Number(message.h[1]),
  }
}
