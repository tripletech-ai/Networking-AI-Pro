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
    <div style={{ minHeight: '100vh', padding: '60px 24px', background: '#f8fafc' }}>
      <div style={{ maxWidth: 1024, margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48, borderBottom: '1px solid #e2e8f0', paddingBottom: 24 }}>
          <div>
            <h1 className="font-serif" style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 8, height: 28, background: 'var(--accent-gold)', borderRadius: 4 }} />
              {String(session.name)} 主辦方儀表板
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, fontWeight: 500 }}>
              PREMIUM EVENT MANAGEMENT CENTER
            </p>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link href="/" target="_blank" className="btn-outline" style={{ padding: '8px 24px', fontSize: 13, minWidth: 120, textAlign: 'center' }}>
              瀏覽品牌前台
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="btn-primary" style={{ padding: '8px 24px', fontSize: 13, background: 'var(--accent-blue)', minWidth: 100 }}>
                安全登出
              </button>
            </form>
          </div>
        </header>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h2 className="font-serif" style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-blue)' }}>現有的商務活動</h2>
          <Link href="/admin/event/new" className="btn-gold" style={{ padding: '12px 28px', fontSize: 15, textDecoration: 'none', borderRadius: 100 }}>
            + 建立新活動專案
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="glass-card" style={{ padding: 80, textAlign: 'center', color: '#64748b', background: '#fff' }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>📊</div>
            您目前還沒有建立任何活動。點擊上方按鈕建立您的第一場交流會。
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {events.map((event: any) => (
              <Link prefetch={true} key={event.id} href={`/admin/event/${event.id}`} style={{ textDecoration: 'none' }}>
                <div 
                  className="glass-card fade-in-up" 
                  style={{ padding: 32, cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e2e8f0', transition: 'all 0.3s ease' }}
                >
                  <div className="font-serif" style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 8 }}>{event.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 32, fontWeight: 500 }}>
                    PROJECT CREATED: {new Date(event.createdAt).toLocaleDateString('zh-TW')}
                  </div>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, borderTop: '1px solid #f8fafc' }}>
                    <div style={{ color: 'var(--accent-gold-dark)', fontWeight: 600 }}>
                      <span style={{ fontSize: 28, fontWeight: 700, marginRight: 8 }}>{event._count?.attendances || 0}</span>
                      GUESTS
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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
