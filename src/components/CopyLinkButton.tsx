'use client';

import { useState, useEffect } from 'react';

export default function CopyLinkButton({ eventId, isActive }: { eventId: string; isActive: boolean }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(`${window.location.origin}/event/${eventId}`);
  }, [eventId]);

  const handleCopy = () => {
    if (!isActive) {
      alert('活動目前已暫停，來賓報到連結暫時無效。請先開啟活動再複製連結。');
      return;
    }
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!url) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
        {url}
      </div>
      <button 
        onClick={handleCopy}
        className="btn-gold"
        style={{ border: 'none', padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
      >
        {copied ? '已複製' : '複製專屬報到連結'}
      </button>
    </div>
  );
}
