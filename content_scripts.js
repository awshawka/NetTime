// sends a message to the background script
var sendMssg = function() {
  console.log("sending mssg");
  chrome.runtime.sendMessage({ name: "netTimeTicker" });
};

// this is fired upon page load
sendMssg();
var ticker = setInterval(sendMssg, 5000);

// keep ticking only if the tab is in focus
document.addEventListener(
  "visibilitychange",
  function() {
    if (document.visibilityState != "hidden") {
      // fired immediately to notify of tab change
      sendMssg();
      // re-start the ticker
      // TODO: make the delay value configurable
      ticker = setInterval(sendMssg, 5000);
    } else {
      // clear the timer
      clearInterval(ticker);
    }
  },
  false
);
