'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

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

  if (loading) return <div style={{ padding: 40, color: '#c5a880' }}>分析商機數據中...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
      <header style={{ marginBottom: 40 }}>
        <a href={`/admin/event/${eventId}`} style={{ color: '#64748b', textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg> 返回管理頁面
        </a>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>會後商機轉換報告 (ROI)</h1>
        <p style={{ color: '#94a3b8' }}>Event ID: {eventId} · 數據即時更新中</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 40 }}>
        <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: '#c5a880' }}>
            {data?.stats?.totalCheckins || data?.recentCheckins?.length || 0}
          </div>
          <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 8 }}>總參與人數</div>
        </div>
        <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: '#c5a880' }}>
            {data?.stats?.totalConnections || 0}
          </div>
          <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 8 }}>人脈連結總數 (Saves)</div>
        </div>
        <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: '#c5a880' }}>
            {data?.stats?.totalMessages || 0}
          </div>
          <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 8 }}>訊息交換總次數</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, color: '#f8fafc', marginBottom: 20 }}>熱門對接產業</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data?.industryMap && Object.entries(data.industryMap).slice(0, 5).map(([ind, count]: any) => (
              <div key={ind} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#cbd5e1' }}>{ind}</span>
                <span style={{ color: '#c5a880', fontWeight: 600 }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, color: '#f8fafc', marginBottom: 20 }}>高價值人脈節點 (Top Guests)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data?.recentCheckins?.slice(0, 5).map((p: any) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                <span style={{ color: '#f8fafc' }}>{p.name} · {p.company}</span>
                <span style={{ fontSize: 12, color: '#c5a880' }}>獲存 12 次</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
