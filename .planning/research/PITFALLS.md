# PITFALLS — Static Premium E-Commerce: What Commonly Goes Wrong

Research based on the בית התבלין והטבע codebase (shop.js, shop.css, style.css, script.js).
Each pitfall includes: detection warning sign, prevention strategy, relevant phase/area.

---

## 1. RTL-Specific Bugs

### 1.1 Physical vs. Logical CSS Properties — The Silent Flip Bug

**What breaks:** Mixing `left`/`right` with `inset-inline-start`/`inset-inline-end` in the same codebase. The current code already mixes both: navbar uses `inset-inline-start` correctly, but the cart sidebar uses `right: -100%` (physical), the checkout modal uses `left: 50%` (physical), and the toast uses `left: 50%`. This is fine while RTL is consistent, but the moment any wrapper gets `direction: ltr` (e.g., a price display, a phone number, an input field), physical properties anchor to the wrong side and logical properties flip — creating layout tears that are nearly impossible to debug by inspection alone.

**Warning sign:** Any element that uses both `right`/`left` and `inset-inline-*` in related rules. Also: adding `direction: ltr` to a child element (e.g., `.hours-val { direction: ltr }` already in style.css line 939) inside an RTL parent without isolating it with `unicode-bidi: isolate`.

**Prevention:**
- Pick one convention per element and stick to it. For RTL-only sites, physical `right`/`left` is fine if 100% of the site is RTL. Logical properties are better for future-proofing but must be used exclusively within a scope.
- Any LTR island (phone numbers, prices, URLs) must be wrapped: `<span dir="ltr" style="unicode-bidi: isolate">`.
- Test every new CSS rule in Firefox (which has the strictest RTL rendering) and in Chrome with DevTools direction override.

**Relevant phase:** Every CSS change on index.html and shop.html; especially adding new modals, drawers, or tooltip components.

---

### 1.2 CSS `transform-origin` and RTL — The Underline That Appears on the Wrong Side

**What breaks:** `transform-origin: right` in an RTL context does NOT automatically flip to `left`. The current `product-card::after` (the hover top-bar) uses `transform-origin: right` (style.css line 685). In a proper RTL premium layout, the bar should grow from the start (right in Hebrew), which it does — but if any redesign wraps these cards in an LTR container or changes the card to `transform-origin: left` for "variety," the bar crawls in from the wrong side and looks like a bug to native Hebrew readers.

**Warning sign:** Any `transform-origin` that uses `left` or `right` (not `start`/`end`). CSS does not have `transform-origin: inline-start` — this is a genuine gap in the spec. You must manually use `right` for RTL and `left` for LTR, or use `scaleX` with a consistent RTL assumption.

**Prevention:**
- Document the RTL assumption explicitly in comments next to every `transform-origin` rule.
- Never change card layout direction locally; change the overall `direction` at page root only.

**Relevant phase:** Any visual polish on product cards or section separators (index.html `product-card::after`).

---

### 1.3 Backdrop-filter and RTL Stacking Contexts

**What breaks:** `backdrop-filter` creates a new stacking context. In RTL layouts with fixed/sticky elements (navbar with `backdrop-filter: blur(20px)`, cart overlay with `backdrop-filter: blur(2px)`, nature cards with `backdrop-filter: blur(8px)`), adding MORE `backdrop-filter` elements can trigger z-index wars where Hebrew text disappears behind blur layers, or sticky filter bars stop being sticky because they're trapped inside a stacking context created by a parent with `transform` or `filter`.

**Warning sign:** A `position: sticky` element stops working after adding a premium glassmorphism effect to a parent. Or text becomes invisible on scroll. Check with DevTools "Layers" panel — if an RTL element has an unexpected composite layer, a `backdrop-filter` or `will-change` ancestor is the cause.

**Prevention:**
- Never apply `backdrop-filter`, `transform`, `filter`, or `will-change` to a direct ancestor of a `position: sticky` element.
- The filter bar (`position: sticky; top: var(--nav-h)`) is currently a direct child of `<body>` — safe. If ever moved inside a section with a fancy background effect, stickiness will break silently.
- Test stickiness after every CSS addition that uses these properties.

