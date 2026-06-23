import { useState, useEffect, useCallback } from 'react';
import './ProductDetail.css';

const PRODUCTS = {
  'panch-phoron': {
    id: 'panch-phoron',
    name: 'Panch Phoron',
    bengaliName: 'পাঁচ ফোড়ন',
    weight: '100g',
    price: 249,
    image: '/images/panch-phoron.png',
    story: 'Before the onions. Before the ginger-garlic. Before anything — Panch Phoron goes into the oil. This is how Bengali food begins. It has always been how Bengali food begins.',
    description: 'The signature five-spice blend of Bengali cuisine. Five whole seeds in equal measure, tempered in hot oil to release a fragrance that is unmistakably home.',
    longDescription: 'Panch Phoron is the starting point of Bengali cooking. Unlike other Indian spice blends, we do not roast or grind it. We drop it whole into smoking mustard oil. The seeds sputter and crackle, transferring their essential oils directly into the fat. This tempered oil then carries the complex profile of cumin, fennel, fenugreek, nigella, and mustard throughout the entire dish. It is the secret behind the earthy sweetness of Shukto and the soul of red lentils.',
    ingredients: [
      { name: 'Cumin (Jeera)', role: 'Builds the warm, earthy base note.' },
      { name: 'Fennel (Mouri)', role: 'Adds a sweet, liquorice-like aroma.' },
      { name: 'Fenugreek (Methi)', role: 'Brings a pleasant, subtle bitterness.' },
      { name: 'Nigella (Kalo Jeere)', role: 'Provides a sharp, peppery crunch.' },
      { name: 'Mustard (Shorshe)', role: 'Crackles in hot oil to finish the sentence.' }
    ],
    usage: 'Heat mustard oil in a heavy kadai until it smokes slightly. Turn down the heat and add 1 tsp of Panch Phoron. Once the seeds crackle (about 5-10 seconds), add your vegetables or boiled lentils. Let the oil work its magic.',
    trustBadges: ['100% Whole Seeds', 'No Added Fillers', 'Sourced from Bengal Plains'],
    recipeTitle: 'Authentic Shukto (Traditional Vegetable Stew)'
  },
  'kosha-mangsho-masala': {
    id: 'kosha-mangsho-masala',
    name: 'Kosha Mangsho Masala',
    bengaliName: 'কষা মাংসের মশলা',
    weight: '50g',
    price: 299,
    image: '/images/kosha-mangsho-masala.png',
    backImage: '/images/kosha-mangsho-masala-back.png',
    story: 'Some dishes are not cooked. They are remembered.',
    description: 'A deeply aromatic blend crafted for the legendary Bengali slow-cooked mutton curry. Roasting and grinding spices to release deep mahogany warmth.',
    longDescription: 'Kosha Mangsho is a Sunday ritual. It cannot be rushed. Our masala is formulated for the long, patient process of "koshano"—cooking meat slowly on low heat until the spices lose their raw edge, caramelized onions break down into a mahogany paste, and the oil separates completely. We roast each spice individually before grinding to ensure they release their flavors steadily over hours on the stove, preventing the curry from becoming dry or watery.',
    ingredients: [
      { name: 'Tejpatta (Bay Leaf)', role: 'Adds an herbal, balsamic sweetness.' },
      { name: 'Dalchini (Cinnamon)', role: 'Provides the sweet, woody backbone.' },
      { name: 'Elach (Green Cardamom)', role: 'Lifts the heavy meat with fresh citrusy top notes.' },
      { name: 'Labanga (Cloves)', role: 'Brings intense heat and numbness.' },
      { name: 'Jaiphal (Nutmeg)', role: 'Adds the final warm, buttery mystery note.' }
    ],
    usage: 'Use 2-3 tablespoons for 1kg of mutton or chicken. Marinate the meat with yogurt, mustard oil, ginger-garlic paste, and half the masala. Sauté onions low and slow. Add marinated meat and the rest of the masala, cook covered on low flame, stirring occasionally until oil separates.',
    trustBadges: ['Slow-Roasted Spices', 'Coarsely Ground', 'No Artificial Colors'],
    recipeTitle: 'Sunday Mutton Kosha (Mahogany Slow-Cook)'
  },
  'bengali-garam-masala': {
    id: 'bengali-garam-masala',
    name: 'Bengali Garam Masala',
    bengaliName: 'বাংলার গরম মশলা',
    weight: '50g',
    price: 279,
    image: '/images/garam-masala.png',
    story: 'In Bengali cooking, the garam masala comes last. Not because it’s an afterthought. Because the best things always come at the end.',
    description: 'Unlike its North Indian cousin, Bengali garam masala is sweet and cardamom-heavy. Added at the very end of cooking to seal the aroma.',
    longDescription: 'Bengali Garam Masala is a finishing note, a final punctuation mark. Where North Indian blends build heat during the cooking process, our blend is designed to be sprinkled at the very end. We use a high ratio of green cardamom and sweet cinnamon to create an aroma that rises with the steam the moment you uncover the pot. It is the finishing touch for rezalas, light fish curries, and vegetarian stews.',
    ingredients: [
      { name: 'Elach (Green Cardamom)', role: 'Dominant spice, sweet, fragrant, and citrusy.' },
      { name: 'Dalchini (Cinnamon)', role: 'Brings sweet, warm woodiness.' },
      { name: 'Labanga (Cloves)', role: 'Adds a sharp, warm background punch.' }
    ],
    usage: 'Cook your dish until fully done. Just before taking it off the flame, sprinkle half a teaspoon of Garam Masala and a spoonful of ghee. Cover immediately with a tight lid. Let it stand covered for 5 minutes before serving.',
    trustBadges: ['Cardamom Rich', 'Ground Fresh', 'Cardamom, Cinnamon & Clove Only'],
    recipeTitle: 'Dimer Rezala or Niramish Alur Dom'
  },
  'starter-kit': {
    id: 'starter-kit',
    name: 'Bengali Kitchen Starter Kit',
    bengaliName: 'বাংলার রান্নাঘর',
    weight: 'Gift Box',
    price: 749,
    image: '/images/starter-kit.png',
    story: 'Everything you need to make your kitchen smell like home.',
    description: 'Our three foundational blends in a handcrafted kraft paper gift box. Includes a handwritten card explaining each spice, its purpose, and recipes.',
    longDescription: 'The perfect care package for the Returning Bengali, the diaspora cousin, or the curious home cook. This starter kit brings together our three core products in a beautiful, tactile kraft gift box. Inside, a handwritten-style guide walks you through the physics of the Panch Phoron crackle, the slow math of Kosha Mangsho, and the sweet exhale of our Garam Masala. It is more than spices—it is confidence in a box.',
    ingredients: [
      { name: 'Panch Phoron (100g)', role: 'For daily tempering, dals, and vegetable dishes.' },
      { name: 'Kosha Mangsho Masala (50g)', role: 'For Sunday mutton, chicken, or rich vegetarian curries.' },
      { name: 'Bengali Garam Masala (50g)', role: 'To finish every dish with Dida’s signature sweetness.' }
    ],
    usage: 'Follow the individual product guides. Use the included handwritten companion card to map each spice to its traditional Bengali dish.',
    trustBadges: ['Complete Starter Set', 'Kraft Gift Packaging', 'Handwritten Companion Card Included'],
    recipeTitle: 'The Sunday Feast Complete Menu'
  }
};

