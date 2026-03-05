'use strict';

/* ─────────────────────────────────────────────────────────────
   Configuration
   ──────────────────────────────────────────────────────────── */

// הכנס כאן את ה-URL של Google Sheets שלך:
// File → Share → Publish to web → בחר את הגיליון → CSV → פרסם → העתק URL
// דוגמה: https://docs.google.com/spreadsheets/d/e/PUBLISHED_ID/pub?output=csv
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1EmCB5CrcGE1mVm-_E4m4O9qqeTzoizGGtoZZOMhAdwk/export?format=csv&gid=1526695506';

// מספר טלפון ווטסאפ לקבלת הזמנות (פורמט בינלאומי, ללא +)
const WA_PHONE = '972502456233';

// מפתח localStorage לסל הקניות
const CART_KEY = 'bht_cart_v1';

/* ─────────────────────────────────────────────────────────────
   Categories
   ──────────────────────────────────────────────────────────── */
const CATEGORIES = ['הכל', 'מארזים', 'תבלינים', 'שתייה', 'טבע', 'אחר'];

/* ─────────────────────────────────────────────────────────────
   State
   ──────────────────────────────────────────────────────────── */
let allProducts = [];
let filteredProducts = [];
let cart = [];
let activeCategory = 'הכל';
let searchQuery = '';

/* ─────────────────────────────────────────────────────────────
   Demo Products (fallback when no Sheet URL set or fetch fails)
   ──────────────────────────────────────────────────────────── */
