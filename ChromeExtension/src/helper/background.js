// background.js

// List of domains to automatically check
const domainsToCheck = [
    "example.com",
    "test-domain.com",
    // Add more domains you want to automatically check
  ];
  
  // Keep track of already checked tabs to avoid repeated popups
  const checkedTabs = new Set();
  
  // Listen for tab updates
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Only run when the page is fully loaded
    if (changeInfo.status === 'complete' && tab.url) {
      try {
        const url = new URL(tab.url);
        const domain = url.hostname;
        
        // Check if this domain should be verified
        if (shouldCheckDomain(domain) && !checkedTabs.has(tabId)) {
          // Mark this tab as checked
          checkedTabs.add(tabId);
          
          // Wait a bit to let the page finish rendering
          setTimeout(() => {
            // Open the verification popup
            chrome.windows.create({
              url: chrome.runtime.getURL("index.html?verify=true&tabId=" + tabId),
              type: "popup",
              width: 500,
              height: 600,
              focused: true
            });
          }, 500);
        }
      } catch (e) {
        console.error("Error parsing URL", e);
      }
    }
  });
  
  // Listen for tab close events to clean up our tracking set
  chrome.tabs.onRemoved.addListener((tabId) => {
    checkedTabs.delete(tabId);
  });
  
  // Function to determine if a domain should be checked
  function shouldCheckDomain(domain) {
    // Check against our list of domains to verify
    return domainsToCheck.some(d => domain.includes(d));
    
    // Alternatively, you could check if the domain is in a stored list
    // from your extension's storage
  }
  
  // Listen for messages from the content script or popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkSecurity") {
      // You could trigger a check from other parts of your extension
      const tabId = message.tabId;
      
      chrome.windows.create({
        url: chrome.runtime.getURL("index.html?verify=true&tabId=" + tabId),
        type: "popup",
        width: 500,
        height: 600,
        focused: true
      });
      
      sendResponse({ status: "verification_initiated" });
    }
    
    return true; // Indicates you'll respond asynchronously
  });