// Listen for alt text toggle messages
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'showAltText' || request.action === 'hideAltText') {
        // Send the message to all tabs
        chrome.tabs.query({}, function(tabs) {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, { action: request.action });
            });
        });
    }
});

// Initialize alt text state when extension loads
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.get('showAltText', function(data) {
      if (typeof data.showAltText === 'undefined') {
          chrome.storage.local.set({ showAltText: false });
      }
  });
});