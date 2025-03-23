"use client"

import { useState, useEffect } from "react"
import { getCurrentTab } from "../chrome-api"
import "../styles/HashComparison.css"

function HashComparison() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [comparisonStatus, setComparisonStatus] = useState(null) // null, "matching", "mismatch"
  const [frontendHash, setFrontendHash] = useState("")
  const [contractHash, setContractHash] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [securityScore, setSecurityScore] = useState(0) // Added security score
  const [verificationTime, setVerificationTime] = useState(null) // Added verification timestamp

  useEffect(() => {
    async function fetchTabAndCompare() {
      try {
        const tab = await getCurrentTab()
        if (tab) {
          setUrl(tab.url)
          
          // Simulate fetching hashes
          await simulateHashComparison(tab.url)
        }
      } catch (error) {
        console.error('Error fetching tab info:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTabAndCompare()
  }, [])

  // This function simulates getting hash from frontend and smart contract
  // In a real implementation, you would replace this with actual API calls
  const simulateHashComparison = async (url) => {
    setIsLoading(true)
    
    // Create animation delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate "frontend" hash
    const mockFrontendHash = generateMockHash(url)
    setFrontendHash(mockFrontendHash)
    
    // Generate "smart contract" hash - for demo purposes
    // In 75% of cases, make it match, otherwise make it different
    const shouldMatch = Math.random() < 0.75
    const mockContractHash = shouldMatch 
      ? mockFrontendHash 
      : generateMockHash(url + Date.now())
    
    setContractHash(mockContractHash)
    
    // Animation delay
    setIsAnimating(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Set comparison result
    const isMatching = mockFrontendHash === mockContractHash
    setComparisonStatus(isMatching ? "matching" : "mismatch")
    
    // Set security score (0-100)
    const score = isMatching ? 
      Math.floor(85 + Math.random() * 15) : // 85-100 if matching
      Math.floor(15 + Math.random() * 50)   // 15-65 if mismatching
    setSecurityScore(score)
    
    // Set verification timestamp
    setVerificationTime(new Date().toLocaleTimeString())
    
    setIsAnimating(false)
    setIsLoading(false)
  }

  // Helper function to generate a mock hash
  const generateMockHash = (input) => {
    let hash = "0x"
    const chars = "0123456789abcdef"
    for (let i = 0; i < 64; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return hash
  }

  // Manually trigger a new comparison
  const handleCompareAgain = async () => {
    setComparisonStatus(null)
    setSecurityScore(0)
    setVerificationTime(null)
    await simulateHashComparison(url)
  }

  // Function to shorten a hash for display
  const shortenHash = (hash) => {
    if (!hash) return ""
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}`
  }

  // Function to get security score color
  const getScoreColor = (score) => {
    if (score >= 80) return "#4fd1c5" // teal for good
    if (score >= 50) return "#f6ad55" // orange for medium
    return "#fc8181" // red for poor
  }

  // Function to close the popup
  const closePopup = () => {
    window.close()
  }

  // Function to handle "Continue to Site" button click
  const handleContinueClick = () => {
    // You might want to add any additional logic here before closing
    closePopup()
  }

  // Function to handle "Go Back" button click
  const handleGoBackClick = () => {
    // In a real implementation, you might want to navigate back in the browser
    // chrome.tabs.goBack or similar functionality
    closePopup()
  }

  // Function to handle "Proceed at Risk" button click
  const handleProceedAnywayClick = () => {
    // You might want to add warning logs or analytics here
    closePopup()
  }

  // Function to handle "Cancel" button click
  const handleCancelClick = () => {
    closePopup()
  }

  if (isLoading) {
    return (
      <div className="hash-comparison-container loading">
        <div className="loading-spinner"></div>
        <p>Verifying website security...</p>
        <div className="scanning-pulse"></div>
      </div>
    )
  }

  return (
    <div className={`hash-comparison-container ${comparisonStatus || "pending"}`}>
      <h1 className="hash-title">
        <span className="title-tee">TEE </span>
        <span className="title-shield">Shield</span>
      </h1>

      {/* Logo with animation based on status */}
      <div className={`logo-container ${comparisonStatus || "pending"}`}>
        {comparisonStatus === "matching" ? (
          <div className="success-icon">
            <div className="checkmark">✓</div>
          </div>
        ) : comparisonStatus === "mismatch" ? (
          <div className="error-icon">
            <div className="exclamation">!</div>
          </div>
        ) : (
          <div className="scanning-icon">
            <div className="scan-beam"></div>
          </div>
        )}
      </div>

      {/* Status Message */}
      <div className="status-message">
        {comparisonStatus === "matching" ? (
          <h2 className="success-message">Website Verified</h2>
        ) : comparisonStatus === "mismatch" ? (
          <h2 className="error-message">Security Alert!</h2>
        ) : (
          <h2 className="pending-message">Verifying...</h2>
        )}
        
        <p className="url-display">{url}</p>
        
        {comparisonStatus === "matching" && (
          <p className="status-detail">
            The website's security signature has been verified successfully.
            {verificationTime && ` Last verified at ${verificationTime}.`}
          </p>
        )}
        
        {comparisonStatus === "mismatch" && (
          <p className="status-detail warning">
            This website may be compromised or tampered with.
          </p>
        )}

      </div>

      {/* Hash Comparison Section */}
      <div className={`hash-comparison ${isAnimating ? 'animating' : ''}`}>
        <div className="hash-row">
          <div className="hash-label">Frontend Hash:</div>
          <div className="hash-value">{shortenHash(frontendHash)}</div>
        </div>
        
        <div className="hash-row">
          <div className="hash-label">Contract Hash:</div>
          <div className="hash-value">{shortenHash(contractHash)}</div>
        </div>
        
        {comparisonStatus && (
          <div className="hash-comparison-indicator">
            {comparisonStatus === "matching" ? (
              <div className="matching-indicator">Hashes Match ✓</div>
            ) : (
              <div className="mismatch-indicator">Hashes Don't Match ✗</div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        {comparisonStatus === "matching" ? (
          <button className="button proceed-button" onClick={handleContinueClick}>
            <span className="button-text">Continue to Site</span>
            <span className="button-icon">→</span>
          </button>
        ) : comparisonStatus === "mismatch" ? (
          <div className="warning-buttons">
            <button className="button back-button" onClick={handleGoBackClick}>
              <span className="button-text">Go Back</span>
              <span className="button-icon">←</span>
            </button>
            <button className="button proceed-anyway-button" onClick={handleProceedAnywayClick}>
              <span className="button-text">Proceed at Risk</span>
              <span className="button-icon">⚠️</span>
            </button>
          </div>
        ) : (
          <button className="button cancel-button" onClick={handleCancelClick}>Cancel</button>
        )}
      </div>
      
      {/* Debug/Testing Controls */}
      {/* <div className="debug-controls">
        <button 
          onClick={handleCompareAgain} 
          className="debug-button"
        >
          Run New Verification
        </button>
      </div> */}
    </div>
  )
}

export default HashComparison