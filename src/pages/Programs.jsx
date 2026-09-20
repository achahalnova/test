import { Link } from 'react-router-dom';

export default function Programs() {
  const programs = [
    {
      id: 1,
      title: "JEE/NEET Coaching Program",
      description: "Intensive preparation program focused on securing top ranks in JEE Main, Advanced, and NEET. Includes comprehensive study material and expert mentorship.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      features: ["Daily Live Classes", "Weekly Mock Tests", "Doubt Clearing Sessions", "Personal Mentorship"]
    },
    {
      id: 2,
      title: "Foundation Classes for Grades 7-10",
      description: "Build a rock-solid foundation for future competitive exams. Focus on concept clarity in Mathematics and Science to stay ahead of the curve.",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      features: ["Olympiad Preparation", "Conceptual Clarity", "Interactive Learning", "Regular Assessments"]
    },
    {
      id: 3,
      title: "Comprehensive JEE and NEET Preparation",
      description: "A hybrid model designed for 11th and 12th graders looking to balance board exams with competitive exam preparation.",
      image: "https://images.unsplash.com/photo-1518133835878-5a93ac3bf141?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      features: ["Board Exam Support", "Advanced Problem Solving", "Time Management Skills", "All-India Test Series"]
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Our Programs</h1>
        <p>Track the progress of your programs and choose the best path for your future.</p>
      </div>

      <div className="programs-list">
        {programs.map(program => (
          <div key={program.id} className="program-card">
            <div className="program-image" style={{backgroundImage: `url(${program.image})`}}></div>
            <div className="program-content">
              <h2>{program.title}</h2>
              <p className="program-desc">{program.description}</p>
              <ul className="program-features">
                {program.features.map((feat, idx) => (
                  <li key={idx}>✓ {feat}</li>
                ))}
              </ul>
              <Link to="/contact" className="btn">Enroll Now</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
