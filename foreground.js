// Function to show alt text on images
function showAltText() {
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
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'showAltText') {
      showAltText();
  } else if (request.action === 'hideAltText') {
      hideAltText();
  }
});

// Check and apply the visibility of alt text on page load or refresh
chrome.storage.local.get('showAltText', function (data) {
  if (data.showAltText) {
    showAltText();
  } else {
    hideAltText();
  }
});
