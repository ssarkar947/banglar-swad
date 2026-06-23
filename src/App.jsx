import { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Shop from './components/Shop';
import OurStory from './components/OurStory';
import SundayKitchen from './components/SundayKitchen';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductDetail from './components/ProductDetail';
import QRScanner from './components/QRScanner';
import AdminDashboard from './components/AdminDashboard';
import Blog from './components/Blog';
import AdminLogin from './components/AdminLogin';
import Compliance from './components/Compliance';
import { dbService } from './dbService';
import './App.css';

const MA_QUOTES = [
  { text: "onions need patience, not fire.", bn: "পেঁয়াজের ধৈর্য দরকার, আগুন নয়।" },
  { text: "the mutton is ready when it tells you it's ready.", bn: "মাংস তৈরি হলে সে নিজেই তোমাকে বলবে।" },
  { text: "if you have to ask whether the oil has separated, it hasn't.", bn: "তেল আলাদা হয়েছে কি না জিজ্ঞেস করতে হলে বুঝবে এখনও হয়নি।" },
  { text: "never rush the tadka. The oil remembers the heat.", bn: "ফোড়ন দিতে তাড়াহুড়ো করো না। তেল গরমের আঁচ মনে রাখে।" }
];

const DEFAULT_PRODUCTS = [
  {
    id: 'panch-phoron',
    name: 'Panch Phoron',
    bengaliName: 'পাঁচ ফোড়ন',
    weight: '100g',
    price: 249,
    image: '/images/panch-phoron.png',
    story: 'Before the onions. Before the ginger-garlic. Before anything — Panch Phoron goes into the oil. This is how Bengali food begins.',
    ingredients: ['Cumin seeds', 'Fennel seeds', 'Fenugreek seeds', 'Nigella seeds', 'Black mustard seeds'],
    ingredientsNote: 'Equal parts, whole, unground',
    description: 'The signature five-spice blend of Bengali cuisine. Five whole seeds in equal measure, tempered in hot oil to release a fragrance that is unmistakably home. Used in stews, lentils, and stews.'
  },
  {
    id: 'kosha-mangsho-masala',
    name: 'Kosha Mangsho Masala',
    bengaliName: 'কষা মাংসের মশলা',
    weight: '50g',
    price: 299,
    image: '/images/kosha-mangsho-masala.png',
    backImage: '/images/kosha-mangsho-masala-back.png',
    story: 'Some dishes are not cooked. They are remembered.',
    ingredients: ['Bay leaf', 'Cinnamon', 'Cardamom', 'Clove', 'Black pepper', 'Cumin', 'Coriander', 'Red chilli', 'Turmeric', 'Nutmeg'],
    ingredientsNote: 'Ground to a slow-cook blend',
    description: 'A deeply aromatic blend crafted for the legendary Bengali slow-cooked mutton curry. Each spice is roasted and ground to coax out layers of warmth that build with every hour on the stove.'
  },
  {
    id: 'bengali-garam-masala',
    name: 'Bengali Garam Masala',
    bengaliName: 'বাংলার গরম মশলা',
    weight: '50g',
    price: 279,
    image: '/images/garam-masala.png',
    story: "In Bengali cooking, the garam masala comes last. Not because it's an afterthought. Because the best things always come at the end.",
    ingredients: ['Cinnamon', 'Green cardamom', 'Cloves', 'Bay leaf', 'Black pepper'],
    ingredientsNote: 'Heavier on cinnamon, cardamom, and clove',
    description: 'Unlike its North Indian cousin, Bengali garam masala is sweet and cardamom-heavy. Added at the very end of cooking to seal the aroma.'
  },
  {
    id: 'starter-kit',
    name: 'Bengali Kitchen Starter Kit',
    bengaliName: 'বাংলার রান্নাঘর',
    weight: 'Gift Box',
    price: 749,
    image: '/images/starter-kit.png',
    story: 'Everything you need to make your kitchen smell like home.',
    ingredients: ['Panch Phoron (100g)', 'Kosha Mangsho Masala (50g)', 'Bengali Garam Masala (50g)'],
    ingredientsNote: 'Contains one pack each of Panch Phoron, Kosha Mangsho Masala, and Bengali Garam Masala',
    description: 'Our three foundational blends in a handcrafted kraft paper gift box. Includes a handwritten card explaining each spice, its purpose, and recipes.'
  }
];

const DEFAULT_COUPONS = [
  { code: 'SUNDAYKOSHA', type: 'percentage', value: 20, active: true },
  { code: 'WELCOME10', type: 'percentage', value: 10, active: true }
];

const DEFAULT_BLOGS = [
  {
    id: 'panch-phoron-crackle',
    title: 'The Physics of the Panch Phoron Crackle',
    titleBn: 'পাঁচ ফোড়নের রসায়ন',
    author: 'Founder',
    pillar: 'Knowledge',
    readTime: '4 min read',
    content: 'Before the onions. Before the ginger-garlic. Before anything — Panch Phoron goes into the oil.\n\nFive whole seeds in equal measure, tempered in hot oil to release a fragrance that is unmistakably home. The magic of Panch Phoron is that it is not a ground spice. It is a sequence of sputtering pops that transfer their essential oils directly into the smoking mustard oil.',
    date: 'Jun 20, 2026'
  },
  {
    id: 'sunday-mutton-manifesto',
    title: 'Sunday Mutton: A Manifesto on Koshano',
    titleBn: 'রবিবারের কষা মাংসের গল্প',
    author: 'Dida',
    pillar: 'Memory',
    readTime: '6 min read',
    content: 'Some dishes are not cooked. They are remembered.\n\nKosha Mangsho is not a recipe. It\'s a Sunday. It\'s the smell of onions going from gold to copper. It\'s the sound of the lid going on and the flame going down. The meat is ready when it tells you it\'s ready, not when the timer goes off.',
    date: 'Jun 15, 2026'
  }
];

const DEFAULT_ORDERS = [
  {
    id: 'BS-TR82A4P1',
    customerName: 'Preeti Chatterjee',
    email: 'preeti@example.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Green Glen Layout, Bellandur, Bangalore - 560103',
    items: [
      { id: 'kosha-mangsho-masala', name: 'Kosha Mangsho Masala', quantity: 1, price: 299 }
    ],
    subtotal: 299,
    discount: 0,
    total: 348,
    status: 'Delivered',
    date: 'Jun 18, 2026'
  },
  {
    id: 'BS-MN91X2T4',
    customerName: 'Aritra Dutt',
    email: 'aritra@example.com',
    phone: '+91 99887 76655',
    address: '12B, Lake Road, Ballygunge, Kolkata - 700029',
    items: [
      { id: 'starter-kit', name: 'Bengali Kitchen Starter Kit', quantity: 1, price: 749 }
    ],
    subtotal: 749,
    discount: 0,
    total: 749,
    status: 'Shipped',
    date: 'Jun 22, 2026'
  }
];

const DEFAULT_PAYMENT_CONFIG = {
  upiEnabled: true,
  cardEnabled: true,
  codEnabled: true,
  upiId: 'banglarswad@okhdfc'
};

function App() {
  const [activePage, setActivePage] = useState(() => {
    const hash = window.location.hash.replace('#', '') || 'home';
    if (hash.startsWith('product-detail/')) {
      return 'product-detail';
    }
    return hash;
  });
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [qrScannerProductId, setQrScannerProductId] = useState('panch-phoron');
  const [selectedProductId, setSelectedProductId] = useState(() => {
    const hash = window.location.hash.replace('#', '') || 'home';
    if (hash.startsWith('product-detail/')) {
      return hash.substring('product-detail/'.length);
    }
    return 'panch-phoron';
  });
  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => 
    sessionStorage.getItem('bs_admin_auth') === 'true'
  );

  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState(DEFAULT_COUPONS);
  const [blogs, setBlogs] = useState(DEFAULT_BLOGS);
  const [paymentConfig, setPaymentConfig] = useState(DEFAULT_PAYMENT_CONFIG);

  // Load database states on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const dbProds = await dbService.fetchProducts();
        setProducts(dbProds);

        const dbOrders = await dbService.fetchOrders();
        setOrders(dbOrders);

        const dbCoupons = await dbService.fetchCoupons();
        setCoupons(dbCoupons);

        const dbBlogs = await dbService.fetchBlogs();
        setBlogs(dbBlogs);

        const dbConfig = await dbService.fetchPaymentConfig();
        setPaymentConfig(dbConfig);
      } catch (err) {
        console.error('Failed to load database states:', err);
      }
    };
    loadData();
  }, []);

  // Handle hash-based routing changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      
      if (hash.startsWith('product-detail/')) {
        const prodId = hash.substring('product-detail/'.length);
        setSelectedProductId(prodId);
        setActivePage('product-detail');
      } else {
        setActivePage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleNextQuote = useCallback(() => {
    setActiveQuoteIdx(prev => (prev + 1) % MA_QUOTES.length);
  }, []);

  const handlePrevQuote = useCallback(() => {
    setActiveQuoteIdx(prev => (prev - 1 + MA_QUOTES.length) % MA_QUOTES.length);
  }, []);

  const handleProductClick = useCallback((productId) => {
    window.location.hash = `product-detail/${productId}`;
  }, []);

  // Load cart from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem('bs_cart');
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error('Could not load cart', e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('bs_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('bs_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bs_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bs_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('bs_blogs', JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem('bs_payment_config', JSON.stringify(paymentConfig));
  }, [paymentConfig]);

  const handleAddProduct = useCallback(async (newProd, forceLocal = false) => {
    if (!forceLocal) await dbService.addProduct(newProd);
    setProducts(prev => [newProd, ...prev]);
  }, []);

  const handleUpdateProduct = useCallback(async (updatedProd, forceLocal = false) => {
    if (!forceLocal) await dbService.updateProduct(updatedProd);
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
  }, []);

  const handleDeleteProduct = useCallback(async (id, forceLocal = false) => {
    if (!forceLocal) await dbService.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleUpdateOrderStatus = useCallback(async (id, status, forceLocal = false) => {
    if (!forceLocal) await dbService.updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }, []);

  const handleAddCoupon = useCallback(async (coupon, forceLocal = false) => {
    if (!forceLocal) await dbService.addCoupon(coupon);
    setCoupons(prev => [coupon, ...prev]);
  }, []);

  const handleToggleCoupon = useCallback(async (code, forceLocal = false) => {
    const target = coupons.find(c => c.code === code);
    if (target) {
      const newActive = !target.active;
      if (!forceLocal) await dbService.toggleCoupon(code, newActive);
      setCoupons(prev => prev.map(c => c.code === code ? { ...c, active: newActive } : c));
    }
  }, [coupons]);

  const handleAddBlog = useCallback(async (blog, forceLocal = false) => {
    if (!forceLocal) await dbService.addBlog(blog);
    setBlogs(prev => [blog, ...prev]);
  }, []);

  const handleDeleteBlog = useCallback(async (id, forceLocal = false) => {
    if (!forceLocal) await dbService.deleteBlog(id);
    setBlogs(prev => prev.filter(b => b.id !== id));
  }, []);

  const handleUpdatePaymentConfig = useCallback(async (config, forceLocal = false) => {
    if (!forceLocal) await dbService.updatePaymentConfig(config);
    setPaymentConfig(config);
  }, []);

  const handleNavigate = useCallback((page) => {
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAddToCart = useCallback((item) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((x) => x.id === item.id);
      if (existing) {
        return prevItems.map((x) =>
          x.id === item.id
            ? { ...x, quantity: x.quantity + (item.quantity || 1) }
            : x
        );
      }
      return [
        ...prevItems,
        {
          id: item.id,
          name: item.name,
          nameBn: item.bengaliName || item.nameBn,
          price: item.price,
          image: item.image,
          quantity: item.quantity || 1,
        },
      ];
    });
    // Open cart drawer automatically for immediate feedback
    setIsCartOpen(true);
  }, []);

  const handleUpdateQuantity = useCallback((id, quantity) => {
    setCartItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, quantity } : x))
    );
  }, []);

  const handleRemoveItem = useCallback((id) => {
    setCartItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const handleCheckout = useCallback(() => {
    setIsCartOpen(false);
    window.location.hash = 'checkout';
  }, []);

  const handleOrderComplete = useCallback(async (orderData) => {
    await dbService.addOrder(orderData);
    setOrders(prev => [orderData, ...prev]);
    setCartItems([]);
    localStorage.removeItem('bs_cart');
  }, []);

  const handleOpenScanner = useCallback((productId = 'panch-phoron') => {
    setQrScannerProductId(productId);
    setIsQRScannerOpen(true);
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-container">
      {/* Sticky Header - Hidden in Admin */}
      {activePage !== 'admin' && (
        <Navbar
          activePage={activePage}
          onNavigate={handleNavigate}
          cartCount={cartCount}
          onCartClick={() => setIsCartOpen(true)}
        />
      )}

      {/* Main Page Routing */}
      <main className="main-content">
        {activePage === 'home' && (
          <>
            <Hero onNavigate={handleNavigate} />
            
            {/* Story Teaser Section */}
            <section className="home-teaser">
              <div className="home-teaser__inner">
                <span className="home-teaser__bn">আমাদের অঙ্গীকার</span>
                <h2>We are the generation that learned before it was too late.</h2>
                <p>
                  We grew up watching someone cook without measuring anything. A fistful of this. A splash of that. 
                  "Ektu beshi" — a little more. And it always came out right. We started Banglar Swad to preserve 
                  the specific way Bengali food is made—not Indian food, not Bengali-ish food—but the real thing.
                </p>
                <button className="home-teaser__btn" onClick={() => handleNavigate('our-story')}>
                  Our Story
                </button>
              </div>
            </section>

            {/* Manifesto Section */}
            <section className="home-manifesto">
              <div className="home-manifesto__inner">
                <span className="home-manifesto__bn">আমাদের স্বকীয়তা</span>
                <h2 className="home-manifesto__title">What We Stand For</h2>
                <hr className="home-manifesto__rule" />
                <div className="home-manifesto__grid">
                  <div className="manifesto-col">
                    <h3>What We Are</h3>
                    <ul>
                      <li><span>✦</span> Young Bengalis preserving what matters</li>
                      <li><span>✦</span> Premium, intentional, story-led blends</li>
                      <li><span>✦</span> A cultural preservation project at heart</li>
                      <li><span>✦</span> Rooted in Bengali identity, built for today</li>
                    </ul>
                  </div>
                  <div className="manifesto-col">
                    <h3>What We Are Not</h3>
                    <ul>
                      <li><span>✧</span> Grandparents romanticising the past</li>
                      <li><span>✧</span> Generic, price-led, mass market masalas</li>
                      <li><span>✧</span> Just another commercial spice company</li>
                      <li><span>✧</span> Pan-Indian or geographically vague</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Product Banner */}
            <section className="home-featured">
              <div className="home-featured__grid">
                <div className="home-featured__content">
                  <span className="home-featured__bn">রবিবারের কষা মাংস</span>
                  <h3>Sunday Kosha Mangsho Masala</h3>
                  <p className="home-featured__story">
                    "Kosha Mangsho is not a recipe. It's a Sunday. It's the smell of onions going from gold to copper. 
                    It's the sound of the lid going on and the flame going down."
                  </p>
                  <button className="home-featured__btn" onClick={() => handleProductClick('kosha-mangsho-masala')}>
                    Shop the Slow-Cook Blend
                  </button>
                </div>
                <div className="home-featured__image-wrap">
                  <img src="/images/kosha-mangsho-masala.png" alt="Kosha Mangsho Masala Pack" />
                </div>
              </div>
            </section>

            {/* Mother's Notebook Section */}
            <section className="home-ma-notebook">
              <div className="home-ma-notebook__inner">
                <span className="home-ma-notebook__bn">মা বলেছেন</span>
                <h2 className="home-ma-notebook__title">The Mother's Notebook</h2>
                <hr className="home-ma-notebook__rule" />
                
                <div className="ma-quote-slider">
                  <button className="ma-slider-btn ma-slider-btn--prev" onClick={handlePrevQuote} aria-label="Previous quote">⟵</button>
                  
                  <div className="ma-quote-card" key={activeQuoteIdx}>
                    <p className="ma-quote-card__bn">"{MA_QUOTES[activeQuoteIdx].bn}"</p>
                    <p className="ma-quote-card__text">"Ma bolechen: {MA_QUOTES[activeQuoteIdx].text}"</p>
                    <span className="ma-quote-card__source">— Dida's kitchen wisdom</span>
                  </div>

                  <button className="ma-slider-btn ma-slider-btn--next" onClick={handleNextQuote} aria-label="Next quote">⟶</button>
                </div>
              </div>
            </section>

            {/* Sensory Kitchen Timeline Section */}
            <section className="home-kitchen-timeline">
              <div className="home-kitchen-timeline__inner">
                <span className="home-kitchen-timeline__bn">রন্ধন প্রক্রিয়া</span>
                <h2 className="home-kitchen-timeline__title">How a Bengali Kitchen Wakes Up</h2>
                <hr className="home-kitchen-timeline__rule" />
                
                <div className="timeline-steps">
                  <div className="timeline-step">
                    <span className="timeline-step__time">08:00 AM</span>
                    <div className="timeline-step__content">
                      <h4>The Smoking Mustard Oil</h4>
                      <p>Cold pressed shorsher tel is heated in a heavy iron kadai until the first wisp of white smoke rises. If it doesn't sting your eyes, it isn't ready.</p>
                    </div>
                  </div>
                  
                  <div className="timeline-step">
                    <span className="timeline-step__time">11:00 AM</span>
                    <div className="timeline-step__content">
                      <h4>The Panch Phoron Crackle</h4>
                      <p>Five whole seeds are dropped into the hot oil. They sputter and pop, transferring cumin, fennel, fenugreek, nigella, and mustard oils into the base. This is the sound of cooking beginning.</p>
                    </div>
                  </div>

                  <div className="timeline-step">
                    <span className="timeline-step__time">12:30 PM</span>
                    <div className="timeline-step__content">
                      <h4>The Low and Slow Bhuna</h4>
                      <p>Onions caramelize slowly, changing from gold to deep copper. Spices and meat are added, cooking low and slow until the mahogany gravy separates from the oil. Patience rules the flame.</p>
                    </div>
                  </div>

                  <div className="timeline-step">
                    <span className="timeline-step__time">01:30 PM</span>
                    <div className="timeline-step__content">
                      <h4>The Sweet Garam Masala Steam</h4>
                      <p>A final sweet cardamom and clove pinch of Bengali Garam Masala is sprinkled over the dish. The heavy lid goes on immediately to trap the steam. The sentence is finished.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="home-testimonials">
              <div className="home-testimonials__inner">
                <span className="home-testimonials__bn">গ্রাহকদের কথা</span>
                <h2 className="home-testimonials__title">Ranna Ghar Diaries</h2>
                <hr className="home-testimonials__rule" />
                
                <div className="home-testimonials__grid">
                  <div className="testimonial-card">
                    <p className="testimonial-card__quote">
                      "I studied in Delhi, work in Bangalore. My mother calls every Sunday. I tried making Kosha Mangsho with the masala last Saturday and for the first time, it didn't turn out too dry or too watery. It smelled exactly like home."
                    </p>
                    <div className="testimonial-card__meta">
                      <span className="testimonial-card__author">Preeti Chatterjee</span>
                      <span className="testimonial-card__info">28 • Bangalore</span>
                      <span className="testimonial-card__tag">Used: Kosha Mangsho Masala</span>
                    </div>
                  </div>
                  
                  <div className="testimonial-card">
                    <p className="testimonial-card__quote">
                      "Sending the Starter Kit to my parents in Kolkata from London was the best decision. Dida called to say the Panch Phoron crackled exactly the way she liked, filling the house with memories."
                    </p>
                    <div className="testimonial-card__meta">
                      <span className="testimonial-card__author">Aritra Dutt</span>
                      <span className="testimonial-card__info">34 • London</span>
                      <span className="testimonial-card__tag">Used: Kitchen Starter Kit</span>
                    </div>
                  </div>
                  
                  <div className="testimonial-card">
                    <p className="testimonial-card__quote">
                      "I'm a non-Bengali, but the storytelling made me curious. Made my first Shukto using the Panch Phoron pack. The sound of it crackling in hot mustard oil is absolute therapy!"
                    </p>
                    <div className="testimonial-card__meta">
                      <span className="testimonial-card__author">Sarah Mehta</span>
                      <span className="testimonial-card__info">26 • Mumbai</span>
                      <span className="testimonial-card__tag">Used: Panch Phoron</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activePage === 'shop' && (
          <Shop onAddToCart={handleAddToCart} onProductClick={handleProductClick} products={products} />
        )}

        {activePage === 'product-detail' && (
          <ProductDetail
            productId={selectedProductId}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
            onScanClick={handleOpenScanner}
            products={products}
          />
        )}

        {['terms', 'privacy', 'refunds', 'shipping', 'contact'].includes(activePage) && (
          <Compliance policyType={activePage} />
        )}

        {activePage === 'our-story' && (
          <OurStory />
        )}

        {activePage === 'sunday-kitchen' && (
          <SundayKitchen />
        )}

        {activePage === 'checkout' && (
          <Checkout
            cartItems={cartItems}
            onOrderComplete={handleOrderComplete}
            onContinueShopping={() => handleNavigate('shop')}
            coupons={coupons}
            paymentConfig={paymentConfig}
          />
        )}

        {activePage === 'blog' && (
          <Blog blogs={blogs} />
        )}

        {activePage === 'admin' && (
          isAdminAuthenticated ? (
            <AdminDashboard
              orders={orders}
              products={products}
              coupons={coupons}
              blogs={blogs}
              paymentConfig={paymentConfig}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onUploadImage={dbService.uploadProductImage}
              onAddCoupon={handleAddCoupon}
              onToggleCoupon={handleToggleCoupon}
              onAddBlog={handleAddBlog}
              onDeleteBlog={handleDeleteBlog}
              onUpdatePaymentConfig={handleUpdatePaymentConfig}
              onNavigate={handleNavigate}
            />
          ) : (
            <AdminLogin onLoginSuccess={() => setIsAdminAuthenticated(true)} />
          )
        )}
      </main>

      {/* Floating Scan Companion Button - Hidden in Admin */}
      {activePage !== 'admin' && (
        <button 
          className="qr-scanner-fab" 
          onClick={() => handleOpenScanner('panch-phoron')}
          aria-label="Open Pack QR Scanner Simulator"
        >
          <span className="qr-scanner-fab__icon">📷</span>
          <span className="qr-scanner-fab__text">Scan Pack QR</span>
        </button>
      )}

      {/* Footer - Hidden in Admin */}
      {activePage !== 'admin' && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Shopping Cart Sliding Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Simulated QR Scanner Overlay */}
      <QRScanner
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        initialProductId={qrScannerProductId}
      />
    </div>
  );
}

export default App;
