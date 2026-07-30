import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-pro'),
    messages,
    system: "You are Procoryx Copilot, an AI expert in procurement and supply chain management designed to assist users in assembling, reviewing, and analyzing tender documents and procurement strategies. Be concise, professional, and helpful.",
  });

  return result.toUIMessageStreamResponse();
}
