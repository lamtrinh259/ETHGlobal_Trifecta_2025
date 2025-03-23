"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(true)
  const [analytics, setAnalytics] = useState(false)

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-sm text-gray-300">
            We use cookies to provide you with the best experience and to help improve our website and application.
            Please read our{" "}
            <Link href="#" className="text-green-500 hover:underline">
              Cookie Policy
            </Link>{" "}
            for more information. By clicking "Accept all", you agree to the storing of cookies on your device to
            enhance site navigation, analyze site usage and provide customer support.
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="necessary" checked disabled />
              <label
                htmlFor="necessary"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Necessary
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="analytics"
                checked={analytics}
                onCheckedChange={(checked) => setAnalytics(checked as boolean)}
              />
              <label htmlFor="analytics" className="text-sm font-medium leading-none">
                Analytics
              </label>
            </div>

            <Button
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-500/10"
              onClick={() => setIsVisible(false)}
            >
              Accept selection
            </Button>

            <Button
              className="bg-green-500 hover:bg-green-600 text-black"
              onClick={() => {
                setAnalytics(true)
                setIsVisible(false)
              }}
            >
              Accept all
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

