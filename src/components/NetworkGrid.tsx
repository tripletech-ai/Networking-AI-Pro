'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GridPerson, GuestData } from '@/types';
import SaveContactButton from '@/components/SaveContactButton';

interface Props {
  grid: GridPerson[];
  user: GuestData;
  summary: string;
}

const getGradientBorder = (idx: number) => {
  const gradients = [
    'linear-gradient(135deg, #d4af37 0%, #c5a880 100%)', // Gold
    'linear-gradient(135deg, #0f172a 0%, #334155 100%)', // Navy
    'linear-gradient(135deg, #a68b5b 0%, #dfc9ae 100%)'  // Bronze/Light Gold
  ];
  return gradients[idx % gradients.length];
};

const getColor = (idx: number) => {
  const accentColors = ['#a68b5b', '#1e293b', '#c5a880'];
  return accentColors[idx % accentColors.length];
};

export default function NetworkGrid({ grid, user, summary }: Props) {
  const [selectedPerson, setSelectedPerson] = useState<GridPerson | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const byPos = (p: number) => grid.find(g => g.position === p);

  const openModal = (person: GridPerson) => {
    setSelectedPerson(person);
    setIsFlipped(false);
  };

  const closeModal = () => {
    setSelectedPerson(null);
    setIsFlipped(false);
  };

  const renderGridCell = (position: number) => {
    const person = byPos(position);
    if (!person) {
      return <div className="glass-card" style={{ minHeight: 130, opacity: 0.1, background: 'rgba(15, 23, 42, 0.05)' }} />;
    }
    const color = getColor(position);

    return (
      <motion.button
        whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
        onClick={() => openModal(person)}
        className="glass-card"
        style={{
          padding: '24px 16px', textAlign: 'center', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 12, minHeight: 150, outline: 'none', cursor: 'pointer',
          position: 'relative', overflow: 'hidden', background: '#fff',
          borderWidth: '1px'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: getGradientBorder(position) }} />
        
        <div style={{
          width: 44, height: 44, borderRadius: '12px',
          background: `${color}08`,
          border: `1px solid ${color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, color, marginBottom: 4
        }}>
          {person.name.charAt(0)}
        </div>
        <div>
          <div className="font-serif" style={{ fontSize: 17, fontWeight: 700, color: 'var(--accent-blue)', letterSpacing: '0.3px', marginBottom: 2 }}>{person.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.2px' }}>{person.title}</div>
        </div>
        
        <div style={{
          fontSize: 10, color: color, border: `1px solid ${color}25`, background: `${color}05`,
          padding: '4px 10px', borderRadius: '100px', marginTop: 4, fontWeight: 700, letterSpacing: '0.5px'
        }}>
          {person.industry.toUpperCase()}
        </div>
      </motion.button>
    );
  };

  const renderCenterCell = () => (
    <div className="glass-card" style={{
      padding: '24px 16px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 150,
      background: 'rgba(197, 168, 128, 0.03)',
      border: '1px solid rgba(197, 168, 128, 0.25)',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-gold)', color: '#fff', fontSize: 10, padding: '4px 12px', borderBottomLeftRadius: 12, fontWeight: 700, letterSpacing: '1px' }}>YOU</div>
      <div style={{
        width: 54, height: 54, borderRadius: '14px',
        background: 'linear-gradient(135deg, var(--accent-blue), #1e293b)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, fontWeight: 700, boxShadow: '0 8px 16px rgba(15, 23, 42, 0.15)'
      }}>
        {user.name.charAt(0)}
      </div>
      <div>
        <div className="font-serif" style={{ fontSize: 17, fontWeight: 700, color: 'var(--accent-blue)', letterSpacing: '0.3px', marginTop: 4 }}>{user.name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{user.title}</div>
      </div>
    </div>
  );

  return (
    <div className="fade-in-up">
      <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: 13, color: 'var(--accent-gold-dark)', letterSpacing: '1px', marginBottom: 6, fontWeight: 700 }}>
          商務人脈戰略佈局
        </div>
        <div className="font-serif" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.5px', color: 'var(--accent-blue)' }}>
          AI 媒合九宮格 <span style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 400, marginLeft: 8, fontFamily: 'Inter, sans-serif' }}>點擊卡片翻開媒合原因</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
        {renderGridCell(0)}
        {renderGridCell(1)}
        {renderGridCell(2)}
        {renderGridCell(3)}
        {renderCenterCell()}
        {renderGridCell(4)}
        {renderGridCell(5)}
        {renderGridCell(6)}
        {renderGridCell(7)}
      </div>

      {summary && (
        <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--accent-gold)', background: 'rgba(197, 168, 128, 0.03)' }}>
          <div style={{ fontSize: 14, color: 'var(--accent-gold-dark)', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            商務戰略總結
          </div>
          <div style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.8, fontWeight: 400 }}>
            {summary}
          </div>
        </div>
      )}

      {/* 3D 翻轉解析卡片 */}
      <AnimatePresence>
        {selectedPerson && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            }}
            onClick={closeModal}
          >
            <div
              className="perspective-1000"
              style={{ width: 340, height: 480, cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}
            >
              <motion.div
                className="transform-style-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
                style={{ width: '100%', height: '100%', position: 'relative' }}
              >
                <div
                  className="backface-hidden glass-card"
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: '#ffffff',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0,
                    border: '1px solid rgba(197, 168, 128, 0.2)'
                  }}
                >
                  <div style={{ height: 120, background: getGradientBorder(selectedPerson.position) }} />
                  
                  <div style={{ padding: '0 32px 32px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -50 }}>
                    <div style={{ 
                      width: 100, height: 100, borderRadius: '50%', background: '#fff',
                      border: '6px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 36, fontWeight: 700, color: getColor(selectedPerson.position), marginBottom: 16,
                      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.12)'
                    }}>
                      {selectedPerson.name.charAt(0)}
                    </div>
                    
                    <h2 className="font-serif" style={{ fontSize: 26, fontWeight: 700, letterSpacing: '0.5px', marginBottom: 12, color: 'var(--accent-blue)', textAlign: 'center' }}>
                      {selectedPerson.name}
                    </h2>

                    <div style={{ fontSize: 13, color: 'var(--accent-gold-dark)', fontWeight: 600, padding: '6px 16px', background: 'rgba(197, 168, 128, 0.1)', borderRadius: 100, marginBottom: 16 }}>
                      {selectedPerson.title}
                    </div>

                    <div style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 24, textAlign: 'center', fontWeight: 500, lineHeight: 1.5 }}>
                      {selectedPerson.company}
                    </div>

                    <div style={{ flex: 1 }} />
                    
                    <div style={{ fontSize: 14, color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dark))', padding: '14px 28px', borderRadius: '100px', boxShadow: '0 8px 24px rgba(197, 168, 128, 0.3)' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                      點擊翻頁查看解析
                    </div>
                  </div>
                </div>

                {/* 背面 - 深度媒合原因 + 記住聯絡人 */}
                <div
                  className="backface-hidden glass-card"
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: '#ffffff',
                    transform: 'rotateY(180deg)',
                    display: 'flex', flexDirection: 'column',
                    padding: 0, overflow: 'hidden',
                    border: '1px solid rgba(197, 168, 128, 0.3)'
                  }}
                >
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent-gold-dark)', letterSpacing: '1px' }}>AI 媒合精準解析</div>
                    <button onClick={(e) => { e.stopPropagation(); closeModal(); }} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                  </div>

                  <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 16, color: 'var(--accent-blue)', lineHeight: 1.8, marginBottom: 24, flex: 1 }}>
                      {selectedPerson.reason}
                    </div>
                    
                    <div onClick={(e) => e.stopPropagation()}>
                      <SaveContactButton
                        member={{
                          id: selectedPerson.id || `grid-${selectedPerson.position}-${selectedPerson.name}`,
                          name: selectedPerson.name,
                          company: selectedPerson.company,
                          title: selectedPerson.title,
                          industry: selectedPerson.industry,
                        }}
                        style={{ padding: '14px', fontSize: 15 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
