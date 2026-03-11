# STACK — Best 2025 Approach for This Project

**Context:** Pure HTML/CSS/JS, no npm, no build tool, Vercel static deploy, Hebrew RTL, premium spice shop.

---

## 1. CSS Techniques

### Use: Modern CSS — already mostly done right, push further

The current codebase already uses CSS custom properties, `clamp()`, `inset-*` logical properties, and `transition`. The gap to premium is in three specific areas:

#### @layer — adopt immediately
Organize the stylesheet with explicit cascade layers to eliminate specificity wars and make the codebase easier to extend:

```css
@layer reset, tokens, base, layout, components, utilities, overrides;
```

Current reality: `style.css` and `shop.css` load alongside each other with no layer control. Adding a shared button style in `shop.css` can accidentally override `style.css` rules. Layers fix this without `!important` hacks. There are already two `!important` instances in the current CSS — both are symptoms of this problem.

#### :has() — use for shop interactive states
Avoid JavaScript for purely visual state changes. Example: instead of JS toggling a class to indicate a card has an image:

```css
.product-card-shop:has(.pcs-image) .pcs-icon-area { display: none; }
.filter-bar:has(#searchInput:not(:placeholder-shown)) .search-icon { color: var(--brown-500); }
```

Browser support: 93%+ globally (2025). Safe to use for progressive enhancement on this site.

#### Container queries — targeted use only
The shop product grid already uses three `min-width` breakpoints for column count. Container queries let individual cards respond to their container width rather than the viewport — useful if the card design becomes more complex. But the current grid with `repeat(2,1fr)` → `repeat(3,1fr)` → `repeat(4,1fr)` already works well. Only add container queries if card internals need to change at different column widths.

#### What's missing: `@property` for animatable custom properties
The amber gradient on `.section-label`, `.btn-primary`, `.btn-shop` could animate smoothly if defined via `@property`. Currently CSS transitions on `background: linear-gradient(...)` don't animate — they snap. For premium hover effects on CTA buttons:

```css
@property --btn-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 135deg;
}
.btn-primary {
  background: linear-gradient(var(--btn-angle), var(--brown-300), var(--orange));
  transition: --btn-angle 400ms var(--ease);
}
.btn-primary:hover { --btn-angle: 180deg; }
```

Support: Chrome 85+, Firefox 128+, Safari 16.4+. Use as progressive enhancement.

#### CSS nesting — do NOT use yet
Native CSS nesting is technically available (Chrome 120+, Safari 17.2+, Firefox 117+) but Sass-like `&` nesting still has edge cases with older iOS WebKit. The current flat selector structure is readable and works. Nesting adds no runtime benefit — it's a DX feature, and without a build tool it still needs to be written manually. Skip until 2026 when baseline support is solid.

#### Preprocessors (Sass/Less) — skip entirely
No build tool means no preprocessor. The existing CSS custom properties system already delivers the main Sass benefit (variables). Sass mixins for `rtl` direction are tempting but the project uses logical CSS properties (`inset-inline-start`, `padding-block`) correctly throughout — this is the right modern RTL approach. No Sass needed.

---

## 2. Animation Libraries

### Verdict: Stay native — the current approach is already correct

The existing stack uses:
- CSS `@keyframes` for persistent animations (particles, orb-drift, float-a, wa-ring)
- `IntersectionObserver` + CSS class toggling for scroll reveals
- `requestAnimationFrame` for parallax and counters
- CSS `transition` for hover states

This is the correct 2025 approach for a static site. Adding an external library would increase payload with no meaningful benefit.

#### GSAP free tier — when to consider
GSAP adds value only if you need:
- Timeline-based sequences (hero elements animating in sequence on page load)
- ScrollTrigger pinning
- Complex path animations

