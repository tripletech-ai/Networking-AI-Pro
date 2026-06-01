'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import GuestForm from '@/components/GuestForm';
import MatchResult from '@/components/MatchResult';
import NetworkGrid from '@/components/NetworkGrid';
import FloatingContactsSidebar from '@/components/FloatingContactsSidebar';
import AnimatedDots from '@/components/AnimatedDots';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';

import type { GuestData, MatchData, GridPerson } from '@/types';

export default function EventClient({ eventName }: { eventName: string }) {
  const params = useParams();
  const eventId = params.id as string;

  const [appState, setAppState] = useState<'checkin' | 'loading' | 'results'>('checkin');
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [grid, setGrid] = useState<GridPerson[]>([]);
  const [gridSummary, setGridSummary] = useState('');
  const [activeView, setActiveView] = useState<'match' | 'grid'>('match');
  const [error, setError] = useState('');
  const [matchError, setMatchError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [actionsDone, setActionsDone] = useState<Set<string>>(new Set());

  const resultsRef = useRef<HTMLDivElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);

  // Check-in code state
  const [checkinCode, setCheckinCode] = useState('');
  const [checkinError, setCheckinError] = useState('');
  const [checkinLoading, setCheckinLoading] = useState(false);

  const [showMyQR, setShowMyQR] = useState(false);

  // Pre-warm Netlify serverless function on page load to eliminate cold start delay
  useEffect(() => {
    fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ping: true }),
    }).catch(() => {});
  }, []);

  // G8: restore results from localStorage on mount
  useEffect(() => {
    try {
      const savedEventId = localStorage.getItem('ai_event_id');
      const savedUser = localStorage.getItem('ai_current_user');
      const savedMatches = localStorage.getItem('ai_match_results');
      const savedGrid = localStorage.getItem('ai_grid_results');
      const savedSummary = localStorage.getItem('ai_grid_summary');
      if (savedEventId === eventId && savedUser && savedMatches) {
        setGuestData(JSON.parse(savedUser));
        setMatches(JSON.parse(savedMatches));
        setGrid(JSON.parse(savedGrid || '[]'));
        setGridSummary(savedSummary || '');
        setAppState('results');
      }
    } catch {}
  }, [eventId]);

  const { data: allMembers = [] } = useSWR(
    appState === 'results' && eventId ? `/api/members/all?eventId=${eventId}` : null,
    (url: string) => fetch(url).then(res => res.json())
  );

  const handleCodeSubmit = async () => {
    if (checkinCode.length !== 4 || checkinLoading) return;
    setCheckinLoading(true);
    setCheckinError('');
    try {
      const res = await fetch(`/api/event/${eventId}/checkin?code=${checkinCode.toUpperCase()}`);
      if (!res.ok) {
        const data = await res.json();
        setCheckinError(data.error || '通關碼錯誤，請洽工作人員');
        return;
      }
      const member = await res.json();
      await runAIMatch({ ...member, isWalkIn: false });
    } catch {
      setCheckinError('連線失敗，請重試');
    } finally {
      setCheckinLoading(false);
    }
  };

  const runAIMatch = async (data: GuestData) => {
    setActionsDone(new Set()); // 每次新的媒合都重置行動清單
    setGuestData(data);
    setAppState('loading');
    setError('');
    setMatchError(null); // 清除上次錯誤
    setProgress(0);

    // 用指数趋近让进度条平滑接近 92%，不跳跃
    let _p = 0;
    const progressInterval = setInterval(() => {
      _p = _p + (92 - _p) * 0.025;
      setProgress(Math.floor(_p));
    }, 150);

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, mode: 'both', eventId }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      const result = await res.json();
      if (result.error) throw new Error(result.error);

      const fullGuest: GuestData = { ...data, id: result.memberId || (data as GuestData & { id?: string }).id };
      setGuestData(fullGuest);
      setMatches(result.matches || []);
      setGrid(result.grid || []);
      setGridSummary(result.strategicSummary || '');

      // G8: persist to localStorage
      localStorage.setItem('ai_event_id', eventId);
      localStorage.setItem('ai_current_user', JSON.stringify(fullGuest));
      localStorage.setItem('ai_match_results', JSON.stringify(result.matches || []));
      localStorage.setItem('ai_grid_results', JSON.stringify(result.grid || []));
      localStorage.setItem('ai_grid_summary', result.strategicSummary || '');

      setAppState('results');
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 600);
    } catch (err: unknown) {
      clearInterval(progressInterval);
      const msg = err instanceof Error ? err.message : '未知錯誤';
      // 特定錯誤顯示友善訊息
      if (msg.includes('429') || msg.includes('頻繁')) {
        setMatchError('請求過於頻繁，請等待 2 分鐘後重試');
      } else if (msg.includes('401') || msg.includes('報到')) {
        setMatchError('報到驗證已失效，請重新輸入通關碼');
        setAppState('checkin'); // 這個情況才需要跳回
      } else if (msg.includes('404') || msg.includes('活動')) {
        setMatchError('活動已結束或不存在');
      } else {
        setMatchError('AI 媒合暫時失敗，請點下方按鈕重試');
      }
      setProgress(0);
      // 不要 setAppState('checkin') — 留在 loading 頁面顯示錯誤
    }
  };

  const handleWalkInSubmit = async (data: GuestData) => {
    await runAIMatch({ ...data, isWalkIn: true });
  };

  const clearSession = () => {
    ['ai_event_id', 'ai_current_user', 'ai_match_results', 'ai_grid_results', 'ai_grid_summary']
      .forEach(k => localStorage.removeItem(k));
    setGuestData(null);
    setMatches([]);
    setGrid([]);
    setCheckinCode('');
    setCheckinError('');
    setActionsDone(new Set());
    setAppState('checkin');
  };

  // suppress unused variable warning
  void allMembers;

  return (
    <main style={{ minHeight: '100dvh', position: 'relative', zIndex: 1, background: 'var(--bg-primary)' }}>
      <header
        className="event-header"
        style={{
        padding: '24px 32px',
        borderBottom: '1px solid rgba(197, 168, 128, 0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10, 10, 12, 0.85)',
      }}>
        <button
          onClick={clearSession}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, padding: 0 }}
        >
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #c5a880, #8c7355)', borderRadius: 8, boxShadow: '0 4px 12px rgba(197, 168, 128, 0.2)' }} />
          <div className="event-header-title" style={{ fontSize: 17, fontWeight: 700, letterSpacing: '1px', color: '#f8fafc', fontFamily: "'Playfair Display', serif" }}>
            AI Networking <span style={{ color: '#c5a880' }}>Pro</span>
          </div>
        </button>

        {appState === 'results' && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button
              onClick={() => guestData && runAIMatch({ ...guestData })}
              style={{ background: 'transparent', border: '1px solid rgba(197, 168, 128, 0.3)', borderRadius: 8, color: '#c5a880', padding: '8px 14px', fontSize: 13, cursor: 'pointer' }}
            >
              🔄 重新媒合
            </button>
            <button onClick={clearSession} style={{ background: 'transparent', border: '1px solid rgba(197, 168, 128, 0.3)', borderRadius: 8, color: '#c5a880', padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>
              重新報到
            </button>
          </div>
        )}
      </header>

      <div className="event-main-content" style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>
        <AnimatePresence mode="wait">

          {appState === 'checkin' && (
            <motion.div key="checkin" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>
                  歡迎來到 {eventName}
                </h1>
                <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto', lineHeight: 1.6 }}>
                  請輸入工作人員給您的 4 位通關碼完成報到。<br />
                  現場空降？直接用 AI 快速建檔↓
                </p>
              </div>

              {/* Code input */}
              <div className="glass-card checkin-card" style={{ padding: 36, marginBottom: 40, background: '#fff', border: '1px solid #e2e8f0' }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 20 }}>
                  已報名嘉賓 — 輸入通關碼報到
                </h2>
                <div className="checkin-input-row" style={{ display: 'flex', gap: 12 }}>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="例：A8K3"
                    value={checkinCode}
                    onChange={e => { setCheckinCode(e.target.value.toUpperCase()); setCheckinError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleCodeSubmit()}
                    style={{
                      flex: 1, padding: '16px 20px', fontSize: 28, letterSpacing: '8px', fontWeight: 700,
                      textAlign: 'center', border: '2px solid #e2e8f0', borderRadius: 12,
                      fontFamily: 'monospace', textTransform: 'uppercase',
                      outline: checkinError ? '2px solid #ef4444' : undefined,
                    }}
                  />
                  <button
                    onClick={handleCodeSubmit}
                    disabled={checkinCode.length !== 4 || checkinLoading}
                    className="btn-primary"
                    style={{ padding: '16px 28px', fontSize: 16, borderRadius: 12, opacity: checkinCode.length !== 4 ? 0.5 : 1 }}
                  >
                    {checkinLoading ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>驗證中<AnimatedDots /></span> : '報到 →'}
                  </button>
                </div>
                {checkinError && <div style={{ color: '#ef4444', fontSize: 14, marginTop: 10 }}>{checkinError}</div>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 24, margin: '40px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ color: '#64748b', fontSize: 14, fontWeight: 500, letterSpacing: '2px' }}>OR</div>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
              </div>

              <div className="glass-card" style={{ padding: 32 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 8 }}>現場空降登記</h2>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
                  沒有通關碼？用一句話讓 AI 幫你建立商務檔案。
                </p>
                <GuestForm onSubmit={handleWalkInSubmit} error={error} />
              </div>
            </motion.div>
          )}

          {appState === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="loading-screen"
              style={{ textAlign: 'center', padding: '100px 20px' }}>
              <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 40px' }}>
                <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(197, 168, 128, 0.1)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', inset: 0, border: '2px solid transparent', borderTopColor: '#c5a880', borderRadius: '50%', animation: 'spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite' }} />
              </div>
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              <div style={{ fontSize: 20, color: '#c5a880', marginBottom: 8, fontWeight: 600, letterSpacing: '1px' }}>
                AI 正在分析全場商務資源矩陣
              </div>
              <div style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>
                預計 10–15 秒，請稍候
              </div>
              <div style={{ width: 280, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden', margin: '0 auto' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #c5a880, #8c7355)', width: `${progress}%`, transition: 'width 1s ease', borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 12 }}>{progress}%</div>
              <button
                onClick={() => { setMatchError(null); setProgress(0); setAppState('checkin'); }}
                style={{ marginTop: 24, background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}
              >
                取消
              </button>
              {matchError && (
                <div style={{ marginTop: 24, padding: '20px 24px', background: '#fff', borderRadius: 12, border: '1px solid #fee2e2', maxWidth: 360, margin: '24px auto 0' }}>
                  <div style={{ color: '#ef4444', fontSize: 14, marginBottom: 16, fontWeight: 600 }}>⚠️ {matchError}</div>
                  <button
                    onClick={() => { setMatchError(null); guestData && runAIMatch(guestData); }}
                    style={{ width: '100%', padding: '12px', background: 'var(--accent-gold)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
                  >
                    重新嘗試
                  </button>
                  {matchError.includes('報到驗證') && (
                    <button
                      onClick={() => { setMatchError(null); clearSession(); }}
                      style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer', marginTop: 8 }}
                    >
                      重新輸入通關碼
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {appState === 'results' && guestData && (
            <motion.div key="results" ref={resultsRef} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              {/* Welcome card */}
              <div className="glass-card welcome-card" style={{ padding: '28px 32px', marginBottom: 32, background: 'linear-gradient(135deg, rgba(197,168,128,0.05), transparent)', borderLeft: '4px solid #c5a880', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, color: '#c5a880', marginBottom: 8, fontWeight: 600, letterSpacing: '1px' }}>分析完成</div>
                  <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>
                    <span style={{ color: 'var(--accent-blue)' }}>{guestData.name}</span>{' '}
                    <span style={{ fontSize: 16, color: 'var(--text-secondary)' }}>{guestData.title}</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 8 }}>{guestData.company}</div>
                </div>
                <button onClick={() => setShowMyQR(true)} style={{ background: 'rgba(197,168,128,0.1)', border: '1px solid rgba(197,168,128,0.3)', borderRadius: 12, padding: '12px 20px', color: '#c5a880', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h6v6H3z"/><path d="M15 3h6v6h-6z"/><path d="M3 15h6v6H3z"/><path d="M15 15h6v6h-6z"/></svg>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>出示名片</div>
                </button>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 32, background: '#fff', padding: '6px', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                {[{ id: 'match', label: '黃金夥伴', sub: '深度痛點媒合' }, { id: 'grid', label: '戰略九宮格', sub: '全場跨界佈局' }].map(tab => (
                  <button key={tab.id} className="tab-btn" onClick={() => {
                    setActiveView(tab.id as 'match' | 'grid');
                    setTimeout(() => tabContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                  }} style={{ flex: 1, padding: '16px 20px', textAlign: 'center', background: activeView === tab.id ? 'var(--accent-gold)' : 'transparent', border: 'none', borderRadius: 12, color: activeView === tab.id ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.3s' }}>
                    <div className="tab-btn-label" style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{tab.label}</div>
                    <div className="tab-btn-sub" style={{ fontSize: 12, opacity: 0.8 }}>{tab.sub}</div>
                  </button>
                ))}
              </div>

              <div ref={tabContentRef}>
              {activeView === 'grid' && (
                grid.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 24px', color: '#94a3b8' }}>
                    等待更多嘉賓報到後，戰略九宮格將自動生成
                  </div>
                ) : (
                  <NetworkGrid grid={grid} user={guestData} summary={gridSummary} />
                )
              )}
              {activeView === 'match' && (
                <>
                  {matches.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 24px', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 40, marginBottom: 16 }}>🌱</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 12 }}>
                        您是活動的先鋒嘉賓！
                      </div>
                      <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8, maxWidth: 320, margin: '0 auto 24px' }}>
                        您的商務資料已儲存完成。<br />
                        現場無須預先報名 — 每位來賓現場登記即可。<br />
                        等更多嘉賓報到後，按下方按鈕重新媒合，<br />
                        結果會越來越精準。
                      </div>
                      <button
                        onClick={() => runAIMatch(guestData!)}
                        style={{ background: 'var(--accent-gold)', border: 'none', color: '#fff', padding: '12px 28px', borderRadius: 100, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
                      >
                        🔄 重新執行 AI 媒合
                      </button>
                    </div>
                  ) : (
                    <MatchResult matches={matches} />
                  )}
                </>
              )}
              </div>

              {/* G6: Action checklist */}
              {matches.length > 0 && (
                <div className="glass-card action-checklist" style={{ marginTop: 32, padding: 28, background: '#fff', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 13, color: '#c5a880', fontWeight: 700, letterSpacing: '1px', marginBottom: 16 }}>今日行動清單</div>
                  <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>完成媒合後，記得去找這幾位！打個招呼，掃他們的名片 QR Code。</p>
                  {matches.map((m: MatchData) => (
                    <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: '1px solid #f8fafc' }}>
                      <button
                        onClick={() => setActionsDone(prev => { const s = new Set(prev); s.has(m.name) ? s.delete(m.name) : s.add(m.name); return s; })}
                        style={{ width: 28, height: 28, borderRadius: 8, border: actionsDone.has(m.name) ? 'none' : '2px solid #c5a880', background: actionsDone.has(m.name) ? '#22c55e' : 'transparent', cursor: 'pointer', fontSize: 16, color: '#fff', flexShrink: 0, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {actionsDone.has(m.name) ? '✓' : ''}
                      </button>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: 'var(--accent-blue)', fontSize: 15 }}>{m.name}</div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>{m.company} · {m.title}</div>
                      </div>
                      {actionsDone.has(m.name) && <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>已認識 ✓</span>}
                    </div>
                  ))}
                  <div style={{ marginTop: 16, fontSize: 13, color: '#94a3b8', textAlign: 'center' }}>
                    {actionsDone.size}/{matches.length} 位已認識
                    {actionsDone.size === matches.length && matches.length > 0 && <span style={{ color: '#22c55e', fontWeight: 700 }}> — 今日任務完成！</span>}
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

        {/* QR Modal */}
        {showMyQR && guestData && (
          <div onClick={() => setShowMyQR(false)} style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh' }}>
            <div className="glass-card" style={{ width: 340, padding: 32, textAlign: 'center', background: '#fff' }} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-blue)', marginBottom: 4 }}>{guestData.name}</div>
              <div style={{ fontSize: 14, color: 'var(--accent-gold-dark)', marginBottom: 24, fontWeight: 600 }}>{guestData.company}</div>
              <div style={{ background: '#fff', padding: 24, borderRadius: 16, display: 'inline-block', marginBottom: 24, border: '1px solid #f1f5f9' }}>
                <QRCode value={`${window.location.origin}/scan/${guestData.id}`} size={180} fgColor="#0a0a0c" />
              </div>
              <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>讓對方掃描此 QR Code<br />以儲存您的數位名片</div>
              <button onClick={() => setShowMyQR(false)} style={{ marginTop: 24, background: 'transparent', border: 'none', color: '#64748b', fontSize: 15, cursor: 'pointer' }}>關閉</button>
            </div>
          </div>
        )}
      </div>

      <FloatingContactsSidebar show={appState === 'results'} />
    </main>
  );
}
