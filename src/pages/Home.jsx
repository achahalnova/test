import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Welcome to PREP EDU</h1>
        <p>The smartest way to prepare for JEE Main, JEE Advanced, and NEET.</p>
        <div className="hero-buttons">
          <Link to="/programs" className="btn btn-secondary">Explore Programs</Link>
          <Link to="/tests" className="btn">Take a Mock Test</Link>
        </div>
      </header>

      <section className="features-section">
        <div className="feature-card">
          <h2>JEE Coaching</h2>
          <p>Comprehensive preparation for JEE Main and Advanced.</p>
        </div>
        <div className="feature-card">
          <h2>NEET Coaching</h2>
          <p>Expert guidance and mock tests for medical aspirants.</p>
        </div>
        <div className="feature-card">
          <h2>Foundation Classes</h2>
          <p>Building strong fundamentals for students in Grades 7-10.</p>
        </div>
      </section>
    </div>
  );
}
