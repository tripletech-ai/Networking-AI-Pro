import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: '未登入' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, company, title, industry, chapter, services, lookingFor, painPoints } = body;

  try {
    // Verify ownership
    const member = await prisma.memberProfile.findUnique({ where: { id } });
    if (!member || member.organizerId !== String(session.id)) {
      return NextResponse.json({ error: '無權限編輯此成員' }, { status: 403 });
    }

    await prisma.memberProfile.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(company !== undefined && { company }),
        ...(title !== undefined && { title }),
        ...(industry !== undefined && { industry }),
        ...(chapter !== undefined && { chapter }),
        ...(services !== undefined && { services }),
        ...(lookingFor !== undefined && { lookingFor }),
        ...(painPoints !== undefined && { painPoints }),
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Member PATCH Error]', err);
    return NextResponse.json({ error: '更新失敗' }, { status: 500 });
  }
}
