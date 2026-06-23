import { supabase } from './supabaseClient';

const isSupabaseConnected = () => supabase !== null;

/* ── Fallback Seed Data ── */
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
  upiId: 'banglarswad@okhdfc',
  razorpayEnabled: false,
  razorpayKeyId: '',
  razorpayKeySecret: ''
};

/* ── Database Service Object ── */
export const dbService = {
  
  // ── PRODUCTS ──
  async fetchProducts() {
    if (isSupabaseConnected()) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        
        // If Supabase is empty, seed defaults
        if (!data || data.length === 0) {
          await this.seedProducts();
          return DEFAULT_PRODUCTS;
        }

        return data.map(item => ({
          id: item.id,
          name: item.name,
          bengaliName: item.bengali_name,
          weight: item.weight,
          price: parseFloat(item.price),
          image: item.image,
          backImage: item.back_image,
          story: item.story,
          description: item.description,
          ingredients: item.ingredients,
          ingredients_note: item.ingredients_note
        }));
      } catch (err) {
        console.warn('Supabase fetchProducts failed, falling back to localStorage:', err);
      }
    }
    const saved = localStorage.getItem('bs_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  },

  async seedProducts() {
    try {
      const inserts = DEFAULT_PRODUCTS.map(p => ({
        id: p.id,
        name: p.name,
        bengali_name: p.bengaliName,
        weight: p.weight,
        price: p.price,
        image: p.image,
        back_image: p.backImage,
        story: p.story,
        description: p.description,
        ingredients: p.ingredients,
        ingredients_note: p.ingredientsNote
      }));
      const { error } = await supabase.from('products').insert(inserts);
      if (error) throw error;
    } catch (err) {
      console.error('Failed to seed Supabase products:', err);
    }
  },

  async addProduct(product) {
    if (isSupabaseConnected()) {
      try {
        const { error } = await supabase.from('products').insert([{
          id: product.id,
          name: product.name,
          bengali_name: product.bengaliName,
          weight: product.weight,
          price: product.price,
          image: product.image,
          back_image: product.backImage,
          story: product.story,
          description: product.description,
          ingredients: product.ingredients,
          ingredients_note: product.ingredientsNote
        }]);
        if (!error) return;
        throw error;
      } catch (err) {
        console.error('Supabase addProduct failed:', err);
        throw err;
      }
    }
  },

  async updateProduct(product) {
    if (isSupabaseConnected()) {
      try {
        const { error } = await supabase.from('products').update({
          name: product.name,
          bengali_name: product.bengaliName,
          weight: product.weight,
          price: product.price,
          image: product.image,
          back_image: product.backImage,
          story: product.story,
          description: product.description,
          ingredients: product.ingredients,
          ingredients_note: product.ingredientsNote
        }).eq('id', product.id);
        if (!error) return;
        throw error;
      } catch (err) {
        console.error('Supabase updateProduct failed:', err);
        throw err;
      }
    }
  },

  async deleteProduct(id) {
    if (isSupabaseConnected()) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) return;
        throw error;
      } catch (err) {
        console.error('Supabase deleteProduct failed:', err);
        throw err;
      }
    }
  },

  // ── ORDERS ──
  async fetchOrders() {
    if (isSupabaseConnected()) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;

        if (!data || data.length === 0) {
          await this.seedOrders();
          return DEFAULT_ORDERS;
        }

        return data.map(o => ({
          id: o.id,
          customerName: o.customer_name,
          email: o.email,
          phone: o.phone,
          address: o.address,
          items: o.items,
          subtotal: parseFloat(o.subtotal),
          discount: parseFloat(o.discount),
          total: parseFloat(o.total),
          status: o.status,
          date: o.date
        }));
      } catch (err) {
        console.warn('Supabase fetchOrders failed, falling back to localStorage:', err);
      }
    }
    const saved = localStorage.getItem('bs_orders');
    return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
  },

  async seedOrders() {
    try {
      const inserts = DEFAULT_ORDERS.map(o => ({
        id: o.id,
        customer_name: o.customerName,
        email: o.email,
        phone: o.phone,
        address: o.address,
        items: o.items,
        subtotal: o.subtotal,
        discount: o.discount,
        total: o.total,
        status: o.status,
        date: o.date
      }));
      const { error } = await supabase.from('orders').insert(inserts);
      if (error) throw error;
    } catch (err) {
      console.error('Failed to seed Supabase orders:', err);
    }
  },

  async addOrder(order) {
    if (isSupabaseConnected()) {
      try {
        const { error } = await supabase.from('orders').insert([{
          id: order.id,
          customer_name: order.customerName,
          email: order.email,
          phone: order.phone,
          address: order.address,
          items: order.items,
          subtotal: order.subtotal,
          discount: order.discount,
          total: order.total,
          status: order.status,
          date: order.date
        }]);
        if (!error) return;
        throw error;
      } catch (err) {
        console.error('Supabase addOrder failed:', err);
      }
    }
  },

  async updateOrderStatus(id, status) {
    if (isSupabaseConnected()) {
      try {
        const { error } = await supabase.from('orders').update({ status }).eq('id', id);
        if (!error) return;
        throw error;
      } catch (err) {
        console.error('Supabase updateOrderStatus failed:', err);
      }
    }
  },

  // ── COUPONS ──
  async fetchCoupons() {
    if (isSupabaseConnected()) {
      try {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;

        if (!data || data.length === 0) {
          await this.seedCoupons();
          return DEFAULT_COUPONS;
        }

        return data.map(c => ({
          code: c.code,
          type: c.type,
          value: parseFloat(c.value),
          active: c.active
        }));
      } catch (err) {
        console.warn('Supabase fetchCoupons failed, falling back to localStorage:', err);
      }
    }
    const saved = localStorage.getItem('bs_coupons');
    return saved ? JSON.parse(saved) : DEFAULT_COUPONS;
  },

  async seedCoupons() {
    try {
      const { error } = await supabase.from('coupons').insert(DEFAULT_COUPONS);
      if (error) throw error;
    } catch (err) {
      console.error('Failed to seed Supabase coupons:', err);
    }
  },

  async addCoupon(coupon) {
    if (isSupabaseConnected()) {
      try {
        const { error } = await supabase.from('coupons').insert([{
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          active: coupon.active
        }]);
        if (!error) return;
        throw error;
      } catch (err) {
        console.error('Supabase addCoupon failed:', err);
      }
    }
  },

  async toggleCoupon(code, active) {
    if (isSupabaseConnected()) {
      try {
        const { error } = await supabase.from('coupons').update({ active }).eq('code', code);
        if (!error) return;
        throw error;
      } catch (err) {
        console.error('Supabase toggleCoupon failed:', err);
      }
    }
  },

  // ── STORIES / BLOGS ──
  async fetchBlogs() {
    if (isSupabaseConnected()) {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;

        if (!data || data.length === 0) {
          await this.seedBlogs();
          return DEFAULT_BLOGS;
        }

        return data.map(b => ({
          id: b.id,
          title: b.title,
          titleBn: b.title_bn,
          author: b.author,
          pillar: b.pillar,
          content: b.content,
          readTime: b.read_time,
          date: b.date
        }));
      } catch (err) {
        console.warn('Supabase fetchBlogs failed, falling back to localStorage:', err);
      }
    }
    const saved = localStorage.getItem('bs_blogs');
    return saved ? JSON.parse(saved) : DEFAULT_BLOGS;
  },

  async seedBlogs() {
    try {
      const inserts = DEFAULT_BLOGS.map(b => ({
        id: b.id,
        title: b.title,
        title_bn: b.titleBn,
        author: b.author,
        pillar: b.pillar,
        content: b.content,
        read_time: b.readTime,
        date: b.date
      }));
      const { error } = await supabase.from('blogs').insert(inserts);
      if (error) throw error;
    } catch (err) {
      console.error('Failed to seed Supabase blogs:', err);
    }
  },

  async addBlog(blog) {
    if (isSupabaseConnected()) {
      try {
        const { error } = await supabase.from('blogs').insert([{
          id: blog.id,
          title: blog.title,
          title_bn: blog.titleBn,
          author: blog.author,
          pillar: blog.pillar,
          content: blog.content,
          read_time: blog.readTime,
          date: blog.date
        }]);
        if (!error) return;
        throw error;
      } catch (err) {
        console.error('Supabase addBlog failed:', err);
      }
    }
  },

  async deleteBlog(id) {
    if (isSupabaseConnected()) {
      try {
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if (!error) return;
        throw error;
      } catch (err) {
        console.error('Supabase deleteBlog failed:', err);
      }
    }
  },

  // ── GATEWAY CONFIG ──
  async fetchPaymentConfig() {
    if (isSupabaseConnected()) {
      try {
        const { data, error } = await supabase
          .from('payment_config')
          .select('*')
          .eq('id', 'default')
          .single();
        if (error && error.code !== 'PGRST116') throw error;
        
        if (!data) {
          await this.updatePaymentConfig(DEFAULT_PAYMENT_CONFIG);
          return DEFAULT_PAYMENT_CONFIG;
        }

        return {
          upiEnabled: data.upi_enabled,
          cardEnabled: data.card_enabled,
          codEnabled: data.cod_enabled,
          upiId: data.upi_id,
          razorpayEnabled: data.razorpay_enabled || false,
          razorpayKeyId: data.razorpay_key_id || '',
          razorpayKeySecret: data.razorpay_key_secret || ''
        };
      } catch (err) {
        console.warn('Supabase fetchPaymentConfig failed, falling back to localStorage:', err);
      }
    }
    const saved = localStorage.getItem('bs_payment_config');
    return saved ? JSON.parse(saved) : DEFAULT_PAYMENT_CONFIG;
  },

  async updatePaymentConfig(config) {
    if (isSupabaseConnected()) {
      try {
        const { error } = await supabase
          .from('payment_config')
          .upsert({
            id: 'default',
            upi_enabled: config.upiEnabled,
            card_enabled: config.cardEnabled,
            cod_enabled: config.codEnabled,
            upi_id: config.upiId,
            razorpay_enabled: config.razorpayEnabled,
            razorpay_key_id: config.razorpayKeyId,
            razorpay_key_secret: config.razorpayKeySecret,
            updated_at: new Date().toISOString()
          });
        if (!error) return;
        throw error;
      } catch (err) {
        console.error('Supabase updatePaymentConfig failed:', err);
        throw err;
      }
    }
  },

  async uploadProductImage(file) {
    if (isSupabaseConnected()) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
          
        return publicUrl;
      } catch (err) {
        console.warn('Supabase storage upload failed, falling back to Base64:', err);
      }
    }
    
    // Local fallback: convert to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
};
