/* ============================================
   shop.js — Product Catalog
   פשפשים — Google Sheets + Filters + WhatsApp
   ============================================ */

/* ── Google Sheets CSV URL ──
   1. פתח Google Sheets, צור גיליון עם העמודות בדיוק:
      id,name_he,name_en,name_ru,desc_he,desc_en,desc_ru,price,original_price,image,category,type,platform,link,condition,badge,active
   2. File → Share → Publish to web → CSV → Copy URL
   3. הדבק כאן: */
const SHEET_CSV_URL = '';

/* ── Fallback demo products ── */
const DEMO_PRODUCTS = [
  {
    id: '1', name_he: 'AirPods Pro 2', name_en: 'AirPods Pro 2', name_ru: 'AirPods Pro 2',
    desc_he: 'אוזניות אפל מקוריות עם ביטול רעשים מתקדם', desc_en: 'Apple AirPods Pro 2 with Active Noise Cancellation', desc_ru: 'Apple AirPods Pro 2 с активным шумоподавлением',
    price: '599', original_price: '799', image: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=400&q=80',
    category: 'tech', type: 'affiliate', platform: 'amazon', link: 'https://amazon.com', condition: '', badge: 'hot', active: 'TRUE'
  },
  {
    id: '2', name_he: 'שעון חכם Xiaomi Band 8', name_en: 'Xiaomi Band 8 Smart Watch', name_ru: 'Умный браслет Xiaomi Band 8',
    desc_he: 'צמיד כושר חכם עם מסך AMOLED ועד 16 יום סוללה', desc_en: 'Smart fitness band with AMOLED display and 16-day battery', desc_ru: 'Фитнес-браслет с AMOLED дисплеем и 16 днями работы',
    price: '89', original_price: '199', image: 'https://images.unsplash.com/photo-1557935728-e6d1eaabe558?w=400&q=80',
    category: 'tech', type: 'affiliate', platform: 'aliexpress', link: 'https://aliexpress.com', condition: '', badge: 'sale', active: 'TRUE'
  },
  {
    id: '3', name_he: 'רצועת LED RGB 10 מטר', name_en: 'RGB LED Strip 10m', name_ru: 'RGB LED лента 10м',
    desc_he: 'תאורת אווירה צבעונית עם שלט ואפליקציה', desc_en: 'Colorful ambient lighting with remote and app control', desc_ru: 'Цветное освещение с пультом и управлением через приложение',
    price: '39', original_price: '89', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    category: 'home', type: 'affiliate', platform: 'aliexpress', link: 'https://aliexpress.com', condition: '', badge: 'sale', active: 'TRUE'
  },
  {
    id: '4', name_he: 'נעלי ספורט Nike Air', name_en: 'Nike Air Sport Shoes', name_ru: 'Кроссовки Nike Air',
    desc_he: 'נעלי ריצה קלות עם בליעת זעזועים מתקדמת', desc_en: 'Lightweight running shoes with advanced cushioning', desc_ru: 'Лёгкие кроссовки для бега с улучшенной амортизацией',
    price: '249', original_price: '399', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    category: 'sport', type: 'affiliate', platform: 'amazon', link: 'https://amazon.com', condition: '', badge: 'hot', active: 'TRUE'
  },
  {
    id: '5', name_he: 'מקלדת מכנית Keychron K2', name_en: 'Keychron K2 Mechanical Keyboard', name_ru: 'Механическая клавиатура Keychron K2',
    desc_he: 'מקלדת מכנית אלחוטית עם תאורת RGB', desc_en: 'Wireless mechanical keyboard with RGB backlight', desc_ru: 'Беспроводная механическая клавиатура с RGB подсветкой',
    price: '349', original_price: '499', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
    category: 'tech', type: 'affiliate', platform: 'amazon', link: 'https://amazon.com', condition: '', badge: '', active: 'TRUE'
  },
  {
    id: '6', name_he: 'כוס תרמוס 500ml', name_en: 'Thermos Cup 500ml', name_ru: 'Термос 500мл',
    desc_he: 'שומרת חם/קר 12 שעות, נירוסטה, ידידותית לסביבה', desc_en: 'Keeps hot/cold 12 hours, stainless steel, eco-friendly', desc_ru: 'Сохраняет тепло/холод 12 часов, нержавеющая сталь',
    price: '29', original_price: '59', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
    category: 'home', type: 'affiliate', platform: 'aliexpress', link: 'https://aliexpress.com', condition: '', badge: '', active: 'TRUE'
  },
  {
    id: '7', name_he: 'iPad Air דור 5 — יד שנייה', name_en: 'iPad Air 5th Gen — Used', name_ru: 'iPad Air 5-е поколение — Б/У',
    desc_he: 'iPad Air 5 במצב מצוין, עם כיסוי. עובד כמו חדש!', desc_en: 'iPad Air 5 in excellent condition, with cover. Works like new!', desc_ru: 'iPad Air 5 в отличном состоянии, с чехлом. Работает как новый!',
    price: '900', original_price: '', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
    category: 'tech', type: 'secondhand', platform: '', link: '', condition: 'כמו חדש', badge: '', active: 'TRUE'
  },
  {
    id: '8', name_he: 'גיטרה אקוסטית Yamaha', name_en: 'Yamaha Acoustic Guitar', name_ru: 'Акустическая гитара Yamaha',
    desc_he: 'גיטרה אקוסטית יפה, מצב טוב, מגיעה עם תיק', desc_en: 'Beautiful acoustic guitar, good condition, comes with bag', desc_ru: 'Красивая акустическая гитара, хорошее состояние, с чехлом',
    price: '350', original_price: '', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80',
    category: 'other', type: 'secondhand', platform: '', link: '', condition: 'טוב', badge: '', active: 'TRUE'
  },
  {
    id: '9', name_he: 'מצלמת LEGO Creator 3-in-1', name_en: 'LEGO Creator 3-in-1', name_ru: 'LEGO Creator 3-в-1',
    desc_he: 'סט לגו שלם עם הוראות, לא חסר אף חלק', desc_en: 'Complete LEGO set with instructions, no missing pieces', desc_ru: 'Полный набор LEGO с инструкциями, все детали на месте',
    price: '120', original_price: '', image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=400&q=80',
    category: 'kids', type: 'secondhand', platform: '', link: '', condition: 'כמו חדש', badge: '', active: 'TRUE'
  },
  {
    id: '10', name_he: 'קורקינט חשמלי Xiaomi', name_en: 'Xiaomi Electric Scooter', name_ru: 'Электросамокат Xiaomi',
    desc_he: 'קורקינט חשמלי Xiaomi Mi Pro 2, מצב עובד, מספר שריטות קלות', desc_en: 'Xiaomi Mi Pro 2 electric scooter, working, minor scratches', desc_ru: 'Электросамокат Xiaomi Mi Pro 2, рабочий, небольшие царапины',
    price: '1200', original_price: '', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    category: 'sport', type: 'secondhand', platform: '', link: '', condition: 'טוב', badge: '', active: 'TRUE'
  },
  {
    id: '11', name_he: 'ספרי קוד Python + JavaScript', name_en: 'Python + JavaScript Books', name_ru: 'Книги Python + JavaScript',
    desc_he: 'שלושה ספרי תכנות בעברית, כמעט ולא השתמשתי', desc_en: 'Three programming books in Hebrew, barely used', desc_ru: 'Три книги по программированию на иврите, почти не использовались',
    price: '80', original_price: '', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    category: 'books', type: 'secondhand', platform: '', link: '', condition: 'טוב', badge: '', active: 'TRUE'
  },
  {
    id: '12', name_he: 'אוזניות Sony WH-1000XM4', name_en: 'Sony WH-1000XM4 Headphones', name_ru: 'Наушники Sony WH-1000XM4',
    desc_he: 'אוזניות Sony פרמיום עם ביטול רעשים — הטובות בקטגוריה', desc_en: 'Sony premium headphones with noise cancellation — best in class', desc_ru: 'Премиум наушники Sony с шумоподавлением — лучшие в классе',
    price: '799', original_price: '1299', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    category: 'tech', type: 'affiliate', platform: 'amazon', link: 'https://amazon.com', condition: '', badge: 'hot', active: 'TRUE'
  },
];

