function getJSON(apiUrl, callback) {
  $.get('http://jsonp.jit.su/?url=' + apiUrl, function (data) {
    callback(data);
  });
}
