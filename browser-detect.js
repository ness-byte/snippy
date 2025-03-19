// Browser detection and API wrapper
(function() {
    'use strict';
    
    window.browserAPI = typeof browser !== 'undefined' ? browser : chrome;
})();