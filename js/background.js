// fired when message is received from content_script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.storage.local.get({ ticker: [] }, function(res) {
    if (sender.tab.title != undefined || sender.tab.title != "undefined") {
      let history = res.ticker == null ? [] : res.ticker;
      let found = false;

    // if the user has been on the same page since the last call increment the amount of time
    // instead of creating entry in array
    if (last != null && last.title == sender.tab.title) {
      history[history.length - 1].time += 5;
    } else {
      // end the last record
      if (last != null) {
        history[history.length - 1].end = now;
      }

      // add a new record now that the tab has changed
      history.push({
        title: sender.tab.title,
        url: sender.tab.url,
        icon: sender.tab.favIconUrl,
        start: now,
        end: null,
        time: 5
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
}, 24 * 60 * 60 * 1000);
