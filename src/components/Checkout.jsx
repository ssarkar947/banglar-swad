import { useState, useMemo } from 'react';
import './Checkout.css';

const FREE_SHIPPING_THRESHOLD = 599;

/* ── QR pattern seed (deterministic, brand-inspired) ── */
const QR_PATTERN = [
  1,1,1,0,1,1,1,0,
  1,0,1,1,0,1,0,1,
  1,1,1,0,1,1,1,0,
  0,0,0,2,2,0,0,0,
  1,0,1,2,2,1,0,1,
  1,1,1,0,0,1,1,1,
  1,0,1,1,0,1,0,1,
  0,1,0,0,1,0,1,0,
]; // 0 = light, 1 = dark, 2 = accent

function generateOrderId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'BS-';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

/* ===== Step Indicator ===== */
function StepIndicator({ currentStep }) {
  const steps = [
    { num: 1, label: 'Shipping' },
    { num: 2, label: 'Payment' },
    { num: 3, label: 'Confirmation' },
  ];

  return (
    <div className="checkout-steps">
      {steps.map((s, idx) => {
        const isActive = s.num === currentStep;
        const isDone = s.num < currentStep;
        return (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className={`checkout-step${isActive ? ' checkout-step--active' : ''}${isDone ? ' checkout-step--done' : ''}`}
            >
              <span className="checkout-step__circle">
                {isDone ? '✓' : s.num}
              </span>
              <span className="checkout-step__label">{s.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`checkout-steps__line${isDone ? ' checkout-steps__line--done' : ''}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ===== Order Summary Sidebar ===== */
function OrderSummary({ 
  cartItems, 
  couponInput, 
  setCouponInput, 
  onApplyCoupon, 
  appliedCoupon, 
  discountAmount = 0, 
  couponError = '', 
  total 
}) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 49;

  return (
    <aside className="checkout-summary">
      <h3 className="checkout-summary__title">Order Summary</h3>
      <ul className="checkout-summary__items">
        {cartItems.map((item) => (
          <li key={item.id} className="checkout-summary__item">
            <span className="checkout-summary__item-name">
              {item.name}
              <span className="checkout-summary__item-qty">
                {' '}
                × {item.quantity}
              </span>
            </span>
            <span className="checkout-summary__item-price">
              ₹{item.price * item.quantity}
            </span>
          </li>
        ))}
      </ul>
      <div className="checkout-summary__divider" />
      <div className="checkout-summary__row">
        <span className="checkout-summary__row-label">Subtotal</span>
        <span className="checkout-summary__row-value">₹{subtotal}</span>
      </div>

      {discountAmount > 0 && (
        <div className="checkout-summary__row" style={{ color: 'var(--spice-sienna)', fontWeight: '600' }}>
          <span className="checkout-summary__row-label">Discount ({appliedCoupon?.code})</span>
          <span className="checkout-summary__row-value">-₹{discountAmount}</span>
        </div>
      )}

      <div className="checkout-summary__row">
        <span className="checkout-summary__row-label">Shipping</span>
        <span className="checkout-summary__row-value">
          {shipping === 0 ? 'Free' : `₹${shipping}`}
        </span>
      </div>
      <div className="checkout-summary__total">
        <span className="checkout-summary__total-label">Total</span>
        <span className="checkout-summary__total-value">₹{total}</span>
      </div>

      {/* Coupon Field */}
      <div className="checkout-summary__coupon" style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px dashed rgba(92, 107, 58, 0.15)' }}>
        <label className="form-field__label" style={{ marginBottom: '8px', display: 'block', fontSize: '0.85rem' }}>
          Apply Promo / Coupon Code
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="form-field__input"
            style={{ textTransform: 'uppercase', padding: '8px 12px', fontSize: '0.9rem' }}
            placeholder="e.g. DIDA15"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
          />
          <button
            type="button"
            className="checkout-btn"
            style={{ padding: '8px 16px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
            onClick={onApplyCoupon}
          >
            Apply
          </button>
        </div>
        {couponError && (
          <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '6px', marginBottom: '0' }}>{couponError}</p>
        )}
        {appliedCoupon && (
          <p style={{ color: 'var(--forest-olive)', fontSize: '0.8rem', fontWeight: '600', marginTop: '6px', marginBottom: '0' }}>
            ✓ Code {appliedCoupon.code} applied!
          </p>
        )}
      </div>
    </aside>
  );
}

/* ===== Main Checkout Component ===== */
export default function Checkout({
  cartItems = [],
  onOrderComplete,
  onContinueShopping,
  coupons = [],
  paymentConfig = { upiEnabled: true, cardEnabled: true, codEnabled: true, upiId: 'banglarswad@okhdfc' }
}) {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(() => {
    if (paymentConfig.razorpayEnabled) return 'razorpay';
    if (paymentConfig.upiEnabled) return 'upi';
    if (paymentConfig.cardEnabled) return 'card';
    if (paymentConfig.codEnabled) return 'cod';
    return 'upi';
  });
  const [orderId] = useState(() => generateOrderId());

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') {
      return Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      return Math.min(subtotal, appliedCoupon.value);
    }
  }, [appliedCoupon, subtotal]);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = useCallback(() => {
    if (!couponInput.trim()) return;
    
    const found = coupons.find(c => c.code === couponInput.trim().toUpperCase());
    if (found) {
      if (found.active) {
        setAppliedCoupon(found);
        setCouponError('');
      } else {
        setCouponError('This coupon is no longer active.');
        setAppliedCoupon(null);
      }
    } else {
      setCouponError('Invalid coupon code.');
      setAppliedCoupon(null);
    }
  }, [couponInput, coupons]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    const orderData = {
      id: orderId,
      customerName: form.fullName,
      email: form.email,
      phone: form.phone,
      address: `${form.address1}${form.address2 ? ', ' + form.address2 : ''}, ${form.city}, ${form.state} - ${form.pincode}`,
      items: cartItems.map(it => ({
        id: it.id,
        name: it.name,
        quantity: it.quantity,
        price: it.price
      })),
      subtotal,
      discount: discountAmount,
      total,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onOrderComplete) onOrderComplete(orderData);
  };

  /* ── QR grid (memoized) ── */
  const qrCells = useMemo(
    () =>
      QR_PATTERN.map((val, i) => {
        let cls = 'payment-upi__qr-cell';
        if (val === 1) cls += ' payment-upi__qr-cell--dark';
        else if (val === 2) cls += ' payment-upi__qr-cell--accent';
        else cls += ' payment-upi__qr-cell--light';
        return <span key={i} className={cls} />;
      }),
    []
  );

  return (
    <div className="checkout">
      <div className="checkout__inner">
        {/* ── Step Indicator ── */}
        <StepIndicator currentStep={step} />

        {/* ══════════════════════════════════════
            STEP 1 — SHIPPING
           ══════════════════════════════════════ */}
        {step === 1 && (
          <div className="checkout-content" key="step-1">
            <div className="checkout-shipping">
              {/* Form */}
              <form className="checkout-form" onSubmit={handleShippingSubmit}>
                <h2 className="checkout-form__title">
                  Shipping Details
                </h2>
                <span className="checkout-form__title-bn">
                  শিপিং তথ্য
                </span>

                <div className="checkout-form__grid">
                  <div className="form-field">
                    <label className="form-field__label" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      className="form-field__input"
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="e.g. Rina Chatterjee"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-field__label" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="form-field__input"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="rina@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-field__label" htmlFor="phone">
                      Phone
                    </label>
                    <input
                      className="form-field__input"
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field form-field--full">
                    <label className="form-field__label" htmlFor="address1">
                      Address Line 1
                    </label>
                    <input
                      className="form-field__input"
                      id="address1"
                      name="address1"
                      type="text"
                      placeholder="House / Flat number, Street"
                      value={form.address1}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field form-field--full">
                    <label className="form-field__label" htmlFor="address2">
                      Address Line 2
                    </label>
                    <input
                      className="form-field__input"
                      id="address2"
                      name="address2"
                      type="text"
                      placeholder="Landmark, Area (optional)"
                      value={form.address2}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-field__label" htmlFor="city">
                      City
                    </label>
                    <input
                      className="form-field__input"
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Kolkata"
                      value={form.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-field__label" htmlFor="state">
                      State
                    </label>
                    <input
                      className="form-field__input"
                      id="state"
                      name="state"
                      type="text"
                      placeholder="West Bengal"
                      value={form.state}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-field__label" htmlFor="pincode">
                      Pincode
                    </label>
                    <input
                      className="form-field__input"
                      id="pincode"
                      name="pincode"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      placeholder="700001"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="checkout-btn checkout-btn--full">
                  Continue to Payment
                  <span className="checkout-btn__arrow">→</span>
                </button>
              </form>

              {/* Sidebar */}
              <OrderSummary 
                cartItems={cartItems}
                couponInput={couponInput}
                setCouponInput={setCouponInput}
                onApplyCoupon={handleApplyCoupon}
                appliedCoupon={appliedCoupon}
                discountAmount={discountAmount}
                couponError={couponError}
                total={total}
              />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            STEP 2 — PAYMENT
           ══════════════════════════════════════ */}
        {step === 2 && (
          <div className="checkout-content" key="step-2">
            <div className="checkout-payment">
              <h2 className="checkout-payment__title">Payment</h2>
              <span className="checkout-payment__title-bn">পেমেন্ট</span>

              {/* Tabs */}
              <div className="payment-tabs">
                {paymentConfig.razorpayEnabled && (
                  <button
                    type="button"
                    className={`payment-tab${paymentMethod === 'razorpay' ? ' payment-tab--active' : ''}`}
                    onClick={() => setPaymentMethod('razorpay')}
                  >
                    Razorpay Secure
                  </button>
                )}
                {paymentConfig.upiEnabled && (
                  <button
                    type="button"
                    className={`payment-tab${paymentMethod === 'upi' ? ' payment-tab--active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    UPI
                  </button>
                )}
                {paymentConfig.cardEnabled && (
                  <button
                    type="button"
                    className={`payment-tab${paymentMethod === 'card' ? ' payment-tab--active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    Credit / Debit Card
                  </button>
                )}
                {paymentConfig.codEnabled && (
                  <button
                    type="button"
                    className={`payment-tab${paymentMethod === 'cod' ? ' payment-tab--active' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    Cash on Delivery
                  </button>
                )}
              </div>

              {/* Razorpay Content */}
              {paymentConfig.razorpayEnabled && paymentMethod === 'razorpay' && (
                <div className="payment-content" key="razorpay">
                  <div className="payment-razorpay" style={{ padding: '30px', background: 'var(--old-paper)', borderRadius: '8px', border: '1px solid rgba(196, 98, 58, 0.25)', marginBottom: '20px', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px dashed rgba(92, 107, 58, 0.2)', paddingBottom: '12px' }}>
                      <strong style={{ color: 'var(--spice-sienna)', fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>Razorpay Secure Checkout</strong>
                      <span style={{ background: '#5C6B3A', color: '#FAF6EE', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>Live Sandbox</span>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <span className="text-muted text-xs d-block">Razorpay Key ID:</span>
                      <code style={{ fontSize: '0.85rem', color: 'var(--forest-olive)' }}>{paymentConfig.razorpayKeyId || 'rzp_live_default1234'}</code>
                    </div>

                    <p className="text-muted text-xs" style={{ lineHeight: '1.5' }}>
                      Click below to load the secure checkout popup window. Razorpay supports credit/debit cards, 100+ netbanking profiles, popular wallets, and direct UPI transfers.
                    </p>

                    <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(92, 107, 58, 0.08)', padding: '10px 14px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '1.1rem' }}>🛡️</span>
                      <span className="text-xs text-muted">PCI-DSS Compliant 256-bit Encrypted Transaction</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="checkout-btn checkout-btn--full"
                    onClick={handlePlaceOrder}
                  >
                    Launch Razorpay Checkout — ₹{total}
                  </button>
                </div>
              )}

              {/* UPI Content */}
              {paymentConfig.upiEnabled && paymentMethod === 'upi' && (
                <div className="payment-content" key="upi">
                  <div className="payment-upi">
                    <div className="payment-upi__qr">
                      <div className="payment-upi__qr-pattern">
                        {qrCells}
                      </div>
                      <div className="payment-upi__qr-logo">BS</div>
                    </div>
                    <p className="payment-upi__text">Scan to pay</p>
                    <p className="payment-upi__upi-id" style={{ fontFamily: 'monospace', color: 'var(--spice-sienna)', margin: '5px 0', fontSize: '0.9rem' }}>
                      UPI ID: {paymentConfig.upiId || 'banglarswad@okhdfc'}
                    </p>
                    <p className="payment-upi__subtext">
                      Use any UPI app — GPay, PhonePe, Paytm
                    </p>
                  </div>

                  <button
                    type="button"
                    className="checkout-btn checkout-btn--full"
                    onClick={handlePlaceOrder}
                  >
                    Place Order — ₹{total}
                  </button>
                </div>
              )}

              {/* Card Content */}
              {paymentConfig.cardEnabled && paymentMethod === 'card' && (
                <form
                  className="payment-content"
                  key="card"
                  onSubmit={handlePlaceOrder}
                >
                  <div className="payment-card">
                    <div className="form-field">
                      <label className="form-field__label" htmlFor="cardNumber">
                        Card Number
                      </label>
                      <input
                        className="form-field__input"
                        id="cardNumber"
                        name="cardNumber"
                        type="text"
                        inputMode="numeric"
                        placeholder="1234  5678  9012  3456"
                        maxLength={19}
                        value={form.cardNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="payment-card__row">
                      <div className="form-field">
                        <label className="form-field__label" htmlFor="cardExpiry">
                          Expiry
                        </label>
                        <input
                          className="form-field__input"
                          id="cardExpiry"
                          name="cardExpiry"
                          type="text"
                          placeholder="MM / YY"
                          maxLength={7}
                          value={form.cardExpiry}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-field">
                        <label className="form-field__label" htmlFor="cardCvv">
                          CVV
                        </label>
                        <input
                          className="form-field__input"
                          id="cardCvv"
                          name="cardCvv"
                          type="password"
                          inputMode="numeric"
                          placeholder="•••"
                          maxLength={4}
                          value={form.cardCvv}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label className="form-field__label" htmlFor="cardName">
                        Name on Card
                      </label>
                      <input
                        className="form-field__input"
                        id="cardName"
                        name="cardName"
                        type="text"
                        placeholder="As it appears on your card"
                        value={form.cardName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="checkout-btn checkout-btn--full">
                    Place Order — ₹{total}
                  </button>
                </form>
              )}

              {/* CoD Content */}
              {paymentConfig.codEnabled && paymentMethod === 'cod' && (
                <div className="payment-content" key="cod">
                  <div className="payment-cod" style={{ textAlign: 'center', padding: '30px 20px', background: 'var(--old-paper)', borderRadius: '8px', border: '1px solid rgba(92, 107, 58, 0.15)', marginBottom: '20px' }}>
                    <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--forest-olive)', marginBottom: '10px' }}>
                      Cash on Delivery Selected
                    </p>
                    <p className="text-muted text-xs">
                      No advance payment needed. Pay ₹{total} in cash or UPI to the delivery partner when your spices arrive.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="checkout-btn checkout-btn--full"
                    onClick={handlePlaceOrder}
                  >
                    Confirm CoD Order — ₹{total}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            STEP 3 — CONFIRMATION
           ══════════════════════════════════════ */}
        {step === 3 && (
          <div className="checkout-content" key="step-3">
            <div className="checkout-confirmation">
              {/* Animated checkmark */}
              <div className="checkout-check">
                <div className="checkout-check__mark" />
              </div>

              <h1 className="checkout-confirmation__heading">
                Order Placed!
              </h1>
              <span className="checkout-confirmation__heading-bn">
                অর্ডার সম্পন্ন!
              </span>

              <p className="checkout-confirmation__order-id">
                Order number: <strong>{orderId}</strong>
              </p>

              {/* Digital postcard */}
              <div className="checkout-postcard">
                <p className="checkout-postcard__label">
                  A little note from our kitchen to yours
                </p>
                <p className="checkout-postcard__text">
                  May every dish you cook with these spices carry the warmth
                  of a Bengali kitchen.
                </p>
                <span className="checkout-postcard__sign">
                  — Banglar Swad
                </span>
              </div>

              <button
                type="button"
                className="checkout-btn checkout-btn--secondary"
                onClick={onContinueShopping}
              >
                Continue Shopping
                <span className="checkout-btn__arrow">→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
