import { useEffect, useRef, useCallback } from 'react';
import './OurStory.css';

/* ============================================
   Intersection Observer hook for scroll reveals
   ============================================ */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );

    // Observe the element itself and any children with the class
    const targets = node.querySelectorAll('.story-reveal, .mission-cinematic-line, .mission-cinematic-divider, .mission-closing');
    targets.forEach((el) => observer.observe(el));
    if (node.classList.contains('story-reveal')) {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

/* ============================================
   Decorative Botanical SVG Components
   ============================================ */
function BotanicalLeaf({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 95 C30 95 30 60 30 45 C30 25 10 15 30 2 C50 15 30 25 30 45" stroke="currentColor" strokeWidth="1.2" />
      <path d="M30 70 C22 62 12 58 5 55" stroke="currentColor" strokeWidth="0.8" />
      <path d="M30 70 C38 62 48 58 55 55" stroke="currentColor" strokeWidth="0.8" />
      <path d="M30 55 C24 49 16 46 10 44" stroke="currentColor" strokeWidth="0.7" />
      <path d="M30 55 C36 49 44 46 50 44" stroke="currentColor" strokeWidth="0.7" />
      <path d="M30 42 C26 38 20 36 15 35" stroke="currentColor" strokeWidth="0.6" />
      <path d="M30 42 C34 38 40 36 45 35" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  );
}

function BotanicalSprig({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 35 C15 30 25 20 40 18 C55 16 65 22 75 15" stroke="currentColor" strokeWidth="1" />
      <path d="M20 22 C18 15 22 8 28 5" stroke="currentColor" strokeWidth="0.8" />
      <path d="M40 18 C38 10 42 4 48 2" stroke="currentColor" strokeWidth="0.8" />
      <path d="M58 17 C60 10 65 5 72 3" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="28" cy="5" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="48" cy="2" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="72" cy="3" r="1.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

/* ============================================
   OurStory Component
   ============================================ */
export default function OurStory() {
  const sectionRef = useScrollReveal(0.1);

  /* Separate observer for cinematic lines with lower threshold */
  const cinematicRef = useRef(null);

  useEffect(() => {
    const node = cinematicRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -40px 0px' }
    );

    const targets = node.querySelectorAll('.mission-cinematic-line, .mission-cinematic-divider, .mission-closing');
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="our-story" ref={sectionRef}>

      {/* ===== Section 1: The Origin ===== */}
      <section className="story-origin">
        <div className="origin-inner story-reveal">
          <span className="origin-bengali-accent">গল্পের শুরু</span>
          <h1 className="origin-heading">
            We grew up watching someone cook without measuring anything.
          </h1>
          <hr className="origin-divider" />
          <div className="origin-body">
            <p>
              There was never a recipe. There was never a tablespoon or a teaspoon 
              or a &ldquo;pinch of this, a dash of that.&rdquo; There was a woman — 
              it was always a woman — standing in a kitchen that smelled like 
              <span className="origin-highlight"> mustard oil and possibility</span>. 
              She knew when the onions were ready by the sound. She knew when the 
              spices were done by the smell. She cooked the way her mother taught her, 
              who cooked the way <em>her</em> mother taught her.
            </p>
            <p>
              That chain is breaking. Not because anyone wants it to, but because 
              geography happened. Because ambition happened. Because a generation 
              of Bengalis left home and took their appetites with them — but not the 
              knowledge. They remember the taste of their mother&rsquo;s kosha mangsho, 
              but they can&rsquo;t replicate it. They remember Sunday mornings where the 
              whole house smelled like a slow-cooked promise, but they don&rsquo;t know 
              which spices made that promise.
            </p>
            <p>
              <span className="origin-highlight">Banglar Swad</span> was born from 
              that gap — the space between memory and ability. We&rsquo;re not here to 
              teach you a recipe. We&rsquo;re here to give you the closest thing to 
              standing in that kitchen again, watching someone who never measured 
              anything create something that measured everything.
            </p>
            <p>
              We source whole spices from Bengal — from Radhuni to Kalo Jeere to 
              the exact Panch Phoron blend your grandmother would have used. We grind 
              them fresh. We blend them for specific dishes. And we tell you exactly 
              how to use them, because the recipe was never written down — until now.
            </p>
          </div>
        </div>
        {/* Decorative botanical */}
        <div className="botanical-branch" style={{ top: '15%', right: '8%', width: '60px', color: '#5C6B3A' }}>
          <BotanicalLeaf />
        </div>
      </section>

      {/* ===== Section 2: What We Believe ===== */}
      <section className="story-beliefs">
        <div className="beliefs-inner story-reveal">
          <span className="beliefs-bengali">আমরা কী বিশ্বাস করি</span>
          <h2 className="beliefs-heading">What We Believe</h2>
          <div className="beliefs-grid">
            {/* What We Are */}
            <div>
              <h3 className="beliefs-column-title what-we-are">What We Are</h3>
              {[
                'A bridge between memory and the modern kitchen.',
                'The closest thing to your grandmother\'s spice shelf — curated and explained.',
                'A brand that treats Bengali food as a living, evolving tradition.',
                'Products designed for specific Bengali dishes, not generic "Indian cooking."',
                'A voice that speaks in the language of home — warm, knowing, never preachy.',
                'A community of people who believe food is identity.',
              ].map((text, i) => (
                <div className="belief-card positive" key={i}>
                  <span className="belief-icon">✦</span>
                  {text}
                </div>
              ))}
            </div>
            {/* What We Are Not */}
            <div>
              <h3 className="beliefs-column-title what-we-are-not">What We Are Not</h3>
              {[
                'A masala brand. We don\'t compete with MDH or Everest.',
                'A fusion brand. We\'re not "putting a modern twist" on anything.',
                'A convenience brand. We\'re not selling shortcuts — we\'re selling confidence.',
                'A nostalgia brand. We don\'t romanticize the past — we make it accessible.',
                'A recipe app. We don\'t just tell you what to cook — we tell you why it works.',
                'A brand that speaks down to its audience. Ever.',
              ].map((text, i) => (
                <div className="belief-card negative" key={i}>
                  <span className="belief-icon">✧</span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Decorative */}
        <div className="botanical-branch" style={{ bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '80px', color: '#8B4E2F' }}>
          <BotanicalSprig />
        </div>
      </section>

      {/* ===== Section 3: Who We Cook For ===== */}
      <section className="story-persona">
        <div className="persona-inner story-reveal">
          <span className="persona-bengali">আমরা কাদের জন্য রান্না করি</span>
          <h2 className="persona-heading">Who We Cook For</h2>

          <div className="persona-narrative">
            <p>
              We call her <em>The Returning Bengali</em>. She didn&rsquo;t leave home 
              because she wanted to forget it — she left because the world was 
              bigger than her postcode. She carried with her the taste of mustard 
              oil, the sound of a pressure cooker on a Sunday morning, the memory 
              of a kitchen where someone always knew what to do next.
            </p>
            <p>
              Now she stands in her own kitchen — in Bangalore, in Pune, in Dubai, 
              in New Jersey — and she wants to make the food she grew up eating. 
              Not fusion. Not a &ldquo;quick version.&rdquo; The real thing. But nobody 
              ever taught her. Nobody wrote it down. And the YouTube videos all 
              seem wrong — too much of this, not enough of that, never quite the 
              same smell.
            </p>
            <p>
              She doesn&rsquo;t want to be taught like a student. She wants to be 
              spoken to like a daughter who called home to ask &ldquo;Ma, how do you 
              make the mangsho?&rdquo; — and Ma, instead of giving a recipe, tells 
              her a story.
            </p>
          </div>

          <div className="persona-pullquote story-reveal">
            <p>
              She is 28. She studied in Delhi, works in Bangalore. She has tried 
              making Kosha Mangsho twice — once it was too dry, once it was too 
              watery.
            </p>
          </div>

          <div className="persona-narrative">
            <p>
              She doesn&rsquo;t need a cooking class. She needs the right spices, 
              the right proportions, and the right voice telling her 
              &ldquo;this is how your mother would have done it.&rdquo; That&rsquo;s 
              what Banglar Swad is. A bridge. Not a lesson — a homecoming.
            </p>
          </div>
        </div>
        <div className="botanical-branch" style={{ top: '40px', left: '5%', width: '50px', color: '#5C6B3A', transform: 'rotate(-20deg)' }}>
          <BotanicalLeaf />
        </div>
      </section>

      {/* ===== Section 4: The Mission ===== */}
      <section className="story-mission">
        <div className="mission-inner story-reveal">
          <span className="mission-bengali">আমাদের লক্ষ্য</span>
          <h2 className="mission-heading">The Mission</h2>

          <div className="mission-text">
            <p>
              Banglar Swad starts with spices because spices get into kitchens, 
              and kitchens are where culture lives. A culture doesn&rsquo;t survive in 
              textbooks or museums — it survives when someone grinds fresh Panch 
              Phoron on a Wednesday evening because they decided tonight is the 
              night for Shukto.
            </p>
            <p>
              We&rsquo;re building a brand that understands this. That knows the 
              difference between a product and a tradition. That knows when you 
              buy Kosha Mangsho Masala, you&rsquo;re not buying powder — you&rsquo;re 
              buying the belief that you can recreate something sacred.
            </p>
            <p>
              Our long-term vision is simple: become the default name in every 
              Bengali kitchen that wants to cook real Bengali food. Not through 
              advertising, but through trust. Not through volume, but through 
              quality. Every spice we sell should make someone say: 
              &ldquo;This is it. This is what it&rsquo;s supposed to taste like.&rdquo;
            </p>
          </div>

          <div className="mission-cinematic" ref={cinematicRef}>
            <p className="mission-cinematic-line">
              The spices are the beginning.
            </p>
            <p className="mission-cinematic-line">
              The mission is preservation.
            </p>
            <p className="mission-cinematic-line">
              The legacy is a generation that never forgot the taste.
            </p>
            <hr className="mission-cinematic-divider" />
            <p className="mission-closing">
              বাংলার স্বাদ — ঘরে ফেরার স্বাদ
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
