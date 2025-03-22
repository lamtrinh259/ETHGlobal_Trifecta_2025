"use client";

import { useState } from "react";
import { useAccount, useTransactionReceipt } from "wagmi";
import TransactionList from "./TransactionList";
import TransactionDetails from "./TransactionDetails";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown } from "lucide-react";

export default function TransactionHistoryPage() {
  const [activeTab, setActiveTab] = useState("history");
  const [hideSuspicious, setHideSuspicious] = useState(false);

  return (
    <div className="flex-1 bg-black text-white">
      <header className="border-b border-gray-800 py-3 px-4 flex items-center justify-between sticky top-0 bg-black z-10">
        <div className="flex items-center">
          <h1 className="font-bold text-sm">Transactions</h1>
        </div>
      </header>

      <main className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Tabs
            defaultValue="history"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 max-w-md bg-transparent border-b border-gray-800">
              <TabsTrigger
                value="queue"
                className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-green-500 text-gray-400 rounded-none"
              >
                Queue
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-green-500 text-gray-400 rounded-none"
              >
                History
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-green-500 text-gray-400 rounded-none"
              >
                Messages
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="hide-suspicious"
                checked={hideSuspicious}
                onCheckedChange={setHideSuspicious}
              />
              <Label htmlFor="hide-suspicious" className="text-sm">
                Hide suspicious
              </Label>
            </div>

            <Button
              variant="outline"
              className="border-gray-700 text-xs flex items-center gap-2"
            >
              Filter
              <ChevronDown size={14} />
            </Button>
          </div>
        </div>

        <TransactionList
          activeTab={activeTab}
          hideSuspicious={hideSuspicious}
        />
      </main>
    </div>
  );
}
