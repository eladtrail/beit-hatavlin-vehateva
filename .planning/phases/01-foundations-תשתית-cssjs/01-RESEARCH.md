# Phase 1 Research: Foundations — תשתית CSS/JS

**Requirements:** FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, FOUND-07
**Research date:** 2026-03-11
**Files audited:** css/style.css, css/shop.css, js/script.js, js/shop.js, index.html (head)

---

## 1. Current State Analysis

### 1.1 `!important` Audit

**style.css — 3 instances found:**

| Line | Rule | Context |
|------|------|---------|
| 293 | `.nav-cta { color: var(--white) !important; }` | Nav CTA override — specificity fight with `.nav-links a` |
| 297 | `.nav-cta { font-weight: 600 !important; }` | Same conflict — `.nav-links a` has its own `font-weight` |
| 299 | `.nav-cta::after { display: none !important; }` | Forces off the underline pseudo-element from `.nav-links a::after` |

**shop.css — 0 instances found.**

**Root cause of all three:** `.nav-cta` is both a `.nav-links a` descendant AND needs to look like a button. Without cascade control (no `@layer`), specificity from `.nav-links a` rules bleeds into `.nav-cta`, requiring `!important` to override. This is exactly the problem `@layer` solves: `components` layer can override `base` layer without any `!important`.

**Verdict:** 3 existing `!important` instances, all in style.css, all in the navbar, all from the same specificity conflict.

---

### 1.2 Hardcoded Color Values — `#25D366` (WhatsApp Green) Audit

**style.css — 4 occurrences, all hardcoded:**

| Line | Selector | Usage |
|------|----------|-------|
| 132 | `.btn-whatsapp` | `background: #25D366` |
| 136 | `.btn-whatsapp:hover` | `background: #20BA5A` (darker variant — NOT the same hex, but a related value) |
| 139 | `.btn-whatsapp-lg` | `background: #25D366` |
| 145 | `.btn-whatsapp-lg:hover` | `background: #20BA5A` |
| 149 | `.btn-whatsapp-outline` | `color: #25D366; border-color: #25D366` |
| 154 | `.btn-whatsapp-outline:hover` | `background: #25D366` |
| 1026 | `.footer-social a:hover` | `background: #25D366; border-color: #25D366` |
| 1071 | `.wa-float` | `background: #25D366` |
| 1085 | `.wa-pulse` | `background: #25D366` |

**Exact count of `#25D366` occurrences in style.css:** 7 direct uses of `#25D366`.
**Also present:** `#20BA5A` (hover/darker shade) appears 2 times — this should become `--whatsapp-dark`.

**shop.css — 2 occurrences:**

| Line | Selector | Usage |
|------|----------|-------|
| 574 | `.btn-checkout` | `background: linear-gradient(135deg, #1a6b3c 0%, #25a85e 100%)` — these are NOT `#25D366` but are related green shades used for the checkout button |
| 737 | `.checkout-submit` | Same gradient values |

The checkout button greens (`#1a6b3c`, `#25a85e`) are distinct from WhatsApp green and represent "proceed to action" — they should become separate tokens (`--green-action-dark`, `--green-action-light`) or simply use existing `--green-800` / `--green-600` tokens from `:root` which map to `#1B4332` / `#2D6A4F`. These are close but not identical — needs a decision.

**Token gap:** The existing `:root` in style.css has no `--whatsapp` token. It defines green palette tokens (`--green-800: #1B4332`, `--green-600: #2D6A4F`) but `#25D366` is used nowhere near those.

**FOUND-02 scope:** Add `--whatsapp: #25D366` and `--whatsapp-dark: #20BA5A` to `:root`. Replace all 7 occurrences of `#25D366` and 2 occurrences of `#20BA5A` in style.css. The shop.css gradient values are a separate concern (checkout button styling, not WhatsApp branding).

---

### 1.3 Cart Sidebar Animation — GPU vs. Layout

**Current implementation (shop.css lines 444–455):**
```css
#cartSidebar {
  right: -100%;
  transition: right .35s cubic-bezier(.4, 0, .2, 1);
}
#cartSidebar.cart-open { right: 0; }
```

