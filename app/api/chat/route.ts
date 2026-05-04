import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { puter } from '@/lib/puter';
import { ApiResponse } from '@/lib/types';

function extractText(response: unknown): string {
  if (typeof response === 'string') {
    return response;
  }
  
  if (response && typeof response === 'object') {
    const res = response as any
    if (res.message && typeof res.message.content === 'string') {
      return res.message.content;
    }
    if (typeof res.text === 'string') {
      return res.text;
    }
  }
  
  return JSON.stringify(response);
}

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("X-Chat-Secret")
    if (secret !== process.env.CHAT_TEST_SECRET) {
      const authError: ApiResponse<never> = {
        error: 'Unauthorized',
        status: 401
      }
      return NextResponse.json(authError, { status: 401 });
    }

    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      const badRequestError: ApiResponse<never> = {
        error: 'Valid prompt is required',
        status: 400
      }
      return NextResponse.json(badRequestError, { status: 400 });
    }

    const puterResponse = await puter.ai.chat(prompt);
    const reply = extractText(puterResponse);

    const response: ApiResponse<{ reply: string }> = {
      data: { reply },
      status: 200
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API error:", error)
    const message = error instanceof Error ? error.message : "Internal server error";
    
    const response: ApiResponse<never> = {
      error: message,
      status: 500
    }

    return NextResponse.json(response, { status: 500 });
  }
}
