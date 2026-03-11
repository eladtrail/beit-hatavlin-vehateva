# Requirements: בית התבלין והטבע — שיפור אתר

**Defined:** 2026-03-11
**Core Value:** לקוח שנכנס לאתר — מוצא מוצר, מוסיף לסל, ושולח הזמנה בווטסאפ ללא כל חיכוך.

---

## v1 Requirements

### Foundations — תשתית CSS/JS

- [ ] **FOUND-01**: CSS @layer מוגדר לניהול ספציפיות בין style.css ו-shop.css ללא !important
- [x] **FOUND-02**: טוקן `--whatsapp: #25D366` מוגדר ב-:root ומשמש בכל 4 המקומות הקיימים
- [x] **FOUND-03**: אנימציית פתיחת סל הקניות משתמשת ב-transform:translateX (GPU composited) במקום right:-100%
- [x] **FOUND-04**: כל @keyframes בשני קבצי CSS מוגנים עם prefers-reduced-motion
- [x] **FOUND-05**: `<link rel="preload" fetchpriority="high">` לתמונת hero ב-`<head>` של index.html
- [x] **FOUND-06**: הסרת משקלי פונטים שאינם בשימוש (Frank Ruhl Libre 400, Heebo 300) מ-Google Fonts
- [x] **FOUND-07**: timeout של 5 שניות על קריאת CSV מ-Google Sheets

### P0 Bugs — באגים קריטיים

- [ ] **BUG-01**: `<h1>` בהירו של index.html מכיל טקסט אמיתי (כרגע `<br/>` ריק)
- [ ] **BUG-02**: סל הקניות בפלאפון (`<600px`) מוצג כ-full-screen overlay ולא כ-300px חלקי
- [ ] **BUG-03**: כפתורי +/− בסל וכפתור "הוסף לסל" הם לפחות 44×44px עם touch-action:manipulation

### UX — חוויית משתמש שלמה

- [ ] **UX-01**: שדה טלפון ב-checkout מאמת פורמט ישראלי (05XXXXXXXX) לפני שליחה
- [ ] **UX-02**: safe-area-inset-bottom מוחל על כפתור WhatsApp הצף ועל footer של סל הקניות
- [ ] **UX-03**: אישור לפני "רוקן סל" (inline undo toast או confirm dialog)
- [ ] **UX-04**: משקל/כמות מוצג על כרטיסי מוצר (לדוגמה: 100 גרם)
- [ ] **UX-05**: סטריפ "איך זה עובד" 3 שלבים מופיע ב-index.html לפני כפתור החנות
- [ ] **UX-06**: פס הפילטרים בחנות הוא sticky (position: sticky; top: var(--nav-h))

### WhatsApp Checkout — שיפורי תהליך הזמנה

- [ ] **WA-01**: הודעת WhatsApp כוללת מספר הזמנה + תאריך/שעה (פורמט: #241103-1432)
- [ ] **WA-02**: סה"כ ההזמנה מודגש ב-*asterisks* בהודעת WhatsApp
- [ ] **WA-03**: בחנות checkout — בחירת איש קשר: פיני או תאיר (שני הטלפונים כבר בקוד)
- [ ] **WA-04**: לאחר טעינת Google Sheets — עדכון מחירים ושמות בסל הקנייות הנשמר
- [ ] **WA-05**: הסל כולל savedAt timestamp עם TTL של 7 ימים
- [ ] **WA-06**: הסל נמחק רק אחרי אישור מפורש — לא מיד אחרי window.open

### Polish — דיפרנציאטורים ועיצוב

- [ ] **POL-01**: אנימציית bounce לאיקון סל בעת הוספת מוצר (200ms CSS animation)
- [ ] **POL-02**: תג "נשאר מעט" מוצג על מוצרים עם stock ≤ 3
- [ ] **POL-03**: תיאור מקור/מאפיין על כרטיסי מוצר (שדה קיים בנתונים)
- [ ] **POL-04**: Cloudinary transform URLs (f_auto,q_80,w_1400) על תמונת hero
- [ ] **POL-05**: כפתורי סינון מציגים ספירת מוצרים ("תבלינים (4)")
- [ ] **POL-06**: תמונות מייסדים (פיני ותאיר) בסקשן אודות ב-index.html

---

## v2 Requirements

### עתידי (לא בסקופ הנוכחי)

- **V2-01**: Payment gateway — הזמנות ישירות, לא WhatsApp
- **V2-02**: CMS/Backend לניהול מוצרים ללא Google Sheets
- **V2-03**: Multi-language (ערבית/אנגלית)
- **V2-04**: מסנני מחיר ומיון
- **V2-05**: מנגנון ביקורות לקוחות

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Payment gateway | אתר סטטי, הזמנות דרך WhatsApp בלבד |
| Backend/CMS | ללא שרת — Vercel static |
| JS Framework (Alpine/Vue/React) | אפס dependencies — feature לא bug |
| Multi-select filters | Anti-feature לקטלוג קטן (<50 מוצרים) |
| Pop-up newsletter | Anti-pattern ל-artisan brand |
| Product ratings | אפס reviews — יראה ריק ולא אמין |
| Build step (npm/webpack) | Source = deployed artifacts — constraint קריטי |
| user-scalable=no | נגישות, אסור |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 — Foundations | Pending |
| FOUND-02 | Phase 1 — Foundations | Complete |
| FOUND-03 | Phase 1 — Foundations | Complete |
| FOUND-04 | Phase 1 — Foundations | Complete |
| FOUND-05 | Phase 1 — Foundations | Complete |
| FOUND-06 | Phase 1 — Foundations | Complete |
| FOUND-07 | Phase 1 — Foundations | Complete |
| BUG-01 | Phase 2 — P0 Bugs | Pending |
| BUG-02 | Phase 2 — P0 Bugs | Pending |
| BUG-03 | Phase 2 — P0 Bugs | Pending |
| UX-01 | Phase 3 — Table Stakes UX | Pending |
| UX-02 | Phase 3 — Table Stakes UX | Pending |
| UX-03 | Phase 3 — Table Stakes UX | Pending |
| UX-04 | Phase 3 — Table Stakes UX | Pending |
| UX-05 | Phase 3 — Table Stakes UX | Pending |
| UX-06 | Phase 3 — Table Stakes UX | Pending |
| WA-01 | Phase 4 — WhatsApp Checkout | Pending |
| WA-02 | Phase 4 — WhatsApp Checkout | Pending |
| WA-03 | Phase 4 — WhatsApp Checkout | Pending |
| WA-04 | Phase 4 — WhatsApp Checkout | Pending |
| WA-05 | Phase 4 — WhatsApp Checkout | Pending |
| WA-06 | Phase 4 — WhatsApp Checkout | Pending |
| POL-01 | Phase 5 — Polish | Pending |
| POL-02 | Phase 5 — Polish | Pending |
| POL-03 | Phase 5 — Polish | Pending |
| POL-04 | Phase 5 — Polish | Pending |
| POL-05 | Phase 5 — Polish | Pending |
| POL-06 | Phase 5 — Polish | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-11*
*Last updated: 2026-03-11 after roadmap creation*
