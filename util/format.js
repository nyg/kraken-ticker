function formatNumber (number, decimals, decPoint, thousandsSep) {
  
  decimals = isNaN(decimals) ? 2 : Math.abs(decimals);
  decPoint = (decPoint === undefined) ? '.' : decPoint;
  thousandsSep = (thousandsSep === undefined) ? ',' : thousandsSep;
  
  var sign = number < 0 ? '-' : '';
  number = Math.abs(+number || 0);
  
  var intPart = parseInt(number.toFixed(decimals), 10) + '';
  var j = intPart.length > 3 ? intPart.length % 3 : 0;
  
  return sign + (j ? intPart.substr(0, j) + thousandsSep : '') + intPart.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep) + (decimals ? decPoint + Math.abs(number - intPart).toFixed(decimals).slice(2) : '');
}

function assetPair (s) {
  return s.replace(/[XZ]([A-Z]{3})[XZ]([A-Z]{3})/g, '$1/$2')
}

function ccy (n) {
  return dimEndingZeroes(formatNumber(n, 8));
}

function dimEndingZeroes (n) {
  return n.replace(/(\.?0+)$/, '<span class="dim">$1</span>');
}