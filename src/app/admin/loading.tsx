export default function AdminLoading() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)'
    }}>
      <div style={{ position: 'relative', width: 64, height: 64, marginBottom: 24 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '2px solid rgba(197, 168, 128, 0.1)', borderRadius: '50%' }}/>
        <div style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '2px solid transparent', 
          borderTopColor: '#c5a880', borderRadius: '50%',
          animation: 'spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite'
        }}/>
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize: 16, color: 'var(--accent-blue)', fontWeight: 600, letterSpacing: '1px' }}>
        系統載入中...
      </div>
    </div>
  );
}
