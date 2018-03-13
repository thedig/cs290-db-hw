
(function(global, doc) {
  // var localPath = window.location.href
  //                   .replace('http://', '')
  //                   .replace('https://', '')
  //                   .replace(window.location.host, '');

  doc.addEventListener("DOMContentLoaded", function(event) {
    getAll();
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
  console.log('getting all');
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
    } else {
      updateStatus(this.statusText);
      console.log("Error in network request: " + this.statusText);
    }
  }
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
  statusEl.innerHTML = status;
}
