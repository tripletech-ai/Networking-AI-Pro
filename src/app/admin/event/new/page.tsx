'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function NewEventPage() {
  const router = useRouter();
  const [eventName, setEventName] = useState('');
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      
      // Auto-guess mapping based on common names
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
    if (!eventName) return setError('請輸入活動名稱');
    if (csvRows.length > 0 && mapping['name'] === undefined) return setError('必須對應「姓名」欄位');

    setLoading(true);
    setError('');

    const mappedGuests = csvRows.map(row => {
      const getVal = (key: string) => mapping[key] !== undefined ? row[mapping[key]] : '';
      return {
        name: getVal('name'),
        company: getVal('company'),
        title: getVal('title'),
        industry: getVal('industry'),
        chapter: getVal('chapter'),
        services: getVal('services'),
        lookingFor: getVal('lookingFor'),
        painPoints: getVal('painPoints'),
      };
    }).filter(g => g.name);

    try {
      const res = await fetch('/api/admin/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName, guests: mappedGuests })
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/admin`);
        router.refresh();
      } else {
        setError(data.error);
      }
    } catch {
      setError('連線失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '60px 24px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Link href="/admin" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32, fontSize: 14 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          返回儀表板
        </Link>

        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#f8fafc', marginBottom: 24 }}>新增活動與匯入名單</h1>
        
        <div className="glass-card" style={{ padding: 32 }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, color: '#c5a880', marginBottom: 8, fontWeight: 500 }}>活動名稱</label>
            <input type="text" className="input-field" placeholder="例如：4月產業交流會" value={eventName} onChange={e => setEventName(e.target.value)} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, color: '#c5a880', marginBottom: 8, fontWeight: 500 }}>上傳報名名單 (CSV 格式)</label>
            <input type="file" accept=".csv" onChange={handleFileUpload} style={{ color: '#94a3b8', fontSize: 14 }} />
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>支援所有表單系統之匯出檔，上傳後可手動進行欄位配對。</p>
          </div>

          {csvHeaders.length > 0 && (
            <div style={{ marginTop: 32, padding: 24, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: 16, color: '#f8fafc', marginBottom: 16 }}>欄位智能對應 (Smart Column Mapping)</h3>
              <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>請將左側系統所需欄位，對應至您上傳表單的實際欄位：</p>
              
              <div style={{ display: 'grid', gap: 16 }}>
                {REQUIRED_FIELDS.map(field => (
                  <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 140, fontSize: 14, color: '#cbd5e1' }}>{field.label}</div>
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

          <div style={{ marginTop: 32 }}>
            <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '12px 0', fontSize: 16 }}>
              {loading ? 'AI 向量化處理中 (約需數十秒)...' : '建立活動並匯入名單'}
            </button>
            <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 12 }}>
              送出後，系統將透過 AI 語意模型為每位嘉賓產生商務匹配向量。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
