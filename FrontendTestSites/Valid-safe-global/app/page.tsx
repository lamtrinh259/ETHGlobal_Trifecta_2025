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
import TransactionHistoryPage from "@/app/home/components/TransactionHistory";
import { useAccount, useBalance, usePublicClient, useWalletClient } from "wagmi";
import { useState, useEffect } from "react";
import { formatEther, parseEther } from "viem";

export default function MainApp() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<any>("");
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [amount, setAmount] = useState("0.01");
  const [recipientAddress, setRecipientAddress] = useState("");
  
  // Set up clients
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  
  // Fetch balance of connected address
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address: address,
  });
  
  const truncateAddress = (addr:any) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  // Format balance for display
  const formatBalance = () => {
    if (isBalanceLoading || !balanceData) return "0.00";
    const balanceInEth = parseFloat(formatEther(balanceData.value));
    return balanceInEth.toFixed(2);
  };
  
  // Function to handle sending ETH
  const handleSendTransaction = async () => {
    if (!walletClient || !address) return;
    
    try {
      setIsLoading(true);
      
      // Using eth_sendTransaction
      const hash = await walletClient.sendTransaction({
        to: recipientAddress || "0x0000000000000000000000000000000000000000" as `0x${string}`, // Default to zero address if none provided
        value: parseEther(amount),
        account: address,
      });
      
      setTransactionHash(hash);
      setShowTransactionModal(false);
      
      // Show success notification
      alert(`Transaction sent! Hash: ${hash}`);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle receiving (generate address or QR code)
  const handleReceive = () => {
    if (!address) return;
    
    // Copy address to clipboard
    navigator.clipboard.writeText(address);
    alert(`Your address has been copied to clipboard: ${address}`);
  };
  
  // Function to simulate swap
  const handleSwap = () => {
    alert("Swap functionality would be integrated here with a DEX aggregator.");
  };
  
  // Function to simulate transfer (could be tokens)
  const handleTransfer = () => {
    // Open transaction modal
    setShowTransactionModal(true);
  };
  
  // Track recent transactions (simplified)
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  
  // Add transaction to history when completed
  useEffect(() => {
    if (transactionHash) {
      setRecentTransactions(prev => [
        {
          hash: transactionHash,
          from: address,
          to: recipientAddress || "0x0000000000000000000000000000000000000000",
          value: amount,
          timestamp: Date.now(),
          status: "success"
        },
        ...prev
      ]);
    }
  }, [transactionHash]);
  
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
            <button 
              className="flex flex-col items-center justify-center p-2 bg-gray-900 rounded-md hover:bg-gray-800"
              onClick={handleSwap}
            >
              <RefreshCcw size={16} className="mb-1" />
              <span className="text-xs">Swap</span>
            </button>
            <button 
              className="flex flex-col items-center justify-center p-2 bg-gray-900 rounded-md hover:bg-gray-800"
              onClick={handleTransfer}
            >
              <Send size={16} className="mb-1" />
              <span className="text-xs">Send</span>
            </button>
          </div>

          <Button 
            className="w-full bg-green-500 hover:bg-green-600 text-black"
            onClick={handleTransfer}
          >
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
              <span className="text-sm">{recentTransactions.length}</span>
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
              <span className="text-sm">{balanceData ? "1" : "0"}</span>
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
                onClick={handleTransfer}
                disabled={!isConnected || isLoading}
              >
                <Send size={16} className="mr-2" /> Send
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-700"
                onClick={handleReceive}
                disabled={!isConnected}
              >
                <ReceiveIcon size={16} className="mr-2" /> Receive
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-700"
                onClick={handleSwap}
                disabled={!isConnected || isLoading}
              >
                <RefreshCcw size={16} className="mr-2" /> Swap
              </Button>
            </div>
          </div>

          {/* Transaction success notification */}
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

          {/* Transaction Modal */}
          {showTransactionModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">Send Transaction</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Amount (ETH)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.001"
                    min="0"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Balance: {!isBalanceLoading && balanceData ? formatEther(balanceData.value) : "0"} ETH
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    className="flex-1 bg-green-500 hover:bg-green-600 text-black"
                    onClick={handleSendTransaction}
                    disabled={isLoading || !recipientAddress}
                  >
                    {isLoading ? "Sending..." : "Send"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-gray-700"
                    onClick={() => setShowTransactionModal(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Transaction History */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
            
            {recentTransactions.length > 0 ? (
              <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Hash</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">To</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Amount</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx, index) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="py-3 px-4">{truncateAddress(tx.hash)}</td>
                        <td className="py-3 px-4">{truncateAddress(tx.to)}</td>
                        <td className="py-3 px-4">{tx.value} ETH</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
                <p className="text-gray-400">No transactions yet</p>
              </div>
            )}
          </div>

          <TransactionHistoryPage />
        </main>
      </div>
    </div>
  );
}