For this project, the only real candidate is a staggered hero entrance animation. The current particles + reveal pattern is already good. If the hero redesign needs more choreography, GSAP's core (37KB gzip) loaded via CDN is acceptable:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
```

Do not use ScrollTrigger (adds another 30KB+). `IntersectionObserver` handles the reveal use case already.

#### AOS (Animate On Scroll) — skip
AOS is 13KB and does exactly what the current `IntersectionObserver` + `.reveal` pattern already does, but with less control over timing and RTL behavior. The existing custom implementation is lighter, more specific, and already handles `prefers-reduced-motion`. AOS would be a step backwards.

#### `prefers-reduced-motion` — already implemented correctly
Both `initHeroParallax()` and `initParticles()` check `prefers-reduced-motion`. The CSS animations (float-a, orb-drift, etc.) do not have this check. Add it:

```css
@media (prefers-reduced-motion: reduce) {
  .ac-1, .ac-2, .ac-3, .ac-4,
  .hero-bg::after,
  .particle,
  .wa-pulse { animation: none; }
  .reveal, .reveal-right, .reveal-left { opacity: 1; transform: none; }
}
```

This is a real accessibility requirement, not optional.

---

## 3. Performance — LCP, Images, Fonts

### Hero image — the #1 LCP issue

The hero background is loaded via CSS `background:` on `.hero-bg`:

```css
background: ... url('https://res.cloudinary.com/.../...jpg') center/cover no-repeat;
```

This is the worst possible LCP pattern. The browser cannot discover the image until it parses CSS, applies the rule to the element, and checks if the element is visible. LCP for this image will be 3–5 seconds on mobile.

**Fix:** Add an `<img>` with `fetchpriority="high"` in the HTML, position it absolutely behind the gradients, then remove the background URL from CSS. The browser preloads it immediately from HTML parsing.

Alternatively, use `<link rel="preload">` in `<head>`:
```html
<link rel="preload" as="image"
  href="https://res.cloudinary.com/dcenbexvc/image/upload/f_auto,q_80,w_1400/v1772654458/__________2k_delpmaspu_1_s91wir.jpg"
  fetchpriority="high" />
```

Either approach is compatible with static HTML + Cloudinary.

### Cloudinary — use transformation URLs

The hero image is loaded at full resolution from Cloudinary. Cloudinary supports URL-based transforms — use them:

```
/f_auto,q_80,w_1400/   → WebP/AVIF, 80% quality, 1400px wide
/f_auto,q_80,w_800/    → for mobile (via <picture> srcset)
```

The logo SVG is already on Cloudinary — good. SVG needs no transforms.

### Google Fonts — existing setup is good, one improvement available

The current `<link rel="preconnect" href="https://fonts.googleapis.com">` is correct. For further LCP improvement, add `font-display: optional` or `swap` in the Google Fonts URL:

```
https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;700;900&family=Heebo:wght@300;400;500;600;700&display=swap
```

`display=swap` is already in the URL — this is correct. The only remaining issue is that Frank Ruhl Libre at weight 400/700/900 and Heebo at 300/400/500/600/700 is 7 font files. Consider whether all weights are used:

- Frank Ruhl Libre: only 700 and 900 are used in headings (`font-weight: 700`, `900`). Weight 400 is declared but the site uses Heebo for body text.
- Heebo: 300 is only used in `.hero-subtitle`. 500 is used in nav links and a few labels.

Remove unused weights. Eliminating Frank Ruhl Libre 400 and Heebo 300 saves 2 HTTP requests.

### JavaScript — shop.js CSV fetch

The CSV fetch happens after `DOMContentLoaded` in `init()`, and demo products render immediately — this is the right approach. One improvement: the `loadFromSheet()` function does not set a timeout. A slow Google Sheets response will hold the CSV render indefinitely. Add:

```js
const resp = await Promise.race([
  fetch(SHEET_CSV_URL),
  new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000))
]);
```

### Vercel static — headers

Check `vercel.json` for cache headers on CSS/JS/images. Static assets should be `Cache-Control: public, max-age=31536000, immutable`. The current `?v=5` cache-busting on `style.css` is the right pattern for a no-build workflow.

---

## 4. Mobile-First — Touch, Safe Areas, Scroll

### Touch targets — one real problem found

The cart quantity `+` / `−` buttons (`.ci-btn`) are 32×32px. WCAG minimum is 44×44px. Apple HIG recommends 44pt. On small phones this is the most commonly fumbled UI. Increase to 40px min (with touch-action: manipulation to remove the 300ms tap delay):

```css
.ci-btn {
  min-width: 40px;
  min-height: 40px;
  touch-action: manipulation;
}
```

The `btn-add-cart` at `padding: 6px 10px` is similarly small. On mobile, this is the primary conversion action — it needs a bigger tap area.

### Safe areas — iOS notch/home bar

The cart sidebar uses `height: 100dvh` (correct — uses dynamic viewport height). The WhatsApp float button at `bottom: 20px` may overlap the iOS home indicator on notched phones. Add safe area inset:

```css
.wa-float {
  bottom: max(20px, env(safe-area-inset-bottom, 20px));
}
#cartSidebar {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```

