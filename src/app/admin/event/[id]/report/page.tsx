'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import NavBackButton from '@/components/NavBackButton';

export default function ROIReportPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/admin/event/${eventId}/dashboard`);
        const d = await res.json();
        setData(d);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchReport();
    const interval = setInterval(fetchReport, 10000);
    return () => clearInterval(interval);
  }, [eventId]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ position: 'relative', width: 52, height: 52 }}>
        <div style={{ position: 'absolute', inset: 0, border: '3px solid #f1f5f9', borderRadius: '50%' }}/>
        <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: 'var(--accent-gold)', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }}/>
      </div>
      <style>{`@keyframes spin{100%{transform:rotate(360deg)}}`}</style>
      <div style={{ color: 'var(--accent-gold-dark)', fontWeight: 600 }}>分析商機數據中...</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
      <header style={{ marginBottom: 40 }}>
        <NavBackButton
          href={`/admin/event/${eventId}`}
          label="返回管理中心"
          style={{ marginBottom: 16, fontSize: 14, padding: '8px 16px', borderRadius: 8 }}
        />
        <h1 className="font-serif" style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent-blue)', marginBottom: 8, letterSpacing: '-0.5px' }}>會後商機轉換報告 (ROI)</h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>EVENT PROJECT: {eventId} · 數據即時更新中</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 40 }}>
        <div className="glass-card" style={{ padding: 40, textAlign: 'center', background: '#fff' }}>
          <div className="font-serif" style={{ fontSize: 64, fontWeight: 800, color: 'var(--accent-gold-dark)' }}>
            {data?.stats?.totalCheckins || data?.recentCheckins?.length || 0}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8, fontWeight: 700, letterSpacing: '1px' }}>總參與人數</div>
        </div>
        <div className="glass-card" style={{ padding: 40, textAlign: 'center', background: '#fff' }}>
          <div className="font-serif" style={{ fontSize: 64, fontWeight: 800, color: 'var(--accent-gold-dark)' }}>
            {data?.stats?.totalConnections || 0}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8, fontWeight: 700, letterSpacing: '1px' }}>人脈連結總數 (SAVES)</div>
        </div>
        <div className="glass-card" style={{ padding: 40, textAlign: 'center', background: '#fff' }}>
          <div className="font-serif" style={{ fontSize: 64, fontWeight: 800, color: 'var(--accent-gold-dark)' }}>
            {data?.stats?.totalMessages || 0}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8, fontWeight: 700, letterSpacing: '1px' }}>訊息交換次數</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
        <div className="glass-card" style={{ padding: 32, background: '#fff' }}>
          <h3 className="font-serif" style={{ fontSize: 22, color: 'var(--accent-blue)', marginBottom: 24, fontWeight: 700 }}>熱門對接產業</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {data?.industryMap && Object.entries(data.industryMap).slice(0, 5).map(([ind, count]: any) => (
              <div key={ind} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #f8fafc' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{ind}</span>
                <span style={{ color: 'var(--accent-gold-dark)', fontWeight: 800, fontSize: 18 }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: 32, background: '#fff' }}>
          <h3 className="font-serif" style={{ fontSize: 22, color: 'var(--accent-blue)', marginBottom: 24, fontWeight: 700 }}>精準人脈節點 (Top Guests)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {data?.topConnectedMembers?.slice(0, 5).map((p: any) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div>
                  <div className="font-serif" style={{ color: 'var(--accent-blue)', fontWeight: 700, fontSize: 16 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{p.company}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, color: 'var(--accent-gold-dark)', fontWeight: 800 }}>{p.connectionsCount}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>連結收藏</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
