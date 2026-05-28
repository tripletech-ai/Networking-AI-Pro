import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signCheckinToken } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const code = req.nextUrl.searchParams.get('code')?.toUpperCase().trim();

  if (!code || code.length !== 4) {
    return NextResponse.json({ error: '通關碼格式錯誤' }, { status: 400 });
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event || !event.isActive) {
    return NextResponse.json({ error: '活動不存在或已結束' }, { status: 404 });
  }

  // Find member with this code in this event, scoped to this organizer to prevent cross-event leakage
  const attendance = await prisma.attendance.findFirst({
    where: { eventId, member: { checkinCode: code, organizerId: event.organizerId } },
    include: { member: true },
  });

  if (!attendance || !attendance.member) {
    return NextResponse.json({ error: '通關碼錯誤，請洽工作人員' }, { status: 404 });
  }

  const member = attendance.member;

  // Update checkin timestamp
  await prisma.attendance.update({
    where: { id: attendance.id },
    data: { checkinAt: new Date() },
  });

  const checkinToken = await signCheckinToken({ memberId: member.id, eventId });

  const response = NextResponse.json({
    id: member.id,
    name: member.name,
    company: member.company,
    title: member.title,
    industry: member.industry,
    chapter: member.chapter,
    services: member.services,
    lookingFor: member.lookingFor,
    painPoints: member.painPoints,
    contactInfo: member.contactInfo || '',
  });

  response.cookies.set({
    name: 'checkin-token',
    value: checkinToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return response;
}
