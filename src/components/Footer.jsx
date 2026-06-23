import './Footer.css';

/* ============================================
   SVG Icon Components (inline for independence)
   ============================================ */
function IconEmail() {
  return (
    <svg className="footer-contact-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 6 L10 11 L18 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg className="footer-contact-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="14.5" cy="5.5" r="1" fill="currentColor" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg className="footer-contact-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2C5.58 2 2 5.58 2 10C2 11.5 2.44 12.9 3.2 14.1L2 18L6.05 16.85C7.2 17.55 8.55 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2Z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 8.5C7 8.5 7.5 7 8 7C8.5 7 9 8 9 8C9 8 9.5 8.5 10 9C10.5 9.5 11 10 11 10C11 10 12 10.5 12.5 11C13 11.5 11.5 12 11.5 12C11.5 12 9.5 13 7 10.5C4.5 8 7 8.5 7 8.5Z" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}

/* Decorative leaf for footer background */
function FooterLeaf() {
  return (
    <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 115 C40 115 40 75 40 55 C40 30 15 18 40 3 C65 18 40 30 40 55" stroke="currentColor" strokeWidth="1" />
      <path d="M40 85 C30 75 18 70 8 67" stroke="currentColor" strokeWidth="0.7" />
      <path d="M40 85 C50 75 62 70 72 67" stroke="currentColor" strokeWidth="0.7" />
      <path d="M40 65 C33 58 22 55 14 53" stroke="currentColor" strokeWidth="0.6" />
      <path d="M40 65 C47 58 58 55 66 53" stroke="currentColor" strokeWidth="0.6" />
      <path d="M40 48 C35 43 27 41 20 40" stroke="currentColor" strokeWidth="0.5" />
      <path d="M40 48 C45 43 53 41 60 40" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}

/* ============================================
   Footer Component
   ============================================ */
export default function Footer({ onNavigate }) {
  const handleNavClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <footer className="site-footer">
      {/* Botanical wave border */}
      <div className="footer-botanical-border">
        <div className="footer-vine-overlay" />
      </div>

      {/* Main Footer Content */}
      <div className="footer-content">
        {/* Quick Links */}
        <div>
          <h3 className="footer-col-title">Quick Links</h3>
          <ul className="footer-links">
            {[
              { label: 'Home', page: 'home' },
              { label: 'Shop', page: 'shop' },
              { label: 'Stories', page: 'blog' },
              { label: 'Our Story', page: 'our-story' },
              { label: 'Sunday Kitchen', page: 'sunday-kitchen' },
            ].map((item) => (
              <li key={item.page}>
                <button
                  className="footer-link"
                  onClick={() => handleNavClick(item.page)}
                  type="button"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Policies */}
        <div>
          <h3 className="footer-col-title">Legal Policies</h3>
          <ul className="footer-links">
            {[
              { label: 'Terms & Conditions', page: 'terms' },
              { label: 'Privacy Policy', page: 'privacy' },
              { label: 'Refund Policy', page: 'refunds' },
              { label: 'Shipping Policy', page: 'shipping' },
              { label: 'Contact Us', page: 'contact' },
            ].map((item) => (
              <li key={item.page}>
                <button
                  className="footer-link"
                  onClick={() => handleNavClick(item.page)}
                  type="button"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="footer-col-title">Get in Touch</h3>
          <ul className="footer-contact-list">
            <li className="footer-contact-item">
              <IconEmail />
              <span className="footer-contact-text">
                <a href="mailto:hello@banglarswad.in">hello@banglarswad.in</a>
              </span>
            </li>
            <li className="footer-contact-item">
              <IconInstagram />
              <span className="footer-contact-text">
                <a href="https://instagram.com/banglarswad" target="_blank" rel="noopener noreferrer">
                  @banglarswad
                </a>
              </span>
            </li>
            <li className="footer-contact-item">
              <IconWhatsApp />
              <span className="footer-contact-text">
                WhatsApp Us
              </span>
            </li>
          </ul>
        </div>

        {/* The Mission */}
        <div>
          <h3 className="footer-col-title">The Mission</h3>
          <p className="footer-mission-text">
            To become the default name in every Bengali kitchen that wants to 
            cook real Bengali food. Not through advertising, but through trust. 
            Not through volume, but through quality. Every spice we sell should 
            make someone say: &ldquo;This is it.&rdquo;
          </p>
          <span className="footer-mission-bengali">
            স্মৃতি থেকে রান্নাঘর — বাংলার স্বাদ
          </span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <span className="footer-copyright">
          © 2025 Banglar Swad | <span className="footer-bengali-name">বাংলার স্বাদ</span>
        </span>
        <span className="footer-tagline">
          Cook it low, cook it slow. | <button onClick={() => handleNavClick('admin')} style={{ background: 'transparent', border: 'none', color: 'inherit', font: 'inherit', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>Back Office</button>
        </span>
      </div>

      {/* Decorative background leaf */}
      <div className="footer-decorative-leaf" style={{ color: '#FAF6EE' }}>
        <FooterLeaf />
      </div>
    </footer>
  );
}
