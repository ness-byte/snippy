// Toggle alt text visibility on images
chrome.storage.local.get('checkboxState', function (data) {
  const altTextVisible = data.checkboxState;

  // Find all images on the page and toggle their alt text visibility
  document.querySelectorAll('img').forEach(function (img) {
    img.title = altTextVisible ? img.alt : '';
  });
});

// Insert the code snippets when a button is clicked (this is just an example)
document.addEventListener('click', function (e) {
  if (e.target && e.target.matches('.snippet-button')) {
    const snippet = e.target.getAttribute('data-snippet');
    document.activeElement.value += snippet;  // Paste the snippet into the active field
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'showAltText' || request.action === 'hideAltText') {
    // Store the state in chrome storage
    chrome.storage.local.set({ showAltText: request.action === 'showAltText' });

    // Send the action to the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: request.action });
    });
  }
});