**Problem:** Animating the `right` property triggers **layout recalculation** on every animation frame. The browser must recalculate the position of every element affected by this shift. On mid-range Android, this produces visible jank during the slide-in/out.

**Fix (FOUND-03):** Replace with `transform: translateX()` which is composited entirely on the GPU:
```css
#cartSidebar {
  right: 0;                          /* always positioned at right edge */
  transform: translateX(100%);       /* hidden off-screen to the right */
  transition: transform .35s cubic-bezier(.4, 0, .2, 1);
}
#cartSidebar.cart-open { transform: translateX(0); }
```

**RTL note:** In an RTL page the cart slides in from the right side (physical right = reading start side), which is conventional. `translateX(100%)` pushes it off to the physical right — correct. No logical property equivalent exists for `transform`, so physical direction is acceptable here with a comment.

**Dependency:** The `@media (min-width: 480px)` override sets `width: min(420px, 96vw)` — this remains unchanged since `right: 0` + `transform` handles positioning.

---

### 1.4 `prefers-reduced-motion` — CSS Gap

**JS (script.js) — CORRECTLY handled:**
- `initHeroParallax()` (line 107): checks `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and returns early.
- `initParticles()` (line 129): same guard, particles are not created.

**CSS — NOT handled.** These `@keyframes` run unconditionally regardless of user preference:

| File | Animation | Element | Missing guard |
|------|-----------|---------|---------------|
| style.css | `orb-drift` | `.hero-bg::after` | Yes |
| style.css | `particle-rise` | `.particle` | Yes (JS skips creation, but CSS class still animates if particles exist) |
| style.css | `scroll-bounce` | `.scroll-dot` | Yes |
| style.css | `float-a` | `.ac-1`, `.ac-2`, `.ac-3`, `.ac-4` | Yes |
| style.css | `pulse-badge` | `.nature-label` | Yes |
| style.css | `wa-ring` | `.wa-pulse` | Yes |
| shop.css | `shopSpin` | `.shop-spinner` | Yes |

**Reveal transitions — partial issue:**
The `.reveal`, `.reveal-right`, `.reveal-left` classes use CSS `transition: opacity .75s, transform .75s` (style.css lines 1122–1137). These are not `@keyframes` but still produce motion. A user with `prefers-reduced-motion: reduce` will still see the opacity/transform transition animate in — it just won't loop.

**FOUND-04 scope:** Add one `@media (prefers-reduced-motion: reduce)` block at the end of each CSS file that suppresses all the above. The `.reveal` transitions should be set to `transition: none` so elements appear instantly.

---

### 1.5 LCP / Hero Image

**Current implementation (style.css lines 355–366):**
```css
.hero-bg {
  background:
    radial-gradient(ellipse 80% 70% at 15% 50%, ...),
    ...
    url('https://res.cloudinary.com/.../s91wir.jpg') center/cover no-repeat;
}
```

**Problem:** The browser cannot discover this image URL until it has:
1. Downloaded and parsed `style.css`
2. Applied the rule to `.hero-bg`
3. Determined `.hero-bg` is visible

This typically delays image discovery by 1–3 seconds on mobile. The image is the LCP candidate for index.html.

**index.html `<head>` audit (lines 9–12):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;700;900&family=Heebo:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="css/style.css?v=5" />
```

**What is missing:** No `<link rel="preload">` for the hero image. No `preconnect` to `res.cloudinary.com`.

**FOUND-05 scope — two things to add to `index.html` `<head>`:**
1. `<link rel="preconnect" href="https://res.cloudinary.com" />` — establishes TCP+TLS connection early.
2. `<link rel="preload" as="image" href="[hero-image-url]" fetchpriority="high" />` — tells browser to fetch the image immediately during HTML parsing, not after CSS parse.

**Hero image URL** (from style.css line 363):
`https://res.cloudinary.com/dcenbexvc/image/upload/v1772654458/__________2k_delpmaspu_1_s91wir.jpg`

**Cloudinary optimization opportunity (FOUND-05 adjacent, also feeds POL-04):** The URL currently loads the raw image. Adding Cloudinary transforms reduces payload significantly:
- With transforms: `https://res.cloudinary.com/dcenbexvc/image/upload/f_auto,q_80,w_1400/v1772654458/__________2k_delpmaspu_1_s91wir.jpg`
- The preload `href` and the CSS `background` URL should both use the transformed version.
- This is in scope for Phase 1 as part of FOUND-05 (the `<link rel="preload">` must point to the same URL as the CSS `background` for preloading to benefit LCP).

