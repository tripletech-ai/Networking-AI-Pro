import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import NavBackButton from '@/components/NavBackButton';
import CopyLinkButton from '@/components/CopyLinkButton';
import EventControls from '@/components/EventControls';
import MemberTable from '@/components/MemberTable';
import EventStats from '@/components/EventStats';

export default async function EventDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id: String(id), organizerId: String(session.id) },
    include: {
      attendances: {
        include: { member: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!event) redirect('/admin');

  const members = event.attendances.map((a: any) => a.member).filter(Boolean);
  const attendancesForStats = event.attendances.map((a: any) => ({
    createdAt: a.createdAt.toISOString(),
  }));

  const membersForTable = members.map((m: any) => ({
    id: m.id,
    name: m.name,
    company: m.company,
    title: m.title,
    industry: m.industry,
    chapter: m.chapter,
    services: m.services || '',
    lookingFor: m.lookingFor || '',
    painPoints: m.painPoints || '',
  }));

  return (
    <div style={{ minHeight: '100vh', padding: '60px 24px', background: '#f8fafc' }}>
      <div style={{ maxWidth: 1024, margin: '0 auto' }}>
        
        <NavBackButton
          href="/admin"
          label="返回儀表板"
          className=""
          style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 14, fontWeight: 500, background: 'none', border: 'none', padding: 0 }}
        />
        
        <header style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="font-serif" style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 8 }}>
              {event.name}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 24, fontWeight: 500 }}>
              共 {members.length} 位嘉賓已準備好進行 AI 媒合
            </p>
            <CopyLinkButton eventId={event.id} />
            <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                <Link href={`/admin/event/${event.id}/dashboard`} className="btn-gold" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 24px', borderRadius: 100,
                  fontSize: 14, fontWeight: 700, textDecoration: 'none',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                  開啟現場 Live Dashboard
                </Link>
                <Link href={`/admin/event/${event.id}/report`} className="btn-outline" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 24px', borderRadius: 100,
                  fontSize: 14, fontWeight: 700, textDecoration: 'none',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
                  商機解析報表
                </Link>
              </div>
          </div>
          <EventControls eventId={event.id} isActive={event.isActive} />
        </header>

        {/* 活動數據統計 */}
        {members.length > 0 && (
          <EventStats members={membersForTable} attendances={attendancesForStats} />
        )}

        <div className="glass-card" style={{ padding: 40, background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, borderBottom: '1px solid #f1f5f9', paddingBottom: 20 }}>
            <h2 className="font-serif" style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-blue)' }}>嘉賓名單管理</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <a href={`/api/admin/event/${event.id}/export`} target="_blank" style={{ color: '#16a34a', background: 'rgba(22, 163, 74, 0.08)', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                ↓ 匯出 CSV
              </a>
              <Link href={`/admin/event/${event.id}/member/new`} className="btn-primary" style={{ padding: '8px 20px', fontSize: 13, textDecoration: 'none' }}>
                + 單筆新增
              </Link>
              <Link href={`/admin/event/${event.id}/import`} style={{ color: 'var(--accent-gold-dark)', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                + 批次匯入來賓
              </Link>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <MemberTable members={membersForTable} eventId={event.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
