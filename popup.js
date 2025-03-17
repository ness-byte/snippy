const GITHUB_API_HEADERS = {
    'Accept': 'application/vnd.github.v3+json'
};

const STORAGE_KEYS = {
    CACHE: 'snippets_cache',
    TIMESTAMP: 'snippets_timestamp',
    CUSTOM: 'button_customizations',
    ALT_TEXT: 'showAltText',
    API_COUNTER: 'api_call_counter'
};

const GITHUB_CONFIG = {
    owner: 'ness-byte',
    repo: 'snippy',
    snippetsPath: 'snippets',
    iconsPath: 'icons',
    baseUrl: 'https://api.github.com/repos'
};

// Cache duration - 24 hours in milliseconds
const CACHE_DURATION = 24 * 60 * 60 * 1000;

document.addEventListener("DOMContentLoaded", async function() {
    // Elements
    const elements = {
        codeView: document.getElementById("code-view"),
        iconsView: document.getElementById("icons-view"),
        searchView: document.getElementById("search-view"),
        codeTab: document.getElementById("code-tab"),
        iconsTab: document.getElementById("icons-tab"),
        searchTab: document.getElementById("search-tab"),
        searchInput: document.getElementById("search-input"),
        searchResults: document.getElementById("search-results"),
        codeGrid: document.getElementById("code-grid"),
        iconsGrid: document.getElementById("icons-grid"),
        modal: document.getElementById("modal"),
        closeModal: document.getElementById("closeModal"),
        buttonLabel: document.getElementById("button-label"),
        snippetCode: document.getElementById("snippet-code"),
        saveBtn: document.getElementById("save-btn"),
        resetBtn: document.getElementById("reset-btn"),
        refreshBtn: document.getElementById("refresh-btn"),
        resetCustomBtn: document.getElementById("reset-custom-btn"),
        notification: document.getElementById("notification"),
        altTextCheckbox: document.getElementById("altTextCheckbox"),
        colorOptions: document.querySelectorAll(".color-option")
    };

    let state = {
        snippets: [],
        currentEditingButton: null,
        currentSnippet: null,
        buttonSettings: {}
    };

    let selectedColor="#000000";

    elements.colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            elements.colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Store selected color
            selectedColor = option.dataset.color;
            
            // Update reset button state - check if only color is customized
            if (state.currentSnippet) {
                elements.resetBtn.disabled = !(
                    elements.buttonLabel.value !== state.currentSnippet.title || 
                    elements.snippetCode.value !== state.currentSnippet.content ||
                    selectedColor !== "#000000"
                );
            }
        });
    });

    function incrementApiCounter() {
        const counterElement = document.getElementById('api-count');
        const currentCount = parseInt(counterElement.textContent) || 0;
        counterElement.textContent = currentCount + 1;
        // Optionally persist the count
        //chrome.storage.local.set({ [STORAGE_KEYS.API_COUNTER]: currentCount + 1 });
    }
    
    function toSentenceCase(str) {
        // Convert dash-case to sentence case
        return str.split('-')
            .join(' ')
            // Capitalize first letter only
            .replace(/^\w/, c => c.toUpperCase());
    }
        // Load and cache button settings
        async function loadButtonSettings() {
            const result = await chrome.storage.local.get(STORAGE_KEYS.CUSTOM);
            state.buttonSettings = result[STORAGE_KEYS.CUSTOM] || {};
            return state.buttonSettings;
        }
    
        // Get current settings for a snippet
        function getSnippetSettings(snippetId) {
            return state.buttonSettings[snippetId] || null;
        }
    
        // Modal handling with proper state management
        function openEditModal(button, snippet) {
            state.currentEditingButton = button;
            state.currentSnippet = snippet;
            
            // Get current settings from state
            const currentSettings = getSnippetSettings(snippet.id) || {
                label: snippet.title,
                content: snippet.content,
                color: '#000000'
            };
            
            elements.modal.style.display = 'flex';
            elements.snippetCode.readOnly = false;
            elements.buttonLabel.value = currentSettings.label;
            elements.snippetCode.value = currentSettings.content;
            selectedColor = currentSettings.color || '#000000';
            
            elements.colorOptions.forEach(option => {
                option.classList.toggle('selected', option.dataset.color === selectedColor);
            });
            
            // Enable reset if customized
            elements.resetBtn.disabled = !(
                currentSettings.label !== snippet.title || 
                currentSettings.content !== snippet.content ||
                currentSettings.color !== '#000000'
            );
        }

    // Initialize alt text checkbox
    elements.altTextCheckbox.addEventListener('change', (e) => {
        const showAltText = e.target.checked;
        chrome.storage.local.set({ showAltText: showAltText });
/*         chrome.runtime.sendMessage({ 
            action: showAltText ? 'showAltText' : 'hideAltText'  
        }); */
    });

    // Load alt text preference
    async function loadAltTextPreference() {
        const result = await chrome.storage.local.get('showAltText');
        elements.altTextCheckbox.checked = result.showAltText || false;
    }

    // View switching
    function switchView(view) {
        const views = {
            code: elements.codeView,
            icons: elements.iconsView,
            search: elements.searchView
        };
        
        Object.entries(views).forEach(([key, element]) => {
            element.style.display = key === view ? 'flex' : 'none';
        });
        
        [elements.codeTab, elements.iconsTab, elements.searchTab].forEach(tab => {
            tab.classList.toggle('active', tab.id.startsWith(view));
        });
    }

    // Event Listeners for tabs
    elements.codeTab.addEventListener('click', () => switchView('code'));
    elements.iconsTab.addEventListener('click', () => switchView('icons'));
    elements.searchTab.addEventListener('click', () => switchView('search'));

    // Reset all custom buttons to default state
    elements.resetCustomBtn.addEventListener('click', async () => {
        try {
            state.buttonSettings = {};
            await chrome.storage.local.remove(STORAGE_KEYS.CUSTOM);
            await initializeButtons();
            showNotification('All buttons reset to default');
        } catch (error) {
            console.error('Reset all error:', error);
            showNotification('Failed to reset buttons', 'error');
        }
    });

        // Reset button handler
    elements.resetBtn.addEventListener('click', async () => {
        if (!state.currentSnippet) return;
        
        try {
            // Remove customization
            delete state.buttonSettings[state.currentSnippet.id];
            await chrome.storage.local.set({ 
                [STORAGE_KEYS.CUSTOM]: state.buttonSettings 
            });
            
            // Reset modal fields
            elements.buttonLabel.value = state.currentSnippet.title;
            elements.snippetCode.value = state.currentSnippet.content;
            selectedColor = '#000000';
            elements.colorOptions.forEach(option => {
                option.classList.toggle('selected', option.dataset.color === selectedColor);
            });
            
            // Reset button appearance
            if (state.currentSnippet.isIcon) {
                updateIconButton(state.currentEditingButton, state.currentSnippet, {
                    label: state.currentSnippet.title,
                    content: state.currentSnippet.content,
                    color: '#000000'
                });
            } else {
                state.currentEditingButton.textContent = state.currentSnippet.title;
                state.currentEditingButton.style.borderColor = '';
                state.currentEditingButton.style.borderWidth = '1px';
            }
            
            state.currentEditingButton.onclick = () => copySnippet(state.currentSnippet.content);
            elements.resetBtn.disabled = true;
            
            showNotification('Button reset to default');
        } catch (error) {
            console.error('Reset error:', error);
            showNotification('Failed to reset button', 'error');
        }
    });

    // Improved search with debouncing
    let searchTimeout;
    elements.searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = elements.searchInput.value.toLowerCase();
            elements.searchResults.innerHTML = '';

            if (!query) return;

            const results = state.snippets.filter(snippet =>
                snippet.title.toLowerCase().includes(query)
            );

            const ul = document.createElement('ul');
            ul.className = 'search-results-ul';
            
            const fragment = document.createDocumentFragment();
            results.forEach(snippet => {
                const li = document.createElement('li');
                li.className = 'search-result-item';
                li.textContent = snippet.title;
                li.addEventListener('click', () => copySnippet(snippet.content));
                fragment.appendChild(li);
            });
            
            ul.appendChild(fragment);
            elements.searchResults.appendChild(ul);
        }, 300); // Debounce delay
    });

    // Modal events
    elements.closeModal.onclick = () => {
        elements.modal.style.display = 'none';
        currentEditingButton = null;
    };

    // Enhanced save button handler
    async function saveButtonCustomization(snippetId, newSettings) {
        // Only store if different from defaults
        const snippet = state.snippets.find(s => s.id === snippetId);
        if (!snippet) return;

        if (newSettings.label === snippet.title && 
            newSettings.content === snippet.content &&
            newSettings.color === '#000000') {
            delete state.buttonSettings[snippetId];
        } else {
            state.buttonSettings[snippetId] = newSettings;
        }

        console.log('Saving button settings:', snippetId, newSettings);
        // Update storage
        await chrome.storage.local.set({ 
            [STORAGE_KEYS.CUSTOM]: state.buttonSettings 
        });

        return state.buttonSettings;
    }

    // Save button handler with improved state management
    elements.saveBtn.addEventListener('click', async () => {
        if (!state.currentSnippet) return;

        try {
            const newSettings = {
                label: elements.buttonLabel.value.trim(),
                content: elements.snippetCode.value,
                color: selectedColor
            };

            await saveButtonCustomization(state.currentSnippet.id, newSettings);
            
            // Update button appearance and behavior
            if (state.currentSnippet.isIcon) {
                updateIconButton(state.currentEditingButton, state.currentSnippet, newSettings);
            } else {
                state.currentEditingButton.textContent = newSettings.label;
                
                // Apply custom border color and width
                if (newSettings.color !== '#000000') {
                    state.currentEditingButton.style.borderColor = newSettings.color;
                    state.currentEditingButton.style.borderWidth = '2px'; // Thicker border
                } else {
                    state.currentEditingButton.style.borderColor = '';
                    state.currentEditingButton.style.borderWidth = '1px'; // Default width
                }
            }
            
            state.currentEditingButton.onclick = () => copySnippet(newSettings.content);
            
            elements.modal.style.display = 'none';
            showNotification('Button updated successfully');
        } catch (error) {
            console.error('Save error:', error);
            showNotification('Failed to save changes', 'error');
        }
    });

