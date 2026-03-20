import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = (await params) as { id: string };
  const organizer = await getSession();
  if (!organizer) return NextResponse.json({ error: '未登入' }, { status: 401 });

  try {
    const event = await prisma.event.findFirst({
      where: { id: String(id), organizerId: String(organizer.id) },
      include: {
        attendances: {
          include: { member: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!event) return NextResponse.json({ error: '活動不存在' }, { status: 404 });

    const members = event.attendances
      .map((a: any) => {
        let ch = a.member?.chapter || '貴賓';
        if (ch.includes('長輝')) ch = '長輝分會';
        return {
          id: a.member?.id || a.id,
          name: a.member?.name || a.visitorName || '未知',
          company: a.member?.company || a.visitorCompany || '',
          title: a.member?.title || a.visitorTitle || '',
          industry: a.member?.industry || a.visitorIndustry || '未分類',
          chapter: ch,
          checkinTime: a.createdAt instanceof Date ? a.createdAt.toISOString() : new Date(a.createdAt).toISOString(),
        };
      });

    // 產業分布
    const industryMap: Record<string, number> = {};
    members.forEach((m: any) => {
      industryMap[m.industry] = (industryMap[m.industry] || 0) + 1;
    });

    // 分會分布
    const chapterMap: Record<string, number> = {};
    members.forEach((m: any) => {
      chapterMap[m.chapter] = (chapterMap[m.chapter] || 0) + 1;
    });

    // 最近報到的
    const recentCheckins = members;

    // 實際統計數據：透過參與成員反向查詢連結與訊息
    const memberIds = members.map((m: any) => m.id);
    
    const totalConnections = await prisma.connection.count({
      where: {
        OR: [
          { connectorId: { in: memberIds } },
          { connectedToId: { in: memberIds } }
        ]
      }
    }).catch(() => 0);

    const totalMessages = await prisma.message.count({
      where: {
        senderId: { in: memberIds }
      }
    }).catch(() => 0);

    return NextResponse.json({
      eventName: event.name,
      isActive: event.isActive,
      totalMembers: members.length,
      industryMap,
      chapterMap,
      recentCheckins,
      stats: {
        totalCheckins: members.length,
        totalConnections,
        totalMessages
      },
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Dashboard API Error]', err);
    return NextResponse.json({ error: '抓取失敗' }, { status: 500 });
  }
}
