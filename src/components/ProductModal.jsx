import { useState, useEffect, useCallback } from 'react';
import './ProductModal.css';

/* ── ProductModal Component ─────────────────────── */

export default function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  /* Reset quantity when a new product is opened */
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen, product]);

  /* Close on Escape key */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    /* Lock body scroll */
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const decrementQty = useCallback(() => {
    setQuantity((q) => Math.max(1, q - 1));
  }, []);

  const incrementQty = useCallback(() => {
    setQuantity((q) => Math.min(10, q + 1));
  }, []);

  const handleAddToCart = useCallback(() => {
    if (onAddToCart && product) {
      onAddToCart(product, quantity);
      onClose();
    }
  }, [onAddToCart, product, quantity, onClose]);

  /* Don't render anything if no product */
  if (!product) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? 'modal-overlay--open' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Product details for ${product.name}`}
    >
      <div className="modal">
        {/* ── Close Button ──────────────────────── */}
        <button
          className="modal__close"
          onClick={onClose}
          aria-label="Close product details"
        >
          ✕
        </button>

        {/* ── Image Panel ──────────────────────── */}
        <div className="modal__image-panel">
          <img
            className="modal__image"
            src={product.image}
            alt={product.name}
          />
        </div>

        {/* ── Details Panel ────────────────────── */}
        <div className="modal__details">
          <span className="modal__leaf-accent" aria-hidden="true">
            🌿
          </span>

          <h2 className="modal__product-name">{product.name}</h2>
          <p className="modal__bengali-name">{product.bengaliName}</p>

          <div className="modal__meta-row">
            <span className="modal__weight-badge">{product.weight}</span>
            <span className="modal__price">₹{product.price}</span>
          </div>

          <hr className="modal__divider" />

          {/* Story */}
          <p className="modal__story">{product.story}</p>

          {/* Description */}
          {product.description && (
            <p
              style={{
                fontFamily: "'Lora', serif",
                fontSize: '0.9rem',
                color: '#1A1A1A',
                lineHeight: 1.7,
                marginBottom: '24px',
              }}
            >
              {product.description}
            </p>
          )}

          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <>
              <h3 className="modal__ingredients-heading">Ingredients</h3>
              <ul className="modal__ingredients-list">
                {product.ingredients.map((ingredient) => (
                  <li key={ingredient} className="modal__ingredient-tag">
                    {ingredient}
                  </li>
                ))}
              </ul>
              {product.ingredientsNote && (
                <p className="modal__ingredients-note">
                  {product.ingredientsNote}
                </p>
              )}
            </>
          )}

          {/* ── Actions ────────────────────────── */}
          <div className="modal__actions">
            <div className="modal__quantity-row">
              <span className="modal__quantity-label">Quantity</span>
              <div className="modal__quantity-controls">
                <button
                  className="modal__qty-btn"
                  onClick={decrementQty}
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="modal__qty-value">{quantity}</span>
                <button
                  className="modal__qty-btn"
                  onClick={incrementQty}
                  aria-label="Increase quantity"
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="modal__add-btn"
              onClick={handleAddToCart}
            >
              Add to Cart — ₹{product.price * quantity}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
