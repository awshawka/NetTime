// fired when message is received from content_script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.storage.local.get({ ticker: [] }, function(res) {
    let history = res.ticker;
    let last = history[history.length - 1];
    let now = new Date().getTime();

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

    chrome.storage.local.set({ ticker: history });
  });
});

// only used for testing purposes
setInterval(function() {
  chrome.storage.local.clear(function() {
    console.log("storage cleared");
  });
}, 24 * 60 * 60 * 1000);
