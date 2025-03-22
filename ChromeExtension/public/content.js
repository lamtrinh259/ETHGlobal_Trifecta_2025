/* global chrome */

// Content script that gets injected into web pages

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'analyze') {
    // Check if we need to return HTML content
    if (message.getHtml) {
      // Get the full HTML content of the page
      const htmlContent = document.documentElement.outerHTML;
      sendResponse({ success: true, html: htmlContent });
      
      // Show a notification on the page
      showNotification('HTML content captured');
    } else {
      // Analyze page content
      const pageAnalysis = analyzePageContent();
      sendResponse({ success: true, data: pageAnalysis });
      
      // Show a notification on the page
      showNotification('Page analyzed successfully!');
    }
  }
  
  // Always return true for asynchronous response
  return true;
});

/**
 * Analyzes the content of the current page
 * @returns {Object} - Analysis results
 */
function analyzePageContent() {
  // Get page metadata
  const title = document.title;
  const description = document.querySelector('meta[name="description"]')?.content || 'No description found';
  const h1Count = document.querySelectorAll('h1').length;
  const h2Count = document.querySelectorAll('h2').length;
  const paragraphCount = document.querySelectorAll('p').length;
  const imageCount = document.querySelectorAll('img').length;
  const linkCount = document.querySelectorAll('a').length;
  
  // Get word count
  const bodyText = document.body.innerText;
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
  
  return {
    title,
    description,
    headings: {
      h1: h1Count,
      h2: h2Count
    },
    elements: {
      paragraphs: paragraphCount,
      images: imageCount,
      links: linkCount
    },
    wordCount
  };
}

/**
 * Shows a notification on the page
 * @param {string} message - The notification message
 */
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background-color: #4CAF50;
    color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    font-family: Arial, sans-serif;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Fade in
  setTimeout(() => {
    notification.style.opacity = 1;
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = 0;
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
} 