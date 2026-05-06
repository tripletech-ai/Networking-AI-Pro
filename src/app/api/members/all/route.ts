import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const eventId = url.searchParams.get('eventId');
    
    if (!eventId) return NextResponse.json([]);

    const attendances = await prisma.attendance.findMany({
      where: { eventId },
      include: { member: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(attendances.map(a => a.member).filter(Boolean));
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
