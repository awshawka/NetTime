// sends a message to the background script
var sendMssg = function() {
  chrome.runtime.sendMessage({ name: "NetTimeTicker" });
};

// send a message every 30 seconds
// TODO: make this value configurable
var ticker = setInterval(sendMssg, 30000);

// keep ticking only if the tab is in focus
document.addEventListener(
  "visibilitychange",
  function() {
    if (document.visibilityState != "hidden") {
      // fired immediately to notify of tab change
      sendMssg();
      // re-start the ticker
      // TODO: make the delay value configurable
      ticker = setInterval(sendMssg, 30000);
    } else {
      // clear the timer
      clearInterval(ticker);
    }
  },
  false
);
