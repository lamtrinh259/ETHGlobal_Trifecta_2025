"use client"

/*global chrome*/
import { useState, useEffect } from "react"
import { getCurrentTab, sendMessageToContentScript } from "./chrome-api"
import "./App.css"

function App() {
  const [url, setUrl] = useState("https://www.google.com/")
  const [analysisResult, setAnalysisResult] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    async function fetchTabInfo() {
      try {
        const tab = await getCurrentTab()
        if (tab) {
          setUrl(tab.url)
        }
      } catch (error) {
        console.error('Error fetching tab info:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTabInfo()
  }, [])

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true)
      setAnalysisResult("Reading HTML content...")
      
      const tab = await getCurrentTab()
      if (!tab) {
        setAnalysisResult("Error: Could not get the current tab.")
        setIsAnalyzing(false)
        return
      }

      // Make sure we can't access restricted URLs
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('about:')) {
        setAnalysisResult(`Cannot access HTML content on restricted pages like ${tab.url}. Try a regular website instead.`)
        setIsAnalyzing(false)
        return
      }

      // Execute script to get the HTML content directly
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          return document.documentElement.outerHTML
        }
      }, (results) => {
        if (chrome.runtime.lastError) {
          setAnalysisResult(`Error: ${chrome.runtime.lastError.message}`)
        } else if (results && results[0] && results[0].result) {
          setAnalysisResult(results[0].result)
        } else {
          setAnalysisResult("Could not retrieve HTML content.")
        }
        setIsAnalyzing(false)
      })
    } catch (error) {
      console.error('Error analyzing page:', error)
      setAnalysisResult("Error analyzing page: " + error.message)
      setIsAnalyzing(false)
    }
  }

  const handleSave = async () => {
    try {
      const tab = await getCurrentTab()
      await chrome.storage.local.set({ 
        savedUrl: url, 
        timestamp: new Date().toISOString() 
      })
      
      // Also save to the savedUrls array
      const data = await chrome.storage.local.get('savedUrls')
      const savedUrls = data.savedUrls || []
      
      const newEntry = {
        url: tab.url,
        title: tab.title || 'Unknown',
        timestamp: new Date().toISOString()
      }
      
      savedUrls.unshift(newEntry)
      
      // Get maxHistory setting
      const settingsData = await chrome.storage.local.get('settings')
      const maxHistory = settingsData.settings?.maxHistory || 20
      
      // Limit to maxHistory entries
      const updatedUrls = savedUrls.slice(0, maxHistory)
      
      await chrome.storage.local.set({ savedUrls: updatedUrls })
      
      setAnalysisResult("URL saved successfully: " + url)
    } catch (error) {
      console.error('Error saving data:', error)
      setAnalysisResult("Failed to save URL: " + error.message)
    }
  }

  if (isLoading) {
    return <div className="app-container">Loading...</div>
  }

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navigation">
        <div className="nav-content">
          <div className="nav-tabs">
            <div className="nav-tab active">Home</div>
            <div className="nav-tab">History</div>
            <div className="nav-tab">Settings</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="title">
          <span className="title-tee">TEE </span>
          <span className="title-shield">Shield</span>
        </h1>

        {/* Logo */}
        <div className="logo-container">
          <img 
            src="/logo512.png" 
            alt="TEE Shield Logo" 
            style={{ 
              width: '80px', 
              height: '80px', 
              objectFit: 'contain',
              background: 'transparent',
              padding: '0'
            }} 
          />
        </div>

        {/* URL Input Section */}
        <div className="url-section">
          <p className="url-label">Current URL:</p>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="url-input"
            placeholder="Enter URL"
          />
        </div>

        {/* Buttons */}
        <div className="buttons-container">
          <button 
            onClick={handleAnalyze} 
            className="button analyze-button"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Page"}
          </button>

          <button onClick={handleSave} className="button save-button">
            Save URL
          </button>
        </div>

        {/* Results Text Area */}
        <div className="results-container">
          <textarea
            value={analysisResult}
            readOnly
            className="results-textarea"
            placeholder="Analysis results will appear here..."
            style={{ 
              fontFamily: 'monospace',
              whiteSpace: 'pre',
              overflowWrap: 'normal',
              overflowX: 'scroll'
            }}
          />
        </div>
      </main>
    </div>
  )
}

export default App