/* ── State ── */
let allProducts = [];
let filteredProducts = [];
let activeType = 'all';
let activeCategory = 'all';
let searchQuery = '';
let sortBy = 'newest';

/* ── CSV Parser ── */
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const vals = [];
    let inQuote = false, cur = '';
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQuote = !inQuote; }
      else if (line[i] === ',' && !inQuote) { vals.push(cur); cur = ''; }
      else { cur += line[i]; }
    }
    vals.push(cur);
    const obj = {};
    headers.forEach((h, i) => obj[h] = (vals[i] || '').trim());
    return obj;
  }).filter(p => p.id && p.active === 'TRUE');
}

/* ── Fetch ── */
async function fetchProducts() {
  if (!SHEET_CSV_URL) {
    allProducts = DEMO_PRODUCTS;
    applyFilters();
    return;
  }
  try {
    const res = await fetch(SHEET_CSV_URL);
    if (!res.ok) throw new Error('fetch failed');
    const text = await res.text();
    allProducts = parseCSV(text);
    if (!allProducts.length) allProducts = DEMO_PRODUCTS;
  } catch {
    allProducts = DEMO_PRODUCTS;
  }
  applyFilters();
}

/* ── Filter + Sort ── */
function applyFilters() {
  let list = [...allProducts];

  if (activeType !== 'all') list = list.filter(p => p.type === activeType);
  if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(p =>
      [p.name_he, p.name_en, p.name_ru, p.desc_he, p.desc_en, p.desc_ru, p.category]
        .some(v => v && v.toLowerCase().includes(q))
    );
  }

  switch (sortBy) {
    case 'price_asc':  list.sort((a, b) => +a.price - +b.price); break;
    case 'price_desc': list.sort((a, b) => +b.price - +a.price); break;
    case 'discount':
      list.sort((a, b) => {
        const da = a.original_price ? ((+a.original_price - +a.price) / +a.original_price) : 0;
        const db = b.original_price ? ((+b.original_price - +b.price) / +b.original_price) : 0;
        return db - da;
      });
      break;
    default: /* newest = original order */ break;
  }

  filteredProducts = list;
  renderProducts();
  updateCount();
}

