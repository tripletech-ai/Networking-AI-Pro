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

export default function GuestForm({ onSubmit, error }: Props) {
  const [form, setForm] = useState<GuestData>({
    name: '', chapter: '', company: '', title: '',
    industry: '', services: '', lookingFor: '', painPoints: '', contactInfo: '',
  });

  const handleWalkinSubmit = () => {
    onSubmit(form);
  };

  const walkinValid = form.name && form.company && form.title && form.industry && form.services && form.lookingFor && form.painPoints;

  return (
    <div style={{ position: 'relative', zIndex: 10 }}>
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
            />
          </div>
        ))}

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8, fontFamily: "'Noto Serif TC', serif", fontWeight: 600 }}>所屬產業類別 <span style={{ color: 'var(--accent-gold)' }}>*</span></label>
          <select
            className="input-field" value={form.industry} style={{ cursor: 'pointer', background: '#fff', border: '1px solid #e2e8f0', color: 'var(--text-primary)' }}
            onChange={e => setForm({ ...form, industry: e.target.value })}
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
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8, fontFamily: "'Noto Serif TC', serif", fontWeight: 600 }}>今天希望能認識什麼樣的人？ <span style={{ color: 'var(--accent-gold)' }}>*</span></label>
          <input
            className="input-field" placeholder="例如：尋求與大型零售通路的採購經理合作" value={form.lookingFor}
            style={{ background: '#fff', border: '1px solid #e2e8f0', color: 'var(--text-primary)' }}
            onChange={e => setForm({ ...form, lookingFor: e.target.value })}
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8, fontFamily: "'Noto Serif TC', serif", fontWeight: 600 }}>您目前面臨最大的商業痛點為何？ <span style={{ color: 'var(--accent-gold)' }}>*</span></label>
          <textarea
            className="input-field" style={{ minHeight: 90, resize: 'vertical', background: '#fff', border: '1px solid #e2e8f0', color: 'var(--text-primary)' }}
            placeholder="例如：行銷成本越來越高但轉換率降低，需要尋求新的線下轉換管道" value={form.painPoints}
            onChange={e => setForm({ ...form, painPoints: e.target.value })}
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
        className="btn-primary"
        style={{ width: '100%', marginTop: 36, padding: '16px', fontSize: 16 }}
        disabled={!walkinValid}
        onClick={handleWalkinSubmit}
      >
        儲存資料並啟動高階運算
      </button>
    </div>
  );
}
