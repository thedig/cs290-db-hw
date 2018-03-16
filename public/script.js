(function(global, doc) {
  var localPath = global.location.href
                  .replace('http://', '')
                  .replace('https://', '')
                  .replace(global.location.host, '');
  doc.addEventListener("DOMContentLoaded", function(event) {
    if (localPath === '/') {
      getAll();
      setupHomeButtons();
      setupAddWorkout();
    }
    if (localPath.includes('/edit/')) {
      var id = +localPath.replace('/edit/', '');
      setupEditWorkout(id);
    }

  });

})(window, document);

function setupEditWorkout(id) {
  getWorkout(id);

  document.getElementById('updateWorkout').addEventListener('click', function(event){
    var payload = {};

    var weightType = document.querySelector('input[name = "type"]:checked').value;
    var lbType = (weightType === 'lb');
    var payload = {
      id: id,
      name: document.getElementById('workoutName').value,
      reps: document.getElementById('workoutReps').value,
      weight: document.getElementById('workoutWeight').value,
      date: document.getElementById('workoutDate').value,
      lbs: lbType
    };

    var uri = '/update';
    var req = new XMLHttpRequest();
    req.open('PUT', uri, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', handlePutResponse.bind(req));
    req.send(JSON.stringify(payload));

    event.preventDefault();
  });
}

function getWorkout(id) {
  var uri = '/get?id=' + id;
  var req = new XMLHttpRequest();
  req.open('GET', uri, true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.addEventListener('load', handleGetResponse.bind(req));
  req.send(null);

  function handleGetResponse() {

    var response = JSON.parse(this.responseText);
    var statuscode = +parseInt(JSON.parse(this.status));
    if (statuscode >= 200 && statuscode < 400) {
      if (response.length) {
        var workout = response[0];
        document.getElementById('workoutName').value = workout.name;
        document.getElementById('workoutReps').value = workout.reps;
        document.getElementById('workoutWeight').value = workout.weight;
        document.getElementById('workoutDate').value = workout.date.substr(0, 10);
      }
      updateStatus("Got workout");
    } else {
      updateStatus(this.statusText);
      console.log("Error in network request: " + this.statusText);
    }

  }
}

function handlePutResponse() {
  var response = JSON.parse(this.responseText);
  var statuscode = +parseInt(JSON.parse(this.status));

  if (statuscode >= 200 && statuscode < 400) {
    updateStatus(response.results);
    window.location = '/';
  } else {
    updateStatus(this.statusText);
    console.log("Error in network request: " + this.statusText);
  }
}

function setupHomeButtons() {
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
}

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
      date: document.getElementById('workoutDate').value,
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
    var rowEl = document.createElement('tr');
    rowEl.className = "entry-row";
    appendEntryFields(rowEl, w);
    appendEdit(rowEl, w);
    appendDelete(rowEl, w);
    appendHidden(rowEl, w);

    tableEl.appendChild(rowEl);
  });
}

function appendHidden(rowEl, w) {
  var hiddenInput = document.createElement('input');
  hiddenInput.type = "hidden";
  hiddenInput.value = w['id'];
  rowEl.appendChild(hiddenInput);
}

function appendDelete(rowEl, w) {
  var deleteTd = document.createElement('td');
  rowEl.appendChild(deleteTd);
  var deleteButton = document.createElement('button');
  deleteButton.innerHTML = 'delete';
  deleteButton.value = w['id'];
  deleteTd.appendChild(deleteButton);

  deleteButton.addEventListener('click', function() {
    deleteWorkout(w['id']);
  });
}

function deleteWorkout(id) {
  var uri = '/workout/' + id;
  var req = new XMLHttpRequest();
  req.open('DELETE', uri, true);
  req.addEventListener('load', handleDeleteResponse.bind(req));
  req.send(null);

  function handleDeleteResponse() {
    refreshTable();
  }

}

function appendEdit(rowEl, w) {
  var editTd = document.createElement('td');
  rowEl.appendChild(editTd);
  var editButton = document.createElement('button');
  editButton.innerHTML = 'edit';
  editButton.value = w['id'];
  editTd.appendChild(editButton);

  editButton.addEventListener('click', function() {
    window.location = '/edit/' + w['id'];
  });
}

function appendEntryFields(rowEl, w) {
  ['name', 'reps', 'weight', 'date'].forEach(function(key) {
    var keyEl = document.createElement('td');
    if (key === 'weight' && w[key]) {
      var unit = (w['lbs'] === 1) ? 'lb.' : 'kg';
      keyEl.innerHTML = w[key] + ' ' + unit;
    } if (key === 'date' && w[key]) {
      keyEl.innerHTML = w[key].substr(0, 10);
    } else {
      keyEl.innerHTML = w[key];
    }
    rowEl.appendChild(keyEl);
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
