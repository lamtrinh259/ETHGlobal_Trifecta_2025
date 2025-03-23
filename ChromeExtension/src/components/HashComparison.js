"use client"

import { useState, useEffect } from "react"
import "../styles/HashComparison.css"

function HashComparison({ success, url, onClose }) {
  const [frontendHash, setFrontendHash] = useState("")
  const [contractHash, setContractHash] = useState("")
  const [securityScore, setSecurityScore] = useState(0)
  const [verificationTime, setVerificationTime] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [comparisonStatus, setComparisonStatus] = useState(null) // Used for UI states

  useEffect(() => {
    // Simulate initial loading
    const loadingTimer = setTimeout(() => {
      // Generate mock hashes for display
      const mockFrontendHash = generateMockHash(url || "")
      setFrontendHash(mockFrontendHash)
      
      // If success is true, make hashes match; otherwise, make them different
      const mockContractHash = success 
        ? mockFrontendHash 
        : generateMockHash(url + Date.now())
      setContractHash(mockContractHash)
      
      // Set security score (0-100)
      const score = success ? 
        Math.floor(85 + Math.random() * 15) : // 85-100 if matching
        Math.floor(15 + Math.random() * 50)   // 15-65 if mismatching
      setSecurityScore(score)
      
      // Set verification timestamp
      setVerificationTime(new Date().toLocaleTimeString())
      
      // Show animation for a moment before showing the final result
      setIsLoading(false)
      
      // Set final comparison status after a slight delay for better UX
      setTimeout(() => {
        setComparisonStatus(success ? "matching" : "mismatch")
      }, 500)
    }, 1500)
    
    return () => clearTimeout(loadingTimer)
  }, [success, url])

  // Helper function to generate a mock hash
  const generateMockHash = (input) => {
    let hash = "0x"
    const chars = "0123456789abcdef"
    for (let i = 0; i < 64; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return hash
  }

  // Function to shorten a hash for display
  const shortenHash = (hash) => {
    if (!hash) return ""
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}`
  }

  // Function to close the popup
  const closePopup = () => {
    if (onClose) {
      onClose()
    } else {
      window.close()
    }
  }

  // Function to handle "Continue to Site" button click
  const handleContinueClick = () => {
    closePopup()
  }

  // Function to handle "Go Back" button click
  const handleGoBackClick = () => {
    closePopup()
  }

  // Function to handle "Proceed at Risk" button click
  const handleProceedAnywayClick = () => {
    closePopup()
  }

  // Function to handle "Cancel" button click
  const handleCancelClick = () => {
    closePopup()
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
          </p>
        )}
        
        {comparisonStatus === "mismatch" && (
          <p className="status-detail warning">
            This website may be compromised or tampered with.
          </p>
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
             
            </button>
            <button className="button proceed-anyway-button" onClick={handleProceedAnywayClick}>
              <span className="button-text">Proceed at Risk</span>
             
            </button>
          </div>
        ) : (
          <button className="button cancel-button" onClick={handleCancelClick}>Cancel</button>
        )}
      </div>
    </div>
  )
}

export default HashComparison