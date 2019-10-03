const date = new Date();

// fired when message is received from content_script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // update the hits
  chrome.storage.local.get({ hits: [] }, function(res) {
    let hits = res.hits == null ? [] : res.hits;
    let found = false;

    // sort it by the title
    for (let i = 0; i < hits.length; i++) {
      if (hits[i].title == sender.tab.title) {
        // increment the number of hits on the site
        hits[i].count += 1;
        found = true;
        break;
      }
    }

    if (!found) {
      hits.push({
        title: sender.tab.title,
        icon: sender.tab.favIconUrl,
        count: 1
      });
    }

    chrome.storage.local.set({ hits: hits });
  });

  // update hits per hour
  chrome.storage.local.get({ hitsPerHour: [] }, function(res) {
    let timeSpent = res.hitsPerHour == null ? [] : res.hitsPerHour;

    // increment the count for the hour
    if (timeSpent.length == 0) {
      // initialize the array
      for (let i = 0; i < 24; i++) {
        timeSpent.push(0);
      }
    } else {
      timeSpent[new Date().getHours()] += 1;
    }

    chrome.storage.local.set({ hitsPerHour: timeSpent });
  });

  // update the total number of hits
  chrome.storage.local.get(["total_hits"], function(time) {
    chrome.storage.local.set({
      total_hits: time.total_hits == null ? 1 : time.total_hits + 1
    });
  });
});

chrome.alarms.create("clearData", {
  when:
    date.getUTCMilliseconds() +
    (new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1) - date)
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name == "clearData") {
    chrome.storage.local.clear(function() {
      console.debug("storage cleared");
    });
  }
});
