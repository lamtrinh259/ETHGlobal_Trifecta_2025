"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, ChevronDown, Pin } from "lucide-react"

export default function AccountsPage() {
  const router = useRouter()

  const handleAccountClick = (accountId: string) => {
    router.push(`/home?safe=${accountId}`)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 py-3 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="font-bold text-sm">Safe (WALLET)</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
            <span className="sr-only">Settings</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
            </svg>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
            <span className="sr-only">Notifications</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </Button>
          <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium">
            JD
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My accounts</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 border-gray-700 text-white hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
            <Button size="sm" className="h-8 bg-green-500 hover:bg-green-600 text-black">
              Create account
            </Button>
          </div>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, ENS address or chain"
            className="pl-10 bg-gray-900 border-gray-700 text-gray-300 h-9"
          />
        </div>

        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Pin className="h-4 w-4 mr-2 text-gray-400" />
            <h2 className="text-sm font-medium">Pinned</h2>
          </div>
          <div className="text-center py-12 text-gray-400 text-sm">
            <p>Pin accounts you use often to the top of the list.</p>
            <p>You can pin and unpin accounts from the account menu.</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <h2 className="text-sm font-medium">Accounts</h2>
              <div className="ml-2 bg-gray-800 text-xs px-1.5 py-0.5 rounded-full text-gray-400">1</div>
            </div>
            <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-400 hover:bg-gray-800">
              <ChevronDown className="h-3 w-3 mr-1" />
              Sort
            </Button>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 mb-8">
            <div
              className="p-3 flex items-center justify-between hover:bg-gray-800 transition-colors rounded-lg cursor-pointer"
              onClick={() => handleAccountClick("eth.default_safe")}
            >
              <div className="flex items-center">
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
                  <div className="font-medium">eth.default_safe</div>
                  <div className="text-xs text-gray-400">Ethereum</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-right mr-4">
                  <div className="font-medium">$0</div>
                  <div className="text-xs text-gray-400">0 ETH</div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <span className="sr-only">More</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 text-center">
            <h3 className="font-medium mb-2">Import your Safe data</h3>
            <Button variant="outline" size="sm" className="mt-2 border-green-500 text-green-500 hover:bg-green-500/10">
              Import
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

