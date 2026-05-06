'use client';

interface Props {
  members: any[];
  attendances: any[];
}

export default function EventStats({ members, attendances }: Props) {
  // 產業分布計算
  const industryMap: Record<string, number> = {};
  members.forEach(m => {
    const ind = m.industry || '未分類';
    industryMap[ind] = (industryMap[ind] || 0) + 1;
  });
  const sortedIndustries = Object.entries(industryMap).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(...Object.values(industryMap), 1);

  // 分會分布
  const chapterMap: Record<string, number> = {};
  members.forEach(m => {
    const ch = m.chapter || '無';
    chapterMap[ch] = (chapterMap[ch] || 0) + 1;
  });
  const sortedChapters: [string, number][] = Object.entries(chapterMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>

      {/* 產業分布圓餅圖 */}
      <div className="glass-card" style={{ padding: 32, background: '#fff' }}>
        <h3 className="font-serif" style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          產業分布
        </h3>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ 
            width: 140, height: 140, borderRadius: '50%', 
            background: `conic-gradient(${generateConicGradient()})`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sortedIndustries.map(([ind, count], idx) => (
              <div key={ind} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: '4px', background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 600 }}>{ind} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({count})</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 分會來源統計 */}
      <div className="glass-card" style={{ padding: 32, background: '#fff' }}>
        <h3 className="font-serif" style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          分會來源分析
        </h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', maxHeight: 300, overflowY: 'auto' }}>
          {sortedChapters.map(([ch, count]) => (
            <div key={ch} style={{
              padding: '10px 18px', borderRadius: 8,
              background: '#f8fafc', border: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'center', gap: 10
            }}>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>{ch}</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-gold-dark)' }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
