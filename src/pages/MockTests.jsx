import { useState, useEffect } from 'react';
import testData from '../data/tests.json';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function MockTests() {
  const [activeTest, setActiveTest] = useState(null);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        alert("Please log in to take a mock test.");
        navigate('/login');
      }
    });
  }, [navigate]);

  if (results) {
    return <ResultsScreen results={results} test={activeTest} onHome={() => { setResults(null); setActiveTest(null); navigate('/dashboard'); }} />;
  }

  if (activeTest) {
    return <TestEngine test={activeTest} onSubmit={(res) => setResults(res)} onExit={() => setActiveTest(null)} />;
  }

  return (
    <div className="app-container">
      <div className="test-list-container">
        <h1 style={{ marginBottom: '2rem' }}>Available Tests</h1>
        {testData.map(test => (
          <div key={test.id} className="test-card">
            <div className="test-title">{test.title}</div>
            <div className="test-meta">{test.durationMinutes} Minutes • {test.instructions.substring(0, 50)}...</div>
            <button className="btn" onClick={() => setActiveTest(test)}>Start Test</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestEngine({ test, onSubmit, onExit }) {
  // Flatten all questions into a single array for easier navigation
  const questions = test.sections.flatMap(section => 
    section.questions.map(q => ({ ...q, sectionName: section.name }))
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (val) => {
    setAnswers(prev => ({ ...prev, [questions[currentIndex].id]: val }));
  };

  const toggleMarkForReview = () => {
    const qId = questions[currentIndex].id;
    setMarked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(qId)) newSet.delete(qId);
      else newSet.add(qId);
      return newSet;
    });
  };

  const handleSubmit = async () => {
    let score = 0;
    let correct = 0;
    let incorrect = 0;

    questions.forEach(q => {
      const ans = answers[q.id];
      if (ans !== undefined && ans !== "") {
        if (q.type === 'mcq') {
          if (ans === q.correctOptionIndex) {
            score += q.marks.correct;
            correct++;
          } else {
            score += q.marks.incorrect;
            incorrect++;
          }
        } else if (q.type === 'integer') {
          if (Number(ans) === q.correctAnswer) {
            score += q.marks.correct;
            correct++;
          } else {
            score += q.marks.incorrect;
            incorrect++;
          }
        }
      }
    });

    const resObj = { score, correct, incorrect, totalQuestions: questions.length, attempted: Object.keys(answers).length };
    
    // Save to Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('StudentMarks').insert([
        { 
          user_id: session.user.id,
          test_name: test.title,
          score: score
        }
      ]);
    }

    onSubmit(resObj);
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="engine-container">
      <div className="main-content">
        <div className="header-row">
          <div>
            <h2>{test.title}</h2>
            <div className="test-meta" style={{marginBottom: 0}}>{currentQ.sectionName} - Question {currentIndex + 1}</div>
          </div>
          <div className="timer">Time Left: {formatTime(timeLeft)}</div>
        </div>

        <div className="question-text">{currentQ.text}</div>

        {currentQ.type === 'mcq' && (
          <div className="options-container">
            {currentQ.options.map((opt, idx) => (
              <label key={idx} className={`option-label ${answers[currentQ.id] === idx ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name={`q-${currentQ.id}`} 
                  className="option-input"
                  checked={answers[currentQ.id] === idx}
                  onChange={() => handleAnswer(idx)}
                />
                {opt}
              </label>
            ))}
          </div>
        )}

        {currentQ.type === 'integer' && (
          <div>
            <input 
              type="number" 
              className="integer-input" 
              placeholder="Enter numerical value..."
              value={answers[currentQ.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
            />
          </div>
        )}

        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={toggleMarkForReview}>
            {marked.has(currentQ.id) ? "Unmark Review" : "Mark for Review"}
          </button>
          <button className="btn btn-secondary" onClick={() => setAnswers(prev => { const n = {...prev}; delete n[currentQ.id]; return n; })}>Clear Response</button>
          <button className="btn" onClick={() => setCurrentIndex(Math.min(currentIndex + 1, questions.length - 1))}>Save & Next</button>
        </div>
      </div>

      <div className="sidebar">
        <h3>Question Palette</h3>
        <div className="grid-palette">
          {questions.map((q, idx) => {
            let statusClass = "";
            if (answers[q.id] !== undefined && answers[q.id] !== "") statusClass = "answered";
            if (marked.has(q.id)) statusClass = "marked";
            if (currentIndex === idx) statusClass += " current";

            return (
              <button 
                key={q.id} 
                className={`palette-btn ${statusClass}`}
                onClick={() => setCurrentIndex(idx)}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>
        <button className="btn submit-btn" onClick={handleSubmit}>Submit Test</button>
        <button className="btn btn-secondary" style={{marginTop: '1rem'}} onClick={onExit}>Exit Test</button>
      </div>
    </div>
  );
}

function ResultsScreen({ results, test, onHome }) {
  return (
    <div className="results-container">
      <div className="score-card">
        <h2>{test.title} - Results</h2>
        <div className="score-value">{results.score} Marks</div>
        <div className="stats-grid">
          <div className="stat-item">
            <strong>Attempted:</strong> {results.attempted} / {results.totalQuestions}
          </div>
          <div className="stat-item">
            <strong>Unattempted:</strong> {results.totalQuestions - results.attempted}
          </div>
          <div className="stat-item" style={{color: 'var(--success)'}}>
            <strong>Correct:</strong> {results.correct}
          </div>
          <div className="stat-item" style={{color: 'var(--danger)'}}>
            <strong>Incorrect:</strong> {results.incorrect}
          </div>
        </div>
        <p style={{marginBottom: '2rem', color: 'var(--success)'}}>
          ✓ This score has been securely saved to your Student Dashboard!
        </p>
        <button className="btn" onClick={onHome}>View Dashboard</button>
      </div>
    </div>
  );
}
