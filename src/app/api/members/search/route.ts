import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';
    if (q.length < 1) return NextResponse.json([]);

    let eventId = url.searchParams.get('eventId');
    
    if (!eventId) {
      try {
        const p = path.join(process.cwd(), 'src', 'data', 'config.json');
        if (fs.existsSync(p)) {
          eventId = JSON.parse(fs.readFileSync(p, 'utf-8')).eventId;
        }
      } catch {}
    }

    if (!eventId) return NextResponse.json([]);

    const attendances = await prisma.attendance.findMany({
      where: {
        eventId,
        member: {
          name: { contains: q }
        }
      },
      include: { member: true },
      take: 10
    });

    return NextResponse.json(attendances.map(a => a.member));
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
