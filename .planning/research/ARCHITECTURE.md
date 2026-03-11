# ARCHITECTURE — בית התבלין והטבע

*Research date: 2026-03-11*

---

## 1. Component Boundaries (What Talks to What)

### Shared between index.html and shop.html

Both pages load `style.css` + the shared nav/footer HTML. The following are **reusable components** that already exist in `style.css` and must stay there:

| Component | CSS classes | Used by |
|-----------|-------------|---------|
| Design tokens | `:root` variables | Both |
| Reset | `*, box-sizing` | Both |
| Navbar | `.navbar`, `.nav-inner`, `.nav-brand`, `.nav-links`, `.hamburger`, `.mobile-menu` | Both |
| Buttons | `.btn`, `.btn-primary`, `.btn-outline`, `.btn-whatsapp`, `.btn-shop` | Both |
| Section typography | `.section-label`, `.section-title`, `.section-sub`, `.section-header` | Both |
| WhatsApp float | `.wa-float`, `.wa-pulse`, `.wa-tooltip` | Both |
| Footer | `.footer`, `.footer-grid`, `.footer-bottom` | Both |
| Container | `.container` | Both |
| Reveal animations | `.reveal`, `.reveal-right`, `.reveal-left`, `.visible` | Both |

### Exclusive to shop.html (lives in shop.css)

| Component | CSS classes |
|-----------|-------------|
| Shop hero | `.shop-hero`, `.shop-hero-label` |
| Filter bar | `.filter-bar`, `.cat-btn`, `.cat-btn--active`, `#searchInput` |
| Products grid | `#productsGrid`, `.product-card-shop`, `.pcs-*` |
| Loading/empty | `.shop-loading`, `.shop-spinner`, `.shop-empty` |
| Cart button in nav | `.cart-btn-outer`, `#cartToggle`, `#cartBadge`, `.cart-text` |
| Overlay | `.shop-overlay` |
| Cart sidebar | `#cartSidebar`, `.cart-header`, `#cartBody`, `#cartFooter`, `.cart-item`, `.ci-*` |
| Checkout modal | `#checkoutModal`, `.modal-header`, `.modal-body`, `.order-summary`, `.checkout-form-group` |
| Toast | `.shop-toast` |

### Exclusive to index.html (lives in style.css)

| Component | CSS classes |
|-----------|-------------|
| Hero | `.hero`, `.hero-bg`, `.hero-content`, `.hero-title`, `.hero-badges`, `.hero-particles`, `.particle` |
| About | `.about`, `.about-grid`, `.about-stats`, `.stat`, `.about-card-float` |
| Products landing | `.products`, `.products-grid`, `.product-card`, `.pc-*` |
| Nature section | `.nature`, `.nature-grid`, `.nature-card`, `.nc-*` |
| Location | `.location`, `.location-grid`, `.loc-item`, `.hours-*`, `.map-wrap` |
| Contact | `.contact`, `.contact-bg`, `.contact-inner` |

---

## 2. CSS Architecture Recommendation

### Current State Assessment

**What is well done:**
- Design tokens in `:root` are comprehensive and clean. All motion, color, radius, shadow, and layout values are tokenized.
- `style.css` uses logical properties (`inset-inline-start`, `inset-block`) correctly for RTL — this is the right pattern.
- `shop.css` is genuinely mobile-first with `min-width` breakpoints throughout.
- `style.css` uses desktop-first `max-width` breakpoints — inconsistency between the two files.
- Transitions reference token variables (`var(--t-fast)`, `var(--t-mid)`) consistently.

**What needs fixing:**
- `style.css` uses `max-width` breakpoints (desktop-first). `shop.css` uses `min-width` (mobile-first). These should be unified to mobile-first across both files.
- `style.css` responsive section collapses `.products-grid` from 3-col to 1-col at 768px with no 2-col intermediate step — jarring on tablets.
- `.product-card` (index) and `.product-card-shop` (shop) are separate components with some style overlap. That is correct — they serve different layouts — but the hover pattern (`translateY(-6px)` vs `-3px`) should be standardized via a shared token or decision.
- The checkout modal and cart sidebar both have identical dark-header button styles (`#cartClose`, `#checkoutClose`) — this is a duplication candidate for a `.panel-close-btn` utility class.
- `style.css` hardcodes a WhatsApp green (`#25D366`) in four separate places. This should be a token: `--whatsapp: #25D366`.

### Recommended Layer Order (within each file)

```
1. Tokens (:root)          — already in style.css, correct
2. Reset                   — already present
3. Base (body, h1-h4, a)   — already present
4. Utilities (.container, .btn variants, .section-label, .reveal)
5. Layout (navbar, footer, wa-float) — shared components
6. Page-specific sections  — hero, about, products, nature, location, contact (style.css)
                           — shop-hero, filter-bar, grid, card, cart, modal (shop.css)
7. Responsive              — at bottom, mobile-first min-width queries
8. Animations / @keyframes — at bottom, grouped together
```

