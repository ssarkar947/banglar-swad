import { useEffect, useRef } from 'react';
import './CartDrawer.css';

const FREE_SHIPPING_THRESHOLD = 599;

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) {
  const drawerRef = useRef(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Trap focus inside drawer
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return;
    const focusable = drawerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();
  }, [isOpen]);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingProgress = Math.min(
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
    100
  );
  const shippingRemaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  return (
    <>
      {/* Dark overlay backdrop */}
      <div
        className={`cart-overlay${isOpen ? ' cart-overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        ref={drawerRef}
        className={`cart-drawer${isOpen ? ' cart-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* ── Header ── */}
        <header className="cart-drawer__header">
          <div className="cart-drawer__title-group">
            <h2 className="cart-drawer__title">
              Your Cart
              {itemCount > 0 && (
                <span className="cart-drawer__count">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </h2>
            <span className="cart-drawer__title-bn">আপনার ঝুড়ি</span>
          </div>
          <button
            className="cart-drawer__close"
            onClick={onClose}
            aria-label="Close cart"
          >
            ✕
          </button>
        </header>

        {/* ── Body ── */}
        <div className="cart-drawer__body">
          {cartItems.length === 0 ? (
            /* ── Empty State ── */
            <div className="cart-empty">
              <div className="cart-empty__leaf">
                <span className="cart-empty__leaf-vein" />
                <span className="cart-empty__leaf-vein" />
                <span className="cart-empty__leaf-vein" />
                <span className="cart-empty__leaf-vein" />
                <span className="cart-empty__leaf-vein" />
              </div>
              <p className="cart-empty__text">Your cart is empty</p>
              <p className="cart-empty__subtext">
                The kitchen awaits.
              </p>
              <button className="cart-empty__btn" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            /* ── Cart Items ── */
            <ul className="cart-items">
              {cartItems.map((item, idx) => (
                <li
                  className="cart-item"
                  key={item.id}
                  style={{ animationDelay: `${idx * 0.06}s` }}
                >
                  {/* Thumbnail */}
                  <div className="cart-item__thumb">
                    <img src={item.image} alt={item.name} />
                  </div>

                  {/* Details */}
                  <div className="cart-item__details">
                    <p className="cart-item__name">
                      {item.name}
                      {item.nameBn && (
                        <span className="cart-item__name-bn">
                          {item.nameBn}
                        </span>
                      )}
                    </p>
                    <span className="cart-item__price">₹{item.price}</span>

                    <div className="cart-item__actions">
                      {/* Quantity controls */}
                      <div className="cart-item__qty">
                        <button
                          className="cart-item__qty-btn"
                          onClick={() =>
                            onUpdateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="cart-item__qty-val">
                          {item.quantity}
                        </span>
                        <button
                          className="cart-item__qty-btn"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        className="cart-item__remove"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="cart-item__total">
                    <span className="cart-item__line-total">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Footer (only when items present) ── */}
        {cartItems.length > 0 && (
          <footer className="cart-drawer__footer">
            {/* Shipping progress */}
            <div className="cart-shipping">
              <p className="cart-shipping__text">
                {shippingRemaining > 0 ? (
                  <>
                    Add <strong>₹{shippingRemaining}</strong> more for{' '}
                    <strong>free shipping!</strong>
                  </>
                ) : (
                  <span className="cart-shipping__text--success">
                    🎉 You've unlocked free shipping!
                  </span>
                )}
              </p>
              <div className="cart-shipping__bar">
                <div
                  className="cart-shipping__bar-fill"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            {/* Subtotal */}
            <div className="cart-subtotal">
              <span className="cart-subtotal__label">Subtotal</span>
              <span className="cart-subtotal__value">₹{subtotal}</span>
            </div>

            {/* Checkout CTA */}
            <button className="cart-checkout-btn" onClick={onCheckout}>
              Proceed to Checkout
            </button>

            {/* Footer note */}
            <p className="cart-drawer__note">Cook it low, cook it slow.</p>
          </footer>
        )}
      </aside>
    </>
  );
}
