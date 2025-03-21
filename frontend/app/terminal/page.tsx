"use client"

import { useEffect, useRef, useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { parseEther } from "viem"
import { useAccount, useBalance, useWriteContract } from "wagmi"

import BashTerminal from "@/components/bash-terminal"

export default function TerminalPage() {
  const [digestId, setDigestId] = useState("")
  const [ipAddress, setIpAddress] = useState("")
  const [deploymentCommand, setDeploymentCommand] = useState(
    "oyster-cvm deploy\n--wallet-private-key $PRIV_KEY\n--duration-in-minutes 15\n--docker-compose docker-compose.yml"
  )
  const [isDeployHovered, setIsDeployHovered] = useState(false)
  const terminalRef = useRef(null)

  const { address, isConnected } = useAccount()
  const { data: usdcBalance } = useBalance({
    address,
    token: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
  })

  const { writeContract, isPending } = useWriteContract()

  const handleSubmit = () => {
    if (digestId && ipAddress) {
      writeContract({
        address: "0x3b53eb6FCc0b0a618db98F05BB4007aFcDbde94d",
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
    }
  }

  const truncateAddress = (address) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const hasEnoughBalance = usdcBalance && parseFloat(usdcBalance.formatted) >= 0
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

  return (
    <div className="bg-black text-cyan-400 min-h-screen p-6 font-mono relative">
      {/* Main Content */}
      <div className="relative max-w-5xl mx-auto">
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
                    ? parseFloat(usdcBalance.formatted).toFixed(2)
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

              <BashTerminal />

              {/* Configuration */}
              <div className="p-6 border-t border-cyan-900/50">
                <div className="space-y-5">
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
                      Digest ID
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
                        disabled={
                          !digestId ||
                          !ipAddress ||
                          !hasEnoughBalance ||
                          isPending
                        }
                        className={`relative px-8 py-3 rounded-xl font-bold overflow-hidden transition-all duration-300 shadow-lg z-20 ${
                          !digestId ||
                          !ipAddress ||
                          !hasEnoughBalance ||
                          isPending
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
