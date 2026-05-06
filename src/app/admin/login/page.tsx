'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@networking-ai.com');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setRedirecting(true);
        router.push('/admin');
      } else {
        setError(data.error);
      }
    } catch {
      setError('連線失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  if (redirecting) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', gap: 20 }}>
        <div style={{ position: 'relative', width: 56, height: 56 }}>
          <div style={{ position: 'absolute', inset: 0, border: '3px solid #e2e8f0', borderRadius: '50%' }}/>
          <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: 'var(--accent-gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
        </div>
        <div style={{ fontSize: 16, color: 'var(--accent-blue)', fontWeight: 600 }}>進入後台中...</div>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div className="glass-card fade-in-up" style={{ width: 400, padding: 40, borderTop: '4px solid var(--accent-gold)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, margin: '0 auto 16px', borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent-blue), #1e293b)',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)'
          }} />
          <h1 className="font-serif" style={{ fontSize: 26, fontWeight: 700, color: 'var(--accent-blue)', letterSpacing: '0.5px' }}>
            主辦方管理中心
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, letterSpacing: '1px' }}>
            PREMIUM NETWORKING SYSTEM
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--accent-gold-dark)', marginBottom: 8, fontWeight: 600 }}>
              帳號 (Email)
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="admin@networking-ai.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--accent-gold-dark)', marginBottom: 8, fontWeight: 600 }}>
              授權密碼
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div style={{ color: '#ef4444', fontSize: 13, textAlign: 'center' }}>{error}</div>}

          <button type="submit" className="btn-primary" style={{ marginTop: 8, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%' }} disabled={loading}>
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                驗證中...
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              </>
            ) : '進入後台控制面板'}
          </button>
        </form>

        <div style={{ marginTop: 32, textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px' }}>
          測試帳號：admin@networking-ai.com / admin
        </div>
      </div>
    </div>
  );
}
