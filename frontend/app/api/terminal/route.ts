import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execPromise = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json()

    if (!command) {
      return NextResponse.json({ error: "No command provided" }, { status: 400 })
    }
    const { stdout, stderr } = await execPromise(command)

    return NextResponse.json({
      output: stdout || stderr,
      error: stderr ? true : false,
    })
  } catch (error) {
    console.error("Error executing command:", error)
    return NextResponse.json({
      output: error instanceof Error ? error.message : "An unknown error occurred",
      error: true,
    })
  }
}