---

### 1.6 Font Weight Audit

**Google Fonts URL (index.html line 11):**
```
Frank+Ruhl+Libre:wght@400;700;900
Heebo:wght@300;400;500;600;700
```
That is 5 font-weight variants = at minimum 5 HTTP requests (likely 8+ counting Hebrew + Latin subsets).

**Actual usage in style.css:**
- `Frank Ruhl Libre` — used at `font-weight: 900` (`.hero-title`, `.stat-number`, `.section-title`), `700` (`.nav-title`, `.footer-logo`, product card `h3`). Weight `400` assigned in `:root` `--font-heading` declaration but NEVER used explicitly in any rule.
- `Heebo` — used at `300` only in `.hero-subtitle` (`font-weight: 300`). `400` (default body). `500` (nav links, `.hero-badge-item`). `600` (`.btn` family, labels). `700` (`.footer-nav h4`, cart controls). Weight `300` is used exactly once.

**shop.css:**
- Heebo `700` used in several button and label rules.
- No additional font weights introduced.

**FOUND-06 scope:** Remove `Frank Ruhl Libre` weight `400` and `Heebo` weight `300` from the Google Fonts URL. This eliminates 2 HTTP requests. The hero subtitle (`font-weight: 300`) will fall back to weight `400` (Heebo regular) — visually acceptable since the difference between 300 and 400 in Heebo at small sizes is subtle.

**Updated URL:**
```
https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@700;900&family=Heebo:wght@400;500;600;700&display=swap
```

**Risk:** If any Hebrew-specific glyph requires weight 300 for a specific character rendering, this could change. Low risk — Heebo 400 is used throughout the body already.

---

### 1.7 CSV Fetch Timeout

**Current implementation (shop.js lines 75–90):**
```js
async function loadFromSheet() {
  if (!SHEET_CSV_URL) return;
  try {
    const resp = await fetch(SHEET_CSV_URL);  // NO TIMEOUT
    ...
  } catch (err) {
    console.warn('...keeping demo products');
  }
}
```

**Problem:** `fetch()` without a timeout inherits the browser's default connection timeout, typically 60–300 seconds. A slow or unresponsive Google Sheets endpoint will hold the `loadFromSheet()` promise open indefinitely. While demo products show immediately (the fallback is correct), any subsequent `applyFilters()` call from the Sheet response could arrive minutes later and overwrite user state mid-session.

**FOUND-07 scope:** Wrap the fetch in `Promise.race()` with a 5-second timeout:
```js
const resp = await Promise.race([
  fetch(SHEET_CSV_URL),
  new Promise((_, rej) => setTimeout(() => rej(new Error('Sheet timeout after 5s')), 5000))
]);
```

**Note:** `AbortController` is the cleaner modern approach (actually cancels the network request, not just ignores the response):
```js
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);
const resp = await fetch(SHEET_CSV_URL, { signal: controller.signal });
clearTimeout(timeoutId);
```
Both approaches satisfy FOUND-07. `AbortController` is preferable as it truly cancels the request rather than leaving it pending.

---

## 2. `@layer` Architecture

### 2.1 Why `@layer` Solves the Specificity Problem

The three `!important` instances in style.css all stem from `.nav-cta` needing to override `.nav-links a`. Without layers, specificity is determined by selector weight. With layers, earlier layers always lose to later layers regardless of selector weight.

### 2.2 Recommended Layer Order

The `@layer` declaration must be the first thing in the file (before any rules) to establish order. Both files need coordinated layers since shop.html loads both.

**Shared declaration (at top of style.css):**
```css
@layer reset, tokens, base, layout, components, utilities, overrides;
```

**Layer assignments:**

