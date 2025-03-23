import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const bodyToPost = JSON.stringify({
      model: 'meta-llama/Llama-3.1-8B-Instruct',
      messages: body.messages,
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

    console.log('****** response:', response);

    const data = await response.json();

    console.log('****** data:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
