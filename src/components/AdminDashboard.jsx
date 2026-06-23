import { useState, useMemo } from 'react';
import './AdminDashboard.css';

export default function AdminDashboard({
  orders = [],
  products = [],
  coupons = [],
  blogs = [],
  paymentConfig = {},
  onUpdateOrderStatus,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUploadImage,
  onAddCoupon,
  onToggleCoupon,
  onAddBlog,
  onDeleteBlog,
  onUpdatePaymentConfig,
  onNavigate,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProduct, setEditingProduct] = useState(null);

  /* ── Form States ── */
  const [newProduct, setNewProduct] = useState({
    name: '',
    bengaliName: '',
    price: '',
    weight: '',
    story: '',
    description: '',
    ingredientsInput: '',
    image: '/images/panch-phoron.png',
    imageSelect: '/images/panch-phoron.png',
    backImage: '',
  });

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    value: '',
  });

  const [newBlog, setNewBlog] = useState({
    title: '',
    titleBn: '',
    author: '',
    pillar: 'Memory',
    content: '',
    readTime: '3 min read',
  });

  const [uploadingField, setUploadingField] = useState(null);

  const handleFileUpload = async (e, targetField) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingField(targetField);
    try {
      const url = await onUploadImage(file);
      if (targetField === 'newFront') {
        setNewProduct(prev => ({ ...prev, image: url, imageSelect: 'custom' }));
      } else if (targetField === 'newBack') {
        setNewProduct(prev => ({ ...prev, backImage: url }));
      } else if (targetField === 'editFront') {
        setEditingProduct(prev => ({ ...prev, image: url }));
      } else if (targetField === 'editBack') {
        setEditingProduct(prev => ({ ...prev, backImage: url }));
      }
    } catch (err) {
      alert('Failed to upload image. Please try again.');
      console.error(err);
    } finally {
      setUploadingField(null);
    }
  };

  /* ── Statistics Calculations ── */
  const stats = useMemo(() => {
    const validOrders = orders.filter(o => o.status !== 'Cancelled');
    const totalSales = validOrders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = validOrders.length > 0 ? Math.round(totalSales / validOrders.length) : 0;
    const activeCoupons = coupons.filter(c => c.active).length;

    return {
      totalSales,
      orderCount: orders.length,
      avgOrderValue,
      activeCoupons,
      productCount: products.length,
    };
  }, [orders, coupons, products]);

  /* ── Form Submissions ── */
  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    
    const ingredients = newProduct.ingredientsInput
      ? newProduct.ingredientsInput.split(',').map(s => s.trim())
      : [];

    const productData = {
      id: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: newProduct.name,
      bengaliName: newProduct.bengaliName,
      price: parseFloat(newProduct.price),
      weight: newProduct.weight || '50g',
      story: newProduct.story,
      description: newProduct.description,
      ingredients,
      ingredientsNote: 'Hand-blended recipe pack',
      image: newProduct.image,
      backImage: newProduct.backImage || '',
    };

    onAddProduct(productData);
    setNewProduct({
      name: '',
      bengaliName: '',
      price: '',
      weight: '',
      story: '',
      description: '',
      ingredientsInput: '',
      image: '/images/panch-phoron.png',
      imageSelect: '/images/panch-phoron.png',
      backImage: '',
    });
    alert('Spice SKU added successfully!');
  };

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.value) return;

    onAddCoupon({
      code: newCoupon.code.toUpperCase().replace(/\s+/g, ''),
      type: newCoupon.type,
      value: parseFloat(newCoupon.value),
      active: true,
    });

    setNewCoupon({
      code: '',
      type: 'percentage',
      value: '',
    });
    alert('Coupon code activated!');
  };

  const handleBlogSubmit = (e) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content) return;

    onAddBlog({
      id: newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newBlog.title,
      titleBn: newBlog.titleBn,
      author: newBlog.author || 'Founder',
      pillar: newBlog.pillar,
      content: newBlog.content,
      readTime: newBlog.readTime,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });

    setNewBlog({
      title: '',
      titleBn: '',
      author: '',
      pillar: 'Memory',
      content: '',
      readTime: '3 min read',
    });
    alert('Kitchen Story published!');
  };

  const handleQuickDraftSubmit = (e) => {
    e.preventDefault();
    const title = e.target.elements.draftTitle.value;
    const content = e.target.elements.draftContent.value;
    if (!title || !content) return;

    onAddBlog({
      id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: title,
      titleBn: '',
      author: 'Quick Draft Editor',
      pillar: 'Memory',
      content: content,
      readTime: '3 min read',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
    
    e.target.reset();
    alert('Quick Draft published directly to Stories!');
  };

  const handlePaymentToggle = (key) => {
    onUpdatePaymentConfig({
      ...paymentConfig,
      [key]: !paymentConfig[key],
    });
  };

  const handleUpiIdChange = (e) => {
    onUpdatePaymentConfig({
      ...paymentConfig,
      upiId: e.target.value,
    });
  };

  const handleRazorpayChange = (key, val) => {
    onUpdatePaymentConfig({
      ...paymentConfig,
      [key]: val,
    });
  };

  return (
    <div className="wp-admin">
      
      {/* ── WordPress-style Top Admin Bar ── */}
      <header className="wp-admin__bar">
        <div className="wp-admin__bar-left">
          <span className="wp-admin__bar-site" onClick={() => onNavigate?.('home')} style={{ cursor: 'pointer' }}>
            🏠 Banglar Swad <span className="wp-admin__bar-site-sub">— Visit Site</span>
          </span>
        </div>
        <div className="wp-admin__bar-right">
          <span className="wp-admin__bar-user">Howdy, Administrator 👤</span>
        </div>
      </header>

      <div className="wp-admin__container">
        
        {/* ── WordPress-style Left Sidebar ── */}
        <aside className="wp-admin__sidebar">
          <nav className="wp-admin__nav">
            {[
              { id: 'overview', label: 'Dashboard', icon: '仪表盘 📊' },
              { id: 'orders', label: `Orders (${orders.length})`, icon: '订单 📦' },
              { id: 'products', label: 'Spice Inventory', icon: '商品 🌿' },
              { id: 'coupons', label: 'Discounts Engine', icon: '营销 🎟️' },
              { id: 'blogs', label: 'Stories Editor', icon: '文章 ✍️' },
              { id: 'payment', label: 'Gateway Settings', icon: '设置 💳' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`wp-admin__nav-btn${activeTab === tab.id ? ' wp-admin__nav-btn--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="wp-admin__nav-icon">{tab.icon.split(' ')[1]}</span>
                <span className="wp-admin__nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Main Dashboard Panel Area ── */}
        <main className="wp-admin__main">
          
          {/* ══════════════════════════════════════
              DASHBOARD / OVERVIEW WIDGETS
             ══════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="wp-tab fadeIn" key="overview">
              <h1 className="wp-admin__title">Dashboard</h1>

              <div className="wp-grid wp-grid--dashboard">
                {/* At a Glance Widget */}
                <div className="wp-widget wp-widget--glance">
                  <div className="wp-widget__header">
                    <h3>At a Glance</h3>
                  </div>
                  <div className="wp-widget__body">
                    <ul className="glance-list">
                      <li className="glance-item">
                        <span className="glance-icon">🌿</span>
                        <span>{stats.productCount} Spices SKUs</span>
                      </li>
                      <li className="glance-item">
                        <span className="glance-icon">✍️</span>
                        <span>{blogs.length} Kitchen Stories</span>
                      </li>
                      <li className="glance-item">
                        <span className="glance-icon">📦</span>
                        <span>{stats.orderCount} Gross Orders</span>
                      </li>
                      <li className="glance-item">
                        <span className="glance-icon">🎟️</span>
                        <span>{stats.activeCoupons} Active Coupons</span>
                      </li>
                    </ul>
                    <div className="glance-footer">
                      <p>Total Revenue generated: <strong>₹{stats.totalSales}</strong></p>
                      <p>Average Ticket Size: <strong>₹{stats.avgOrderValue}</strong></p>
                    </div>
                  </div>
                </div>

                {/* Quick Draft Widget */}
                <div className="wp-widget wp-widget--draft">
                  <div className="wp-widget__header">
                    <h3>Quick Draft</h3>
                  </div>
                  <div className="wp-widget__body">
                    <form onSubmit={handleQuickDraftSubmit} className="wp-form wp-form--draft">
                      <div className="wp-form__field">
                        <input
                          type="text"
                          name="draftTitle"
                          placeholder="Title"
                          required
                        />
                      </div>
                      <div className="wp-form__field">
                        <textarea
                          name="draftContent"
                          placeholder="What's on Dida's stove today?"
                          rows="4"
                          required
                        />
                      </div>
                      <button type="submit" className="wp-btn wp-btn--primary">Save Draft Story</button>
                    </form>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="wp-widget wp-widget--activity" style={{ gridColumn: 'span 2' }}>
                  <div className="wp-widget__header">
                    <h3>Recent Activity</h3>
                  </div>
                  <div className="wp-widget__body">
                    {orders.length === 0 ? (
                      <p className="wp-empty-text">No recent transactions logged.</p>
                    ) : (
                      <div className="wp-table-wrapper">
                        <table className="wp-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Order ID</th>
                              <th>Customer</th>
                              <th>Total</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.slice(-5).reverse().map(order => (
                              <tr key={order.id}>
                                <td>{order.date}</td>
                                <td className="font-mono text-sienna">{order.id}</td>
                                <td>{order.customerName}</td>
                                <td>₹{order.total}</td>
                                <td>
                                  <span className={`wp-status wp-status--${order.status.toLowerCase()}`}>
                                    {order.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              ORDERS MANAGEMENT
             ══════════════════════════════════════ */}
          {activeTab === 'orders' && (
            <div className="wp-tab fadeIn" key="orders">
              <h1 className="wp-admin__title">Manage Orders</h1>

              <div className="wp-widget">
                <div className="wp-widget__body">
                  {orders.length === 0 ? (
                    <p className="wp-empty-text">No orders placed yet.</p>
                  ) : (
                    <div className="wp-table-wrapper">
                      <table className="wp-table">
                        <thead>
                          <tr>
                            <th>Order ID & Date</th>
                            <th>Customer & Address</th>
                            <th>Items</th>
                            <th>Financials</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice().reverse().map(order => (
                            <tr key={order.id} className="wp-table-row">
                              <td>
                                <span className="font-bold font-mono text-sienna d-block">{order.id}</span>
                                <span className="text-muted text-xs">{order.date}</span>
                              </td>
                              <td>
                                <strong>{order.customerName}</strong>
                                <span className="text-muted d-block text-xs">{order.email} • {order.phone}</span>
                                <span className="text-muted d-block text-xs" style={{ maxWidth: '220px', whiteSpace: 'normal' }}>{order.address}</span>
                              </td>
                              <td>
                                <ul className="wp-order-items">
                                  {order.items.map((it, idx) => (
                                    <li key={idx} className="text-xs">
                                      {it.name} <span className="text-sienna font-bold">× {it.quantity}</span>
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td>
                                <span className="d-block text-xs">Subtotal: ₹{order.subtotal}</span>
                                {order.discount > 0 && (
                                  <span className="d-block text-xs text-sienna">Discount: -₹{order.discount}</span>
                                )}
                                <span className="d-block font-bold">Total: ₹{order.total}</span>
                              </td>
                              <td>
                                <span className={`wp-status wp-status--${order.status.toLowerCase()}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td>
                                <div className="wp-row-actions">
                                  {order.status === 'Pending' && (
                                    <button
                                      className="wp-action-link"
                                      onClick={() => onUpdateOrderStatus(order.id, 'Shipped')}
                                    >
                                      Ship
                                    </button>
                                  )}
                                  {order.status === 'Shipped' && (
                                    <button
                                      className="wp-action-link wp-action-link--success"
                                      onClick={() => onUpdateOrderStatus(order.id, 'Delivered')}
                                    >
                                      Complete
                                    </button>
                                  )}
                                  {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                    <button
                                      className="wp-action-link wp-action-link--danger"
                                      onClick={() => onUpdateOrderStatus(order.id, 'Cancelled')}
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              PRODUCT / SPICE INVENTORY
             ══════════════════════════════════════ */}
          {activeTab === 'products' && (
            <div className="wp-tab fadeIn" key="products">
              <h1 className="wp-admin__title">Spice Catalog</h1>
              
              <div className="wp-two-col">
                {/* Product List Widget */}
                <div className="wp-widget">
                  <div className="wp-widget__header">
                    <h3>All Spices ({products.length})</h3>
                  </div>
                  <div className="wp-widget__body">
                    <div className="wp-table-wrapper">
                      <table className="wp-table">
                        <thead>
                          <tr>
                            <th style={{ width: '60px' }}>Image</th>
                            <th>Details</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map(prod => (
                            <tr key={prod.id} className="wp-table-row">
                              <td>
                                <img src={prod.image} alt={prod.name} className="wp-product-thumb" />
                              </td>
                              <td>
                                <strong>{prod.name}</strong>
                                <span className="text-muted d-block text-xs">{prod.bengaliName} • {prod.weight}</span>
                                
                                {/* WP Row Actions on Hover */}
                                <div className="wp-row-actions">
                                  <button
                                    className="wp-action-link wp-action-link--danger"
                                    onClick={() => onDeleteProduct(prod.id)}
                                  >
                                    Delete
                                  </button>
                                  <span className="divider">|</span>
                                  <button
                                    className="wp-action-link"
                                    onClick={() => alert(`Flavor story:\n\n"${prod.story || 'No story.'}"`)}
                                  >
                                    View Story
                                  </button>
                                  <span className="divider">|</span>
                                  <button
                                    className="wp-action-link"
                                    onClick={() => setEditingProduct({ ...prod })}
                                  >
                                    Edit Images
                                  </button>
                                </div>
                              </td>
                              <td>₹{prod.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Add Product Form */}
                <div className="wp-widget">
                  <div className="wp-widget__header">
                    <h3>Add New Pouch</h3>
                  </div>
                  <div className="wp-widget__body">
                    <form onSubmit={handleProductSubmit} className="wp-form">
                      <div className="wp-form__field">
                        <label>English Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Radhuni seeds"
                          value={newProduct.name}
                          onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="wp-form__field">
                        <label>Bengali Script Name</label>
                        <input
                          type="text"
                          placeholder="e.g. রাঁধুনি"
                          value={newProduct.bengaliName}
                          onChange={e => setNewProduct({...newProduct, bengaliName: e.target.value})}
                        />
                      </div>
                      <div className="wp-form__field-row">
                        <div className="wp-form__field">
                          <label>Price (₹)</label>
                          <input
                            type="number"
                            placeholder="199"
                            value={newProduct.price}
                            onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                            required
                          />
                        </div>
                        <div className="wp-form__field">
                          <label>Weight</label>
                          <input
                            type="text"
                            placeholder="50g"
                            value={newProduct.weight}
                            onChange={e => setNewProduct({...newProduct, weight: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="wp-form__field">
                        <label>Label Story (2-3 lines)</label>
                        <textarea
                          rows="2"
                          placeholder="e.g. Radhuni is the wild cardamom of Bengal..."
                          value={newProduct.story}
                          onChange={e => setNewProduct({...newProduct, story: e.target.value})}
                        />
                      </div>
                      <div className="wp-form__field">
                        <label>Detailed Description</label>
                        <textarea
                          rows="3"
                          placeholder="Flavor profile and recipe guides..."
                          value={newProduct.description}
                          onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                        />
                      </div>
                      <div className="wp-form__field">
                        <label>Ingredients (comma separated)</label>
                        <input
                          type="text"
                          placeholder="Cumin, Fennel, Fenugreek"
                          value={newProduct.ingredientsInput}
                          onChange={e => setNewProduct({...newProduct, ingredientsInput: e.target.value})}
                        />
                      </div>
                      <div className="wp-form__field">
                        <label>Mock Image Pack</label>
                        <select
                          value={newProduct.imageSelect || '/images/panch-phoron.png'}
                          onChange={e => {
                            const val = e.target.value;
                            if (val === 'custom') {
                              setNewProduct({...newProduct, imageSelect: 'custom', image: ''});
                            } else {
                              setNewProduct({...newProduct, imageSelect: val, image: val});
                            }
                          }}
                        >
                          <option value="/images/panch-phoron.png">Panch Phoron (Green Pouch)</option>
                          <option value="/images/kosha-mangsho-masala.png">Kosha Mangsho (Brown Pouch)</option>
                          <option value="/images/garam-masala.png">Garam Masala (Sienna Pouch)</option>
                          <option value="/images/starter-kit.png">Starter Kit (Kraft Box)</option>
                          <option value="custom">Custom Image Path...</option>
                        </select>
                      </div>

                      {(newProduct.imageSelect === 'custom' || !['/images/panch-phoron.png', '/images/kosha-mangsho-masala.png', '/images/garam-masala.png', '/images/starter-kit.png'].includes(newProduct.image)) && (
                        <div className="wp-form__field">
                          <label>Custom Front Image Path/URL</label>
                          <div className="wp-upload-input-group">
                            <input
                              type="text"
                              placeholder="e.g. /images/my-spice.png"
                              value={newProduct.image}
                              onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                              required
                            />
                            <label className="wp-upload-btn">
                              {uploadingField === 'newFront' ? 'Uploading...' : 'Upload File 📁'}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e => handleFileUpload(e, 'newFront')}
                                style={{ display: 'none' }}
                                disabled={uploadingField !== null}
                              />
                            </label>
                          </div>
                        </div>
                      )}

                      <div className="wp-form__field">
                        <label>Back Image Path/URL (Optional)</label>
                        <div className="wp-upload-input-group">
                          <input
                            type="text"
                            placeholder="e.g. /images/my-spice-back.png"
                            value={newProduct.backImage || ''}
                            onChange={e => setNewProduct({...newProduct, backImage: e.target.value})}
                          />
                          <label className="wp-upload-btn">
                            {uploadingField === 'newBack' ? 'Uploading...' : 'Upload File 📁'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleFileUpload(e, 'newBack')}
                              style={{ display: 'none' }}
                              disabled={uploadingField !== null}
                            />
                          </label>
                        </div>
                      </div>
                      <button type="submit" className="wp-btn wp-btn--primary">Publish Pouch</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              OFFERS & DISCOUNTS
             ══════════════════════════════════════ */}
          {activeTab === 'coupons' && (
            <div className="wp-tab fadeIn" key="coupons">
              <h1 className="wp-admin__title">Discount Engine</h1>
              
              <div className="wp-two-col">
                {/* Active Coupons List */}
                <div className="wp-widget">
                  <div className="wp-widget__header">
                    <h3>Active Coupon Codes</h3>
                  </div>
                  <div className="wp-widget__body">
                    <div className="wp-table-wrapper">
                      <table className="wp-table">
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Discount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {coupons.map(coupon => (
                            <tr key={coupon.code} className="wp-table-row">
                              <td>
                                <strong className="font-mono text-sienna">{coupon.code}</strong>
                                <div className="wp-row-actions">
                                  <button
                                    className={`wp-action-link ${coupon.active ? 'wp-action-link--danger' : 'wp-action-link--success'}`}
                                    onClick={() => onToggleCoupon(coupon.code)}
                                  >
                                    {coupon.active ? 'Deactivate' : 'Activate'}
                                  </button>
                                </div>
                              </td>
                              <td>{coupon.type === 'percentage' ? `${coupon.value}% Off` : `₹${coupon.value} Off`}</td>
                              <td>
                                <span className={`wp-status wp-status--${coupon.active ? 'delivered' : 'cancelled'}`}>
                                  {coupon.active ? 'Active' : 'Disabled'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Add Coupon Form */}
                <div className="wp-widget">
                  <div className="wp-widget__header">
                    <h3>Create Coupon</h3>
                  </div>
                  <div className="wp-widget__body">
                    <form onSubmit={handleCouponSubmit} className="wp-form">
                      <div className="wp-form__field">
                        <label>Coupon Code Name</label>
                        <input
                          type="text"
                          placeholder="e.g. SUNDAYKOSHA"
                          value={newCoupon.code}
                          onChange={e => setNewCoupon({...newCoupon, code: e.target.value})}
                          required
                        />
                      </div>
                      <div className="wp-form__field-row">
                        <div className="wp-form__field">
                          <label>Discount Type</label>
                          <select
                            value={newCoupon.type}
                            onChange={e => setNewCoupon({...newCoupon, type: e.target.value})}
                          >
                            <option value="percentage">Percentage (%)</option>
                            <option value="flat">Flat Amount (₹)</option>
                          </select>
                        </div>
                        <div className="wp-form__field">
                          <label>Value</label>
                          <input
                            type="number"
                            placeholder="e.g. 15 or 100"
                            value={newCoupon.value}
                            onChange={e => setNewCoupon({...newCoupon, value: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <button type="submit" className="wp-btn wp-btn--primary">Activate Coupon</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              BLOG / STORIES EDITOR
             ══════════════════════════════════════ */}
          {activeTab === 'blogs' && (
            <div className="wp-tab fadeIn" key="blogs">
              <h1 className="wp-admin__title">Stories Manager</h1>
              
              <div className="wp-two-col">
                {/* Published Blogs List */}
                <div className="wp-widget">
                  <div className="wp-widget__header">
                    <h3>All Stories ({blogs.length})</h3>
                  </div>
                  <div className="wp-widget__body">
                    <div className="wp-table-wrapper">
                      <table className="wp-table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {blogs.map(blog => (
                            <tr key={blog.id} className="wp-table-row">
                              <td>
                                <strong>{blog.title}</strong>
                                <span className="text-muted d-block text-xs">{blog.author} • {blog.date}</span>
                                
                                <div className="wp-row-actions">
                                  <button
                                    className="wp-action-link wp-action-link--danger"
                                    onClick={() => onDeleteBlog(blog.id)}
                                  >
                                    Delete
                                  </button>
                                  <span className="divider">|</span>
                                  <button
                                    className="wp-action-link"
                                    onClick={() => alert(`Title Bengali: ${blog.titleBn || 'None'}\n\nContent Excerpt:\n\n${blog.content}`)}
                                  >
                                    Preview
                                  </button>
                                </div>
                              </td>
                              <td>
                                <span className="wp-status wp-status--pending">{blog.pillar}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Add Blog Form */}
                <div className="wp-widget">
                  <div className="wp-widget__header">
                    <h3>Publish Story</h3>
                  </div>
                  <div className="wp-widget__body">
                    <form onSubmit={handleBlogSubmit} className="wp-form">
                      <div className="wp-form__field">
                        <label>English Title</label>
                        <input
                          type="text"
                          placeholder="Title"
                          value={newBlog.title}
                          onChange={e => setNewBlog({...newBlog, title: e.target.value})}
                          required
                        />
                      </div>
                      <div className="wp-form__field">
                        <label>Bengali Script Subtitle</label>
                        <input
                          type="text"
                          placeholder="e.g. পাঁচ ফোড়নের ইতিহাস"
                          value={newBlog.titleBn}
                          onChange={e => setNewBlog({...newBlog, titleBn: e.target.value})}
                        />
                      </div>
                      <div className="wp-form__field-row">
                        <div className="wp-form__field">
                          <label>Author</label>
                          <input
                            type="text"
                            placeholder="Founder"
                            value={newBlog.author}
                            onChange={e => setNewBlog({...newBlog, author: e.target.value})}
                          />
                        </div>
                        <div className="wp-form__field">
                          <label>Pillar Category</label>
                          <select
                            value={newBlog.pillar}
                            onChange={e => setNewBlog({...newBlog, pillar: e.target.value})}
                          >
                            <option value="Memory">Memory (Pillar)</option>
                            <option value="Knowledge">Knowledge (Pillar)</option>
                          </select>
                        </div>
                      </div>
                      <div className="wp-form__field">
                        <label>Story Content</label>
                        <textarea
                          rows="6"
                          placeholder="Write the narrative here..."
                          value={newBlog.content}
                          onChange={e => setNewBlog({...newBlog, content: e.target.value})}
                          required
                        />
                      </div>
                      <button type="submit" className="wp-btn wp-btn--primary">Publish Story</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              GATEWAY CONFIG
             ══════════════════════════════════════ */}
          {activeTab === 'payment' && (
            <div className="wp-tab fadeIn" key="payment">
              <h1 className="wp-admin__title">Payment Settings</h1>
              
              <div className="wp-widget" style={{ maxWidth: '600px' }}>
                <div className="wp-widget__header">
                  <h3>Active Payment Methods</h3>
                </div>
                <div className="wp-widget__body">
                  <div className="wp-gateways">
                    
                    {/* UPI */}
                    <div className="wp-gateway-row">
                      <div className="wp-gateway-info">
                        <strong>UPI Payments</strong>
                        <span className="text-muted text-xs d-block">Enable scan and pay simulated checkout</span>
                      </div>
                      <label className="wp-switch">
                        <input
                          type="checkbox"
                          checked={paymentConfig.upiEnabled}
                          onChange={() => handlePaymentToggle('upiEnabled')}
                        />
                        <span className="wp-switch__slider" />
                      </label>
                    </div>
                    
                    {paymentConfig.upiEnabled && (
                      <div className="wp-gateway-config-box">
                        <div className="wp-form__field">
                          <label>Merchant UPI ID</label>
                          <input
                            type="text"
                            placeholder="e.g. banglarswad@okhdfc"
                            value={paymentConfig.upiId}
                            onChange={handleUpiIdChange}
                          />
                        </div>
                      </div>
                    )}

                    {/* Card */}
                    <div className="wp-gateway-row">
                      <div className="wp-gateway-info">
                        <strong>Credit / Debit Cards</strong>
                        <span className="text-muted text-xs d-block">Enable simulated manual card inputs</span>
                      </div>
                      <label className="wp-switch">
                        <input
                          type="checkbox"
                          checked={paymentConfig.cardEnabled}
                          onChange={() => handlePaymentToggle('cardEnabled')}
                        />
                        <span className="wp-switch__slider" />
                      </label>
                    </div>

                    {/* CoD */}
                    <div className="wp-gateway-row">
                      <div className="wp-gateway-info">
                        <strong>Cash on Delivery (CoD)</strong>
                        <span className="text-muted text-xs d-block">Allow delivery-partner payment collection</span>
                      </div>
                      <label className="wp-switch">
                        <input
                          type="checkbox"
                          checked={paymentConfig.codEnabled}
                          onChange={() => handlePaymentToggle('codEnabled')}
                        />
                        <span className="wp-switch__slider" />
                      </label>
                    </div>

                    {/* Razorpay */}
                    <div className="wp-gateway-row">
                      <div className="wp-gateway-info">
                        <strong>Razorpay Gateway</strong>
                        <span className="text-muted text-xs d-block">Enable Razorpay Secure Checkout</span>
                      </div>
                      <label className="wp-switch">
                        <input
                          type="checkbox"
                          checked={paymentConfig.razorpayEnabled}
                          onChange={() => handlePaymentToggle('razorpayEnabled')}
                        />
                        <span className="wp-switch__slider" />
                      </label>
                    </div>

                    {paymentConfig.razorpayEnabled && (
                      <div className="wp-gateway-config-box" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div className="wp-form__field">
                          <label>Razorpay Key ID</label>
                          <input
                            type="text"
                            placeholder="rzp_live_xxxxxxxx"
                            value={paymentConfig.razorpayKeyId || ''}
                            onChange={(e) => handleRazorpayChange('razorpayKeyId', e.target.value)}
                          />
                        </div>
                        <div className="wp-form__field">
                          <label>Razorpay Key Secret</label>
                          <input
                            type="password"
                            placeholder="••••••••••••"
                            value={paymentConfig.razorpayKeySecret || ''}
                            onChange={(e) => handleRazorpayChange('razorpayKeySecret', e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── Edit Product Details & Images Modal ── */}
      {editingProduct && (
        <div className="wp-modal-overlay">
          <div className="wp-modal">
            <div className="wp-modal__header">
              <h3>Edit Product: {editingProduct.name}</h3>
              <button className="wp-modal__close" onClick={() => setEditingProduct(null)}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateProduct(editingProduct);
              setEditingProduct(null);
              alert('Product details updated successfully!');
            }} className="wp-form">
              <div className="wp-modal__body">
                
                {/* Product Name */}
                <div className="wp-form__field">
                  <label>English Name</label>
                  <input
                    type="text"
                    value={editingProduct.name || ''}
                    onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                    required
                  />
                </div>

                {/* Bengali Name */}
                <div className="wp-form__field">
                  <label>Bengali Script Name</label>
                  <input
                    type="text"
                    value={editingProduct.bengaliName || ''}
                    onChange={e => setEditingProduct({...editingProduct, bengaliName: e.target.value})}
                  />
                </div>

                {/* Price & Weight Row */}
                <div className="wp-form__field-row">
                  <div className="wp-form__field">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.price || ''}
                      onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="wp-form__field">
                    <label>Weight</label>
                    <input
                      type="text"
                      value={editingProduct.weight || ''}
                      onChange={e => setEditingProduct({...editingProduct, weight: e.target.value})}
                    />
                  </div>
                </div>

                {/* Story */}
                <div className="wp-form__field">
                  <label>Label Story (2-3 lines)</label>
                  <textarea
                    rows="2"
                    value={editingProduct.story || ''}
                    onChange={e => setEditingProduct({...editingProduct, story: e.target.value})}
                  />
                </div>

                {/* Description */}
                <div className="wp-form__field">
                  <label>Detailed Description</label>
                  <textarea
                    rows="3"
                    value={editingProduct.description || ''}
                    onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                  />
                </div>

                {/* Ingredients */}
                <div className="wp-form__field">
                  <label>Ingredients (comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingProduct.ingredients) ? editingProduct.ingredients.join(', ') : ''}
                    onChange={e => setEditingProduct({
                      ...editingProduct, 
                      ingredients: e.target.value.split(',').map(s => s.trim())
                    })}
                  />
                </div>

                {/* Front Image Uploader */}
                <div className="wp-form__field">
                  <label>Front Image Path / URL</label>
                  <div className="wp-upload-input-group">
                    <input
                      type="text"
                      placeholder="e.g. /images/my-spice.png"
                      value={editingProduct.image || ''}
                      onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                      required
                    />
                    <label className="wp-upload-btn">
                      {uploadingField === 'editFront' ? 'Uploading...' : 'Upload File 📁'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileUpload(e, 'editFront')}
                        style={{ display: 'none' }}
                        disabled={uploadingField !== null}
                      />
                    </label>
                  </div>
                </div>
                
                {/* Back Image Uploader */}
                <div className="wp-form__field">
                  <label>Back Image Path / URL (Optional)</label>
                  <div className="wp-upload-input-group">
                    <input
                      type="text"
                      placeholder="e.g. /images/my-spice-back.png"
                      value={editingProduct.backImage || ''}
                      onChange={e => setEditingProduct({...editingProduct, backImage: e.target.value})}
                    />
                    <label className="wp-upload-btn">
                      {uploadingField === 'editBack' ? 'Uploading...' : 'Upload File 📁'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileUpload(e, 'editBack')}
                        style={{ display: 'none' }}
                        disabled={uploadingField !== null}
                      />
                    </label>
                  </div>
                </div>

                {/* Image Previews */}
                <div className="wp-modal__preview-grid">
                  <div>
                    <strong>Front Preview:</strong>
                    {editingProduct.image ? (
                      <img src={editingProduct.image} alt="Front Preview" className="wp-modal__preview-img" onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : <p className="text-xs">No image specified</p>}
                  </div>
                  <div>
                    <strong>Back Preview:</strong>
                    {editingProduct.backImage ? (
                      <img src={editingProduct.backImage} alt="Back Preview" className="wp-modal__preview-img" onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : <p className="text-xs">No back image specified</p>}
                  </div>
                </div>

              </div>

              <div className="wp-modal__actions">
                <button type="button" className="wp-btn" onClick={() => setEditingProduct(null)}>Cancel</button>
                {editingProduct.backImage && (
                  <button 
                    type="button" 
                    className="wp-btn wp-btn--danger"
                    onClick={() => setEditingProduct({...editingProduct, backImage: ''})}
                  >
                    Remove Back Image
                  </button>
                )}
                <button type="submit" className="wp-btn wp-btn--primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
