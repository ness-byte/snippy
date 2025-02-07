// Listen for alt text toggle messages
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'showAltText' || request.action === 'hideAltText') {
      // Store the state in chrome storage
      chrome.storage.local.set({ 
          showAltText: request.action === 'showAltText'
      });

      // Send the action to the active tab
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          if (tabs[0]) {
              chrome.tabs.sendMessage(tabs[0].id, { 
                  action: request.action 
              });
          }
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