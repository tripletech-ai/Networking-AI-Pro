'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

interface MemberData {
  id: string;
  name: string;
  company: string;
  title: string;
  industry: string;
  chapter: string;
  services: string;
  lookingFor: string;
  painPoints: string;
}

interface Props {
  member: MemberData;
  eventId: string;
  onClose: () => void;
}

export default function MemberEditModal({ member, eventId, onClose }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<MemberData>({ ...member });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!form.name.trim()) return setError('姓名不可為空');
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/members/${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, eventId })
      });
      const data = await res.json();
      if (data.success) {
        router.refresh();
        onClose();
      } else {
        setError(data.error || '儲存失敗');
      }
    } catch {
      setError('連線失敗');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: '姓名' },
    { key: 'company', label: '公司' },
    { key: 'title', label: '職稱' },
    { key: 'industry', label: '產業類別' },
    { key: 'chapter', label: '所屬分會' },
    { key: 'services', label: '提供服務' },
    { key: 'lookingFor', label: '尋找資源' },
    { key: 'painPoints', label: '痛點/挑戰' },
  ];

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const modalContent = (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '100%', maxWidth: 520, padding: 32,
          background: '#121316', border: '1px solid rgba(197,168,128,0.3)',
          maxHeight: '85vh', overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#f8fafc' }}>編輯成員資料</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>{f.label}</label>
              {f.key === 'painPoints' || f.key === 'lookingFor' || f.key === 'services' ? (
                <textarea
                  className="input-field"
                  style={{ minHeight: 60, resize: 'vertical' }}
                  value={(form as any)[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                />
              ) : (
                <input
                  className="input-field"
                  value={(form as any)[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>

        {error && <div style={{ color: '#f87171', fontSize: 13, marginTop: 16 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px', borderRadius: 8, fontSize: 14,
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8', cursor: 'pointer'
            }}
          >
            取消
          </button>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={loading}
            style={{ flex: 1, padding: '12px', fontSize: 14 }}
          >
            {loading ? '儲存中...' : '儲存變更'}
          </button>
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
