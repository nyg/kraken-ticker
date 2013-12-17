function createTicker (key, value) {  
  return {
    assetPair       : assetPair(key),
    lastTradePrice  : ccy(value.c[0]),
    lastTradeVolume : ccy(value.c[1], 8),
    bidPrice        : ccy(value.b[0]),
    askPrice        : ccy(value.a[0]),
    last24Volume    : ccy(value.v[1], 8),
    last24VWAP      : ccy(value.p[1]),
    last24TradeCount: value.t[1],
    last24LowPrice  : ccy(value.l[1]),
    last24HighPrice : ccy(value.h[1])
  };
}