### RTL-Specific Patterns Found

The codebase already applies these RTL patterns correctly:
- `direction: rtl` on `body` — correct, cascades everywhere.
- Form inputs have `direction: rtl` re-declared — necessary because some browsers inherit incorrectly.
- `inset-inline-start/end` used for positioned elements — correct and already applied to `.wa-float`, `.wa-tooltip`, `.nav-links a::after`.
- `.hours-val` uses `direction: ltr; text-align: left` — correct for numeric time values that should read left-to-right even in RTL context.
- Cart badge uses `left: -6px` (physical property) rather than `inset-inline-end` — this is intentional since badge must appear on the visual left of the button regardless of direction. Keep as is.
- Icon placement in `.search-wrap .search-icon`: uses `right: 28px` (physical) — for an RTL search input, the icon should be on the right visually, so this is correct. However it uses a physical property; should be `inset-inline-end: 28px` for consistency.

**Patterns to adopt on improvement:**
- Prefer `inset-inline-start/end` and `padding-inline/block` over physical `left/right/top/bottom` for all new structural rules.
- `text-align: center` is direction-neutral — safe to use anywhere.
- For icon + text rows in RTL, use `flex-direction: row` with `gap` — flexbox handles RTL direction automatically without reversing the DOM order.

---

## 3. Animation Architecture

### Current Animations Inventory

| Animation | Technique | Performance |
|-----------|-----------|-------------|
| Reveal on scroll | IntersectionObserver + CSS `opacity + transform` | Excellent — GPU composited |
| Hero parallax | `requestAnimationFrame` + `ticking` flag + `transform` | Good — properly debounced |
| Hero particles | CSS `@keyframes particle-rise` on `transform + opacity` | Good — pure CSS, no JS per frame |
| Floating orb | CSS `@keyframes orb-drift` on `transform` | Excellent |
| About floating cards | CSS `@keyframes float-a` on `transform` | Excellent |
| Navbar scroll shrink | CSS `transition` triggered by JS class toggle | Excellent |
| Stat counters | `requestAnimationFrame` loop | Good — fires once via IntersectionObserver |
| Cart open/close | CSS `transition` on `right` property | Acceptable but see note below |
| Checkout modal open/close | CSS `transition` on `opacity + transform` | Excellent |
| Product card hover | CSS `transition: transform + box-shadow` | Excellent |
| WhatsApp pulse | CSS `@keyframes wa-ring` on `transform + opacity` | Excellent |

### Performance Issues to Fix

**Cart sidebar uses `right` property for slide animation:**
```css
/* current — causes layout recalculation */
#cartSidebar { right: -100%; }
#cartSidebar.cart-open { right: 0; }
```
Should be replaced with `transform: translateX(100%)` / `transform: translateX(0)`. The `right` property is not GPU-composited; `transform` is. On mobile this makes a visible difference.

**`prefers-reduced-motion` is respected in script.js for parallax and particles** — but not declared in CSS for `@keyframes`. Add:
```css
@media (prefers-reduced-motion: reduce) {
  .reveal, .reveal-right, .reveal-left { transition: none; }
  .particle { animation: none; }
  .wa-pulse { animation: none; }
  .about-card-float { animation: none; }
}
```

**Staggered reveal delays in style.css are hardcoded for nth-child:**
The current approach (`.products-grid .product-card:nth-child(n)`) works but breaks when new cards are added dynamically. For the shop page's dynamic product grid, stagger delays should be set inline via JS (e.g., `el.style.transitionDelay = index * 0.06 + 's'`) rather than CSS nth-child rules.

**`float-a` animation on `.about-card-float` elements:** These run continuously, 4 separate animations. They use only `transform: translateY` — GPU composited, acceptable. No change needed.

---

## 4. Cart State Management

### Current Implementation (localStorage)

**What is good:**
- Key namespaced: `bht_cart_v1` — good practice, allows schema migration by bumping version.
- `try/catch` around both `setItem` and `getItem` — handles private browsing and storage-full errors correctly.
- Cart stores `{ id, qty, name, price }` — name and price are snapshotted at add-time, which means display remains accurate even if the sheet is updated mid-session.
- `cartCount()` and `cartTotal()` are pure functions with no side effects.

**What needs improvement:**

1. **Stale price risk:** Cart persists across sessions (`localStorage`) but prices come from Google Sheets which could change. A cart item's saved `price` might differ from the current sheet price. On checkout, the WhatsApp message shows the saved price. This is acceptable for a WhatsApp-only store (owner can correct), but should be noted.

2. **No cart expiry:** A cart from 30 days ago will still appear. Consider adding a `savedAt` timestamp and clearing if older than N days:
   ```js
   // in loadCart():
   const data = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
   const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
   if (data.savedAt && Date.now() - data.savedAt > MAX_AGE_MS) return [];
   return data.items || [];
   ```