| Layer | Content in style.css | Content in shop.css |
|-------|----------------------|---------------------|
| `reset` | `*, *::before, *::after` block | (defined in style.css, not redeclared in shop.css) |
| `tokens` | `:root` variables | (same — tokens already defined in style.css) |
| `base` | `body`, `h1-h4`, `a`, `button`, `img` | (same base elements if needed) |
| `layout` | `.container`, `.navbar`, `.footer`, `.wa-float` | `.filter-bar`, `.shop-section` layout wrappers |
| `components` | `.btn-*`, `.hero`, `.about`, `.products`, `.nature`, `.location`, `.contact`, section cards | `.product-card-shop`, `#cartSidebar`, `#checkoutModal`, `.shop-toast`, `.cat-btn` |
| `utilities` | `.reveal`, `.reveal-right`, `.reveal-left`, `.section-label`, `.section-title` | (shared utility classes from style.css apply) |
| `overrides` | `@media` responsive rules, `.nav-cta` (replaces the `!important` hacks) | `@media` responsive rules |

### 2.3 How `.nav-cta` Gets Fixed

Instead of:
```css
.nav-cta { color: var(--white) !important; font-weight: 600 !important; }
.nav-cta::after { display: none !important; }
```

The `.nav-cta` rule moves to the `overrides` layer, which naturally wins over the `components` and `base` layers where `.nav-links a` is defined:
```css
@layer overrides {
  .nav-cta { color: var(--white); font-weight: 600; }
  .nav-cta::after { display: none; }
}
```

### 2.4 Cross-File Layer Coordination

**Critical:** When shop.html loads both `style.css` and `shop.css`, the `@layer` order is determined by whichever file declares the layer names first in document order. Since `style.css` loads before `shop.css`, style.css's layer declaration takes precedence.

`shop.css` does NOT need to redeclare the layer order — it simply places rules in the existing layers:
```css
/* shop.css — no @layer declaration needed at top */
@layer components {
  .product-card-shop { ... }
  #cartSidebar { ... }
}
@layer overrides {
  @media (min-width: 600px) { ... }
}
```

**Warning:** If `shop.css` declares `@layer` independently without the same order, browsers will merge them in declaration order. The safest approach is to declare the layer order once in style.css and only use `@layer name { }` blocks (not declarations) in shop.css.

### 2.5 `@keyframes` and `@layer`

`@keyframes` inside a `@layer` block are scoped to that layer — they can only be used by rules in the same or higher layers. This is relevant because the keyframes (`float-a`, `orb-drift`, `wa-ring`, etc.) are currently at file scope. Moving them inside `@layer components` or `@layer utilities` is the correct approach.

Alternatively, `@keyframes` can remain at file scope (outside any layer) — they are then globally available. This is simpler for a two-file setup. **Decision: keep `@keyframes` at file scope (outside layers) to avoid layer-scoping complexity with no practical benefit.**

---

## 3. Design Token Audit

### 3.1 Missing Tokens — WhatsApp Colors

Currently absent from `:root`:
```css
--whatsapp:      #25D366;
--whatsapp-dark: #20BA5A;
```

These two additions cover every WhatsApp color occurrence in style.css (7× `#25D366`, 2× `#20BA5A`).

### 3.2 Missing Tokens — Checkout Button Greens (shop.css)

The `.btn-checkout` and `.checkout-submit` use `#1a6b3c` and `#25a85e`. These are NOT the same as WhatsApp green. They are used for "send order" actions. Options:
- **Option A:** Map to existing tokens: `--green-800: #1B4332` and `--green-600: #2D6A4F`. The hex values differ slightly (`#1a6b3c` vs `#1B4332`), but visually indistinguishable.
- **Option B:** Add new tokens `--green-action: #1a6b3c; --green-action-lt: #25a85e`.

**Recommendation:** Option A — use existing `--green-800` and `--green-400` tokens (which are `#1B4332` and `#52B788`). The gradient becomes `linear-gradient(135deg, var(--green-800), var(--green-400))`. This is not Phase 1 scope (FOUND-02 only specifies `#25D366`), but worth noting for the implementation pass.

### 3.3 Other Hardcoded Values Found

| Value | Location | Token candidate |
|-------|----------|-----------------|
| `#C0392B` (red) | `.hours-closed`, `.ci-btn--remove:hover`, `.btn-clear-cart:hover` | `--danger: #C0392B` |
| `rgba(37,211,102, ...)` | Box-shadow on `.btn-whatsapp` | Would use `--whatsapp` |
| `#20BA5A` | WhatsApp button hover | `--whatsapp-dark: #20BA5A` |
| `rgba(26,107,60,.3)` | Box-shadow on `.btn-checkout:hover` | Would use `--green-action` |

