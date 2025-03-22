import { NextResponse } from 'next/server';
import { z } from 'zod'

// Input validation schema
const MessageSchema = z.object({
  messages: z.array(
    z.object({
      content: z.string()
    })
  )
})

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate input
    const validatedBody = MessageSchema.parse(body);

    const bodyToPost = JSON.stringify({
      model: 'meta-llama/Llama-3.1-8B-Instruct',
      messages: [
        {
          role: "user",
          content: `Analyze the following text: 
          ${validatedBody.messages[0].content}

        Return only a JSON with the values for:
        - ip
        - digest
        - jobId
        - totalCost
        - totalRate
        - approvalTransaction

        Return the plain JSON object without any markdown formatting or comments.`
        }
      ],
      temperature: 0.2,
    })

    console.log('Request body:', bodyToPost);

    const response = await fetch(
      `${process.env.NILAI_API_URL}/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NILAI_API_KEY}`,
        },
        body: bodyToPost,
      }
    );

    const data = await response.json();
    console.log('Response:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
