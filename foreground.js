// Function to check if current URL is a Canvas page
function isCanvasPage() {
  return window.location.href.includes('canvas.acu.edu.au');
}

// Function to show alt text on images
function showAltText() {
  // Only proceed if we're on a Canvas page
  if (!isCanvasPage()) return;
  
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
      // Only add alt text if it doesn't already exist
      if (!img.parentNode.querySelector('.alt-text')) {
          let altText = document.createElement('span');
          altText.className = 'alt-text';
          altText.style.cssText = `
              position: absolute;
              top: 0;
              left: 0;
              padding: 2px 5px;
              font-size: 12px;
              background-color: rgba(255, 255, 0, 0.8);
              z-index: 9999;
              pointer-events: none;
          `;
          altText.textContent = img.alt || 'No alt text';
          altText.style.display = 'block';
          
          // Ensure parent has relative positioning
          if (img.parentNode.style.position !== 'relative') {
              img.parentNode.style.position = 'relative';
          }
          
          img.parentNode.appendChild(altText);
      }
  })
}

// Function to hide alt text
function hideAltText() {
  const altTextElements = document.querySelectorAll('.alt-text');
  altTextElements.forEach(element => {
      element.remove();
  });
}

// Listen for the message to toggle visibility of alt text
browserAPI.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'showAltText') {
      showAltText();
      // For Chrome compatibility
      if (sendResponse) sendResponse({status: "completed"});
      // For Firefox compatibility
      return Promise.resolve({status: "completed"});
  } else if (request.action === 'hideAltText') {
      hideAltText();
      // For Chrome compatibility
      if (sendResponse) sendResponse({status: "completed"});
      // For Firefox compatibility
      return Promise.resolve({status: "completed"});
  }
});

// Check and apply the visibility of alt text on page load or refresh
try {
  // Promise-based approach for Firefox
  browserAPI.storage.local.get('showAltText').then(data => {
    if (data.showAltText) {
      showAltText();
    } else {
      hideAltText();
    }
  });
} catch (e) {
  // Callback-based approach for Chrome
  browserAPI.storage.local.get('showAltText', function (data) {
    if (data.showAltText) {
      showAltText();
    } else {
      hideAltText();
    }
  });
}
