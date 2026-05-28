import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCheckinSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const eventId = url.searchParams.get('eventId');
    if (!eventId) return NextResponse.json([]);

    // Require valid checkin-token for this event
    const session = await getCheckinSession(eventId);
    if (!session) {
      return NextResponse.json({ error: '請先完成報到' }, { status: 401 });
    }

    const attendances = await prisma.attendance.findMany({
      where: { eventId },
      include: { member: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(attendances.map(a => a.member).filter(Boolean));
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
