---
phase: 01-foundations-תשתית-cssjs
plan: "03"
subsystem: ui
tags: [performance, lcp, fonts, preload, fetch-timeout, abort-controller]

# Dependency graph
requires:
  - phase: 01-01
    provides: WhatsApp design tokens (stable CSS foundation before HTML edits)
  - phase: 01-02
    provides: GPU animation and reduced-motion guard (stable JS before shop.js edit)
provides:
  - LCP hero image preload via rel=preload in index.html <head>
  - Cloudinary preconnect for faster image delivery on index.html
  - Trimmed Google Fonts URL (index.html) — only used weights 700/900 for Frank Ruhl Libre, 400/500/600/700 for Heebo
  - Trimmed Google Fonts URL (shop.html) — identical weight reduction
  - AbortController 5-second timeout on Google Sheets CSV fetch in shop.js
affects: [phase-2, phase-3]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "AbortController + setTimeout pattern for fetch timeouts — cancels network request on abort, clearTimeout in both success and catch paths"
    - "rel=preload as=image with fetchpriority=high for LCP images — browser fetches before CSS is parsed"

key-files:
  created: []
  modified:
    - index.html
    - shop.html
    - js/shop.js

key-decisions:
  - "Use fetchpriority=high on hero preload so browser prioritizes it above other preloads"
  - "clearTimeout in both try and catch branches of loadFromSheet to prevent timer leak on any exit path"
  - "Frank Ruhl Libre weight 400 removed — confirmed absent from all CSS rules"
  - "Heebo weight 300 removed — used only once (.hero-subtitle), graceful fallback to 400 acceptable"

patterns-established:
  - "Preload pattern: preconnect origin first, then preload specific asset — order matters for connection reuse"
  - "Fetch timeout pattern: AbortController + setTimeout, clearTimeout in both success and error paths"

requirements-completed: [FOUND-05, FOUND-06, FOUND-07]

# Metrics
duration: 5min
completed: 2026-03-11
---

# Phase 1 Plan 03: LCP Preload, Font Weight Trim, CSV Timeout Summary

**Hero image preload with fetchpriority=high, 2-request font savings across both HTML files, and AbortController 5s fetch timeout on Sheets CSV**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-11T12:37:13Z
- **Completed:** 2026-03-11T12:42:00Z
- **Tasks:** 4
- **Files modified:** 3

## Accomplishments
- Added `rel=preload as=image fetchpriority=high` for the Cloudinary hero image in index.html — browser now fetches LCP image before CSS is parsed
- Added `rel=preconnect` to `res.cloudinary.com` for early TCP handshake on the CDN origin
- Removed unused font weights from both index.html and shop.html: Frank Ruhl Libre 400 and Heebo 300 — saves 2 HTTP requests per page load
- Replaced bare `fetch()` in `loadFromSheet()` with AbortController pattern that cancels the network request after 5 000 ms and falls back to already-rendered demo products

## Task Commits

Each task was committed atomically:

1. **Task 1-03-01: Add Cloudinary preconnect + hero preload to index.html** - `c4be8eb` (feat)
2. **Task 1-03-02: Trim unused font weights from index.html** - `bed08b5` (perf)
3. **Task 1-03-03: Trim unused font weights from shop.html** - `07d56ac` (perf)
4. **Task 1-03-04: Add AbortController 5s timeout to shop.js CSV fetch** - `64a4f4e` (feat)

## Files Created/Modified
- `index.html` - Added preconnect + preload tags in `<head>`, trimmed Google Fonts URL to used weights only
- `shop.html` - Trimmed Google Fonts URL to match index.html
- `js/shop.js` - Replaced bare `fetch(SHEET_CSV_URL)` with AbortController-guarded fetch, 5 000 ms timeout, clearTimeout in both paths

## Decisions Made
- `fetchpriority="high"` applied to hero preload: hero image is the LCP element on mobile, so it outranks other preloads
- `clearTimeout` placed in both try and catch branches: avoids timer leak on any exit path including early `return` statements
- Frank Ruhl Libre 400 confirmed unused in all CSS rules before removal
- Heebo 300 used once (`.hero-subtitle`) — graceful fallback to 400 is visually imperceptible

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 1 Wave 2 is complete; all three Wave 2 plans (01-03) are done
- Phase 2 (P0 Bugs) can begin: BUG-01, BUG-02, BUG-03 have stable CSS/JS foundations to build on
- No blockers

---
*Phase: 01-foundations-תשתית-cssjs*
*Completed: 2026-03-11*