The `#C0392B` danger color appears in 3 places but is not in the FOUND-02 scope. Flag for later.

### 3.4 Existing Token Quality Assessment

The current `:root` is well-structured. All shadow, radius, motion, and layout tokens are consistently used. No shadow or radius values appear hardcoded outside `:root`. The gap is exclusively the WhatsApp color family.

---

## 4. GPU Animation

### 4.1 Current Animation Inventory and GPU Status

| Animation | CSS Property Animated | GPU Composited? | Notes |
|-----------|-----------------------|-----------------|-------|
| `orb-drift` on `.hero-bg::after` | `transform` | YES | Safe |
| `particle-rise` on `.particle` | `transform`, `opacity` | YES | Safe |
| `scroll-bounce` on `.scroll-dot` | `top`, `opacity` | NO — `top` triggers layout | Needs fix |
| `float-a` on `.ac-1`–`.ac-4` | `transform` | YES | Safe |
| `pulse-badge` on `.nature-label` | `box-shadow` | NO — paint only, not composited | Acceptable (small element, no jank) |
| `wa-ring` on `.wa-pulse` | `transform`, `opacity` | YES | Safe |
| `shopSpin` on `.shop-spinner` | `transform: rotate` | YES | Safe |
| Reveal transitions `.reveal` | `opacity`, `transform` | YES | Safe |
| Cart sidebar slide | `right` | NO — layout | FOUND-03 target |

### 4.2 `scroll-bounce` Fix

The `.scroll-dot` in the hero scroll indicator animates `top` from `5px` to `20px`. This triggers layout on every frame. Fix:
```css
/* before */
@keyframes scroll-bounce {
  0%   { opacity: 1; top: 5px; }
  100% { opacity: 0; top: 20px; }
}

/* after — GPU composited */
@keyframes scroll-bounce {
  0%   { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(15px); }
}
```

The `.scroll-dot` itself uses `position: absolute; top: 5px; left: 50%` — the `top: 5px` stays as a static position value; only the animation is changed to `transform`. This is in scope for Phase 1 as part of FOUND-04 (ensuring all animations are GPU-friendly before adding motion guards).

### 4.3 `will-change` Usage

Current state: `.hero-bg` has `will-change: transform` (style.css line 365) — this is correct, the parallax JS modifies its transform on scroll.

**DO NOT add `will-change: transform` to:**
- `.particle` — 18 particles × 1 compositor layer each = 18 layers. The CSS animation already promotes them to compositor; explicit `will-change` would be redundant and wasteful.
- `.about-card-float` — 4 elements, the animation handles promotion.
- `.wa-pulse` — 1 element, already animated with transform.

**Correct `will-change` usage for Phase 1:** Only ensure `.hero-bg` retains `will-change: transform`. No new `will-change` declarations needed.

### 4.4 `prefers-reduced-motion` — Complete Block for Phase 1

**For style.css (add at the very end, after all `@media` queries):**
```css
@media (prefers-reduced-motion: reduce) {
  /* Stop all looping @keyframes */
  .hero-bg::after       { animation: none; }
  .particle             { animation: none; }
  .scroll-dot           { animation: none; }
  .ac-1, .ac-2,
  .ac-3, .ac-4          { animation: none; }
  .nature-label         { animation: none; }
  .wa-pulse             { animation: none; }

  /* Make reveal elements immediately visible (no transition delay) */
  .reveal,
  .reveal-right,
  .reveal-left          { opacity: 1; transform: none; transition: none; }
}
```

**For shop.css (add at the very end):**
```css
@media (prefers-reduced-motion: reduce) {
  .shop-spinner { animation: none; border-top-color: var(--brown-500); }
  .product-card-shop { transition: none; }
  .btn-add-cart      { transition: none; }
}
```

**Why suppress `.product-card-shop` transitions in shop.css:** The card hover `transform: translateY(-3px)` is a transition, not a keyframe. Technically `prefers-reduced-motion: reduce` means "minimize motion, not eliminate" — the WCAG guidance allows brief transitions. However, to satisfy the success criterion ("no `@keyframes` running"), the keyframe suppression is the critical part. The hover transitions (non-looping, user-initiated) are borderline acceptable.

