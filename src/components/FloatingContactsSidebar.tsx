'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingContactsSidebar({ show }: { show: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const loadContacts = () => {
    const saved = JSON.parse(localStorage.getItem('ai_saved_contacts') || '[]');
    setContacts(saved);
    const user = JSON.parse(localStorage.getItem('ai_current_user') || 'null');
    setCurrentUser(user);
  };

  useEffect(() => {
    loadContacts();
    const openHandler = () => setIsOpen(true);
    window.addEventListener('storage', loadContacts);
    window.addEventListener('contactSaved', loadContacts);
    window.addEventListener('openSidebar', openHandler);
    return () => {
      window.removeEventListener('storage', loadContacts);
      window.removeEventListener('contactSaved', loadContacts);
      window.removeEventListener('openSidebar', openHandler);
    };
  }, []);

  const removeContact = (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    localStorage.setItem('ai_saved_contacts', JSON.stringify(updated));
    setContacts(updated);
  };

  if (!show || !mounted) return null;

  // Use createPortal to render directly in document.body, bypassing any parent CSS containment
  return createPortal(
    <>
      {/* Floating button - viewport-fixed bottom-right */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 99999 }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, rgba(197, 168, 128, 0.5), rgba(197, 168, 128, 0.15))',
            border: '2px solid rgba(197, 168, 128, 0.6)',
            boxShadow: '0 8px 32px rgba(197, 168, 128, 0.3)',
            borderRadius: 40, padding: '14px 28px', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 700,
            backdropFilter: 'blur(16px)', transition: 'all 0.3s',
          }}
        >
          我的名片夾 ({contacts.length})
        </button>
      </div>

      {/* Sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setIsOpen(false); setActiveChat(null); }}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100000,
              }}
            />
            {/* Sidebar panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: '100%', maxWidth: 400,
                background: '#0a0a0c', borderLeft: '1px solid rgba(197,168,128,0.2)',
                zIndex: 100001, display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexShrink: 0,
              }}>
                <h2 style={{ fontSize: 18, color: '#f8fafc', fontWeight: 600, margin: 0 }}>我的名片夾</h2>
                <button onClick={() => { setIsOpen(false); setActiveChat(null); }}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 24, cursor: 'pointer', lineHeight: 1 }}>
                  &times;
                </button>
              </div>

              {/* Scrollable contacts list */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                {contacts.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#64748b', marginTop: 60, fontSize: 14 }}>
                    目前還沒有儲存任何名片。
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {contacts.map(c => (
                      <div key={c.id} style={{
                        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 14, padding: 16, position: 'relative'
                      }}>
                        <button onClick={() => removeContact(c.id)} style={{
                          position: 'absolute', top: 12, right: 12, background: 'none', border: 'none',
                          color: '#f87171', cursor: 'pointer', fontSize: 12
                        }}>
                          移除
                        </button>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#c5a880', marginBottom: 2 }}>{c.name}</div>
                        <div style={{ fontSize: 13, color: '#f8fafc', marginBottom: 8 }}>{c.company} · {c.title}</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                          <span style={{ fontSize: 11, color: '#94a3b8', background: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: 20 }}>{c.industry}</span>
                        </div>
                        <button
                          onClick={() => setActiveChat(c)}
                          style={{
                            width: '100%', padding: '10px', borderRadius: 10,
                            background: 'rgba(197, 168, 128, 0.15)', border: '1px solid rgba(197, 168, 128, 0.3)',
                            color: '#c5a880', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                            transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                          }}
                        >
                          發送訊息
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat overlay */}
              <AnimatePresence>
                {activeChat && (
                  <ChatWindow
                    target={activeChat}
                    currentUser={currentUser}
                    onClose={() => setActiveChat(null)}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}

function ChatWindow({ target, currentUser, onClose }: { target: any; currentUser: any; onClose: () => void }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) return;
    const sync = async () => {
      try {
        const res = await fetch(`/api/chat?connectorId=${currentUser.id}&connectedToId=${target.id}`);
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (e) { console.error(e); }
    };
    sync();
    const interval = setInterval(sync, 3000);
    return () => clearInterval(interval);
  }, [currentUser, target.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !currentUser || loading) return;
    const msgContent = input.trim();
    const optimisticMsg = { senderId: currentUser.id, content: msgContent, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, optimisticMsg]);
    setInput('');
    setLoading(true);
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connectorId: currentUser.id,
          connectedToId: target.id,
          senderId: currentUser.id,
          content: msgContent
        })
      });
    } catch (e) {
      console.error(e);
      setMessages(prev => prev.filter(m => m !== optimisticMsg));
      setInput(msgContent);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ position: 'absolute', inset: 0, background: '#0a0a0c', zIndex: 100002,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ color: '#ef4444', marginBottom: 16, fontSize: 14 }}>請先完成報到以啟用聊天功能。</div>
        <button onClick={onClose} style={{
          background: '#c5a880', border: 'none', borderRadius: 10, padding: '10px 24px',
          color: '#000', fontWeight: 600, cursor: 'pointer'
        }}>返回</button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      style={{
        position: 'absolute', inset: 0, background: '#0a0a0c', zIndex: 100002,
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Fixed header */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
      }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: '#94a3b8', fontSize: 22, cursor: 'pointer', lineHeight: 1
        }}>&lsaquo;</button>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>{target.name}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{target.company}</div>
        </div>
      </div>

      {/* Scrollable messages */}
      <div ref={scrollRef} style={{
        flex: 1, overflowY: 'auto', padding: '16px 20px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#475569', marginTop: 40, fontSize: 13 }}>
            開始和 {target.name} 對話吧
          </div>
        )}
        {messages.map((m, i) => {
          const isMine = m.senderId === currentUser.id;
          return (
            <div key={i} style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <div style={{
                padding: '10px 14px',
                borderRadius: isMine ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                background: isMine ? 'rgba(197,168,128,0.2)' : 'rgba(255,255,255,0.05)',
                border: isMine ? '1px solid rgba(197,168,128,0.3)' : '1px solid rgba(255,255,255,0.08)',
                color: isMine ? '#c5a880' : '#f8fafc', fontSize: 14, lineHeight: 1.5,
              }}>
                {m.content}
              </div>
              {m.createdAt && (
                <div style={{ fontSize: 10, color: '#475569', marginTop: 3, textAlign: isMine ? 'right' : 'left' }}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fixed input bar */}
      <div style={{
        padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', gap: 8, flexShrink: 0, background: '#0a0a0c',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="輸入訊息..."
          style={{
            flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20, padding: '10px 16px', color: '#fff', fontSize: 14, outline: 'none',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            background: input.trim() ? '#c5a880' : 'rgba(197,168,128,0.3)',
            border: 'none', borderRadius: 20, padding: '10px 18px',
            color: '#000', fontWeight: 600, cursor: input.trim() ? 'pointer' : 'default',
            fontSize: 14, transition: 'all 0.2s',
          }}
        >
          傳送
        </button>
      </div>
    </motion.div>
  );
}