**Relevant phase:** Any premium visual upgrade to section backgrounds (especially shop hero and filter bar vicinity).

---

### 1.4 Gradient Direction in RTL — 135deg Is Not "Diagonal to Start"

**What breaks:** CSS gradient directions (`linear-gradient(135deg, ...)`) are always in the physical coordinate system — they do not flip in RTL. A gradient that sweeps "bottom-right to top-left" in a LTR design will appear exactly the same in RTL, which may look correct by accident, but if the design intent was "start to end," the premium feel is subtly wrong. The current design uses `135deg` throughout (buttons, cards, section backgrounds). This is consistent and looks fine — but adding a gradient meant to lead the eye toward the RTL reading start (right side) using `135deg` will actually lead the eye to the left, opposing reading direction.

**Warning sign:** A designer says "make the gradient flow toward the right (the Hebrew reading start)" and you write `linear-gradient(to right, ...)` — in RTL this flows toward the end of reading direction, not the start.

**Prevention:**
- Use `to inline-end` and `to inline-start` in `linear-gradient()` — these DO respect `direction: rtl`. Only angle-based gradients (`135deg`) are physical.
- Audit: replace any intentional directional gradients with logical equivalents (`to inline-start`, `to inline-end`).

**Relevant phase:** Premium visual polish on buttons, hero, card headers.

---

## 2. Over-Engineering Pitfalls

### 2.1 Adding a JS Framework "Just for the Shop UI"

**What breaks:** The entire value of this stack — zero dependencies, instant deploy, works offline — disappears. A common "improvement" is to pull in Alpine.js, Vue, or even React "just for reactivity." For a 15-product shop with a localStorage cart, this adds 40–200 KB to the bundle, requires a build step (or CDN dependency), and creates a mixed paradigm where half the JS is vanilla and half is framework.

**Warning sign:** Reaching for `v-model`, `x-data`, or component abstractions to solve a problem that a single event listener and a re-render function already solve.

**Prevention:**
- The current pattern (imperative render functions like `renderCartSidebar()`, `renderProducts()`) is correct and fast. Extend it, don't replace it.
- If state complexity grows, use a plain module pattern (a single state object + a single render dispatcher) before considering any framework.
- Maximum allowed external dependency for this project: zero at runtime (fonts and Cloudinary images are CDN assets, not code dependencies).

**Relevant phase:** Any shop.js enhancement.

---

### 2.2 CSS Custom Property Overuse — The Token That Breaks Cascade

**What breaks:** Adding deeply nested or contextual CSS custom properties that shadow the root tokens. For example, adding `--brown-500` at component level to "customize" a card's color creates a cascade where inspecting the computed value in DevTools shows the root token but the rendered color is the component override — making maintenance a hunt-and-find nightmare. The current design system is clean: all tokens live in `:root` and are used directly.

**Warning sign:** Any CSS rule that re-declares a variable from the design system (e.g., `.product-card { --shadow-md: ... }`). Also: adding CSS variables for one-off values that will never be reused (e.g., `--card-border-width-special: 3px`).

**Prevention:**
- Design tokens go in `:root` only.
- Component-specific values go inline in the rule, not as new variables.
- Run a periodic Grep for `{` following `--` in non-`:root` selectors.

**Relevant phase:** style.css and shop.css expansion during visual polish phase.

---

### 2.3 Adding a Build/Minification Step Without a Recovery Plan

**What breaks:** The `vercel.json` currently serves static files directly. Adding a build step (even a simple one like a CSS concat script or an image optimizer run via npm) creates a situation where the "source" and "deployed" states diverge. If the build script is lost, the site cannot be changed. For a small business site with no technical owner, this is a critical risk.

**Warning sign:** Any `package.json` script that must run before deploy. Any file named `dist/` or `build/` appearing in the repo.

**Prevention:**
- Keep the authoring source identical to the deployed artifact. CSS and JS are human-readable and served directly.
- If optimization is needed, use Vercel's built-in asset optimization (caching headers are already configured in `vercel.json`) or a one-time offline tool — but never a required build step.