import { useMemo } from 'react';

export default function ProductDetail({ productId, onAddToCart, onNavigate, onScanClick, products = [] }) {
  const [qty, setQty] = useState(1);
  const [activeView, setActiveView] = useState('front');
  const [activeImage, setActiveImage] = useState('');
  
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveView('front');
  }, [productId]);

  const productFromProp = products.find(p => p.id === productId);

  const product = useMemo(() => {
    if (productFromProp) {
      const normalizedIngredients = Array.isArray(productFromProp.ingredients)
        ? productFromProp.ingredients.map(ing => typeof ing === 'string' ? { name: ing, role: 'Fresh spice component.' } : ing)
        : [];
      return {
        ...productFromProp,
        longDescription: productFromProp.description || productFromProp.story,
        ingredients: normalizedIngredients,
        trustBadges: productFromProp.trustBadges || ['100% Pure', 'No Added Fillers', 'Sourced from Bengal Plains'],
        recipeTitle: productFromProp.recipeTitle || 'Dida’s Traditional Style Curry',
        usage: productFromProp.usage || 'Sauté onions. Add vegetables/meat and ground masala, cook low and slow.'
      };
    }
    return PRODUCTS[productId] || PRODUCTS['panch-phoron'];
  }, [productId, productFromProp]);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  const handleDecrease = () => setQty(prev => Math.max(1, prev - 1));
  const handleIncrease = () => setQty(prev => Math.min(10, prev + 1));
  
  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart({
        id: product.id,
        name: product.name,
        bengaliName: product.bengaliName,
        price: product.price,
        image: product.image,
        quantity: qty
      });
    }
  };

  return (
    <article className="product-detail">
      <div className="product-detail__inner">
        
        {/* Back Link */}
        <button className="product-detail__back" onClick={() => onNavigate('shop')}>
          ← Back to Spices
        </button>
 
        {/* Main Grid */}
        <div className="product-detail__grid">
          
          {/* Left Column: Image Panel (Sticky) */}
          <div className="product-detail__image-panel">
            <div className="product-detail__image-wrap">
              <img src={activeImage || product.image} alt={product.name} />
            </div>

            {product.backImage && (
              <div className="product-detail__image-views">
                <button 
                  className={`product-detail__view-tab ${activeView === 'front' ? 'active' : ''}`}
                  onClick={() => { setActiveView('front'); setActiveImage(product.image); }}
                  type="button"
                >
                  Front Pack
                </button>
                <button 
                  className={`product-detail__view-tab ${activeView === 'back' ? 'active' : ''}`}
                  onClick={() => { setActiveView('back'); setActiveImage(product.backImage); }}
                  type="button"
                >
                  Back Pack (Label)
                </button>
              </div>
            )}

            {/* Simulated QR Trigger Pouch Card */}
            <div className="product-detail__qr-card">
              <span className="product-detail__qr-decor">🌿</span>
              <div className="product-detail__qr-info">
                <h4>Uncover Dida's Secret Cooking Guide</h4>
                <p>Every pouch comes with a QR code on the label. Scan it to unlock the companion audio and detailed recipe steps.</p>
              </div>
              <button 
                className="product-detail__qr-btn"
                onClick={() => onScanClick?.(product.id)}
              >
                📷 Simulate QR Scan
              </button>
            </div>
          </div>

          {/* Right Column: Information Panel */}
          <div className="product-detail__info-panel">
            
            {/* Title / Headers */}
            <header className="product-detail__header">
              <span className="product-detail__bn-tag">{product.bengaliName}</span>
              <h1 className="product-detail__title">{product.name}</h1>
              <span className="product-detail__weight-badge">{product.weight}</span>
              <span className="product-detail__price">₹{product.price}</span>
            </header>

            {/* Label Story Card */}
            <div className="product-detail__story-card">
              <p className="product-detail__story-text">"{product.story}"</p>
            </div>

            {/* Add to Cart Actions */}
            <div className="product-detail__purchase-section">
              <div className="product-detail__qty">
                <button className="product-detail__qty-btn" onClick={handleDecrease}>−</button>
                <span className="product-detail__qty-val">{qty}</span>
                <button className="product-detail__qty-btn" onClick={handleIncrease}>+</button>
              </div>
              <button className="product-detail__add-btn" onClick={handleAdd}>
                Add to Cart — ₹{product.price * qty}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="product-detail__badges">
              {product.trustBadges.map((badge, i) => (
                <span key={i} className="product-detail__badge-item">
                  <span className="product-detail__badge-bullet">✦</span> {badge}
                </span>
              ))}
            </div>

            {/* Deep Description */}
            <section className="product-detail__desc-section">
              <h2>The Story Behind the Blend</h2>
              <p className="product-detail__desc-intro">{product.description}</p>
              <p className="product-detail__desc-body">{product.longDescription}</p>
            </section>

            {/* Ingredients Section */}
            <section className="product-detail__ingredients">
              <h2>What Goes Inside</h2>
              <ul className="product-detail__ingredients-list">
                {product.ingredients.map((ing, i) => (
                  <li key={i} className="product-detail__ing-item">
                    <span className="product-detail__ing-name">{ing.name}</span>
                    <span className="product-detail__ing-role">{ing.role}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* How to Cook Section */}
            <section className="product-detail__cook-guide">
              <h2>How to Cook it Right</h2>
              <p className="product-detail__cook-body">{product.usage}</p>
              <div className="product-detail__quote-tip">
                <span className="quote-tip__decor">Ma Says:</span>
                <p>"{product.id === 'kosha-mangsho-masala' ? 'If you have to ask whether the oil has separated, it hasn’t. Cook it slow.' : 'Never rush the spices. Let them caramelize. The oil remembers.'}"</p>
              </div>
            </section>

          </div>

        </div>

      </div>
    </article>
  );
}
