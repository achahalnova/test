import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let errorObj = null;

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      errorObj = error;
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      errorObj = error;
      if (!error) {
        alert("Registration successful! You can now log in.");
        setIsLogin(true);
      }
    }

    if (errorObj) {
      setError(errorObj.message);
    } else if (isLogin) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="auth-card">
        <h2 style={{textAlign: 'center', marginBottom: '2rem', color: 'var(--primary)'}}>
          {isLogin ? 'Student Login' : 'Create Account'}
        </h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleAuth}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn" style={{width: '100%'}} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>
        <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
          <button className="reset-button" onClick={() => setIsLogin(!isLogin)} style={{color: 'var(--primary)', cursor: 'pointer'}}>
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}
