'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'forgot' | 'verify'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Forgot Password States
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:5500/api';

  const resetState = () => {
    setMode('login');
    setUsername('');
    setPassword('');
    setEmail('');
    setOtp('');
    setNewPassword('');
    setError('');
    setSuccessMsg('');
    setLoading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(username, password);
    setLoading(false);
    if (success) {
      handleClose();
    } else {
      setError('❌ Invalid username or password. Please try again.');
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setMode('verify');
        setSuccessMsg('OTP sent to your email!');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('Error detail:', err);
      setError('Network error: ' + (err.message || String(err)));
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      // Handle non-JSON responses
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('Server returned invalid JSON: ' + text.substring(0, 100));
      }

      if (data.success) {
        setSuccessMsg('Password reset successfully! Please login.');
        setTimeout(() => {
          setMode('login');
          setSuccessMsg('');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Error detail:', err);
      setError('Network error: ' + (err.message || String(err)));
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>×</button>

        {mode === 'login' && (
          <>
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div style={{ textAlign: 'right', marginBottom: 15 }}>
                <button
                  type="button"
                  onClick={() => { setError(''); setMode('forgot'); }}
                  style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Forgot Password?
                </button>
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </>
        )}

        {mode === 'forgot' && (
          <>
            <h2>Reset Password</h2>
            <p style={{ marginBottom: 15, color: '#666' }}>Enter your admin email to receive an OTP.</p>
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              {successMsg && <div className="success-message">{successMsg}</div>}
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
              <button
                type="button"
                onClick={() => { setError(''); setMode('login'); }}
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: 10 }}
              >
                Back to Login
              </button>
            </form>
          </>
        )}

        {mode === 'verify' && (
          <>
            <h2>Verify & Reset</h2>
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  required
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              {successMsg && <div className="success-message">{successMsg}</div>}
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              <button
                type="button"
                onClick={() => { setError(''); setMode('forgot'); }}
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: 10 }}
              >
                Back
              </button>
            </form>
          </>
        )}

      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .modal-content {
          background: white;
          border-radius: 10px;
          padding: 30px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #666;
        }

        h2 {
          margin-bottom: 20px;
          color: #000;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: #333;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
        }

        .error-message {
          color: red;
          margin-bottom: 15px;
          font-size: 0.9rem;
        }
        
        .success-message {
          color: green;
          margin-bottom: 15px;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
