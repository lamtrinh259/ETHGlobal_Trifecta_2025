"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  LayoutGrid,
  RefreshCcw,
  Send,
  ReceiptIcon as ReceiveIcon,
  BookOpen,
  Settings,
  Plus,
  Clock,
  Share2,
  Info,
  Bookmark,
  HelpCircle,
  Bell,
  ChevronDown,
} from "lucide-react"

export default function HomePage() {
  const searchParams = useSearchParams()
  const safeId = searchParams.get("safe") || "eth.default_safe"

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Sidebar */}
      <div className="w-[200px] border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mr-3 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-400">eth0x93d6...A55E</div>
              <div className="font-medium">$0</div>
            </div>
            <button className="ml-auto text-gray-400">
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <button className="flex flex-col items-center justify-center p-2 bg-gray-900 rounded-md hover:bg-gray-800">
              <LayoutGrid size={16} className="mb-1" />
              <span className="text-xs">Apps</span>
            </button>
            <button className="flex flex-col items-center justify-center p-2 bg-gray-900 rounded-md hover:bg-gray-800">
              <RefreshCcw size={16} className="mb-1" />
              <span className="text-xs">Swap</span>
            </button>
            <button className="flex flex-col items-center justify-center p-2 bg-gray-900 rounded-md hover:bg-gray-800">
              <Send size={16} className="mb-1" />
              <span className="text-xs">Send</span>
            </button>
          </div>

          <Button className="w-full bg-green-500 hover:bg-green-600 text-black">New transaction</Button>
        </div>

        <nav className="flex-1 py-2">
          <Link href="/home" className="flex items-center px-4 py-2 text-white bg-gray-800">
            <Home size={18} className="mr-3" />
            <span>Home</span>
          </Link>
          <Link href="#" className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white">
            <LayoutGrid size={18} className="mr-3" />
            <span>Assets</span>
          </Link>
          <Link href="#" className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white">
            <RefreshCcw size={18} className="mr-3" />
            <span>Swap</span>
          </Link>
          <Link href="#" className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-3"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>Stake</span>
          </Link>
          <Link href="#" className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white">
            <Clock size={18} className="mr-3" />
            <span>Transactions</span>
          </Link>
          <Link href="#" className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white">
            <BookOpen size={18} className="mr-3" />
            <span>Address book</span>
          </Link>
          <Link href="#" className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white">
            <LayoutGrid size={18} className="mr-3" />
            <span>Apps</span>
          </Link>
          <Link href="#" className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white">
            <Settings size={18} className="mr-3" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="mt-auto border-t border-gray-800 py-2">
          <Link href="#" className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-3"
            >
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9" />
              <path d="M18 2v8h8" />
              <path d="M22 2 12 12" />
            </svg>
            <span>What's new</span>
          </Link>
          <Link href="#" className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white">
            <HelpCircle size={18} className="mr-3" />
            <span>Need help?</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-gray-800 py-3 px-4 flex items-center justify-between sticky top-0 bg-black z-10">
          <div className="flex items-center">
            <h1 className="font-bold text-sm">Safe (WALLET)</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span className="text-sm">0</span>
            </div>

            <div className="flex items-center space-x-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="text-sm">0</span>
            </div>

            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
              <Bell size={18} />
            </Button>

            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
              <Settings size={18} />
            </Button>

            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium">
                JD
              </div>
              <div className="flex flex-col text-xs">
                <span>juliocruz.eth</span>
                <span className="text-gray-400">0.0477 ETH</span>
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </div>

            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                E
              </div>
              <div className="flex flex-col text-xs">
                <span>Ethereum</span>
                <span className="text-gray-400">$0</span>
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-sm text-gray-400">Total asset value</div>
              <div className="text-4xl font-bold">
                $0<span className="text-gray-500">.00</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button className="bg-green-500 hover:bg-green-600 text-black">
                <Plus size={16} className="mr-2" /> Buy crypto
              </Button>
              <Button variant="outline" className="border-gray-700">
                <Send size={16} className="mr-2" /> Send
              </Button>
              <Button variant="outline" className="border-gray-700">
                <ReceiveIcon size={16} className="mr-2" /> Receive
              </Button>
              <Button variant="outline" className="border-gray-700">
                <RefreshCcw size={16} className="mr-2" /> Swap
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Assets */}
            <div>
              <h2 className="text-lg font-medium mb-4">Top assets</h2>
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">Add funds to get started</h3>
                <p className="text-gray-400 mb-4">
                  Add funds directly from your bank account or copy your address to send tokens from a different
                  account.
                </p>
                <Button className="bg-green-500 hover:bg-green-600 text-black">
                  <Plus size={16} className="mr-2" /> Buy crypto
                </Button>
              </div>
            </div>

            {/* Pending Transactions */}
            <div>
              <h2 className="text-lg font-medium mb-4">Pending transactions</h2>
              <div className="bg-gray-900 rounded-lg p-6 flex flex-col items-center justify-center text-center h-[200px]">
                <div className="mb-4 text-gray-400">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <p className="text-gray-400">This Safe Account has no queued transactions</p>
              </div>
            </div>
          </div>

          {/* Safe Apps */}
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Safe Apps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-900 rounded-lg p-4 relative">
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button className="text-gray-500 hover:text-gray-300">
                    <Info size={16} />
                  </button>
                  <button className="text-gray-500 hover:text-gray-300">
                    <Share2 size={16} />
                  </button>
                  <button className="text-gray-500 hover:text-gray-300">
                    <Bookmark size={16} />
                  </button>
                </div>
                <div className="flex items-start mb-4 mt-4">
                  <div className="h-12 w-12 rounded-md bg-blue-900 flex items-center justify-center mr-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <path
                        d="M16 12L12 8M12 8L8 12M12 8V16"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">1inch Network</h3>
                      <Badge className="ml-2 bg-yellow-500 text-black">1</Badge>
                    </div>
                    <p className="text-xs text-gray-400">The most efficient defi aggregator</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    Aggregator
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    DeFi
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    DEX
                  </Badge>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 relative">
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button className="text-gray-500 hover:text-gray-300">
                    <Info size={16} />
                  </button>
                  <button className="text-gray-500 hover:text-gray-300">
                    <Share2 size={16} />
                  </button>
                  <button className="text-gray-500 hover:text-gray-300">
                    <Bookmark size={16} />
                  </button>
                </div>
                <div className="flex items-start mb-4 mt-4">
                  <div className="h-12 w-12 rounded-md bg-blue-500 flex items-center justify-center mr-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="4" width="20" height="16" rx="2" stroke="white" strokeWidth="2" />
                      <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" stroke="white" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">CoW Swap</h3>
                      <Badge className="ml-2 bg-yellow-500 text-black">2</Badge>
                    </div>
                    <p className="text-xs text-gray-400">
                      CoW Swap finds the lowest prices from all decentralized exchanges and DEX aggregators & saves you
                      more with p2p trading and protection from MEV
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    Aggregator
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    DAO Tooling
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    MEV Protection
                  </Badge>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 flex flex-col items-center justify-center text-center h-[180px]">
                <div className="mb-4 text-green-500">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                    <path d="M11 8v6M8 11h6" />
                  </svg>
                </div>
                <Button className="bg-green-500 hover:bg-green-600 text-black">Explore Safe Apps</Button>
              </div>
            </div>
          </div>

          {/* Governance */}
          <div className="mt-8 mb-8">
            <h2 className="text-lg font-medium mb-2">Governance</h2>
            <p className="text-gray-400 text-sm">
              Use your SAFE tokens to vote on important proposals or participate in forum discussions.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

