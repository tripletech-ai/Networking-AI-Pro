// Shared spinner component
function Spinner() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', gap: 20 }}>
      <div style={{ position: 'relative', width: 60, height: 60 }}>
        <div style={{ position: 'absolute', inset: 0, border: '3px solid #f1f5f9', borderRadius: '50%' }}/>
        <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: 'var(--accent-gold)', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }}/>
        <div style={{ position: 'absolute', inset: 8, border: '2px solid transparent', borderBottomColor: 'rgba(197,168,128,0.35)', borderRadius: '50%', animation: 'spin 1.8s linear infinite reverse' }}/>
      </div>
      <style>{`@keyframes spin{100%{transform:rotate(360deg)}}`}</style>
      <div style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500, letterSpacing: '1px' }}>載入中...</div>
    </div>
  );
}
export default Spinner;
