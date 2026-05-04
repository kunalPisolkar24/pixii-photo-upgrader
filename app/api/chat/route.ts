import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { puter } from '@/lib/puter';
import { ApiResponseFactory } from '@/lib/api-response-factory';

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
  
  // Safely handle potential circular structures or non-stringifiable objects
  try {
    return String(response);
  } catch {
    return "[Complex Object]";
  }
}

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("X-Chat-Secret")
    if (secret !== process.env.CHAT_TEST_SECRET) {
      return NextResponse.json(ApiResponseFactory.error('Unauthorized', 401), { status: 401 });
    }

    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(ApiResponseFactory.error('Valid prompt is required', 400), { status: 400 });
    }

    const puterResponse = await puter.ai.chat(prompt);
    const reply = extractText(puterResponse);

    return NextResponse.json(ApiResponseFactory.success({ reply }));
  } catch (error) {
    console.error("Chat API error:", error)
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(ApiResponseFactory.error(message, 500), { status: 500 });
  }
}
