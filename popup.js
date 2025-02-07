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
    // Update debug status
    const debugStatus = document.getElementById('debug-status');
    if (debugStatus) {
        debugStatus.textContent = 'Script loaded';
        debugStatus.style.background = 'lightgreen';
    }

    // Elements
    const elements = {
        buttonsView: document.getElementById("buttons-view"),
        searchView: document.getElementById("search-view"),
        buttonsTab: document.getElementById("buttons-tab"),
        searchTab: document.getElementById("search-tab"),
        searchInput: document.getElementById("search-input"),
        searchResults: document.getElementById("search-results"),
        snippetGrid: document.getElementById("snippet-grid"),
        modal: document.getElementById("modal"),
        closeModal: document.getElementById("closeModal"),
        iconSelect: document.getElementById("icon-select"),
        buttonLabel: document.getElementById("button-label"),
        snippetCode: document.getElementById("snippet-code"),
        saveBtn: document.getElementById("save-btn"),
        resetBtn: document.getElementById("reset-btn"),
        refreshBtn: document.getElementById("refresh-btn"),
        resetCustomBtn: document.getElementById("reset-custom-btn"),
        notification: document.getElementById("notification"),
        altTextCheckbox: document.getElementById("altTextCheckbox")
    };

    let snippets = [];
    let icons = [];
    let currentEditingButton = null;

    // Modal functions
    function openEditModal(button, snippet, settings) {
        currentEditingButton = button;
        elements.modal.style.display = 'flex';
        elements.buttonLabel.value = settings.label || snippet.title;
        elements.snippetCode.value = settings.content || snippet.content;
        elements.iconSelect.value = settings.iconUrl || (icons.length > 0 ? icons[0].url : '');
    }

    // Event Listeners for tabs
    elements.buttonsTab.addEventListener('click', () => switchView('buttons'));
    elements.searchTab.addEventListener('click', () => switchView('search'));

    // Search functionality
    elements.searchInput.addEventListener('input', () => {
        const query = elements.searchInput.value.toLowerCase();
        elements.searchResults.innerHTML = '';

        if (!query) {
            return;
        }

        const results = snippets.filter(snippet =>
            snippet.title.toLowerCase().includes(query) ||
            snippet.content.toLowerCase().includes(query)
        );

        results.forEach(snippet => {
            const div = document.createElement('div');
            div.className = 'search-result';
            div.textContent = snippet.title;
            div.addEventListener('click', () => copySnippet(snippet.content));
            elements.searchResults.appendChild(div);
        });
    });

    // Modal event listeners
    elements.closeModal.onclick = () => {
        elements.modal.style.display = 'none';
        currentEditingButton = null;
    };

    elements.saveBtn.addEventListener('click', async () => {
        if (!currentEditingButton) return;

        const snippetId = currentEditingButton.dataset.snippetId;
        const settings = {
            label: elements.buttonLabel.value,
            iconUrl: elements.iconSelect.value,
            content: elements.snippetCode.value
        };

        // Save to storage
        const customizations = await chrome.storage.local.get(CUSTOM_SETTINGS_KEY);
        const buttonSettings = customizations[CUSTOM_SETTINGS_KEY] || {};
        buttonSettings[snippetId] = settings;
        await chrome.storage.local.set({ [CUSTOM_SETTINGS_KEY]: buttonSettings });

        updateButtonAppearance(currentEditingButton, settings);
        
        elements.modal.style.display = 'none';
        currentEditingButton = null;
        showNotification('Button updated successfully');
    });

    // Utility functions
    function switchView(view) {
        console.log('Switching to view:', view);
        elements.buttonsView.style.display = view === 'buttons' ? 'block' : 'none';
        elements.searchView.style.display = view === 'search' ? 'block' : 'none';
        elements.buttonsTab.classList.toggle('active', view === 'buttons');
        elements.searchTab.classList.toggle('active', view === 'search');
    }

    async function loadSnippets(forceRefresh = false) {
        try {
            if (!forceRefresh) {
                const cached = await chrome.storage.local.get([CACHE_KEY, CACHE_TIMESTAMP_KEY]);
                if (cached[CACHE_KEY] && cached[CACHE_TIMESTAMP_KEY] && 
                    (Date.now() - cached[CACHE_TIMESTAMP_KEY] < CACHE_DURATION)) {
                    return cached[CACHE_KEY];
                }
            }

            const response = await fetch(
                `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.snippetsPath}`
            );
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const files = await response.json();
            const processedSnippets = await Promise.all(
                files
                    .filter(file => file.name.endsWith('.html'))
                    .map(async file => {
                        const content = await fetch(file.download_url).then(r => r.text());
                        return {
                            id: file.name.replace('.html', ''),
                            title: file.name.replace('.html', '')
                                .split('-')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' '),
                            content,
                            download_url: file.download_url
                        };
                    })
            );

            await chrome.storage.local.set({
                [CACHE_KEY]: processedSnippets,
                [CACHE_TIMESTAMP_KEY]: Date.now()
            });

            return processedSnippets;
        } catch (error) {
            console.error('Error loading snippets:', error);
            throw error;
        }
    }

    async function loadIcons() {
        try {
            const response = await fetch(
                `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.iconsPath}`
            );
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
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

    function updateButtonAppearance(button, settings) {
        button.innerHTML = `
            <img src="${settings.iconUrl}" alt="${settings.label}" class="button-icon">
            <span class="button-label">${settings.label}</span>
        `;
        button.title = settings.label;
    }

    function showNotification(message, type = 'success') {
        elements.notification.textContent = message;
        elements.notification.className = `notification ${type}`;
        elements.notification.style.display = 'block';
        setTimeout(() => {
            elements.notification.style.display = 'none';
        }, 3000);
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

    // Initialize buttons
    async function initializeButtons() {
        const customizations = await chrome.storage.local.get(CUSTOM_SETTINGS_KEY);
        const buttonSettings = customizations[CUSTOM_SETTINGS_KEY] || {};

        elements.snippetGrid.innerHTML = '';
        
        if (!snippets || snippets.length === 0) {
            elements.snippetGrid.innerHTML = '<div class="no-snippets">No snippets available</div>';
            return;
        }
        
        snippets.forEach(snippet => {
            const button = document.createElement('button');
            button.className = 'snippet-button';
            button.dataset.snippetId = snippet.id;

            const settings = buttonSettings[snippet.id] || {
                label: snippet.title,
                iconUrl: icons.length > 0 ? icons[0].url : null,
                content: snippet.content
            };

            updateButtonAppearance(button, settings);

            button.addEventListener('click', () => copySnippet(settings.content || snippet.content));
            button.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                openEditModal(button, snippet, settings);
            });

            elements.snippetGrid.appendChild(button);
        });
    }

    // Initialize
    async function initialize() {
        try {
            snippets = await loadSnippets();
            icons = await loadIcons();
            await initializeButtons();
            console.log('Initialization complete');
        } catch (error) {
            console.error('Initialization error:', error);
            showNotification('Failed to initialize extension', 'error');
        }
    }

    // Start initialization
    initialize();
});