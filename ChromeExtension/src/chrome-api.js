/*global chrome*/

/**
 * Returns the current active tab
 * @returns {Promise<chrome.tabs.Tab>} - The current active tab
 */
export const getCurrentTab = async () => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
};

/**
 * Stores data in Chrome's local storage
 * @param {string} key - The key to store the data under
 * @param {any} value - The value to store
 * @returns {Promise<void>}
 */
export const storeData = async (key, value) => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => {
      resolve();
    });
  });
};

/**
 * Retrieves data from Chrome's local storage
 * @param {string} key - The key to retrieve data for
 * @returns {Promise<any>} - The retrieved data
 */
export const getData = async (key) => {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key]);
    });
  });
};

/**
 * Sends a message to the content script in the active tab
 * @param {Object} message - The message to send
 * @returns {Promise<any>} - The response from the content script
 */
export const sendMessageToContentScript = async (message) => {
  const tab = await getCurrentTab();
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tab.id, message, (response) => {
      resolve(response);
    });
  });
};

/**
 * Sends a message to the background script
 * @param {Object} message - The message to send
 * @returns {Promise<any>} - The response from the background script
 */
export const sendMessageToBackground = async (message) => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      resolve(response);
    });
  });
}; 


// Function to simulate getting the hash from the frontend
export async function getFrontendHash(url) {
  // In a real implementation, this would get the hash from the page
  // For now, we'll generate a mock hash based on the URL
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockHash = generateMockHash(url)
      resolve(mockHash)
    }, 800)
  })
}

// Function to simulate getting the hash from the smart contract
export async function getContractHash(url) {
  // In a real implementation, this would call your blockchain API
  // For now, we'll simulate with a mock hash
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockHash = generateMockHash(url)
      resolve(mockHash)
    }, 1200)
  })
}
// Helper function to generate a mock hash
function generateMockHash(input) {
  let hash = "0x"
  const chars = "0123456789abcdef"
  const inputStr = String(input)
  
  // Use the input to influence the hash, making it somewhat deterministic
  let seed = 0
  for (let i = 0; i < inputStr.length; i++) {
    seed += inputStr.charCodeAt(i)
  }
  
  // Generate a 64-character hex hash
  for (let i = 0; i < 64; i++) {
    const idx = (seed + i) % chars.length
    hash += chars.charAt(idx)
  }
  
  return hash
}