3. **`updateProductButtons()` does a full DOM query on every cart mutation:** `document.querySelectorAll('.btn-add-cart')` is called after every `addToCart`, `removeFromCart`, and `updateQty`. With 15-60 product cards this is acceptable, but it is O(n) DOM work. For the scale of this shop it is not a problem.

4. **`renderCartSidebar()` re-renders the entire cart body on every quantity change.** This means event listeners are detached and re-attached on every update. The current code handles this correctly (events are re-bound after `innerHTML` assignment), but it is fragile. A future improvement would be to update only the changed row. For this project's scale, the full re-render is fine.

5. **Cart and checkout share one overlay element (`#cartOverlay`) but the checkout has its own (`#checkoutOverlay`).** The naming and z-index layering are correct (cart z-index 400, checkout z-index 600, overlay z-index 300 for cart / 500 implied for checkout overlay). This is a clean design — no change needed.

### Cart Data Flow

```
User clicks "+ הוסף"
  → addToCart(id)
    → find product in allProducts[]
    → mutate cart[] in memory
    → saveCart() → localStorage
    → updateCartBadge()    (navbar badge count)
    → updateProductButtons() (card button text/style)
    → renderCartSidebar()   (sidebar HTML re-render)
    → NO auto-open of sidebar (intentional UX decision)

User opens sidebar
  → openCart()
    → renderCartSidebar() (ensures fresh render)
    → add .cart-open class
    → body overflow hidden

User submits order
  → submitOrder()
    → buildWhatsAppMessage()
    → window.open(wa.me URL)
    → clear cart
    → closeCheckout()
    → showToast()
```

---

## 5. Build Order for Improvements

Priority is determined by: user impact first, foundational work second.

### Phase 1 — Foundations (do first, enables everything else)

1. **Add `--whatsapp` color token to `:root` in `style.css`** — removes 4 hardcoded `#25D366` instances.
2. **Unify breakpoint direction** — convert `style.css` to mobile-first (`min-width`). This is a prerequisite for consistent responsive behavior across both pages.
3. **Fix cart sidebar animation** — change `right` transition to `transform: translateX` for GPU compositing.
4. **Add `prefers-reduced-motion` block** in both CSS files for all `@keyframes`.
5. **Add `.panel-close-btn` utility class** for the shared close-button style used in both cart header and checkout modal header — removes duplication.

### Phase 2 — index.html Visual Polish

6. **Products section responsive gap** — add a 2-col intermediate step at ~600-900px instead of jumping 3-col to 1-col.
7. **Hero improvements** — hero is structurally solid; focus on typography sizing and spacing polish.
8. **About section on mobile** — `.about-cards-col` is `display: none` at 1024px. The floating cards need a mobile-appropriate replacement (e.g., a simple horizontal scroll strip or a single featured card).
9. **Reveal animation refinements** — add inline transition-delay in `script.js` for dynamic elements rather than hardcoded nth-child CSS rules.

### Phase 3 — shop.html UX Polish

10. **Product card image support** — current `.pcs-icon-area` shows only emoji icons. If products have image URLs, add an `<img>` with a fallback to the emoji icon area.
11. **Cart item animation** — add a brief `transform + opacity` entrance animation for newly added cart items (CSS class toggled by JS after append).
12. **Checkout form validation UI** — add visible error states to required fields (`:invalid` + custom class) beyond the browser default.
13. **Empty search state improvement** — current empty state is generic; could show category shortcuts as quick-links back to browsing.

### Phase 4 — Cross-cutting Polish

14. **`inset-inline` migration** — replace remaining physical `left/right` properties used for structural layout with logical equivalents.
15. **Cart TTL / stale price warning** — add `savedAt` timestamp to stored cart; show a subtle notice if cart is older than 3 days.
16. **Performance audit** — verify no Cumulative Layout Shift from font loading (add `font-display: swap` or preconnect hints if missing from HTML `<head>`).

---

## 6. Key Architectural Constraints

- **No build step, no bundler.** All CSS must remain in two files. Cannot use PostCSS, SCSS, or CSS `@layer`. Organize with section comments (`/* ── Section ── */`) instead.
- **No JS framework.** All DOM manipulation must be vanilla JS. The current IIFE pattern in `script.js` is clean and should be continued for new features.
- **RTL-first, not RTL-as-afterthought.** Every new CSS rule should be written with RTL in mind from the start — use logical properties, avoid `text-align: left` unless specifically needed for LTR data (like time values).
- **Vercel static.** No server-side rendering, no API routes. The Google Sheets CSV fetch is the only external data source.
- **WhatsApp as the checkout.** No payment state to manage. Cart only needs to survive the session and the WhatsApp message builder needs to remain human-readable.
