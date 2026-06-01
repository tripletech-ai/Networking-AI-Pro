'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const REQUIRED_FIELDS = [
  { key: 'name', label: '姓名 (必填)', keywords: ['姓名', '名字', 'name', '名稱', '來賓'] },
  { key: 'company', label: '公司名稱', keywords: ['公司', 'company', '組織', '企業', '機構'] },
  { key: 'title', label: '職稱', keywords: ['職稱', '職銜', 'title', '職位', '頭銜'] },
  { key: 'industry', label: '產業類別', keywords: ['產業', 'industry', '行業', '類別'] },
  { key: 'chapter', label: '所屬分會 (可填無或貴賓)', keywords: ['分會', 'chapter', '會別', '所屬'] },
  { key: 'services', label: '提供服務 / 專長', keywords: ['服務', 'service', '專長', '強項', '提供'] },
  { key: 'lookingFor', label: '尋找資源 / 理想引薦', keywords: ['尋找', '認識', '需求', 'looking', '引薦', '希望'] },
  { key: 'painPoints', label: '目前痛點 / 挑戰', keywords: ['痛點', '挑戰', 'pain', '困難', '問題'] }
];

export default function ImportToEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const parseCSVRaw = (text: string) => {
    const result = [];
    const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
    for (const line of lines) {
      const cols = [];
      let cur = '', inQ = false;
      for (const c of line) {
        if (c === '"') inQ = !inQ;
        else if (c === ',' && !inQ) { cols.push(cur.replace(/^"|"$/g, '').trim()); cur = ''; }
        else cur += c;
      }
      cols.push(cur.replace(/^"|"$/g, '').trim());
      result.push(cols);
    }
    return result;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rows = parseCSVRaw(text);
      if (rows.length < 2) throw new Error('CSV 內容筆數不足 (需包含標題列與至少一筆資料)');

      const headers = rows[0];
      setCsvHeaders(headers);
      setCsvRows(rows.slice(1));

      const initialMap: Record<string, number> = {};
      REQUIRED_FIELDS.forEach(f => {
        const idx = headers.findIndex(h =>
          f.keywords.some((kw: string) => h.toLowerCase().includes(kw.toLowerCase()))
        );
        if (idx !== -1) initialMap[f.key] = idx;
      });
      setMapping(initialMap);
      setError('');
    } catch (err: any) {
      setError(err.message || '讀取檔案失敗');
    }
  };

  const handleSubmit = async () => {
    if (csvRows.length > 0 && mapping['name'] === undefined) return setError('必須對應「姓名」欄位');

    setLoading(true);
    setError('');
    setProgress('準備匯入資料...');

    const mappedGuests = csvRows.map(row => {
      const getVal = (key: string) => mapping[key] !== undefined ? row[mapping[key]] : '';
      return {
        name: getVal('name'), company: getVal('company'), title: getVal('title'),
        industry: getVal('industry'), chapter: getVal('chapter'), services: getVal('services'),
        lookingFor: getVal('lookingFor'), painPoints: getVal('painPoints'),
      };
    }).filter(g => g.name);

    try {
      // Fetch existing names for duplicate detection (admin won't have checkin-token, so 401 = skip dedup)
      setProgress('檢查重複來賓...');
      const existingRes = await fetch(`/api/admin/event/${eventId}/members`);
      let existingNames: Set<string> = new Set();
      if (existingRes.ok) {
        const existing = await existingRes.json();
        if (Array.isArray(existing)) existingNames = new Set(existing.map((m: any) => m.name));
      }

      const duplicates = mappedGuests.filter(g => existingNames.has(g.name)).map(g => g.name);
      const uniqueGuests = mappedGuests.filter(g => !existingNames.has(g.name));

      if (duplicates.length > 0) {
        setProgress(`跳過 ${duplicates.length} 位重複來賓：${duplicates.slice(0, 3).join('、')}${duplicates.length > 3 ? '...' : ''}`);
        await new Promise(r => setTimeout(r, 1500));
      }

      if (uniqueGuests.length === 0) {
        setError('所有來賓已在名單中，無需重複匯入');
        setProgress('');
        setLoading(false);
        return;
      }

      setProgress(`正在匯入 ${uniqueGuests.length} 位來賓...`);
      const progressTimer = setTimeout(() => setProgress('AI 批次產生向量中（約 10-20 秒）...'), 3000);

      const res = await fetch('/api/admin/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, guests: uniqueGuests }),
      });
      const data = await res.json();
      clearTimeout(progressTimer);

      if (data.success) {
        setProgress(`✓ 已匯入 ${uniqueGuests.length} 位來賓！`);
        if (data.memberIds?.length > 0) {
          fetch('/api/admin/embed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ memberIds: data.memberIds, guests: uniqueGuests }),
            keepalive: true,
          }).catch(() => {});
        }
        setTimeout(() => { router.push(`/admin/event/${eventId}`); router.refresh(); }, 800);
      } else {
        setError(data.error || '發生錯誤');
        setProgress('');
      }
    } catch {
      setError('連線失敗，請重試');
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page" style={{ minHeight: '100vh', padding: '60px 24px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Link href={`/admin/event/${eventId}`} style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32, fontSize: 14 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          返回活動管理
        </Link>

        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 24 }}>匯入追加名單</h1>

        <div className="glass-card" style={{ padding: 32, background: '#fff', border: '1px solid #e2e8f0' }}>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>上傳報名名單 (CSV 格式)</label>
            <input type="file" accept=".csv" onChange={handleFileUpload} style={{ color: 'var(--text-secondary)', fontSize: 14 }} />
          </div>

          {csvHeaders.length > 0 && (
            <div style={{ marginTop: 32, padding: 24, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: 16, color: 'var(--accent-blue)', marginBottom: 16, fontWeight: 600 }}>欄位智能對應 (Smart Column Mapping)</h3>
              <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>請將左側系統所需欄位，對應至您上傳表單的實際欄位：</p>

              <div style={{ display: 'grid', gap: 16 }}>
                {REQUIRED_FIELDS.map(field => (
                  <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 140, fontSize: 14, color: 'var(--text-secondary)' }}>{field.label}</div>
                    <div style={{ color: '#64748b' }}>➡</div>
                    <select
                      className="input-field"
                      style={{ flex: 1, padding: '8px 12px' }}
                      value={mapping[field.key] ?? -1}
                      onChange={e => setMapping({ ...mapping, [field.key]: parseInt(e.target.value) })}
                    >
                      <option value="-1">-- 不對應 / 留白 --</option>
                      {csvHeaders.map((h, i) => <option key={i} value={i}>{h}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <div style={{ color: '#f87171', fontSize: 14, margin: '24px 0 0' }}>{error}</div>}

          {progress && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: progress.startsWith('✓') ? '#22c55e' : '#c5a880', fontSize: 14, margin: '16px 0 0', fontWeight: 500 }}>
              {!progress.startsWith('✓') && (
                <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(197,168,128,0.3)', borderTopColor: '#c5a880', borderRadius: '50%', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
              )}
              {progress}
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          <div style={{ marginTop: 32 }}>
            <button className="btn-primary" onClick={handleSubmit} disabled={loading || csvRows.length === 0} style={{ width: '100%', padding: '12px 0', fontSize: 16 }}>
              {loading ? 'AI 向量化處理中 (約需數十秒)...' : '匯入名單'}
            </button>
            <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 12 }}>
              送出後，系統將透過 AI 語意模型為新增來賓產生商務匹配向量。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
