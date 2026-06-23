import { useState } from 'react';
import './AdminLogin.css';

export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check password against env variable, fallback to 'didas_secret'
    const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'didas_secret';
    
    if (password === expectedPassword) {
      setError('');
      // Save authentication flag in sessionStorage (valid for browser tab lifespan)
      sessionStorage.setItem('bs_admin_auth', 'true');
      onLoginSuccess();
    } else {
      setError('Incorrect password. Dida is not pleased.');
    }
  };

  return (
    <div className="admin-login fadeIn">
      <div className="admin-login__card">
        <div className="admin-login__brand">
          <span className="admin-login__brand-bn">বাংলার স্বাদ</span>
          <h1 className="admin-login__brand-en">Back Office Access</h1>
        </div>

        <p className="admin-login__desc">
          This portal allows management of recipes, spice catalog, customer orders, and payment integrations. 
          Enter your kitchen password to unlock the dashboard control panels.
        </p>

        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="admin-login__field">
            <label htmlFor="adminPassword">Kitchen Password</label>
            <input
              type="password"
              id="adminPassword"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>

          {error && <p className="admin-login__error">{error}</p>}

          <button type="submit" className="admin-login__submit">
            Unlock Dashboard 🌿
          </button>
        </form>

        <div className="admin-login__footer">
          <p>“Cook it low, cook it slow.” — Dida</p>
        </div>
      </div>
    </div>
  );
}
