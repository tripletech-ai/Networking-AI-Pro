import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const organizer = await getSession();
  if (!organizer) return NextResponse.json({ error: '未登入' }, { status: 401 });

  const event = await prisma.event.findFirst({ where: { id: eventId, organizerId: String(organizer.id) } });
  if (!event) return NextResponse.json({ error: '無權限' }, { status: 403 });

  const attendances = await prisma.attendance.findMany({
    where: { eventId },
    include: { member: { select: { id: true, name: true, company: true } } },
  });

  return NextResponse.json(attendances.map(a => a.member).filter(Boolean));
}
