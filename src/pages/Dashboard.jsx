import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndMarks = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      setUser(session.user);
      
      // Fetch marks from the custom StudentMarks table
      const { data, error } = await supabase
        .from('StudentMarks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (data) {
        setMarks(data);
      }
      setLoading(false);
    };

    fetchUserAndMarks();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return <div className="page-container"><h2 style={{textAlign:'center'}}>Loading Dashboard...</h2></div>;
  }

  return (
    <div className="page-container">
      <div className="header-row" style={{marginBottom: '4rem'}}>
        <div>
          <h1>Student Dashboard</h1>
          <p>Welcome back, {user?.email}</p>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="contact-grid">
        <div className="contact-info-card">
          <h2>My Active Programs</h2>
          <div style={{padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '1rem'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: '0.5rem'}}>JEE Main Mock Test Series</h3>
            <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Active • Expires in 365 days</p>
          </div>
          <Link to="/tests" className="btn" style={{width: '100%', display: 'inline-block', textAlign: 'center'}}>Take a Mock Test</Link>
        </div>

        <div className="contact-form-card">
          <h2>My Test Marks</h2>
          {marks.length === 0 ? (
            <p style={{color: 'var(--text-muted)'}}>You haven't taken any tests yet.</p>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {marks.map((mark, idx) => (
                <div key={idx} style={{display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--border)'}}>
                  <div>
                    <h3 style={{marginBottom: '0.25rem'}}>{mark.test_name}</h3>
                    <p style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>{new Date(mark.created_at).toLocaleDateString()}</p>
                  </div>
                  <div style={{fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)'}}>
                    {mark.score}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
