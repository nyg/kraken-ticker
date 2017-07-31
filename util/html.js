function createRow(row) {

    var tr = document.createElement('tr'),
        td

    for (var key in row) {
        td = document.createElement('td')
        td.innerHTML = row[key]
        tr.appendChild(td)
    }

    return tr
}

function createRows(arrayOfRows) {
    return arrayOfRows.map(function(row) {
        return createRow(row)
    })
}

function setRowsToTable(rows, tableId) {

    var table = document.getElementById(tableId),
        header1 = document.getElementById('header-1'),
        header2 = document.getElementById('header-2')

    while (table.firstChild) {
        table.removeChild(table.firstChild)
    }

    table.appendChild(header1)
    table.appendChild(header2)

    for (var key in rows) {
        table.appendChild(rows[key])
    }
}
