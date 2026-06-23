import { useState, useEffect, useRef, useCallback } from 'react';
import './QRScanner.css';

const UNLOCKED_RECIPES = {
  'panch-phoron': {
    title: 'Dida’s Panch Phoron Dal & Shukto',
    subtitle: 'পাঁচ ফোড়ন ডাল',
    tag: 'Tadka / Tempering',
    soundName: 'Sputtering Seeds in Mustard Oil',
    frequencies: [120, 300, 800], // For web audio synthesis
    story: 'Before the onions, before the ginger-garlic—panch phoron goes into the oil. If the oil doesn’t hiss and crackle, you started too early. Let the seeds sing first.',
    steps: [
      'Heat 2 tablespoons of pure mustard oil in a heavy kadai until it just starts to smoke, then turn off the heat for 30 seconds (to avoid burning).',
      'Turn the flame back to medium and drop 1 teaspoon of whole Panch Phoron seeds. Listen for the crackle.',
      'As soon as they crackle and release their aroma (about 5-10 seconds), add your vegetables (or boiled yellow lentils).',
      'Cook low, cook slow. Do not grind these seeds; their whole texture in every bite is the soul of the dish.'
    ],
    tip: 'Janle Bhalo Hoy: Cumin builds the base, fenugreek brings a pleasant bitterness, fennel sweetens the oil, nigella adds sharp earthiness, and black mustard seeds crackle to finish the sentence.'
  },
  'kosha-mangsho-masala': {
    title: 'Sunday Kosha Mangsho Companion',
    subtitle: 'কষা মাংসের রন্ধন প্রণালী',
    tag: 'Slow-Cook / Bhuna',
    soundName: 'Sunday Gravy Simmering',
    frequencies: [90, 150, 220],
    story: 'Kosha Mangsho is not a recipe. It’s a Sunday. It is the slow math of onions going from gold to copper, then copper to deep mahogany. Patience is your primary ingredient.',
    steps: [
      'Marinate 1kg mutton in thick yogurt, mustard oil, ginger-garlic paste, and half a pack of Banglar Swad Kosha Mangsho Masala for at least 4 hours.',
      'Sauté thin onion slices in mustard oil on a low flame. Do not rush. Let them caramelize gently for 35-40 minutes.',
      'Add the mutton and the remaining masala. This is where the "Kosha" starts. Cook, stirring constantly, until the meat darkens and the oil separates.',
      'Cover with a heavy lid, lower the flame to a whisper, and let it cook in its own juices. The gravy is ready when it tells you it’s ready.'
    ],
    tip: 'Ma Bolechen: If you have to ask whether the oil has separated, it hasn’t.'
  },
  'bengali-garam-masala': {
    title: 'The Ending Note: Bengali Garam Masala',
    subtitle: 'বাংলার গরম মশলা',
    tag: 'Finishing Touch',
    soundName: 'The Final Steam Release',
    frequencies: [250, 450, 600],
    story: 'In Bengali cooking, the garam masala comes last. Heavier on green cardamom, cinnamon, and cloves, it is the quiet exhale of a dish that is finally complete.',
    steps: [
      'Cook your curry or mutton stew until fully done.',
      'Just before turning off the heat, sprinkle half a teaspoon of Banglar Swad Bengali Garam Masala.',
      'Add a splash of pure ghee (if Dida is looking, make it a big spoonful).',
      'Cover the pot immediately with a tight lid. Do not stir. Let the steam trap the sweet aroma of cardamom and clove for at least 5 minutes before serving.'
    ],
    tip: 'Bengali garam masala finishes the sentence that North Indian garam masala starts. Always add it at the very end.'
  },
  'starter-kit': {
    title: 'The Bengali Kitchen Companion',
    subtitle: 'বাংলার রান্নাঘরের স্বাদ',
    tag: 'Starter Guide',
    soundName: 'Kitchen Morning Sounds',
    frequencies: [100, 200, 400],
    story: 'Everything you need to make your kitchen smell like home. These three blends are the foundation stones. Once you master the crackle, the slow cook, and the finish, you have rescued the recipe.',
    steps: [
      'Panch Phoron: Use it for daily dals, roasted vegetables, and sour chutneys.',
      'Kosha Mangsho Masala: Use it for Sunday chicken or mutton curries.',
      'Bengali Garam Masala: Use it to finish any Bengali dish, from vegetarian stews to meat curries.'
    ],
    tip: 'Start with the Panch Phoron to build confidence, move to the Sunday meat slow-cook, and finish with the garam masala flourish.'
  }
};

