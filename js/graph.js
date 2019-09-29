export default function drawGraph(id) {
  var ctx = document.getElementById(id).getContext("2d");

  chrome.storage.local.get({ hours: [] }, function(res) {
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: generateLabels(),
        datasets: [
          {
            data: res.hours,
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
}

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
