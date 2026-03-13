/* ============================================
   i18n.js — Translations (HE / EN / RU)
   פשפשים — Trilingual Support
   ============================================ */

const TRANSLATIONS = {
  he: {
    dir: 'rtl',
    lang: 'he',

    /* Navbar */
    nav_home: 'בית',
    nav_shop: 'חנות',
    nav_deals: 'מבצעים',
    nav_secondhand: 'יד שנייה',
    nav_contact: 'צור קשר',
    nav_cta: 'WhatsApp',

    /* Hero */
    hero_badge: '🔥 מוצרים חמים',
    hero_title: 'פשפשים',
    hero_subtitle: 'מציאות אמיתיות מ-Amazon ו-AliExpress + יד שנייה איכותית',
    hero_cta_shop: 'לחנות',
    hero_cta_contact: 'צור קשר',

    /* Stats */
    stat_products: 'מוצרים',
    stat_categories: 'קטגוריות',
    stat_platforms: 'פלטפורמות',
    stat_savings: 'חיסכון ממוצע',

    /* Sections */
    section_categories: 'קטגוריות',
    section_categories_sub: 'מצא את מה שאתה מחפש',
    section_deals: '🔥 מבצעי אפיליאייט',
    section_deals_sub: 'המוצרים הכי חמים מ-Amazon ו-AliExpress',
    section_secondhand: '♻️ יד שנייה',
    section_secondhand_sub: 'מוצרים אישיים — מצב מצוין, מחיר הגון',
    section_how: 'איך זה עובד?',
    section_how_sub: 'קל, מהיר, ובלי סיבוכים',
    see_all: 'צפה בכל המוצרים',

    /* How it works */
    how1_title: 'גלה מוצרים',
    how1_desc: 'עיין בקטלוג המוצרים שלנו — מבצעי Amazon, AliExpress ויד שנייה',
    how2_title: 'בחר ורכוש',
    how2_desc: 'לחץ על מוצר אפיליאייט לרכישה ישירה, או פנה אלינו ב-WhatsApp ליד שנייה',
    how3_title: 'קבל ביתך',
    how3_desc: 'מוצרי אפיליאייט מגיעים עד הבית. יד שנייה — תיאום מסירה בקלות',

    /* WhatsApp CTA */
    wa_title: 'שאלה? נשמח לעזור!',
    wa_desc: 'שלח לנו הודעה ב-WhatsApp לכל שאלה על מוצר, תיאום מסירה, או הצעת מחיר',
    wa_btn: 'פתח WhatsApp',

    /* Shop */
    shop_hero_title: 'כל המוצרים',
    shop_search: 'חיפוש מוצרים...',
    filter_all: 'הכל',
    filter_affiliate: '🔗 מבצעים',
    filter_secondhand: '♻️ יד שנייה',
    sort_label: 'מיון:',
    sort_newest: 'חדש ביותר',
    sort_price_asc: 'מחיר: נמוך לגבוה',
    sort_price_desc: 'מחיר: גבוה לנמוך',
    sort_discount: 'הנחה הגבוהה ביותר',
    cat_all: 'הכל',
    cat_tech: 'טכנולוגיה',
    cat_fashion: 'אופנה',
    cat_home: 'בית',
    cat_sport: 'ספורט',
    cat_books: 'ספרים',
    cat_kids: 'ילדים',
    cat_gaming: 'גיימינג',
    cat_tools: 'כלים',
    cat_health: 'בריאות',
    cat_other: 'אחר',
    no_results: 'לא נמצאו מוצרים',
    no_results_sub: 'נסה לשנות את הפילטרים או חפש משהו אחר',

    /* Product card */
    btn_buy: 'קנה עכשיו',
    btn_contact: 'צור קשר',
    label_condition: 'מצב:',
    label_platform: 'פלטפורמה:',
    badge_new: 'חדש',
    badge_hot: '🔥 חם',
    badge_sale: '🏷️ מבצע',
    badge_used: 'יד שנייה',

    /* Footer */
    footer_desc: 'מציאות אמיתיות מ-Amazon, AliExpress ועוד — ומוצרי יד שנייה מכל הלב.',
    footer_links: 'קישורים',
    footer_contact_title: 'צור קשר',
    footer_rights: '© 2025 פשפשים. כל הזכויות שמורות.',
    footer_credit: 'נבנה ע"י SLAVX.SITE',
  },

  en: {
    dir: 'ltr',
    lang: 'en',

    nav_home: 'Home',
    nav_shop: 'Shop',
    nav_deals: 'Deals',
    nav_secondhand: 'Secondhand',
    nav_contact: 'Contact',
    nav_cta: 'WhatsApp',

    hero_badge: '🔥 Hot Products',
    hero_title: 'פשפשים',
    hero_subtitle: 'Real deals from Amazon & AliExpress + Quality secondhand items',
    hero_cta_shop: 'Shop Now',
    hero_cta_contact: 'Contact Us',

    stat_products: 'Products',
    stat_categories: 'Categories',
    stat_platforms: 'Platforms',
    stat_savings: 'Avg. Savings',

    section_categories: 'Categories',
    section_categories_sub: 'Find what you\'re looking for',
    section_deals: '🔥 Affiliate Deals',
    section_deals_sub: 'The hottest products from Amazon & AliExpress',
    section_secondhand: '♻️ Secondhand',
    section_secondhand_sub: 'Personal items — great condition, fair price',
    section_how: 'How It Works',
    section_how_sub: 'Simple, fast, no hassle',
    see_all: 'View All Products',

    how1_title: 'Browse Products',
    how1_desc: 'Explore our catalog — Amazon & AliExpress deals and secondhand items',
    how2_title: 'Choose & Buy',
    how2_desc: 'Click affiliate products to buy directly, or contact us on WhatsApp for secondhand',
    how3_title: 'Receive It',
    how3_desc: 'Affiliate items ship to your door. Secondhand — easy pickup coordination',

    wa_title: 'Got a Question?',
    wa_desc: 'Send us a WhatsApp message for any product question, pickup coordination, or price offer',
    wa_btn: 'Open WhatsApp',

    shop_hero_title: 'All Products',
    shop_search: 'Search products...',
    filter_all: 'All',
    filter_affiliate: '🔗 Deals',
    filter_secondhand: '♻️ Secondhand',
    sort_label: 'Sort:',
    sort_newest: 'Newest',
    sort_price_asc: 'Price: Low to High',
    sort_price_desc: 'Price: High to Low',
    sort_discount: 'Biggest Discount',
    cat_all: 'All',
    cat_tech: 'Tech',
    cat_fashion: 'Fashion',
    cat_home: 'Home',
    cat_sport: 'Sports',
    cat_books: 'Books',
    cat_kids: 'Kids',
    cat_gaming: 'Gaming',
    cat_tools: 'Tools',
    cat_health: 'Health',
    cat_other: 'Other',
    no_results: 'No products found',
    no_results_sub: 'Try adjusting filters or search for something else',

    btn_buy: 'Buy Now',
    btn_contact: 'Contact',
    label_condition: 'Condition:',
    label_platform: 'Platform:',
    badge_new: 'New',
    badge_hot: '🔥 Hot',
    badge_sale: '🏷️ Sale',
    badge_used: 'Secondhand',

    footer_desc: 'Real deals from Amazon, AliExpress and more — plus quality secondhand items.',
    footer_links: 'Links',
    footer_contact_title: 'Contact',
    footer_rights: '© 2025 פשפשים. All rights reserved.',
    footer_credit: 'Built by SLAVX.SITE',
  },

  ru: {
    dir: 'ltr',
    lang: 'ru',

    nav_home: 'Главная',
    nav_shop: 'Магазин',
    nav_deals: 'Акции',
    nav_secondhand: 'Б/У товары',
    nav_contact: 'Контакты',
    nav_cta: 'WhatsApp',

    hero_badge: '🔥 Горячие товары',
    hero_title: 'פשפשים',
    hero_subtitle: 'Настоящие скидки с Amazon и AliExpress + качественные б/у товары',
    hero_cta_shop: 'В магазин',
    hero_cta_contact: 'Связаться',

    stat_products: 'Товаров',
    stat_categories: 'Категорий',
    stat_platforms: 'Платформ',
    stat_savings: 'Средняя экономия',

    section_categories: 'Категории',
    section_categories_sub: 'Найдите то, что ищете',
    section_deals: '🔥 Партнёрские акции',
    section_deals_sub: 'Самые горячие товары с Amazon и AliExpress',
    section_secondhand: '♻️ Б/У товары',
    section_secondhand_sub: 'Личные вещи — отличное состояние, честная цена',
    section_how: 'Как это работает?',
    section_how_sub: 'Просто, быстро, без лишних хлопот',
    see_all: 'Посмотреть все товары',

    how1_title: 'Просматривайте',
    how1_desc: 'Изучайте наш каталог — акции Amazon, AliExpress и б/у товары',
    how2_title: 'Выбирайте',
    how2_desc: 'Нажмите на партнёрский товар для покупки или свяжитесь через WhatsApp для б/у',
    how3_title: 'Получайте',
    how3_desc: 'Партнёрские товары доставляются домой. Б/У — лёгкая координация получения',

    wa_title: 'Есть вопросы?',
    wa_desc: 'Напишите нам в WhatsApp по любому вопросу о товаре, доставке или цене',
    wa_btn: 'Открыть WhatsApp',

    shop_hero_title: 'Все товары',
    shop_search: 'Поиск товаров...',
    filter_all: 'Все',
    filter_affiliate: '🔗 Акции',
    filter_secondhand: '♻️ Б/У',
    sort_label: 'Сортировка:',
    sort_newest: 'Новые',
    sort_price_asc: 'Цена: по возрастанию',
    sort_price_desc: 'Цена: по убыванию',
    sort_discount: 'Наибольшая скидка',
    cat_all: 'Все',
    cat_tech: 'Техника',
    cat_fashion: 'Мода',
    cat_home: 'Дом',
    cat_sport: 'Спорт',
    cat_books: 'Книги',
    cat_kids: 'Дети',
    cat_gaming: 'Игры',
    cat_tools: 'Инструменты',
    cat_health: 'Здоровье',
    cat_other: 'Другое',
    no_results: 'Товары не найдены',
    no_results_sub: 'Попробуйте изменить фильтры или найти что-то другое',

    btn_buy: 'Купить',
    btn_contact: 'Написать',
    label_condition: 'Состояние:',
    label_platform: 'Платформа:',
    badge_new: 'Новый',
    badge_hot: '🔥 Хит',
    badge_sale: '🏷️ Акция',
    badge_used: 'Б/У',

    footer_desc: 'Настоящие скидки с Amazon, AliExpress и других сайтов + качественные б/у товары.',
    footer_links: 'Ссылки',
    footer_contact_title: 'Контакты',
    footer_rights: '© 2025 פשפשים. Все права защищены.',
    footer_credit: 'Разработано SLAVX.SITE',
  }
};

/* ── Current language state ── */
let currentLang = localStorage.getItem('pshpsh_lang') || 'he';

function t(key) {
  return TRANSLATIONS[currentLang][key] || TRANSLATIONS['he'][key] || key;
}

function setLang(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem('pshpsh_lang', lang);

  const tr = TRANSLATIONS[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = tr.dir;
  document.body.classList.toggle('ltr', tr.dir === 'ltr');

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = tr[key] || TRANSLATIONS['he'][key] || key;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val;
    } else {
      el.textContent = val;
    }
  });

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const val = tr[key] || TRANSLATIONS['he'][key] || key;
    el.title = val;
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

/* ── Init on DOM ready ── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
  setLang(currentLang);
});
