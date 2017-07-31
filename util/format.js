/*
For formatNumber function only.

Copyright (c) 2012 Tai-Jin Lee http://www.taijinlee.com

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
function formatNumber(number, decimals, decPoint, thousandsSep) {

    decimals = isNaN(decimals) ? 2 : Math.abs(decimals)
    decPoint = (decPoint === undefined) ? '.' : decPoint
    thousandsSep = (thousandsSep === undefined) ? ',' : thousandsSep

    var sign = number < 0 ? '-' : ''
    number = Math.abs(+number || 0)

    var intPart = parseInt(number.toFixed(decimals), 10) + '',
        j = intPart.length > 3 ? intPart.length % 3 : 0

    return sign + (j ? intPart.substr(0, j) + thousandsSep : '') + intPart.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep) + (decimals ? decPoint + Math.abs(number - intPart).toFixed(decimals).slice(2) : '')
}

function assetPair(s) {
    return s.replace(/[XZ]([A-Z]{3})[XZ]([A-Z]{3})/g, '$1/$2')
}

function ccy(number, decimals) {
    return dimEndingZeroes(formatNumber(number, decimals === undefined ? 5 : decimals))
}

function dimEndingZeroes(n) {
    return n.replace(/(\.?0+)$/, '<span class="dim">$1</span>')
}