export default function QRScanner({ isOpen, onClose, initialProductId = 'panch-phoron' }) {
  const [activeProduct, setActiveProduct] = useState(initialProductId);
  const [scanState, setScanState] = useState('idle'); // idle | scanning | success
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const audioContextRef = useRef(null);
  const audioNodesRef = useRef([]);

  useEffect(() => {
    if (initialProductId) {
      setActiveProduct(initialProductId);
    }
  }, [initialProductId]);

  // Lock body scroll when scanner is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setScanState('idle');
      setIsPlayingSound(false);
    } else {
      document.body.style.overflow = '';
      stopSoundscape();
    }
    return () => {
      document.body.style.overflow = '';
      stopSoundscape();
    };
  }, [isOpen]);

  const handleSimulateScan = () => {
    setScanState('scanning');
    
    // Play a synthetic scan sound (short beep)
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch beep
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.log('Audio Context not allowed yet', e);
    }

    setTimeout(() => {
      setScanState('success');
    }, 2200);
  };

  const startSoundscape = () => {
    if (isPlayingSound) {
      stopSoundscape();
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const recipe = UNLOCKED_RECIPES[activeProduct] || UNLOCKED_RECIPES['panch-phoron'];
      const freqs = recipe.frequencies;

      // Synthesize a rustic cooking sound (crackle or low simmer bubble)
      // We will create a few white noise bandpass filters and low frequency oscillators
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter to simulate frying/crackle or simmering bubbling
      const filter = ctx.createBiquadFilter();
      filter.type = activeProduct === 'panch-phoron' ? 'bandpass' : 'lowpass';
      filter.frequency.setValueAtTime(activeProduct === 'panch-phoron' ? 1200 : 250, ctx.currentTime);
      filter.Q.setValueAtTime(5, ctx.currentTime);

      // Amplitude modulation for bubbles / crackles
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);

      // Create a low frequency oscillator to modulate gain (bubbles/sputter)
      const lfo = ctx.createOscillator();
      lfo.type = 'triangle';
      lfo.frequency.setValueAtTime(activeProduct === 'panch-phoron' ? 12 : 3, ctx.currentTime);
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.04, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);
      
      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Add a low drone for the gas flame warmth
      const droneOsc = ctx.createOscillator();
      droneOsc.type = 'sine';
      droneOsc.frequency.setValueAtTime(freqs[0], ctx.currentTime);
      
      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0.015, ctx.currentTime);
      droneOsc.connect(droneGain);
      droneGain.connect(ctx.destination);

      // Start all
      whiteNoise.start(0);
      lfo.start(0);
      droneOsc.start(0);

      audioNodesRef.current = [whiteNoise, lfo, droneOsc, gainNode, lfoGain, droneGain];
      setIsPlayingSound(true);
    } catch (e) {
      console.error('Could not start soundscape synthesis', e);
    }
  };

  const stopSoundscape = () => {
    if (audioNodesRef.current) {
      audioNodesRef.current.forEach(node => {
        try {
          node.stop();
        } catch (e) {}
      });
      audioNodesRef.current = [];
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
    setIsPlayingSound(false);
  };

  if (!isOpen) return null;

  const currentRecipe = UNLOCKED_RECIPES[activeProduct] || UNLOCKED_RECIPES['panch-phoron'];

  return (
    <div className="qr-scanner-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="qr-scanner-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="qr-scanner-close" onClick={onClose} aria-label="Close scanner">✕</button>

        {/* Dynamic Inner Panel */}
        {scanState !== 'success' ? (
          <div className="qr-scanner-view">
            <div className="qr-scanner-header">
              <span className="qr-scanner-bn">প্যাকেজ স্ক্যানার</span>
              <h2>Simulate Pack Scan</h2>
              <p>Every Banglar Swad pouch has a custom QR code on the back. Point your camera to unlock recipes, sounds, and stories.</p>
            </div>

            {/* Select Pouch to Scan */}
            <div className="qr-scanner-selector">
              <label htmlFor="pouch-select">Choose pouch to align with lens:</label>
              <select 
                id="pouch-select"
                value={activeProduct}
                onChange={(e) => {
                  setActiveProduct(e.target.value);
                  setScanState('idle');
                  stopSoundscape();
                }}
              >
                <option value="panch-phoron">Panch Phoron (পাঁচ ফোড়ন)</option>
                <option value="kosha-mangsho-masala">Kosha Mangsho Masala (কষা মাংসের মশলা)</option>
                <option value="bengali-garam-masala">Bengali Garam Masala (বাংলার গরম মশলা)</option>
                <option value="starter-kit">Kitchen Starter Kit (বাংলার রান্নাঘর)</option>
              </select>
            </div>

            {/* Viewfinder Mockup */}
            <div className="qr-viewfinder">
              <div className="qr-viewfinder__overlay">
                <div className="qr-viewfinder__corner qr-viewfinder__corner--tl" />
                <div className="qr-viewfinder__corner qr-viewfinder__corner--tr" />
                <div className="qr-viewfinder__corner qr-viewfinder__corner--bl" />
                <div className="qr-viewfinder__corner qr-viewfinder__corner--br" />
                
                {scanState === 'scanning' ? (
                  <>
                    <div className="qr-viewfinder__laser qr-viewfinder__laser--active" />
                    <div className="qr-viewfinder__status">ANALYZING SPECTRUM...</div>
                  </>
                ) : (
                  <>
                    <div className="qr-viewfinder__laser" />
                    <div className="qr-viewfinder__status">ALIGN BARCODE IN FRAME</div>
                  </>
                )}
              </div>
              
              {/* Inside the frame, a preview illustration based on selected pack */}
              <div className="qr-viewfinder__content">
                <span className="qr-viewfinder__decor-leaves">🌿</span>
                <span className="qr-viewfinder__decor-pack">✉️</span>
                <span className="qr-viewfinder__decor-text">{activeProduct.replace('-', ' ').toUpperCase()}</span>
              </div>
            </div>

            {/* Trigger Button */}
            <div className="qr-scanner-actions">
              <button 
                className="qr-scanner-btn" 
                onClick={handleSimulateScan}
                disabled={scanState === 'scanning'}
              >
                {scanState === 'scanning' ? 'Scanning Pouch...' : 'Simulate QR Scan'}
              </button>
            </div>
          </div>
        ) : (
          /* UNLOCKED RECIPE VIEW */
          <div className="qr-unlocked fadeIn">
            
            {/* Header / Verified Badge */}
            <div className="qr-unlocked__header">
              <div className="qr-unlocked__verified-badge">
                <span className="qr-unlocked__badge-check">✓</span>
                Authenticity Verified
              </div>
              <span className="qr-unlocked__bn-subtitle">{currentRecipe.subtitle}</span>
              <h2 className="qr-unlocked__title">{currentRecipe.title}</h2>
              <span className="qr-unlocked__tag">{currentRecipe.tag}</span>
            </div>

            {/* Postcard Body */}
            <div className="qr-unlocked__content">
              
              {/* Left Column: Story + Soundscape */}
              <div className="qr-unlocked__story-section">
                <p className="qr-unlocked__story-text">"{currentRecipe.story}"</p>
                
                {/* Interactive Soundscape Player */}
                <div className="qr-soundscape">
                  <div className="qr-soundscape__info">
                    <span className="qr-soundscape__label">AMBIENT BACKGROUND</span>
                    <span className="qr-soundscape__name">{currentRecipe.soundName}</span>
                  </div>
                  <button 
                    className={`qr-soundscape__play-btn${isPlayingSound ? ' qr-soundscape__play-btn--active' : ''}`}
                    onClick={startSoundscape}
                  >
                    {isPlayingSound ? (
                      <>
                        <span className="sound-wave">
                          <span className="sound-wave__bar" />
                          <span className="sound-wave__bar" />
                          <span className="sound-wave__bar" />
                        </span>
                        Stop Soundscape
                      </>
                    ) : (
                      '🔊 Play Soundscape'
                    )}
                  </button>
                  <p className="qr-soundscape__note">Synth-generated real-time audio representing the kitchen sounds.</p>
                </div>

                <div className="qr-unlocked__tip">
                  <strong>💡 Chef's Secret:</strong> {currentRecipe.tip}
                </div>
              </div>

              {/* Right Column: Recipe Steps */}
              <div className="qr-unlocked__steps-section">
                <h3>The Sunday Steps</h3>
                <ol className="qr-unlocked__steps-list">
                  {currentRecipe.steps.map((step, index) => (
                    <li key={index} className="qr-unlocked__step-item">
                      <span className="qr-unlocked__step-num">0{index + 1}</span>
                      <p className="qr-unlocked__step-content">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

            </div>

            {/* Back Button */}
            <div className="qr-unlocked__footer">
              <button className="qr-unlocked__back-btn" onClick={() => { setScanState('idle'); stopSoundscape(); }}>
                ← Scan Another Pack
              </button>
              <button className="qr-unlocked__close-btn" onClick={onClose}>
                Close Companion
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
