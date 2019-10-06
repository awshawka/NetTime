const date = new Date();

// fired when message is received from content_script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.name != "NetTimeTicker") {
    return;
  }

  // update the hits - this shows the number of hits per hour
  chrome.storage.local.get({ hits: [] }, function(res) {
    let hits = res.hits == null ? [] : res.hits;
    let found = false;

    // sorted it by the title - increment if same title
    for (let i = 0; i < hits.length; i++) {
      if (hits[i].title == sender.tab.title) {
        // increment the number of hits on the site
        hits[i].count += 1;
        found = true;
        break;
      }
    }

    // since title wasn't found add it
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

    // initialize the array
    if (timeSpent.length == 0) {
      for (let i = 0; i < 24; i++) {
        timeSpent.push(0);
      }
    }

    // increment the count for the hour
    timeSpent[date.getHours()] += 1;
    chrome.storage.local.set({ hitsPerHour: timeSpent });
  });

  // update the total number of hits
  chrome.storage.local.get(["total_hits"], function(time) {
    chrome.storage.local.set({
      total_hits: time.total_hits == null ? 1 : time.total_hits + 1
    });
  });

  // update the last update time
  chrome.storage.local.get(["last_update"], function(update) {
    let lastUpdate = new Date().setUTCMilliseconds(
      update.last_update == null
        ? date.getUTCMilliseconds()
        : parseInt(update.lastUpdate)
    );

    // if saved on different days then clear it
    if (lastUpdate.getDay() != date.getDay()) {
      chrome.storage.local.clear(() => {
        console.log("storage cleared");
      });
    }

    // set the last updated time
    chrome.storage.local.set({ last_update: date.getUTCMilliseconds() });
  });
});
