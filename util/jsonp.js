function getJSON(apiUrl, callback) {
  
    yqlUrl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D"'
           + apiUrl
           + '"&format=json&callback=?';
    
    $.getJSON(yqlUrl, function (jsonp) {
      callback($.parseJSON(jsonp.query.results.body.p));
    });
}
