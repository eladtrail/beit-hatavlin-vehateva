# Research Summary

*Synthesized from STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md — 2026-03-11*

---

## Recommended Stack

- **CSS: stay vanilla, add `@layer` and `@property`** — adopt cascade layers to end the specificity war between `style.css` and `shop.css`; use `@property` for animatable gradients on CTA buttons (progressive enhancement).
- **Animations: stay native** — `IntersectionObserver` + CSS `@keyframes` + `requestAnimationFrame` already covers every use case. Add `prefers-reduced-motion` to all CSS `@keyframes` blocks (currently missing). GSAP core only if the hero redesign needs timeline sequencing.
- **Images: use Cloudinary transform URLs** — add `f_auto,q_80,w_1400` to the hero image URL and fix LCP by moving it from CSS `background:` to a `<link rel="preload">` in `<head>`.
- **Performance: trim Google Fonts** — remove Frank Ruhl Libre 400 and Heebo 300 (unused weights); saves 2 HTTP requests. Add 5s timeout to the Google Sheets CSV fetch.
- **No new dependencies at runtime** — no Alpine.js, no AOS, no jQuery, no Lottie, no Tailwind CDN. The zero-dependency constraint is a feature, not a limitation.

---

## Table Stakes Features

Items that make the site feel broken or untrustworthy if missing:

- Fix the empty `<h1>` in the hero — it is currently `<br /><span class="hero-title-gradient"></span>` (broken, P0)
- Cart sidebar must go full-screen on mobile — a 300px sidebar on a 375px screen leaves 75px of content visible (P0, UX gap)
- Touch targets: raise `.ci-btn` (cart +/−) and `.btn-add-cart` to `min-height: 44px` with `touch-action: manipulation` (P1)
- Phone number format validation in the checkout form — `required` passes with "050" (P1)
- "How it works" 3-step strip for the WhatsApp checkout — unfamiliar flow needs explanation before the CTA (P1)
- Safe area insets: `env(safe-area-inset-bottom)` on the WhatsApp float button and cart sidebar footer (P1)
- Confirm before "רוקן סל" — accidental cart clearing is irreversible (P1)
- Weight/quantity indicator on product cards — ₪18 for how much? Absence makes price feel uncertain (P1)
- `prefers-reduced-motion` declared in CSS for all `@keyframes` — currently only in JS guards (accessibility requirement)

---

## Top Differentiators

What elevates this above a template site:

- **Grinding-on-demand as a hero moment** — this is a genuine market differentiator; give it a dedicated visual section, not just a badge
- **Origin storytelling on product cards** — one provenance sentence per product ("כמון מאיראן, נטחן ביום ההזמנה") following the Burlap & Barrel / Diaspora Co. model
- **Order number + timestamp in WhatsApp message** — `#241103-1432` format; 3 lines of JS, major operational improvement for the shop owner
- **Low stock urgency indicator** — "נשאר מעט" when `stock <= 3`; the field already exists in the data model
- **Cart icon bounce animation on add-to-cart** — closes the feedback loop without opening the sidebar (200ms CSS animation)
- **Sticky filter bar** — `position: sticky; top: var(--nav-h)` on `#filterBar`; users browse long lists without scrolling back up
- **Founder photos (פיני ותאיר)** — named throughout the site but never shown; a single informal photo dramatically increases trust for a local artisan shop
- **Bold WhatsApp total** — wrap total in `*asterisks*` for WhatsApp bold formatting; the shop owner immediately sees the order value

---

## Architecture Decisions

How to structure the CSS/JS improvements:

- **Unify breakpoint direction** — `shop.css` is mobile-first (`min-width`); `style.css` is desktop-first (`max-width`). They must not cross. Long-term: convert `style.css` to mobile-first. Short-term: enforce the rule as a hard constraint per file.
- **Cart sidebar animation: `right` → `transform: translateX`** — `right: -100%` is not GPU-composited; `transform: translateX(100%)` is. Fix this before adding any other cart animations.
- **Add `--whatsapp: #25D366` token** — currently hardcoded in 4 separate places across both CSS files.
- **Shared utility class `.panel-close-btn`** — the dark-header close button appears identically in both `#cartSidebar` and `#checkoutModal`; extract it.
- **JS stagger delays via inline style, not `nth-child` CSS** — the dynamic product grid breaks the hardcoded nth-child stagger rules; set `el.style.transitionDelay` in `renderProducts()` instead.
- **Cart reconciliation after Sheet load** — after `loadFromSheet()` resolves, update `item.price` and `item.name` for every cart item from `allProducts`; remove items whose IDs no longer exist.
- **Never add `async/await` between the submit button click and `window.open`** — iOS Safari blocks popups not directly within a user gesture; any future async validation must happen at cart-open time, not submit time.

