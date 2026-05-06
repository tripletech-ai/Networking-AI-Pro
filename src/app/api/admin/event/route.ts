import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function getBulkEmbeddings(texts: string[]) {
  if (!OPENAI_API_KEY || texts.length === 0) return Array(texts.length).fill(null);
  try {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({ input: texts, model: 'text-embedding-3-small' })
    });
    const data = await res.json();
    if (data?.data && Array.isArray(data.data)) {
      const embeddings = Array(texts.length).fill(null);
      data.data.forEach((item: any) => {
        if (item.index !== undefined) embeddings[item.index] = item.embedding;
      });
      return embeddings;
    }
    return Array(texts.length).fill(null);
  } catch (err) {
    console.error('Bulk embedding error:', err);
    return Array(texts.length).fill(null);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: '未登入' }, { status: 401 });

    const body = await req.json();
    const { eventId, eventName, guests } = body;

    let event;
    if (eventId) {
      event = await prisma.event.findUnique({ where: { id: String(eventId), organizerId: String(session.id) } });
      if (!event) return NextResponse.json({ error: '找不到活動' }, { status: 404 });
    } else {
      if (!eventName) return NextResponse.json({ error: '請提供活動名稱' }, { status: 400 });
      const slug = String(eventName).toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      event = await prisma.event.create({
        data: { name: eventName, slug, organizerId: String(session.id) }
      });
    }

    if (!guests || guests.length === 0) {
      return NextResponse.json({ success: true, eventId: event.id, message: '活動建立成功，目前無匯入名單。' });
    }

    const validGuests = guests.filter((g: any) => g.name);

    // ─── Phase 1: Write ALL members to DB WITHOUT embeddings first (fast, under 10s) ───
    const BATCH_SIZE = 8;
    const memberIds: string[] = [];

    for (let i = 0; i < validGuests.length; i += BATCH_SIZE) {
      const batch = validGuests.slice(i, i + BATCH_SIZE);
      const created = await Promise.all(batch.map(async (g: any) => {
        const member = await prisma.memberProfile.create({
          data: {
            organizerId: String(session.id),
            name: g.name, chapter: g.chapter || '貴賓', company: g.company || '無',
            title: g.title || '', industry: g.industry || '未分類', services: g.services || '',
            lookingFor: g.lookingFor || '', painPoints: g.painPoints || '',
            embedding: null // will be updated asynchronously
          }
        });
        await prisma.attendance.create({
          data: { eventId: event.id, memberId: member.id, checkinAt: null }
        });
        return member.id;
      }));
      memberIds.push(...created);
    }

    // ─── Phase 2: Client-side trigger ───
    // We return memberIds so the client can trigger the embed API using keepalive: true.
    // This avoids Netlify serverless timeout blocking the response.

    return NextResponse.json({
      success: true,
      eventId: event.id,
      memberIds,
      message: `成功建立活動！`
    });
  } catch (err) {
    console.error('[Admin API Error]', err);
    return NextResponse.json({ error: '發生錯誤' }, { status: 500 });
  }
}