**JS already handles the main cases:** `initHeroParallax()` and `initParticles()` both check `prefers-reduced-motion` in script.js — these do not need CSS fallbacks.

---

## 5. LCP / Performance

### 5.1 Hero Image Preload Strategy

**The preload must point to the EXACT same URL that the browser will actually request.** If the CSS uses a plain URL but the preload uses a Cloudinary-transformed URL, the preload is wasted (browser fetches both).

**Decision tree:**

Option A — Preload the existing URL, add transforms to both places simultaneously:
1. Change CSS background URL to use Cloudinary transforms (`f_auto,q_80,w_1400`)
2. Add `<link rel="preload">` with the SAME transformed URL

Option B — Preload the existing URL without transforms first (lower risk):
1. Add `<link rel="preload">` with the current URL (no transforms)
2. This is safe and immediately improves LCP
3. Transforms can be added later (POL-04 scope)

**For Phase 1 (FOUND-05), use Option B — minimal change, guaranteed improvement:**
```html
<link rel="preconnect" href="https://res.cloudinary.com" />
<link rel="preload" as="image"
  href="https://res.cloudinary.com/dcenbexvc/image/upload/v1772654458/__________2k_delpmaspu_1_s91wir.jpg"
  fetchpriority="high" />
```

Add these two lines immediately after the existing `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />` line, and before the Google Fonts stylesheet link (which is render-blocking and should be as late as possible in the `<head>`).

**Why `fetchpriority="high"` matters:** Without it, the browser may still deprioritize the preloaded image behind other resources. `fetchpriority="high"` explicitly marks it as critical, moving it ahead of scripts and stylesheets in the network queue.

### 5.2 `font-display: swap` — Already Correct

The Google Fonts URL already includes `&display=swap`. No change needed here. The `display=swap` prevents invisible text during font load (FOIT) by showing system font first, then swapping when web font is ready.

### 5.3 Render-Blocking Resources Audit

**index.html `<head>` render-blocking resources:**
1. `https://fonts.googleapis.com/css2?...` — render-blocking stylesheet (Google Fonts)
2. `css/style.css?v=5` — render-blocking stylesheet (mandatory, cannot defer)

No `<script>` tags in `<head>` — scripts are at bottom of body. Good.

The Google Fonts CSS is render-blocking but necessary. The `preconnect` tags already minimize DNS + TLS overhead. The `display=swap` prevents FOIT. No further improvement possible without moving to self-hosted fonts (out of scope — no build step).

### 5.4 `scroll-behavior: smooth` vs. JS Smooth Scroll

**style.css line 8:** `html { scroll-behavior: smooth; }`
**script.js lines 43–56:** `initSmoothScroll()` uses `window.scrollTo({ behavior: 'smooth' })` with a nav offset correction.

**Conflict:** Both are active. The CSS `scroll-behavior: smooth` fires on all anchor links (including those NOT handled by JS), but the JS version fires on all `a[href^="#"]` clicks with `e.preventDefault()` — which intercepts first. So JS wins on all nav link clicks. CSS `scroll-behavior: smooth` would only fire on links the JS misses (none currently) or programmatic scrolls.

**Phase 1 recommendation:** Remove `scroll-behavior: smooth` from `html` to eliminate the redundancy and remove a potential conflict source. The JS version handles the important case (nav offset). This is a one-line change.

**Caveat:** Removing it means anchor links in areas NOT covered by the JS click listener (e.g., footer links, mobile menu might not be covered) would lose smooth scrolling. Check: `initSmoothScroll()` uses `document.addEventListener('click', ...)` which catches ALL clicks globally — so ALL `a[href^="#"]` links are covered. Safe to remove from CSS.

---

## 6. Implementation Order

The seven requirements have dependencies. Implement in this order to minimize risk of breaking things mid-pass:

### Step 1: FOUND-02 — Add `--whatsapp` token (safest, zero risk)
- Add `--whatsapp: #25D366` and `--whatsapp-dark: #20BA5A` to `:root` in style.css.
- Replace 7 occurrences of `#25D366` and 2 occurrences of `#20BA5A` in style.css.
- **Risk:** Zero — pure search-and-replace of color values.
- **Verify:** Grep for `#25D366` in both CSS files — should return 0 results.

