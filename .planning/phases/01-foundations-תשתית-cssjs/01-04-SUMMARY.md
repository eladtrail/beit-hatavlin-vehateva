---
phase: 01-foundations-תשתית-cssjs
plan: "04"
subsystem: ui
tags: [css, cascade-layers, specificity, at-layer, rtl]

# Dependency graph
requires:
  - phase: 01-foundations-תשתית-cssjs
    provides: style.css and shop.css stable after plans 01-01 through 01-03

provides:
  - CSS Cascade Layers architecture in both style.css and shop.css
  - Zero !important declarations in the entire codebase
  - Explicit layer order: reset, tokens, base, layout, components, utilities, overrides
  - .nav-cta specificity solved via layer precedence (no hacks)

affects: [all future CSS changes, phase-2-bugs, phase-3-ux, phase-5-polish]

# Tech tracking
tech-stack:
  added: [CSS @layer cascade layers (native browser API)]
  patterns:
    - "@layer declaration at top of style.css controls cascade for both CSS files"
    - "shop.css participates in layers declared by style.css — no re-declaration needed"
    - "overrides layer wins over components by layer order — eliminates !important need"
    - "responsive @media blocks nested inside @layer overrides for correct cascade priority"
    - "reduced-motion @media at file scope outside layers for global effectiveness"

key-files:
  created: []
  modified:
    - css/style.css
    - css/shop.css

key-decisions:
  - "Place @layer declaration order in style.css only — shop.css inherits it (loads after)"
  - "Responsive media queries go inside @layer overrides not @layer components — overrides layer wins, and responsiveness is an override behavior"
  - ".nav-cta in overrides layer eliminates all three !important declarations cleanly"
  - "Reduced-motion block stays at file scope — outside any layer for guaranteed global reach"

patterns-established:
  - "Layer order wins over specificity — use layers for cascade control, not !important"
  - "Components layer for all UI rules; overrides layer for rules that must win components"

requirements-completed: [FOUND-01]

# Metrics
duration: 4min
completed: 2026-03-11
---

# Phase 1 Plan 04: @layer Architecture + Eliminate !important Summary

**CSS Cascade Layers restructure of style.css and shop.css: 7 named layers established, all three .nav-cta !important declarations eliminated via layer order, and two additional stray !important (about-card-float, hours-closed) auto-removed**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-11T12:17:21Z
- **Completed:** 2026-03-11T12:21:16Z
- **Tasks:** 9/9
- **Files modified:** 2

## Accomplishments
- Added global `@layer reset, tokens, base, layout, components, utilities, overrides;` declaration at line 1 of style.css
- Wrapped all CSS blocks into their correct layers (reset, tokens, base, layout, components, overrides)
- Moved `.nav-cta` into `@layer overrides` — layer order beats specificity, so all three `!important` on color/font-weight/::after are gone
- All responsive breakpoints nested inside `@layer overrides` for correct precedence
- shop.css fully wrapped in `@layer components {}` with reduced-motion at file scope

## Task Commits

Each task was committed atomically:

1. **Task 1-04-01: Add @layer declaration order** - `af46e3a` (feat)
2. **Task 1-04-02: Wrap Reset in @layer reset {}** - `fec858f` (feat)
3. **Task 1-04-03: Wrap Design Tokens in @layer tokens {}** - `1ac5e40` (feat)
4. **Task 1-04-04: Wrap Base + Container in @layer base/layout {}** - `64a4f4e` (feat)
5. **Task 1-04-05: Wrap Buttons-through-stagger in @layer components {}** - `c65d8ca` (feat)
6. **Task 1-04-06: Create @layer overrides {} with .nav-cta and responsive** - `4b32c95` (feat)
7. **Task 1-04-07: Wrap shop.css in @layer components {}** - `367cada` (feat)
8. **Task 1-04-08: Verify zero !important** - (verification only, no separate commit)
9. **Task 1-04-09: Remove !important from .about-card-float:hover** - `3b3f625` (fix, combined with hours-closed auto-fix)

## Files Created/Modified
- `css/style.css` - Full @layer restructure: 7 layers, .nav-cta moved to overrides, all !important removed
- `css/shop.css` - All component rules wrapped in @layer components, comment added

## Decisions Made
- Used `@layer overrides` for both `.nav-cta` and responsive media queries — both are "override" behaviors that need to win `components`
- shop.css does not re-declare layer order (only the first `@layer` order declaration in the cascade matters; style.css loads first)
- Reduced-motion blocks in both files left at file scope — outside layers, so they always apply regardless of layer cascade

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed stray !important from .hours-closed**
- **Found during:** Task 1-04-08 (verification grep for !important)
- **Issue:** `.hours-closed { color: #C0392B !important; }` — !important unnecessary inside @layer components
- **Fix:** Removed `!important` keyword; color value unchanged
- **Files modified:** css/style.css
- **Verification:** `grep -n "!important" css/style.css` returns only comment line
- **Committed in:** `3b3f625` (combined with task 1-04-09)

---

**Total deviations:** 1 auto-fixed (Rule 1 - stray !important)
**Impact on plan:** Necessary cleanup discovered during verification. No scope creep — same goal as the planned task 1-04-09.

## Issues Encountered
None — cascade layer restructure applied cleanly. All must_have criteria verified:
- `grep -c "!important" css/style.css` returns 1 (comment only, zero actual declarations)
- `grep -c "!important" css/shop.css` returns 0
- `@layer reset, tokens...` at line 1 of style.css
- `@layer overrides {` at line 1162 contains .nav-cta rules
- `@layer components {` at line 8 of shop.css wraps all shop rules

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- CSS architecture complete — Phase 1 foundations are fully implemented
- Phase 2 (P0 Bugs) can now safely modify CSS without specificity conflicts
- Any new CSS additions should be placed in the appropriate layer
- No blockers

---
*Phase: 01-foundations-תשתית-cssjs*
*Completed: 2026-03-11*
