import './Hero.css';

/**
 * Banglar Swad — Full-Viewport Hero Section
 *
 * @param {function} onNavigate – Navigation handler (receives page key)
 */
export default function Hero({ onNavigate }) {
  return (
    <section className="hero" aria-label="Hero banner">

      {/* ── Background Image ────────────────────────── */}
      <div className="hero__bg">
        <img
          className="hero__bg-img"
          src="/images/hero-banner.png"
          alt="Traditional Bengali spices arranged on a rustic surface"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* ── Dark Gradient Overlay ────────────────────── */}
      <div className="hero__overlay" aria-hidden="true" />

      {/* ── Subtle Kraft-Paper Texture ────────────────── */}
      <div className="hero__texture" aria-hidden="true" />

      {/* ── Content ──────────────────────────────────── */}
      <div className="hero__content">

        {/* Bengali Tag */}
        <span className="hero__bengali-tag">
          বাংলার রান্নাঘর থেকে
        </span>

        {/* Main Heading */}
        <h1 className="hero__heading">
          We refused to let our grandmother's recipes die with her.
        </h1>

        {/* Subtitle */}
        <p className="hero__subtitle">
          Banglar Swad is built by millennials and Gen Z who grew up eating the 
          real thing—and are now making sure the next generation can too.
        </p>

        {/* CTA Buttons */}
        <div className="hero__ctas">
          <button
            className="hero__cta hero__cta--filled"
            onClick={() => onNavigate?.('shop')}
            type="button"
          >
            Explore Our Spices
            <span className="hero__cta-arrow" aria-hidden="true">→</span>
          </button>

          <button
            className="hero__cta hero__cta--outlined"
            onClick={() => onNavigate?.('our-story')}
            type="button"
          >
            Our Story
          </button>
        </div>
      </div>

      {/* ── Scroll-Down Indicator ────────────────────── */}
      <div className="hero__scroll-indicator" aria-hidden="true">
        <span className="hero__scroll-text">Scroll</span>
        <svg
          className="hero__scroll-chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
