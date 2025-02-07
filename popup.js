document.addEventListener("DOMContentLoaded", async function() {
    const defaultView = document.getElementById("default-view");
    const customView = document.getElementById("custom-view");
    const defaultTab = document.getElementById("default-tab");
    const customTab = document.getElementById("custom-tab");
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("closeModal");
    const saveBtn = document.getElementById("save-btn");
    const codeSelect = document.getElementById("code-select");
    const userCode = document.getElementById("user-code");
    const resetCustomBtn = document.getElementById("reset-custom-btn");
    const refreshBtn = document.getElementById("refresh-btn");
    const altTextCheckbox = document.getElementById("altTextCheckbox");
    const codeSection = document.getElementById("code-snippet-list");
    const iconSection = document.getElementById("icon-snippet-list");
    let currentEditingButton = null;

    // Default code snippets (populate from HTML files)
const codeSnippets = [
    { 
        snippet: "snippets/image.html",
        iconClass: 'image',
        title: 'Image'
    },
    {
        snippet: "snippets/image-carousel.html",
        iconClass: 'photo_library',
        title: 'Image carousel'
    },
    {
        snippet: "snippets/table.html",
        iconClass: 'view_week',
        title: 'Table'
    },
    {
        snippet: "snippets/table-levels.html",
        iconClass: 'view_quilt',
        title: 'Table, varying levels of text'
    },
    
    {
        snippet: "snippets/echo360-carousel.html",
        iconClass: 'view_carousel',
        title: 'Echo360 carousel',
        color: '#78A75A'
    },
    {
        snippet: "snippets/youtube.html",
        iconClass: 'smart_display',
        title: 'YouTube or external vid',
        color: '#D16D6A'
    },
    {
        snippet: "snippets/youtube-carousel.html",
        iconClass: 'view_carousel',
        title: 'YouTube vid carousel',
        color: '#D16D6A'
    },
    {
        snippet: "snippets/tabs.html",
        iconClass: 'tab',
        title: 'Tabs'
    },
    {
        snippet: "snippets/accordion.html",
        iconClass: 'wysiwyg',
        title: 'Accordion'
    },
    {
        snippet: "snippets/click-reveal.html",
        iconClass: 'preview',
        title: 'Click and reveal'
    },
    {
        snippet: "snippets/quiz.html",
        iconClass: 'quiz',
        title: 'Inline quiz'
    },
    {
        snippet: "snippets/activity-box.html",
        src: "https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-activity.svg",
        title: 'Activity box'
    },
    {
        snippet: "snippets/take-note-box.html",
        src: "https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-takenote.svg",
        title: 'Take note box'
    },
    {
        snippet: "snippets/tools-box.html",
        src: "https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-tools.svg",
        title: 'Tools box'
    },
    {
        snippet: "snippets/reflect-box.html",
        src: "https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-reflect.svg",
        title: 'Reflect box'
    },
    {
        snippet: "snippets/important-box.html",
        src: "https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-important.svg",
        title: 'Important box'
    },
    {
        snippet: "snippets/block-quote.html",
        iconClass: 'format_align_right',
        title: 'Block quote'
    },
    {
        snippet: "snippets/pull-quote.html",
        iconClass: 'format_quote',
        title: 'Pull quote'
    },
    {
        snippet: "snippets/essential-reading.html",
        src: "https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-read.svg",
        title: 'Essential reading well',
        borderStyle: 'solid',
        borderColour: '#3C1053'
    },
    {
        snippet: "snippets/optional-reading.html",
        src: "https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-read.svg",
        title: 'Optional reading well',
        borderStyle: 'solid',
        borderColour: '#F1BC1ECC'
    },
    {
        snippet: "snippets/combo-reading.html",
        src: "https://cei-dlc.acucontenthub.acu.edu.au/unitcontent/SharedAssets/Icons/icon-read.svg",
        title: 'Combo reading well',
        borderStyle: 'gradient'
    },
    {
        snippet: "snippets/disclaimer.html",
        iconClass: 'breaking_news',
        title: 'Disclaimer well',
        borderStyle: 'solid',
        borderColour: '#f2120c'
    },
    {
        snippet: "snippets/hanging-indent.html",
        iconClass: 'format_indent_increase',
        title: 'APA7 hanging indent'
    },
    {
        snippet: "snippets/yellow-box.html",
        iconClass: 'square',
        color: '#F1BC1ECC',
        title: 'Yellow border box'
    },
    {
        snippet: '',
        title: ''
    },
    {
        snippet: "snippets/transcript.html",
        iconClass: 'settings_accessibility',
        title: 'Transcript'
    },
    {
        snippet: "snippets/transcript-page.html",
        iconClass: 'description',
        title: 'Transcript page'
    }
    
    ];
    
    const iconSnippets = [{
        snippet: "snippets/activity-icon.html",
        src: 'https://cei-dlc.acucontenthub.acu.edu.au/ShortCourses/Icons/icon-activity.svg',
        title: 'Activity icon'
    },
    {
        snippet: "snippets/watch-icon.html",
        src: 'https://cei-dlc.acucontenthub.acu.edu.au/ShortCourses/Icons/icon-watch.svg',
        title: 'Watch icon'
    },
    {
        snippet: "snippets/listen-icon.html",
        src: 'https://cei-dlc.acucontenthub.acu.edu.au/ShortCourses/Icons/icon-listen.svg',
        title: 'Listen icon'
    },
    {
        snippet: "snippets/read-icon.html",
        src: 'https://cei-dlc.acucontenthub.acu.edu.au/ShortCourses/Icons/icon-read.svg',
        title: 'Read icon'
    },
    {
        iconClass: 'remove',
        snippet: "snippets/en-dash.html",
        title: 'en dash'
    }
    ];

        // Initialize dropdown with code snippets
        function initializeCodeSelect() {
            codeSelect.innerHTML = '<option value="">Select a snippet...</option>';
            codeSnippets.forEach((snippet) => {
                if (snippet.snippet && snippet.title) {
                    const option = document.createElement('option');
                    option.value = JSON.stringify({
                        path: snippet.snippet,
                        title: snippet.title,
                        iconClass: snippet.iconClass,
                        src: snippet.src,
                        color: snippet.color
                    });
                    option.textContent = snippet.title;
                    codeSelect.appendChild(option);
                }
            });
        }
    
        // Handle code select change
        codeSelect.addEventListener('change', async () => {
            if (codeSelect.value) {
                const selectedData = JSON.parse(codeSelect.value);
                try {
                    const content = await fetchSnippetContent(selectedData.path);
                    userCode.value = content;
                    
                    // Store the metadata for the button
                    if (currentEditingButton) {
                        currentEditingButton.setAttribute('data-icon-class', selectedData.iconClass || '');
                        currentEditingButton.setAttribute('data-src', selectedData.src || '');
                        currentEditingButton.setAttribute('data-color', selectedData.color || '');
                    }
                } catch (error) {
                    console.error('Error loading snippet:', error);
                    userCode.value = '';
                }
            } else {
                userCode.value = '';
            }
        });
    
        // Initialize custom buttons
        function initializeCustomButtons() {
            const customSection = document.getElementById("custom-section");
            customSection.innerHTML = ''; // Clear existing buttons
            
            // Create grid of 28 buttons (4x7 grid)
            for (let i = 0; i < 28; i++) {
                const button = document.createElement('button');
                button.classList.add('custom-button');
                button.setAttribute('data-index', i);
                
                // Load saved content if exists
                const savedData = JSON.parse(localStorage.getItem(`customButton_${i}`) || '{}');
                if (savedData.content) {
                    button.setAttribute('data-snippet', savedData.content);
                    button.setAttribute('data-icon-class', savedData.iconClass || '');
                    button.setAttribute('data-src', savedData.src || '');
                    button.setAttribute('data-color', savedData.color || '');
                    
                    // Set button content (icon/image and label)
                    updateButtonAppearance(button, savedData.label, savedData.iconClass, savedData.src, savedData.color);
                } else {
                    button.textContent = 'Empty';
                }
                
                // Left click to copy
                button.addEventListener('click', (e) => {
                    if (e.button === 0) { // Left click
                        const snippet = button.getAttribute('data-snippet');
                        if (snippet) {
                            copyToClipboard(snippet);
                            // Show feedback
                            const originalText = button.innerHTML;
                            button.textContent = 'Copied!';
                            setTimeout(() => button.innerHTML = originalText, 1000);
                        }
                    }
                });
                
                // Right click to edit
                button.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    currentEditingButton = button;
                    openModal(button);
                });
                
                customSection.appendChild(button);
            }
        }
    
        // Update button appearance
        function updateButtonAppearance(button, label, iconClass, src, color) {
            let content = '';
            if (src) {
                content = `<img src="${src}" alt="${label}" style="width: 24px; height: 24px;"><br>`;
            } else if (iconClass) {
                content = `<span class="material-symbols-outlined" style="color: ${color || ''}">${iconClass}</span><br>`;
            }
            content += `<span class="button-label">${label}</span>`;
            button.innerHTML = content;
        }
    
        // Modal functions
        function openModal(button) {
            modal.style.display = 'flex';
            userCode.value = button.getAttribute('data-snippet') || '';
            
            // Set the dropdown if this matches a predefined snippet
            const options = Array.from(codeSelect.options);
            options.forEach(option => {
                if (option.value) {
                    const optionData = JSON.parse(option.value);
                    if (optionData.iconClass === button.getAttribute('data-icon-class') &&
                        optionData.src === button.getAttribute('data-src')) {
                        codeSelect.value = option.value;
                    }
                }
            });

            closeModal.onclick = () => {
                modal.style.display = 'none';
                currentEditingButton = null;
              }
        }
    
        // Save button functionality
        saveBtn.addEventListener('click', async () => {
            if (currentEditingButton) {
                const index = currentEditingButton.getAttribute('data-index');
                const content = userCode.value;
                
                if (content.trim()) {
                    const label = prompt('Enter button label:', 'Custom') || 'Custom';
                    let iconClass = '', src = '', color = '';
                    
                    // Get icon/image data either from dropdown or existing button
                    if (codeSelect.value) {
                        const selectedData = JSON.parse(codeSelect.value);
                        iconClass = selectedData.iconClass || '';
                        src = selectedData.src || '';
                        color = selectedData.color || '';
                    } else {
                        iconClass = currentEditingButton.getAttribute('data-icon-class') || '';
                        src = currentEditingButton.getAttribute('data-src') || '';
                        color = currentEditingButton.getAttribute('data-color') || '';
                    }
                    
                    // Save all data
                    const buttonData = {
                        content,
                        label,
                        iconClass,
                        src,
                        color
                    };
                    
                    localStorage.setItem(`customButton_${index}`, JSON.stringify(buttonData));
                    
                    // Update button
                    currentEditingButton.setAttribute('data-snippet', content);
                    currentEditingButton.setAttribute('data-icon-class', iconClass);
                    currentEditingButton.setAttribute('data-src', src);
                    currentEditingButton.setAttribute('data-color', color);
                    updateButtonAppearance(currentEditingButton, label, iconClass, src, color);
                } else {
                    // Handle empty content - reset button to empty state
                    localStorage.removeItem(`customButton_${index}`);
                    currentEditingButton.removeAttribute('data-snippet');
                    currentEditingButton.removeAttribute('data-icon-class');
                    currentEditingButton.removeAttribute('data-src');
                    currentEditingButton.removeAttribute('data-color');
                    currentEditingButton.textContent = 'Empty';
                }
                
                modal.style.display = 'none';
                currentEditingButton = null;
                userCode.value = '';
                codeSelect.value = '';
            }
        });
    
        // Reset custom buttons
        resetCustomBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all custom buttons?')) {
                for (let i = 0; i < 28; i++) {
                    localStorage.removeItem(`customButton_${i}`);
                }
                initializeCustomButtons();
            }
        });
    
    // Fix 1: Persist alt text checkbox state
    chrome.storage.local.get('showAltText', function(data) {
        altTextCheckbox.checked = data.showAltText || false;
    });

    altTextCheckbox.addEventListener('change', function() {
        const isChecked = this.checked;
        chrome.storage.local.set({ showAltText: isChecked });
        
        // Send message to background script
        chrome.runtime.sendMessage({
            action: isChecked ? 'showAltText' : 'hideAltText'
        });
    });


