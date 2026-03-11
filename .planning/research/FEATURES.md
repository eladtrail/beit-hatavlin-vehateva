# FEATURES — Premium Artisan Food/Spice Shop Website, 2025

Research for: בית התבלין והטבע
Based on: current codebase audit + best practices from premium food brands (Aesop, Ottolenghi, Burlap & Barrel, Diaspora Co., Curio Spice)

---

## 1. Landing Page (index.html)

### Table Stakes — must have or it feels broken

- **Clear value proposition above the fold.** Visitors need to understand within 3 seconds: what you sell, who you are, why you're different. Current hero has the right structure but the `<h1>` is empty (`<br /><span class="hero-title-gradient"></span>`) — this is a broken state.
- **Sensory language in copy.** "טחינה במקום" is good. Premium brands lead with smell, texture, origin: "ריח הכמון הטרי", "ממקור יחיד", "נטחן היום". Generic copy ("מוצרים איכותיים") converts nobody.
- **One clear primary CTA.** Current hero has three CTAs (WhatsApp, scroll-to-products, shop). That splits attention. Premium sites pick one primary action and make the others visually subordinate.
- **Real photography or none.** Unsplash stock photos of generic spice bowls signal "template site." Premium brands use their own product photography. If real photos aren't available yet, illustration or a strong color/texture background beats stock.
- **Working hours visible without scrolling.** For a physical store, hours are critical trust information. Currently buried in the Location section. Should appear in the footer or a compact strip near the CTA.

### Differentiators — create premium feel

- **Origin storytelling.** Ottolenghi, Burlap & Barrel, and Diaspora Co. all lead with provenance: where the spice comes from, who grew it, how it differs from supermarket alternatives. One sentence per product category on the landing page ("הכמון שלנו מגיע מאיראן, נטחן אצלנו ביום ההזמנה") creates real perceived value.
- **Grinding-on-demand as a hero feature.** This is a genuine differentiator that most Israeli spice shops don't have. Currently mentioned as a badge but not dramatized. Aesop-style: give it an entire moment — a photo, a short explanation of why it matters (volatile oils, shelf life, flavor).
- **Seasonal or "now in stock" callout.** A small rotating banner or a single featured-product card ("מוצר השבוע: זעפרן איראני") creates a reason to return and signals an active, curated business.
- **Personal faces.** פיני ותאיר are named throughout but never shown. A small photo of the founders — even informal — dramatically increases trust for a local artisan shop. Aesop stores do this with staff portraits.
- **Social proof at the point of decision.** Customer quotes (even 2–3) near the CTA or near the "visit us" section. Format: short quote, first name + neighborhood ("מה טעים! — רחל, נשר"). No star ratings needed — they look fake without volume.
- **A "how it works" strip for online orders.** Because WhatsApp checkout is unfamiliar, a 3-step visual: "בחרו מוצרים → הוסיפו לסל → ההזמנה נשלחת בווטסאפ" removes hesitation before clicking "הזמינו עכשיו."
- **Micro-animations tied to scroll.** Current `reveal` class animations are good. Differentiator: parallax on the hero background (subtle, 10–15%), subtle scale on product card hover (already exists), and a staggered entrance for the stats strip.

### Anti-Features — avoid

- **Video autoplay hero.** Adds 3–8 MB, slows LCP, annoys mobile users. The particle animation already provides motion.
- **Pop-up newsletter signup.** There is no email list infrastructure and it blocks the shopping flow. High-cost/zero-benefit for this site.
- **Carousel/slider for product categories.** Carousels on landing pages have notoriously low interaction rates past the first slide. The current static grid with hover effects is better.
- **Live chat widget (Crisp, Tawk).** WhatsApp is already the channel; adding another chat widget creates confusion and adds 30–50 KB of third-party JS.
- **Parallax on every section.** One subtle parallax on the hero is a differentiator. Parallax on every section creates visual noise and harms mobile performance.

---

## 2. Product Cards (shop.html)

### Table Stakes

- **Product image that communicates the category.** Current cards use gradient+icon (e.g., brown gradient + 🧂 for spices). This works as a fallback but real product photos are the expected baseline for any food shop. Even a single high-quality photo per category icon is better than a flat gradient.
- **Price clearly visible before any interaction.** Current cards show ₪XX at the bottom. Good. Price must never be hidden in a "tap to see" pattern for a catalog this size.
- **Out-of-stock state that does not hide the product.** Current implementation shows "אזל" badge and disables the button — correct. The product stays visible so the customer knows it exists (potential WhatsApp inquiry).
- **"In cart" feedback on the button.** Current implementation updates button to "בסל ×N" — this is the right pattern, already implemented.
- **Readable product name at small sizes.** At 320px wide (iPhone SE), a 3-column grid would truncate names. Current responsive approach should verify 1-column or 2-column at 375px, 2-column at 428px, 3-column at 768px+.