// Optimized snippet loading
async function loadSnippets(forceRefresh = false) {
    try {
        // Check cache first if not forcing refresh
        if (!forceRefresh) {
            const cached = await chrome.storage.local.get([STORAGE_KEYS.CACHE, STORAGE_KEYS.TIMESTAMP]);
            if (cached[STORAGE_KEYS.CACHE] && cached[STORAGE_KEYS.TIMESTAMP] && 
                (Date.now() - cached[STORAGE_KEYS.TIMESTAMP] < CACHE_DURATION)) {
                console.log('Using cached snippets');
                return cached[STORAGE_KEYS.CACHE];
            }
        }

        console.log('Fetching fresh snippets');
        const allFiles = await fetchRepositoryContents();
        
        // Filter relevant files and prepare batch requests
        const snippetFiles = allFiles.filter(file => 
            file.path.startsWith(GITHUB_CONFIG.snippetsPath) && 
            file.path.endsWith('.html')
        );

        // Batch content requests
        const batchSize = 10;
        const snippets = [];
        
        for (let i = 0; i < snippetFiles.length; i += batchSize) {
            const batch = snippetFiles.slice(i, i + batchSize);
            incrementApiCounter();
            
            const batchPromises = batch.map(async file => {
                const contentResponse = await fetch(file.url, { headers: GITHUB_API_HEADERS });
                if (!contentResponse.ok) throw new Error(`Failed to fetch content for ${file.path}`);
                
                const contentData = await contentResponse.json();
                const content = decodeURIComponent(escape(atob(contentData.content)));
                
                const fileName = file.path.split('/').pop();
                const isIcon = fileName.includes('icon');
                
                // Extract icon URL from the HTML content for icon files
                let iconUrl = null;
                if (isIcon) {
                    // Use DOMParser instead of creating a temporary element with innerHTML
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(content, 'text/html');
                    
                    // Try to find an img tag with src attribute
                    const imgTag = doc.querySelector('img');
                    if (imgTag && imgTag.getAttribute('src')) {
                        // Validate the URL before using it
                        const rawUrl = imgTag.getAttribute('src');
                        iconUrl = validateAndSanitizeUrl(rawUrl);
                    } else {
                        // Fallback: look for a URL pattern in the content
                        const urlMatch = content.match(/https?:\/\/[^\s"']+\.svg/i);
                        if (urlMatch) {
                            iconUrl = validateAndSanitizeUrl(urlMatch[0]);
                        } else {
                            // Last resort: use the GitHub raw URL
                            const defaultUrl = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/main/${GITHUB_CONFIG.iconsPath}/${fileName.replace('.html', '.svg')}`;
                            iconUrl = validateAndSanitizeUrl(defaultUrl);
                        }
                    }
                }
                
                return {
                    id: fileName.replace('.html', ''),
                    title: toSentenceCase(fileName.replace('.html', '')),
                    content,
                    isIcon,
                    iconUrl
                };
            });
            
            const batchResults = await Promise.all(batchPromises);
            snippets.push(...batchResults);
            
            // Add a small delay between batches to avoid rate limiting
            if (i + batchSize < snippetFiles.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // Cache the results
        await chrome.storage.local.set({
            [STORAGE_KEYS.CACHE]: snippets,
            [STORAGE_KEYS.TIMESTAMP]: Date.now()
        });

        return snippets;
    } catch (error) {
        console.error('Error loading snippets:', error);
        throw error;
    }
}

    // Helper function to update icon button appearance
    function updateIconButton(button, snippet, customSettings = null) {
        button.setAttribute('title', snippet.title);

        if (customSettings?.color && customSettings.color !== '#000000') {
            button.style.borderColor = customSettings.color;
            button.style.borderWidth = '2px';
        } else {
            button.style.borderColor = ''; // Reset to default
            button.style.borderWidth = '1px';
        }
        
        // Clear any existing content
        while (button.firstChild) {
            button.removeChild(button.firstChild);
        }
        
        if (customSettings?.label !== snippet.title) {
            // Only show label if it's been customized to something different
            const span = document.createElement('span');
            span.className = 'button-label';
            span.textContent = customSettings.label;
            button.appendChild(span);
        } else {
            // Show icon by default or if label matches original title
            const img = document.createElement('img');
            // Validate URL before using it for display
            img.src = validateAndSanitizeUrl(snippet.iconUrl) || 'default-icon.svg';
            img.alt = snippet.title;
            img.className = 'button-icon';
            button.appendChild(img);
        }
    }

    // Add a URL validation helper
    function validateAndSanitizeUrl(url) {
        if (!url) return '';
        
        try {
            const parsedUrl = new URL(url);
            // Only log warnings during fetch, but don't block
            const allowedDomains = [
                'raw.githubusercontent.com',
                'github.com',
                'githubusercontent.com',
                'cei-dlc.test.acucontenthub.acu.edu.au',
                'cei-dlc.acucontenthub.acu.edu.au',
                // Add other trusted domains here
            ];
            
            if (parsedUrl.protocol !== 'https:' || 
                !allowedDomains.some(domain => parsedUrl.hostname === domain || 
                                            parsedUrl.hostname.endsWith('.' + domain))) {
                console.warn('Potentially unsafe URL:', url);
                // Still return the URL but log a warning
            }
            return url;
        } catch (e) {
            console.error('Invalid URL:', url, e);
            return '';
        }
    }

    // Simplified notification system
    function showNotification(message, type = 'success') {
        elements.notification.textContent = message;
        elements.notification.className = `notification ${type}`;
        elements.notification.style.display = 'block';
        setTimeout(() => {
            elements.notification.style.display = 'none';
        }, 3000);
    }

    // Clipboard functionality
    async function copySnippet(content) {
        try {
            await navigator.clipboard.writeText(content);
            showNotification('Copied to clipboard!');
        } catch (error) {
            console.error('Copy failed:', error);
            showNotification('Failed to copy', 'error');
        }
    }

    // Optimized button initialization
    async function initializeButtons() {
        try {
            if (!state.snippets.length) {
                // Create DOM elements instead of setting innerHTML directly
                const noSnippetsDiv = document.createElement('div');
                noSnippetsDiv.className = 'no-snippets';
                noSnippetsDiv.textContent = 'No snippets available';
                
                // Clear existing content
                elements.codeGrid.innerHTML = '';
                elements.iconsGrid.innerHTML = '';
                
                // Append the new elements
                elements.codeGrid.appendChild(noSnippetsDiv.cloneNode(true));
                elements.iconsGrid.appendChild(noSnippetsDiv.cloneNode(true));
                return;
            }
    
            // Clear existing content
            elements.codeGrid.innerHTML = '';
            elements.iconsGrid.innerHTML = '';
            
            const fragment = document.createDocumentFragment();
            const iconFragment = document.createDocumentFragment();
            
            state.snippets.forEach(snippet => {
                const button = document.createElement('button');
                button.dataset.snippetId = snippet.id;
                button.className = snippet.isIcon ? 'icon-button' : 'code-button';
                
                const customSettings = getSnippetSettings(snippet.id) || {
                    label: snippet.title,
                    content: snippet.content,
                    color: '#000000'
                };
            
                if (customSettings.color && customSettings.color !== '#000000') {
                    button.style.borderColor = customSettings.color;
                    button.style.borderWidth = '2px';
                } else {
                    button.style.borderWidth = '1px';
                }

                
                if (snippet.isIcon) {
                    // Use the safer updateIconButton function
                    updateIconButton(button, snippet, customSettings);
                    iconFragment.appendChild(button);
                } else {
                    // Use textContent instead of setting innerHTML
                    button.textContent = customSettings.label;
                    fragment.appendChild(button);
                }
                
                // Set event handlers
                button.onclick = () => copySnippet(customSettings.content);
                button.oncontextmenu = (e) => {
                    e.preventDefault();
                    openEditModal(button, snippet);
                };
            });
            
            elements.codeGrid.appendChild(fragment);
            elements.iconsGrid.appendChild(iconFragment);
        } catch (error) {
            console.error('Initialise buttons error:', error);
            showNotification('Failed to initialise buttons', 'error');
        }
    }

    async function fetchRepositoryContents() {
        try {
            incrementApiCounter();
            const response = await fetch(
                `${GITHUB_CONFIG.baseUrl}/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/git/trees/main?recursive=1`,
                { headers: GITHUB_API_HEADERS }
            );
    
            if (!response.ok) {
                if (response.status === 403) {
                    const rateLimitResponse = await fetch('https://api.github.com/rate_limit');
                    const rateLimit = await rateLimitResponse.json();
                    const resetTime = new Date(rateLimit.resources.core.reset * 1000);
                    throw new Error(`Rate limit exceeded. Resets at ${resetTime.toLocaleTimeString()}`);
                }
                throw new Error(`GitHub API error: ${response.status}`);
            }
    
            const data = await response.json();
            return data.tree;
        } catch (error) {
            console.error('Error fetching repository contents:', error);
            throw error;
        }
    }

    // Refresh button handler
    elements.refreshBtn.addEventListener('click', async () => {
        try {
            elements.refreshBtn.disabled = true;
            elements.refreshBtn.classList.add('loading');
            
            const customizations = await chrome.storage.local.get(STORAGE_KEYS.CUSTOM);
            await chrome.storage.local.remove([STORAGE_KEYS.CACHE, STORAGE_KEYS.TIMESTAMP]);
            
            state.snippets = await loadSnippets(true);
            await initializeButtons(customizations[STORAGE_KEYS.CUSTOM]);
            
            showNotification('Snippets refreshed successfully!');
        } catch (error) {
            console.error('Refresh error:', error);
            if (error.message.includes('Rate limit exceeded')) {
                showNotification(error.message, 'error');
            } else {
                showNotification('Failed to refresh snippets. Please try again later.', 'error');
            }
        } finally {
            elements.refreshBtn.disabled = false;
            elements.refreshBtn.classList.remove('loading');
        }
    });

    // Initialize
    async function initialize() {
        try {
            // Load saved API counter
            const counter = await chrome.storage.local.get(STORAGE_KEYS.API_COUNTER);
            document.getElementById('api-count').textContent = counter[STORAGE_KEYS.API_COUNTER] || 0;
            
            await Promise.all([
                loadAltTextPreference(),
                loadButtonSettings(),
                (async () => {
                    state.snippets = await loadSnippets();
                    await initializeButtons();
                })()
            ]);
        } catch (error) {
            console.error('Initialization error:', error);
            showNotification('Failed to initialise extension', 'error');
        }
    }

    initialize();
});