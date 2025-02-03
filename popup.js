document.addEventListener("DOMContentLoaded", function () {
  const codeSnippets = [
    { snippet: 
`<figure>
  <img src="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Placeholder_Image/Placeholder.png" alt="DESCRIBE THE IMAGE or Refer to transcript">
    <figcaption class="sm-font">CAPTION GOES HERE</figcaption>
    <p><a class="acuo-btn external" role="button" title="Transcript" href="URL of transcript page">Transcript</a></p>
</figure>`, iconClass: 'image', title: 'Image' },
    { snippet: 
`<div class="acuo_carousel">
  <figure><img src="https://loremflickr.com/1920/1080?random=1" />
    <figcaption>Caption goes here</figcaption>
  </figure>
  <figure><img src="https://loremflickr.com/1920/1080?random=2" />
    <figcaption>Caption goes here</figcaption>
  </figure>
  <figure><img src="https://loremflickr.com/1920/1080?random=3" />
    <figcaption>Caption goes here</figcaption>
  </figure>
</div>`, iconClass: 'photo_library', title: 'Image carousel'},
    { snippet: 
`<table class="acuo-table">
<caption class="sm-font">[caption]</caption>
<tbody>
  <tr>
    <th scope="col">Column 1</th>
    <th scope="col">Column 2</th>
    <th scope="col">Column 3</th>
  </tr>
  <tr>
    <td>
      <p>Cell information in list form or sentence form.</p>
    </td>
    <td>
      <p>Cell information in list form or sentence form.</p>
    </td>
    <td>
      <p>Cell information in list form or sentence form.</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>Cell information in list form or sentence form.</p>
    </td>
    <td>
      <p>Cell information in list form or sentence form.</p>
    </td>
    <td>
      <p>Cell information in list form or sentence form.</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>Cell information in list form or sentence form.</p>
    </td>
    <td>
      <p>Cell information in list form or sentence form.</p>
    </td>
    <td>
      <p>Cell information in list form or sentence form.</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>Cell information in list form or sentence form.</p>
    </td>
    <td>
      <p>Cell information in list form or sentence form.</p>
    </td>
    <td>
      <p>Cell information in list form or sentence form.</p>
    </td>
  </tr>
</tbody>
</table>`, iconClass: 'view_week', title: 'Table'},
    { snippet: 
`<table class="acuo-table">
<caption class="sm-font">[caption]</caption>
<tbody>
  <tr>
    <th>Column 1</th>
    <th>Column 2</th>
  </tr>
  <tr>
    <td>
      <p>This is text that relates to whatever the topic of Column 1 is.</p>
    </td>
    <td rowspan="2">
      <p>This text could be related to just the topic of Column 2, or could be a subtopic of Row 1 and 2 from Column 1.</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>This is text that relates to whatever the topic of Column 1 is.</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>This is text that relates to whatever the topic of Column 1 is.</p>
    </td>
    <td rowspan="2">
      <p>This text could be related to just the topic of Column 2, or could be a subtopic of Row 3 and 4 from Column 1.</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>This is text that relates to whatever the topic of Column 1 is.</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>This is text that relates to whatever the topic of Column 1 is.</p>
    </td>
    <td rowspan="2">
      <p>This text could be related to just the topic of Column 2, or could be a subtopic of Row 5 and 6 from Column 1.</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>This is text that relates to whatever the topic of Column 1 is.</p>
    </td>
  </tr>
</tbody>
</table>`, iconClass: 'view_quilt', title: 'Table, varying levels of text'},
    { snippet: 
`<div class="acuo_carousel">
<figure><!-- Replace this with an iframe from Echo -->
    <figcaption class="sm-font">Video title (Presenter's name, ACU Online, 2025)</figcaption>
</figure>
<figure><!-- Replace this with an iframe from Echo -->
    <figcaption class="sm-font">Video title (Presenter's name, ACU Online, 2025)</figcaption>
</figure>
<figure><!-- Replace this with an iframe from Echo -->
    <figcaption class="sm-font">Video title (Presenter's name, ACU Online, 2025)</figcaption>
</figure>
</div>`, iconClass: 'view_carousel', title: 'Echo360 carousel', color: '#78A75A'},
      { snippet: 
`<h2><img role="presentation" src="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-watch.svg" alt="" data-api-endpoint="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-watch.svg" data-api-returntype="File" /> Watch</h2>
<p>CONTENT</p>
<figure> 
	<!-- Replace this with an iframe from YouTube or other external player -->
	<figcaption class="sm-font">Video title (Author name, year)</figcaption>
</figure>`, iconClass: 'smart_display', title: 'YouTube or external vid', color: '#D16D6A'},
      { snippet:
`<div class="acuo_carousel">
<figure>
<!-- Replace this with an iframe from YouTube -->
  <figcaption class="sm-font">Video title (Author name, year)</figcaption>
</figure>

<figure>
<!-- Replace this with an iframe from YouTube -->
  <figcaption class="sm-font">Video title (Author name, year)</figcaption>
</figure>

<figure>
<!-- Replace this with an iframe from YouTube -->
  <figcaption class="sm-font">Video title (Author name, year)</figcaption>
</figure>
</div>`, iconClass: 'view_carousel', title: 'YouTube vid carousel', color: '#D16D6A'},
      { snippet:
`<div class="acuo_tab" data-tab-layout-type="top">
<div>Tab item 1</div>
  <div>
    <p>Item text as follows.</p>
  </div>
<div>Tab item 2</div>
  <div>
    <p>Item text as follows.</p>
  </div>
<div>Tab item 3</div>
  <div>
    <p>Item text as follows.</p>
  </div>
</div>`, iconClass: 'tab', title: 'Tabs'},
      { snippet:
`<div class="acuo_accordion">
<div>First Item</div>
  <div>
    <p>Item text as follows.</p>
  </div>
<div>Second Item</div>
  <div>
    <p>Item text as follows.</p>
  </div>
<div>Third Item</div>
  <div>
    <p>Item text as follows.</p>
  </div>
</div>`, iconClass: 'wysiwyg', title: 'Accordion'},
      { snippet: 
`<div class="acuo_click-reveal">
<div>Solution</div>
  <div>
    <p>Reveal content as follows. This is initially hidden.</p>
  </div>
</div>`, iconClass: 'preview', title: 'Click and reveal'},
      { snippet:
`<div class="acuo_quiz">
<!-- Start Question block -->
<div class="quiz">
<div class="question">Question 1 goes here</div>
  <ul class="answers">
  <li>*Answer 1</li>
  <li>Answer 2</li>
  <li>Answer 3</li>
  </ul>
<div class="feedback">Feedback goes here</div>
</div>
<!-- End Question block -->
<!-- Start Question block -->
<div class="quiz">
<div class="question">Question 2 goes here</div>
  <ul class="answers">
  <li>*Answer 1</li>
  <li>Answer 2</li>
  <li>Answer 3</li>
  </ul>
<div class="feedback">Feedback goes here</div>
</div>
<!-- End Question block -->
<!-- Start Question block -->
<div class="quiz">
<div class="question">Question 3 goes here</div>
  <ul class="answers">
  <li>*Answer 1</li>
  <li>Answer 2</li>
  <li>Answer 3</li>
  </ul>
<div class="feedback">Feedback goes here</div>
</div>
<!-- End Question block -->
</div>`, iconClass: 'quiz', title: 'Inline quiz'},
      { snippet: 
`<div class="yellow-border">
  <h2><img id="8323" src="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-activity.svg" alt="" data-api-endpoint="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-activity.svg" data-api-returntype="File"> Activity</h2>
  <p>This activity should take around <strong>20 minutes</strong> to complete.</p>
  <p><strong>Step 1: Lead</strong> with a verb and break steps into single actions.</p>
  <p><strong>Step 2: Lead</strong> with a verb and break steps into single actions.</p>
  <p><strong>Step 3: Lead</strong> with a verb and break steps into single actions.</p>
</div>`, src: "https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-activity.svg", title: 'Activity box'},
      { snippet:
`<div class="yellow-border">
  <h2><img role="presentation" src="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-takenote.svg" alt="" data-api-endpoint="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-takenote.svg" data-api-returntype="File" /> Take note</h2>
  <p>CONTENT</p>
</div>`, src: "https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-takenote.svg", title: 'Take note box'},
      { snippet:
`<div class="yellow-border">
  <h2><img role="presentation" src="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-tools.svg" alt="" data-api-endpoint="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-tools.svg" data-api-returntype="File" /> Tools</h2>
  <p>CONTENT</p>
</div>`, src: "https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-tools.svg", title: 'Tools box'},
      { snippet:
`<div class="yellow-border">
  <h2><img role="presentation" src="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-reflect.svg" alt="" data-api-endpoint="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-reflect.svg" data-api-returntype="File" /> Reflect</h2>
  <p>CONTENT</p>
</div>`, src: "https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-reflect.svg", title: 'Reflect box'},
      { snippet:
`<div class="yellow-border">
  <h2><img role="presentation" src="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-important.svg" alt="" data-api-endpoint="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-important.svg" data-api-returntype="File" /> Important</h2>
  <p>CONTENT</p>
</div>`, src: "https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-important.svg", title: 'Important box'},
      { snippet:
`<blockquote>
  <p>Content goes here...</p>
</blockquote>`, iconClass: 'format_align_right', title: 'Block quote'},
      { snippet:
`<blockquote class="pull">
  <p>Content goes here...</p>
</blockquote>`, iconClass: 'format_quote', title: 'Pull quote'},
      { snippet:
`<div class="essential-reading-well">
<h2> Essential readings and resources</h2>
  <p>Access your readings through the <span style="color: #e03e2d;">Reading list</span>, and online readings via links provided.</p>
  <p>The following readings XXX.</p>
    <ul>
      <li>Chapter X: Chapter title (pp. XX–XX) in <em>Book name&nbsp;</em>(Book author, year).</li>
</div>`, src: "https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-read.svg", title: 'Essential reading well', borderStyle: 'solid', borderColour: '#3C1053'},
      { snippet:
`<div class="optional-reading-well">
<h2>Optional readings and resources</h2>
  <p>Access your readings through the <span style="color: #e03e2d;">Reading list</span>, and online readings via links provided.</p>
  <p>The following readings will help you develop a deeper understanding of XXX.</p>
    <ul>
      <li>Chapter X: Chapter title (pp. XX–XX) in <em>Book name&nbsp;</em>(Book author, year).</li>
</div>`, src: "https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-read.svg", title: 'Optional reading well', borderStyle: 'solid', borderColour: '#F1BC1ECC'},
      { snippet:
`<p>View your Essential and Optional resources by selecting the relevant heading.</p> 
<div class="combo-reading-well"> 
	<div> 
		<h2>Essential readings and resources</h2> 
		<p>Access your readings through the <span style="color: #e03e2d;">Reading list</span>, and online readings via links provided.</p>
		<p>The following readings will help you develop a deeper understanding of XXX.</p>
		<ul>
		  <li>Chapter X: Chapter title (pp. XX–XX) in <em>Book name&nbsp;</em>(Book author, year).</li>
	</div> 
	<div> 
		<h2>Optional readings and resources</h2> 
		<p>Access your readings through the <span style="color: #e03e2d;">Reading list</span>, and online readings via links provided.</p>
		<p>The following readings will help you develop a deeper understanding of XXX.</p>
		<ul>
		  <li>Chapter X: Chapter title (pp. XX–XX) in <em>Book name&nbsp;</em>(Book author, year).</li>
	</div> 
</div>`, src: "https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-read.svg", title: 'Combo reading well', borderStyle: 'gradient'},
      { snippet:
`<div class="disclaimer-well">
  <h2>Content Disclaimer</h2>
  <p>This unit deals with topics related to <span style="background-color: #fbeeb8;"> ... </span> From time to time, this may create feelings of unease and discomfort. If at any time you feel you need support, please visit an appropriate support service. Additionally, be aware of ethics and social protocols about disclosing personal information in any discussion forum.</p>
</div>`, iconClass: 'breaking_news', title: 'Disclaimer well', borderStyle: 'solid', borderColour: '#f2120c'},
      { snippet:
`<div class="hanging-indent">
  INSERT APA7 REFERENCE HERE
</div>`, iconClass: 'format_indent_increase', title: 'APA7 hanging indent'},
      { snippet:
`<div class="yellow-border">
  <h3>HEADING 3</h3>
  <p>Content.</p>
</div>`, iconClass: 'square', color: '#F1BC1ECC', title: 'Yellow border box'},
      { snippet: '', title: ''},
      { snippet:
`<p style="text-align: center;"><a class="acuo-btn external" role="button" href="URL of transcript page">Transcript</a></p>`, iconClass: 'settings_accessibility', title: 'Transcript'
      },
      { snippet:
`XXX 

<hr /> 
  <p><span><strong>Navigate back to the main content by using your browser's back button.</strong>&nbsp;</span></p>`, iconClass: 'description', title: 'Transcript page'
      }

  ];

  const iconSnippets = [
    { snippet:
`<h2><img role="presentation" src="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-activity.svg" alt="" data-api-endpoint="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-activity.svg" data-api-returntype="File" /> Activity</h2>`, src: 'https://cei-dlc.acucontenthub.acu.edu.au/ShortCourses/Icons/icon-activity.svg', title: 'Activity icon' },
    { snippet: 
`<h2><img role="presentation" src="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-watch.svg" alt="" data-api-endpoint="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-watch.svg" data-api-returntype="File" /> Watch</h2>`,
src: 'https://cei-dlc.acucontenthub.acu.edu.au/ShortCourses/Icons/icon-watch.svg', title: 'Watch icon' },
    { snippet:
`<h2><img role="presentation" src="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-listen.svg" alt="" data-api-endpoint="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-listen.svg" data-api-returntype="File" /> Listen</h2>`, src: 'https://cei-dlc.acucontenthub.acu.edu.au/ShortCourses/Icons/icon-listen.svg', title: 'Listen icon' },
{ snippet:
  `<h2><img role="presentation" src="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-read.svg" alt="" data-api-endpoint="https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-read.svg" data-api-returntype="File" /> Read</h2>`, src: 'https://cei-dlc.acucontenthub.acu.edu.au/ShortCourses/Icons/icon-read.svg', title: 'Read icon' },
    { iconClass: 'remove', snippet: '–', title: 'en dash' }
  ];

  const codeSection = document.getElementById("code-snippet-list");
  const iconSection = document.getElementById("icon-snippet-list");

  // Create Code Snippets Buttons
  codeSnippets.forEach(snippet => {
    const button = document.createElement('button');
    button.title = snippet.title;
   
    if (snippet.snippet) {
      button.classList.add('snippet-button');
    } else if (snippet.snippet === '') {
      // If the snippet is blank, make it an invisible button (or empty)
      button.classList.add('blank-button');  // Use the same blank button styling
    }

    if (snippet.borderStyle === 'gradient') {
      button.style.border = "3px solid transparent";
      button.style.borderImage = "linear-gradient(45deg, #F1BC1ECC, #3C1053) 1";
    } else if (snippet.borderStyle === 'solid') {
      button.style.border = `3px solid ${snippet.borderColour}`;
    } else if (snippet.borderStyle === 'dashed') {
      button.style.border = "3px dashed #3C1053";
    }

    if (snippet.src) {
      // Image src
      button.innerHTML = `<img src="${snippet.src}" alt="${snippet.title}" />`; // Display image
    } else if (snippet.iconClass) {
      // Icon src
      button.innerHTML = `<span class="material-symbols-outlined" style="color: ${snippet.color}">${snippet.iconClass}</span>`;
    } 

    button.setAttribute('data-snippet', snippet.snippet);  // Set data-snippet attribute
    button.addEventListener('click', () => {
      console.log('Code Snippet:', snippet.snippet);
      copyToClipboard(snippet.snippet); // Copy the snippet when button is clicked
    });

    codeSection.appendChild(button);
  });

  // Create Icon Snippets Buttons
  iconSnippets.forEach(icon => {
    const button = document.createElement('button');
    button.classList.add('snippet-button');
    button.title = icon.title;

    if (icon.iconClass) {
      // Icon snippet (Materials)
      button.innerHTML = `<span class="material-symbols-outlined">${icon.iconClass}</span>`; // Display icon
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