### Differentiators

- **Brief provenance or usage note in the description.** "נטחן לפי הזמנה" (already present) is great. Adding one specific use case increases purchase confidence: "מושלם לאפיית עוגיות ולשמן ניחוח." Burlap & Barrel does this with 2–3 suggested uses per spice.
- **Weight/quantity indicator.** What does ₪18 buy? 100g? 200g? The absence of a quantity makes the price feel uncertain. Even "~100 גרם" adds trust.
- **"Frequently bought with" grouping.** Visual grouping in the grid: all spices together, then drinks, then nature items — not random. Current category filter handles this but the grid itself has no grouping headers. A section divider label ("תבלינים — 4 מוצרים") helps scanning.
- **Hover/focus state that reveals a "quick add" interaction.** Desktop pattern: on hover, a card slightly lifts and shows the full "+ הוסף לסל" button more prominently (or shows a quantity stepper). Mobile: tap card to expand description, tap button to add. Currently the button is always visible — which is fine — but a lift+shadow on hover creates premium feel.
- **Low stock urgency indicator.** When stock <= 3: "נשאר מעט במלאי" text (orange, small) near the price. This is a proven conversion driver for artisan items. The `stock` field already exists in the data model.

### Anti-Features

- **Quantity selector on the card itself.** A stepper (+/−) on every card clutters the grid. The correct pattern: "add to cart" on the card, quantity adjustment inside the cart sidebar. Current implementation already does this correctly.
- **Wishlist/favorites.** No auth, no persistence across devices — a wishlist that vanishes on browser clear is worse than no wishlist.
- **Product ratings on cards.** No review system exists. Empty stars (0 reviews) destroy trust. Avoid until real reviews can be collected.
- **"Compare" functionality.** Not relevant for a catalog of fewer than 50 unique items.

---

## 3. Cart UX

### Table Stakes

