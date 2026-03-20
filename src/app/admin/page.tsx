import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const events = await prisma.event.findMany({
    where: { organizerId: String(session.id) },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { attendances: true }
      }
    }
  });

  return (
    <div style={{ minHeight: '100vh', padding: '60px 24px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 1024, margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: '#f8fafc', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 8, height: 24, background: '#c5a880', borderRadius: 4 }} />
              {String(session.name)} 後台儀表板
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 15 }}>
              管理您的商務交流活動與會員名單
            </p>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link href="/" target="_blank" style={{ color: '#c5a880', border: '1px solid rgba(197,168,128,0.3)', padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>
              前往前台
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 14, background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                登出
              </button>
            </form>
          </div>
        </header>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 500, color: '#f8fafc' }}>活動列表 (Events)</h2>
          <Link href="/admin/event/new" className="btn-primary" style={{ padding: '10px 20px', fontSize: 14, textDecoration: 'none' }}>
            + 建立新活動
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="glass-card" style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>
            您目前還沒有建立任何活動。點擊上方按鈕建立您的第一場交流會。
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {events.map((event: any) => (
              <Link key={event.id} href={`/admin/event/${event.id}`} style={{ textDecoration: 'none' }}>
                <div className="glass-card fade-in-up" style={{ padding: 24, cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#f8fafc', marginBottom: 8 }}>{event.name}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>
                    建立於 {new Date(event.createdAt).toLocaleDateString('zh-TW')}
                  </div>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: 14, color: '#c5a880' }}>
                      <span style={{ fontSize: 24, fontWeight: 600, marginRight: 6 }}>{event._count?.attendances || 0}</span>
                      位來賓報到
                    </div>
                    <div style={{ color: '#64748b' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
