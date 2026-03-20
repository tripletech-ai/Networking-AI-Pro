import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { getSession } from '@/lib/auth';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function getEmbedding(text: string) {
  if (!OPENAI_API_KEY) return null;
  try {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({ input: text, model: 'text-embedding-3-small' })
    });
    const data = await res.json();
    return data?.data?.[0]?.embedding || null;
  } catch (err) {
    return null;
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
      // Import into existing event
      event = await prisma.event.findUnique({ where: { id: String(eventId), organizerId: String(session.id) } });
      if (!event) return NextResponse.json({ error: '找不到活動' }, { status: 404 });
    } else {
      // Create new event
      if (!eventName) return NextResponse.json({ error: '請提供活動名稱' }, { status: 400 });
      const slug = String(eventName).toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      event = await prisma.event.create({
        data: { name: eventName, slug, organizerId: String(session.id) }
      });
    }

    if (!guests || guests.length === 0) {
      return NextResponse.json({ success: true, eventId: event.id, message: '活動建立成功，目前無匯入名單。' });
    }

    let imported = 0;
    for (const g of guests) {
      if (!g.name) continue;
      
      const textToEmbed = `服務：${g.services || '無'}。尋找：${g.lookingFor || '無'}。痛點：${g.painPoints || '無'}`;
      const embeddingArray = await getEmbedding(textToEmbed);
      const embeddingStr = embeddingArray ? JSON.stringify(embeddingArray) : null;

      const member = await prisma.memberProfile.create({
        data: {
          organizerId: String(session.id),
          name: g.name, chapter: g.chapter || '貴賓', company: g.company || '無',
          title: g.title || '', industry: g.industry || '未分類', services: g.services || '',
          lookingFor: g.lookingFor || '', painPoints: g.painPoints || '',
          embedding: embeddingStr
        }
      });

      await prisma.attendance.create({
        data: { eventId: event.id, memberId: member.id }
      });
      imported++;
    }

    // 更新 Config (為了保持舊前端程式碼相容)
    try {
      const configPath = path.join(process.cwd(), 'src', 'data', 'config.json');
      fs.writeFileSync(configPath, JSON.stringify({
        orgName: session.name,
        eventName: event.name,
        eventId: event.id,
        updatedAt: new Date().toISOString()
      }), 'utf-8');
    } catch (e) {}

    return NextResponse.json({ success: true, eventId: event.id, message: `成功建立並匯入 ${imported} 位來賓！` });
  } catch (err) {
    console.error('[Admin API Error]', err);
    return NextResponse.json({ error: '發生錯誤' }, { status: 500 });
  }
}
