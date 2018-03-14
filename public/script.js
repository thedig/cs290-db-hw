(function(global, doc) {
  var localPath = global.location.href
                  .replace('http://', '')
                  .replace('https://', '')
                  .replace(global.location.host, '');
  doc.addEventListener("DOMContentLoaded", function(event) {
    if (localPath === '/') { getAll(); }
    var resetEl = document.getElementsByClassName('reset-button')[0];
    if (resetEl) {
      resetEl.addEventListener('click', resetTable);
    }
    var getAllEl = document.getElementsByClassName('get-all-button')[0];
    if (getAllEl) {
      getAllEl.addEventListener('click', getAll);
    }
  });

})(window, document);

function getAll() {
  var uri = '/get-all';
  var req = new XMLHttpRequest();
  req.open('GET', uri, true);
  req.addEventListener('load', handleGetResponse.bind(req));
  req.send(null);

  function handleGetResponse(res) {
    var response = JSON.parse(this.responseText);
    var statuscode = +parseInt(JSON.parse(this.status));
    if (statuscode >= 200 && statuscode < 400) {
      updateStatus('Get all Success');
      populateWorkoutRows(response);
    } else {
      updateStatus(this.statusText);
      console.log("Error in network request: " + this.statusText);
    }
  }
}

function populateWorkoutRows(response) {
  var tableEl = document.getElementsByClassName('db-rows')[0];
  response.forEach(function(w) {
    var rowEl = document.createElement('tr');
    ['id', 'name', 'reps', 'weight'].forEach(function(key) {
      var keyEl = document.createElement('td');
      if (key === 'weight' && w[key]) {
        var unit = w['lb'] ? 'lb.' : 'kg';
        keyEl.innerHTML = w[key] + ' ' + unit;
      } else {
        keyEl.innerHTML = w[key];
      }
      rowEl.appendChild(keyEl);
    });

    tableEl.appendChild(rowEl);
  });
}

function resetTable() {
  var uri = '/reset-table';
  var req = new XMLHttpRequest();
  req.open('GET', uri, true);
  req.addEventListener('load', handleGetResponse.bind(req));
  req.send(null);

  function handleGetResponse(res) {
    var response = JSON.parse(this.responseText);
    var statuscode = +parseInt(JSON.parse(this.status));
    if (statuscode >= 200 && statuscode < 400) {
      updateStatus(response.results);
    } else {
      updateStatus(this.statusText);
      console.log("Error in network request: " + this.statusText);
    }
  }
}

function updateStatus(status) {
  var statusEl = document.getElementsByClassName('transaction-status')[0];
  if (statusEl) { statusEl.innerHTML = status; }
}