/* ── Render ── */
function getProductName(p) {
  const lang = window.currentLang || 'he';
  return p[`name_${lang}`] || p.name_he || p.name_en || '';
}
function getProductDesc(p) {
  const lang = window.currentLang || 'he';
  return p[`desc_${lang}`] || p.desc_he || p.desc_en || '';
}

function getPlatformLabel(platform) {
  const map = { amazon: 'Amazon', aliexpress: 'AliExpress', ebay: 'eBay', other: 'Other' };
  return map[platform?.toLowerCase()] || platform || '';
}

function getPlatformClass(platform) {
  const map = { amazon: 'amazon', aliexpress: 'aliexpress', ebay: 'ebay' };
  return map[platform?.toLowerCase()] || 'other';
}

function getBadgeHTML(p) {
  if (p.badge === 'hot') return `<span class="badge badge-hot">${t('badge_hot')}</span>`;
  if (p.badge === 'sale') return `<span class="badge badge-sale">${t('badge_sale')}</span>`;
  if (p.badge === 'new') return `<span class="badge badge-new">${t('badge_new')}</span>`;
  return '';
}

function getDiscountPct(p) {
  if (!p.original_price || !p.price) return 0;
  return Math.round((1 - +p.price / +p.original_price) * 100);
}

function renderProductCard(p) {
  const name = getProductName(p);
  const desc = getProductDesc(p);
  const isAffiliate = p.type === 'affiliate';
  const discount = getDiscountPct(p);
  const conditionLabel = p.condition ? `<span class="condition-badge">${p.condition}</span>` : '';
  const platformLabel = isAffiliate && p.platform
    ? `<span class="platform-badge ${getPlatformClass(p.platform)}">${getPlatformLabel(p.platform)}</span>` : '';

  const priceHTML = p.original_price
    ? `<span class="price-original">₪${(+p.original_price).toLocaleString()}</span>
       <span class="price-current">₪${(+p.price).toLocaleString()}</span>
       <span class="discount-pct">-${discount}%</span>`
    : `<span class="price-current">₪${(+p.price).toLocaleString()}</span>`;

  const ctaBtn = isAffiliate
    ? `<a href="${p.link}" target="_blank" rel="noopener sponsored" class="btn btn-primary btn-buy">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
         <span data-i18n="btn_buy">${t('btn_buy')}</span>
       </a>`
    : `<button onclick="contactProduct('${p.id}')" class="btn btn-whatsapp btn-buy">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.135.563 4.14 1.538 5.875L0 24l6.304-1.516A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.933 0-3.742-.522-5.292-1.432L2 22l1.448-4.572A9.963 9.963 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
         <span data-i18n="btn_contact">${t('btn_contact')}</span>
       </button>`;

  return `
    <article class="product-card reveal" data-id="${p.id}" data-type="${p.type}">
      <div class="card-image-wrap">
        <img src="${p.image || 'https://via.placeholder.com/400x300?text=No+Image'}"
             alt="${name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
        <div class="card-badges">
          ${getBadgeHTML(p)}
          ${platformLabel}
          ${conditionLabel}
        </div>
        <div class="card-type-indicator ${p.type}">
          ${p.type === 'affiliate' ? '🔗' : '♻️'}
        </div>
      </div>
      <div class="card-body">
        <p class="card-category">${t('cat_' + p.category) || p.category}</p>
        <h3 class="card-title">${name}</h3>
        <p class="card-desc">${desc}</p>
        <div class="card-footer">
          <div class="card-price">${priceHTML}</div>
          ${ctaBtn}
        </div>
      </div>
    </article>`;
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const empty = document.getElementById('emptyState');
  if (!grid) return;

  if (!filteredProducts.length) {
    grid.innerHTML = '';
    empty?.classList.remove('hidden');
    return;
  }
  empty?.classList.add('hidden');
  grid.innerHTML = filteredProducts.map(renderProductCard).join('');

  // Re-observe new cards for reveal animation
  grid.querySelectorAll('.reveal').forEach(el => {
    revealObserver?.observe(el);
  });
}

