import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { puter } from '@/lib/puter';
import { ApiResponseFactory } from '@/lib/api-response-factory';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function extractText(response: unknown): string {
  if (typeof response === 'string') {
    return response;
  }
  
  if (isRecord(response)) {
    const { message, text } = response;
    if (isRecord(message) && typeof message.content === 'string') {
      return message.content;
    }
    if (typeof text === 'string') {
      return text;
    }
  }
  
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
