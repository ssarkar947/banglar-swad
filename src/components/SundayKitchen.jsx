import { useState, useEffect, useRef } from 'react';
import './SundayKitchen.css';

/* ============================================
   Scroll Reveal Hook
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
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    const targets = node.querySelectorAll('.sk-reveal');
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

/* ============================================
   Data
   ============================================ */
const MA_WISDOMS = [
  {
    text: 'Ma bolechen: onions need patience, not fire.',
    bengali: 'পেঁয়াজের ধৈর্য দরকার, আগুন নয়।',
  },
  {
    text: "Ma bolechen: the mutton is ready when it tells you it's ready.",
    bengali: 'মাংস যখন বলবে তখনই হবে।',
  },
  {
    text: "Ma bolechen: if you have to ask whether the oil has separated, it hasn't.",
    bengali: 'তেল ছাড়লে বুঝবে, জিজ্ঞেস করতে হবে না।',
  },
  {
    text: 'Ma bolechen: a little more ginger never hurt anyone.',
    bengali: 'একটু বেশি আদা কোনো ক্ষতি করে না।',
  },
  {
    text: "Ma bolechen: the rice knows when it's done. You just have to listen.",
    bengali: 'ভাত নিজেই বলে দেয় কখন হয়ে গেছে।',
  },
  {
    text: 'Ma bolechen: never rush the tadka. The oil remembers.',
    bengali: 'ফোড়ন তাড়াহুড়ো করো না। তেল মনে রাখে।',
  },
];

const SUNDAY_SCENES = [
  {
    type: 'immersive',
    text: "It's 11am. The onions have been on for 40 minutes. The whole house smells like a decision was made. This is what Sunday looks like.",
  },
  {
    type: 'scene',
    text: 'The mutton has been marinating since last night. The yogurt has done its work. Now comes the hard part: waiting.',
  },
  {
    type: 'scene',
    text: "The pressure cooker whistles. Three times. Ma says three is perfect. We don't argue with Ma.",
  },
];

const KNOWLEDGE_CARDS = [
  {
    title: 'Panch Phoron Is Not a Masala',
    text: "Panch Phoron — the five-spice blend of Nigella, Fennel, Fenugreek, Cumin, and Mustard seeds — is never ground. It's dropped whole into smoking hot mustard oil, where each seed blooms at its own pace, releasing a fragrance that no pre-ground powder can replicate. It's the opening note of almost every Bengali vegetable dish.",
    bengali: 'পাঁচফোড়ন গুঁড়ো নয়, এটা গোটা মশলা।',
  },
  {
    title: 'Bengali vs North Indian Garam Masala',
    text: "In most North Indian kitchens, garam masala goes in during cooking — it's a base note. Bengali garam masala is different. It's added at the very end, as a finishing spice, a whisper rather than a shout. The blend is lighter — more cardamom, more cinnamon, less heat. It's designed to perfume, not to overpower.",
    bengali: 'বাংলার গরম মশলা শেষে দেওয়া হয়, শুরুতে নয়।',
  },
  {
    title: 'Why Mustard Oil Is Non-Negotiable',
    text: "Bengali cooking without mustard oil is like conversation without warmth — technically possible, but missing the point entirely. The pungent, golden oil isn't just a cooking medium; it's a flavour foundation. From the sharp heat of raw mustard oil in a salad to the mellow warmth of tempered oil in a curry, it defines the palate of Bengal.",
    bengali: 'সর্ষের তেল ছাড়া বাংলা রান্না অসম্পূর্ণ।',
  },
  {
    title: 'The Art of Slow Cooking',
    text: "There's a reason your grandmother's food tasted different. She never rushed. Bengali cuisine is built on patience — onions caramelised until they dissolve, spices bloomed until the oil separates, meat simmered until it surrenders. The clock is an ingredient. Time is a flavour. Every shortcut costs you something you can taste.",
    bengali: 'ধীরে রান্না করো, ধীরে স্বাদ আসবে।',
  },
];

const TABS = [
  { id: 'ma', label: 'Ma Bolechen', bengali: 'মা বলেছেন' },
  { id: 'sunday', label: 'The Sunday Series', bengali: 'রবিবার' },
  { id: 'janle', label: 'Janle Bhalo Hoy', bengali: 'জানলে ভালো হয়' },
];

/* ============================================
   Sub-components
   ============================================ */
function MaBolechen() {
  return (
    <div className="sk-panel">
      <div className="ma-cards-grid">
        {MA_WISDOMS.map((wisdom, i) => (
          <div className="ma-card" key={i}>
            <span className="ma-card-prefix">মা বলেছেন</span>
            <p className="ma-card-text">{wisdom.text}</p>
            <span className="ma-card-accent">{wisdom.bengali}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TheSundaySeries() {
  return (
    <div className="sk-panel">
      <div className="sunday-series">
        {/* Steam + Kadai */}
        <div className="sunday-kadai-container">
          <div className="sunday-steam">
            <div className="steam-line" />
            <div className="steam-line" />
            <div className="steam-line" />
            <div className="steam-line" />
            <div className="steam-line" />
          </div>
          <div className="sunday-kadai">
            <div className="kadai-body">
              <div className="kadai-rim" />
              <div className="kadai-handle-left" />
              <div className="kadai-handle-right" />
            </div>
          </div>
          <span className="sunday-kadai-label">রবিবারের রান্নাঘর</span>
        </div>

        {SUNDAY_SCENES.map((scene, i) => (
          <div
            className={
              scene.type === 'immersive'
                ? 'sunday-immersive-card'
                : 'sunday-scene-card'
            }
            key={i}
          >
            <p className="sunday-card-text">{scene.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function JanleBhaloHoy() {
  return (
    <div className="sk-panel">
      <div className="knowledge-cards">
        {KNOWLEDGE_CARDS.map((card, i) => (
          <div className="knowledge-card" key={i}>
            <div className="knowledge-accent" />
            <div className="knowledge-body">
              <span className="knowledge-badge">Did You Know?</span>
              <h3 className="knowledge-title">{card.title}</h3>
              <p className="knowledge-text">{card.text}</p>
              <span className="knowledge-bengali-note">{card.bengali}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   Main Component
   ============================================ */
export default function SundayKitchen() {
  const [activeTab, setActiveTab] = useState('ma');
  const containerRef = useScrollReveal(0.1);

  const renderPanel = () => {
    switch (activeTab) {
      case 'ma':
        return <MaBolechen />;
      case 'sunday':
        return <TheSundaySeries />;
      case 'janle':
        return <JanleBhaloHoy />;
      default:
        return <MaBolechen />;
    }
  };

  return (
    <div className="sunday-kitchen" ref={containerRef}>
      {/* Header */}
      <header className="sk-header">
        <h1 className="sk-header-bengali">রবিবারের রান্নাঘর</h1>
        <p className="sk-header-english">The Sunday Kitchen</p>
        <p className="sk-header-tagline">
          Stories, wisdom, and the art of cooking slow.
        </p>
      </header>

      {/* Tab Navigation */}
      <nav className="sk-tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`sk-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
          >
            <span className="sk-tab-label">{tab.label}</span>
            <span className="sk-tab-bengali">{tab.bengali}</span>
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="sk-content" role="tabpanel" id={`panel-${activeTab}`}>
        {renderPanel()}
      </div>
    </div>
  );
}
