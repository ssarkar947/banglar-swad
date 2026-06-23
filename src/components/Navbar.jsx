import { useState, useEffect, useCallback } from 'react';
import './Navbar.css';

/**
 * Banglar Swad — Premium Navigation Bar
 *
 * @param {string}   activePage  – Currently active page key
 * @param {function} onNavigate  – Navigation handler (receives page key)
 * @param {number}   cartCount   – Number of items in cart
 * @param {function} onCartClick – Cart icon click handler
 */
export default function Navbar({ activePage = 'home', onNavigate, cartCount = 0, onCartClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [badgeBump, setBadgeBump] = useState(false);

  /* ── Scroll listener ─────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Badge bump when cartCount changes ───────────── */
  useEffect(() => {
    if (cartCount > 0) {
      setBadgeBump(true);
      const t = setTimeout(() => setBadgeBump(false), 350);
      return () => clearTimeout(t);
    }
  }, [cartCount]);

  /* ── Lock body scroll when mobile menu is open ───── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNav = useCallback((page) => {
    onNavigate?.(page);
    setMobileOpen(false);
  }, [onNavigate]);

  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'shop', label: 'Shop' },
    { key: 'blog', label: 'Stories' },
    { key: 'our-story', label: 'Our Story' },
    { key: 'sunday-kitchen', label: 'Sunday Kitchen' },
  ];

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">

        {/* ── Logo ──────────────────────────────────── */}
        <a className="navbar__logo" onClick={() => handleNav('home')} tabIndex={0} aria-label="Banglar Swad — Home">
          <div className="navbar__logo-wrap">
            <img src="/images/logo.png" alt="Banglar Swad" className="navbar__logo-img" />
            <span className="navbar__logo-bengali">বাংলার স্বাদ</span>
          </div>
        </a>

        {/* ── Desktop Navigation Links ──────────────── */}
        <ul className="navbar__links">
          {navItems.map(({ key, label }) => (
            <li key={key}>
              <a
                className={`navbar__link${activePage === key ? ' navbar__link--active' : ''}`}
                onClick={() => handleNav(key)}
                tabIndex={0}
                role="link"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* ── Right Actions ─────────────────────────── */}
        <div className="navbar__actions">
          {/* Cart Button */}
          <button
            className="navbar__cart"
            onClick={onCartClick}
            aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} item${cartCount > 1 ? 's' : ''}` : ''}`}
          >
            {/* Shopping Bag SVG */}
            <svg className="navbar__cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>

            {cartCount > 0 && (
              <span className={`navbar__cart-badge${badgeBump ? ' navbar__cart-badge--bump' : ''}`}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* Hamburger (Mobile) */}
          <button
            className={`navbar__hamburger${mobileOpen ? ' navbar__hamburger--open' : ''}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────── */}
      <div className={`navbar__mobile-menu${mobileOpen ? ' navbar__mobile-menu--open' : ''}`} aria-hidden={!mobileOpen}>
        {navItems.map(({ key, label }) => (
          <a
            key={key}
            className={`navbar__mobile-link${activePage === key ? ' navbar__mobile-link--active' : ''}`}
            onClick={() => handleNav(key)}
            tabIndex={mobileOpen ? 0 : -1}
          >
            {label}
          </a>
        ))}

        <hr className="navbar__mobile-divider" />
        <span className="navbar__mobile-bengali">বাংলার রান্নাঘর থেকে</span>
      </div>
    </nav>
  );
}
