'use client';

import { useState } from 'react';
import { MatchData } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import SaveContactButton from '@/components/SaveContactButton';

interface Props {
  matches: MatchData[];
}

const getGradientColor = (idx: number) => {
  const colors = ['#c5a880', '#9ca3af', '#8c7355'];
  return colors[idx % colors.length];
};

export default function MatchResult({ matches }: Props) {
  if (!matches.length) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
        目前沒有符合條件的媒合對象。
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: 13, color: 'var(--accent-gold)', letterSpacing: '1px', marginBottom: 6, fontWeight: 600 }}>
          深度戰略媒合
        </div>
        <div className="font-serif" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.5px', color: 'var(--accent-blue)' }}>
          為您推薦的高價值夥伴 <span style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 400, marginLeft: 8 }}>共找到 {matches.length} 位</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {matches.map((match, idx) => {
          const color = getGradientColor(idx);
          return (
            <div
              key={idx}
              className={`glass-card fade-in-up fade-in-up-delay-${idx + 1}`}
              style={{
                padding: 0,
                borderLeft: `4px solid ${color}`,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                background: '#fff'
              }}
            >
              {/* 名片頭部 */}
              <div style={{ padding: '24px 28px', borderBottom: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '12px',
                    background: `rgba(197, 168, 128, 0.08)`,
                    border: `1px solid rgba(197, 168, 128, 0.15)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, fontWeight: 700, color
                  }}>
                    {match.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-serif" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.5px', marginBottom: 4, color: 'var(--accent-blue)' }}>{match.name}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {match.title} · {match.company}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color,
                    background: `${color}10`, padding: '4px 12px', borderRadius: '8px', border: `1px solid ${color}30`
                  }}>
                    {match.industry}
                  </span>
                  {match.chapter && match.chapter !== '無' && (
                    <span style={{
                      fontSize: 11, color: 'var(--text-muted)', border: '1px solid #f1f5f9', padding: '2px 10px', borderRadius: '8px', background: '#f8fafc'
                    }}>
                      {match.chapter}
                    </span>
                  )}
                </div>
              </div>

              {/* 媒合解析 */}
              <div style={{ padding: '24px 28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    資深媒合顧問分析
                  </div>
                  <TranslationButton text={match.matchReason} />
                </div>
                <div style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.8, fontWeight: 400 }}>
                  {match.matchReason}
                </div>
              </div>

              {/* 破冰金句 */}
              <div style={{
                background: `linear-gradient(90deg, rgba(197, 168, 128, 0.04), transparent)`,
                borderTop: '1px solid #f1f5f9',
                padding: '24px 28px',
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" style={{ marginTop: 2, opacity: 0.8 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: color, fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    實戰破冰建議
                  </div>
                  <div style={{ fontSize: 15, color: 'var(--accent-blue)', lineHeight: 1.7, fontWeight: 500 }}>
                    {match.icebreaker}
                  </div>
                </div>
              </div>

              {/* 儲存按鈕區塊 */}
              <div style={{ padding: '0 28px 24px 28px' }}>
                <SaveContactButton member={{
                  id: match.id || `match-${idx}`,
                  name: match.name,
                  company: match.company,
                  title: match.title,
                  industry: match.industry
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: 32, padding: '24px', borderRadius: '12px',
        background: 'rgba(197, 168, 128, 0.04)',
        border: '1px solid rgba(197, 168, 128, 0.1)',
        fontSize: 14, color: 'var(--text-secondary)',
        textAlign: 'center', lineHeight: 1.8, fontWeight: 500
      }}>
        請帶著專屬破冰建議，前往現場與對方交流。<br/>
        您可以點右上角「出示我的名片」讓對方掃描，或切換至「戰略九宮格」查看更多人脈圖譜。
      </div>
    </div>
  );
}

function TranslationButton({ text }: { text: string }) {
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOriginal, setShowOriginal] = useState(true);

  const handleTranslate = async () => {
    if (translated) {
      setShowOriginal(!showOriginal);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: 'English' })
      });
      const data = await res.json();
      setTranslated(data.translatedText);
      setShowOriginal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleTranslate}
        disabled={loading}
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 6,
          padding: '4px 8px',
          fontSize: 11,
          color: '#94a3b8',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}
      >
        {loading ? 'AI 翻譯中...' : (showOriginal ? '🌐 英' : '🌐 中')}
      </button>
      
      <AnimatePresence>
        {!showOriginal && translated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            style={{
              position: 'absolute', top: '100%', right: 0, width: 260, zIndex: 50,
              marginTop: 8, padding: 12, borderRadius: 12, background: '#1e1b16',
              border: '1px solid #c5a88040', color: '#e2e8f0', fontSize: 13,
              lineHeight: 1.6, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              fontStyle: 'italic'
            }}
          >
            {translated}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
