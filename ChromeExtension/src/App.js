"use client"

/*global chrome*/
import { useState } from "react"
import Home from "./components/Home"
import "./App.css"
import HashComparison from "./components/HashComparison"

function App() {
  const [activeTab, setActiveTab] = useState("home")
  

  const renderContent = () => {
    switch(activeTab) {
      case "home":
        return <Home />
      case "comparison":
        // To be implemented
        return <HashComparison/>
      case "settings":
        // To be implemented
        return <div>Settings tab content</div>
      default:
        return <Home />
    }
  }

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navigation">
        <div className="nav-content">
          <div className="nav-tabs">
            <div 
              className={`nav-tab ${activeTab === "home" ? "active" : ""}`}
              onClick={() => setActiveTab("home")}
            >
              Home
            </div>
            <div 
              className={`nav-tab ${activeTab === "comparison" ? "active" : ""}`}
              onClick={() => setActiveTab("comparison")}
            >
              Hash comparison
            </div>
            <div 
              className={`nav-tab ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  )
}

export default App

