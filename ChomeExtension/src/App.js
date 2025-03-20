/*global chrome*/
import { useState, useEffect } from 'react';
import './App.css';
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
          <div className="home-content">
            <h1>My Chrome Extension</h1>
            {faviconUrl && <img src={faviconUrl} alt="Site favicon" className="favicon" />}
            <div className="url-container">
              <p className="current-url">Current URL:</p>
              <p className="url-value">{url}</p>
            </div>
            <div className="button-container">
              <button onClick={handleAnalyzeClick} className="analyze-button">
                Analyze Page
              </button>
              <button onClick={handleSaveClick} className="save-button">
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
    return <div className="App loading">Loading...</div>;
  }

  return (
    <div className="App">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="App-main">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default App;
