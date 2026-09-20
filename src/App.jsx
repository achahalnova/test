import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MockTests from './pages/MockTests';

function App() {
  return (
    <div className="site-wrapper">
      <Navbar />
      <main className="main-content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tests" element={<MockTests />} />
          {/* We will add more pages like /programs, /about, /contact in later phases */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
