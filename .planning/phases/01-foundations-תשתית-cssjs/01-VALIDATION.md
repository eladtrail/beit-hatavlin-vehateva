---
phase: 1
slug: foundations-cssjs
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-11
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual + bash grep/audit (static site — no test runner) |
| **Config file** | none |
| **Quick run command** | `grep -c '!important' css/style.css css/shop.css` |
| **Full suite command** | See Per-Task Verification Map below |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run quick grep audit (see task map)
- **After every plan wave:** Run full manual checklist
- **Before `/gsd:verify-work`:** All manual checks must pass
- **Max feedback latency:** ~10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 1-01-01 | 01 | 1 | FOUND-02 | automated | `grep -c '#25D366' css/style.css css/shop.css` → must be 0 | ⬜ pending |
| 1-01-02 | 01 | 1 | FOUND-02 | automated | `grep -c '\-\-whatsapp' css/style.css` → must be ≥1 | ⬜ pending |
| 1-02-01 | 02 | 1 | FOUND-03 | automated | `grep -c 'will-change\|translateZ' css/style.css css/shop.css` → must be ≥1 | ⬜ pending |
| 1-02-02 | 02 | 1 | FOUND-04 | automated | `grep -c 'prefers-reduced-motion' css/style.css` → must be ≥1 | ⬜ pending |
| 1-03-01 | 03 | 2 | FOUND-05 | manual | Open index.html source → check `<link rel="preload">` for hero image | ⬜ pending |
| 1-03-02 | 03 | 2 | FOUND-06 | automated | `grep -c '!important' css/style.css css/shop.css` → must be 0 after @layer | ⬜ pending |
| 1-04-01 | 04 | 2 | FOUND-01 | automated | `grep -c '@layer' css/style.css` → must be ≥1 | ⬜ pending |
| 1-04-02 | 04 | 2 | FOUND-07 | manual | DevTools → Performance → LCP must improve vs baseline | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Static site — no test framework needed. All verification is via grep audits and browser DevTools.

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Hero image preload in HTML | FOUND-05 | Browser DevTools needed | View source → check `<link rel="preload" as="image">` in `<head>` |
| GPU animation (no jank) | FOUND-03 | Visual inspection | DevTools → Performance tab → record cart open → check for layout thrashing |
| Reduced-motion behavior | FOUND-04 | OS setting required | Enable OS reduced motion → reload → confirm no keyframes fire |
| LCP improvement | FOUND-07 | Lighthouse needed | Run Lighthouse before and after, compare LCP score |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or manual instructions
- [ ] Sampling continuity: no 3 consecutive tasks without verification
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
