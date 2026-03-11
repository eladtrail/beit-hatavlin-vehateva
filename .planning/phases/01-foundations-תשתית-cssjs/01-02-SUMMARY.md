---
phase: 1
plan: 01-02
subsystem: css
tags: [performance, animation, accessibility, gpu, reduced-motion]
dependency_graph:
  requires: []
  provides: [FOUND-03, FOUND-04]
  affects: [css/shop.css, css/style.css]
tech_stack:
  added: []
  patterns: [GPU-composited transform animation, prefers-reduced-motion media query]
key_files:
  created: []
  modified:
    - css/shop.css
    - css/style.css
decisions:
  - translateX(100%) chosen for cart hide state — hides element off physical right edge without affecting layout, consistent with RTL site direction
  - translateY(15px) chosen for scroll-bounce end state — matches the 15px visual travel of original top:5px→top:20px but via transform only
  - prefers-reduced-motion blocks appended at file end — no interference with existing cascade, easy to find/audit
metrics:
  duration: 8min
  completed: 2026-03-11
  tasks: 4/4
  files_modified: 2
---

# Phase 1 Plan 02: GPU Animations + Reduced-Motion Guard Summary

**One-liner:** GPU-composited cart sidebar and scroll-bounce animations using transform, plus prefers-reduced-motion guards across both CSS files.

## What Was Built

Two animation correctness fixes landed together:

1. **Cart sidebar (shop.css):** Replaced `right: -100%` / `right: 0` slide with `transform: translateX(100%)` / `translateX(0)`. The `right: 0` static position is retained; only the animation mechanism changed. This eliminates layout recalculation on every frame of the slide transition.

2. **Scroll-bounce keyframe (style.css):** Replaced `top: 5px` / `top: 20px` inside `@keyframes scroll-bounce` with `transform: translateY(0)` / `translateY(15px)`. The static `.scroll-dot { top: 5px; }` position declaration is unchanged. This removes a layout-triggering property from an infinitely looping animation.

3. **Reduced-motion guard (style.css):** Added `@media (prefers-reduced-motion: reduce)` block suppressing all looping animations (hero orb, particles, scroll dot, about float cards, nature labels, WhatsApp pulse) and making reveal elements instantly visible with no transition.

4. **Reduced-motion guard (shop.css):** Added `@media (prefers-reduced-motion: reduce)` block stopping the `shopSpin` loading spinner animation, substituting a static colored border-top instead.

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1-02-01 | Cart sidebar transform animation | 6908065 | css/shop.css |
| 1-02-02 | scroll-bounce keyframe GPU fix | 7b35dfe | css/style.css |
| 1-02-03 | prefers-reduced-motion in style.css | 20213d3 | css/style.css |
| 1-02-04 | prefers-reduced-motion in shop.css | b6af665 | css/shop.css |

## Decisions Made

- **translateX(100%) for cart hide state:** Hides the sidebar off the physical right edge. In an RTL layout `right: 0` anchors the panel to the right side, so positive translateX pushes it further right (off-screen). This is correct and consistent with how the panel opens from the right.
- **translateY(15px) for scroll-bounce end:** The original animated from `top: 5px` to `top: 20px` — a 15px downward travel. `translateY(15px)` preserves identical visual output with zero layout cost.
- **Append-at-end pattern for reduced-motion:** Adding the `@media (prefers-reduced-motion: reduce)` blocks at the end of each file ensures they always win the cascade battle against earlier rules without needing specificity hacks.

## Verification Results

| Check | Expected | Result |
|-------|----------|--------|
| `right: -100%\|transition: right` in shop.css | 0 matches | 0 |
| `translateX(100%)` in shop.css | >= 1 | 1 |
| `translateX(0)` in shop.css | >= 1 | 1 |
| `prefers-reduced-motion` count in style.css | 1 | 1 |
| `prefers-reduced-motion` count in shop.css | 1 | 1 |
| `top: 5px\|top: 20px` in keyframe context | 0 (1 static ok) | 1 static only |

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

All modified files confirmed on disk. All 4 task commits confirmed in git history.
