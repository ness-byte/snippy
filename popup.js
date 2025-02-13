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
        altTextCheckbox: document.getElementById("altTextCheckbox")
    };

    let state = {
        snippets: [],
        currentEditingButton: null,
        currentSnippet: null,
        buttonSettings: {}
    };

    function incrementApiCounter() {
        const counterElement = document.getElementById('api-count');
        const currentCount = parseInt(counterElement.textContent) || 0;
        counterElement.textContent = currentCount + 1;
        // Optionally persist the count
        chrome.storage.local.set({ [STORAGE_KEYS.API_COUNTER]: currentCount + 1 });
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
                content: snippet.content
            };
            
            elements.modal.style.display = 'flex';
            elements.snippetCode.readOnly = false;
            elements.buttonLabel.value = currentSettings.label;
            elements.snippetCode.value = currentSettings.content;
            
            // Enable reset if customized
            elements.resetBtn.disabled = !(
                currentSettings.label !== snippet.title || 
                currentSettings.content !== snippet.content
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
            
            // Reset button appearance
            if (state.currentSnippet.isIcon) {
                updateIconButton(state.currentEditingButton, state.currentSnippet, {
                    label: state.currentSnippet.title,
                    content: state.currentSnippet.content
                });
            } else {
                state.currentEditingButton.textContent = state.currentSnippet.title;
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
                snippet.title.toLowerCase().includes(query) ||
                snippet.content.toLowerCase().includes(query)
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
            newSettings.content === snippet.content) {
            delete state.buttonSettings[snippetId];
        } else {
            state.buttonSettings[snippetId] = newSettings;
        }

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
                content: elements.snippetCode.value
            };

            await saveButtonCustomization(state.currentSnippet.id, newSettings);
            
            // Update button appearance and behavior
            if (state.currentSnippet.isIcon) {
                updateIconButton(state.currentEditingButton, state.currentSnippet, newSettings);
            } else {
                state.currentEditingButton.textContent = newSettings.label;
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
                    const iconUrl = fileName.includes('icon') 
                        ? `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/main/${GITHUB_CONFIG.iconsPath}/${fileName.replace('.html', '.svg')}`
                        : null;
                    
                    return {
                        id: fileName.replace('.html', ''),
                        title: toSentenceCase(fileName.replace('.html', '')),
                        content,
                        isIcon: fileName.includes('icon'),
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
        if (customSettings?.label !== snippet.title) {
            // Only show label if it's been customized to something different
            button.innerHTML = `<span class="button-label">${customSettings.label}</span>`;
        } else {
            // Show icon by default or if label matches original title
            button.innerHTML = `<img src="${snippet.iconUrl}" alt="${snippet.title}" class="button-icon">`;
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
            elements.codeGrid.innerHTML = '';
            elements.iconsGrid.innerHTML = '';
            
            if (!state.snippets.length) {
                const noSnippetsMessage = '<div class="no-snippets">No snippets available</div>';
                elements.codeGrid.innerHTML = noSnippetsMessage;
                elements.iconsGrid.innerHTML = noSnippetsMessage;
                return;
            }
            
            const fragment = document.createDocumentFragment();
            const iconFragment = document.createDocumentFragment();
            
            state.snippets.forEach(snippet => {
                const button = document.createElement('button');
                button.dataset.snippetId = snippet.id;
                button.className = snippet.isIcon ? 'icon-button' : 'code-button';
                
                const customSettings = getSnippetSettings(snippet.id) || {
                    label: snippet.title,
                    content: snippet.content
                };
                
                if (snippet.isIcon) {
                    updateIconButton(button, snippet, customSettings);
                    iconFragment.appendChild(button);
                } else {
                    button.textContent = customSettings.label;
                    fragment.appendChild(button);
                }
                
                button.onclick = () => copySnippet(customSettings.content);
                button.oncontextmenu = (e) => {
                    e.preventDefault();
                    openEditModal(button, snippet);
                };
            });
            
            elements.codeGrid.appendChild(fragment);
            elements.iconsGrid.appendChild(iconFragment);
        } catch (error) {
            console.error('Initialize buttons error:', error);
            showNotification('Failed to initialize buttons', 'error');
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
            
            snippets = await loadSnippets(true);
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
            showNotification('Failed to initialize extension', 'error');
        }
    }

    initialize();
});