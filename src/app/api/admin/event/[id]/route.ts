import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = (await params) as { id: string };
  const organizer = await getSession();
  if (!organizer) return NextResponse.json({ error: '未登入' }, { status: 401 });

  try {
    // 1. 先確認權限與找出此活動的所有 attendance memberId
    const event = await prisma.event.findFirst({ where: { id, organizerId: organizer.id } });
    if (!event) return NextResponse.json({ error: '無權限或找不到活動' }, { status: 403 });

    const attendances = await prisma.attendance.findMany({
      where: { eventId: id },
      select: { memberId: true }
    });
    const memberIds = attendances.map(a => a.memberId).filter(Boolean) as string[];

    // 2. 刪除活動 (cascade 沒設定好的話需手動先刪 attendances)
    await prisma.attendance.deleteMany({ where: { eventId: id } });
    await prisma.event.delete({ where: { id } });

    // 3. 清理孤立的 MemberProfile (只屬於已刪活動的成員)
    if (memberIds.length > 0) {
      for (const memberId of memberIds) {
        const remainingAttendances = await prisma.attendance.count({
          where: { memberId }
        });
        if (remainingAttendances === 0) {
          // 此成員已不參加任何活動，可安全刪除
          await prisma.connection.deleteMany({
            where: { OR: [{ connectorId: memberId }, { connectedToId: memberId }] }
          });
          await prisma.memberProfile.delete({ where: { id: memberId } }).catch(() => {});
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Delete Event Error]', err);
    return NextResponse.json({ error: '刪除失敗' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = (await params) as { id: string };
  const organizer = await getSession();
  if (!organizer) return NextResponse.json({ error: '未登入' }, { status: 401 });
  
  const body = await req.json();
  const { isActive } = body;

  try {
    await prisma.event.updateMany({
      where: { id, organizerId: organizer.id },
      data: { isActive }
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: '更新狀態失敗' }, { status: 500 });
  }
}
