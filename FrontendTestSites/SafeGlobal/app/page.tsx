import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CookieConsent } from "@/components/cookie-consent"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="container mx-auto py-4 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="text-white font-bold text-2xl flex items-center">
            <div className="mr-2 bg-white p-1 rounded">
              <div className="bg-black h-4 w-4 flex items-center justify-center">
                <span className="text-white text-xs">S</span>
              </div>
            </div>
            Safe
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#" className="text-gray-300 hover:text-white transition-colors">
            Developers
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white transition-colors">
            Wallet
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
            Safenet
            <span className="ml-1 text-xs bg-green-500 text-black px-2 py-0.5 rounded-full">NEW</span>
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white transition-colors">
            Ecosystem
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white transition-colors">
            Community
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white transition-colors">
            Resources
          </Link>
        </nav>

        <Link href="/welcome/accounts">
          <Button className="bg-green-500 hover:bg-green-600 text-black font-medium rounded-md">
            Launch Wallet <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Green bracket left */}
        <div className="absolute left-0 md:left-20 h-[500px] w-[200px] opacity-80">
          <div className="relative h-full w-full">
            <div className="absolute top-0 left-0 h-[100px] w-[100px] rounded-tl-3xl border-l-8 border-t-8 border-green-500"></div>
            <div className="absolute bottom-0 left-0 h-[100px] w-[100px] rounded-bl-3xl border-l-8 border-b-8 border-green-500"></div>
            <div className="absolute top-[100px] left-0 h-[300px] w-[8px] bg-gradient-to-b from-green-500 via-green-400 to-green-500"></div>
          </div>
        </div>

        {/* Green bracket right */}
        <div className="absolute right-0 md:right-20 h-[500px] w-[200px] opacity-80">
          <div className="relative h-full w-full">
            <div className="absolute top-0 right-0 h-[100px] w-[100px] rounded-tr-3xl border-r-8 border-t-8 border-green-500"></div>
            <div className="absolute bottom-0 right-0 h-[100px] w-[100px] rounded-br-3xl border-r-8 border-b-8 border-green-500"></div>
            <div className="absolute top-[100px] right-0 h-[300px] w-[8px] bg-gradient-to-b from-green-500 via-green-400 to-green-500"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center z-10">
          <div className="relative mb-8">
            <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-gray-900 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=400')] opacity-30"></div>
              <div className="absolute inset-0">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-green-500 rounded-full animate-pulse"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      opacity: Math.random() * 0.8 + 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-4xl">
            Smart Accounts to <span className="text-green-500">Own the Internet</span>
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
            The leading smart account protocol for Ethereum. Secure, flexible, and built for everyone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-green-500 hover:bg-green-600 text-black font-medium px-8 py-6 rounded-md text-lg">
              Get Started
            </Button>
            <Button
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-500/10 font-medium px-8 py-6 rounded-md text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </main>

      <CookieConsent />
    </div>
  )
}

