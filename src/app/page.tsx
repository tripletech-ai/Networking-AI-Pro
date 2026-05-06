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
        <div className="font-serif" style={{ fontSize: 22, color: 'var(--accent-blue)', fontWeight: 700, letterSpacing: '0.5px' }}>
          AI Networking <span style={{ color: 'var(--accent-gold)' }}>Pro</span>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link href="/guide" className="btn-outline" style={{ padding: '8px 24px', fontSize: 13, borderColor: 'transparent', fontWeight: 500 }}>
            系統圖文教學
          </Link>
          <Link href={isAdmin ? "/admin" : "/admin/login"} className="btn-primary" style={{ padding: '8px 24px', fontSize: 13 }}>
            {isAdmin ? '返回主辦方後台' : '主辦方登入'}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', paddingTop: '180px', paddingBottom: '140px', minHeight: '95vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* 背景裝飾 - 更優雅的層次感 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 10% 20%, rgba(197, 168, 128, 0.04) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(15, 23, 42, 0.03) 0%, transparent 40%)',
          zIndex: 0, pointerEvents: 'none'
        }} />

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 960, padding: '0 24px' }}>
          
          <motion.div variants={fadeInUp} style={{ color: 'var(--accent-gold)', fontSize: 13, letterSpacing: '6px', fontWeight: 700, marginBottom: 28, textTransform: 'uppercase', opacity: 0.9 }}>
            THE ELITE BUSINESS ALGORITHM
          </motion.div>
          
          <motion.h1 className="font-serif" variants={fadeInUp} style={{ fontSize: 'clamp(48px, 8vw, 82px)', fontWeight: 800, color: 'var(--accent-blue)', lineHeight: 1.1, marginBottom: 36, letterSpacing: '-1px' }}>
            重新定義商務社交<br />
            <span className="gradient-text-gold">遇見黃金跳板夥伴</span>
          </motion.h1>

          <motion.p variants={fadeInUp} style={{ fontSize: 'clamp(17px, 2vw, 20px)', color: 'var(--text-secondary)', lineHeight: 1.85, maxWidth: 680, margin: '0 auto 56px', fontWeight: 400 }}>
            利用 AI 語意分析引擎，突破表層名片的侷限。深入解析「痛點、資源與供應鏈」，為每一位賓客計算專屬的資源互補矩陣。
          </motion.p>
          
          <motion.div variants={fadeInUp} style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
            <Link href="/guide" className="btn-gold" style={{ padding: '20px 56px', fontSize: 17, borderRadius: 100 }}>
              了解 AI 運作方式
            </Link>
            <Link href="/admin/login" className="btn-outline" style={{ padding: '20px 56px', fontSize: 17, borderRadius: 100 }}>
              立即開始交流
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature 卡片區塊 (How it Works) */}
      <section style={{ padding: '140px 24px', background: 'var(--bg-secondary)', position: 'relative' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: 96 }}
          >
            <h2 className="font-serif" style={{ fontSize: 'clamp(36px, 4vw, 48px)', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '-0.5px' }}>
              打造高階商務生態圈
            </h2>
            <div style={{ width: 80, height: 4, background: 'var(--accent-gold)', margin: '32px auto 0', borderRadius: '2px' }} />
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
            
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0 }}
              className="glass-card" style={{ padding: '48px 40px', background: '#fff' }}
            >
              <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'rgba(197, 168, 128, 0.08)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, border: '1px solid rgba(197, 168, 128, 0.15)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="font-serif" style={{ fontSize: 26, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 20 }}>零阻力雙軌報到</h3>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                完美支援「事前匯入表單」與「現場即時空降」。一鍵搜尋名字即可報到，現場報名者也能流暢填表，告別紙本報到排隊亂象。
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card" style={{ padding: '48px 40px', background: '#fff' }}
            >
              <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'rgba(197, 168, 128, 0.08)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, border: '1px solid rgba(197, 168, 128, 0.15)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <h3 className="font-serif" style={{ fontSize: 26, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 20 }}>AI 語意匹配</h3>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                超越傳統產業分類。系統轉化每一位賓客的商業痛點為向量座標，精準配對雙方的「資源互補點」，提供針對性的破冰金句。
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card" style={{ padding: '48px 40px', background: '#fff' }}
            >
              <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'rgba(197, 168, 128, 0.08)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, border: '1px solid rgba(197, 168, 128, 0.15)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <h3 className="font-serif" style={{ fontSize: 26, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 20 }}>雲端數位名片庫</h3>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                所有配對名單與交流紀錄隨時帶著走。專屬的個人 QR Code 數位名片，可讓對方一鍵掃描並點擊「記住此聯絡人」保存緣分。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 底部 Footer */}
      <footer style={{ padding: '100px 24px 60px', borderTop: '1px solid #f1f5f9', textAlign: 'center', background: '#fff' }}>
        <div className="font-serif" style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-blue)', marginBottom: 20 }}>
          AI Networking <span style={{ color: 'var(--accent-gold)' }}>Pro</span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: 14, letterSpacing: '0.05em', fontWeight: 500 }}>
          © 2026 AI Networking. All Rights Reserved. Designed for premium business events.
        </div>
      </footer>

    </main>
  );
}
