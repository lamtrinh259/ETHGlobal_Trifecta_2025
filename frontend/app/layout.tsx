"use client"

import "@rainbow-me/rainbowkit/styles.css"
import "@/styles/globals.css"
import { Metadata } from "next"
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import {arbitrumSepolia} from "wagmi/chains"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "25195dd15a9741bb3dc1f86d8f11cf1d",
  chains: [arbitrumSepolia],
  ssr: true,
})
const queryClient = new QueryClient()

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <WagmiProvider config={config}>
              <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                  <div className="relative flex min-h-screen flex-col">
                    <SiteHeader />
                    <div className="flex-1">{children}</div>
                  </div>
                  {/* <TailwindIndicator /> */}
                </RainbowKitProvider>
              </QueryClientProvider>
            </WagmiProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
