'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import GuestForm from '@/components/GuestForm';
import MatchResult from '@/components/MatchResult';
import NetworkGrid from '@/components/NetworkGrid';
import FloatingContactsSidebar from '@/components/FloatingContactsSidebar';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';

import type { AppState, GuestData, MatchData, GridPerson } from '@/types';
export default function EventClient({ eventName }: { eventName: string }) {
  const params = useParams();
  const eventId = params.id as string;

  const [appState, setAppState] = useState<any>('intro');
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [grid, setGrid] = useState<GridPerson[]>([]);
  const [gridSummary, setGridSummary] = useState('');
  const [activeView, setActiveView] = useState<'match' | 'grid'>('match');
  const [error, setError] = useState('');
  
  const resultsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Custom UX States
  const [loadingStep, setLoadingStep] = useState(0);
  const [showMyQR, setShowMyQR] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (appState === 'loading') {
      interval = setInterval(() => {
        setLoadingStep(s => (s < 3 ? s + 1 : s));
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [appState]);

  useEffect(() => {
    setDebouncedQuery(searchQuery);
  }, [searchQuery]);

  // Fetch all members ONCE and do local search for blazing fast UX
  const { data: allMembers = [], isLoading: isFetchingMembers } = useSWR(
    eventId ? `/api/members/all?eventId=${eventId}` : null,
    (url: string) => fetch(url).then(res => res.json())
  );

  const searchResults = debouncedQuery.length > 0 
    ? allMembers.filter((m: any) => m.name?.toLowerCase().includes(debouncedQuery.toLowerCase())).slice(0, 10)
    : [];
  
  const isSearching = false; // local search is instant

  const loadingMessages = [
    '正在存取全場商務數據庫...',
    '運算您的商務痛點與需求矩陣...',
    '計算高維度餘弦相似度 (Cosine Similarity)...',
    '生成專屬您的破局戰略與破冰金句...'
  ];

  const handleSubmit = async (data: GuestData) => {
    setGuestData(data);
    setAppState('loading');
    setError('');

    try {
      const [matchRes, gridRes] = await Promise.all([
        fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, mode: 'match', eventId }),
        }),
        fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, mode: 'grid', eventId }),
        }),
      ]);

      const matchData = await matchRes.json();
      const gridData = await gridRes.json();

      if (matchData.error || gridData.error) {
        throw new Error(matchData.error || gridData.error);
      }

      setMatches(matchData.matches || []);
      setGrid(gridData.grid || []);
      setGridSummary(gridData.strategicSummary || '');
      const fullGuest = { ...data, id: matchData.memberId || data.id };
      setGuestData(fullGuest);
      localStorage.setItem('ai_current_user', JSON.stringify(fullGuest));
      setAppState('results');
      
      // Auto-scroll to results after a short delay for animation
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 600);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      setError(errorMessage);
      setAppState('checkin');
    }
  };

  return (
    <main style={{ minHeight: '100dvh', position: 'relative', zIndex: 1, background: 'var(--bg-primary)' }}>

      {/* 頂部導覽列 */}
      <header style={{
        padding: '24px 32px',
        borderBottom: '1px solid rgba(197, 168, 128, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10, 10, 12, 0.85)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #c5a880, #8c7355)',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(197, 168, 128, 0.2)'
          }} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '1px', color: '#f8fafc', fontFamily: "'Playfair Display', serif" }}>
              AI Networking <span style={{ color: '#c5a880' }}>Pro</span>
            </div>
          </div>
        </div>
        
        {appState === 'results' && (
          <button
            onClick={() => {
              setAppState('checkin');
              setSearchQuery('');
              setGuestData(null);
            }}
            style={{
              background: 'transparent',
              border: '1px solid rgba(197, 168, 128, 0.3)',
              borderRadius: 8,
              color: '#c5a880',
              padding: '8px 16px',
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(197, 168, 128, 0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            重新報到
          </button>
        )}
      </header>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>

        <AnimatePresence mode="wait">
        
        {appState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            style={{ textAlign: 'center', padding: '100px 20px' }}
          >
            <div style={{ color: '#c5a880', fontSize: 13, letterSpacing: '4px', fontWeight: 600, marginBottom: 16 }}>
              EXCLUSIVE BUSINESS EVENT
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 24, fontFamily: "'Playfair Display', serif" }}>
              歡迎來到 {eventName}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 18, lineHeight: 1.8, maxWidth: 600, margin: '0 auto 48px', fontWeight: 500 }}>
              AI Networking Pro 將為您分析全場來賓的商業資源矩陣，助您精準鎖定高價值合作夥伴。準備好遇見您的下一個跳板了嗎？
            </p>
            <button
              onClick={() => setAppState('checkin')}
              className="btn-primary"
              style={{ padding: '18px 48px', fontSize: 18, borderRadius: 100 }}
            >
              開始 AI 報到
            </button>
          </motion.div>
        )}

        {appState === 'checkin' && (
          <motion.div
            key="checkin"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
          >
            
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>
                AI 智慧報到與配對
              </h1>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
                請直接搜尋您的姓名完成一鍵報到。若您為現場臨時參加之貴賓，請於下方表格快速建檔，AI 將為您即時計算商務配對。
              </p>
            </div>

            {/* 一鍵搜尋與報到區塊 */}
            <div ref={searchRef} className="glass-card" style={{ padding: 32, marginBottom: 40 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#c5a880', marginBottom: 16 }}>
                已報名嘉賓快速報到
              </h2>
              <input
                type="text"
                className="input-field"
                placeholder="輸入您的姓名關鍵字尋找檔案..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: 16, padding: '16px 20px' }}
              />

              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {isSearching && <div style={{ color: '#64748b', fontSize: 14 }}>尋找中...</div>}
                {!isSearching && searchQuery.length > 0 && searchResults.length === 0 && (
                  <div style={{ color: '#f87171', fontSize: 14 }}>找不到相符的報名紀錄，請向下捲動使用「現場空降登記」。</div>
                )}
                {searchResults.map((member: any) => (
                  <button
                    key={member.id}
                    onClick={() => handleSubmit({ ...member, isWalkIn: false })}
                    style={{ 
                      padding: '16px 24px', textAlign: 'left', cursor: 'pointer', display: 'flex', 
                      justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s',
                      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 2px 8px rgba(15,23,42,0.04)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 4 }}>{member.name}</div>
                      <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>{member.company} · {member.title}</div>
                    </div>
                    <div style={{ color: '#c5a880', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      點擊載入檔案 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 分隔線 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, margin: '48px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ color: '#64748b', fontSize: 14, fontWeight: 500, letterSpacing: '2px' }}>OR</div>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            </div>

            {/* 現場候補登記 */}
            <div className="glass-card" style={{ padding: 32 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 8 }}>
                現場空降登記 (首次建檔)
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, fontWeight: 500 }}>
                詳細填寫您的商業痛點與資源，送出後 AI 將為您運算並發布至全場名單中。
              </p>
              <GuestForm onSubmit={(data) => handleSubmit({ ...data, isWalkIn: true })} error={error} />
            </div>

          </motion.div>
        )}

        {appState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: '120px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 40 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '2px solid rgba(197, 168, 128, 0.1)', borderRadius: '50%' }}/>
              <div style={{ 
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '2px solid transparent', 
                borderTopColor: '#c5a880', borderRadius: '50%',
                animation: 'spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite'
              }}/>
              <div style={{ 
                position: 'absolute', top: 10, left: 10, right: 10, bottom: 10, border: '2px solid transparent', 
                borderBottomColor: '#8c7355', borderRadius: '50%',
                animation: 'spin 2s linear infinite reverse'
              }}/>
            </div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            
            <div style={{ fontSize: 18, color: '#c5a880', marginBottom: 16, fontWeight: 500, letterSpacing: '2px', fontFamily: "'Noto Serif TC', serif" }}>
              {loadingMessages[loadingStep]}
            </div>
            
            <div style={{ width: 240, height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#c5a880', width: `${(loadingStep + 1) * 25}%`, transition: 'width 1s ease' }} />
            </div>
          </motion.div>
        )}

        {appState === 'results' && guestData && (
          <motion.div
            key="results"
            ref={resultsRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* 歡迎卡片 */}
            <div className="glass-card fade-in-up" style={{
              padding: '28px 32px', marginBottom: 32, 
              background: 'linear-gradient(135deg, rgba(197, 168, 128, 0.05), transparent)',
              borderLeft: '4px solid #c5a880',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: 13, color: '#c5a880', marginBottom: 8, fontWeight: 600, letterSpacing: '1px' }}>
                  分析完成
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '0.5px', fontFamily: "'Playfair Display', serif" }}>
                  <span style={{ color: 'var(--accent-blue)' }}>{guestData.name}</span> <span style={{fontSize: 16, color: 'var(--text-secondary)'}}>{guestData.title}</span>
                </div>
                <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 8 }}>
                  {guestData.chapter && guestData.chapter !== '無' && guestData.chapter !== '未知' ? `${guestData.chapter} · ` : ''}
                  {guestData.company}
                </div>
              </div>

              {/* 我的專屬名片 QR Code 按鈕 */}
              <button
                onClick={() => setShowMyQR(true)}
                style={{
                  background: 'rgba(197, 168, 128, 0.1)', border: '1px solid rgba(197, 168, 128, 0.3)',
                  borderRadius: 12, padding: '12px 20px', color: '#c5a880', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(197, 168, 128, 0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(197, 168, 128, 0.1)'}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h6v6H3z"/><path d="M15 3h6v6h-6z"/><path d="M3 15h6v6H3z"/><path d="M15 15h6v6h-6z"/></svg>
                <div style={{ fontSize: 12, fontWeight: 500 }}>出示我的名片</div>
              </button>
            </div>

            {/* 頁籤切換 */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 32, background: '#fff', padding: '6px', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(15,23,42,0.04)' }}>
              {[
                { id: 'grid', label: '戰略九宮格', sub: '全場跨界佈局' },
                { id: 'match', label: '黃金夥伴', sub: '深度痛點媒合' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as 'match' | 'grid')}
                  style={{
                    flex: 1, padding: '16px 20px', textAlign: 'center',
                    background: activeView === tab.id ? 'var(--accent-gold)' : 'transparent',
                    border: 'none',
                    borderRadius: 12,
                    color: activeView === tab.id ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '0.5px', marginBottom: 4 }}>{tab.label}</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{tab.sub}</div>
                </button>
              ))}
            </div>

            {activeView === 'grid' && (
              <NetworkGrid grid={grid} user={guestData} summary={gridSummary} />
            )}
            {activeView === 'match' && <MatchResult matches={matches} />}
          </motion.div>
        )}
        
        </AnimatePresence>

        {/* 我的專屬名片 QR Code Modal */}
        {showMyQR && guestData && (
          <div
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000,
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'fadeInUp 0.3s ease',
              height: '100dvh'
            }}
            onClick={() => setShowMyQR(false)}
          >
            <div 
              className="glass-card" 
              style={{ width: 340, padding: 32, textAlign: 'center', border: '1px solid #e2e8f0', background: '#fff' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-blue)', marginBottom: 4 }}>{guestData.name}</div>
              <div style={{ fontSize: 14, color: 'var(--accent-gold-dark)', marginBottom: 24, fontWeight: 600 }}>{guestData.company}</div>
              
              <div style={{ background: '#fff', padding: 24, borderRadius: 16, display: 'inline-block', marginBottom: 24, border: '1px solid #f1f5f9' }}>
                <QRCode value={`${window.location.origin}/scan/${guestData.id}`} size={180} fgColor="#0a0a0c" />
              </div>

              <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
                請讓對方掃描此條碼<br/>以儲存您的專屬數位名片
              </div>

              <button 
                onClick={() => setShowMyQR(false)}
                style={{ marginTop: 24, background: 'transparent', border: 'none', color: '#64748b', fontSize: 15, cursor: 'pointer' }}
              >
                關閉
              </button>
            </div>
          </div>
        )}

      </div>
      <FloatingContactsSidebar show={appState === 'results'} />
    </main>
  );
}
