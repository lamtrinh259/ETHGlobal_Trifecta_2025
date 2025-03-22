import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: Request) {
  try {
    const { command } = await request.json()
    
    if (!command) {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 })
    }

    // Execute the command from the project root directory
    const { stdout, stderr } = await execAsync(command, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        PATH: process.env.PATH
      },
      shell: '/bin/bash' // Explicitly use bash shell
    })
    
    const output = stdout || stderr
    console.log('Command output:', output) // Log the output for debugging

    return NextResponse.json({
      output: output || 'Command executed successfully with no output.'
    })
  } catch (error: unknown) {
    console.error('Error executing command:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: `Failed to execute command: ${errorMessage}` },
      { status: 500 }
    )
  }
} 