// Modified fetchSnippetContent function to handle both local and GitHub URLs
async function fetchSnippetContent(snippetPath) {
    try {
        const response = await fetch(snippetPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.text();
    } catch (error) {
        console.error('Error fetching snippet:', error);
        return '';
    }
}

// GitHub integration
async function fetchSnippetsFromGitHub(owner, repo, path) {
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter for HTML files and map to our snippet format
        return data
            .filter(file => file.name.endsWith('.html'))
            .map(file => ({
                snippet: file.download_url,
                title: file.name.replace('.html', '').split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' '),
                iconClass: 'description' // Default icon
            }));
    } catch (error) {
        console.error('Error fetching from GitHub:', error);
        throw error;
    }
}

// Enhanced refresh functionality
refreshBtn.addEventListener('click', async () => {
    try {
        refreshBtn.disabled = true;
        refreshBtn.textContent = 'Refreshing...';
        
        // GitHub repository details
        const owner = 'ness-byte';
        const repo = 'snippy';
        const snippetsPath = 'snippets';

        // Fetch new snippets from GitHub
        const githubSnippets = await fetchSnippetsFromGitHub(owner, repo, snippetsPath);
        
        // Update the codeSnippets array with new snippets
        // We'll create a map of existing snippets to avoid duplicates
        const existingSnippets = new Map(codeSnippets.map(s => [s.title, s]));
        
        githubSnippets.forEach(newSnippet => {
            existingSnippets.set(newSnippet.title, newSnippet);
        });
        
        // Convert back to array
        codeSnippets.length = 0; // Clear existing array
        codeSnippets.push(...Array.from(existingSnippets.values()));
        
        // Regenerate buttons and update dropdown
        await generateButtons();
        initializeCodeSelect();
        
        // Show success message
        refreshBtn.textContent = 'Updated!';
        setTimeout(() => {
            refreshBtn.textContent = 'Refresh Files';
            refreshBtn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Error refreshing snippets:', error);
        refreshBtn.textContent = 'Error!';
        setTimeout(() => {
            refreshBtn.textContent = 'Refresh Files';
            refreshBtn.disabled = false;
        }, 2000);
    }
});

    // Fix 2 & 3: Generate both code and icon buttons with proper click handling
    async function createButton(snippet, isIcon = false) {
        const button = document.createElement('button');
        button.classList.add('snippet-button');
        button.title = snippet.title;

        // Apply styles
        if (snippet.borderStyle === 'gradient') {
            button.style.border = "3px solid transparent";
            button.style.borderImage = "linear-gradient(45deg, #F1BC1ECC, #3C1053) 1";
        } else if (snippet.borderStyle === 'solid') {
            button.style.border = `3px solid ${snippet.borderColour}`;
        }

        // Set button content (icon or image)
        if (snippet.src) {
            button.innerHTML = `<img src="${snippet.src}" alt="${snippet.title}" />`;
        } else if (snippet.iconClass) {
            button.innerHTML = `<span class="material-symbols-outlined" style="color: ${snippet.color || ''}">${snippet.iconClass}</span>`;
        }

        // Fetch and set snippet content
        if (snippet.snippet) {
            try {
                const content = await fetchSnippetContent(snippet.snippet);
                button.setAttribute('data-snippet', content);
                
                // Add click handler for copying
                button.addEventListener('click', () => {
                    const snippetContent = button.getAttribute('data-snippet');
                    if (snippetContent) {
                        copyToClipboard(snippetContent);
                        // Optional: Show feedback to user
                        const originalTitle = button.title;
                        button.title = 'Copied!';
                        setTimeout(() => button.title = originalTitle, 1000);
                    }
                });
            } catch (error) {
                console.error('Error setting up button:', error);
            }
        }

        return button;
    }

    // Generate buttons
    async function generateButtons() {
        // Clear existing buttons
        codeSection.innerHTML = '';
        iconSection.innerHTML = '';

        // Generate code buttons
        for (const snippet of codeSnippets) {
            if (snippet.snippet) {
                const button = await createButton(snippet);
                codeSection.appendChild(button);
            }
        }

        // Generate icon buttons
        for (const icon of iconSnippets) {
            const button = await createButton(icon, true);
            iconSection.appendChild(button);
        }
    }

    // Fix 4: Tab navigation
    defaultTab.addEventListener('click', () => {
        defaultView.style.display = 'flex';
        customView.style.display = 'none';
        defaultTab.classList.add('active');
        customTab.classList.remove('active');
    });

    customTab.addEventListener('click', () => {
        defaultView.style.display = 'none';
        customView.style.display = 'flex';
        defaultTab.classList.remove('active');
        customTab.classList.add('active');
    });

    // Utility function to copy to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(err => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        });
    }

    // Initialize everything
    await generateButtons();
    initializeCustomButtons();
    initializeCodeSelect();
});

