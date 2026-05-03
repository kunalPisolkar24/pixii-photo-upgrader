import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { puter } from '@/lib/puter';

function extractText(response: any): string {
  if (typeof response === 'string') {
    return response;
  }
  if (response && typeof response === 'object') {
    if (response.message && typeof response.message.content === 'string') {
      return response.message.content;
    }
    if (typeof response.text === 'string') {
      return response.text;
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
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
