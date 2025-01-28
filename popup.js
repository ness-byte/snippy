document.addEventListener("DOMContentLoaded", function () {
  const codeSnippets = [
    {snippet: 'https://cei-dlc.acucontenthub.acu.edu.au/ShortCourses/Icons/icon-activity.svg', src: 'icons/icon-activity.svg', title: 'Activity icon' },
    {snippet: 'https://cei-dlc.acucontenthub.acu.edu.au/ShortCourses/Icons/icon-watch.svg', src: 'icons/icon-watch.svg', title: 'Watch icon'},
    {snippet: 'https://cei-dlc.acucontenthub.acu.edu.au/ShortCourses/Icons/icon-listen.svg', src: 'icons/icon-listen.svg', title: 'Listen icon'},
    {snippet: '<figure><iframe src="<AZURE_URL>"></iframe><p><a class="acuo-btn external" title="Transcript" role="button" href="<TRANSCRIPT_URL>" data-api-endpoint="<TRANSCRIPT_URL>" data-api-returntype="Page">Transcript</a></p></figure>', iconClass: 'fas fa-cogs', title: 'Azure embed code'},
    // Add more code snippets here...
    {snippet: '<div class="example-code">Example Code 1</div>', title: 'Example Code 1'},
    {snippet: '<div class="example-code">Example Code 2</div>', title: 'Example Code 2'},
    {snippet: '<div class="example-code">Example Code 3</div>', title: 'Example Code 3'}
    // Add 18 more placeholder code snippets for testing
  ];

  const iconSnippets = [
    { src: 'icons/icon-activity.svg', snippet: 'https://cei-dlc.acucontenthub.acu.edu.au/ShortCourses/Icons/icon-activity.svg', title: 'Activity icon' },
    { src: 'icons/icon-watch.svg', snippet: 'https://cei-dlc.acucontenthub.acu.edu.au/ShortCourses/Icons/icon-watch.svg', title: 'Watch icon' },
    { src: 'icons/icon-listen.svg', snippet: 'https://cei-dlc.acucontenthub.acu.edu.au/ShortCourses/Icons/icon-listen.svg', title: 'Listen icon' },
    { iconClass: 'fas fa-arrow-right', snippet: 'cei-dlc.acucontenthub.acu.edu.au', title: 'Right arrow' },
    { iconClass: 'fas fa-arrow-left', snippet: 'https://example.com/left-arrow', title: 'Left arrow' },
    { iconClass: 'fas fa-sync', snippet: 'https://example.com/sync', title: 'Sync icon' }
  ];

  const codeSection = document.getElementById("code-snippet-list");
  const iconSection = document.getElementById("icon-snippet-list");

  // Create Code Snippets Buttons
  codeSnippets.forEach(snippet => {
    const button = document.createElement('button');
    button.classList.add('snippet-button');
    button.title = snippet.title;

    if (snippet.src) {
      // Image snippet
      button.innerHTML = `<img src="${snippet.src}" alt="${snippet.title}" />`; // Display image
    } else if (snippet.iconClass) {
      // Icon snippet
      button.innerHTML = `<i class="${snippet.iconClass}"></i>`; // Display FontAwesome icon
    }
    
    button.setAttribute('data-snippet', snippet.snippet);  // Set data-snippet attribute
    button.addEventListener('click', () => {
      console.log('Code Snippet:', snippet.snippet);
      copyToClipboard(snippet.snippet); // Copy the snippet when button is clicked
    });
    
    codeSection.appendChild(button);
  });

  // Create Icon Snippets Buttons with FontAwesome icons
  iconSnippets.forEach(icon => {
    const button = document.createElement('button');
    button.classList.add('snippet-button');
    button.title = icon.title;

    if (icon.iconClass) {
      // Icon snippet (FontAwesome)
      button.innerHTML = `<i class="${icon.iconClass}"></i>`; // Display icon
    } else if (icon.src) {
      button.innerHTML = `<img src="${icon.src}" alt="${icon.title}" />`; // Display image
    }
    
    button.setAttribute('data-snippet', icon.snippet);  // Set data-snippet to actual code snippet for icon buttons
    button.addEventListener('click', () => {
      console.log('Icon Snippet:', icon.snippet);
      copyToClipboard(icon.snippet); // Copy the corresponding snippet to clipboard
    });

    iconSection.appendChild(button);
  });
});

// Function to copy text to clipboard
function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

document.addEventListener("DOMContentLoaded", function() {
  const toggle = document.getElementById("altTextToggle");

  // Load the previous state of the alt text toggle
  chrome.storage.local.get('showAltText', function (data) {
    // Set the checkbox state based on saved value
    toggle.checked = data.showAltText || false;
  });

  // When the toggle is changed, update the state
  toggle.addEventListener("change", function () {
    const isChecked = toggle.checked;
    chrome.storage.local.set({ showAltText: isChecked });
  });
});
