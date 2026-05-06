import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = (await params) as { id: string };
  const organizer = await getSession();
  if (!organizer) return NextResponse.json({ error: '未登入' }, { status: 401 });

  try {
    const data = await req.json();
    
    // Safety & Input Validation
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: '無效的資料格式' }, { status: 400 });
    }
    
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
      return NextResponse.json({ error: '姓名必填且必須為有效的字串' }, { status: 400 });
    }
    
    if (data.name.length > 50) {
      return NextResponse.json({ error: '姓名不得超過 50 個字元' }, { status: 400 });
    }
    
    // Sanitize values to ensure they are strings
    const safeString = (val: any, maxLen: number = 200) => {
      if (!val) return '';
      const str = String(val).trim();
      return str.substring(0, maxLen);
    };

    const member = await prisma.memberProfile.create({
      data: {
        organizerId: String(organizer.id),
        name: safeString(data.name, 50),
        company: safeString(data.company, 100),
        title: safeString(data.title, 50),
        industry: safeString(data.industry, 50),
        chapter: safeString(data.chapter, 50),
        services: safeString(data.services, 500),
        lookingFor: safeString(data.lookingFor, 500),
        painPoints: safeString(data.painPoints, 500),
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
