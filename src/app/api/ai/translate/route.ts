import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai'; // Assuming using AI SDK
import { openai } from '@ai-sdk/openai';

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang } = await req.json();
    
    if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 });

    const prompt = `Translate the following business profile/bio to ${targetLang}. 
    Keep the professional tone and ensure business terms are accurate.
    Only return the translated text.
    
    Text: ${text}`;

    const { text: translatedText } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
    });

    return NextResponse.json({ translatedText });
  } catch (err: any) {
    console.error('Translation error:', err);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
