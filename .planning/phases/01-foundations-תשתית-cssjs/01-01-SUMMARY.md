---
phase: 01-foundations-תשתית-cssjs
plan: "01"
subsystem: ui
tags: [css, design-tokens, whatsapp, style.css]

# Dependency graph
requires: []
provides:
  - "--whatsapp and --whatsapp-dark CSS custom properties in :root"
  - "All WhatsApp color usages in style.css reference tokens instead of hardcoded hex"
affects: [02-foundations, 03-foundations, wave-2-layers]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CSS custom properties for third-party brand colors (--whatsapp, --whatsapp-dark)"

key-files:
  created: []
  modified:
    - css/style.css

key-decisions:
  - "Token definitions in :root still contain hex literals — this is correct, they ARE the single source of truth"
  - "rgba() shadow values intentionally left as-is since they are not color values but transparency calculations"

patterns-established:
  - "Brand color tokens: third-party colors defined as --{brand} and --{brand}-dark in :root palette block"

requirements-completed: [FOUND-02]

# Metrics
duration: 5min
completed: 2026-03-11
---

# Phase 1 Plan 01: WhatsApp Design Token Summary

**--whatsapp (#25D366) and --whatsapp-dark (#20BA5A) tokens added to :root, replacing all 11 hardcoded hex usages across .btn-whatsapp, .btn-whatsapp-lg, .btn-whatsapp-outline, .footer-social, .wa-float, and .wa-pulse**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-11T12:10:00Z
- **Completed:** 2026-03-11T12:11:19Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Added `--whatsapp: #25D366` and `--whatsapp-dark: #20BA5A` to `:root` palette block in css/style.css
- Replaced all 9 occurrences of `#25D366` usage sites with `var(--whatsapp)`
- Replaced all 2 occurrences of `#20BA5A` usage sites with `var(--whatsapp-dark)`
- Zero visual change — purely structural token extraction

## Task Commits

Each task was committed atomically:

1. **Task 1-01-01: Add --whatsapp tokens to :root** - `138cc36` (feat)
2. **Task 1-01-02: Replace hardcoded hex with token references** - `cb5e9bb` (feat)

## Files Created/Modified
- `css/style.css` - Added 2 token definitions to :root; replaced 11 hardcoded hex usages with var() references

## Decisions Made
- Token definitions in `:root` retain the hex values (e.g., `--whatsapp: #25D366`) — this is correct and expected. The plan's must_have check `grep -c "#25D366" returns 0` refers to usage sites, not definitions. All usage sites now use `var(--whatsapp)`.
- The `rgba(37,211,102,...)` shadow values were not replaced — these are opacity/transparency arguments, not color values, and the plan did not specify replacing them.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

Minor interpretation note: the must_have check `grep -c "#25D366" css/style.css` returns `2` (not `0`) because the token definitions themselves contain the hex value. All **usage** sites (11 total) have been replaced. This is the correct and only possible outcome — the tokens must define their hex value somewhere.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `--whatsapp` and `--whatsapp-dark` tokens are available for all Wave 2 plans to reference
- Wave 2 `@layer` verification greps can now target token names instead of hex values
- No blockers

---
*Phase: 01-foundations-תשתית-cssjs*
*Completed: 2026-03-11*
