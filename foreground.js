// Function to show alt text on images
function showAltText() {
  const images = document.querySelectorAll('img');

/*  images.forEach(img => {
    // Check if alt text element already exists
    let altTextElement = img.nextElementSibling;
    if (!altTextElement || !altTextElement.classList.contains('alt-text')) {
      altTextElement = document.createElement('span');
      altTextElement.classList.add('alt-text');
      // img.parentNode.insertBefore(altTextElement, img.nextSibling);  // Insert after the image
    }
*/

images.forEach((img) => {
  if (img.alt) {
    let altText = document.createElement('span');
    altText.className = 'alt-text';
    img.style.position = 'relative';
    altText.style.position = 'absolute';
    altText.style.top = '0';
    altText.style.left = '0';
    altText.style.padding = '2px 5px';
    altText.style.fontSize = '12px';
    altText.style.backgroundColor = 'rgba(255, 255, 0, 0.8)';
    altText.style.zIndex = 9999;
    altText.textContent = img.alt;
    img.parentNode.style.position = 'relative';
    img.parentNode.appendChild(altText);
  }
});

    // Set the alt text content
    altTextElement.textContent = img.alt || 'No alt text!';
    
    // Ensure alt text is visible
    altTextElement.style.display = 'block';
  };


// Function to hide alt text
function hideAltText() {
  const altTextElements = document.querySelectorAll('.alt-text');
  altTextElements.forEach(element => {
    element.style.display = 'none';
  });
}

// Listen for the message to toggle visibility of alt text
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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
