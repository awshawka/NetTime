const today = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "September",
    "October",
    "November",
    "December"
  ];
  const date = new Date();
  return (
    "Today, " +
    date.getDate() +
    " " +
    months[date.getMonth() - 1] +
    " " +
    date.getFullYear()
  );
};

const roundTime = seconds => {
  if (seconds === NaN) return "";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);

  if (hours > 0) {
    return hours + " h " + minutes + " min.";
  } else if (minutes > 0) {
    return minutes + " min.";
  } else {
    return seconds + " sec.";
  }
};

const timePercentage = (elem, total) => {
  const percentage = (elem.count * 5) / total;
  return Math.floor(250 * percentage);
};

const generateBackgroundColor = () => {
  let arr = [];
  for (let i = 0; i < 23; i++) {
    arr.push("rgba(0, 122, 255, 1)");
  }
};
chrome.storage.local.get(["total_time"], function(res) {
  let time_count = res.total_time * 5;

  chrome.storage.local.get({ ticker: [] }, function(res) {
    let countMap = res.ticker;

    countMap.sort((a, b) => {
      if (a.count < b.count) {
        return 1;
      } else if (a.count == b.count) {
        return 0;
      } else {
        return -1;
      }
    });

    let items = "";
    countMap.forEach(element => {
      items +=
        "<div class='info'>" +
        "<img src='" +
        element.icon +
        "' class='icon' />" +
        "<div class='info-data'>" +
        "<span class='web-title'>" +
        element.title +
        "</span>" +
        "<div class='time'>" +
        "<div class='time-bar' style='width:" +
        timePercentage(element, time_count) +
        "px'></div>" +
        "<span class='time-data'>" +
        roundTime(element.count * 5) +
        "</span>" +
        "</div>" +
        "<div class='bottom-border'></div>" +
        "</div>" +
        "</div>";
    });

    document.getElementsByClassName("total-time")[0].innerHTML = roundTime(
      time_count
    );

    document.getElementById("date").innerHTML = today();
    document.getElementById("used").innerHTML = items;
  });
});
var ctx = document.getElementById("chart").getContext("2d");

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
              beginAtZero: true
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
});
