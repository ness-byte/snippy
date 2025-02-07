// Constants
const CACHE_KEY = 'snippets_cache';
const CACHE_TIMESTAMP_KEY = 'snippets_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const CUSTOM_SETTINGS_KEY = 'button_customizations';

// GitHub configuration
const GITHUB_CONFIG = {
    owner: 'ness-byte',
    repo: 'snippy',
    snippetsPath: 'snippets',
    iconsPath: 'icons'
};

document.addEventListener("DOMContentLoaded", async function() {
    // Elements
    const buttonsView = document.getElementById("buttons-view");
    const searchView = document.getElementById("search-view");
    const buttonsTab = document.getElementById("buttons-tab");
    const searchTab = document.getElementById("search-tab");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");
    const snippetGrid = document.getElementById("snippet-grid");
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("closeModal");
    const iconSelect = document.getElementById("icon-select");
    const buttonLabel = document.getElementById("button-label");
    const snippetCode = document.getElementById("snippet-code");
    const saveBtn = document.getElementById("save-btn");
    const resetBtn = document.getElementById("reset-btn");
    const refreshBtn = document.getElementById("refresh-btn");
    const resetCustomBtn = document.getElementById("reset-custom-btn");
    const notification = document.getElementById("notification");
    const toggle = document.getElementById("altTextCheckbox");

    let snippets = [];
    let icons = [];
    let currentEditingButton = null;


        // Load saved checkbox state
        chrome.storage.local.get('showAltText', function(data) {
            toggle.checked = data.showAltText || false;
        });
    
        // Save checkbox state changes
        toggle.addEventListener('change', function() {
            const isChecked = toggle.checked;
            chrome.storage.local.set({ showAltText: isChecked });
            });
        });
    
        // Initialize snippet grid container
        snippetGrid.innerHTML = '<div class="loading">Loading snippets...</div>';

    // Initialize
    try {
        await initializeData();
    } catch (error) {
        console.error('Initialization error:', error);
        showNotification('Failed to load snippets', 'error');
        snippetGrid.innerHTML = '<div class="error">Failed to load snippets. Please try refreshing.</div>';
    }

    // Tab switching
    buttonsTab.addEventListener('click', () => switchView('buttons'));
    searchTab.addEventListener('click', () => switchView('search'));

    function switchView(view) {
        buttonsView.style.display = view === 'buttons' ? 'block' : 'none';
        searchView.style.display = view === 'search' ? 'block' : 'none';
        buttonsTab.classList.toggle('active', view === 'buttons');
        searchTab.classList.toggle('active', view === 'search');
    }

    // Update loadSnippets function to add error handling and logging
    async function loadSnippets(forceRefresh = false) {
        try {
            if (!forceRefresh) {
                const { [CACHE_KEY]: cachedSnippets, [CACHE_TIMESTAMP_KEY]: timestamp } = 
                    await chrome.storage.local.get([CACHE_KEY, CACHE_TIMESTAMP_KEY]);
                
                if (cachedSnippets && timestamp && (Date.now() - timestamp < CACHE_DURATION)) {
                    console.log('Loading snippets from cache:', cachedSnippets);
                    return cachedSnippets;
                }
            }

            console.log('Fetching snippets from GitHub...');
            const response = await fetch(
                `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.snippetsPath}`
            );
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }
            
            const files = await response.json();
            console.log('Retrieved files from GitHub:', files);

            if (!Array.isArray(files) || files.length === 0) {
                throw new Error('No snippet files found in repository');
            }

            const snippets = await Promise.all(
                files
                    .filter(file => file.name.endsWith('.html'))
                    .map(async file => {
                        console.log('Processing file:', file.name);
                        const content = await fetch(file.download_url).then(r => r.text());
                        return {
                            id: file.name.replace('.html', ''),
                            title: file.name.replace('.html', '').split('-').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' '),
                            content: content,
                            download_url: file.download_url
                        };
                    })
            );

            console.log('Processed snippets:', snippets);

            // Cache the results
            await chrome.storage.local.set({
                [CACHE_KEY]: snippets,
                [CACHE_TIMESTAMP_KEY]: Date.now()
            });

            return snippets;
        } catch (error) {
            console.error('Error loading snippets:', error);
            throw error;
        }
    }

    // Load icons from GitHub
    async function loadIcons() {
        try {
            const response = await fetch(
                `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.iconsPath}`
            );
            
            if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
            
            const files = await response.json();
            return files
                .filter(file => file.name.endsWith('.svg'))
                .map(file => ({
                    id: file.name.replace('.svg', ''),
                    url: file.download_url
                }));
        } catch (error) {
            console.error('Error loading icons:', error);
            return [];
        }
    }

    // Update initializeButtons to handle empty states
    async function initializeButtons() {
    const customizations = await chrome.storage.local.get(CUSTOM_SETTINGS_KEY);
    const buttonSettings = customizations[CUSTOM_SETTINGS_KEY] || {};

    snippetGrid.innerHTML = '';
    
    if (!snippets || snippets.length === 0) {
        snippetGrid.innerHTML = '<div class="no-snippets">No snippets available</div>';
        return;
    }
    
    for (const snippet of snippets) {
        const button = document.createElement('button');
        button.className = 'snippet-button';
        button.dataset.snippetId = snippet.id;

        // Apply custom settings or defaults
        const settings = buttonSettings[snippet.id] || {
            label: snippet.title,
            iconUrl: icons.length > 0 ? icons[0].url : null,
            content: snippet.content
        };

        updateButtonAppearance(button, settings);

        // Add click handlers
        button.addEventListener('click', () => copySnippet(settings.content || snippet.content));
        button.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            openEditModal(button, snippet, settings);
        });

        snippetGrid.appendChild(button);
    }
}


    // Modal functions
    function openEditModal(button, snippet, settings) {
        currentEditingButton = button;
        modal.style.display = 'flex';
        buttonLabel.value = settings.label || snippet.title;
        snippetCode.value = settings.content || snippet.content;
        iconSelect.value = settings.iconUrl || (icons.length > 0 ? icons[0].url : '');
        
        // Make snippet code editable
        snippetCode.removeAttribute('readonly');
    }

    closeModal.onclick = () => {
        modal.style.display = 'none';
        currentEditingButton = null;
    };

    // Save button customization
    saveBtn.addEventListener('click', async () => {
        if (!currentEditingButton) return;

        const snippetId = currentEditingButton.dataset.snippetId;
        const settings = {
            label: buttonLabel.value,
            iconUrl: iconSelect.value,
            content: snippetCode.value // Save custom content
        };

        // Save to storage
        const customizations = await chrome.storage.local.get(CUSTOM_SETTINGS_KEY);
        const buttonSettings = customizations[CUSTOM_SETTINGS_KEY] || {};
        buttonSettings[snippetId] = settings;
        await chrome.storage.local.set({ [CUSTOM_SETTINGS_KEY]: buttonSettings });

        // Update button appearance and functionality
        updateButtonAppearance(currentEditingButton, settings);
        currentEditingButton.onclick = () => copySnippet(settings.content);
        
        modal.style.display = 'none';
        currentEditingButton = null;
        showNotification('Button updated successfully');
    });

    // Reset custom settings
    resetCustomBtn.addEventListener('click', async () => {
        await chrome.storage.local.remove(CUSTOM_SETTINGS_KEY);
        await initializeButtons();
        showNotification('All custom settings reset');
    });

    // Refresh files
    refreshBtn.addEventListener('click', async () => {
        try {
            await initializeData(true); // Force refresh
            showNotification('Files refreshed successfully');
        } catch (error) {
            console.error('Refresh error:', error);
            showNotification('Failed to refresh files', 'error');
        }
    });

    // Reset single button to default
    resetBtn.addEventListener('click', async () => {
        if (!currentEditingButton) return;

        const snippetId = currentEditingButton.dataset.snippetId;
        const snippet = snippets.find(s => s.id === snippetId);

        // Remove custom settings
        const customizations = await chrome.storage.local.get(CUSTOM_SETTINGS_KEY);
        const buttonSettings = customizations[CUSTOM_SETTINGS_KEY] || {};
        delete buttonSettings[snippetId];
        await chrome.storage.local.set({ [CUSTOM_SETTINGS_KEY]: buttonSettings });

        // Reset to default appearance and functionality
        const defaultSettings = {
            label: snippet.title,
            iconUrl: icons.length > 0 ? icons[0].url : null,
            content: snippet.content
        };
        
        updateButtonAppearance(currentEditingButton, defaultSettings);
        currentEditingButton.onclick = () => copySnippet(snippet.content);

        modal.style.display = 'none';
        currentEditingButton = null;
        showNotification('Button reset to default');
    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        searchResults.innerHTML = '';

        const results = snippets.filter(snippet =>
            snippet.title.toLowerCase().includes(query) ||
            snippet.content.toLowerCase().includes(query)
        );

        results.forEach(snippet => {
            const div = document.createElement('div');
            div.className = 'search-result';
            div.textContent = snippet.title;
            div.addEventListener('click', () => copySnippet(snippet.content));
            searchResults.appendChild(div);
        });
    });

    // Utility functions
    function updateButtonAppearance(button, settings) {
        button.innerHTML = `
            <img src="${settings.iconUrl}" alt="${settings.label}" class="button-icon">
            <span class="button-label">${settings.label}</span>
        `;
        button.title = settings.label;
        button.dataset.iconUrl = settings.iconUrl;
    }

    function populateIconSelect() {
        iconSelect.innerHTML = icons.map(icon =>
            `<option value="${icon.url}">${icon.id}</option>`
        ).join('');
    }

    async function copySnippet(content) {
        try {
            await navigator.clipboard.writeText(content);
            showNotification('Copied to clipboard!');
        } catch (error) {
            console.error('Copy failed:', error);
            showNotification('Failed to copy', 'error');
        }
    }

    function showNotification(message, type = 'success') {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    