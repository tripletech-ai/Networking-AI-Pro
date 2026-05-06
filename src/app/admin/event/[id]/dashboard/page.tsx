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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ color: 'var(--accent-gold-dark)', fontSize: 18, fontWeight: 600 }}>載入中...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', flexDirection: 'column', gap: 16 }}>
        <div style={{ color: '#ef4444', fontSize: 18, fontWeight: 600 }}>{error || '無法載入'}</div>
        <button onClick={() => router.push('/admin')} className="btn-outline" style={{ padding: '8px 24px', borderRadius: 8, cursor: 'pointer' }}>
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
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '32px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--accent-gold)', letterSpacing: 4, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>THE REAL-TIME ANALYTICS</div>
          <h1 className="font-serif" style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-blue)' }}>{data.eventName}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', borderRadius: 100,
            background: data.isActive ? 'rgba(22, 163, 74, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${data.isActive ? 'rgba(22, 163, 74, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: data.isActive ? '#16a34a' : '#ef4444',
              animation: data.isActive ? 'pulse 2s infinite' : 'none',
            }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: data.isActive ? '#16a34a' : '#ef4444' }}>
              {data.isActive ? '活動進行中' : '活動已暫停'}
            </span>
          </div>
          <button
            onClick={() => router.push(`/admin/event/${eventId}`)}
            className="btn-outline"
            style={{ padding: '8px 20px', fontSize: 13, borderRadius: 100 }}
          >
            返回管理
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* 主要數字看板 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
        <div className="glass-card" style={{
          padding: 32, background: 'linear-gradient(135deg, #fff, var(--bg-secondary))',
          border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{ fontSize: 13, color: 'var(--accent-gold-dark)', fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>總報到人數</div>
          <div className="font-serif" style={{ fontSize: 56, fontWeight: 800, color: 'var(--accent-blue)', lineHeight: 1 }}>{data.totalMembers}</div>
        </div>
        <div className="glass-card" style={{ padding: 32, background: '#fff', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>涵蓋產業數</div>
          <div className="font-serif" style={{ fontSize: 56, fontWeight: 800, color: 'var(--accent-blue)', lineHeight: 1 }}>{sortedIndustries.length}</div>
        </div>
        <div className="glass-card" style={{ padding: 32, background: '#fff', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>分會數量</div>
          <div className="font-serif" style={{ fontSize: 56, fontWeight: 800, color: 'var(--accent-blue)', lineHeight: 1 }}>{sortedChapters.length}</div>
        </div>
        <div className="glass-card" style={{ padding: 32, background: '#fff', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>系統狀態</div>
          <div className="font-serif" style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-gold)', marginTop: 8 }}>
            即時同步中
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, fontWeight: 500 }}>
            最後更新: {new Date(data.updatedAt).toLocaleTimeString('zh-TW')}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* 左側大區塊 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* 產業分布 bar chart -> pie chart */}
          <div className="glass-card" style={{ padding: 40, background: '#fff' }}>
            <h3 className="font-serif" style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 32 }}>
              產業組成比例圖
            </h3>
            <div style={{ display: 'flex', gap: 60, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ 
                width: 220, height: 220, borderRadius: '50%', 
                background: `conic-gradient(${generateConicGradient()})`,
                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.08)',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', inset: 30, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>
                  INDUSTRY
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px', flex: 1 }}>
                {sortedIndustries.map(([ind, count], idx) => (
                  <div key={ind} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: '1px solid #f8fafc' }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                    <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 600 }}>{ind}</span>
                    <span style={{ fontSize: 14, color: 'var(--accent-gold-dark)', fontWeight: 800, marginLeft: 'auto' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右側 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* 最新報到 Live Feed */}
          <div className="glass-card" style={{ padding: 32, background: '#fff', display: 'flex', flexDirection: 'column' }}>
            <h3 className="font-serif" style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 24 }}>
              最新報到嘉賓
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 500, overflowY: 'auto', paddingRight: 8 }}>
              {data.recentCheckins.map((p, i) => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px', borderRadius: 12,
                  background: i === 0 ? 'var(--bg-secondary)' : '#fff',
                  border: i === 0 ? '1px solid var(--accent-gold-light)' : '1px solid #f1f5f9',
                  animation: i === 0 ? 'slideIn 0.5s ease' : 'none',
                  boxShadow: i === 0 ? '0 4px 12px rgba(197, 168, 128, 0.1)' : 'none'
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'var(--accent-blue)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 800, color: '#fff', flexShrink: 0,
                  }}>
                    {p.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="font-serif" style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-blue)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{p.company}</div>
                  </div>
                  <div style={{
                    fontSize: 11, color: 'var(--accent-gold-dark)', fontWeight: 700, background: 'rgba(197,168,128,0.1)', padding: '6px 10px', borderRadius: 8
                  }}>
                    {new Date(p.checkinTime).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              {data.recentCheckins.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, padding: 40 }}>
                  尚無報到紀錄
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