**Relevant phase:** Deployment and infrastructure changes.

---

## 3. Mobile Regression Pitfalls

### 3.1 Desktop-First Media Query Additions Defeating the Mobile-First shop.css

**What breaks:** `shop.css` is explicitly mobile-first (all base styles target 320px, scale up with `min-width`). `style.css` is desktop-first (base styles target desktop, scale down with `max-width`). When improving index.html visuals, it is tempting to keep adding `max-width` overrides. The risk is that a developer adds a new component to shop.html using the `max-width` pattern from `style.css`, creating two conflicting paradigms in the same page. Specificity fights ensue and mobile breaks silently because nobody tests at 320px.

**Warning sign:** Any `@media (max-width: ...)` rule appearing in `shop.css`. Any rule added to `style.css` without a mobile fallback.

**Prevention:**
- Enforce a strict rule: `shop.css` = `min-width` only. `style.css` = `max-width` only. Never cross the streams.
- After every shop.html change, test at 320px viewport width — the minimum supported width.
- The 2-column product grid at mobile (`grid-template-columns: repeat(2, 1fr)`) must never regress to 1-column due to added padding or margin that causes grid blowout. `min-width: 0` on `.product-card-shop` prevents this — never remove it.

**Relevant phase:** Every shop.css addition; any new component added to shop.html.

---

### 3.2 Touch Target Size Violations

**What breaks:** The cart quantity buttons (`.ci-btn`) are 32x32px. The minimum recommended touch target is 44x44px (Apple HIG) / 48x48dp (Material). The "add to cart" button (`.btn-add-cart`) on small product cards is `padding: 6px 10px` with `font-size: .73rem` — visually compact, but the actual tappable area is roughly 30px tall on a 320px screen. Users with average finger size will frequently mis-tap and hit the price display or another card.

**Warning sign:** Any button with `height` or effective `padding` producing less than 40px total height. The cart +/- buttons and the "הוסף" button on mobile cards are both below the threshold.

**Prevention:**
- Use `min-height: 44px` on all interactive elements, or use the CSS `padding` trick to expand the hit area without changing visual size: add `padding: 8px; margin: -8px` to small buttons.
- Alternatively, use `::after { content: ''; position: absolute; inset: -8px; }` as an invisible hit-area expander.
- Never reduce padding on buttons to make a card "look cleaner" — visual density and touch ergonomics are in direct tension on mobile.

**Relevant phase:** Any product card or cart sidebar CSS change.

---

### 3.3 `overflow: hidden` on Body Blocking iOS Scroll Restoration

**What breaks:** When the cart sidebar or checkout modal opens, `document.body.style.overflow = 'hidden'` is set to prevent background scroll. On iOS Safari, this can cause the page to jump to `scrollTop: 0` when the modal closes, losing the user's scroll position in the product grid. This is a well-known iOS WebKit bug.

**Warning sign:** On iOS (real device or Xcode Simulator), after closing the cart sidebar, the product grid has scrolled back to the top.

**Prevention:**
- The correct pattern is to save `window.scrollY` before applying `overflow: hidden`, set `body { position: fixed; top: -savedY; width: 100%; }`, then on close: remove `position: fixed`, restore `window.scrollTo(0, savedY)`.
- Alternatively, use `overscroll-behavior: contain` on the scrollable cart body (already applied: `overscroll-behavior: contain` on `#cartBody` and `.modal-body`) — but this alone does not fix the body position jump on iOS.
- Test on a real iOS device (or BrowserStack) after every modal/drawer open-close cycle.

**Relevant phase:** Cart sidebar and checkout modal implementation.

---

### 3.4 iOS Auto-Zoom on Input Focus

**What breaks:** iOS Safari auto-zooms the page when a focused input has `font-size` less than 16px. The search input and checkout form inputs already correctly use `font-size: 1rem` (16px) and `-webkit-appearance: none`. However, if any new input is added during shop.html improvement (e.g., a coupon code field, a quantity input) with a smaller font size, the page will zoom in on focus and the user must pinch-zoom out to recover — destroying the premium experience.

