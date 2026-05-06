import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = (await params) as { id: string };
  const organizer = await getSession();
  if (!organizer) return NextResponse.json({ error: '未登入' }, { status: 401 });

  try {
    const data = await req.json();
    if (!data.name) return NextResponse.json({ error: '姓名必填' }, { status: 400 });

    const member = await prisma.memberProfile.create({
      data: {
        organizerId: String(organizer.id),
        name: data.name,
        company: data.company || '',
        title: data.title || '',
        industry: data.industry || '',
        chapter: data.chapter || '',
        services: data.services || '',
        lookingFor: data.lookingFor || '',
        painPoints: data.painPoints || '',
      }
    });

    await prisma.attendance.create({
      data: {
        eventId: id,
        memberId: member.id,
      }
    });

    return NextResponse.json({ success: true, memberId: member.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: '新增失敗' }, { status: 500 });
  }
}
