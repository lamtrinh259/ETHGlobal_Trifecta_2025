"use client"

import { useState } from "react"
import "./App.css"

function App() {
  const [url, setUrl] = useState("https://www.google.com/")
  const [analysisResult, setAnalysisResult] = useState("")

  const handleAnalyze = () => {
    setAnalysisResult(
      "Analyzing URL: " +
        url +
        "\n\nHash: 0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069\nStatus: Verified ✓",
    )
  }

  const handleSave = () => {
    setAnalysisResult("URL saved successfully: " + url)
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
          <div className="logo">
            <div className="logo-dot"></div>
            <span className="logo-text">TEE</span>
          </div>
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
          <button onClick={handleAnalyze} className="button analyze-button">
            Analyze Page
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
          />
        </div>
      </main>
    </div>
  )
}

export default App

