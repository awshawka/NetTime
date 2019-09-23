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

    chrome.storage.local.set({ ticker: history });
    chrome.storage.local.get(["total_time"], function(time) {
      chrome.storage.local.set({
        total_time: time.total_time == null ? 1 : time.total_time + 1
      });
    });
  });
});

// only used for testing purposes
// setInterval(function() {
//   chrome.storage.local.clear(function() {
//     console.log("storage cleared");
//   });
// }, 1000);
