import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import SaveContactButton from '@/components/SaveContactButton';

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
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
      
      {/* 背景光暈 */}
      <div style={{
        position: 'absolute', top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '100vw', height: 400,
        background: 'radial-gradient(ellipse at top, rgba(197, 168, 128, 0.15) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 13, letterSpacing: '4px', color: '#c5a880', marginBottom: 12, fontWeight: 600 }}>
            DIGITAL BUSINESS CARD
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#f8fafc', fontFamily: "'Playfair Display', serif" }}>
            {member.name}
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8', marginTop: 8 }}>
            {member.company} · {member.title}
          </p>
        </div>

        <div className="glass-card fade-in-up" style={{ padding: 32, marginBottom: 24, borderRadius: 24 }}>
          
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <span style={{ padding: '6px 14px', background: 'rgba(197, 168, 128, 0.1)', color: '#c5a880', borderRadius: '100px', fontSize: 13, fontWeight: 500 }}>
              {member.industry}
            </span>
            {member.chapter && member.chapter !== '無' && member.chapter !== '未知' && (
              <span style={{ padding: '6px 14px', background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', borderRadius: '100px', fontSize: 13 }}>
                {member.chapter}
              </span>
            )}
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>核心服務與優勢</div>
            <div style={{ fontSize: 15, color: '#f8fafc', lineHeight: 1.6 }}>{member.services}</div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>尋求的理想引薦</div>
            <div style={{ fontSize: 15, color: '#f8fafc', lineHeight: 1.6 }}>{member.lookingFor}</div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>面臨的商業挑戰</div>
            <div style={{ fontSize: 15, color: '#c5a880', lineHeight: 1.6, background: 'rgba(197, 168, 128, 0.05)', padding: 12, borderRadius: 8 }}>
              {member.painPoints}
            </div>
          </div>

          {member.contactInfo && (
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>聯絡方式</div>
              <div style={{ fontSize: 16, color: '#f8fafc', fontWeight: 500 }}>{member.contactInfo}</div>
            </div>
          )}

        </div>

        <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
          <SaveContactButton member={{
            id: member.id,
            name: member.name,
            company: member.company,
            title: member.title,
            industry: member.industry
          }} />
        </div>

      </div>
    </main>
  );
}
