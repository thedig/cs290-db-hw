(function(global, doc) {
  var localPath = global.location.href
                  .replace('http://', '')
                  .replace('https://', '')
                  .replace(global.location.host, '');
  doc.addEventListener("DOMContentLoaded", function(event) {
    if (localPath === '/') { getAll(); }
    var resetEl = document.getElementsByClassName('reset-button')[0];
    if (resetEl) {
      resetEl.addEventListener('click', function() {
        resetTable();
        clearAllRows();
      });
    }
    var getAllEl = document.getElementsByClassName('get-all-button')[0];
    if (getAllEl) {
      getAllEl.addEventListener('click', function() {
        clearAllRows();
        getAll();
      });
    }

    setupAddWorkout();
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
      populateWorkoutRows(response);
    } else {
      updateStatus(this.statusText);
      console.log("Error in network request: " + this.statusText);
    }
  }
}

function setupAddWorkout(){
  document.getElementById('insertWorkout').addEventListener('click', function(event){
    var weightType = document.querySelector('input[name = "type"]:checked').value;
    var lbType = (weightType === 'lb');
    var payload = {
      name: document.getElementById('workoutName').value,
      reps: document.getElementById('workoutReps').value,
      weight: document.getElementById('workoutWeight').value,
      lbs: lbType
    };
    var uri = '/insert';
    var req = new XMLHttpRequest();
    req.open('POST', uri, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', handlePostResponse.bind(req));
    req.send(JSON.stringify(payload));

    event.preventDefault();
  });
}

function handlePostResponse() {
  var response = JSON.parse(this.responseText);
  var statuscode = +parseInt(JSON.parse(this.status));

  if (statuscode >= 200 && statuscode < 400) {
    updateStatus(response.results);
    refreshTable();
  } else {
    updateStatus(this.statusText);
    console.log("Error in network request: " + this.statusText);
  }
}

function refreshTable() {
  clearAllRows();
  getAll();
}

function clearAllRows() {
  var rows = document.getElementsByClassName('entry-row');
  var len = rows.length;
  for (var i = len-1; i >= 0; --i) {
    rows[i].remove();
  }
}

function populateWorkoutRows(response) {
  var tableEl = document.getElementsByClassName('db-rows')[0];
  response.forEach(function(w) {
    console.log(w);
    var rowEl = document.createElement('tr');
    rowEl.className = "entry-row";
    ['id', 'name', 'reps', 'weight'].forEach(function(key) {
      var keyEl = document.createElement('td');
      if (key === 'weight' && w[key]) {
        var unit = (w['lbs'] === 1) ? 'lb.' : 'kg';
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
