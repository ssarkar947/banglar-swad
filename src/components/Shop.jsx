import { useState, useEffect, useRef, useCallback } from 'react';
import ProductModal from './ProductModal';
import './Shop.css';

/* ── Product Data ───────────────────────────────── */

const PRODUCTS = [
  {
    id: 'panch-phoron',
    name: 'Panch Phoron',
    bengaliName: 'পাঁচ ফোড়ন',
    weight: '100g',
    price: 249,
    image: '/images/panch-phoron.png',
    story:
      'Before the onions. Before the ginger-garlic. Before anything — Panch Phoron goes into the oil. This is how Bengali food begins.',
    ingredients: [
      'Cumin seeds',
      'Fennel seeds',
      'Fenugreek seeds',
      'Nigella seeds',
      'Black mustard seeds',
    ],
    ingredientsNote: 'Equal parts, whole, unground',
    description:
      'The signature five-spice blend of Bengali cuisine. Five whole seeds in equal measure, tempered in hot oil to release a fragrance that is unmistakably home. Used in dals, vegetable dishes, pickles, and chutneys.',
  },
  {
    id: 'kosha-mangsho-masala',
    name: 'Kosha Mangsho Masala',
    bengaliName: 'কষা মাংসের মশলা',
    weight: '50g',
    price: 299,
    image: '/images/kosha-mangsho-masala.png',
    story: 'Some dishes are not cooked. They are remembered.',
    ingredients: [
      'Bay leaf',
      'Cinnamon',
      'Cardamom',
      'Clove',
      'Black pepper',
      'Cumin',
      'Coriander',
      'Red chilli',
      'Turmeric',
      'Nutmeg',
    ],
    ingredientsNote: 'Ground to a slow-cook blend',
    description:
      'A deeply aromatic blend crafted for the legendary Bengali slow-cooked mutton curry. Each spice is roasted and ground to coax out layers of warmth that build with every hour on the stove.',
  },
  {
    id: 'bengali-garam-masala',
    name: 'Bengali Garam Masala',
    bengaliName: 'বাংলার গরম মশলা',
    weight: '50g',
    price: 279,
    image: '/images/garam-masala.png',
    story:
      "In Bengali cooking, the garam masala comes last. Not because it's an afterthought. Because the best things always come at the end.",
    ingredients: [
      'Cinnamon',
      'Green cardamom',
      'Cloves',
      'Bay leaf',
      'Black pepper',
    ],
    ingredientsNote: 'Heavier on cinnamon, cardamom, and clove',
    description:
      'Unlike its North Indian cousin, Bengali garam masala is subtle and sweet. Just a pinch at the end of cooking lifts the whole dish — a quiet flourish that makes everything come alive.',
  },
  {
    id: 'starter-kit',
    name: 'Bengali Kitchen Starter Kit',
    bengaliName: 'বাংলার রান্নাঘর',
    weight: 'Gift Box',
    price: 749,
    image: '/images/starter-kit.png',
    story:
      'Everything you need to make your kitchen smell like home.',
    ingredients: [
      'Panch Phoron (100g)',
      'Kosha Mangsho Masala (50g)',
      'Bengali Garam Masala (50g)',
    ],
    ingredientsNote:
      'Contains one pack each of Panch Phoron, Kosha Mangsho Masala, and Bengali Garam Masala',
    description:
      'The complete Bengali spice collection in a handcrafted gift box. Perfect for someone starting their journey into Bengali cuisine, or for gifting a little piece of Bengal to someone you love.',
  },
];

/* ── Leaf decoration characters ─────────────────── */
const LEAF_SYMBOLS = ['🌿', '🍃', '🌱', '☘️'];

/* ── Shop Component ─────────────────────────────── */

export default function Shop({ onAddToCart, onProductClick, products = PRODUCTS }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cardRefs = useRef([]);

  /* Scroll-triggered fade-in via IntersectionObserver */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('product-card--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [products]);

  const handleCardClick = useCallback((product) => {
    if (onProductClick) {
      onProductClick(product.id);
    } else {
      setSelectedProduct(product);
    }
  }, [onProductClick]);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleAddToCart = useCallback(
    (product, quantity) => {
      if (onAddToCart) {
        onAddToCart({ ...product, quantity });
      }
    },
    [onAddToCart]
  );

  const handleCardAddToCart = useCallback(
    (e, product) => {
      e.stopPropagation();
      if (onAddToCart) {
        onAddToCart({ ...product, quantity: 1 });
      }
    },
    [onAddToCart]
  );

  return (
    <section className="shop">
      {/* ── Section Header ─────────────────────── */}
      <header className="shop__header">
        <p className="shop__header-bengali">আমাদের মশলা</p>
        <h2 className="shop__header-title">Our Spices</h2>
        <hr className="shop__header-rule" />
        <p className="shop__header-desc">
          Hand-ground in small batches from whole spices sourced across Bengal.
          No fillers. No colours. Just the way your grandmother made them.
        </p>
      </header>

      {/* ── Product Grid ───────────────────────── */}
      <div className="shop__grid">
        {products.map((product, index) => (
          <article
            key={product.id}
            className="product-card"
            ref={(el) => (cardRefs.current[index] = el)}
            onClick={() => handleCardClick(product)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick(product);
              }
            }}
            aria-label={`View details for ${product.name}`}
          >
            {/* Image */}
            <div className="product-card__image-wrap">
              <img
                className="product-card__image"
                src={product.image}
                alt={product.name}
                loading="lazy"
              />
            </div>

            {/* Body */}
            <div className="product-card__body">
              <span className="product-card__leaf" aria-hidden="true">
                {LEAF_SYMBOLS[index % LEAF_SYMBOLS.length]}
              </span>

              <h3 className="product-card__name">{product.name}</h3>
              <p className="product-card__bengali-name">
                {product.bengaliName}
              </p>

              <span className="product-card__weight">{product.weight}</span>

              <p className="product-card__story">{product.story}</p>

              {/* Footer */}
              <div className="product-card__footer">
                <span className="product-card__price">₹{product.price}</span>
                <button
                  className="product-card__add-btn"
                  onClick={(e) => handleCardAddToCart(e, product)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ── Product Modal ──────────────────────── */}
      <ProductModal
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />
    </section>
  );
}
