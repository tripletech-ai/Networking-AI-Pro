'use client';

import { useState, useEffect } from 'react';

export default function CopyLinkButton({ eventId }: { eventId: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(`${window.location.origin}/event/${eventId}`);
  }, [eventId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!url) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(197, 168, 128, 0.2)' }}>
      <div style={{ fontSize: 12, color: '#94a3b8', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {url}
      </div>
      <button 
        onClick={handleCopy}
        style={{ background: '#c5a880', color: '#000', border: 'none', padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
      >
        {copied ? '已複製' : '複製專屬報到連結'}
      </button>
    </div>
  );
}
