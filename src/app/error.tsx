'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Caught:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
      padding: '24px',
      textAlign: 'center'
    }}>
      <div className="glass-card" style={{ padding: '40px', maxWidth: '400px', width: '100%', background: '#fff' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h2 className="font-serif" style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-blue)', marginBottom: '16px' }}>
          系統發生錯誤
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' }}>
          抱歉，系統在處理您的請求時遇到了未預期的錯誤。我們已經記錄此問題。
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => reset()}
            className="btn-gold"
            style={{ padding: '12px', width: '100%', borderRadius: '8px', fontWeight: 'bold' }}
          >
            重新嘗試
          </button>
          <Link href="/" className="btn-outline" style={{ padding: '12px', width: '100%', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
            回首頁
          </Link>
        </div>
      </div>
    </div>
  );
}
