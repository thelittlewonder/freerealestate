chrome.storage.sync.set({
  isActive: false
});

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.storage.sync.get('isActive', function (data) {
    if (data.isActive === true) {
      console.log('Deactivated');
      chrome.storage.sync.set({
        isActive: false
      });
      chrome.browserAction.setIcon({
        path: {
          "16": "../../icons/inactive/icon16.png",
          "48": "../../icons/inactive/icon48.png",
          "128": "../../icons/inactive/icon128.png"
        }
      });
    } else if (data.isActive == false) {
      console.log('Activated');
      chrome.storage.sync.set({
        isActive: true
      });
      chrome.browserAction.setIcon({
        path: {
          "16": "../../icons/active/icon16.png",
          "48": "../../icons/active/icon48.png",
          "128": "../../icons/active/icon128.png"
        }
      });
    }
  });
});

//change icon on receiving message

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === "turnOff") {
    if (msg.value) {
      chrome.browserAction.setIcon({
        path: {
          "16": "../../icons/inactive/icon16.png",
          "48": "../../icons/inactive/icon48.png",
          "128": "../../icons/inactive/icon128.png"
        }
      });
    } else {
      chrome.browserAction.setIcon({
        path: {
          "16": "../../icons/active/icon16.png",
          "48": "../../icons/active/icon48.png",
          "128": "../../icons/active/icon128.png"
        }
      });
    }
  }
});