"use client";

import { useState, useEffect } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, ArrowDownRight, CheckCircle2 } from "lucide-react";
import TransactionDetails from "./TransactionDetails";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  hash: string;
  type: "sent" | "received" | "contract" | "system";
  status: "success" | "pending" | "failed";
  timestamp: number;
  title: string;
  subtitle?: string;
  value?: string;
  token?: {
    symbol: string;
    icon: string;
  };
  contractAddress?: string;
  warning?: string;
}

interface TransactionListProps {
  activeTab: string;
  hideSuspicious: boolean;
}

export default function TransactionList({
  activeTab,
  hideSuspicious,
}: TransactionListProps) {
  const { address, chain } = useAccount();
  const publicClient = usePublicClient();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // In a real application, you would fetch this data from the blockchain
    // using wagmi hooks or directly from the publicClient
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        hash: "0x524b2204afc538f7a7da07ae42a5329d67e1e088491edd9a1c2a2cb5f53cef8",
        type: "contract",
        status: "success",
        timestamp: new Date("2025-01-04T01:03:00").getTime(),
        title: "Safe: MultiSend 1.3.0",
        contractAddress: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
        warning: "Unexpected delegate call",
      },
      {
        id: "2",
        hash: "0x8d80ff0a000000000000000000000000000000000000000000000000",
        type: "sent",
        status: "success",
        timestamp: new Date("2025-01-28T01:01:00").getTime(),
        title: "-1.79909 USDC.e",
        token: {
          symbol: "USDC.e",
          icon: "/usdc-icon.png",
        },
      },
      {
        id: "3",
        hash: "0x7242b8a9f1ef6b1544ce2f991e62bfe1b30e036946b5c144cec84e9c014c6837",
        type: "received",
        status: "success",
        timestamp: new Date("2025-01-04T12:55:00").getTime(),
        title: "110,000 USDT Airdrop",
        token: {
          symbol: "USDT",
          icon: "/usdt-icon.png",
        },
      },
      {
        id: "4",
        hash: "0x4d90aef9ff67bf544ce2f991e62bfe1b30e036946b5c144cec84e9c014c6837",
        type: "received",
        status: "success",
        timestamp: new Date("2025-01-04T12:55:00").getTime(),
        title: "10 USDC",
        token: {
          symbol: "USDC",
          icon: "/usdc-icon.png",
        },
      },
      {
        id: "5",
        hash: "0x174d8bdf5e3b8d93fb1ae14452d35c652b6440724f5465ce4bfa1d25d850db45",
        type: "system",
        status: "success",
        timestamp: new Date("2025-01-04T12:49:00").getTime(),
        title: "Safe Account created",
        subtitle: "Created by 0x7DB6...dA6a",
      },
    ];

    setTimeout(() => {
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 500);
  }, [address, chain, publicClient]);

  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === "queue") return tx.status === "pending";
    if (activeTab === "history") return tx.status !== "pending";
    return true;
  });

  const displayedTransactions = hideSuspicious
    ? filteredTransactions.filter((tx) => !tx.warning)
    : filteredTransactions;

  const groupByDate = (transactions: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};

    transactions.forEach((tx) => {
      const date = new Date(tx.timestamp);
      const dateStr = `${date
        .toLocaleString("default", { month: "short" })
        .toUpperCase()} ${date.getDate()}, ${date.getFullYear()}`;

      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }

      groups[dateStr].push(tx);
    });

    return groups;
  };

  const transactionsByDate = groupByDate(displayedTransactions);

  if (isLoading) {
    return (
      <div className="py-4 text-center text-gray-400">
        Loading transactions...
      </div>
    );
  }

  if (displayedTransactions.length === 0) {
    return (
      <div className="py-4 text-center text-gray-400">
        No transactions found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(transactionsByDate).map(([date, txs]) => (
        <div key={date} className="space-y-2">
          <div className="text-xs text-gray-400 uppercase py-2">{date}</div>

          <div className="space-y-1">
            {txs.map((tx) => (
              <Collapsible
                key={tx.id}
                open={expandedTx === tx.id}
                onOpenChange={(open) => setExpandedTx(open ? tx.id : null)}
                className="border-t border-gray-800 last:border-b"
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between py-4 hover:bg-gray-900 px-2 cursor-pointer">
                    <div className="flex items-center space-x-2">
                      {tx.type === "sent" ? (
                        <ArrowUpRight className="text-red-500" size={16} />
                      ) : tx.type === "received" ? (
                        <ArrowDownRight className="text-green-500" size={16} />
                      ) : tx.type === "system" ? (
                        <svg
                          className="text-gray-400"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      ) : (
                        <div className="w-4 h-4 bg-gray-800 rounded-sm flex items-center justify-center">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="2" y="3" width="20" height="14" rx="2" />
                            <path d="M8 21h8" />
                            <path d="M12 17v4" />
                          </svg>
                        </div>
                      )}

                      <div className="text-sm font-medium">{tx.title}</div>

                      {tx.warning && (
                        <div className="flex items-center space-x-1 text-amber-500">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          <span className="text-xs">{tx.warning}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-400">
                        {new Date(tx.timestamp).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>

                      <Badge
                        variant="outline"
                        className={`
                        ${
                          tx.status === "success"
                            ? "border-green-500 text-green-500"
                            : ""
                        }
                        ${
                          tx.status === "pending"
                            ? "border-yellow-500 text-yellow-500"
                            : ""
                        }
                        ${
                          tx.status === "failed"
                            ? "border-red-500 text-red-500"
                            : ""
                        }
                      `}
                      >
                        {tx.status === "success" && "Success"}
                        {tx.status === "pending" && "Pending"}
                        {tx.status === "failed" && "Failed"}
                      </Badge>
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <TransactionDetails
                    transaction={tx}
                    address={address}
                    chain={chain}
                  />
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