**Warning sign:** Any `<input>` or `<textarea>` with `font-size` less than `1rem` / `16px`.

**Prevention:**
- Every form control must have `font-size: 1rem` minimum. This is already documented in shop.css comments — honor it for every new control.
- Additionally: `touch-action: manipulation` on form elements prevents the 300ms tap delay on older iOS.

**Relevant phase:** Any checkout form additions or search input modifications.

---

## 4. Cart and localStorage Pitfalls

### 4.1 Stale Product Data in Cart After Sheet Refresh

**What breaks:** The cart stores `{ id, qty, name, price }` in localStorage. If the shop owner changes a product price or name in Google Sheets, returning users have a cart with old prices and old names. When they submit the WhatsApp order, the shop owner receives an order at the old price — a real business problem.

Concrete scenario: An item costs ₪18. User adds it to cart, leaves the tab open. Owner changes price to ₪25. User returns, submits order. WhatsApp message says ₪18. Owner either eats the loss or calls the customer — neither is acceptable.

**Warning sign:** Price or name mismatches between localStorage cart and live Sheet data after `loadFromSheet()` completes and `applyFilters()` re-renders product cards.

**Prevention:**
- After `loadFromSheet()` successfully loads new products, reconcile the cart: for each cart item, find the matching product in `allProducts` by ID and update `item.price` and `item.name` to current values. If a product ID no longer exists (deleted from Sheet), remove it from cart and show a toast.
- Add a cart schema version check: if the Sheet changes significantly (new column, renamed IDs), bump `CART_KEY` from `bht_cart_v1` to `bht_cart_v2` to clear stale carts on next visit.

**Relevant phase:** shop.js — `loadFromSheet()` and cart reconciliation logic.

---

### 4.2 localStorage Unavailable in Private Browsing / Storage Quota Exceeded

**What breaks:** `localStorage` throws in some private browsing modes (Safari private) and when storage quota is exceeded. The current code wraps `localStorage.setItem` and `.getItem` in try/catch — this is correct. However, the catch block silently swallows errors: `saveCart()` fails silently, and the user's cart disappears on page reload without any indication.

**Warning sign:** User reports "my cart disappeared" — especially on iOS Safari private mode.

**Prevention:**
- The silent catch is acceptable UX for this use case (no backend = no fallback). But consider: if `loadCart()` returns `[]` because localStorage threw, the cart badge shows 0 even if the user had 5 items 10 seconds ago. At minimum, a one-time detection at `init()` should warn the user: "הסל שלך לא יישמר בדפדפן פרטי — הזמינו בסשן זה."
- Do not expand cart data stored in localStorage (e.g., storing full product descriptions or images) — this accelerates quota exhaustion.

**Relevant phase:** shop.js init and cart persistence.

---

### 4.3 Cart State Desync Between Multiple Tabs

**What breaks:** A user opens shop.html in two tabs. They add items in Tab A. Tab B still shows the old cart badge (0) because the `storage` event is not listened to. If they check out from Tab B with an empty cart, they get an empty WhatsApp message.

**Warning sign:** Testing in two browser tabs reveals inconsistent cart badge counts.

**Prevention:**
- Add a `window.addEventListener('storage', e => { if (e.key === CART_KEY) { cart = loadCart(); updateCartBadge(); } })` listener. This updates non-active tabs when localStorage changes from another tab.
- This is a low-probability real-world scenario for a spice shop, but it is zero-effort to prevent.

**Relevant phase:** shop.js cart initialization.

---

### 4.4 "Clear Cart" After WhatsApp Redirect — The Premature Clear

**What breaks:** `submitOrder()` clears the cart immediately after opening the WhatsApp URL: `window.open(url, '_blank')` followed by `cart = []; saveCart()`. This means: if the user switches away from WhatsApp without sending (closes it, forgets, device goes to sleep), they return to the shop with an empty cart and no way to reconstruct their order. They must start over. For a premium experience, this is poor.

