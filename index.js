var apiUrlAssetPairs = 'https://api.kraken.com/0/public/AssetPairs',
    apiUrlTicker = 'https://api.kraken.com/0/public/Ticker?pair='

nygFetch.checkAvailability()

// retrieve data each 1.5 seconds
setInterval(function () {
    getAssetPairs()
        .then(getTickers)
        .then(updateUI)
        .catch(error)
}, 1500)

/* Get all asset pairs. */
function getAssetPairs() {
    return nygFetch.fetchJSON(apiUrlAssetPairs, true).then(extractAssetPairs).catch(nygFetch.rethrowError)
}

/* Get ticker data for all asset pairs. */
function getTickers(assetPairs) {
    return nygFetch.fetchJSON(apiUrlTicker + assetPairs.join(',')).then(extractTickers).catch(nygFetch.rethrowError)
}

/* Creates the HTML tables with the retrieved data. */
function updateUI(tickers) {
    setRowsToTable(createRows(tickers), 'tickers')
}

function extractAssetPairs(json) {

    var assetPairs = []

    for (key in json.query.results.json.result) {
        assetPairs.push(json.query.results.json.result[key].altname)
    }

    return assetPairs
}

function extractTickers(json) {

    var tickers = []

    for (key in json.query.results.json.result) {
        tickers.push(createTicker(key, json.query.results.json.result[key]))
    }

    tickers.sort(function(a, b) {
        return a.last24TradeCount > b.last24TradeCount ? -1 : a.last24TradeCount < b.last24TradeCount ? 1 : 0
    })

    return tickers
}

function error(e) {
    console.log("Error: ", e);
}