- **Cart count always visible in the navbar.** Current implementation: badge shows count. When count = 0, badge is hidden. Correct — a "0" badge looks like an error.
- **Adding to cart does not interrupt browsing.** Current implementation: no auto-open cart. The button updates to "בסל ×N". This is the right 2025 pattern (Shopify's default behavior). A brief toast or micro-animation confirming the add would complete this.
- **Cart survives page refresh.** Current implementation uses localStorage — correct.
- **Cart total visible before submitting the order.** Currently shown in cart footer and in the checkout modal. Good.
- **Easy item removal.** Current: ✕ button per item, and a "רוקן סל" button. Both needed.
- **Cart accessible without scrolling.** Sticky navbar with cart button — correct.

### Differentiators

- **Animated cart icon feedback on "add."** When user taps "+ הוסף", the cart icon in the navbar should briefly bounce or pulse (a 200ms CSS animation). This closes the feedback loop without opening the cart.
- **Item subtotal shown per line item.** Current: "₪18 ליחידה · סה"כ ₪36" — excellent, this is the right format. Many carts only show the unit price and confuse buyers.
- **"Continue shopping" as a secondary action, not primary.** Current footer has "← המשך קנייה" alongside "🗑 רוקן סל". The continue button is good — it makes closing the cart feel intentional, not accidental. "רוקן סל" should require confirmation (a single "האם אתה בטוח?" step or an undo toast) because accidental cart clearing is irreversible.
- **Cart empty state with CTA.** Current empty state: icon + "הסל ריק" + "הוסיפו מוצרים מהחנות". This is fine. Differentiator: add a direct link to a bestseller or featured category from the empty state ("התחילו עם התבלינים →").

### Anti-Features

- **Auto-open cart on every add.** Current implementation correctly avoids this. Shopify learned this in 2021 and moved to the persistent counter pattern.
- **Forced account creation before checkout.** Not applicable (no auth system).
- **Progress bar for a 1-step checkout.** A "step 1 of 3" bar for a simple name+phone form adds friction and false complexity.
- **Coupon/promo code field in the cart.** No promo system exists. An empty coupon field creates an expectation that can't be met and sends users searching for codes that don't exist.

---

## 4. Filter and Search

### Table Stakes

- **Category filters respond instantly (no loading state).** Current implementation filters client-side — instant. Correct for a catalog this size.
- **Active filter is visually distinct.** Current: `.cat-btn--active` class. Needs strong visual differentiation — filled background vs. outline-only for inactive buttons.
- **Search clears easily.** The `<input type="search">` element provides a native clear button on iOS and Android. This is already in place.
- **"No results" state is helpful.** Current empty state suggests trying other words or categories. Good. A "חזור לכל המוצרים" button would complete it.
- **Filter + search work together (AND logic).** Current implementation: `matchCat && matchSearch` — correct.

### Differentiators

- **Filter bar sticks below the navbar on scroll.** Current: `#filterBar` with `id="filterBar"`. To make this sticky, `position: sticky; top: [navbar-height]` is needed. This means users can browse a long product list without scrolling back up to change the filter — a significant usability gain on mobile.
- **Filter pill count.** Show the number of products in each category: "תבלינים (4)". Helps users decide which filter to use without clicking.
- **Debounced search (150ms).** Current implementation fires on every `input` event. For 15 demo products this is imperceptible. For 50+ real products, a 150ms debounce prevents jank on slow devices.
- **Highlight search term in results.** When the user searches "כמון", the word "כמון" in matching product names appears bold. A small detail that makes the search feel responsive and intelligent.

### Anti-Features

- **Multi-select filters.** With 5 categories and under 50 products, multi-select adds complexity with no benefit. Single active category is the right UX.
- **Sort controls (price low-high, alphabetical).** For a catalog this size, sorting adds UI complexity without real value. Curated ordering (bestsellers first, out-of-stock last) is better than user-controlled sort.
- **Faceted filtering (price range sliders, tags).** Over-engineering for this catalog size and price range (₪15–₪95 — a narrow band).
- **Search-as-you-type with API calls.** All products are loaded in memory. A live API search would be slower, not faster.

---

## 5. WhatsApp Checkout

### Table Stakes

- **The WhatsApp message is pre-filled and readable.** Current `buildWhatsAppMessage` produces a well-structured message with name, phone, itemized list, and total. This is the core requirement and it's done correctly.
- **The message opens in WhatsApp without requiring the user to copy-paste.** `wa.me` link with `?text=` parameter handles this. Works on iOS, Android, and WhatsApp Web.
- **The form validates name and phone before sending.** Current: `required` on both fields, HTML5 validation. Missing: phone number format validation (Israeli mobile format). A user typing "050" as a phone number will pass validation but the shop owner can't call them back.
- **Cart clears after order is sent.** Current implementation: clears cart + resets form + shows toast. Correct — prevents accidental double-orders.
- **The user knows what happens next.** Current toast: "✅ ווטסאפ נפתח! שלח את ההודעה לסיום ההזמנה." Good — it sets the right expectation.

### Differentiators

- **Include a date/time stamp in the WhatsApp message.** Helps the shop owner process orders in sequence. Format: `📅 תאריך: יום ג׳, 11.3.2026, 14:32`.
- **Include a generated order number in the message.** Even a simple timestamp-based ID ("הזמנה #241103-1432") lets both parties reference the same order in follow-up conversation. This is a significant operational improvement that costs 3 lines of JS.
- **Offer both phone numbers at checkout.** Currently the WhatsApp message always goes to פיני (WA_PHONE). A two-button submit ("שלח לפיני" / "שלח לתאיר") at the bottom of the checkout form, or a single dropdown, splits the load and lets returning customers contact their preferred contact. Low implementation cost, high practical value.
- **Order confirmation screen (post-send).** Instead of just a toast, show a brief "תודה על ההזמנה!" state in the checkout modal with the order summary before closing. This moment of confirmation builds trust and feels premium. The toast disappears in 4 seconds — the confirmation screen stays until the user closes it.
- **WhatsApp message formatted for readability on the shop owner's side.** Current format is good. Enhancement: add a separator line between sections, and include the total in large bold-equivalent text (WhatsApp bolds text wrapped in `*asterisks*`): `*סה"כ: ₪${total}*`.

### Anti-Features

- **Requiring address for pickup-only orders.** The address field is currently optional — this is correct. If the shop only does local delivery/pickup, marking address as required will cause form abandonment. Keep it optional or add a delivery method toggle.
- **Payment proof upload.** No payment is collected online; asking for proof of payment adds confusion.
- **Email confirmation.** No backend means no email system. Don't promise what can't be delivered.
- **"Save my details" checkbox without storage.** If implemented naively, this would store PII in localStorage indefinitely. Avoid unless implemented properly with consent.

---

## 6. Mobile Shopping

### Table Stakes

- **Tap targets are minimum 44×44 CSS pixels.** The "+" and "−" quantity buttons in the cart (`ci-btn`) must be large enough to tap without frustration. 32px buttons on mobile are the single biggest source of cart rage-taps.
- **The cart sidebar is full-screen on mobile, not a partial overlay.** A 300px-wide sidebar on a 375px screen leaves only 75px of content visible — not useful. On mobile (<600px), the cart should slide up from the bottom as a sheet, or open full-screen. This is a critical UX gap in the current implementation.
- **Filter bar scrolls horizontally if categories overflow on small screens.** With 6 categories ("הכל", "מארזים", "תבלינים", "שתייה", "טבע", "אחר") on a 375px screen, a wrapping row is fine but an overflowing single row with `overflow-x: auto` and no scrollbar is cleaner. Either approach works; the current `cat-filters` styles need to be verified at 320px.
- **Input type="tel" shows numeric keyboard on iOS/Android.** Current `<input type="tel">` is correct.
- **The checkout form fields are large enough to tap.** Labels + inputs with `min-height: 44px` on mobile. This is a CSS concern.

### Differentiators

- **Bottom navigation bar on mobile for the shop page.** A persistent bottom bar with: [cart icon + count] [filter icon] creates a native-app feel and puts controls in the thumb zone. The current sticky top navbar is desktop-first thinking; mobile-first thinking puts primary actions at the bottom.
- **Pull-to-refresh is not needed** (client-side data) but a visible "מרענן..." indicator if the Google Sheets fetch is slow would improve perceived performance.
- **Swipe-to-remove cart items.** A left swipe on a cart item reveals a red "הסר" button. This is a familiar iOS/Android pattern. Implementation: CSS `touch-action`, `pointer` events, or a small JS gesture handler. Optional but feels premium.
- **Haptic feedback on add-to-cart.** `navigator.vibrate(50)` on supported Android devices. One line of JS, huge perceived quality difference. iOS does not support this API.
- **Large, thumb-friendly "שלח הזמנה בווטסאפ" button.** The checkout submit button should be `width: 100%`, `min-height: 56px` on mobile. Currently rendered as a full-width button — verify it stays that way.
- **Safe area insets for notched phones.** `padding-bottom: env(safe-area-inset-bottom)` on the cart sidebar footer ensures the checkout button isn't hidden behind the home indicator on iPhones with notches.

### Anti-Features

- **Horizontal product card carousel on mobile.** Horizontal swiping for a small catalog creates discoverability problems (items off-screen are invisible). Vertical scroll + 2-column grid is better.
- **"Back to top" floating button.** On a product page with filters, users navigate by filter not by scroll position. A floating back-to-top button competes with the WhatsApp float button for screen real estate.
- **Disable zoom on mobile (user-scalable=no).** Never add `user-scalable=no` to the viewport meta tag. It prevents accessibility users from zooming and was declared a bad practice by Google in 2021.
- **Swipe navigation between pages.** With only 2 pages (index + shop), swipe navigation is a solution without a problem and conflicts with horizontal scrolling of filter chips.

---

## Summary Table

| Feature | Category | Priority |
|---|---|---|
| Fix empty `<h1>` in hero | Table stakes | P0 — broken |
| Sensory copy, not generic adjectives | Table stakes | P0 |
| Real/owned photography (or strong illustration) | Table stakes | P1 |
| Origin + usage notes on product cards | Differentiator | P1 |
| Weight/quantity on product cards | Table stakes | P1 |
| Sticky filter bar | Differentiator | P1 |
| Low stock indicator (stock ≤ 3) | Differentiator | P2 |
| Order number in WhatsApp message | Differentiator | P1 |
| Date/time in WhatsApp message | Differentiator | P1 |
| Bold total in WhatsApp message (`*₪XX*`) | Differentiator | P1 |
| Two-contact checkout (פיני / תאיר) | Differentiator | P2 |
| Order confirmation screen after send | Differentiator | P2 |
| Phone format validation | Table stakes | P1 |
| Cart sidebar full-screen on mobile | Table stakes | P0 — UX gap |
| Bottom nav bar on mobile (shop) | Differentiator | P2 |
| Safe area insets for notched phones | Table stakes | P1 |
| Swipe-to-remove cart items | Differentiator | P3 |
| Cart icon bounce animation on add | Differentiator | P2 |
| "Continue shopping" from empty cart | Differentiator | P2 |
| Undo/confirm for "רוקן סל" | Table stakes | P1 |
| Filter pill count ("תבלינים (4)") | Differentiator | P2 |
| Founder photo / personal face | Differentiator | P2 |
| 2–3 customer quotes | Differentiator | P2 |
| "How it works" 3-step strip | Table stakes | P1 |
| Seasonal / "מוצר השבוע" callout | Differentiator | P3 |
| Highlight search term in results | Differentiator | P3 |
| Haptic feedback on add-to-cart | Differentiator | P3 |
| Pop-up newsletter | Anti-feature | avoid |
| Multi-select filters | Anti-feature | avoid |
| Sort controls | Anti-feature | avoid |
| Wishlist/favorites | Anti-feature | avoid |
| Product ratings (0 reviews) | Anti-feature | avoid |
| Video autoplay hero | Anti-feature | avoid |
| user-scalable=no in viewport | Anti-feature | never |
| Live chat widget | Anti-feature | avoid |
| Required address field | Anti-feature | avoid |

---

*Research date: 2026-03-11. Based on codebase audit of index.html, shop.html, js/shop.js and design patterns from Aesop, Ottolenghi, Burlap & Barrel, Diaspora Co., Curio Spice Co.*