const DEMO_PRODUCTS = [
  { id: 'd1',  name: 'כמון טחון במקום',       description: 'כמון שלם נטחן לפי הזמנה — ריחני, טרי ועשיר בטעם',        price: 18,  image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80&auto=format&fit=crop',  category: 'תבלינים', stock: 30, active: true },
  { id: 'd2',  name: 'פפריקה מעושנת',          description: 'פפריקה ספרדית מעושנת, מושלמת לבישול ולצלייה',            price: 22,  image: 'https://images.unsplash.com/photo-1545634057-c7c5b2efb8f2?w=400&q=80&auto=format&fit=crop',  category: 'תבלינים', stock: 25, active: true },
  { id: 'd3',  name: 'כורכום טחון',            description: 'כורכום טהור וטרי — מלא קורקומין וצבע זהב עשיר',          price: 20,  image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80&auto=format&fit=crop',  category: 'תבלינים', stock: 40, active: true },
  { id: 'd4',  name: 'הל טחון',                description: 'הל ירוק טחון — מיוחד לקפה, לאפייה ולתבשילים',           price: 25,  image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80&auto=format&fit=crop',  category: 'תבלינים', stock: 20, active: true },
  { id: 'd5',  name: 'תה זנגביל ולימון',       description: 'מיזוג מושלם של זנגביל טרי ולימון — מרענן ומחמם',        price: 35,  image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80&auto=format&fit=crop',  category: 'שתייה',   stock: 20, active: true },
  { id: 'd6',  name: 'קפה שחור טחון',          description: 'קפה ערבי מהמיטב, טחון במקום לטריות מרבית',              price: 45,  image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80&auto=format&fit=crop',  category: 'שתייה',   stock: 15, active: true },
  { id: 'd7',  name: 'תה נענע מיובש',          description: 'עלי נענע טריים מיובשים, מרגיע ומרענן לאחר הארוחה',     price: 28,  image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80&auto=format&fit=crop',  category: 'שתייה',   stock: 35, active: true },
  { id: 'd8',  name: 'עדשים ירוקות',           description: 'עדשים ירוקות איכותיות, עשירות חלבון וסיבים',            price: 15,  image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80&auto=format&fit=crop',  category: 'אחר',     stock: 50, active: true },
  { id: 'd9',  name: 'תמרים מג׳הול',           description: 'תמרים ענקיים, מתוקים ורכים — ישירות מהמקור',            price: 55,  image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80&auto=format&fit=crop',  category: 'אחר',     stock: 20, active: true },
  { id: 'd10', name: 'לפיד מרווה לבנה',        description: 'לטיהור המרחב ואנרגיה חיובית — במגוון גדלים',            price: 40,  image: 'https://images.unsplash.com/photo-1585388027440-0b7f0deede3a?w=400&q=80&auto=format&fit=crop',  category: 'טבע',     stock: 15, active: true },
  { id: 'd11', name: 'אבן קוורץ ורדרד',        description: 'אבן לאהבה ואנרגיה חיובית, גודל בינוני',                 price: 65,  image: 'https://images.unsplash.com/photo-1559181567-c3190100191d?w=400&q=80&auto=format&fit=crop',  category: 'טבע',     stock: 10, active: true },
  { id: 'd12', name: 'מארז תבלינים לבשר',      description: '5 תבלינים נבחרים לצלייה ולבישול בשר — מתנה מושלמת',   price: 95,  image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80&auto=format&fit=crop',  category: 'מארזים',  stock: 8,  active: true },
  { id: 'd13', name: 'מארז תה הרגעה',          description: '3 סוגי חליטות מרגיעות — מתנה בריאותית מיוחדת',         price: 85,  image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80&auto=format&fit=crop',  category: 'מארזים',  stock: 0,  active: true },
  { id: 'd14', name: 'פרג טחון במקום',         description: 'פרג טרי טחון לאפייה ולממרחים — ריחני ואיכותי',         price: 30,  image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80&auto=format&fit=crop',  category: 'אחר',     stock: 25, active: true },
  { id: 'd15', name: 'שקית אבני חן מעורבות',   description: 'שקיק עם 7 אבני חן לשמירה והגנה אישית',                 price: 75,  image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80&auto=format&fit=crop',  category: 'טבע',     stock: 12, active: true },
];

/* ─────────────────────────────────────────────────────────────
   Init
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', init);

async function init() {
  cart = loadCart();
  renderCategoryFilters();
  updateCartBadge();
  bindCartEvents();
  bindCheckoutEvents();
  bindSearch();
  await loadProducts();
}

/* ─────────────────────────────────────────────────────────────
   Data — fetch & parse
   ──────────────────────────────────────────────────────────── */
async function loadProducts() {
  showGridLoading();
  try {
    if (SHEET_CSV_URL) {
      const resp = await fetch(SHEET_CSV_URL);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const text = await resp.text();
      allProducts = parseCSV(text);
    } else {
      // אין URL — הצג מוצרי דמו
      allProducts = DEMO_PRODUCTS;
    }
  } catch (err) {
    console.warn('⚠️ לא ניתן לטעון מ-Google Sheets, מציג מוצרי דמו:', err.message);
    allProducts = DEMO_PRODUCTS;
  }

  // סנן רק מוצרים פעילים
  allProducts = allProducts.filter(p => p.active);
  filteredProducts = [...allProducts];
  renderProducts(filteredProducts);
}

function parseCSV(text) {
  const rows = text.trim().split('\n');
  if (rows.length < 2) return [];
  const products = [];
  for (let i = 1; i < rows.length; i++) {
    const cols = splitCSVRow(rows[i]);
    if (cols.length < 8) continue;
    const p = {
      id:          cols[0].trim(),
      name:        cols[1].trim(),
      description: cols[2].trim(),
      price:       parseFloat(cols[3]) || 0,
      image:       cols[4].trim(),
      category:    cols[5].trim(),
      stock:       parseInt(cols[6]) || 0,
      active:      cols[7].trim().toUpperCase() === 'TRUE',
    };
    if (p.id && p.name) products.push(p);
  }
  return products;
}

function splitCSVRow(row) {
  const cols = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < row.length; i++) {
    const c = row[i];
    if (c === '"') { inQ = !inQ; }
    else if (c === ',' && !inQ) { cols.push(cur.trim()); cur = ''; }
    else { cur += c; }
  }
  cols.push(cur.trim());
  return cols;
}

/* ─────────────────────────────────────────────────────────────
   Render — products
   ──────────────────────────────────────────────────────────── */
function showGridLoading() {
  const grid = document.getElementById('productsGrid');
  if (grid) grid.innerHTML = '<div class="shop-loading"><div class="shop-spinner"></div><p>טוען מוצרים...</p></div>';
}

function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  const countEl = document.getElementById('productCount');
  if (!grid) return;

  if (countEl) countEl.textContent = `${products.length} מוצרים`;

  if (!products.length) {
    grid.innerHTML = `
      <div class="shop-empty">
        <div class="shop-empty-icon">🔍</div>
        <h3>לא נמצאו מוצרים</h3>
        <p>נסו לחפש במילים אחרות או בחרו קטגוריה אחרת</p>
      </div>`;
    return;
  }

  grid.innerHTML = products.map(productCardHTML).join('');

  grid.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      addToCart(id);
      btn.classList.add('btn-added');
      btn.textContent = '✓ נוסף!';
      setTimeout(() => {
        btn.classList.remove('btn-added');
        btn.textContent = '+ הוסף לסל';
      }, 1500);
    });
  });
}

function productCardHTML(p) {
  const oos = p.stock === 0;
  const hasImg = p.image && p.image.startsWith('http');
  return `
    <div class="product-card-shop${oos ? ' out-of-stock' : ''}">
      <div class="pcs-image">
        ${hasImg
          ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" onerror="this.style.display='none'">`
          : `<div class="pcs-image-placeholder">🌿</div>`}
        ${oos ? '<div class="pcs-badge-oos">אזל המלאי</div>' : ''}
        ${p.category ? `<div class="pcs-category">${esc(p.category)}</div>` : ''}
      </div>
      <div class="pcs-body">
        <h3 class="pcs-name">${esc(p.name)}</h3>
        ${p.description ? `<p class="pcs-desc">${esc(p.description)}</p>` : ''}
        <div class="pcs-footer">
          <div class="pcs-price">₪${p.price}</div>
          <button class="btn-add-cart" data-id="${esc(p.id)}"
            ${oos ? 'disabled' : ''} aria-label="הוסף ${esc(p.name)} לסל">
            ${oos ? 'אזל המלאי' : '+ הוסף לסל'}
          </button>
        </div>
      </div>
    </div>`;
}

/* ─────────────────────────────────────────────────────────────
   Filters
   ──────────────────────────────────────────────────────────── */
function renderCategoryFilters() {
  const container = document.getElementById('categoryFilters');
  if (!container) return;
  container.innerHTML = CATEGORIES.map(cat =>
    `<button class="cat-btn${cat === activeCategory ? ' cat-btn--active' : ''}" data-cat="${cat}">${cat}</button>`
  ).join('');
  container.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      container.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('cat-btn--active'));
      btn.classList.add('cat-btn--active');
      applyFilters();
    });
  });
}

function bindSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', () => {
    searchQuery = input.value.trim().toLowerCase();
    applyFilters();
  });
}

function applyFilters() {
  filteredProducts = allProducts.filter(p => {
    const matchCat = activeCategory === 'הכל' || p.category === activeCategory;
    const matchSearch = !searchQuery
      || p.name.toLowerCase().includes(searchQuery)
      || (p.description || '').toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });
  renderProducts(filteredProducts);
}

/* ─────────────────────────────────────────────────────────────
   Cart — data operations
   ──────────────────────────────────────────────────────────── */
function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product || product.stock === 0) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1, name: product.name, price: product.price });
  }
  saveCart();
  updateCartBadge();
  renderCartSidebar();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartBadge();
  renderCartSidebar();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(0, item.qty + delta);
  if (item.qty === 0) cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartBadge();
  renderCartSidebar();
}

function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (_) {}
}

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
}

function cartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
function cartCount() { return cart.reduce((s, i) => s + i.qty, 0); }

/* ─────────────────────────────────────────────────────────────
   Cart — UI
   ──────────────────────────────────────────────────────────── */
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const count = cartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

function openCart() {
  renderCartSidebar();
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (sidebar) sidebar.classList.add('cart-open');
  if (overlay) overlay.classList.add('overlay-visible');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (sidebar) sidebar.classList.remove('cart-open');
  if (overlay) overlay.classList.remove('overlay-visible');
  document.body.style.overflow = '';
}

function bindCartEvents() {
  const toggle = document.getElementById('cartToggle');
  const close  = document.getElementById('cartClose');
  const overlay = document.getElementById('cartOverlay');
  if (toggle)  toggle.addEventListener('click', openCart);
  if (close)   close.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeCart);
}

function renderCartSidebar() {
  const body   = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  if (!body || !footer) return;

  if (!cart.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>הסל ריק</p>
        <p class="cart-empty-sub">הוסיפו מוצרים מהחנות</p>
      </div>`;
    footer.innerHTML = '';
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="ci-info">
        <div class="ci-name">${esc(item.name)}</div>
        <div class="ci-price">₪${item.price} ליחידה · סה"כ ₪${item.price * item.qty}</div>
      </div>
      <div class="ci-controls">
        <button class="ci-btn" data-action="dec"    data-id="${item.id}" aria-label="הפחת">−</button>
        <span class="ci-qty">${item.qty}</span>
        <button class="ci-btn" data-action="inc"    data-id="${item.id}" aria-label="הוסף">+</button>
        <button class="ci-btn ci-btn--remove" data-action="remove" data-id="${item.id}" aria-label="הסר">✕</button>
      </div>
    </div>`).join('');

  footer.innerHTML = `
    <div class="cart-total">
      <span>סה"כ:</span>
      <span class="cart-total-amount">₪${cartTotal()}</span>
    </div>
    <button class="btn-checkout" id="checkoutBtn">📲 הזמן בווטסאפ</button>
    <button class="btn-clear-cart" id="clearCartBtn">רוקן סל</button>`;

  // qty controls
  body.querySelectorAll('.ci-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { action, id } = btn.dataset;
      if (action === 'inc')    updateQty(id, 1);
      else if (action === 'dec') updateQty(id, -1);
      else if (action === 'remove') removeFromCart(id);
    });
  });

  const checkoutBtn = document.getElementById('checkoutBtn');
  const clearBtn    = document.getElementById('clearCartBtn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
  if (clearBtn) clearBtn.addEventListener('click', () => {
    cart = []; saveCart(); updateCartBadge(); renderCartSidebar();
  });
}

/* ─────────────────────────────────────────────────────────────
   Checkout — modal
   ──────────────────────────────────────────────────────────── */
function bindCheckoutEvents() {
  const closeBtn  = document.getElementById('checkoutClose');
  const overlay   = document.getElementById('checkoutOverlay');
  const form      = document.getElementById('checkoutForm');
  if (closeBtn) closeBtn.addEventListener('click', closeCheckout);
  if (overlay)  overlay.addEventListener('click', closeCheckout);
  if (form)     form.addEventListener('submit', e => { e.preventDefault(); submitOrder(); });
}

function openCheckout() {
  closeCart();
  renderOrderSummary();
  const modal   = document.getElementById('checkoutModal');
  const overlay = document.getElementById('checkoutOverlay');
  if (modal)   modal.classList.add('modal-open');
  if (overlay) overlay.classList.add('overlay-visible');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  const modal   = document.getElementById('checkoutModal');
  const overlay = document.getElementById('checkoutOverlay');
  if (modal)   modal.classList.remove('modal-open');
  if (overlay) overlay.classList.remove('overlay-visible');
  document.body.style.overflow = '';
}

function renderOrderSummary() {
  const el = document.getElementById('orderSummary');
  if (!el) return;
  el.innerHTML = `
    <h3>📦 סיכום הזמנה</h3>
    ${cart.map(i => `
      <div class="order-summary-item">
        <span>${esc(i.name)} ×${i.qty}</span>
        <span>₪${i.price * i.qty}</span>
      </div>`).join('')}
    <div class="order-summary-total">
      <span>סה"כ לתשלום:</span>
      <span>₪${cartTotal()}</span>
    </div>`;
}

/* ─────────────────────────────────────────────────────────────
   WhatsApp message builder
   ──────────────────────────────────────────────────────────── */
function buildWhatsAppMessage(name, phone, address, notes) {
  const itemLines = cart.map(i => `• ${i.name} ×${i.qty} — ₪${i.price * i.qty}`).join('\n');
  let msg = `🛒 הזמנה חדשה — בית התבלין והטבע\n\n`;
  msg += `👤 שם: ${name}\n`;
  msg += `📞 טלפון: ${phone}\n`;
  if (address) msg += `📍 כתובת: ${address}\n`;
  msg += `\n📦 פריטים:\n${itemLines}\n`;
  msg += `\n💰 סה"כ: ₪${cartTotal()}`;
  if (notes) msg += `\n📝 הערות: ${notes}`;
  return msg;
}

function submitOrder() {
  const name    = document.getElementById('fieldName').value.trim();
  const phone   = document.getElementById('fieldPhone').value.trim();
  const address = document.getElementById('fieldAddress').value.trim();
  const notes   = document.getElementById('fieldNotes').value.trim();

  if (!name || !phone) return; // HTML validation handles this

  const msg = buildWhatsAppMessage(name, phone, address, notes);
  const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener,noreferrer');

  // Clear cart & close
  cart = [];
  saveCart();
  updateCartBadge();
  closeCheckout();

  // Reset form
  const form = document.getElementById('checkoutForm');
  if (form) form.reset();

  showToast('✅ ווטסאפ נפתח! שלח את ההודעה לסיום ההזמנה');
}

/* ─────────────────────────────────────────────────────────────
   Toast notification
   ──────────────────────────────────────────────────────────── */
function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'shop-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('toast-show')));
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

/* ─────────────────────────────────────────────────────────────
   Utility
   ──────────────────────────────────────────────────────────── */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
