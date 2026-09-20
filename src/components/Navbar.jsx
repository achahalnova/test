import { Link } from 'react-router-dom';
import { BookOpen, Home, Phone, GraduationCap } from 'lucide-react';

export default function Navbar() {
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
          <Link to="/tests" className="nav-link btn">Mock Tests</Link>
        </div>
      </div>
    </nav>
  );
}
