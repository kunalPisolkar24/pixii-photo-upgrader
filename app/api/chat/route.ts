import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ApiResponseFactory } from '@/lib/api-response-factory';
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

    // Chat is temporarily disabled while migrating away from Puter
    const reply = "Chat is currently undergoing maintenance. Please check back later!";

    return NextResponse.json(ApiResponseFactory.success({ reply }));
  } catch (error) {
    console.error("Chat API error:", error)
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(ApiResponseFactory.error(message, 500), { status: 500 });
  }
}
