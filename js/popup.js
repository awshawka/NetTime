chrome.storage.local.get({ ticker: [] }, function(res) {
  let history = res.ticker;
  let map = new Map();
  let arr = [];
  for (let i = 0; i < 24; i++) {
    arr.push("rgba(0, 122, 255, 0.6)");
  }

  return arr;
};

const shortenLink = title => {
  let str = new String(title);

  return str.length < 50 ? str : str.substr(0, 30) + " ...";
};

chrome.storage.local.get(["total_time"], function(res) {
  let time_count = res.total_time * 5;

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

chrome.storage.local.get({ hours: [] }, function(res) {
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "12 AM",
        "",
        "",
        "",
        "",
        "",
        "6 AM",
        "",
        "",
        "",
        "",
        "",
        "12 PM",
        "",
        "",
        "",
        "",
        "",
        "6 PM",
        "",
        "",
        "",
        "",
        ""
      ],
      datasets: [
        {
          data: res.hours,
          backgroundColor: generateBackgroundColor(),
          borderColor: generateBackgroundColor(),
          borderWidth: 1
        }
      ]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              min: 0,
              max: 60,
              stepSize: 10
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              maxRotation: 0,
              minRotation: 0
            }
          }
        ]
      }
    }
  });

  document.getElementsByClassName("wrapper")[0].innerHTML = html;
});
