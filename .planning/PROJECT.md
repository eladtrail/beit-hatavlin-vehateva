# בית התבלין והטבע — שיפור אתר

## What This Is

אתר סטטי קיים לחנות תבלינים בקריית ביאליק ("בית התבלין והטבע") — שני דפים: דף נחיתה (index.html) וחנות מקוונת (shop.html). הפרויקט הוא שיפור מקיף של האתר הקיים לרמה פרופסיונלית: עיצוב ויזואלי ברמת פרמיום + UX שלם ומדויק. אין בקאנד — הזמנות דרך WhatsApp בלבד.

## Core Value

לקוח שנכנס לאתר — מוצא מוצר, מוסיף לסל, ושולח הזמנה בווטסאפ ללא כל חיכוך.

## Requirements

### Validated

- ✓ אתר סטטי RTL עברי — קיים
- ✓ דף נחיתה index.html עם hero, אודות, מוצרים, טבע, מיקום, יצירת קשר — קיים
- ✓ חנות shop.html עם CSV מ-Google Sheets, עגלה ב-localStorage, checkout לווטסאפ — קיים
- ✓ עיצוב בצבעי עץ/ענבר/קרם עם פונטים עבריים (Frank Ruhl Libre + Heebo) — קיים
- ✓ Vercel deploy config — קיים

### Active

- [ ] שיפור עיצוב ויזואלי של index.html לרמה פרמיום
- [ ] שיפור UX של shop.html (כרטיסי מוצר, סל, checkout)
- [ ] חוויית מובייל מושלמת בשני הדפים
- [ ] ביצועים ואנימציות חלקות (reveal, transitions)
- [ ] ניקוי קוד ועקביות בין style.css ו-shop.css

### Out of Scope

- Payment gateway — הזמנות דרך WhatsApp בלבד
- Backend/CMS — אתר סטטי
- אפליקציית מובייל — web-first
- Auth/login — לא נדרש

## Context

- **Stack:** HTML/CSS/JS סטטי, Vercel, Google Sheets CSV
- **קבצים:** index.html, shop.html, css/style.css, css/shop.css, js/script.js, js/shop.js
- **Design tokens:** CSS variables ב-style.css :root (--brown-900, --amber, --gold, --cream-100 וכו')
- **WhatsApp:** 972502456233 (פיני), 972509333951 (תאיר)
- **Logo:** Cloudinary SVG
- **Hero קיים:** פרטיקלים, badges, כפתורי CTA — מבנה טוב, צריך polish

## Constraints

- **Tech stack:** HTML/CSS/JS טהור בלבד — ללא frameworks
- **Static:** אין שרת, אין build process
- **RTL:** עברי לכל אורך האתר
- **WhatsApp only:** checkout רק דרך wa.me

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| שמירה על design tokens קיימים | ממשיכים עם פלטת הצבעים הקיימת | — Pending |
| שיפור בפייסים — קודם index, אחר כך shop | index.html הוא הרושם הראשון | — Pending |

---
*Last updated: 2026-03-11 after initialization*
