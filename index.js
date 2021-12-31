var apiUrlAssetPairs = 'https://api.kraken.com/0/public/AssetPairs',
    apiUrlTicker = 'https://api.kraken.com/0/public/Ticker?pair='

// retrieve data each 1.5 seconds
setInterval(function () {
    getAssetPairs()
        .then(getTickers)
        .then(updateUI)
        .catch(error)
}, 1500)

function fetchJSON(url) {
    return fetch(`https://api.allorigins.win/raw?url=${url}`)
        .then(response => response.json())
}

/* Get all asset pairs. */
function getAssetPairs() {
    return fetchJSON(apiUrlAssetPairs).then(extractAssetPairs)
}

/* Get ticker data for all asset pairs. */
function getTickers(assetPairs) {
    return fetchJSON(apiUrlTicker + assetPairs.join(',')).then(extractTickers)
}

/* Creates the HTML tables with the retrieved data. */
function updateUI(tickers) {
    setRowsToTable(createRows(tickers), 'tickers')
}

function extractAssetPairs(json) {
    return Object.keys(json.result).map(key => json.result[key].altname)
}

function extractTickers(json) {
    var tickers = Object.keys(json.result).map(key => createTicker(key, json.result[key]))
    tickers.sort((a, b) => b.last24TradeCount - a.last24TradeCount)
    return tickers
}

function error(e) {
    console.log("Error: ", e);
}
