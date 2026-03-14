import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import FormPage from './FormPage';
import Dashboard from './Dashboard';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admingdg123') {
      setIsLoggedIn(true);
      setShowLogin(false);
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <>
      <header className="header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
          <div style={{ display: 'flex', fontWeight: 700, fontSize: '1.3rem' }}>
            <span style={{ color: '#4285F4' }}>B</span>
            <span style={{ color: '#EA4335' }}>u</span>
            <span style={{ color: '#FBBC05' }}>i</span>
            <span style={{ color: '#4285F4' }}>l</span>
            <span style={{ color: '#34A853' }}>d</span>
          </div>
          <span style={{ color: '#5f6368', fontWeight: 400, fontSize: '1.25rem' }}>With Vibes portal</span>
        </h2>
        {isLoggedIn ? (
          <div>
            <span style={{ marginRight: '1rem' }}>Welcome, Admin</span>
            <button className="btn btn-outline" onClick={logout}>Logout</button>
          </div>
        ) : (
          <button className="btn btn-outline" onClick={() => setShowLogin(true)}>Admin Login</button>
        )}
      </header>

      {showLogin && (
        <div className="modal-overlay">
          <div className="glass-panel modal">
            <h3 style={{ marginBottom: '1.5rem' }}>Admin Dashboard Login</h3>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  autoFocus 
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="btn" style={{ flex: 1 }}>Login</button>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  style={{ flex: 1 }}
                  onClick={() => setShowLogin(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/dashboard" element={<Dashboard isLoggedIn={isLoggedIn} />} />
      </Routes>
    </>
  );
}

export default App;
