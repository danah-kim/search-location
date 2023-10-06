import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { type ChatCompletionMessage } from 'openai/resources/chat/index.mjs';
import { APIError } from 'openai/error.mjs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { userMessage }: { userMessage: ChatCompletionMessage } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You only return in JSON a position key with a value in this format [43.6426, -79.3871], then a title of the location with a title key',
        },
        userMessage,
      ],
    });

    const responseText = completion.choices[0].message?.content;

    if (responseText?.[0] === '{') {
      return NextResponse.json(JSON.parse(responseText));
    }

    return NextResponse.json({ tryAgain: true });
  } catch (error) {
    const { status, error: apiError } = error as APIError;

    return new NextResponse((apiError as { message: string })?.message || 'Internal Error', {
      status: status || 500,
    });
  }
}
