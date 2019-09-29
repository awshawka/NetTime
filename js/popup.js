chrome.storage.local.get(["total_hits"], function(res) {
  // each hit = 30 seconds hence multiply
  let time_count = res.total_hits;

  chrome.storage.local.get({ hits: [] }, function(res) {
    let items = "";
    let countMap = res.hits.sort((a, b) => {
      if (a.count < b.count) {
        return 1;
      } else if (a.count == b.count) {
        return 0;
      } else {
        return -1;
      }
    });

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
        timePercentage(element.count * 30, time_count * 30) +
        "px'></div>" +
        "<span class='time-data'>" +
        roundTime(element.count) +
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
    drawGraph("chart");
  });
});

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

const roundTime = count => {
  if (count === NaN || count == null) return "";

  const seconds = count * 30;
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
  console.log(elem);
  console.log(total);
  const percentage = elem / total;
  console.log(percentage);
  return Math.floor(250 * percentage);
};

const drawGraph = id => {
  var ctx = document.getElementById(id).getContext("2d");

  chrome.storage.local.get({ hitsPerHour: [] }, function(res) {
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: generateLabels(),
        datasets: [
          {
            data: formatHours(res.hitsPerHour),
            backgroundColor: generateBackgroundColor(),
            borderColor: generateBackgroundColor()
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
                steps: 10
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
};

const formatHours = hits => {
  const minutes = hits.map(val => {
    return Math.round(val * 0.5);
  });

  return minutes;
};

const generateBackgroundColor = () => {
  let arr = [];
  for (let i = 0; i < 23; i++) {
    arr.push("rgba(0, 122, 255, 0.6)");
  }
  return arr;
};

const generateLabels = () => {
  return [
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
  ];
};
