/*global chrome*/
import { useState, useEffect } from 'react';
import './App.css';
import { getCurrentTab } from './chrome-api';
import Navigation from './components/Navigation';
import History from './components/History';
import Settings from './components/Settings';
import Home from './components/Home';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTabInfo() {
      try {
        await getCurrentTab();
      } catch (error) {
        console.error('Error fetching tab info:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTabInfo();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
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
