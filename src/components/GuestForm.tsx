'use client';

import { useState } from 'react';
import { GuestData } from '@/types';

interface Props {
  onSubmit: (data: GuestData) => void;
  error?: string;
}

const INDUSTRY_OPTIONS = [
  '行銷廣告', '資訊科技', '金融保險', '建築營造', '健康醫療',
  '法律服務', '教育培訓', '餐飲旅遊', '零售業', '零售製造',
  '資產活化', '命理風水', '其他',
];

const Spinner = () => (
  <span style={{
    display: 'inline-block', width: 14, height: 14,
    border: '2px solid rgba(255,255,255,0.35)',
    borderTopColor: '#fff', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite', verticalAlign: 'middle', marginRight: 6
  }} />
);

export default function GuestForm({ onSubmit, error }: Props) {
  const [form, setForm] = useState<GuestData>({
    name: '', chapter: '', company: '', title: '',
    industry: '', services: '', lookingFor: '', painPoints: '', contactInfo: '',
  });

  // Magic Fill state
  const [showMagic, setShowMagic] = useState(false);
  const [magicText, setMagicText] = useState('');
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicDone, setMagicDone] = useState(false);

  // Submit loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMagicFill = async () => {
    if (!magicText.trim() || magicLoading) return;
    setMagicLoading(true);
    try {
      const res = await fetch('/api/ai/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: magicText })
      });
      const data = await res.json();
      if (data && !data.error) {
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
        setMagicDone(true);
        setTimeout(() => setShowMagic(false), 800);
      }
    } catch {}
    setMagicLoading(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!walkinValid || isSubmitting) return;
    setIsSubmitting(true);
    onSubmit(form);
    // Reset after 10s in case error occurs
    setTimeout(() => setIsSubmitting(false), 10000);
  };

  const walkinValid = form.name && form.company && form.title && form.industry && form.services && form.lookingFor && form.painPoints;

  return (
    <div style={{ position: 'relative', zIndex: 10 }}>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>

      {/* Magic Fill 按鈕 */}
      <div style={{ marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => setShowMagic(!showMagic)}
          style={{
            width: '100%', padding: '14px 20px', borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(197, 168, 128, 0.15), rgba(197, 168, 128, 0.05))',
            border: '1px dashed rgba(197, 168, 128, 0.5)',
            color: '#c5a880', cursor: 'pointer', fontSize: 15, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'all 0.2s'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          ✨ AI Magic Fill — 一句話自動填表
        </button>

        {/* Magic Fill 對話框 */}
        {showMagic && (
          <div style={{
            marginTop: 12, padding: 20, borderRadius: 16,
            background: '#fffdf9',
            border: '1px solid rgba(197, 168, 128, 0.3)',
            boxShadow: '0 8px 24px rgba(197, 168, 128, 0.1)'
          }}>
            <div style={{ fontSize: 14, color: 'var(--accent-gold-dark)', marginBottom: 4, fontWeight: 700 }}>
              ✦ AI 商務自動建檔
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14, lineHeight: 1.5 }}>
              用自己的話介紹你的工作，AI 會幫你整理成完整的商務檔案。<br/>
              <span style={{ color: '#b0a090' }}>例：「我是王大明，在長輝分會，做外牆防水工程，想認識裝潢建材商，目前客戶太少」</span>
            </div>
            <textarea
              value={magicText}
              onChange={e => setMagicText(e.target.value)}
              placeholder="直接講給 AI 聽，越自然越好..."
              style={{
                width: '100%', minHeight: 80, padding: '12px 16px',
                background: '#fff', border: '1px solid #e2e8f0',
                borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, resize: 'vertical',
                lineHeight: 1.6, boxSizing: 'border-box'
              }}
            />
            <button
              type="button"
              onClick={handleMagicFill}
              disabled={magicLoading || !magicText.trim()}
              style={{
                marginTop: 12, width: '100%', padding: '12px',
                background: magicDone ? '#22c55e' : 'var(--accent-gold)',
                border: 'none', borderRadius: 10, color: '#fff',
                fontSize: 15, fontWeight: 700, cursor: magicLoading ? 'wait' : 'pointer',
                opacity: !magicText.trim() ? 0.5 : 1, transition: 'all 0.3s'
              }}
            >
              {magicLoading ? <><Spinner />AI 解析中...</> : magicDone ? '✓ 一鍵更新資料' : '一鍵 AI 自動填表'}
            </button>
          </div>
        )}
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 0 24px' }} />

      {/* 表單欄位 */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {([
          ['name', 'name', '姓名', '王大明', true],
          ['chapter', 'chapter', '所屬分會名稱', '若無請填無', false],
          ['company', 'company', '公司或組織名稱', '某某科技有限公司', true],
          ['title', 'title', '職銜 / 職稱', '創辦人兼執行長', true],
        ] as any[]).map(([field, _id, label, ph, req]) => (
          <div key={field}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8, fontFamily: "'Noto Serif TC', serif", fontWeight: 600 }}>
              {label} {req && <span style={{ color: 'var(--accent-gold)' }}>*</span>}
            </label>
            <input
              className="input-field" placeholder={ph} value={(form as any)[field]}
              style={{ background: '#fff', border: '1px solid #e2e8f0', color: 'var(--text-primary)' }}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              required={req}
            />
          </div>
        ))}

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8, fontFamily: "'Noto Serif TC', serif", fontWeight: 600 }}>所屬產業類別 <span style={{ color: 'var(--accent-gold)' }}>*</span></label>
          <select
            className="input-field" value={form.industry} style={{ cursor: 'pointer', background: '#fff', border: '1px solid #e2e8f0', color: 'var(--text-primary)' }}
            onChange={e => setForm({ ...form, industry: e.target.value })}
            required
          >
            <option value="" style={{ background: '#fff' }}>請選擇您的分類</option>
            {INDUSTRY_OPTIONS.map(opt => <option key={opt} value={opt} style={{ background: '#fff' }}>{opt}</option>)}
          </select>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8, fontFamily: "'Noto Serif TC', serif", fontWeight: 600 }}>您的核心服務與強項 <span style={{ color: 'var(--accent-gold)' }}>*</span></label>
          <input
            className="input-field" placeholder="例如：專注B2B品牌重塑設計" value={form.services}
            style={{ background: '#fff', border: '1px solid #e2e8f0', color: 'var(--text-primary)' }}
            onChange={e => setForm({ ...form, services: e.target.value })}
            required
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8, fontFamily: "'Noto Serif TC', serif", fontWeight: 600 }}>今天希望能認識什麼樣的人？ <span style={{ color: 'var(--accent-gold)' }}>*</span></label>
          <input
            className="input-field" placeholder="例如：尋求與大型零售通路的採購經理合作" value={form.lookingFor}
            style={{ background: '#fff', border: '1px solid #e2e8f0', color: 'var(--text-primary)' }}
            onChange={e => setForm({ ...form, lookingFor: e.target.value })}
            required
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8, fontFamily: "'Noto Serif TC', serif", fontWeight: 600 }}>您目前面臨最大的商業痛點為何？ <span style={{ color: 'var(--accent-gold)' }}>*</span></label>
          <textarea
            className="input-field" style={{ minHeight: 90, resize: 'vertical', background: '#fff', border: '1px solid #e2e8f0', color: 'var(--text-primary)' }}
            placeholder="例如：行銷成本越來越高但轉換率降低，需要尋求新的線下轉換管道" value={form.painPoints}
            onChange={e => setForm({ ...form, painPoints: e.target.value })}
            required
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8, fontFamily: "'Noto Serif TC', serif", fontWeight: 600 }}>聯絡方式 (選填)</label>
          <input
            className="input-field" placeholder="例如：LINE ID / Email / 手機" value={form.contactInfo || ''}
            style={{ background: '#fff', border: '1px solid #e2e8f0', color: 'var(--text-primary)' }}
            onChange={e => setForm({ ...form, contactInfo: e.target.value })}
          />
        </div>
        </div>

        {error && (
          <div style={{ marginTop: 24, padding: 16, borderRadius: 10, border: '1px solid rgba(140, 115, 85, 0.4)', background: 'rgba(140, 115, 85, 0.1)', color: '#c5a880', fontSize: 14 }}>
            無法送出：{error}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', marginTop: 36, padding: '16px', fontSize: 16, opacity: isSubmitting ? 0.7 : 1, transition: 'opacity 0.2s' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? <><Spinner />AI 分析中，請稍候...</> : '儲存資料並啟動高階運算'}
        </button>
      </form>
    </div>
  );
}