---

## Critical Pitfalls to Avoid

The 7 most dangerous mistakes for this specific project:

1. **Adding a JS framework to shop.js** (Critical) — Alpine.js, Vue, React — any of these destroys the zero-dependency advantage and creates an unmaintainable mixed paradigm. The imperative render pattern (`renderCartSidebar()`, `renderProducts()`) is correct; extend it.

2. **Non-composited CSS transitions** (High) — never animate `top`, `left`, `right`, `width`, `height`, or `box-shadow` directly. Use `transform` and `opacity` exclusively for motion. The current cart sidebar uses `right` — fix this first.

3. **Mixing physical (`left`/`right`) and logical (`inset-inline-*`) CSS properties in the same scope** (High) — adding any `direction: ltr` island without `unicode-bidi: isolate` will cause layout tears that are nearly impossible to debug.

4. **`backdrop-filter` on a parent of `position: sticky`** (High) — the filter bar's stickiness will silently break if any ancestor gains `backdrop-filter`, `transform`, `filter`, or `will-change`. Test stickiness after every premium visual upgrade to section backgrounds.

5. **Premature cart clear after WhatsApp redirect** (Medium-High) — clearing the cart immediately after `window.open()` means users who close WhatsApp without sending lose their entire order. Clear only on explicit confirmation or `?order_sent=1` param on next load.

6. **Stale product prices in persisted cart** (High) — the cart stores `price` at add-time. If the Google Sheet price changes, the WhatsApp order shows the old price. Reconcile cart item prices against `allProducts` after every successful Sheet load.

7. **Adding a build step without a recovery plan** (High) — any `package.json` script that must run before deploy creates a situation where the site cannot be changed if the toolchain is lost. Source files must remain identical to deployed artifacts.

---

## Suggested Build Order

Dependencies determine the sequence — foundational changes must precede visual polish.

### Phase 1 — Foundations (unblock everything else)
1. Add `--whatsapp` color token; audit and fix all 4 hardcoded instances
2. Fix cart sidebar animation: `right` → `transform: translateX` (GPU compositing)
3. Add `prefers-reduced-motion` block in both CSS files for all `@keyframes`
4. Add `<link rel="preload">` for hero image (LCP fix — highest impact, zero risk)
5. Add 5s timeout to Google Sheets CSV fetch

### Phase 2 — P0 Bugs (site is broken without these)
6. Fix empty `<h1>` in hero with real copy
7. Fix cart sidebar to full-screen on mobile (`<600px` — slide-up sheet or full-screen)
8. Raise touch target sizes: `.ci-btn` and `.btn-add-cart` to `min-height: 44px`

### Phase 3 — Table Stakes UX (P1 features)
9. Add phone format validation (Israeli mobile: `/^05\d{8}$/`)
10. Add safe area insets (`env(safe-area-inset-bottom)`) to WA float + cart footer
11. Add "רוקן סל" confirmation (inline undo toast or confirm dialog)
12. Add weight/quantity to product cards
13. Add "How it works" 3-step strip to index.html before the shop CTA
14. Add sticky filter bar (`position: sticky; top: var(--nav-h)`)

### Phase 4 — WhatsApp Checkout Improvements
15. Add order number + timestamp to WhatsApp message
16. Bold the total with `*₪XX*` in the message
17. Add cart reconciliation after `loadFromSheet()` (price/name sync)
18. Add cart `savedAt` timestamp + 7-day TTL
19. Add `window.addEventListener('storage', ...)` for multi-tab sync

### Phase 5 — Differentiators and Polish
20. Add cart icon bounce animation on add-to-cart
21. Add low-stock indicator (`stock <= 3`)
22. Add filter pill counts ("תבלינים (4)")
23. Cloudinary transform URLs for hero image (`f_auto,q_80,w_1400`)
24. Remove unused Google Fonts weights (Frank Ruhl 400, Heebo 300)
25. Add origin/provenance copy to product card descriptions
26. Founder photos section on index.html
27. `@property` for animatable CTA button gradients (progressive enhancement)
