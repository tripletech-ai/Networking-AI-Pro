import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { memberIds, guests } = await req.json();

    if (!OPENAI_API_KEY || !memberIds || memberIds.length === 0) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Build text for each member
    const texts = guests.map((g: any) =>
      `服務：${g.services || '無'}。尋找：${g.lookingFor || '無'}。痛點：${g.painPoints || '無'}`
    );

    // Bulk embed in one shot
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({ input: texts, model: 'text-embedding-3-small' })
    });

    const data = await res.json();
    if (!data?.data) return NextResponse.json({ ok: false, error: 'OpenAI failed' });

    // Update each member with their embedding
    const updates = data.data.map(async (item: any) => {
      const memberId = memberIds[item.index];
      if (!memberId || !item.embedding) return;
      await prisma.memberProfile.update({
        where: { id: memberId },
        data: { embedding: JSON.stringify(item.embedding) }
      }).catch(() => {}); // ignore if member was deleted
    });

    await Promise.all(updates);
    return NextResponse.json({ ok: true, updated: memberIds.length });
  } catch (err) {
    console.error('[Embed API Error]', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
