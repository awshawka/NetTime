let history = JSON.parse(localStorage.getItem("ticker"));
let labels = [];
let data = [];

history.forEach(function(item) {
  labels.push(item.title);
  data.push(item.time);
});

var ctx = document.getElementById("bar-chart").getContext("2d");
var myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Time in seconds",
        data: data,
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 1
      }
    ]
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }
});
