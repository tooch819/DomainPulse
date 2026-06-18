import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMockLogin = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      await login(email, email.split('@')[0]);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card card glass">
        <div className="login-header">
          <div className="login-icon bg-gradient">
            <ShieldCheck size={32} color="white" />
          </div>
          <h1>Secure Connection</h1>
          <p>DomainPulse uses Internet Identity to ensure your portfolio and data remain private and tamper-proof.</p>
        </div>

        <form onSubmit={handleMockLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg login-btn" disabled={loading}>
            {loading ? (
              <><Loader2 className="animate-spin" size={20} /> Connecting...</>
            ) : (
              <><ShieldCheck size={20} /> Connect with Internet Identity</>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>By connecting, you agree to our <a href="/tos">Terms</a> and <a href="/privacy">Privacy Policy</a>.</p>
          <div className="ii-badge">
            Powered by <span>Internet Identity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