function updateCount() {
  const el = document.getElementById('productCount');
  if (el) el.textContent = filteredProducts.length;
}

/* ── Contact via WhatsApp ── */
function contactProduct(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  const name = getProductName(p);
  const lang = window.currentLang || 'he';
  const msgs = {
    he: `היי! ראיתי את "${name}" בפשפשים ואני מעוניין/ת. אפשר לקבל פרטים? 🙏`,
    en: `Hi! I saw "${name}" on פשפשים and I'm interested. Can I get more details? 🙏`,
    ru: `Привет! Я видел "${name}" на פשפשים и заинтересован. Можно подробнее? 🙏`,
  };
  openWhatsApp(msgs[lang] || msgs.he);
}
window.contactProduct = contactProduct;

/* ── Index page: featured products ── */
function renderFeatured(type, containerId, limit = 4) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const list = allProducts.filter(p => p.type === type).slice(0, limit);
  if (!list.length) { container.closest('section')?.classList.add('hidden'); return; }
  container.innerHTML = list.map(renderProductCard).join('');
  container.querySelectorAll('.reveal').forEach(el => revealObserver?.observe(el));
}

/* ── Shop page controls ── */
function initShopControls() {
  const searchEl = document.getElementById('searchInput');
  const sortEl = document.getElementById('sortSelect');

  searchEl?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    applyFilters();
  });

  sortEl?.addEventListener('change', (e) => {
    sortBy = e.target.value;
    applyFilters();
  });

  document.querySelectorAll('[data-filter-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeType = btn.dataset.filterType;
      document.querySelectorAll('[data-filter-type]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  document.querySelectorAll('[data-filter-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.filterCat;
      document.querySelectorAll('[data-filter-cat]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  // Re-render on lang change
  document.addEventListener('langchange', () => {
    applyFilters();
    const searchEl = document.getElementById('searchInput');
    if (searchEl) searchEl.placeholder = t('shop_search');
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', async () => {
  await fetchProducts();

  if (document.getElementById('productsGrid')) {
    initShopControls();
  }
  if (document.getElementById('featuredDeals')) {
    renderFeatured('affiliate', 'featuredDeals', 4);
    renderFeatured('secondhand', 'featuredSecondhand', 4);
  }
});

// Re-render featured on lang change (index page)
document.addEventListener('langchange', () => {
  if (document.getElementById('featuredDeals')) {
    renderFeatured('affiliate', 'featuredDeals', 4);
    renderFeatured('secondhand', 'featuredSecondhand', 4);
  }
});

// expose for inline reveal observer access
let revealObserver;
document.addEventListener('DOMContentLoaded', () => {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
});