### Scroll behavior

- `overscroll-behavior: contain` on `#cartBody` and `.modal-body` is already implemented — correct, prevents scroll chaining.
- `-webkit-overflow-scrolling: touch` on those same elements is legacy (removed from WebKit spec) — can be removed without effect on modern iOS.
- `scroll-behavior: smooth` on `html` is set globally. This will fight with the JS smooth scroll implementation in `initSmoothScroll()`. Only one mechanism should handle smooth scrolling. Since the JS version handles nav offset correctly, remove `scroll-behavior: smooth` from `html` and let the JS handle it.

### Category filter swipe

The `.cat-filters` horizontal scroll strip uses `scrollbar-width: none` and `-webkit-scrollbar: none`. Missing: add `scroll-snap-type: x mandatory` and `scroll-snap-align: start` on `.cat-btn` for a snappier native feel on mobile. Also ensure momentum scrolling works:

```css
.cat-filters {
  -webkit-overflow-scrolling: touch; /* still useful for older iOS */
  scroll-snap-type: x proximity;    /* proximity not mandatory — prevents over-snapping */
}
```

---

## 5. What NOT to Use

### React / Vue / Svelte — obviously no
No build tool, no npm, no reason to add 40–200KB of framework runtime to a site that renders fine with HTML and ~20KB of custom JS.

### Tailwind CSS (CDN Play version)
The CDN version of Tailwind ships the entire 3MB stylesheet. The project already has a well-organized custom CSS system with design tokens. Tailwind would conflict with RTL logical properties, require rewriting all existing HTML classes, and produce less readable CSS for a bilingual (Hebrew/English code) codebase.

### Alpine.js
The interactivity in shop.js (cart, filters, modals) is already implemented correctly in vanilla JS. Alpine.js is 15KB and adds a learning curve with no benefit over the existing clean IIFE pattern.

### AOS, Wow.js, ScrollReveal
All do what `IntersectionObserver` already does in `initReveal()`. They add 10–30KB each.

### jQuery
Already absent — keep it absent. Everything in `script.js` and `shop.js` is clean modern JS with no jQuery patterns needed.

### Web Components
Tempting for the product card, but custom elements require a JS registry and add complexity. The current template-string rendering in `productCardHTML()` is simpler, faster to load, and easier to debug for an HTML-first project.

### CSS-in-JS (Emotion, styled-components)
Requires Node.js. Not applicable.

### Lottie animations
Lottie JSON files are heavy (often 100KB+) and require the Lottie player library (60KB). The current CSS `@keyframes` animations achieve the premium feel needed for this project at zero additional weight.

---

## Summary Table

| Technique | Decision | Reason |
|-----------|----------|--------|
| CSS custom properties | Keep + extend | Already solid foundation |
| `@layer` | Add | Eliminate specificity issues between style.css and shop.css |
| `:has()` | Add selectively | Reduce JS for visual states |
| `@property` | Add for CTA buttons | Animatable gradients, progressive enhancement |
| Container queries | Defer | Current grid breakpoints work; revisit if card complexity grows |
| CSS nesting | Skip | No build tool, edge cases in older iOS |
| GSAP core | Add only if hero gets timeline animation | 37KB CDN is acceptable |
| AOS / ScrollReveal | Skip | Duplicates existing IntersectionObserver |
| `prefers-reduced-motion` in CSS | Add immediately | Accessibility gap |
| Hero image via CSS background | Fix to `<link rel="preload">` | Critical LCP fix |
| Cloudinary transform URLs | Add `f_auto,q_80,w_1400` | Significant image size reduction |
| Google Fonts unused weights | Remove 2 requests | Minor but easy win |
| Touch targets 44px min | Fix `.ci-btn` and `.btn-add-cart` | Mobile UX + WCAG |
| `env(safe-area-inset-bottom)` | Add to WA float and cart sidebar | iOS home bar overlap |
| `scroll-behavior: smooth` on `html` | Remove | Conflicts with JS smooth scroll |
| `-webkit-overflow-scrolling: touch` | Remove from modal/cart | Deprecated spec |
| CSV fetch timeout | Add 5s timeout | Resilience |

---

*Research completed: 2026-03-11*
