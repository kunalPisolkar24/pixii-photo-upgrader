import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { puter } from '@/lib/puter';

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
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Valid prompt is required' }, { status: 400 });
    }

    const response = await puter.ai.chat(prompt);
    const reply = extractText(response);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error)
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
