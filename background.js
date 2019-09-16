chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.storage.local.get({ ticker: [] }, function(res) {
    let history = res.ticker;
    let last = history[history.length - 1];
    let now = new Date().getTime();

    if (last != null && last.title == sender.tab.title) {
      history[history.length - 1].time += 5;
    } else {
      if (last != null) {
        history[history.length - 1].end = now;
      }

      history.push({
        title: sender.tab.title,
        url: sender.tab.url,
        icon: sender.tab.favIconUrl,
        start: now,
        end: null,
        time: 0
      });
    }

    chrome.storage.local.set({ ticker: history });
  });
});

chrome.tabs.onCreated.addListener(function() {
  chrome.storage.local.get({ ticker: [] }, function(res) {
    let history = res.ticker;
    let map = new Map();
    let arr = [];

    history.forEach(function(row) {
      if (map.has(row.title)) {
        let item = map.get(row.title);
        item.time += row.time;
        map.set(item.title, item);
      } else {
        map.set(row.title, row);
      }
    });

    map.forEach(function(key, val) {
      arr.push(map.get(val));
    });

    arr.sort(function(x, y) {
      if (x.time >= y.time) {
        return x;
      }

      return y;
    });

    let sorted = arr.slice(0, 10);
    localStorage.setItem("ticker", JSON.stringify(sorted));
  });
});

setInterval(function() {
  chrome.storage.local.clear(function() {
    console.log("storage cleared");
  });
}, 60000);