### Step 2: FOUND-04 — Add `prefers-reduced-motion` blocks (low risk)
- Add `@media (prefers-reduced-motion: reduce)` blocks to both CSS files.
- Fix `scroll-bounce` animation to use `transform` instead of `top` at the same time (GPU improvement).
- **Risk:** Low — adds new media query, does not modify existing rules.
- **Verify:** Enable "Emulate CSS prefers-reduced-motion" in Chrome DevTools → check no animations run.

### Step 3: FOUND-03 — Fix cart sidebar animation (medium risk)
- Change `right: -100%` → `transform: translateX(100%)` on `#cartSidebar`.
- Change `right: 0` on `.cart-open` → `transform: translateX(0)`.
- **Risk:** Medium — visual change to a core interaction. Test on both desktop (panel) and mobile (full-width). Verify the `@media (min-width: 480px)` partial-width variant still works.
- **Verify:** Open/close cart on desktop Chrome, mobile emulation (375px), and actual mobile if available. Look for any visual snap or wrong positioning.

### Step 4: FOUND-01 — Add `@layer` (higher risk, do after visual fixes are stable)
- Add `@layer reset, tokens, base, layout, components, utilities, overrides;` declaration to top of style.css.
- Wrap existing style.css rule groups in their respective `@layer` blocks.
- Remove the 3 `!important` declarations from `.nav-cta` (they become redundant with `overrides` layer).
- Add `@layer` blocks to shop.css.
- **Risk:** Higher — restructuring the cascade. Any selector that relied on implicit specificity ordering could be affected. Test all sections of index.html and all shop.html states (product grid, cart open, checkout modal, empty state, filter active).
- **Verify:** No visual regression on index.html hero, about, products, nature, location, contact, footer. No visual regression on shop.html grid, cart, checkout modal.

### Step 5: FOUND-05 — Add hero preload links to index.html (low risk)
- Add `<link rel="preconnect" href="https://res.cloudinary.com" />` to `<head>`.
- Add `<link rel="preload" as="image" href="[hero-url]" fetchpriority="high" />` to `<head>`.
- **Risk:** Very low — purely additive.
- **Verify:** Chrome DevTools → Network tab → filter by "Img" → confirm hero image appears in the first few requests with high priority, before CSS fully parses.

### Step 6: FOUND-06 — Remove unused font weights (low risk)
- Update Google Fonts URL: remove `400` from Frank Ruhl Libre, remove `300` from Heebo.
- **Risk:** Low — the only visible change is `.hero-subtitle` losing `font-weight: 300` (falls back to `400`). Check visually that this is acceptable.
- **Verify:** Open index.html, check hero subtitle text still renders in Heebo (not system fallback), check headings still render in Frank Ruhl Libre.

### Step 7: FOUND-07 — Add CSV fetch timeout to shop.js (low risk)
- Add `AbortController` timeout pattern to `loadFromSheet()`.
- **Risk:** Low — only affects the error path (slow/unresponsive Google Sheets).
- **Verify:** Temporarily set `SHEET_CSV_URL` to a slow URL or add an artificial delay to confirm the timeout fires and demo products remain visible.

---

## 7. Validation Architecture

How to verify each success criterion after implementation:

### Criterion 1: No new `!important` in either CSS file
```bash
grep -n "!important" css/style.css css/shop.css
```
Expected result: 0 matches. If `@layer` is implemented correctly, the 3 existing `!important` instances in `.nav-cta` are removed. Any new ones are a regression.

### Criterion 2: `#25D366` appears exactly once — as `--whatsapp` in `:root`
```bash
grep -n "#25D366\|#25d366" css/style.css css/shop.css
```
Expected result: exactly 1 match — the `:root` token definition. Also verify the token is used:
```bash
grep -n "var(--whatsapp)" css/style.css css/shop.css
```
Expected: 7+ matches.

