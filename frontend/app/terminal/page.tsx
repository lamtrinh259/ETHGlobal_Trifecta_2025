"use client"

import { useEffect, useRef, useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { CheckCircle2 } from "lucide-react"
import { arbitrumSepolia } from "viem/chains"
import { useAccount, useBalance, useWriteContract } from "wagmi"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface ChatRequest {
  model: string
  messages: ChatMessage[]
  temperature?: number
}

export default function TerminalPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [digestId, setDigestId] = useState("")
  const [ipAddress, setIpAddress] = useState("")
  const [dockerComposePath, setDockerComposePath] = useState("")
  const [deploymentCommand, setDeploymentCommand] = useState(
    'oyster-cvm deploy --bandwidth 50 --wallet-private-key "$PRIV_KEY" --duration-in-minutes "$DURATION_MINUTES" --docker-compose "$DOCKER_COMPOSE_PATH" --instance-type "c6g.xlarge"'
  )
  const [isDeployHovered, setIsDeployHovered] = useState(false)
  const [commandResult, setCommandResult] = useState("")
  const [verifyOutput, setVerifyOutput] = useState("")
  const [executeCommandResult, setExecuteCommandResult] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const terminalRef = useRef(null)
  const [privateKey, setPrivateKey] = useState("")
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [durationMinutes, setDurationMinutes] = useState("15")
  const [isCopied, setIsCopied] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)
  const [dockerComposeContent, setDockerComposeContent] = useState("")
  const [extractionError, setExtractionError] = useState<string | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [pcr0, setPcr0] = useState("")
  const [pcr1, setPcr1] = useState("")
  const [pcr2, setPcr2] = useState("")
  const [isPcrExtracting, setIsPcrExtracting] = useState(false)
  const [pcrExtractionError, setPcrExtractionError] = useState<string | null>(
    null
  )
  const [transactionHash, setTransactionHash] = useState<string | null>(null)

  const { address, isConnected } = useAccount()
  const { data: usdcBalance } = useBalance({
    address,
    token: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  })

  const {
    writeContract,
    isPending,
    isError,
    error,
    data: hash,
  } = useWriteContract()

  // Watch for transaction hash changes to update UI
  useEffect(() => {
    if (hash) {
      setTransactionHash(hash)
    }
  }, [hash])

  const handleSubmit = () => {
    if (digestId && ipAddress) {
      try {
        writeContract({
          address: "0xE0b82507493e0e625f2659608142f1a8F11A31F1",
          chain: arbitrumSepolia,
          abi: [
            { inputs: [], stateMutability: "nonpayable", type: "constructor" },
            {
              inputs: [
                { internalType: "address", name: "owner", type: "address" },
              ],
              name: "OwnableInvalidOwner",
              type: "error",
            },
            {
              inputs: [
                { internalType: "address", name: "account", type: "address" },
              ],
              name: "OwnableUnauthorizedAccount",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "previousOwner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "OwnershipTransferred",
              type: "event",
            },
            {
              inputs: [{ internalType: "string", name: "key", type: "string" }],
              name: "get",
              outputs: [{ internalType: "string", name: "", type: "string" }],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [{ internalType: "address", name: "", type: "address" }],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                { internalType: "string", name: "key", type: "string" },
                { internalType: "string", name: "value", type: "string" },
              ],
              name: "set",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                { internalType: "address", name: "newOwner", type: "address" },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          functionName: "set",
          args: [ipAddress, digestId],
        })
      } catch (error) {
        console.error("Error submitting transaction:", error)
      }
    }
  }

  const truncateAddress = (address) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const hasEnoughBalance =
    usdcBalance && Number.parseFloat(usdcBalance.formatted) >= 0
  const [terminalText, setTerminalText] = useState("")

  useEffect(() => {
    if (deploymentCommand) {
      let i = 0
      const typing = setInterval(() => {
        if (i < deploymentCommand.length) {
          setTerminalText(deploymentCommand.substring(0, i + 1))
          i++
        } else {
          clearInterval(typing)
        }
      }, 25)

      return () => clearInterval(typing)
    }
  }, [deploymentCommand])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(deploymentCommand)
  }

  const focusTerminal = () => {
    if (terminalRef.current) {
      terminalRef.current.focus()
    }
  }

  const handleDeployClick = async () => {
    try {
      setIsExecuting(true)
      setCommandResult("Starting deployment process...\n")

      setCommandResult(
        (prev) => `${prev}Verifying docker-compose.yml exists...\n`
      )

      // Verify the docker-compose file exists
      const fileCheckResponse = await fetch("/api/check-docker-compose")
      if (!fileCheckResponse.ok) {
        throw new Error("docker-compose.yml file not found in assets directory")
      }

      setCommandResult(
        (prev) =>
          `${prev}docker-compose.yml found. Proceeding with deployment...\n\n`
      )

      // Replace variables in the command and ensure it's a single line
      const finalCommand = deploymentCommand
        .replace('"$PRIV_KEY"', `"${privateKey}"`)
        .replace('"$DURATION_MINUTES"', `"${durationMinutes}"`)
        .replace('"$DOCKER_COMPOSE_PATH"', `"${dockerComposePath}"`)
        .replace(/\n/g, " ") // Remove any newlines
        .trim() // Remove any extra spaces

      setCommandResult(
        (prev) => `${prev}\nExecuting command: ${deploymentCommand}\n\n`
      )

      // Execute the command
      const response = await fetch("/api/execute-command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: finalCommand }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to execute command")
      }

      setExecuteCommandResult(data.output)
      setCommandResult(
        (prev) =>
          `${prev}${data.output}\n\nDeployment completed successfully! ✅`
      )
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred"
      setCommandResult(
        (prev) => `${prev}\nError during deployment: ${errorMessage} ❌`
      )
    } finally {
      setIsExecuting(false)
    }
  }

  const copyOutputToClipboard = () => {
    navigator.clipboard.writeText(commandResult)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // Auto scroll to bottom when new content is added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [commandResult])

  // Load docker-compose.yml content
  useEffect(() => {
    async function loadDockerCompose() {
      try {
        const response = await fetch("/api/get-docker-compose")
        const data = await response.json()
        if (response.ok) {
          setDockerComposeContent(data.content)
        } else {
          console.error("Failed to load docker-compose.yml:", data.error)
        }
      } catch (error) {
        console.error("Error loading docker-compose.yml:", error)
      }
    }
    loadDockerCompose()
  }, [])

  // Get the absolute path of docker-compose.yml
  useEffect(() => {
    async function getDockerComposePath() {
      try {
        const response = await fetch("/api/get-docker-compose-path")
        const data = await response.json()
        if (response.ok) {
          setDockerComposePath(data.path)
          console.log("Docker compose path:", data.path)
        } else {
          console.error("Failed to get docker-compose path:", data.error)
        }
      } catch (error) {
        console.error("Error getting docker-compose path:", error)
      }
    }
    getDockerComposePath()
  }, [])

  useEffect(() => {
    if (isError && error) {
      console.error("Contract write error:", error)
    }
  }, [isError, error])

  return (
    <div className="bg-black text-cyan-400 min-h-screen p-6 font-mono relative">
      {/* Main Content */}
      <div className="relative max-w-5xl mx-auto">
        {transactionHash && (
          <Alert className="mb-6 bg-green-900/20 border-green-900/50 text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription className="flex flex-col space-y-2">
              <span>Your transaction has been submitted successfully.</span>
              <a
                href={`https://testnet.routescan.io/tx/${transactionHash}?chainid=421614`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline transition-colors flex items-center"
              >
                <span>View on Explorer</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </AlertDescription>
          </Alert>
        )}
        <div className="flex items-center justify-between mb-8">
          <ConnectButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel - Account Info */}
          <div className="lg:col-span-2 bg-gray-900 rounded-2xl border border-cyan-900/50 p-6 shadow-xl">
            <h2 className="text-lg font-medium border-b border-cyan-900/50 pb-3 mb-6 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-cyan-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 16a1 1 0 01-2 0 7.986 7.986 0 012.973-6.256A7 7 0 0110 8zm3.971 6c-.089-.405-.222-.824-.395-1.235A6.961 6.961 0 0110 12c-.385 0-.761.039-1.124.115-.32.438-.606.926-.85 1.452.248.331.531.63.841.889A5.98 5.98 0 0012 16a1 1 0 102 0c0-.731-.129-1.431-.365-2.083A6.961 6.961 0 0114 13c.222 0 .44.019.654.054.218.36.416.74.583 1.135.202.481.369.983.499 1.494A1 1 0 1117 16a5.986 5.986 0 01-.443-1.772A6.972 6.972 0 0116 13c-.757 0-1.492.107-2.184.308z"
                  clipRule="evenodd"
                />
              </svg>
              Account Status
            </h2>

            <div className="space-y-6">
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-xl border border-gray-700">
                <span className="text-gray-400">Network:</span>
                <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-purple-300 font-medium">Arbitrum</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-xl border border-gray-700">
                <span className="text-gray-400">Status:</span>
                <div className="flex items-center bg-green-900/30 px-3 py-1 rounded-full border border-green-900/30">
                  <span className="text-green-400 font-medium">Active</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-xl border border-gray-700">
                <span className="text-gray-400">USDC Balance:</span>
                <div
                  className={`${
                    !hasEnoughBalance
                      ? "text-red-400 bg-red-900/30"
                      : "text-cyan-300 bg-cyan-900/30"
                  } font-bold px-3 py-1 rounded-full border ${
                    !hasEnoughBalance
                      ? "border-red-900/30"
                      : "border-cyan-900/30"
                  }`}
                >
                  {usdcBalance
                    ? Number.parseFloat(usdcBalance.formatted).toFixed(2)
                    : "50"}{" "}
                  USDC
                </div>
              </div>

              {!hasEnoughBalance && (
                <a
                  href="https://bridge.arbitrum.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-4 px-4 py-3 bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 text-white rounded-xl text-center transition-colors duration-200 font-medium shadow-lg shadow-purple-900/50"
                >
                  Add Funds
                </a>
              )}

              <div className="mt-6 pt-4 border-t border-cyan-900/30">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Deployment Readiness</span>
                  <span
                    className={
                      hasEnoughBalance ? "text-green-400" : "text-red-400"
                    }
                  >
                    {hasEnoughBalance ? "Ready" : "Insufficient Funds"}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner border border-gray-700">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                      hasEnoughBalance
                        ? "bg-gradient-to-r from-emerald-500 to-green-500"
                        : "bg-gradient-to-r from-red-500 to-red-400"
                    }`}
                    style={{ width: hasEnoughBalance ? "100%" : "30%" }}
                  ></div>
                </div>
              </div>

              {/* Deployer Private Key */}
              <div className="mt-6 pt-4 border-t border-cyan-900/30">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Deployer Private Key</span>
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {showPrivateKey ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPrivateKey ? "text" : "password"}
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    placeholder="Enter your private key"
                    className="w-full bg-gray-800 rounded-xl p-3 border border-gray-700 font-mono text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  {privateKey && (
                    <button
                      onClick={() => navigator.clipboard.writeText(privateKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors"
                      title="Copy private key"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {privateKey && (
                  <p className="mt-2 text-xs text-amber-400">
                    ⚠️ Never share your private key. Keep it secure.
                  </p>
                )}
              </div>

              {/* Duration in minutes */}
              <div className="mt-6 pt-4 border-t border-cyan-900/30">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Duration (minutes)</span>
                  <span className="text-xs text-cyan-400">Min: 5</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    value={durationMinutes}
                    onChange={(e) => {
                      const value = Math.max(
                        Number.parseInt(e.target.value) || 5,
                        5
                      )
                      setDurationMinutes(value.toString())
                    }}
                    placeholder="Enter duration in minutes"
                    className="w-full bg-gray-800 rounded-xl p-3 border border-gray-700 font-mono text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-2">
                    <button
                      onClick={() =>
                        setDurationMinutes((prev) =>
                          (Number.parseInt(prev) + 5).toString()
                        )
                      }
                      className="text-cyan-400 hover:text-cyan-300 transition-colors p-1"
                      title="Increase by 5 minutes"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setDurationMinutes((prev) =>
                          Math.max(Number.parseInt(prev) - 5, 5).toString()
                        )
                      }
                      className="text-cyan-400 hover:text-cyan-300 transition-colors p-1"
                      title="Decrease by 5 minutes"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Deployment will automatically terminate after the specified
                  duration
                </p>
              </div>

              {/* docker-compose.yml */}
              <div className="mt-6 pt-4 border-t border-cyan-900/30">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">docker-compose.yml</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      /assets/docker/wordpress/docker-compose.yml
                    </span>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(dockerComposeContent)
                      }
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    readOnly
                    value={dockerComposeContent}
                    className="w-full h-48 bg-gray-800 rounded-xl p-3 border border-gray-700 font-mono text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  This configuration will be used for deploying your WordPress
                  instance
                </p>
              </div>
            </div>
          </div>

          {/* Right Side Panels */}
          <div className="lg:col-span-3 space-y-6">
            {/* Terminal and Configuration Combined */}
            <div className="bg-gray-900 rounded-2xl border border-cyan-900/50 overflow-hidden shadow-xl">
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-cyan-900/50 px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs text-gray-400">
                  deployment_terminal
                </span>
                <div></div>
              </div>

              <div
                className="p-4 h-28 overflow-auto bg-black border border-gray-800 focus-within:border-cyan-700 cursor-text relative"
                onClick={focusTerminal}
              >
                <div className="mb-4 flex items-center">
                  <span className="text-green-500 mr-2">$</span>
                  <span className="text-cyan-300">{terminalText}</span>
                  <span className="animate-pulse">_</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard()
                    }}
                    className="ml-4 p-1 text-gray-400 hover:text-cyan-400 transition-colors"
                    title="Copy to clipboard"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                  </button>
                </div>
                <div style={{ position: "absolute", left: "-9999px" }}>
                  <textarea
                    ref={terminalRef}
                    aria-hidden="true"
                    tabIndex={-1}
                    className="opacity-0 h-0 w-0"
                  />
                </div>
              </div>

              <div className="mt-4 p-4 border-t border-cyan-900/50">
                <div className="flex justify-end">
                  <button
                    onClick={handleDeployClick}
                    disabled={isExecuting}
                    className={`relative px-8 py-3 rounded-xl font-bold overflow-hidden transition-all duration-300 shadow-lg z-20 ${
                      isExecuting
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-cyan-600/30"
                    }`}
                  >
                    {isExecuting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Deploying...</span>
                      </div>
                    ) : (
                      "Deploy TEE"
                    )}
                  </button>
                </div>
              </div>

              {/* Deployment Output */}
              <div className="bg-black border border-gray-800 focus-within:border-cyan-700 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between border-b border-cyan-900/50 px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs text-gray-400">
                    deployment_output
                  </span>
                  <button
                    onClick={copyOutputToClipboard}
                    className="flex items-center space-x-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-cyan-400 transition-colors"
                    title="Copy output"
                  >
                    {isCopied ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path
                            fillRule="evenodd"
                            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div
                  ref={outputRef}
                  className="p-4 h-96 overflow-auto font-mono text-sm scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600"
                >
                  {commandResult.split("\n").map((line, index) => (
                    <div key={index} className="flex">
                      {index === 0 && (
                        <span className="text-green-500 mr-2">$</span>
                      )}
                      <span className="text-cyan-300 whitespace-pre-wrap">
                        {line}
                      </span>
                      {index === commandResult.split("\n").length - 1 && (
                        <span className="animate-pulse ml-1">_</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Extract Deployment Values */}
              <div className="mt-4 p-4 border-t border-cyan-900/50">
                <div className="flex justify-end">
                  <Button
                    onClick={async () => {
                      try {
                        setIsExtracting(true)
                        setExtractionError(null)

                        const userMessage: ChatMessage = {
                          role: "user",
                          content:
                            "Extract the IP address and the digest from the following text: " +
                            executeCommandResult +
                            " Return only a JSON with the values for the ip , digest and jobId, totalCost, totalRate, approvalTransaction. Don't return comment just the JSON object. Dont thrturn the word ```json or ```, just the plain JSON OBJECT",
                        }

                        console.log("****** userMessage:", userMessage)

                        const response = await fetch(
                          "/api/nillion-extract-info",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              messages: [...messages, userMessage],
                            }),
                          }
                        )

                        if (!response.ok) {
                          throw new Error(
                            "Failed to extract values from deployment output"
                          )
                        }

                        const data = await response.json()

                        const extractedData = data.choices[0].message.content
                        const jsonData = JSON.parse(extractedData)

                        if (!jsonData.ip || !jsonData.digest) {
                          throw new Error(
                            "Could not find IP or digest in the deployment output"
                          )
                        }

                        setIpAddress(jsonData.ip)
                        setDigestId(jsonData.digest)
                      } catch (error) {
                        console.error("Error extracting values:", error)
                        setExtractionError(
                          error instanceof Error
                            ? error.message
                            : "Failed to extract values"
                        )
                      } finally {
                        setIsExtracting(false)
                      }
                    }}
                    className={`relative px-8 py-3 rounded-xl font-bold overflow-hidden transition-all duration-300 shadow-lg z-20 ${
                      !commandResult || isExtracting
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-cyan-600/30"
                    }`}
                    disabled={!commandResult || isExtracting}
                  >
                    {isExtracting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Extracting Values...</span>
                      </div>
                    ) : (
                      "Get IP and Digest"
                    )}
                  </Button>
                </div>

                {extractionError && (
                  <div className="mt-2 p-2 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm">
                    {extractionError}
                  </div>
                )}

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-cyan-300 mb-2 text-sm font-medium">
                      Extracted IP Address
                    </label>
                    <input
                      type="text"
                      value={ipAddress}
                      readOnly
                      className="w-full bg-gray-800 border border-cyan-900/70 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-300 mb-2 text-sm font-medium">
                      Extracted Digest ID
                    </label>
                    <input
                      type="text"
                      value={digestId}
                      readOnly
                      className="w-full bg-gray-800 border border-cyan-900/70 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Verify deployment */}
              <div className="mt-4 p-4 border-t border-cyan-900/50">
                {/* Verify Terminal */}
                <div className="bg-black border border-gray-800 focus-within:border-cyan-700 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between border-b border-cyan-900/50 px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs text-gray-400">
                      verify_terminal
                    </span>
                    <div></div>
                  </div>

                  <div className="p-4 h-28 overflow-auto bg-black border border-gray-800 focus-within:border-cyan-700 cursor-text relative">
                    <div className="mb-4 flex items-center">
                      <span className="text-green-500 mr-2">$</span>
                      <span className="text-cyan-300">
                        {`oyster-cvm verify --enclave-ip ${
                          ipAddress || "$IP"
                        } --user-data ${
                          digestId || "$DIGEST"
                        } --pcr-preset base/blue/v1.0.0/arm64`}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `oyster-cvm verify --enclave-ip ${ipAddress} --user-data ${digestId} --pcr-preset base/blue/v1.0.0/arm64`
                          )
                        }}
                        className="ml-4 p-1 text-gray-400 hover:text-cyan-400 transition-colors"
                        title="Copy to clipboard"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 p-4 border-t border-cyan-900/50">
                    <div className="flex justify-end">
                      <button
                        onClick={async () => {
                          try {
                            setIsVerifying(true)
                            setVerifyOutput(
                              "Starting verification process...\n"
                            )

                            const verifyCommand = `oyster-cvm verify --enclave-ip ${ipAddress} --pcr-preset base/blue/v1.0.0/arm64`

                            const response = await fetch(
                              "/api/execute-command",
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  command: verifyCommand,
                                }),
                              }
                            )

                            const data = await response.json()

                            if (!response.ok) {
                              throw new Error(
                                data.error ||
                                  "Failed to execute verification command"
                              )
                            }

                            setVerifyOutput(
                              (prev) =>
                                `${prev}${data.output}\n\nVerification completed successfully! ✅`
                            )
                          } catch (error) {
                            const errorMessage =
                              error instanceof Error
                                ? error.message
                                : "An unknown error occurred"
                            setVerifyOutput(
                              (prev) =>
                                `${prev}\nError during verification: ${errorMessage} ❌`
                            )
                          } finally {
                            setIsVerifying(false)
                          }
                        }}
                        disabled={!ipAddress || !digestId || isVerifying}
                        className={`relative px-8 py-3 rounded-xl font-bold overflow-hidden transition-all duration-300 shadow-lg z-20 ${
                          !ipAddress || !digestId || isVerifying
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-cyan-600/30"
                        }`}
                      >
                        {isVerifying ? (
                          <div className="flex items-center justify-center space-x-2">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span>Verifying...</span>
                          </div>
                        ) : (
                          "Verify TEE"
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Verify Output */}
                <div className="mt-4 bg-black border border-gray-800 focus-within:border-cyan-700 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between border-b border-cyan-900/50 px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs text-gray-400">verify_output</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(verifyOutput)
                        setIsCopied(true)
                        setTimeout(() => setIsCopied(false), 2000)
                      }}
                      className="flex items-center space-x-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-cyan-400 transition-colors"
                      title="Copy output"
                    >
                      {isCopied ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path
                              fillRule="evenodd"
                              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                            />
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div
                    ref={outputRef}
                    className="p-4 h-96 overflow-auto font-mono text-sm scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600"
                  >
                    {verifyOutput.split("\n").map((line, index) => (
                      <div key={index} className="flex">
                        {index === 0 && (
                          <span className="text-green-500 mr-2">$</span>
                        )}
                        <span className="text-cyan-300 whitespace-pre-wrap">
                          {line}
                        </span>
                        {index === verifyOutput.split("\n").length - 1 && (
                          <span className="animate-pulse ml-1">_</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Extract PCR0, PCR1, PCR2 */}
              <div className="mt-4 p-4 border-t border-cyan-900/50">
                <div className="flex justify-end">
                  <Button
                    onClick={async () => {
                      try {
                        setIsPcrExtracting(true)
                        setPcrExtractionError(null)

                        const userMessage: ChatMessage = {
                          role: "user",
                          content:
                            "Extract the PCR0, PCR1, and PCR2 values from the following text: " +
                            verifyOutput +
                            " Return only a JSON with the values for pcr0, pcr1, and pcr2. Don't return comment just the JSON object. Don't return the word ```json or ```, just the plain JSON OBJECT",
                        }

                        const response = await fetch(
                          "/api/nillion-extract-info",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              messages: [...messages, userMessage],
                            }),
                          }
                        )

                        if (!response.ok) {
                          throw new Error(
                            "Failed to extract PCR values from verification output"
                          )
                        }

                        const data = await response.json()
                        const extractedData = data.choices[0].message.content
                        const jsonData = JSON.parse(extractedData)

                        if (
                          !jsonData.pcr0 ||
                          !jsonData.pcr1 ||
                          !jsonData.pcr2
                        ) {
                          throw new Error(
                            "Could not find PCR values in the verification output"
                          )
                        }

                        setPcr0(jsonData.pcr0)
                        setPcr1(jsonData.pcr1)
                        setPcr2(jsonData.pcr2)
                      } catch (error) {
                        console.error("Error extracting PCR values:", error)
                        setPcrExtractionError(
                          error instanceof Error
                            ? error.message
                            : "Failed to extract PCR values"
                        )
                      } finally {
                        setIsPcrExtracting(false)
                      }
                    }}
                    className={`relative px-8 py-3 rounded-xl font-bold overflow-hidden transition-all duration-300 shadow-lg z-20 ${
                      !verifyOutput || isPcrExtracting
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-cyan-600/30"
                    }`}
                    disabled={!verifyOutput || isPcrExtracting}
                  >
                    {isPcrExtracting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Extracting PCR Values...</span>
                      </div>
                    ) : (
                      "Get PCR Values"
                    )}
                  </Button>
                </div>

                {pcrExtractionError && (
                  <div className="mt-2 p-2 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm">
                    {pcrExtractionError}
                  </div>
                )}

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-cyan-300 mb-2 text-sm font-medium">
                      PCR0 Value
                    </label>
                    <input
                      type="text"
                      value={pcr0}
                      readOnly
                      className="w-full bg-gray-800 border border-cyan-900/70 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white shadow-sm font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-300 mb-2 text-sm font-medium">
                      PCR1 Value
                    </label>
                    <input
                      type="text"
                      value={pcr1}
                      readOnly
                      className="w-full bg-gray-800 border border-cyan-900/70 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white shadow-sm font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-300 mb-2 text-sm font-medium">
                      PCR2 Value
                    </label>
                    <input
                      type="text"
                      value={pcr2}
                      readOnly
                      className="w-full bg-gray-800 border border-cyan-900/70 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white shadow-sm font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Configuration */}
              <div className="p-6 border-t border-cyan-900/50">
                <div className="space-y-5">
                  <h3>Add Details</h3>
                  <div>
                    <label className="block text-cyan-300 mb-2 text-sm font-medium">
                      IP Address
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        placeholder="Enter IP address"
                        className="w-full bg-gray-800 border border-cyan-900/70 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white shadow-sm"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-cyan-300 mb-2 text-sm font-medium">
                      PCR Value
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={digestId}
                        onChange={(e) => setDigestId(e.target.value)}
                        placeholder="Enter Digest ID"
                        className="w-full bg-gray-800 border border-cyan-900/70 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white shadow-sm"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <div
                      className="relative"
                      onMouseEnter={() => setIsDeployHovered(true)}
                      onMouseLeave={() => setIsDeployHovered(false)}
                    >
                      <button
                        onClick={handleSubmit}
                        disabled={!digestId || isPending}
                        className={`relative px-8 py-3 rounded-xl font-bold overflow-hidden transition-all duration-300 shadow-lg z-20 ${
                          !digestId || isPending
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-cyan-600/30"
                        }`}
                      >
                        {isPending ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Deploying...
                          </div>
                        ) : (
                          "Deploy Shield"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
