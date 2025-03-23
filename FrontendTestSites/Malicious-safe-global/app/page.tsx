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
  AlertTriangle,
  ShieldX,
} from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import TransactionHistoryPage from "@/app/home/components/TransactionHistory";
import { useAccount, useBalance, usePublicClient, useWalletClient } from "wagmi";
import { useState, useEffect } from "react";
import { formatEther, parseEther } from "viem";

export default function MainApp() {
  const { address, isConnected } = useAccount();
  const [showWarning, setShowWarning] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  
  // Setup our clients
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  
  // Fetch balance of connected address
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address: address,
  });
  
  // Dummy address (this would be the malicious address in a real scam)
  const scammerAddress = "0x0000000000000000000000000000000000000000";
  
  // Function to handle sending ETH (eth_sendTransaction)
  const handleSendTransaction = async () => {
    if (!walletClient || !address) return;
    
    try {
      setIsLoading(true);
      
      // This will trigger an eth_sendTransaction request
      const hash = await walletClient.sendTransaction({
        to: scammerAddress,
        value: parseEther("0.01"), // Send 0.01 ETH
        account: address,
      });
      
      setTransactionHash(hash);
      alert(`Transaction submitted! Hash: ${hash}`);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to simulate buy crypto
  const handleBuyCrypto = async () => {
    if (!address) return;
    
    try {
      setIsLoading(true);

      alert("Redirecting to crypto purchase partner...");
      // In a real scam, this might open a fake payment form
    } catch (error) {
      console.error("Buy crypto failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!walletClient || !address) return;
    
    try {
      setIsLoading(true);
      const hash = await walletClient.sendTransaction({
        to: scammerAddress,
        value: parseEther("0.005"), // Send 0.005 ETH
        account: address,
      });
      
      setTransactionHash(hash);
      alert(`Transfer initiated! Hash: ${hash}`);
    } catch (error) {
      console.error("Transfer failed:", error);
      alert("Transfer failed. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const truncateAddress = (addr:any) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  

  const formatBalance = () => {
    if (isBalanceLoading || !balanceData) return "0.00";
    
    const balanceInEth = parseFloat(formatEther(balanceData.value));
    return balanceInEth.toFixed(2);
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="bg-red-900/80 py-1 border-b border-red-800/50 px-4">
        <div className="flex items-center justify-center">
          <AlertTriangle size={14} className="text-red-300 mr-2" />
          <span className="text-sm font-medium text-red-200">
            Warning: This site is not secure. Do not connect wallet or share information.
          </span>
        </div>
      </div>

      {showWarning && (
        <div className="bg-gray-900 p-3 border-b border-gray-800">
          <div className="flex items-start max-w-4xl mx-auto">
            <AlertTriangle className="text-red-400 mr-3 mt-0.5 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-gray-300 text-sm">
                <span className="text-red-400 font-medium">Security Notice:</span> This appears to be a fraudulent website. Protect your assets and exit immediately.
              </p>
            </div>
            <button 
              onClick={() => setShowWarning(false)} 
              className="text-gray-500 hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        <div className="w-[200px] border-r border-gray-800 flex flex-col relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-10">
            <div className="rotate-45 text-red-600 font-bold text-2xl py-2 px-16">
              CAUTION
            </div>
          </div>
          
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
                <div className="text-xs text-gray-400">{truncateAddress(address)}</div>
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
              <Clock size={18} className="mr-3" />
              <span>Transactions</span>
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

        <div className="flex-1 overflow-auto relative">
          <header className="border-b border-gray-800 py-3 px-4 flex items-center justify-between sticky top-0 bg-black/95 z-10">
            <div className="flex items-center">
              <h1 className="font-bold text-md text-red-600">FAKE Safe (WALLET)</h1>
              <Badge className="ml-2 bg-gray-700 text-red-300 text-md border border-red-500/30">MALICIOUS</Badge>
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
                <div className="relative">
                  <ConnectButton />
                  <div className="absolute inset-0 border border-red-500/30 rounded pointer-events-none"></div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="text-sm text-gray-400">Total asset value</div>
                <div className="text-4xl font-bold">
                  ${isBalanceLoading ? (
                    <span className="text-gray-500">Loading...</span>
                  ) : (
                    <>
                      {formatBalance().split('.')[0]}
                      <span className="text-gray-500">.{formatBalance().split('.')[1]}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-black"
                  onClick={handleTransfer}
                  disabled={!isConnected || isLoading}
                >
                  {isLoading ? "Processing..." : "Transfer"}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-700"
                  onClick={handleSendTransaction}
                  disabled={!isConnected || isLoading}
                >
                  <Send size={16} className="mr-2" /> Send
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-700"
                  onClick={handleBuyCrypto}
                  disabled={!isConnected || isLoading}
                >
                  <Plus size={16} className="mr-2" /> Buy
                </Button>
                <Button variant="outline" className="border-gray-700">
                  <RefreshCcw size={16} className="mr-2" /> Swap
                </Button>
              </div>
            </div>

            <div className="mb-6 bg-gray-900 border border-gray-800 rounded-md p-3">
              <div className="flex items-center">
                <AlertTriangle size={16} className="text-yellow-500 mr-2" />
                <span className="text-sm text-gray-300">
                  This wallet interface has not been verified. Exercise caution when making transactions.
                </span>
              </div>
            </div>

            {transactionHash && (
              <div className="mb-6 bg-green-900/20 border border-green-800/30 rounded-md p-3">
                <div className="flex items-center">
                  <Info size={16} className="text-green-500 mr-2" />
                  <span className="text-sm text-green-300">
                    Transaction submitted! Hash: {truncateAddress(transactionHash)}
                  </span>
                </div>
              </div>
            )}

            <TransactionHistoryPage />
          </main>
        </div>
      </div>

      <div className="bg-gray-900 py-2 border-t border-gray-800 text-center text-xs text-gray-500">
        Warning: This site is not affiliated with the official Safe wallet. Use at your own risk.
      </div>
    </div>
  );
}