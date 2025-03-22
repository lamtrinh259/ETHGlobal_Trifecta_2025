/* global chrome */

// Chrome extension background script

// Listen for installation and update events
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Actions to take when extension is first installed
    console.log('Extension installed');
    
    // Initialize storage with default values
    chrome.storage.local.set({
      savedUrls: [],
      settings: {
        notifications: true,
        theme: 'dark'
      }
    });
    
    // Open onboarding page
    chrome.tabs.create({
      url: 'index.html#onboarding'
    });
  } else if (details.reason === 'update') {
    // Actions to take when extension is updated
    console.log(`Extension updated from ${details.previousVersion}`);
  }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'save_url') {
    // Handle saving URL to storage
    saveUrlToStorage(message.url, sender.tab?.title || 'Unknown')
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    
    // Return true to indicate asynchronous response
    return true;
  }
});

/**
 * Saves a URL to Chrome's local storage
 * @param {string} url - The URL to save
 * @param {string} title - The title of the page
 * @returns {Promise<Object>} - The updated savedUrls array
 */
async function saveUrlToStorage(url, title) {
  // Get current saved URLs
  const data = await chrome.storage.local.get('savedUrls');
  const savedUrls = data.savedUrls || [];
  
  // Add new URL to the beginning of the array
  const newEntry = {
    url,
    title,
    timestamp: new Date().toISOString()
  };
  
  savedUrls.unshift(newEntry);
  
  // Limit to 20 entries
  const updatedUrls = savedUrls.slice(0, 20);
  
  // Save back to storage
  await chrome.storage.local.set({ savedUrls: updatedUrls });
  
  return updatedUrls;
} 