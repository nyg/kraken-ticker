function createRow (row) {
  
  var tr = document.createElement('tr'), td;
  
  for (var key in row) {
    td = document.createElement('td');
    td.innerHTML = row[key];
    tr.appendChild(td);
  }
  
  return tr;
}

function createRows (arrayOfRows) {
  return arrayOfRows.map(function (row) {
    return createRow(row);
  });
}

function setRowsToTable (rows, tableId) {
  
  var table = document.getElementById(tableId),
      header = document.getElementById('header');
  
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
  
  table.appendChild(header);
  
  for (var key in rows) {
    table.appendChild(rows[key]);
  }
}