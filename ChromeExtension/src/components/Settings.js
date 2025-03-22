/*global chrome*/
import { useState, useEffect } from 'react';
import '../styles/Settings.css';

function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    theme: 'dark',
    maxHistory: 20
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await chrome.storage.local.get('settings');
        if (data.settings) {
          setSettings(data.settings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSettingChange = async (key, value) => {
    try {
      const updatedSettings = {
        ...settings,
        [key]: value
      };
      
      await chrome.storage.local.set({ settings: updatedSettings });
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  if (isLoading) {
    return <div className="settings-loading">Loading settings...</div>;
  }

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      
      <div className="setting-item">
        <label htmlFor="notifications">
          Enable notifications
        </label>
        <div className="toggle-switch">
          <input
            type="checkbox"
            id="notifications"
            checked={settings.notifications}
            onChange={(e) => handleSettingChange('notifications', e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </div>
      </div>
      
      <div className="setting-item">
        <label htmlFor="theme">Theme</label>
        <select
          id="theme"
          value={settings.theme}
          onChange={(e) => handleSettingChange('theme', e.target.value)}
          className="select-input"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>
      
      <div className="setting-item">
        <label htmlFor="maxHistory">
          Max history items
        </label>
        <select
          id="maxHistory"
          value={settings.maxHistory}
          onChange={(e) => handleSettingChange('maxHistory', Number(e.target.value))}
          className="select-input"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      
      <div className="setting-footer">
        <button
          className="reset-button"
          onClick={() => {
            const defaultSettings = {
              notifications: true,
              theme: 'dark',
              maxHistory: 20
            };
            
            handleSettingChange('notifications', defaultSettings.notifications);
            handleSettingChange('theme', defaultSettings.theme);
            handleSettingChange('maxHistory', defaultSettings.maxHistory);
          }}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}

export default Settings; 