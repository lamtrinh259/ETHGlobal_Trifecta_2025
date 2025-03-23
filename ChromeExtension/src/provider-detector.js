(function() {
    console.log('TEE Shield: Provider detector initialized');
    
    // Function to detect when MetaMask or other providers are used
    function monitorEthereumProvider() {
      // Function to inject into the page to monitor ethereum provider
      function injectMonitor() {
        // Create a small script element to access the page's window object
        const script = document.createElement('script');
        script.textContent = `
          (function() {
            // Only run this once
            if (window.__teeShieldMonitoring) return;
            window.__teeShieldMonitoring = true;
            
            console.log('TEE Shield: Monitoring ethereum provider');
            
            // Function that will run when ethereum provider is available
            function setupProviderMonitoring() {
              if (!window.ethereum) return;
              
              // Store original methods to restore them later
              const originalRequest = window.ethereum.request;
              const originalSendAsync = window.ethereum.sendAsync;
              const originalSend = window.ethereum.send;
              
              // Methods we want to monitor
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
              
              // Override request method
              window.ethereum.request = async function(args) {
                if (args && args.method && sensitiveActions.includes(args.method)) {
                  console.log('TEE Shield: Detected sensitive action:', args.method);
                  
                  // Dispatch custom event that our content script can listen for
                  window.dispatchEvent(new CustomEvent('__teeShieldProviderAction', {
                    detail: {
                      method: args.method,
                      params: args.params,
                      timestamp: new Date().toISOString()
                    }
                  }));
                }
                
                // Call original method
                return originalRequest.apply(window.ethereum, arguments);
              };
              
              // Also monitor sendAsync for older dApps
              if (window.ethereum.sendAsync) {
                window.ethereum.sendAsync = function(payload, callback) {
                  if (payload && payload.method && sensitiveActions.includes(payload.method)) {
                    console.log('TEE Shield: Detected sensitive action via sendAsync:', payload.method);
                    
                    window.dispatchEvent(new CustomEvent('__teeShieldProviderAction', {
                      detail: {
                        method: payload.method,
                        params: payload.params,
                        timestamp: new Date().toISOString()
                      }
                    }));
                  }
                  
                  return originalSendAsync.apply(window.ethereum, arguments);
                };
              }
              
              // Also monitor send for older dApps
              if (window.ethereum.send) {
                window.ethereum.send = function(methodOrPayload, paramsOrCallback) {
                  let method;
                  if (typeof methodOrPayload === 'string') {
                    method = methodOrPayload;
                  } else if (methodOrPayload && methodOrPayload.method) {
                    method = methodOrPayload.method;
                  }
                  
                  if (method && sensitiveActions.includes(method)) {
                    console.log('TEE Shield: Detected sensitive action via send:', method);
                    
                    window.dispatchEvent(new CustomEvent('__teeShieldProviderAction', {
                      detail: {
                        method: method,
                        timestamp: new Date().toISOString()
                      }
                    }));
                  }
                  
                  return originalSend.apply(window.ethereum, arguments);
                };
              }
              
              console.log('TEE Shield: Provider monitoring active');
            }
            
            // Run immediately if provider exists
            if (window.ethereum) {
              setupProviderMonitoring();
            }
            
            // Also watch for provider being added later
            let providerCheckInterval = setInterval(() => {
              if (window.ethereum) {
                setupProviderMonitoring();
                clearInterval(providerCheckInterval);
              }
            }, 1000);
          })();
        `;
        
        // Append to document to execute
        document.documentElement.appendChild(script);
        script.remove();
      }
      
      // Inject our monitoring code
      injectMonitor();
      
      // Listen for the custom event from our injected script
      window.addEventListener('__teeShieldProviderAction', function(e) {
        console.log('TEE Shield: Received provider action event', e.detail);
        
        // Send message to our extension's background/service worker
        chrome.runtime.sendMessage({
          type: 'PROVIDER_ACTION_DETECTED',
          details: {
            method: e.detail.method,
            url: window.location.href,
            hostname: window.location.hostname,
            timestamp: e.detail.timestamp
          }
        }, function(response) {
          console.log('TEE Shield: Response from extension', response);
        });
      });
    }
    
    // Run our monitor function
    monitorEthereumProvider();
  })();