### Criterion 3: Cart animation runs on GPU — no jank on old device
**Manual test:**
1. Open Chrome DevTools → More Tools → Rendering → enable "FPS meter."
2. Open the cart sidebar on a throttled CPU (DevTools → Performance → CPU throttling 6×).
3. Observe the frame counter during open/close animation.
4. Expected: stays at or near 60fps. With `right` property: drops to 30–40fps. With `transform`: stays at 60fps.

**Automated check:**
```bash
grep -n "right:" css/shop.css | grep "cartSidebar\|cart-open"
```
Expected: 0 matches. The only `right` properties in cartSidebar context should be static positioning values (e.g., badge position), not animation targets.

### Criterion 4: No `@keyframes` running under `prefers-reduced-motion: reduce`
**DevTools test:**
1. Chrome DevTools → Rendering tab → "Emulate CSS media feature prefers-reduced-motion: reduce"
2. Reload index.html and shop.html
3. Inspect: hero orb should be static, particles absent (JS guard), scroll dot static, WA pulse static, about float cards static, nature label badge static
4. Open shop with spinner loading: spinner should not spin

**CSS grep verification:**
```bash
grep -n "prefers-reduced-motion" css/style.css css/shop.css
```
Expected: at least 2 matches (one per file).

### Criterion 5: LCP improved — hero image preloads correctly
**Chrome DevTools — Lighthouse:**
1. Run Lighthouse on index.html (mobile preset, throttled)
2. Before: check LCP timing in Performance panel — hero image typically 3–5s on throttled mobile
3. After adding preload: LCP should improve by 1–2s minimum

**Network tab verification:**
1. Open DevTools → Network → filter "Img"
2. Reload with cache disabled (Ctrl+Shift+R)
3. The Cloudinary hero image should appear very early in the waterfall — before CSS fully downloads
4. "Initiated by" column should show "link rel=preload" (not "style.css")

**Quick HTML check:**
```bash
grep -n "preload\|fetchpriority" index.html
```
Expected: at least 2 matches (preconnect to cloudinary + preload for image).

### Criterion 6: Unused font weights removed (FOUND-06)
```bash
grep -n "fonts.googleapis.com" index.html shop.html
```
Verify the URL contains only `wght@700;900` for Frank Ruhl Libre and `wght@400;500;600;700` for Heebo.

**Visual check:** Load index.html, check that hero title renders in Frank Ruhl Libre (not system serif), hero subtitle renders in Heebo (not system sans), and `.hero-subtitle` visually looks acceptable at weight 400 (previously 300).

### Criterion 7: CSV timeout fires (FOUND-07)
**Test in browser console:**
```js
// Temporarily override SHEET_CSV_URL to a non-existent URL with artificial latency
// Or test by setting timeout to 100ms and using the real URL on a slow connection
```

**Code grep verification:**
```bash
grep -n "AbortController\|setTimeout.*5000\|Promise.race" js/shop.js
```
Expected: the timeout implementation present.

**Behavioral test:** Load shop.html with a modified URL pointing to a URL that hangs (e.g., `https://httpstat.us/200?sleep=10000`). After 5 seconds, the demo products should remain visible and a console warning should appear. The page should NOT show a loading spinner indefinitely.

---

## Summary Table

| Requirement | Files Changed | Risk Level | Dependencies | Validation Method |
|-------------|---------------|------------|--------------|-------------------|
| FOUND-01 (`@layer`) | style.css, shop.css | High | Must do AFTER FOUND-02, FOUND-03, FOUND-04 to avoid debugging compounded changes | Grep for `!important`; full visual QA |
| FOUND-02 (`--whatsapp` token) | style.css only | Zero | None — do first | Grep `#25D366` → 1 result |
| FOUND-03 (GPU cart animation) | shop.css only | Medium | None | DevTools FPS meter at 6× CPU throttle |
| FOUND-04 (reduced-motion CSS) | style.css, shop.css | Low | None | DevTools emulate reduced-motion |
| FOUND-05 (hero preload) | index.html only | Low | None | Lighthouse LCP; Network tab waterfall |
| FOUND-06 (font weight trim) | index.html, shop.html | Low | None | Grep font URL; visual subtitle check |
| FOUND-07 (CSV timeout) | js/shop.js only | Low | None | Network test with slow URL |

---

## RESEARCH COMPLETE
Files written: .planning/phases/01-foundations-תשתית-cssjs/01-RESEARCH.md
