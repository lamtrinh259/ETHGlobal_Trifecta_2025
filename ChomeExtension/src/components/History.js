/*global chrome*/
import { useState, useEffect } from 'react';
import '../styles/History.css';

function History() {
  const [savedUrls, setSavedUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSavedUrls() {
      try {
        const data = await chrome.storage.local.get('savedUrls');
        setSavedUrls(data.savedUrls || []);
      } catch (error) {
        console.error('Error fetching saved URLs:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSavedUrls();
  }, []);

  const handleClearHistory = async () => {
    try {
      await chrome.storage.local.set({ savedUrls: [] });
      setSavedUrls([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const handleDeleteUrl = async (timestamp) => {
    try {
      const updatedUrls = savedUrls.filter(url => url.timestamp !== timestamp);
      await chrome.storage.local.set({ savedUrls: updatedUrls });
      setSavedUrls(updatedUrls);
    } catch (error) {
      console.error('Error deleting URL:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <div className="history-loading">Loading history...</div>;
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Saved URLs</h2>
        {savedUrls.length > 0 && (
          <button 
            className="clear-button" 
            onClick={handleClearHistory}
          >
            Clear All
          </button>
        )}
      </div>

      {savedUrls.length === 0 ? (
        <div className="no-history">
          <p>No saved URLs yet</p>
        </div>
      ) : (
        <ul className="history-list">
          {savedUrls.map((item) => (
            <li key={item.timestamp} className="history-item">
              <div className="history-content">
                <div className="history-title">{item.title}</div>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="history-url"
                >
                  {item.url}
                </a>
                <div className="history-timestamp">
                  {formatDate(item.timestamp)}
                </div>
              </div>
              <button 
                className="delete-button" 
                onClick={() => handleDeleteUrl(item.timestamp)}
                aria-label="Delete"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default History; 