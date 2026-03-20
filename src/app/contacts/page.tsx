'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SavedContact } from '@/components/SaveContactButton';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<SavedContact[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('ai_saved_contacts');
    if (data) setContacts(JSON.parse(data));
  }, []);

  const removeContact = (id: string) => {
    if (!confirm('確定要移除此聯絡人嗎？')) return;
    const newContacts = contacts.filter(c => c.id !== id);
    setContacts(newContacts);
    localStorage.setItem('ai_saved_contacts', JSON.stringify(newContacts));
  };

  return (
    <main style={{ minHeight: '100vh', padding: '60px 24px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f8fafc', fontFamily: "'Playfair Display', serif" }}>
            我的專屬名片夾
          </h1>
          <Link href="/" style={{ color: '#64748b', fontSize: 14, textDecoration: 'none' }}>
            返回首頁
          </Link>
        </header>

        {contacts.length === 0 ? (
          <div className="glass-card" style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 16px', opacity: 0.5 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <div style={{ fontSize: 16 }}>您尚未儲存任何聯絡人。</div>
            <p style={{ marginTop: 8, fontSize: 14 }}>在活動現場報到後，可點擊「記住此聯絡人」來收藏重要人脈。</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {contacts.map(c => (
              <div key={c.id} className="glass-card fade-in-up" style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: '#f8fafc', marginBottom: 4 }}>{c.name}</div>
                    <div style={{ fontSize: 13, color: '#c5a880' }}>{c.industry}</div>
                  </div>
                  <button onClick={() => removeContact(c.id)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
                <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 24, flex: 1 }}>
                  {c.company} <br/> {c.title}
                </div>
                <div style={{ fontSize: 11, color: '#475569', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
                  儲存於：{new Date(c.savedAt).toLocaleDateString('zh-TW')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
