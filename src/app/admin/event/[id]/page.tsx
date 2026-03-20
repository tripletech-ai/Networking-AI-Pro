import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
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
    <div style={{ minHeight: '100vh', padding: '60px 24px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 1024, margin: '0 auto' }}>
        
        <Link href="/admin" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32, fontSize: 14 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          返回活動列表
        </Link>
        
        <header style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 600, color: '#f8fafc', marginBottom: 8 }}>
              {event.name}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 16 }}>
              共 {members.length} 位嘉賓已準備好進行 AI 媒合
            </p>
            <CopyLinkButton eventId={event.id} />
            <div style={{ marginTop: 12 }}>
                <Link href={`/admin/event/${event.id}/dashboard`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 20px', borderRadius: 10,
                  background: 'linear-gradient(135deg, rgba(197,168,128,0.15), rgba(197,168,128,0.05))',
                  border: '1px solid rgba(197,168,128,0.3)',
                  color: '#c5a880', fontSize: 14, fontWeight: 600, textDecoration: 'none',
                  transition: 'all 0.2s',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                  開啟現場 Live Dashboard
                </Link>
                <Link href={`/admin/event/${event.id}/report`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 20px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f8fafc', fontSize: 14, fontWeight: 600, textDecoration: 'none',
                  transition: 'all 0.2s',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
                  商機 ROI 報表
                </Link>
              </div>
          </div>
          <EventControls eventId={event.id} isActive={event.isActive} />
        </header>

        {/* 活動數據統計 */}
        {members.length > 0 && (
          <EventStats members={membersForTable} attendances={attendancesForStats} />
        )}

        <div className="glass-card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: '#f8fafc' }}>名單管理 (Guest List)</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <a href={`/api/admin/event/${event.id}/export`} target="_blank" style={{ color: '#fff', background: 'rgba(34,197,94,0.2)', padding: '6px 14px', borderRadius: 8, fontSize: 13, border: 'none', cursor: 'pointer', transition: 'background 0.2s', textDecoration: 'none' }}>
                ↓ 匯出 CSV
              </a>
              <Link href={`/admin/event/${event.id}/member/new`} style={{ color: '#fff', background: 'rgba(197,168,128,0.2)', padding: '6px 14px', borderRadius: 8, fontSize: 13, textDecoration: 'none', transition: 'background 0.2s' }}>
                + 單筆新增
              </Link>
              <Link href={`/admin/event/${event.id}/import`} style={{ color: '#c5a880', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                + 批次匯入
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
