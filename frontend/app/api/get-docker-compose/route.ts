import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'assets', 'docker', 'wordpress', 'docker-compose.yml')
    const content = await readFile(filePath, 'utf-8')
    
    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error reading docker-compose.yml:', error)
    return NextResponse.json(
      { error: 'Failed to read docker-compose.yml' },
      { status: 500 }
    )
  }
} 