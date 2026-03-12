/*!
 * בית התבלין והטבע — תפריט נגישות
 * מבוסס על תקן ישראלי 5568 | WCAG 2.1 AA
 * v1.0 · 2026
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'bht_a11y_v1';
  var ROOT = document.documentElement;

  var OPTIONS = [
    { id: 'font-lg',  label: 'הגדל טקסט',       cls: 'a11y-font-lg',  icon: 'A+' },
    { id: 'font-xl',  label: 'טקסט גדול מאוד',   cls: 'a11y-font-xl',  icon: 'A⁺⁺' },
    { id: 'hc',       label: 'ניגודיות גבוהה',   cls: 'a11y-hc',       icon: '◑' },
    { id: 'invert',   label: 'היפוך צבעים',      cls: 'a11y-invert',   icon: '◐' },
    { id: 'gray',     label: 'גווני אפור',        cls: 'a11y-gray',     icon: '○' },
    { id: 'links',    label: 'הדגש קישורים',     cls: 'a11y-links',    icon: 'קישור' },
    { id: 'readable', label: 'גופן קריא',         cls: 'a11y-readable', icon: 'Aa' },
    { id: 'no-anim',  label: 'עצור אנימציות',    cls: 'a11y-no-anim',  icon: '⏸' }
  ];

  var prefs = {};
  var panelOpen = false;

  /* ── Persist ──────────────────────────────────────────────── */
  function loadPrefs() {
    try { prefs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch (e) { prefs = {}; }
    OPTIONS.forEach(function (o) {
      if (prefs[o.id]) ROOT.classList.add(o.cls);
    });
  }

  function savePrefs() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); }
    catch (e) {}
  }

  /* ── Toggle feature ───────────────────────────────────────── */
  function toggleFeature(opt) {
    prefs[opt.id] = !prefs[opt.id];
    ROOT.classList.toggle(opt.cls, !!prefs[opt.id]);
    savePrefs();
    syncBtn(opt.id);
  }

  function resetAll() {
    OPTIONS.forEach(function (o) {
      prefs[o.id] = false;
      ROOT.classList.remove(o.cls);
    });
    savePrefs();
    OPTIONS.forEach(function (o) { syncBtn(o.id); });
  }

  function syncBtn(id) {
    var btn = document.getElementById('a11y-opt-' + id);
    if (!btn) return;
    var on = !!prefs[id];
    btn.setAttribute('aria-pressed', String(on));
    btn.classList.toggle('is-active', on);
  }

  /* ── Build DOM ────────────────────────────────────────────── */
  function createWidget() {
    /* Toggle button */
    var tBtn = document.createElement('button');
    tBtn.id = 'a11y-toggle';
    tBtn.className = 'a11y-toggle';
    tBtn.setAttribute('aria-label', 'פתח תפריט נגישות');
    tBtn.setAttribute('aria-expanded', 'false');
    tBtn.setAttribute('aria-controls', 'a11y-panel');
    tBtn.setAttribute('aria-haspopup', 'dialog');
    tBtn.innerHTML =
      '<svg width="26" height="26" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="16" cy="5" r="3"/>' +
        '<path d="M11 10.5c-.6 0-1 .4-1 1v6c0 .6.4 1 1 1h2.5l1.2 6.2c.1.5.6.8 1.1.8s1-.3 1.1-.8l1.2-6.2H20c.6 0 1-.4 1-1v-6c0-.6-.4-1-1-1h-9z"/>' +
        '<path d="M10.5 24.5A5.5 5.5 0 0 0 16 30a5.5 5.5 0 0 0 5.5-5.5H20a4 4 0 0 1-4 4 4 4 0 0 1-4-4h-1.5z"/>' +
      '</svg>';

    /* Panel */
    var panel = document.createElement('div');
    panel.id = 'a11y-panel';
    panel.className = 'a11y-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'הגדרות נגישות');
    panel.setAttribute('aria-modal', 'false');
    panel.hidden = true;

    var optsHTML = OPTIONS.map(function (o) {
      return '<button id="a11y-opt-' + o.id + '" class="a11y-opt" ' +
             'aria-pressed="false" data-id="' + o.id + '">' +
             '<span class="a11y-opt-ic" aria-hidden="true">' + o.icon + '</span>' +
             '<span class="a11y-opt-lbl">' + o.label + '</span>' +
             '</button>';
    }).join('');

    panel.innerHTML =
      '<div class="a11y-head">' +
        '<span class="a11y-head-title">נגישות</span>' +
        '<button class="a11y-close" aria-label="סגור תפריט נגישות">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="a11y-opts-grid">' + optsHTML + '</div>' +
      '<div class="a11y-foot">' +
        '<button class="a11y-reset" id="a11y-reset-btn">איפוס</button>' +
        '<a href="/accessibility.html" class="a11y-decl-link">הצהרת נגישות</a>' +
      '</div>';

    document.body.appendChild(tBtn);
    document.body.appendChild(panel);

    /* ── Events ─────────────────────────────────────────────── */
    tBtn.addEventListener('click', function () {
      panelOpen = !panelOpen;
      panel.hidden = !panelOpen;
      tBtn.setAttribute('aria-expanded', String(panelOpen));
      tBtn.setAttribute('aria-label', panelOpen ? 'סגור תפריט נגישות' : 'פתח תפריט נגישות');
      if (panelOpen) panel.querySelector('.a11y-close').focus();
    });

    panel.querySelector('.a11y-close').addEventListener('click', closePanel);
    panel.querySelector('#a11y-reset-btn').addEventListener('click', resetAll);

    panel.querySelectorAll('.a11y-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var opt = OPTIONS.find(function (o) { return o.id === btn.dataset.id; });
        if (opt) toggleFeature(opt);
      });
    });

    /* Close on Escape / click outside */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panelOpen) closePanel();
    });

    document.addEventListener('click', function (e) {
      if (panelOpen && !panel.contains(e.target) && e.target !== tBtn) closePanel();
    });

    /* Sync initial state */
    OPTIONS.forEach(function (o) { syncBtn(o.id); });
  }

  function closePanel() {
    panelOpen = false;
    var panel = document.getElementById('a11y-panel');
    var tBtn  = document.getElementById('a11y-toggle');
    if (panel) panel.hidden = true;
    if (tBtn) {
      tBtn.setAttribute('aria-expanded', 'false');
      tBtn.setAttribute('aria-label', 'פתח תפריט נגישות');
      tBtn.focus();
    }
  }

  /* ── Init ──────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { loadPrefs(); createWidget(); });
  } else {
    loadPrefs();
    createWidget();
  }

})();
