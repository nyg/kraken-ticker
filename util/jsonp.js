function getJSON(apiUrl, callback) {

  $.ajax({

    url: 'https://query.yahooapis.com/v1/public/yql',
    jsonp: 'callback',
    dataType: 'jsonp',

    data: {
      q: 'select * from html where url = "' + apiUrl + '"',
      format: 'json'
    },

    success: function(response) {
      callback($.parseJSON(response.query.results.body))
    }
  })
}
