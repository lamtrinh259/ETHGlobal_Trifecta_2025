"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronRight } from "lucide-react"

export default function MacTerminal() {
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [outputHistory, setOutputHistory] = useState<{ command: string; output: string }[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Sample command responses - in a real app, you'd implement actual command processing
  const processCommand = (cmd: string): string => {
    const command = cmd.trim().toLowerCase()

    if (command === "") return ""
    if (command === "clear") {
      setOutputHistory([])
      return ""
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
    if (output !== "") {
      setOutputHistory((prev) => [...prev, { command: input, output }])
    }

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
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [outputHistory])

  // Click anywhere in terminal to focus input
  const focusInput = () => {
    inputRef.current?.focus()
  }

  return (
    <div className="max-w-3xl mx-auto my-8 rounded-lg overflow-hidden shadow-xl border border-gray-700">
      {/* Terminal header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-gray-400 text-sm mx-auto">Terminal</div>
      </div>

      {/* Terminal output area */}
      <div
        ref={terminalRef}
        className="bg-black text-gray-100 p-4 h-80 overflow-y-auto font-mono text-sm"
        onClick={focusInput}
      >
        {outputHistory.map((item, index) => (
          <div key={index} className="mb-2">
            <div className="flex items-start">
              <span className="text-green-400 mr-2">user@macbook:~$</span>
              <span>{item.command}</span>
            </div>
            <div className="whitespace-pre-line ml-4 text-gray-300">{item.output}</div>
          </div>
        ))}

        {/* Current input line */}
        <div className="flex items-center">
          <span className="text-green-400 mr-2">user@macbook:~$</span>
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none border-none w-full text-gray-100 font-mono text-sm"
              aria-label="Terminal input"
            />
          </form>
        </div>
      </div>

      {/* Terminal input area with prompt */}
      <div className="bg-gray-900 p-4 border-t border-gray-700 flex items-center">
        <ChevronRight className="text-green-400 mr-2 h-4 w-4" />
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            type="text"
            placeholder="Type a command (try 'help')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent outline-none border-none w-full text-gray-100 font-mono text-sm"
            aria-label="Command input"
          />
        </form>
      </div>
    </div>
  )
}

