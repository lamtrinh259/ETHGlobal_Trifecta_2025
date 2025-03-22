/*global chrome*/
import { useState, useEffect } from 'react';
import { getCurrentTab } from './chrome-api';
import Navigation from './components/Navigation';
import History from './components/History';
import Settings from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [url, setUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTabInfo() {
      try {
        const tab = await getCurrentTab();
        if (tab) {
          setUrl(tab.url);
          setFaviconUrl(tab.favIconUrl);
        }
      } catch (error) {
        console.error('Error fetching tab info:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTabInfo();
  }, []);

  const handleAnalyzeClick = async () => {
    try {
      const tab = await getCurrentTab();
      chrome.tabs.sendMessage(
        tab.id,
        { action: 'analyze' }
      );
    } catch (error) {
      console.error('Error sending message to content script:', error);
    }
  };

  const handleSaveClick = async () => {
    try {
      const tab = await getCurrentTab();
      await chrome.storage.local.set({ 
        savedUrl: url, 
        timestamp: new Date().toISOString() 
      });
      
      // Also save to the savedUrls array
      const data = await chrome.storage.local.get('savedUrls');
      const savedUrls = data.savedUrls || [];
      
      const newEntry = {
        url: tab.url,
        title: tab.title || 'Unknown',
        timestamp: new Date().toISOString()
      };
      
      savedUrls.unshift(newEntry);
      
      // Get maxHistory setting
      const settingsData = await chrome.storage.local.get('settings');
      const maxHistory = settingsData.settings?.maxHistory || 20;
      
      // Limit to maxHistory entries
      const updatedUrls = savedUrls.slice(0, maxHistory);
      
      await chrome.storage.local.set({ savedUrls: updatedUrls });
      
      alert('URL saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save URL');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="p-4 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">My Chrome Extension</h1>
            {faviconUrl && <img src={faviconUrl} alt="Site favicon" className="w-8 h-8 mb-4" />}
            <div className="w-full bg-gray-100 p-3 rounded-md mb-4">
              <p className="text-sm text-gray-600">Current URL:</p>
              <p className="text-md font-medium break-all">{url}</p>
            </div>
            <div className="flex gap-2 w-full">
              <button 
                onClick={handleAnalyzeClick} 
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
              >
                Analyze Page
              </button>
              <button 
                onClick={handleSaveClick} 
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors"
              >
                Save URL
              </button>
            </div>
          </div>
        );
      case 'history':
        return <History />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-[400px] min-h-[500px] bg-white">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="p-4">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default App;
