'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (document.cookie.includes('admin_session=') || document.cookie.includes('auth-token=')) {
      setIsAdmin(true);
    }
  }, []);
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflowX: 'hidden' }}>
      
      {/* 頂部導覽列 */}
      <nav style={{ padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: 0, width: '100%', zIndex: 50 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#f8fafc', letterSpacing: '0.5px' }}>
          AI Networking <span style={{ color: '#c5a880' }}>Pro</span>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link href="/guide" className="btn-outline" style={{ padding: '8px 24px', fontSize: 13, borderColor: 'transparent' }}>
            系統圖文教學
          </Link>
          <Link href={isAdmin ? "/admin" : "/admin/login"} className="btn-primary" style={{ padding: '8px 24px', fontSize: 13, background: 'rgba(255,255,255,0.05)', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)' }}>
            {isAdmin ? '返回主辦方後台' : '主辦方登入'}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', paddingTop: '180px', paddingBottom: '120px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* 光暈特效 */}
        <div style={{
          position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
          width: '80vw', height: 600, background: 'radial-gradient(ellipse at top, rgba(197, 168, 128, 0.2) 0%, transparent 60%)',
          zIndex: 0, pointerEvents: 'none'
        }} />

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 900, padding: '0 24px' }}>
          
          <motion.div variants={fadeInUp} style={{ color: '#c5a880', fontSize: 14, letterSpacing: '6px', fontWeight: 600, marginBottom: 24, textTransform: 'uppercase' }}>
            The Elite Business Algorithm
          </motion.div>
          
          <motion.h1 variants={fadeInUp} style={{ fontSize: 'clamp(48px, 8vw, 84px)', fontWeight: 700, color: '#f8fafc', lineHeight: 1.1, marginBottom: 32, fontFamily: "'Playfair Display', serif" }}>
            重新定義商務社交<br />
            <span style={{ 
              background: 'linear-gradient(to right, #f8fafc 30%, #c5a880 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' 
            }}>遇見黃金跳板夥伴</span>
          </motion.h1>

          <motion.p variants={fadeInUp} style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#94a3b8', lineHeight: 1.7, maxWidth: 700, margin: '0 auto 60px', fontWeight: 300 }}>
            利用 AI 語意分析引擎，突破表層名片的侷限。深入解析「痛點、資源與供應鏈」，為每一位賓客計算專屬的資源互補矩陣。
          </motion.p>
          
          <motion.div variants={fadeInUp} style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
            <Link href="/guide" className="btn-primary" style={{ padding: '18px 48px', fontSize: 16, borderRadius: 100 }}>
              了解 AI 運作方式
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature 卡片區塊 (How it Works) */}
      <section style={{ padding: '120px 24px', background: '#0a0a0c', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: 80 }}
          >
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, color: '#f8fafc', fontFamily: "'Playfair Display', serif" }}>
              打造高階商務生態圈
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0 }}
              className="glass-card" style={{ padding: 40, borderRadius: 24, background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(197, 168, 128, 0.2)' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(197, 168, 128, 0.1)', color: '#c5a880', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 600, color: '#f8fafc', marginBottom: 16 }}>零阻力雙軌報到</h3>
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7 }}>
                完美支援「事前匯入表單」與「現場即時空降」。一鍵搜尋名字即可報到，現場報名者也能流暢填表，告別紙本報到排隊亂象。
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card" style={{ padding: 40, borderRadius: 24, background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(197, 168, 128, 0.2)' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(197, 168, 128, 0.1)', color: '#c5a880', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 600, color: '#f8fafc', marginBottom: 16 }}>AI 語意匹配</h3>
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7 }}>
                超越傳統產業分類。系統轉化每一位賓客的商業痛點為向量座標，精準配對雙方的「資源互補點」，提供針對性的破冰金句。
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card" style={{ padding: 40, borderRadius: 24, background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(197, 168, 128, 0.2)' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(197, 168, 128, 0.1)', color: '#c5a880', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 600, color: '#f8fafc', marginBottom: 16 }}>雲端數位名片庫</h3>
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7 }}>
                所有配對名單與交流紀錄隨時帶著走。專屬的個人 QR Code 數位名片，可讓對方一鍵掃描並點擊「記住此聯絡人」保存緣分。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 底部 Footer */}
      <footer style={{ padding: '80px 24px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#f8fafc', fontFamily: "'Playfair Display', serif", marginBottom: 16 }}>
          AI Networking Pro
        </div>
        <div style={{ color: '#64748b', fontSize: 13 }}>
          © 2026 AI Networking. All Rights Reserved. Designed for elite business events.
        </div>
      </footer>

    </main>
  );
}