**Warning sign:** User reports losing their order after "accidentally" closing WhatsApp.

**Prevention:**
- Do not clear the cart on redirect. Clear it only when the user explicitly confirms, OR clear it on the next page load if a `?order_sent=1` query param is present (set it in the WhatsApp URL opening logic). The current implementation clears immediately — this is the wrong time.
- At minimum, show a confirmation modal: "הזמנתך נשלחה לווטסאפ. לרוקן את הסל?" with a "כן, סיימתי" / "לא, שמור" choice.

**Relevant phase:** shop.js `submitOrder()`.

---

## 5. Animation Performance Pitfalls

### 5.1 Animating Non-Composited Properties — The Jank Trigger

**What breaks:** CSS animations that modify `top`, `left`, `right`, `bottom`, `width`, `height`, `margin`, or `padding` force the browser to re-layout the entire page on every frame — this is the main cause of jank on mobile. The current code animates:
- `transform: translateY()` on particles — SAFE (composited)
- `transform: scale()` on orb drift — SAFE
- `box-shadow` on `.nature-card:hover` — UNSAFE (triggers repaint, not layout, but still expensive on low-end Android)
- `width: 0 → 100%` on `.nav-links a::after` (the underline) — UNSAFE on old browsers; safe on modern (paint worklet handles it), but still causes repaint

**Warning sign:** Chrome DevTools Performance panel shows "Layout" or "Paint" events during animation. On a mid-range Android phone, card hover transitions visibly stutter.

**Prevention:**
- Replace `box-shadow` animations with `opacity` transitions on a `::before` pseudo-element that holds the shadow: pre-render the shadow at full opacity with `opacity: 0`, then transition `opacity: 1` on hover. This is composited.
- The underline `width` transition is already lightweight. If performance testing shows issues, replace with `transform: scaleX(0 → 1)` with `transform-origin: right` (RTL-safe).
- Never add CSS transitions to `height`, `top`, `left` in new premium components. Use `transform: translate()` exclusively for motion.
- Add `will-change: transform` only to elements that ARE animating (the floating orb, the particles container). Do not add it preemptively — it forces GPU layer promotion on ALL matching elements, wasting VRAM.

**Relevant phase:** Any new hover effects, reveal animations, or card transitions added during visual polish.

---

### 5.2 Too Many Concurrent CSS Animations — The Particle Tax

**What breaks:** The hero currently runs: 18 particles (18 concurrent `@keyframes particle-rise` animations) + 1 orb drift + 1 dot grid (static, fine) + scroll parallax via JS. On low-end Android devices (Snapdragon 450 class), 18+ concurrent GPU-composited layers can cause frame drops even when the user is not interacting, because the GPU must composite all layers on every vsync.

**Warning sign:** Chrome DevTools → Performance → "Frames" shows consistent drops to 30fps or below on the hero section, even on desktop with CPU throttling to "6x slowdown."

**Prevention:**
- The particle count (18) is already at the upper safe limit. Do not increase it.
- Respect `prefers-reduced-motion` — already implemented in `initParticles()` and `initHeroParallax()`. Verify this guard is added to every new animation.
- If adding more hero animations (e.g., animated text, staggered word reveals), reduce particle count to 8-10 to compensate.
- Never animate the hero background image itself (no `animation` on `.hero-bg::before` dot grid).

**Relevant phase:** Hero section visual polish on index.html.

---

### 5.3 Intersection Observer With Too-Low Threshold — False-Positive Reveals

**What breaks:** The reveal animation observer uses `threshold: 0.12` — an element triggers `.visible` when 12% of it is in the viewport. On very small screens (320px wide), a tall element (like an `about-grid` at full width) may be 12% visible while still almost completely off-screen, causing it to "reveal" before the user has actually scrolled to it. This destroys the dramatic reveal effect and looks like a bug.

**Warning sign:** On a 320px viewport, section headings reveal while the section is still below the fold, visible only as a sliver.

