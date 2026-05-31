export default function AdminLoading() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
      gap: 20,
    }}>
      <div style={{ position: 'relative', width: 48, height: 48 }}>
        <div style={{
          position: 'absolute', inset: 0,
          border: '3px solid #e2e8f0',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          border: '3px solid transparent',
          borderTopColor: '#c5a880',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
      <div style={{ fontSize: 15, color: '#64748b', fontWeight: 500 }}>載入中...</div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
