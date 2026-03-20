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

  useEffect(() => {
    const contacts: SavedContact[] = JSON.parse(localStorage.getItem('ai_saved_contacts') || '[]');
    setIsSaved(contacts.some(c => c.id === member.id));
  }, [member.id]);

  const toggleSave = () => {
    const contacts: SavedContact[] = JSON.parse(localStorage.getItem('ai_saved_contacts') || '[]');
    if (isSaved) {
      window.dispatchEvent(new Event('openSidebar'));
    } else {
      contacts.push({ ...member, savedAt: new Date().toISOString() });
      localStorage.setItem('ai_saved_contacts', JSON.stringify(contacts));
      setIsSaved(true);
      window.dispatchEvent(new Event('contactSaved'));
      window.dispatchEvent(new Event('openSidebar'));
    }
  };

  return (
    <button
      onClick={toggleSave}
      style={{
        width: '100%',
        padding: '16px 24px',
        fontSize: 16,
        fontWeight: 600,
        borderRadius: 12,
        cursor: 'pointer',
        transition: 'all 0.3s',
        background: isSaved ? 'rgba(255, 255, 255, 0.05)' : '#c5a880',
        color: isSaved ? '#94a3b8' : '#000',
        border: isSaved ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
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
          記住這名聯絡人
        </>
      )}
    </button>
  );
}
