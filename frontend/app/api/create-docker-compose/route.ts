import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST() {
  try {
    const dockerComposeContent = `services:
  echo-server:
    image: wordpress
    init: true
    network_mode: host
    restart: unless-stopped`

    const filePath = join(process.cwd(), 'docker-compose.yml')
    await writeFile(filePath, dockerComposeContent)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating docker-compose.yml:', error)
    return NextResponse.json(
      { error: 'Failed to create docker-compose.yml' },
      { status: 500 }
    )
  }
} 