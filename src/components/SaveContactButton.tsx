'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface SavedContact {
  id: string;
  name: string;
  company: string;
  title: string;
  industry: string;
  savedAt: string;
}

interface Props {
  member: Omit<SavedContact, 'savedAt'>;
  style?: React.CSSProperties;
}

export default function SaveContactButton({ member, style }: Props) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkIsSaved = async () => {
    const user = JSON.parse(localStorage.getItem('ai_current_user') || 'null');
    if (!user || !user.id) return;
    try {
      const res = await fetch(`/api/contacts?memberId=${user.id}`);
      const data = await res.json();
      if (data.contacts) {
        setIsSaved(data.contacts.some((c: any) => c.id === member.id));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    checkIsSaved();
    // Re-check when sidebar deletes contact
    window.addEventListener('contactSaved', checkIsSaved);
    return () => window.removeEventListener('contactSaved', checkIsSaved);
  }, [member.id]);

  const toggleSave = async () => {
    if (isSaved) {
      window.dispatchEvent(new Event('openSidebar'));
      return;
    }

    const user = JSON.parse(localStorage.getItem('ai_current_user') || 'null');
    if (!user || !user.id) {
      alert('無法取得使用者資料，無法收藏');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connectorId: user.id,
          connectedToId: member.id,
          eventId: user.eventId || null // Add eventId logic if available
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsSaved(true);
        window.dispatchEvent(new Event('contactSaved'));
        window.dispatchEvent(new Event('openSidebar'));
      } else {
        alert(data.error || '儲存失敗');
      }
    } catch (err) {
      alert('連線失敗');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleSave}
      disabled={isLoading}
      style={{
        width: '100%',
        padding: '16px 24px',
        fontSize: 16,
        fontWeight: 600,
        borderRadius: 12,
        cursor: isLoading ? 'wait' : 'pointer',
        transition: 'all 0.3s',
        background: isSaved ? '#f1f5f9' : 'var(--accent-gold)',
        color: isSaved ? 'var(--text-secondary)' : '#ffffff',
        border: isSaved ? '1px solid #e2e8f0' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        opacity: isLoading ? 0.7 : 1,
        ...style
      }}
    >
      {isSaved ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          已記住此聯絡人！前往名片夾
        </>
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M19 8v6"/><path d="M16 11h6"/></svg>
          {isLoading ? '儲存中...' : '記住這名聯絡人'}
        </>
      )}
    </button>
  );
}
