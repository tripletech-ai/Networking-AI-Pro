export default function EventLoading() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)'
    }}>
      <div style={{ position: 'relative', width: 64, height: 64, marginBottom: 24 }}>
        <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(197, 168, 128, 0.1)', borderRadius: '50%' }}/>
        <div style={{
          position: 'absolute', inset: 0, border: '2px solid transparent',
          borderTopColor: '#c5a880', borderRadius: '50%',
          animation: 'spin 1.2s linear infinite'
        }}/>
        <div style={{
          position: 'absolute', inset: 10, border: '2px solid transparent',
          borderBottomColor: 'rgba(197, 168, 128, 0.4)', borderRadius: '50%',
          animation: 'spin 2s linear infinite reverse'
        }}/>
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize: 14, color: '#c5a880', fontWeight: 500, letterSpacing: '2px' }}>
        載入中...
      </div>
    </div>
  );
}
