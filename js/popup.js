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
  const hours = Math.round(seconds / 3600);
  const minutes = Math.round((seconds - hours * 3600) / 60);

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
  console.log(percentage);
  return Math.round(250 * percentage);
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

    console.log(items);

    document.getElementsByClassName("total-time")[0].innerHTML = roundTime(
      time_count
    );

    document.getElementById("date").innerHTML = today();
    document.getElementById("used").innerHTML = items;
  });
});
