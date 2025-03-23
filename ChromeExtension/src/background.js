// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === 'PROVIDER_ACTION_DETECTED') {
      console.log('Provider action detected in background:', message.details);
      
      // Create a popup window for the extension
      chrome.action.openPopup();
      
      // Store information about the detection
      chrome.storage.local.set({
        lastProviderAction: {
          method: message.details.method,
          url: message.details.url,
          timestamp: message.details.timestamp,
          tabId: sender.tab.id
        }
      });
      
      // Send a response to let the content script know we received the message
      sendResponse({ status: 'POPUP_OPENED' });
      return true; // Keep message channel open for async response
    }
  });
  
  // When extension is installed or updated
  chrome.runtime.onInstalled.addListener(function() {
    // Register the content script to run on all pages
    chrome.scripting.registerContentScripts([{
      id: 'provider-detector',
      matches: ['http://*/*', 'https://*/*'],
      js: ['provider-detector.js'],
      runAt: 'document_start'
    }]);
  });