'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', company: '', title: '', industry: '', chapter: '',
    services: '', lookingFor: '', painPoints: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [magicText, setMagicText] = useState('');
  const [isMagicLoading, setIsMagicLoading] = useState(false);

  const handleMagicAutofill = async () => {
    if (!magicText.trim()) return;
    setIsMagicLoading(true);
    try {
      const res = await fetch('/api/ai/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: magicText })
      });
      const data = await res.json();
      if (!data.error) {
        setForm(prev => ({
          ...prev,
          name: data.name || prev.name,
          company: data.company || prev.company,
          title: data.title || prev.title,
          industry: data.industry || prev.industry,
          chapter: data.chapter || prev.chapter,
          services: data.services || prev.services,
          lookingFor: data.lookingFor || prev.lookingFor,
          painPoints: data.painPoints || prev.painPoints,
        }));
        setMagicText('');
      } else {
        alert(data.error);
      }
    } catch {
      alert('解析失敗');
    } finally {
      setIsMagicLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('姓名不可為空');
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/event/${id}/member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/admin/event/${id}`);
        router.refresh();
      } else {
        setError(data.error || '新增失敗');
      }
    } catch {
      setError('連線失敗');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: '姓名 *' },
    { key: 'company', label: '公司' },
    { key: 'title', label: '職稱' },
    { key: 'industry', label: '產業類別' },
    { key: 'chapter', label: '所屬分會' },
    { key: 'services', label: '提供服務 / 資源' },
    { key: 'lookingFor', label: '尋找合作 / 資源' },
    { key: 'painPoints', label: '痛點 / 挑戰' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '60px 24px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        
        <Link href={`/admin/event/${id}`} style={{ color: '#64748b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32, fontSize: 14 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          返回活動管理
        </Link>
        
        <div className="glass-card" style={{ padding: 40, background: '#fff', border: '1px solid #e2e8f0' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 8 }}>單筆新增來賓</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32, fontWeight: 500 }}>手動為此活動建立一筆來賓檔案。送出後，AI 即可在現場為其進行媒合。</p>

          {/* AI Magic Autofill */}
          <div style={{ background: 'var(--bg-secondary)', padding: 24, borderRadius: 16, marginBottom: 24, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent-gold-dark)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                AI Magic Autofill (智慧填表)
              </div>
            </div>
            <textarea 
              className="input-field" 
              placeholder="貼上對方的自介文、名片資訊，AI 會自動為您萃取並填入下方 8 個欄位..."
              value={magicText}
              onChange={e => setMagicText(e.target.value)}
              style={{ minHeight: 80, resize: 'vertical', marginBottom: 12, fontSize: 13, background: '#fff' }}
            />
            <button 
              type="button" 
              onClick={handleMagicAutofill} 
              disabled={isMagicLoading || !magicText.trim()}
              style={{
                background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dark))',
                border: 'none', borderRadius: 8, padding: '10px 20px', color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: (isMagicLoading || !magicText.trim()) ? 'not-allowed' : 'pointer',
                opacity: (isMagicLoading || !magicText.trim()) ? 0.5 : 1
              }}
            >
              {isMagicLoading ? '讀取並分析中...' : '一鍵生成表單'}
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {fields.slice(0, 5).map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>{f.label}</label>
                  <input
                    className="input-field"
                    value={(form as any)[f.key]}
                    required={f.key === 'name'}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ background: '#fbfbfc' }}
                  />
                </div>
              ))}
            </div>
            
            <div style={{ height: 1, background: '#e2e8f0', margin: '8px 0' }} />

            {fields.slice(5).map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>{f.label}</label>
                <textarea
                  className="input-field"
                  style={{ minHeight: 80, resize: 'vertical', background: '#fbfbfc' }}
                  value={(form as any)[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={`描述對方的${f.label}...`}
                />
              </div>
            ))}

            {error && <div style={{ color: '#f87171', fontSize: 14 }}>{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '16px', fontSize: 16, marginTop: 16 }}>
              {loading ? '建立中...' : '確認新增'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
