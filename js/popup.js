chrome.storage.local.get({ ticker: [] }, function(res) {
  let history = res.ticker;
  let map = new Map();
  let arr = [];

  console.log(history);

  // create a hashmap based on each title - this accumulates time from all sessions
  history.forEach(function(row) {
    if (map.has(row.title)) {
      let item = map.get(row.title);
      item.time += row.time;
      map.set(item.title, item);
    } else {
      map.set(row.title, row);
    }
  });

  // convert to array sort the top 5 based on time
  map.forEach(function(key, val) {
    arr.push(map.get(val));
  });

  arr.sort(function(x, y) {
    if (x.time >= y.time) {
      return x;
    }

    return y;
  });

  let sorted = arr.slice(0, 5);
  let html = "";

  sorted.forEach(function(key, val) {
    html += '<div class="info">';
    html += '<img src="' + key.icon + '" width="20px" />';
    html += '<span class="time">' + key.time + " s" + "</span>";
    html += "</div>";
  });

  document.getElementsByClassName("wrapper")[0].innerHTML = html;
});
