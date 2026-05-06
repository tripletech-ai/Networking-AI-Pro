'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  href: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function NavBackButton({ href, label = '返回', className = 'btn-outline', style }: Props) {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  const handleClick = () => {
    if (navigating) return;
    setNavigating(true);
    router.push(href);
  };

  return (
    <button
      onClick={handleClick}
      disabled={navigating}
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        cursor: navigating ? 'wait' : 'pointer',
        opacity: navigating ? 0.8 : 1,
        transition: 'all 0.2s',
        ...style
      }}
    >
      {navigating ? (
        <>
          <span style={{
            display: 'inline-block', width: 14, height: 14,
            border: '2px solid rgba(0,0,0,0.15)',
            borderTopColor: 'currentColor',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
            flexShrink: 0
          }} />
          <style>{`@keyframes spin{100%{transform:rotate(360deg)}}`}</style>
          跳轉中...
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
