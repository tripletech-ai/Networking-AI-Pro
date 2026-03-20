'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error);
      }
    } catch {
      setError('連線失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div className="glass-card fade-in-up" style={{ width: 400, padding: 40, borderTop: '4px solid #c5a880' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, margin: '0 auto 16px', borderRadius: 12,
            background: 'linear-gradient(135deg, #c5a880, #8c7355)',
            boxShadow: '0 4px 12px rgba(197, 168, 128, 0.2)'
          }} />
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#f8fafc', letterSpacing: '1px' }}>
            主辦方專屬後台
          </h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 8 }}>
            Premium AI Networking System
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#c5a880', marginBottom: 8, fontWeight: 500 }}>
              主辦方帳號 (Email)
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
            <label style={{ display: 'block', fontSize: 13, color: '#c5a880', marginBottom: 8, fontWeight: 500 }}>
              密碼
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

          {error && <div style={{ color: '#f87171', fontSize: 13, textAlign: 'center' }}>{error}</div>}

          <button type="submit" className="btn-primary" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? '驗證中...' : '登入系統'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#64748b' }}>
          * 測試用帳號：<br/>
          admin@networking-ai.com / admin<br/>
          demo@networking-ai.com / demo
        </div>
      </div>
    </div>
  );
}
