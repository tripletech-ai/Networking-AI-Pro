import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = (await params) as { id: string };
  const organizer = await getSession();
  if (!organizer) return new NextResponse('Unauthorized', { status: 401 });

  const event = await prisma.event.findFirst({
    where: { id, organizerId: String(organizer.id) },
    include: {
      attendances: { include: { member: true } }
    }
  });

  if (!event) return new NextResponse('Not Found', { status: 404 });

  const lines = ['報到時間,姓名,公司,職稱,產業,分會,服務項目,尋找資源,痛點'];
  
  for (const a of event.attendances) {
    const time = new Date(a.createdAt).toLocaleString('zh-TW');
    const name = a.member?.name || a.visitorName || '';
    const company = a.member?.company || a.visitorCompany || '';
    const title = a.member?.title || a.visitorTitle || '';
    const industry = a.member?.industry || a.visitorIndustry || '';
    const chapter = a.member?.chapter || '貴賓';
    const services = a.member?.services || a.visitorServices || '';
    const lookingFor = a.member?.lookingFor || a.visitorLookingFor || '';
    const painPoints = a.member?.painPoints || a.visitorPainPoints || '';

    // CSV escape
    const escape = (s: string) => `"${String(s).replace(/"/g, '""')}"`;
    lines.push([time, name, company, title, industry, chapter, services, lookingFor, painPoints].map(escape).join(','));
  }

  const csvContent = '\uFEFF' + lines.join('\n'); // add BOM for Excel
  const headers = new Headers();
  headers.set('Content-Type', 'text/csv; charset=utf-8');
  headers.set('Content-Disposition', `attachment; filename="event_${event.id}_members.csv"`);

  return new NextResponse(csvContent, { headers });
}
