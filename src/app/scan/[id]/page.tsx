import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';


export default async function DigitalCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (!id) redirect('/');

  const member = await prisma.memberProfile.findUnique({
    where: { id: String(id) }
  });

  if (!member) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        找不到此商務檔案，可能已被移除或連結失效。
      </div>
    );
  }

  // Basic styling setup
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
      
      {/* 背景裝飾 */}
      <div style={{
        position: 'absolute', top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '100vw', height: 400,
        background: 'radial-gradient(ellipse at top, rgba(197, 168, 128, 0.08) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 13, letterSpacing: '4px', color: 'var(--accent-gold-dark)', marginBottom: 12, fontWeight: 700 }}>
            DIGITAL BUSINESS CARD
          </div>
          <h1 className="font-serif" style={{ fontSize: 36, fontWeight: 700, color: 'var(--accent-blue)', lineHeight: 1.2 }}>
            {member.name}
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginTop: 8, fontWeight: 500 }}>
            {member.company} · {member.title}
          </p>
        </div>

        <div className="glass-card fade-in-up" style={{ padding: '32px 28px', marginBottom: 24, borderRadius: 24, background: '#fff' }}>
          
          <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
            <span style={{ padding: '6px 14px', background: 'rgba(197, 168, 128, 0.1)', color: 'var(--accent-gold-dark)', borderRadius: '100px', fontSize: 13, fontWeight: 600 }}>
              {member.industry}
            </span>
            {member.chapter && member.chapter !== '無' && member.chapter !== '未知' && (
              <span style={{ padding: '6px 14px', background: '#f1f5f9', color: '#64748b', borderRadius: '100px', fontSize: 13, fontWeight: 500 }}>
                {member.chapter}
              </span>
            )}
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: 'var(--accent-gold-dark)', marginBottom: 8, fontWeight: 700, letterSpacing: '1px' }}>核心服務與優勢</div>
            <div style={{ fontSize: 15, color: 'var(--accent-blue)', lineHeight: 1.7 }}>{member.services}</div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: 'var(--accent-gold-dark)', marginBottom: 8, fontWeight: 700, letterSpacing: '1px' }}>尋求的理想引薦</div>
            <div style={{ fontSize: 15, color: 'var(--accent-blue)', lineHeight: 1.7 }}>{member.lookingFor}</div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: 'var(--accent-gold-dark)', marginBottom: 8, fontWeight: 700, letterSpacing: '1px' }}>面臨的商業挑戰</div>
            <div style={{ fontSize: 15, color: 'var(--accent-blue)', lineHeight: 1.7, background: '#fff9f2', padding: 16, borderRadius: 12, border: '1px solid rgba(197, 168, 128, 0.1)' }}>
              {member.painPoints}
            </div>
          </div>

          {member.contactInfo && (
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>聯絡方式</div>
              <div style={{ fontSize: 16, color: 'var(--accent-blue)', fontWeight: 600 }}>{member.contactInfo}</div>
            </div>
          )}

        </div>

        <div className="fade-in-up" style={{ animationDelay: '0.2s', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
            已掃描完畢 · 此名片僅供本場活動使用
          </p>
        </div>

      </div>
    </main>
  );
}