**Prevention:**
- Use `rootMargin: '0px 0px -10% 0px'` instead of a fixed `-48px` offset — this scales with viewport height. A percentage rootMargin means "trigger when the element is at least 10% above the bottom of the viewport."
- For mobile: consider a separate, lower threshold like `0.05` with a larger `rootMargin` so the animation triggers later (when more of the element is visible).

**Relevant phase:** Any new reveal-animated element added during index.html polish.

---

## 6. WhatsApp Checkout Pitfalls

### 6.1 URL Length Limit — The Truncated Order

**What breaks:** WhatsApp's `wa.me` deep link has a practical URL length limit. While the HTTP specification does not impose a hard limit, browsers and mobile OS deep link handlers typically cap URLs at 2,000–8,000 characters. A large order with many items and a verbose address field can produce a URL that exceeds this limit. WhatsApp may silently truncate the message, the link may fail to open, or the Android intent resolver may reject it.

Calculation for current message format:
- Header: ~50 chars
- Per item: ~40 chars (name + qty + price). 15 items = 600 chars
- Customer details: ~150 chars
- Hebrew characters after `encodeURIComponent`: each Hebrew letter becomes `%XX%XX` (6 chars). "כמון טחון" (9 chars) → ~54 encoded chars. A 15-item order message of ~800 raw chars becomes ~4,800 encoded chars in the URL.

4,800 chars is within safe limits but leaves little room for the base URL and is approaching the danger zone on older Android WebViews.

**Warning sign:** Testing with a full 15-item cart and a long address and notes field produces a URL > 4,000 encoded characters. Test with `console.log(url.length)` in `submitOrder()`.

**Prevention:**
- Add a URL length check in `buildWhatsAppMessage()`: if `encodeURIComponent(msg).length > 3000`, truncate notes or show a warning.
- Keep product names in the Sheet concise (under 30 chars). Long names are the biggest contributor.
- Consider an abbreviated message format for large orders: instead of "• כמון טחון במקום ×3 — ₪54", use "כמון ×3 (₪54)".
- Log URL length in development: `console.log('WA URL length:', url.length)`.

**Relevant phase:** shop.js `buildWhatsAppMessage()` and `submitOrder()`.

---

### 6.2 Special Characters Breaking the WhatsApp URL

