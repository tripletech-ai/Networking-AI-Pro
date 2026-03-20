'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface DashboardData {
  eventName: string;
  isActive: boolean;
  totalMembers: number;
  industryMap: Record<string, number>;
  chapterMap: Record<string, number>;
  recentCheckins: { id: string; name: string; company: string; title: string; industry: string; chapter: string; checkinTime: string }[];
  updatedAt: string;
}

export default function LiveDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/event/${eventId}/dashboard`);
      if (!res.ok) throw new Error('抓取失敗');
      const json = await res.json();
      setData(json);
      setError('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000); // 每 8 秒自動刷新
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0c' }}>
        <div style={{ color: '#c5a880', fontSize: 18 }}>載入中...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0c', flexDirection: 'column', gap: 16 }}>
        <div style={{ color: '#f87171', fontSize: 18 }}>{error || '無法載入'}</div>
        <button onClick={() => router.push('/admin')} style={{ color: '#c5a880', background: 'none', border: '1px solid rgba(197,168,128,0.3)', padding: '8px 24px', borderRadius: 8, cursor: 'pointer' }}>
          返回後台
        </button>
      </div>
    );
  }

  const sortedIndustries = Object.entries(data.industryMap).sort((a, b) => b[1] - a[1]);
  const maxIndustryCount = Math.max(...Object.values(data.industryMap), 1);
  const sortedChapters = Object.entries(data.chapterMap).sort((a, b) => b[1] - a[1]);

  const getHeatColor = (ratio: number) => {
    if (ratio === 0) return 'rgba(255,255,255,0.03)';
    if (ratio < 0.25) return 'rgba(197, 168, 128, 0.2)';
    if (ratio < 0.5) return 'rgba(197, 168, 128, 0.4)';
    if (ratio < 0.75) return 'rgba(197, 168, 128, 0.6)';
    return 'rgba(197, 168, 128, 0.85)';
  };

  const PIE_COLORS = ['#c5a880', '#9b805c', '#64748b', '#475569', '#334155', '#e2e8f0', '#94a3b8'];
  const totalWithIndustry = sortedIndustries.reduce((acc, curr) => acc + curr[1], 0) || 1;
  const generateConicGradient = () => {
    let acc = 0;
    return sortedIndustries.map(([_, count], idx) => {
      const percentage = (count / totalWithIndustry) * 100;
      const start = acc;
      acc += percentage;
      return `${PIE_COLORS[idx % PIE_COLORS.length]} ${start}% ${acc}%`;
    }).join(', ');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0c', padding: '32px', color: '#f8fafc' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 13, color: '#c5a880', letterSpacing: 3, fontWeight: 600, marginBottom: 8 }}>LIVE DASHBOARD</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{data.eventName}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 20,
            background: data.isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${data.isActive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: data.isActive ? '#22c55e' : '#ef4444',
              animation: data.isActive ? 'pulse 2s infinite' : 'none',
            }} />
            <span style={{ fontSize: 13, color: data.isActive ? '#22c55e' : '#ef4444' }}>
              {data.isActive ? '活動進行中' : '活動已暫停'}
            </span>
          </div>
          <button
            onClick={() => router.push(`/admin/event/${eventId}`)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}
          >
            返回管理
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      {/* 主要數字看板 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        <div style={{
          padding: 24, borderRadius: 16, background: 'linear-gradient(135deg, rgba(197,168,128,0.1), rgba(197,168,128,0.02))',
          border: '1px solid rgba(197,168,128,0.2)'
        }}>
          <div style={{ fontSize: 12, color: '#c5a880', fontWeight: 500, letterSpacing: 1, marginBottom: 8 }}>總報到人數</div>
          <div style={{ fontSize: 48, fontWeight: 700, color: '#c5a880', fontFamily: "'Playfair Display', serif" }}>{data.totalMembers}</div>
        </div>
        <div style={{ padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, letterSpacing: 1, marginBottom: 8 }}>涵蓋產業數</div>
          <div style={{ fontSize: 48, fontWeight: 700, color: '#f8fafc', fontFamily: "'Playfair Display', serif" }}>{sortedIndustries.length}</div>
        </div>
        <div style={{ padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, letterSpacing: 1, marginBottom: 8 }}>分會數量</div>
          <div style={{ fontSize: 48, fontWeight: 700, color: '#f8fafc', fontFamily: "'Playfair Display', serif" }}>{sortedChapters.length}</div>
        </div>
        <div style={{ padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, letterSpacing: 1, marginBottom: 8 }}>最後更新</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#64748b', marginTop: 8 }}>
            {new Date(data.updatedAt).toLocaleTimeString('zh-TW')}
          </div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>每 8 秒自動刷新</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* 左側大區塊 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* 產業分布 bar chart -> pie chart */}
          <div style={{ padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#c5a880', marginBottom: 20 }}>
              產業分布
            </h3>
            <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ 
                width: 160, height: 160, borderRadius: '50%', 
                background: `conic-gradient(${generateConicGradient()})`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sortedIndustries.map(([ind, count], idx) => (
                  <div key={ind} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                    <span style={{ fontSize: 13, color: '#e2e8f0' }}>{ind} <span style={{ color: '#94a3b8' }}>({count})</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右側 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* 最新報到 Live Feed */}
          <div style={{ padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#c5a880', marginBottom: 20 }}>
              最新報到
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 400, overflowY: 'auto' }}>
              {data.recentCheckins.map((p, i) => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px', borderRadius: 10,
                  background: i === 0 ? 'rgba(197,168,128,0.06)' : 'transparent',
                  border: i === 0 ? '1px solid rgba(197,168,128,0.15)' : '1px solid transparent',
                  animation: i === 0 ? 'slideIn 0.5s ease' : 'none',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: 'rgba(197,168,128,0.1)', border: '1px solid rgba(197,168,128,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: '#c5a880', flexShrink: 0,
                  }}>
                    {p.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.company}</div>
                  </div>
                  <div style={{
                    fontSize: 10, color: '#c5a880', padding: '4px 8px', borderRadius: 4,
                    background: 'rgba(197,168,128,0.1)', whiteSpace: 'nowrap'
                  }}>
                    {new Date(p.checkinTime).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })} 報到
                  </div>
                </div>
              ))}
              {data.recentCheckins.length === 0 && (
                <div style={{ textAlign: 'center', color: '#64748b', fontSize: 13, padding: 20 }}>
                  尚無報到紀錄
                </div>
              )}
            </div>
          </div>

          {/* 分會來源 */}
          <div style={{ padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#c5a880', marginBottom: 20 }}>
              分會來源
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'auto', paddingRight: 8 }}>
              {sortedChapters.map(([ch, count]) => (
                <div key={ch} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.02)',
                }}>
                  <span style={{ fontSize: 14, color: '#cbd5e1' }}>{ch}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#c5a880' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
