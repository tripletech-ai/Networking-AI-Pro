'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EventControls({ eventId, isActive }: { eventId: string, isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(isActive);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleEventStatus = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/event/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !active })
      });
      setActive(!active);
      router.refresh();
    } catch {
      alert('操作失敗');
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/event/${eventId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success || res.ok) {
        window.location.href = '/admin';
      } else {
        alert(data.error || '刪除失敗');
        setLoading(false);
        setShowConfirm(false);
      }
    } catch {
      alert('刪除失敗');
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {/* Toggle Switch */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: active ? '#c5a880' : '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
          前台連結：
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: active ? '#22c55e' : '#ef4444' }} />
          {active ? '開放中' : '已暫停'}
        </span>
        <button
          onClick={toggleEventStatus}
          disabled={loading}
          aria-label={active ? '關閉前台報到連結' : '開啟前台報到連結'}
          style={{
            position: 'relative',
            width: 52,
            height: 28,
            borderRadius: 14,
            border: 'none',
            cursor: loading ? 'wait' : 'pointer',
            transition: 'all 0.3s ease',
            background: active
              ? 'linear-gradient(135deg, #c5a880, #8c7355)'
              : 'rgba(100, 116, 139, 0.3)',
            boxShadow: active
              ? '0 0 12px rgba(197, 168, 128, 0.3)'
              : 'inset 0 1px 3px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{
            position: 'absolute',
            top: 3,
            left: active ? 27 : 3,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }} />
        </button>
      </div>

      {/* 刪除按鈕 */}
      {showConfirm ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '6px 12px', borderRadius: 8 }}>
          <span style={{ fontSize: 13, color: '#f87171' }}>不可復原：確定刪除？</span>
          <button onClick={deleteEvent} disabled={loading} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer' }}>確認</button>
          <button onClick={() => setShowConfirm(false)} disabled={loading} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer' }}>取消</button>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)} disabled={loading}
          style={{
            padding: '8px 16px', fontSize: 13, cursor: 'pointer',
            borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171', background: 'rgba(239, 68, 68, 0.08)',
            transition: 'all 0.2s', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#ef4444';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
            e.currentTarget.style.color = '#f87171';
          }}
        >
          徹底刪除活動
        </button>
      )}
    </div>
  );
}
