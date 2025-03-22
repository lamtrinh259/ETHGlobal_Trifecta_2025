"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronRight, TerminalIcon } from "lucide-react"

export default function BashTerminal() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [outputHistory, setOutputHistory] = useState<{ command: string; output: string; error?: boolean }[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const executeCommand = async (cmd: string) => {
    if (cmd.trim() === "") return ""
    if (cmd.trim() === "clear") {
      setOutputHistory([])
      return { output: "Terminal cleared", error: false }
    }

    try {
      setIsLoading(true)
      const response = await fetch("/api/terminal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: cmd }),
      })

      const result = await response.json()
      return result
    } catch (error) {
      return {
        output: error instanceof Error ? error.message : "Failed to execute command",
        error: true,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (input.trim() === "") return

    // Add to command history immediately
    setCommandHistory((prev) => [...prev, input])

    // Execute the command
    const result = await executeCommand(input)

    // Add to output history
    setOutputHistory((prev) => [
      ...prev,
      {
        command: input,
        output: result.output,
        error: result.error,
      },
    ])

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
          <div className="text-gray-400 text-sm mx-auto flex items-center gap-2">
            <TerminalIcon className="h-4 w-4" />
            <span>Bash Input</span>
          </div>
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
              placeholder="Type a bash command (e.g. 'ls -la', 'echo $PATH')"
              className="bg-transparent outline-none border-none w-full text-gray-100 font-mono text-sm"
              aria-label="Bash input"
              disabled={isLoading}
            />
          </form>
          {isLoading && <div className="animate-pulse text-yellow-400 ml-2">Executing...</div>}
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
          <div className="text-gray-400 text-sm mx-auto flex items-center gap-2">
            <TerminalIcon className="h-4 w-4" />
            <span>Bash Output</span>
          </div>
        </div>

        <div ref={outputRef} className="bg-black text-gray-100 p-4 h-96 overflow-y-auto font-mono text-sm">
          {outputHistory.length === 0 ? (
            <div className="text-gray-500 italic">
              <p>Enter a bash command in the input terminal above to see output here.</p>
              <p className="mt-2">Try commands like:</p>
              <ul className="list-disc ml-6 mt-1">
                <li>echo "Hello World"</li>
                <li>ls -la</li>
                <li>date</li>
                <li>pwd</li>
                <li>whoami</li>
                <li>clear (to clear this terminal)</li>
              </ul>
            </div>
          ) : (
            outputHistory.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-start text-green-400">
                  <ChevronRight className="h-4 w-4 mr-1 mt-1" />
                  <span>{item.command}</span>
                </div>
                <div className={`whitespace-pre-wrap ml-6 ${item.error ? "text-red-400" : "text-gray-300"}`}>
                  {item.output}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
        <strong>Note:</strong> This terminal executes real bash commands on the server. In a production environment, you
        would need proper security measures like command validation, sandboxing, and user authentication.
      </div>
    </div>
  )
}

