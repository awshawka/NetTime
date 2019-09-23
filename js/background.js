// fired when message is received from content_script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.storage.local.get({ ticker: [] }, function(res) {
    let history = res.ticker == null ? [] : res.ticker;
    let found = false;

    for (let i = 0; i < history.length; i++) {
      if (history[i].icon == sender.tab.favIconUrl) {
        history[i].count += 1;
        found = true;
        break;
      }
    }

    if (!found) {
      history.push({
        title: sender.tab.title,
        icon: sender.tab.favIconUrl,
        count: 1
      });
    }
  });

  chrome.storage.local.get({ hours: [] }, function(res) {
    let timeSpent = res.hours == null ? [] : res.hours;

    // increment the count for the hour
    if (timeSpent.length == 0) {
      for (let i = 0; i < 24; i++) {
        timeSpent.push(0);
      }
    } else {
      timeSpent[new Date().getHours()] += 5 / 60;
    }

    chrome.storage.local.set({ ticker: history });
    chrome.storage.local.get(["total_time"], function(time) {
      chrome.storage.local.set({
        total_time: time.total_time == null ? 1 : time.total_time + 1
      });
    });
  });

  let date = new Date();

  if (date.getHours() == 0 && date.getSeconds() <= 10) {
    chrome.storage.local.clear(function() {
      console.log("storage cleared");
    });
  }
});

// only used for testing purposes
setInterval(function() {
  chrome.storage.local.clear(function() {
    console.log("storage cleared");
  });
}, 100000);
