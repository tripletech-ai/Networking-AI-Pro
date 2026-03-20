import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) return NextResponse.json({ error: 'API key 未設定' }, { status: 500 });
  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: '無輸入' }, { status: 400 });

  const systemMessage = `你是一個商務名片解析助手。
將以下雜亂的敘述，精準萃取出以下 JSON 欄位（若無則留空字串，請勿捏造資訊）：
{ "name": "", "company": "", "title": "", "industry": "", "chapter": "", "services": "", "lookingFor": "", "painPoints": "" }
請確保分析為商業專業角度，提取重點關鍵字。`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: text },
        ],
        temperature: 0.2,
        max_tokens: 400,
        response_format: { type: 'json_object' },
      })
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: 'API 分析失敗' }, { status: 500 });
    const resultObj = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    return NextResponse.json(resultObj);
  } catch (err) {
    return NextResponse.json({ error: '連線失敗' }, { status: 500 });
  }
}
