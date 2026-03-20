import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const connectorId = searchParams.get('connectorId');
  const connectedToId = searchParams.get('connectedToId');

  if (!connectorId || !connectedToId) {
    return NextResponse.json({ messages: [] });
  }

  try {
    const connection = await prisma.connection.findFirst({
      where: {
        OR: [
          { connectorId, connectedToId },
          { connectorId: connectedToId, connectedToId: connectorId }
        ]
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    return NextResponse.json(connection?.messages || []);
  } catch (err) {
    console.error('Chat GET error:', err);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { connectorId, connectedToId, senderId, content, eventId } = await req.json();

    let connection = await prisma.connection.findFirst({
      where: {
        OR: [
          { connectorId, connectedToId },
          { connectorId: connectedToId, connectedToId: connectorId }
        ]
      }
    });

    if (!connection) {
      connection = await prisma.connection.create({
        data: { connectorId, connectedToId, eventId }
      });
    }

    const message = await prisma.message.create({
      data: {
        connectionId: connection.id,
        senderId,
        content
      }
    });

    return NextResponse.json(message);
  } catch (err) {
    console.error('Chat POST error:', err);
    return NextResponse.json({ error: 'Send failed' }, { status: 500 });
  }
}
