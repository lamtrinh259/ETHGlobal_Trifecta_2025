"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import TransactionHistoryPage from "./components/TransactionHistory";

export default function HomePage() {
  const searchParams = useSearchParams();
  const safeId = searchParams.get("safe") || "eth.default_safe";

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Sidebar */}
      <div className="w-[200px] border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mr-3 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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

          <Button className="w-full bg-green-500 hover:bg-green-600 text-black">
            New transaction
          </Button>
        </div>

        <nav className="flex-1 py-2">
          <Link
            href="/home"
            className="flex items-center px-4 py-2 text-white bg-gray-800"
          >
            <Home size={18} className="mr-3" />
            <span>Home</span>
          </Link>
          <Link
            href="#"
            className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <LayoutGrid size={18} className="mr-3" />
            <span>Assets</span>
          </Link>
          <Link
            href="#"
            className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <RefreshCcw size={18} className="mr-3" />
            <span>Swap</span>
          </Link>
          <Link
            href="#"
            className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
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
          <Link
            href="#"
            className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <Clock size={18} className="mr-3" />
            <span>Transactions</span>
          </Link>
          <Link
            href="#"
            className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <BookOpen size={18} className="mr-3" />
            <span>Address book</span>
          </Link>
          <Link
            href="#"
            className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <LayoutGrid size={18} className="mr-3" />
            <span>Apps</span>
          </Link>
          <Link
            href="#"
            className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <Settings size={18} className="mr-3" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="mt-auto border-t border-gray-800 py-2">
          <Link
            href="#"
            className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
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
          <Link
            href="#"
            className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
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

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400"
            >
              <Bell size={18} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400"
            >
              <Settings size={18} />
            </Button>

            <div className="flex items-center space-x-2">
              <ConnectButton />
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

          <TransactionHistoryPage />
        </main>
      </div>
    </div>
  );
}
