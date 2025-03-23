// content-script.js
// This script gets injected into web pages to detect MetaMask/Web3 provider activity

(function() {
    console.log('TEE Shield: Monitoring for Web3 providers...');
  
    // Function to detect and monitor Web3 provider
    const monitorProvider = () => {
      if (window.ethereum && !window.ethereum._teeShieldMonitored) {
        console.log('TEE Shield: Ethereum provider detected');
        window.ethereum._teeShieldMonitored = true;
        
        // Save original request method
        const originalRequest = window.ethereum.request;
        
        // Intercept request method
        window.ethereum.request = async function(args) {
          // These are sensitive Web3 actions that require security verification
          const sensitiveActions = [
            'eth_sendTransaction',
            'eth_signTransaction',
            'eth_sign',
            'personal_sign',
            'eth_signTypedData',
            'eth_signTypedData_v1',
            'eth_signTypedData_v3',
            'eth_signTypedData_v4'
          ];
          
          if (args && args.method && sensitiveActions.includes(args.method)) {
            console.log('TEE Shield: Sensitive Web3 action detected:', args.method);
            
            // Notify background script about the action
            chrome.runtime.sendMessage({
              type: 'PROVIDER_ACTION_DETECTED',
              details: {
                method: args.method,
                url: window.location.href,
                params: JSON.stringify(args.params),
                timestamp: new Date().toISOString()
              }
            });
            
            // Give a small delay to allow the extension to open
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          // Continue with original request
          return originalRequest.apply(this, arguments);
        };
      }
    };
    
    // Initial check
    monitorProvider();
    
    // Set up observer to detect dynamically injected providers
    const observer = new MutationObserver(() => {
      if (window.ethereum && !window.ethereum._teeShieldMonitored) {
        monitorProvider();
      }
    });
    
    // Start observing
    observer.observe(document, {
      childList: true,
      subtree: true
    });
    
    // Check periodically as well (some sites inject the provider after page load)
    const checkInterval = setInterval(() => {
      if (window.ethereum && !window.ethereum._teeShieldMonitored) {
        monitorProvider();
        clearInterval(checkInterval);
      }
    }, 1000);
    
    // Clean up after 10 seconds if provider not found
    setTimeout(() => {
      clearInterval(checkInterval);
    }, 10000);
  })();