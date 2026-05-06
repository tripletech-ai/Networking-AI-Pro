'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingContactsSidebar({ show }: { show: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const loadContacts = async () => {
    const user = JSON.parse(localStorage.getItem('ai_current_user') || 'null');
    setCurrentUser(user);
    if (!user || !user.id) {
      setContacts([]);
      return;
    }

    try {
      const res = await fetch(`/api/contacts?memberId=${user.id}`);
      const data = await res.json();
      if (data.contacts) {
        setContacts(data.contacts);
      }
    } catch (err) {
      console.error('Failed to load contacts');
    }
  };

  useEffect(() => {
    if (show) {
      loadContacts();
    }
  }, [show]);

  useEffect(() => {
    loadContacts(); // initial load
    const openHandler = () => setIsOpen(true);
    window.addEventListener('contactSaved', loadContacts);
    window.addEventListener('openSidebar', openHandler);
    return () => {
      window.removeEventListener('contactSaved', loadContacts);
      window.removeEventListener('openSidebar', openHandler);
    };
  }, []);

  const removeContact = async (id: string) => {
    if (!currentUser || !currentUser.id) return;
    try {
      await fetch(`/api/contacts?connectorId=${currentUser.id}&connectedToId=${id}`, {
        method: 'DELETE'
      });
      setContacts(contacts.filter(c => c.id !== id));
      window.dispatchEvent(new Event('contactSaved'));
    } catch (err) {
      console.error('Failed to remove contact');
    }
  };

  if (!show || !mounted) return null;

  // Use createPortal to render directly in document.body, bypassing any parent CSS containment
  return createPortal(
    <>
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 99999 }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dark))',
            border: 'none',
            boxShadow: '0 8px 32px rgba(197, 168, 128, 0.4)',
            borderRadius: 40, padding: '14px 28px', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 700,
            backdropFilter: 'blur(16px)', transition: 'all 0.3s',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          我的名片夾 ({contacts.length})
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(4px)', zIndex: 100000,
              }}
            />
            <motion.div
              initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: '100%', maxWidth: 400,
                background: '#ffffff', borderLeft: '1px solid #e2e8f0',
                zIndex: 100001, display: 'flex', flexDirection: 'column',
                overflow: 'hidden', boxShadow: '-10px 0 30px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{
                padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexShrink: 0, background: '#fff'
              }}>
                <h2 className="font-serif" style={{ fontSize: 20, color: 'var(--accent-blue)', fontWeight: 700, margin: 0 }}>我的商務名片夾</h2>
                <button onClick={() => setIsOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 28, cursor: 'pointer', lineHeight: 1 }}>
                  &times;
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: '#f8fafc' }}>
                {contacts.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#64748b', marginTop: 80, fontSize: 14 }}>
                    <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>📇</div>
                    目前還沒有儲存任何名片。
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {contacts.map(c => (
                      <div key={c.id} className="glass-card" style={{
                        background: '#ffffff', borderRadius: 14, padding: 20, position: 'relative',
                        border: '1px solid #e2e8f0'
                      }}>
                        <button onClick={() => removeContact(c.id)} style={{
                          position: 'absolute', top: 16, right: 16, background: 'none', border: 'none',
                          color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 500
                        }}>
                          移除
                        </button>
                        <div className="font-serif" style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 4 }}>{c.name}</div>
                        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12, fontWeight: 500 }}>{c.company} · {c.title}</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                          <span style={{ fontSize: 11, color: 'var(--accent-gold-dark)', background: 'rgba(197,168,128,0.1)', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>{c.industry}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
