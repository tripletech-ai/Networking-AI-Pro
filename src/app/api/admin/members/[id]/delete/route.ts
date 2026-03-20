import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  
  const formData = await req.formData();
  const eventId = formData.get('eventId') as string;

  if (!eventId || !id) {
    return NextResponse.json({ error: 'Missing eventId or memberId' }, { status: 400 });
  }

  // Ensure this event belongs to the organizer
  const event = await prisma.event.findUnique({
    where: { id: eventId, organizerId: String(session.id) }
  });

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  // Remove attendance link (this effectively removes them from this event's matching pool)
  await prisma.attendance.deleteMany({
    where: { eventId, memberId: id }
  });

  return NextResponse.json({ success: true });
}
