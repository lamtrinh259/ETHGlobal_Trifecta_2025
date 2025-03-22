"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronRight } from "lucide-react"

export default function MacDualTerminal() {
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [outputHistory, setOutputHistory] = useState<{ command: string; output: string }[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Sample command responses - in a real app, you'd implement actual command processing
  const processCommand = (cmd: string): string => {
    const command = cmd.trim().toLowerCase()

    if (command === "") return ""
    if (command === "clear") {
      setOutputHistory([])
      return "Terminal cleared"
    }
    if (command === "help") return "Available commands: help, clear, echo, date, ls"
    if (command.startsWith("echo ")) return command.substring(5)
    if (command === "date") return new Date().toString()
    if (command === "ls") return "Documents\nDownloads\nApplications\nDesktop\nPictures"

    return `Command not found: ${command}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (input.trim() === "") return

    const output = processCommand(input)

    // Add to history
    setCommandHistory((prev) => [...prev, input])
    setOutputHistory((prev) => [...prev, { command: input, output }])

    // Reset
    setInput("")
    setHistoryIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Navigate command history with up/down arrows
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    }
  }

  // Auto-focus the input field
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [outputHistory])

  // Click anywhere in input terminal to focus input
  const focusInput = () => {
    inputRef.current?.focus()
  }

  return (
    <div className="max-w-3xl mx-auto my-8 space-y-6">
      {/* Input Terminal */}
      <div className="rounded-lg overflow-hidden shadow-xl border border-gray-700">
        <div className="bg-gray-800 px-4 py-2 flex items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-gray-400 text-sm mx-auto">Input Terminal</div>
        </div>

        <div className="bg-black text-gray-100 p-4 h-20 font-mono text-sm flex items-center" onClick={focusInput}>
          <span className="text-green-400 mr-2">user@macbook:~$</span>
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command (try 'help')"
              className="bg-transparent outline-none border-none w-full text-gray-100 font-mono text-sm"
              aria-label="Terminal input"
            />
          </form>
        </div>
      </div>

      {/* Output Terminal */}
      <div className="rounded-lg overflow-hidden shadow-xl border border-gray-700">
        <div className="bg-gray-800 px-4 py-2 flex items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-gray-400 text-sm mx-auto">Output Terminal</div>
        </div>

        <div ref={outputRef} className="bg-black text-gray-100 p-4 h-80 overflow-y-auto font-mono text-sm">
          {outputHistory.length === 0 ? (
            <div className="text-gray-500 italic">Enter a command in the input terminal above to see output here.</div>
          ) : (
            outputHistory.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-start text-green-400">
                  <ChevronRight className="h-4 w-4 mr-1 mt-1" />
                  <span>{item.command}</span>
                </div>
                <div className="whitespace-pre-line ml-6 text-gray-300">{item.output}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

