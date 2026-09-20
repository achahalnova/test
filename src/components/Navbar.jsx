import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Home, Phone, GraduationCap, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <GraduationCap className="logo-icon" />
          <span>PREP EDU</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link"><Home size={18}/> Home</Link>
          <Link to="/programs" className="nav-link"><BookOpen size={18}/> Programs</Link>
          <Link to="/contact" className="nav-link"><Phone size={18}/> Contact</Link>
          {user ? (
            <Link to="/dashboard" className="nav-link btn"><User size={18}/> Dashboard</Link>
          ) : (
            <Link to="/login" className="nav-link btn"><User size={18}/> Student Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
