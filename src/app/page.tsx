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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflowX: 'hidden' }}>

      {/* 導覽列 */}
      <nav className="landing-nav" style={{ padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: 0, width: '100%', zIndex: 50, boxSizing: 'border-box' }}>
        <div className="font-serif" style={{ fontSize: 20, color: 'var(--accent-blue)', fontWeight: 700, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
          AI Networking <span style={{ color: 'var(--accent-gold)' }}>Pro</span>
        </div>
        <div className="landing-nav-links" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href="/guide" style={{ padding: '8px 20px', fontSize: 13, borderRadius: 8, border: '1px solid rgba(15,23,42,0.12)', color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}>
            使用說明
          </Link>
          <Link href={isAdmin ? '/admin' : '/admin/login'} style={{ padding: '8px 20px', fontSize: 13, borderRadius: 8, background: 'var(--accent-blue)', color: '#fff', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {isAdmin ? '後台' : '主辦方登入'}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section" style={{ position: 'relative', paddingTop: '160px', paddingBottom: '120px', minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 15% 25%, rgba(197,168,128,0.05) 0%, transparent 45%)', zIndex: 0, pointerEvents: 'none' }} />

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 900, padding: '0 24px' }}>

          <motion.div variants={fadeInUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--accent-gold-dark)', fontSize: 12, letterSpacing: '4px', fontWeight: 700, marginBottom: 32, textTransform: 'uppercase', border: '1px solid rgba(197,168,128,0.3)', padding: '6px 16px', borderRadius: 100 }}>
            AI-POWERED · BNI NETWORKING
          </motion.div>

          <motion.h1 className="font-serif" variants={fadeInUp} style={{ fontSize: 'clamp(40px, 7vw, 76px)', fontWeight: 800, color: 'var(--accent-blue)', lineHeight: 1.08, marginBottom: 28, letterSpacing: '-0.5px' }}>
            重新定義商務社交<br />
            <span style={{ color: 'var(--accent-gold)' }}>遇見黃金跳板夥伴</span>
          </motion.h1>

          <motion.p variants={fadeInUp} style={{ fontSize: 'clamp(16px, 2vw, 19px)', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 600, margin: '0 auto 48px' }}>
            AI 語意分析引擎深度解析每位嘉賓的痛點與資源，計算出真正互補的商務配對，而不只是名片交換。
          </motion.p>

          <motion.div variants={fadeInUp} className="hero-cta-group" style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Link href="/admin/login" style={{ padding: '16px 48px', fontSize: 16, borderRadius: 100, background: 'var(--accent-gold)', color: '#fff', textDecoration: 'none', fontWeight: 700, letterSpacing: '0.3px', display: 'inline-block' }}>
              立即開始使用
            </Link>
            <Link href="/guide" style={{ padding: '16px 48px', fontSize: 16, borderRadius: 100, border: '1.5px solid rgba(15,23,42,0.2)', color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600, display: 'inline-block' }}>
              了解運作方式
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} style={{ marginTop: 48, display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['4秒', '通關碼報到'], ['10秒', 'AI 媒合完成'], ['50+人', '已試用活動']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div className="font-serif" style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-blue)' }}>{num}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '1px', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features — Editorial list, not card grid */}
      <section className="feature-section" style={{ padding: '120px 24px', background: '#f9f8f6', position: 'relative' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ marginBottom: 72 }}
          >
            <div style={{ fontSize: 12, letterSpacing: '3px', color: 'var(--accent-gold-dark)', fontWeight: 700, marginBottom: 16, textTransform: 'uppercase' }}>HOW IT WORKS</div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '-0.5px' }}>
              三步驟打造高階商務生態圈
            </h2>
          </motion.div>

          {[
            {
              num: '01',
              title: '通關碼報到 — 4 個字元，秒速入場',
              desc: '主辦方匯入名單後，系統為每位嘉賓產生獨一無二的 4 碼通關碼。現場輸入即完成身份驗證，無需名字搜尋、無需排隊。現場空降的來賓透過 AI Magic Fill 一句話自動建檔，同樣流暢。',
              delay: 0
            },
            {
              num: '02',
              title: 'AI 語意媒合 — 超越產業分類',
              desc: '系統以向量座標計算每位嘉賓的「痛點、服務與需求」，找出真正互補的組合，而不是同產業的人堆在一起。三位黃金夥伴 + 戰略九宮格，附上具體破冰金句，讓對話從第一句就有意義。',
              delay: 0.1
            },
            {
              num: '03',
              title: '數位名片 + 行動清單 — 讓緣分不散失',
              desc: '每位嘉賓擁有專屬 QR Code 名片，對方掃描即可存入聯絡人。今日行動清單協助追蹤「打過招呼」的目標，讓活動結束後的後續跟進有所依據。',
              delay: 0.2
            }
          ].map(({ num, title, desc, delay }) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay }}
              className="feature-item"
              style={{ display: 'flex', gap: 48, paddingTop: 48, paddingBottom: 48, borderTop: '1px solid #e8e5e0', alignItems: 'flex-start' }}
            >
              <div className="feature-number font-serif" style={{ fontSize: 64, fontWeight: 800, color: 'rgba(197,168,128,0.18)', lineHeight: 1, minWidth: 96, flexShrink: 0, letterSpacing: '-2px' }}>
                {num}
              </div>
              <div style={{ flex: 1, paddingTop: 8 }}>
                <h3 className="font-serif" style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 16, lineHeight: 1.3 }}>{title}</h3>
                <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 640 }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ padding: '100px 24px', background: 'var(--accent-blue)', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="font-serif" style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#fff', marginBottom: 20, letterSpacing: '-0.3px' }}>
            準備好讓 AI 主導您的下一場交流會？
          </div>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
            無需技術門檻。上傳報名名單，主辦方即可啟動。
          </p>
          <Link href="/admin/login" style={{ padding: '18px 56px', fontSize: 17, borderRadius: 100, background: 'var(--accent-gold)', color: '#fff', textDecoration: 'none', fontWeight: 700, display: 'inline-block' }}>
            立即建立活動
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', background: 'var(--accent-blue)' }}>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, letterSpacing: '0.05em' }}>
          © 2026 AI Networking Pro · Designed for premium business events
        </div>
      </footer>

    </main>
  );
}
