"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { CopyButton } from "./CopyButton"
// import { ExternalLinkButton } from "./ExternalLinkButton"
import { Badge } from "@/components/ui/badge";

interface TransactionDetailsProps {
  transaction: any;
  address?: string;
  chain?: any;
}

export default function TransactionDetails({
  transaction,
  address,
  chain,
}: TransactionDetailsProps) {
  const [showAllData, setShowAllData] = useState(false);

  const explorerUrl = chain?.blockExplorers?.default.url;
  const txExplorerUrl = explorerUrl
    ? `${explorerUrl}/tx/${transaction.hash}`
    : "#";
  const addressExplorerUrl =
    explorerUrl && transaction.contractAddress
      ? `${explorerUrl}/address/${transaction.contractAddress}`
      : "#";

  if (transaction.title?.includes("MultiSend")) {
    return (
      <div className="px-4 pb-4 bg-gray-900 border-2 rounded-md p-3 border-green-500">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <Badge
              variant="outline"
              className="border-green-500 text-green-500 rounded-full"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mr-1"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Created
            </Badge>
          </div>

          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Share2 size={16} />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-400 mb-1">Interacted with:</div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm">Safe: MultiSend 1.3.0</span>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <span className="truncate max-w-md">
                    matic:{transaction.contractAddress}
                  </span>
                  {/* <CopyButton value={transaction.contractAddress} /> */}
                  {/* <ExternalLinkButton href={addressExplorerUrl} /> */}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-400 mb-1">Data:</div>
            <div className="flex items-center space-x-2">
              <div className="truncate max-w-md text-xs">
                0x8d80ff0a00000000000000000000000000000000000000000000000000...
              </div>
              <Button
                variant="link"
                size="sm"
                className="text-green-500 p-0 h-auto text-xs"
                onClick={() => setShowAllData(!showAllData)}
              >
                Show more
              </Button>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-400 mb-1">Transaction hash:</div>
            <div className="flex items-center space-x-2">
              <div className="truncate max-w-md text-xs">
                {transaction.hash}
              </div>
              {/* <CopyButton value={transaction.hash} />
              <ExternalLinkButton href={txExplorerUrl} /> */}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-400 mb-1">Executed:</div>
            <div className="text-xs">
              {new Date(transaction.timestamp).toLocaleDateString()}{" "}
              {new Date(transaction.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </div>
          </div>

          <Button
            variant="link"
            className="text-green-500 p-0 h-auto text-sm"
            onClick={() => setShowAllData(!showAllData)}
          >
            Advanced details
          </Button>

          {showAllData && (
            <div className="space-y-4 mt-4 border-t border-gray-800 pt-4">
              <div>
                <div className="text-sm font-medium mb-2">Transaction data</div>

                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-400">to:</div>
                    <div className="flex items-center space-x-2">
                      <div className="truncate max-w-md text-xs">
                        {transaction.contractAddress}
                      </div>
                      {/* <CopyButton value={transaction.contractAddress} />
                      <ExternalLinkButton href={addressExplorerUrl} /> */}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">value:</div>
                    <div className="text-xs">0</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">data:</div>
                    <div className="flex items-center space-x-2">
                      <div className="truncate max-w-md text-xs">
                        0x8d80ff0a0000000000000000000000000000000000000000000000000000000000000000...
                      </div>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-green-500 p-0 h-auto text-xs"
                      >
                        Show more
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">operation:</div>
                    <div className="text-xs">1 (delegate)</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">safeTxGas:</div>
                    <div className="text-xs">0</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">baseGas:</div>
                    <div className="text-xs">0</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">gasPrice:</div>
                    <div className="text-xs">0</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">gasToken:</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-xs">0x0000...0000</div>
                      {/* <CopyButton value="0x0000000000000000000000000000000000000000" />
                      <ExternalLinkButton href="#" /> */}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">refundReceiver:</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-xs">0x0000...0000</div>
                      {/* <CopyButton value="0x0000000000000000000000000000000000000000" />
                      <ExternalLinkButton href="#" /> */}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">nonce:</div>
                    <div className="text-xs">1</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">Signature 1:</div>
                    <div className="flex items-center space-x-2">
                      <div className="truncate max-w-md text-xs">
                        0xac538f7a7da07ae42a5329d67e1e088491edd9a1c2a2cb5f53cef8...
                      </div>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-green-500 p-0 h-auto text-xs"
                      >
                        Show more
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">
                  Transaction hashes
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-400">Domain hash:</div>
                    <div className="flex items-center space-x-2">
                      <div className="truncate max-w-md text-xs">
                        0xf174d8bdf5e3b8d93fb1ae14452d35c652b6440724f5465ce4bfa1d25d850db45
                      </div>
                      {/* <CopyButton value="0xf174d8bdf5e3b8d93fb1ae14452d35c652b6440724f5465ce4bfa1d25d850db45" /> */}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">Message hash:</div>
                    <div className="flex items-center space-x-2">
                      <div className="truncate max-w-md text-xs">
                        0x4d90aef9ff67bf544ce2f991e62bfe1b30e036946b5c144cec84e9c014c6837
                      </div>
                      {/* <CopyButton value="0x4d90aef9ff67bf544ce2f991e62bfe1b30e036946b5c144cec84e9c014c6837" /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-2 mt-4">
            <Badge
              variant="outline"
              className="flex items-center space-x-1 border-green-500 text-green-500"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>Confirmations (1 of 1)</span>
            </Badge>
          </div>

          <Button variant="link" className="text-green-500 p-0 h-auto text-sm">
            Show all
          </Button>

          <div className="flex space-x-2">
            <Badge
              variant="outline"
              className="flex items-center space-x-1 border-green-500 text-green-500"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>Executed</span>
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
              <span className="text-xs text-white"></span>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <span className="truncate max-w-md">matic:0x7BC4...54A7</span>
              {/* <CopyButton value="0x7BC454A7" />
              <ExternalLinkButton href="#" /> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For other transactions, show a simpler view
  return (
    <div className="px-4 pb-4 bg-gray-900">
      <div className="space-y-4">
        {transaction.token && (
          <div>
            <div className="text-sm text-gray-400 mb-1">Token:</div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">
                  {transaction.token.symbol.charAt(0)}
                </span>
              </div>
              <span className="text-sm">{transaction.token.symbol}</span>
            </div>
          </div>
        )}

        <div>
          <div className="text-sm text-gray-400 mb-1">Transaction hash:</div>
          <div className="flex items-center space-x-2">
            <div className="truncate max-w-md text-xs">{transaction.hash}</div>
            {/* <CopyButton value={transaction.hash} />
            <ExternalLinkButton href={txExplorerUrl} /> */}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-1">Timestamp:</div>
          <div className="text-xs">
            {new Date(transaction.timestamp).toLocaleDateString()}{" "}
            {new Date(transaction.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>

        {transaction.subtitle && (
          <div>
            <div className="text-sm text-gray-400 mb-1">Details:</div>
            <div className="text-xs">{transaction.subtitle}</div>
          </div>
        )}

        <div>
          <div className="text-sm text-gray-400 mb-1">Status:</div>
          <Badge
            variant="outline"
            className={`
            ${
              transaction.status === "success"
                ? "border-green-500 text-green-500"
                : ""
            }
            ${
              transaction.status === "pending"
                ? "border-yellow-500 text-yellow-500"
                : ""
            }
            ${
              transaction.status === "failed"
                ? "border-red-500 text-red-500"
                : ""
            }
          `}
          >
            {transaction.status === "success" && "Success"}
            {transaction.status === "pending" && "Pending"}
            {transaction.status === "failed" && "Failed"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
