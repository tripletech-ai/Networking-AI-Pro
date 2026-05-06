import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get('memberId');

  if (!memberId) {
    return NextResponse.json({ error: 'Missing memberId' }, { status: 400 });
  }

  try {
    const connections = await prisma.connection.findMany({
      where: { connectorId: memberId },
      include: { connectedTo: true },
      orderBy: { metAt: 'desc' }
    });

    const contacts = connections.map(c => ({
      id: c.connectedTo.id,
      name: c.connectedTo.name,
      company: c.connectedTo.company,
      title: c.connectedTo.title,
      industry: c.connectedTo.industry,
      savedAt: c.metAt.toISOString(),
      connectionId: c.id
    }));

    return NextResponse.json({ contacts });
  } catch (err) {
    console.error('API Error getting contacts:', err);
    return NextResponse.json({ error: '讀取名片夾失敗' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { connectorId, connectedToId, eventId } = await req.json();

    if (!connectorId || !connectedToId) {
       return NextResponse.json({ error: 'Missing IDs' }, { status: 400 });
    }

    const connection = await prisma.connection.upsert({
      where: {
        connectorId_connectedToId: {
          connectorId,
          connectedToId
        }
      },
      update: {},
      create: {
        connectorId,
        connectedToId,
        eventId: eventId || null
      }
    });

    return NextResponse.json({ success: true, connection });
  } catch (err) {
    console.error('API Error saving contact:', err);
    return NextResponse.json({ error: '儲存失敗' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const connectorId = searchParams.get('connectorId');
    const connectedToId = searchParams.get('connectedToId');

    if (!connectorId || !connectedToId) {
      return NextResponse.json({ error: 'Missing IDs' }, { status: 400 });
    }

    await prisma.connection.deleteMany({
      where: {
        connectorId,
        connectedToId
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API Error deleting contact:', err);
    return NextResponse.json({ error: '刪除失敗' }, { status: 500 });
  }
}
