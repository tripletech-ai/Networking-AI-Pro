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
    'linear-gradient(135deg, #c5a880, #8c7355)',
    'linear-gradient(135deg, #64748b, #334155)'
  ];
  return gradients[idx % gradients.length];
};

const getColor = (idx: number) => {
  return idx % 2 === 0 ? '#c5a880' : '#94a3b8';
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
      return <div className="glass-card" style={{ minHeight: 130, opacity: 0.3 }} />;
    }
    const color = getColor(position);

    return (
      <motion.button
        whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
        onClick={() => openModal(person)}
        className="glass-card"
        style={{
          padding: '16px 12px', textAlign: 'center', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 6, minHeight: 130, outline: 'none', cursor: 'pointer',
          position: 'relative', overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: getGradientBorder(position) }} />
        
        <div style={{
          width: 38, height: 38, borderRadius: '8px',
          background: `rgba(255, 255, 255, 0.05)`,
          border: `1px solid rgba(255, 255, 255, 0.1)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 600, color, marginBottom: 4
        }}>
          {person.name.charAt(0)}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', letterSpacing: '0.5px' }}>{person.name}</div>
        <div style={{ fontSize: 12, color: '#64748b' }}>{person.title}</div>
        <div style={{
          fontSize: 10, color: color, border: `1px solid ${color}40`, background: `rgba(255,255,255,0.02)`,
          padding: '3px 8px', borderRadius: '4px', marginTop: 4, fontWeight: 500
        }}>
          {person.industry}
        </div>
      </motion.button>
    );
  };

  const renderCenterCell = () => (
    <div className="glass-card" style={{
      padding: '16px 12px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 130,
      background: 'rgba(197, 168, 128, 0.05)',
      boxShadow: 'inset 0 0 0 1px rgba(197, 168, 128, 0.3)',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: -1, right: -1, background: '#c5a880', color: '#000', fontSize: 10, padding: '2px 8px', borderBottomLeftRadius: 8 }}>您</div>
      <div style={{
        width: 46, height: 46, borderRadius: '10px',
        background: 'linear-gradient(135deg, #c5a880, #8c7355)', color: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, fontWeight: 700, boxShadow: '0 4px 12px rgba(197,168,128,0.2)'
      }}>
        {user.name.charAt(0)}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#c5a880', letterSpacing: '0.5px', marginTop: 4 }}>{user.name}</div>
      <div style={{ fontSize: 12, color: '#94a3b8' }}>{user.title}</div>
    </div>
  );

  return (
    <div className="fade-in-up">
      <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: 13, color: '#c5a880', letterSpacing: '1px', marginBottom: 6, fontWeight: 500 }}>
          跨界戰略矩陣
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '0.5px', color: '#f8fafc' }}>
          人脈九宮格 <span style={{ color: '#64748b', fontSize: 14, fontWeight: 400, marginLeft: 8 }}>點擊翻開戰略解析卡片</span>
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
        <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #c5a880', background: 'rgba(197, 168, 128, 0.05)' }}>
          <div style={{ fontSize: 14, color: '#c5a880', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            商務戰略總結
          </div>
          <div style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.8 }}>
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
              background: 'rgba(10, 10, 12, 0.85)', backdropFilter: 'blur(12px)',
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
                {/* 正面 */}
                <div
                  className="backface-hidden glass-card"
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: '#121316',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0,
                    border: '1px solid rgba(197, 168, 128, 0.3)'
                  }}
                >
                  <div style={{ height: 80, background: getGradientBorder(selectedPerson.position) }} />
                  
                  <div style={{ padding: '0 24px 24px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -40 }}>
                    <div style={{ 
                      width: 80, height: 80, borderRadius: '16px', background: '#1e293b',
                      border: '4px solid #121316', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 32, fontWeight: 700, color: getColor(selectedPerson.position), marginBottom: 20
                    }}>
                      {selectedPerson.name.charAt(0)}
                    </div>
                    
                    <h2 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '0.5px', marginBottom: 6, color: '#f8fafc' }}>
                      {selectedPerson.name}
                    </h2>
                    <div style={{ fontSize: 15, color: '#94a3b8', marginBottom: 24, textAlign: 'center' }}>
                      {selectedPerson.title} · {selectedPerson.company}
                    </div>

                    <div style={{ flex: 1 }} />
                    
                    <div style={{ fontSize: 14, color: '#c5a880', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(197, 168, 128, 0.1)', padding: '12px 24px', borderRadius: '8px', border: '1px solid rgba(197, 168, 128, 0.2)' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                      點擊翻頁查看解析
                    </div>
                  </div>
                </div>

                {/* 背面 - 深度媒合原因 + 記住聯絡人 */}
                <div
                  className="backface-hidden glass-card"
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: '#121316',
                    transform: 'rotateY(180deg)',
                    display: 'flex', flexDirection: 'column',
                    padding: 0, overflow: 'hidden',
                    border: '1px solid rgba(197, 168, 128, 0.3)'
                  }}
                >
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#c5a880' }}>推薦認識原因</div>
                    <button onClick={(e) => { e.stopPropagation(); closeModal(); }} style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                  </div>

                  <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 16, color: '#cbd5e1', lineHeight: 1.8, marginBottom: 24, flex: 1 }}>
                      {selectedPerson.reason}
                    </div>
                    
                    {/* 整合 SaveContactButton */}
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
