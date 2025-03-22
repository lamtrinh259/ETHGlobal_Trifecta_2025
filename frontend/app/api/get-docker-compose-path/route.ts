import { NextResponse } from 'next/server'
import { join, resolve } from 'path'

export async function GET() {
  try {
    // Get the absolute path and normalize it
    const filePath = resolve(process.cwd(), 'assets', 'docker', 'wordpress', 'docker-compose.yml')
    
    // Ensure forward slashes for consistency
    const normalizedPath = filePath.replace(/\\/g, '/')
    
    return NextResponse.json({ path: normalizedPath })
  } catch (error) {
    console.error('Error getting docker-compose.yml path:', error)
    return NextResponse.json(
      { error: 'Failed to get docker-compose.yml path' },
      { status: 500 }
    )
  }
} 