/*_*/

var apiUrlAssetPairs = 'https://api.kraken.com/0/public/AssetPairs',
    apiUrlTicker = 'https://api.kraken.com/0/public/Ticker?pair=';

main();
setInterval(main, 1500);

function main () {
  
  getJSON(apiUrlAssetPairs, function (response) {
  
    var assetPairs = [];
    
    for (key in response.result) {
      assetPairs.push(response.result[key].altname);
    }
    
    getTickerInformation(assetPairs)
  });
}

function getTickerInformation (assetPairs) {
  
  getJSON(apiUrlTicker + assetPairs.join(','), function (response) {
    
    var value, tickers = [];
    
    for (key in response.result) {
      tickers.push(createTicker(key, response.result[key]));
    }
    
    tickers.sort(function (a, b) {
      return a.last24TradeCount > b.last24TradeCount ? -1 : a.last24TradeCount < b.last24TradeCount ? 1 : 0;
    });
    
    setRowsToTable(createRows(tickers), 'tickers')
  });
}