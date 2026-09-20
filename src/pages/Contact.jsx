export default function Contact() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>Have questions about our programs? We are here to help.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info-card">
          <h2>Get in Touch</h2>
          <div className="contact-detail">
            <strong>Email:</strong><br/>
            info@prepedu.co.in
          </div>
          <div className="contact-detail">
            <strong>Phone:</strong><br/>
            +91 98765 43210
          </div>
          <div className="contact-detail">
            <strong>Address:</strong><br/>
            PREP EDU Institute<br/>
            Education Hub, Sector 14<br/>
            New Delhi, India
          </div>
        </div>

        <div className="contact-form-card">
          <h2>Send us a message</h2>
          <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" className="form-control" required placeholder="Enter your name" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="form-control" required placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea className="form-control" rows="5" required placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="btn" style={{width: '100%'}}>Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