**What breaks:** The current implementation correctly uses `encodeURIComponent(msg)` — this handles all Hebrew characters, newlines, emoji, and special chars. However, there is one edge case: if a product name or user-entered field contains a backtick (`\``), a backslash (`\`), or a null byte, `encodeURIComponent` still encodes them safely, but WhatsApp's message pre-fill parser on some Android versions may mis-interpret them.

More practically: the `•` (bullet character, U+2022) used in item lines and the `₪` (shekel sign, U+20AA) both encode correctly but render in the WhatsApp chat input as-is — this is fine. The `"` (right double quotation mark) in `סה"כ` (U+05D4 + U+05DE) and the `'` in `מג׳הול` (Unicode geresh, U+05F3) are already in the product name strings and will encode correctly.

**Warning sign:** A product name containing user-controlled content (if the Sheet is edited carelessly) with raw `&`, `?`, `#`, or `=` characters — these could corrupt the query string if not encoded. Since the code uses `encodeURIComponent` on the whole message, single `&` inside the message is safe. But a product name that starts with `text=` would be confusing (though still safe after encoding).

**Prevention:**
- The `encodeURIComponent` approach is correct. Do not change it to `encodeURI` (which does NOT encode `&`, `?`, `=`, `#`).
- Sanitize product names in the CSV parser: strip or replace `"` (straight quotes) with `"` (curved quotes) to avoid CSV parsing ambiguity in the `splitCSVRow` function.
- The existing `esc()` function (HTML-escaping) is used for DOM injection — do NOT use it for URL encoding. These are separate concerns and must remain separate.

**Relevant phase:** shop.js `buildWhatsAppMessage()`, `splitCSVRow()`, and any Sheet data editing.

---

### 6.3 WhatsApp Opens But Message Is Empty — The Encoding Race Condition

**What breaks:** `window.open(url, '_blank', 'noopener,noreferrer')` may be blocked by the browser as a popup if it is not called directly from a user gesture (e.g., if there is an `async` operation between the button click and the `window.open` call). In the current implementation, `submitOrder()` is called from a `form.submit` event handler synchronously — this is safe. But if any future improvement adds an `await` (e.g., validating the order against the Sheet, checking stock), the `window.open` call will be outside the user gesture and will be blocked on iOS Safari and most mobile browsers.

**Warning sign:** "שלח הזמנה" button appears to do nothing on iOS. The console shows "Blocked opening ... because the gesture was not authorized."

**Prevention:**
- Never add `async/await` between the user's button click and the `window.open` call. If async validation is needed, do it before the checkout modal opens (at the "open cart" stage), not at submit time.
- If any pre-submit validation is added, collect all data synchronously, THEN call `window.open`, THEN run any async cleanup.

**Relevant phase:** shop.js `submitOrder()` — any future enhancement.

---

### 6.4 Two WhatsApp Numbers — Which One Gets the Order?

**What breaks:** The current code sends ALL orders to `WA_PHONE = '972502456233'` (פיני only). The second number (תאיר, `972509333951`) is mentioned in comments and in the index.html contact section but is not used in the checkout flow. If פיני is unavailable and orders pile up unread, there is no fallback. This is a business process pitfall, not a code bug — but it manifests as a UX failure ("I ordered 3 days ago and nobody responded").

**Warning sign:** The business owner mentions that sometimes orders go unnoticed for a day or more.

**Prevention:**
- Consider sending to both numbers by opening two WhatsApp URLs: one to each. However, this requires two user gestures (two `window.open` calls) — iOS will block the second.
- Better: let the checkout form include a radio: "שלח הזמנה ל: [פיני / תאיר]" and route accordingly.
- Or: use a single WhatsApp Business number that both owners monitor.
- This is a business decision, not just a code decision. Document it and raise it with the client.

**Relevant phase:** shop.js checkout flow; business process discussion.

---

## Summary Table

| # | Category | Pitfall | Severity | Phase |
|---|----------|---------|----------|-------|
| 1.1 | RTL | Physical vs. logical CSS mixing | High | All CSS |
| 1.2 | RTL | `transform-origin` not flipping | Medium | Card animations |
| 1.3 | RTL | `backdrop-filter` breaks sticky | High | Shop filter bar |
| 1.4 | RTL | Gradient direction not RTL-aware | Low | Visual polish |
| 2.1 | Over-engineering | Adding JS framework | Critical | shop.js |
| 2.2 | Over-engineering | CSS token shadowing | Medium | style.css/shop.css |
| 2.3 | Over-engineering | Build step without recovery | High | Deploy |
| 3.1 | Mobile | Desktop-first defeating mobile-first | High | shop.css |
| 3.2 | Mobile | Touch targets too small | High | Cart + product cards |
| 3.3 | Mobile | `overflow:hidden` scroll jump on iOS | Medium | Cart/modal open-close |
| 3.4 | Mobile | iOS auto-zoom on small inputs | High | Checkout form |
| 4.1 | Cart | Stale price/name after Sheet refresh | High | shop.js cart |
| 4.2 | Cart | localStorage unavailable silently | Low | shop.js init |
| 4.3 | Cart | Multi-tab desync | Low | shop.js storage event |
| 4.4 | Cart | Premature cart clear after redirect | Medium | submitOrder() |
| 5.1 | Animation | Non-composited property transitions | High | Hover effects |
| 5.2 | Animation | Too many concurrent animations | Medium | Hero section |
| 5.3 | Animation | Low threshold on small screens | Low | Reveal observer |
| 6.1 | WhatsApp | URL length overflow | High | buildWhatsAppMessage() |
| 6.2 | WhatsApp | Special character encoding | Low | buildWhatsAppMessage() |
| 6.3 | WhatsApp | Async breaking user gesture | High | submitOrder() future |
| 6.4 | WhatsApp | Single recipient business risk | Medium | Business process |

---

*Research completed: 2026-03-11. Based on direct analysis of shop.js, shop.css, style.css, script.js, shop.html, and PROJECT.md.*
