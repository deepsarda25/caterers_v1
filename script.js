/* =====================================================================
   Sheetal Caterers & Events — site script
   ===================================================================== */
document.documentElement.classList.add('js');
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------------- HELPERS ---------------- */
function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
const leafSvg = '<svg class="leaf-mini" viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M250,112 C302,152 322,232 250,292 C178,232 198,152 250,112 Z" fill="none" stroke="currentColor" stroke-width="18"/></svg>';
const penSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
const binSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>';
const pinSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
const chevSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>';

/* ---------------- HEADER HEIGHT (keeps the hero clear of the fixed nav) ---------------- */
const siteHeader = document.getElementById('siteHeader');
function syncHeaderHeight(){
  document.documentElement.style.setProperty('--header-h', siteHeader.offsetHeight + 'px');
}
syncHeaderHeight();
window.addEventListener('resize', syncHeaderHeight);
window.addEventListener('orientationchange', syncHeaderHeight);
if(document.fonts && document.fonts.ready){ document.fonts.ready.then(syncHeaderHeight); }

/* ---------------- MODALS (scroll lock, focus return, Escape) ---------------- */
let lastFocus = null;
function openModal(backdrop){
  lastFocus = document.activeElement;
  backdrop.classList.add('open');
  document.body.classList.add('modal-open');
}
function closeModal(backdrop){
  backdrop.classList.remove('open');
  if(!document.querySelector('.modal-backdrop.open')){
    document.body.classList.remove('modal-open');
    if(lastFocus && lastFocus.focus && document.contains(lastFocus)){ try{ lastFocus.focus({preventScroll:true}); }catch(e){} }
  }
}
/* Keep Tab inside the open dialog */
document.addEventListener('keydown', e => {
  if(e.key !== 'Tab') return;
  const open = document.querySelector('.modal-backdrop.open .modal');
  if(!open) return;
  const f = [...open.querySelectorAll('button, input, select, textarea, a[href], summary')]
    .filter(el => !el.disabled && !el.closest('[hidden]') && el.offsetParent !== null);
  if(!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
});

/* ---------------- SPLASH ---------------- */
const splash = document.getElementById('splash');
let alreadySeen = false;
try{ alreadySeen = sessionStorage.getItem('sheetal-seen-intro') === '1'; }catch(e){}
if(alreadySeen){
  splash.remove();
} else {
  document.body.classList.add('no-scroll');
  let splashDone = false;
  function dismissSplash(){
    if(splashDone) return;
    splashDone = true;
    splash.classList.add('leaving');
    document.body.classList.remove('no-scroll');
    try{ sessionStorage.setItem('sheetal-seen-intro','1'); }catch(e){}
    setTimeout(() => splash.remove(), 750);
  }
  splash.addEventListener('click', dismissSplash);
  splash.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); dismissSplash(); } });
  setTimeout(dismissSplash, 3800);
}

/* ---------------- THEME ---------------- */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeMeta = document.querySelector('meta[name="theme-color"]');
function isDarkNow(){
  const t = root.getAttribute('data-theme');
  return t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
}
function applyThemeIcon(){
  const dark = isDarkNow();
  themeIcon.innerHTML = dark
    ? '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>'
    : '<circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>';
  if(themeMeta) themeMeta.setAttribute('content', dark ? '#1C1B16' : '#FAF6ED');
}
let savedTheme = null;
try{ savedTheme = localStorage.getItem('sheetal-theme'); }catch(e){}
if(savedTheme === 'dark' || savedTheme === 'light'){ root.setAttribute('data-theme', savedTheme); }
applyThemeIcon();
themeToggle.addEventListener('click', () => {
  const next = isDarkNow() ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  applyThemeIcon();
  try{ localStorage.setItem('sheetal-theme', next); }catch(e){}
});
if(window.matchMedia){
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => applyThemeIcon();
  if(mq.addEventListener) mq.addEventListener('change', onChange);
}

/* ---------------- NAV (drawer, active link, header shadow) ---------------- */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
function setNav(open){
  navLinks.classList.toggle('open', open);
  navOverlay.classList.toggle('show', open);
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
burger.addEventListener('click', () => setNav(!navLinks.classList.contains('open')));
navOverlay.addEventListener('click', () => setNav(false));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));
window.addEventListener('resize', () => { if(window.innerWidth > 920) setNav(false); });

const navAnchors = [...navLinks.querySelectorAll('a')];
const navTargets = navAnchors.map(a => document.querySelector(a.getAttribute('href')));
let ticking = false;
function onScroll(){
  ticking = false;
  siteHeader.classList.toggle('scrolled', window.scrollY > 8);
  const line = siteHeader.offsetHeight + 80;
  let current = 0;
  navTargets.forEach((t, i) => {
    if(!t) return;
    const top = t.getBoundingClientRect().top;
    /* "7 reasons" belongs to About Us */
    if(top <= line) current = i;
  });
  const reasons = document.getElementById('reasons');
  if(reasons && reasons.getBoundingClientRect().top <= line && reasons.getBoundingClientRect().bottom > line){
    current = navTargets.indexOf(document.getElementById('about'));
  }
  navAnchors.forEach((a, i) => a.classList.toggle('active', i === current && window.scrollY > 40));
}
window.addEventListener('scroll', () => { if(!ticking){ ticking = true; requestAnimationFrame(onScroll); } }, {passive:true});
onScroll();

/* ---------------- SCROLL REVEAL ---------------- */
(function(){
  const els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){ els.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
  els.forEach(el => io.observe(el));
  /* Safety net: never leave content hidden if the observer is slow */
  setTimeout(() => els.forEach(el => el.classList.add('in')), 6000);
})();

/* ---------------- TOAST ---------------- */
let toastTimer;
function showToast(msg, undoFn){
  let t = document.getElementById('toast');
  if(!t){
    t = document.createElement('div');
    t.id = 'toast'; t.className = 'toast'; t.setAttribute('role','status');
    document.body.appendChild(t);
  }
  t.innerHTML = '<span>' + esc(msg) + '</span>' + (undoFn ? '<button type="button">Undo</button>' : '');
  if(undoFn){ t.querySelector('button').onclick = () => { undoFn(); t.classList.remove('show'); }; }
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 6500);
}

/* ---------------- GENERIC FORM MODAL (menu editor) ---------------- */
const formBackdrop = document.getElementById('formModalBackdrop');
let formSubmitHandler = null;
function closeForm(){ closeModal(formBackdrop); formSubmitHandler = null; }
function openForm({title, hint, fields, submit, onSubmit}){
  const errEl = document.getElementById('formModalError');
  const hintEl = document.getElementById('formModalHint');
  const fieldsEl = document.getElementById('formModalFields');
  document.getElementById('formModalTitle').textContent = title;
  hintEl.textContent = hint || ''; hintEl.hidden = !hint;
  errEl.hidden = true;
  fieldsEl.innerHTML = fields.map(f => {
    const control = f.type === 'textarea'
      ? `<textarea id="ff-${f.id}" rows="${f.rows || 7}" placeholder="${esc(f.placeholder || '')}">${esc(f.value || '')}</textarea>`
      : `<input type="text" id="ff-${f.id}" value="${esc(f.value || '')}" placeholder="${esc(f.placeholder || '')}" maxlength="160" autocomplete="off">`;
    return `<div class="field"><label for="ff-${f.id}">${esc(f.label)}</label>${control}</div>`;
  }).join('');
  document.getElementById('formModalSubmit').textContent = submit || 'Save';
  formSubmitHandler = () => {
    const vals = {};
    fields.forEach(f => { vals[f.id] = document.getElementById('ff-' + f.id).value.trim(); });
    const result = onSubmit(vals);
    if(typeof result === 'string'){ errEl.textContent = result; errEl.hidden = false; return; }
    closeForm();
  };
  openModal(formBackdrop);
  const first = fieldsEl.querySelector('input,textarea');
  if(first) setTimeout(() => first.focus(), 50);
}
document.getElementById('formModalSubmit').addEventListener('click', () => formSubmitHandler && formSubmitHandler());
document.getElementById('formModalCancel').addEventListener('click', closeForm);
document.getElementById('closeFormModal').addEventListener('click', closeForm);
formBackdrop.addEventListener('click', e => { if(e.target === formBackdrop) closeForm(); });
document.getElementById('formModalFields').addEventListener('keydown', e => {
  if(e.key === 'Enter' && e.target.tagName === 'INPUT' && formSubmitHandler){ e.preventDefault(); formSubmitHandler(); }
});

/* Escape closes the drawer and any open dialog */
const modalClosers = {};   // backdrop id -> close function, filled in below
document.addEventListener('keydown', e => {
  if(e.key !== 'Escape') return;
  if(navLinks.classList.contains('open')) setNav(false);
  document.querySelectorAll('.modal-backdrop.open').forEach(m => (modalClosers[m.id] || (() => closeModal(m)))());
});

/* ---------------- SHARED STORAGE (Firebase, using plain web requests) ---------------- */
/* When site-config.js has a Firebase key + project id, the menu and the event schedule
   live online so every visitor sees the admin's changes. Reading is public; writing
   needs the admin's Firebase sign-in (enforced by the database rules, not by this page). */
const FB = (window.SITE_CONFIG && window.SITE_CONFIG.firebase) || {};
const CLOUD = !!(FB.apiKey && FB.projectId);
const FS_URL = (FB.firestoreBase || 'https://firestore.googleapis.com') +
  '/v1/projects/' + encodeURIComponent(FB.projectId || '-') + '/databases/(default)/documents/site/';
const AUTH_URL = FB.authBase || 'https://identitytoolkit.googleapis.com';
const TOKEN_URL = FB.tokenBase || 'https://securetoken.googleapis.com';

let authState = null;        // {idToken, refreshToken, expires} — kept in memory only
let saveState = 'idle';      // idle | saving | saved | error
let menuLoading = CLOUD;     // hold back the menu until the online copy has arrived
let eventsLoading = CLOUD;
let eventsFailed = false;

function fetchWithTimeout(url, opts, ms){
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), ms || 8000);
  return fetch(url, Object.assign({}, opts, {signal: ctl.signal})).finally(() => clearTimeout(timer));
}

/* Read one document. Returns the stored value, or null if it has not been created yet. */
async function cloudGet(name){
  const r = await fetchWithTimeout(FS_URL + name, {}, 6000);
  if(r.status === 404) return null;
  if(!r.ok) throw new Error('http ' + r.status);
  const d = await r.json();
  const raw = d.fields && d.fields.json && d.fields.json.stringValue;
  return raw ? JSON.parse(raw) : null;
}

async function cloudSignIn(email, password){
  let r, d;
  try{
    r = await fetchWithTimeout(AUTH_URL + '/v1/accounts:signInWithPassword?key=' + encodeURIComponent(FB.apiKey), {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password, returnSecureToken: true})
    });
    d = await r.json();
  }catch(e){
    throw new Error('Could not reach the server. Check your internet connection and try again.');
  }
  if(!r.ok){
    const m = (d && d.error && d.error.message) || '';
    if(/TOO_MANY/.test(m)) throw new Error('Too many attempts. Wait a few minutes and try again.');
    if(/INVALID|EMAIL_NOT_FOUND|PASSWORD/.test(m)) throw new Error('Wrong email or password.');
    throw new Error('Could not sign in' + (m ? ' (' + m + ')' : '') + '.');
  }
  authState = {idToken: d.idToken, refreshToken: d.refreshToken, expires: Date.now() + (+d.expiresIn || 3600) * 1000};
}
async function refreshIdToken(){
  const r = await fetchWithTimeout(TOKEN_URL + '/v1/token?key=' + encodeURIComponent(FB.apiKey), {
    method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(authState.refreshToken)
  });
  const d = await r.json();
  if(!r.ok) throw new Error('auth');
  authState = {idToken: d.id_token, refreshToken: d.refresh_token || authState.refreshToken, expires: Date.now() + (+d.expires_in || 3600) * 1000};
}
async function getIdToken(force){
  if(!authState) throw new Error('auth');
  if(force || Date.now() > authState.expires - 60000) await refreshIdToken();
  return authState.idToken;
}
async function cloudPut(name, value){
  const body = JSON.stringify({fields: {json: {stringValue: JSON.stringify(value)}}});
  for(let attempt = 0; attempt < 2; attempt++){
    const token = await getIdToken(attempt === 1);
    const r = await fetchWithTimeout(FS_URL + name + '?updateMask.fieldPaths=json', {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
      body
    }, 15000);
    if(r.ok) return;
    if(r.status === 401 && attempt === 0) continue;      // token went stale: refresh once and retry
    if(r.status === 401 || r.status === 403) throw new Error('denied');
    throw new Error('http ' + r.status);
  }
}

/* Saves are sent one after another; if several edits happen quickly only the latest state is sent. */
let pendingSaves = {};
let flushPromise = null;
function cloudSave(name, value){
  pendingSaves[name] = value;
  setSaveState('saving');
  if(!flushPromise){
    flushPromise = (async () => {
      try{
        while(Object.keys(pendingSaves).length){
          const n = Object.keys(pendingSaves)[0];
          const v = pendingSaves[n];
          delete pendingSaves[n];
          await cloudPut(n, v);
        }
        setSaveState('saved');
        return true;
      }catch(err){
        pendingSaves = {};
        setSaveState('error', err);
        return false;
      }finally{
        flushPromise = null;
      }
    })();
  }
  return flushPromise;
}
function setSaveState(state, err){
  saveState = state;
  if(state === 'error'){
    const why = err && err.message;
    showToast(
      why === 'denied' ? 'Not saved: this account is not allowed to edit the site.' :
      why === 'auth'   ? 'Not saved: your admin session expired. Sign out, sign in again, then repeat the change.' :
                         'Not saved online. Check your internet connection and try again.'
    );
  }
  updateAdminBar();
}

/* Pull the latest menu + schedule for visitors. `force` is used right after the admin signs in,
   so they start editing from the newest version. */
let lastSync = 0;
async function syncFromCloud(force){
  if(!CLOUD) return;
  if(isAdmin && !force) return;                    // never overwrite what the admin is editing
  if(!force && Date.now() - lastSync < 15000 && !menuLoading) return;
  lastSync = Date.now();
  const [m, e] = await Promise.allSettled([cloudGet('menu'), cloudGet('events')]);
  let changed = menuLoading || eventsLoading;
  if(m.status === 'fulfilled' && m.value && Array.isArray(m.value.categories)){
    const next = normalizeMenu(m.value);
    if(JSON.stringify(next) !== JSON.stringify(MENU)){ MENU = next; changed = true; }
  }
  if(e.status === 'fulfilled'){
    if(eventsFailed){ eventsFailed = false; changed = true; }
    if(Array.isArray(e.value)){
      const next = normalizeEvents(e.value);
      if(JSON.stringify(next) !== JSON.stringify(events)){ events = next; changed = true; }
    }
  } else if(!eventsFailed && eventsLoading){
    eventsFailed = true; changed = true;
  }
  menuLoading = false; eventsLoading = false;
  if(changed){ renderMenu(); renderEvents(); }
}

/* ---------------- ADMIN SESSION (shared by menu + events) ---------------- */
let isAdmin = false;
const adminLink = document.getElementById('adminLink');
const adminModalBackdrop = document.getElementById('adminModalBackdrop');
const adminErrorEl = document.getElementById('adminError');

function openAdminLogin(){
  adminErrorEl.hidden = true;
  document.getElementById('adminModalHint').textContent = 'Sign in with the admin email and password to manage the menu and event listings.';
  openModal(adminModalBackdrop);
  setTimeout(() => document.getElementById('adminEmail').focus(), 50);
}
function closeAdminLogin(){ closeModal(adminModalBackdrop); }
async function tryAdminLogin(){
  const input = document.getElementById('adminPass');
  const submitBtn = document.getElementById('submitAdminLogin');
  const showError = msg => { adminErrorEl.textContent = msg; adminErrorEl.hidden = false; };
  adminErrorEl.hidden = true;

  const email = document.getElementById('adminEmail').value.trim();
  if(!email || !input.value){ showError('Enter the admin email and password.'); return; }
  submitBtn.disabled = true; submitBtn.textContent = 'Signing in…';
  try{
    await cloudSignIn(email, input.value);
    input.value = '';
    await syncFromCloud(true);
    closeAdminLogin();
    setAdmin(true);
  }catch(err){
    showError(err.message);
  }finally{
    submitBtn.disabled = false; submitBtn.textContent = 'Sign in';
  }
}
function setAdmin(on){
  isAdmin = on;
  if(!on){ authState = null; saveState = 'idle'; }
  adminLink.textContent = on ? 'Sign out' : 'Admin';
  document.getElementById('menuAdminBar').hidden = !on;
  document.getElementById('eventAdminBar').hidden = !on;
  renderMenu();
  renderEvents();
  if(!on && CLOUD) syncFromCloud(true);            // signed out: go back to the shared version
}
/* Without the online database there is nothing to sign in to: edits only live in this browser. */
adminLink.addEventListener('click', () => {
  if(isAdmin){ setAdmin(false); return; }
  if(CLOUD) openAdminLogin(); else setAdmin(true);
});
document.getElementById('eventLogoutBtn').addEventListener('click', () => setAdmin(false));
document.getElementById('closeAdminModal').addEventListener('click', closeAdminLogin);
document.getElementById('cancelAdminLogin').addEventListener('click', closeAdminLogin);
document.getElementById('submitAdminLogin').addEventListener('click', tryAdminLogin);
adminModalBackdrop.addEventListener('click', e => { if(e.target === adminModalBackdrop) closeAdminLogin(); });
['adminPass','adminEmail'].forEach(id => document.getElementById(id).addEventListener('keydown', e => { if(e.key === 'Enter') tryAdminLogin(); }));
modalClosers.adminModalBackdrop = closeAdminLogin;
modalClosers.formModalBackdrop = closeForm;

/* ---------------- MENU ---------------- */
/* The published menu lives in menu-data.js. Edits made in the admin panel are kept
   as a draft in this browser and can be downloaded as a replacement menu-data.js. */
const MENU_DRAFT_KEY = 'sheetal-menu-draft';
const BASE_VERSION = (window.MENU_DATA && window.MENU_DATA.version) || '';
const PAGE_SIZE = 36;

function normalizeMenu(data){
  return ((data && data.categories) || []).map(c => ({
    name: c.name,
    groups: (c.groups || []).map(g => ({
      name: g.name,
      sub: g.sub || '',
      items: (g.items || []).map(it => ({name: String(Array.isArray(it) ? it[0] : (it && typeof it === 'object' ? it.name : it)).trim()}))
        .filter(it => it.name)
    }))
  }));
}
function loadMenu(){
  if(CLOUD){
    try{ localStorage.removeItem(MENU_DRAFT_KEY); }catch(e){}   // the online copy is the source of truth
    return {menu: normalizeMenu(window.MENU_DATA), draft: false};
  }
  try{
    const raw = localStorage.getItem(MENU_DRAFT_KEY);
    if(raw){
      const d = JSON.parse(raw);
      /* A draft only applies to the version of menu-data.js it was based on. */
      if(d && d.base === BASE_VERSION && Array.isArray(d.categories)){
        return {menu: normalizeMenu(d), draft: true};
      }
      localStorage.removeItem(MENU_DRAFT_KEY);
    }
  }catch(e){}
  return {menu: normalizeMenu(window.MENU_DATA), draft: false};
}
const loadedMenu = loadMenu();
let MENU = loadedMenu.menu;
let hasDraft = loadedMenu.draft;
let activeCat = 0;
let activeGroup = {};
let expanded = {};
let searchQ = '';

function persistMenu(){
  if(CLOUD){ cloudSave('menu', {categories: MENU}); return; }
  try{
    localStorage.setItem(MENU_DRAFT_KEY, JSON.stringify({base: BASE_VERSION, categories: MENU}));
    hasDraft = true;
  }catch(e){
    hasDraft = true;
    showToast('This browser blocked saving. Use "Download menu file" so your changes are not lost.');
  }
}
/* Runs an edit, saves it, re-renders, and offers Undo. */
function mutate(message, fn){
  const before = JSON.stringify({MENU, activeCat, activeGroup});
  fn();
  persistMenu();
  renderMenu();
  showToast(message, () => {
    const b = JSON.parse(before);
    MENU = b.MENU; activeCat = b.activeCat; activeGroup = b.activeGroup;
    persistMenu();
    renderMenu();
  });
}

const tabsEl = document.getElementById('menuTabs');
const panelsEl = document.getElementById('menuPanels');
const searchEl = document.getElementById('menuSearch');

function itemCard(it, idx, editable, path){
  const tools = editable
    ? `<div class="item-tools"><button type="button" class="mini-btn" data-act="edit-item" data-i="${idx}" aria-label="Rename ${esc(it.name)}" title="Rename">${penSvg}</button><button type="button" class="mini-btn danger" data-act="del-item" data-i="${idx}" aria-label="Delete ${esc(it.name)}" title="Delete">${binSvg}</button></div>`
    : '';
  return `<div class="menu-item${editable ? ' editable' : ''}">
    <div class="row">${leafSvg}<h4>${esc(it.name)}</h4></div>
    ${path ? `<div class="hit-path">${esc(path)}</div>` : ''}
    ${tools}
  </div>`;
}

function renderPanel(){
  const cat = MENU[activeCat];
  if(!cat){
    return '<p class="empty-note">The menu is empty.</p>' + (isAdmin ? '<button type="button" class="btn btn-outline" data-act="add-cat">+ Add a section</button>' : '');
  }
  let gi = activeGroup[activeCat] || 0;
  if(gi >= cat.groups.length) gi = 0;
  const grp = cat.groups[gi];
  let html = '';

  if(isAdmin){
    html += `<div class="edit-row"><span class="edit-label">Section: <b>${esc(cat.name)}</b></span>
      <button type="button" class="link-btn" data-act="rename-cat">Rename</button>
      <button type="button" class="link-btn danger" data-act="del-cat">Delete section</button></div>`;
  }

  const showGroupTabs = isAdmin || cat.groups.length > 1;
  if(showGroupTabs) html += '<div class="group-tabs">' + cat.groups.map((g, i) =>
    `<button type="button" class="group-tab${i === gi ? ' active' : ''}" data-act="grp" data-i="${i}" aria-pressed="${i === gi}">${esc(g.name)} <em>${g.items.length}</em></button>`
  ).join('') + (isAdmin ? '<button type="button" class="group-tab add-tab" data-act="add-grp">+ Add group</button>' : '') + '</div>';

  if(!grp){
    return html + '<p class="empty-note">This section has no groups yet.</p>';
  }
  if(grp.sub) html += `<p class="group-sub">${esc(grp.sub)}</p>`;
  if(isAdmin){
    html += `<div class="edit-row"><span class="edit-label">Group: <b>${esc(grp.name)}</b></span>
      <button type="button" class="link-btn" data-act="rename-grp">Rename</button>
      <button type="button" class="link-btn danger" data-act="del-grp">Delete group</button>
      <button type="button" class="btn btn-primary btn-sm" data-act="add-items">+ Add items</button></div>`;
  }
  const key = activeCat + ':' + gi;
  const limit = (isAdmin || expanded[key]) ? Infinity : PAGE_SIZE;
  html += '<div class="menu-grid">' + grp.items.slice(0, limit).map((it, i) => itemCard(it, i, isAdmin)).join('') + '</div>';
  if(grp.items.length > limit){
    html += `<div class="more-wrap"><button type="button" class="btn btn-outline" data-act="more">Show all ${grp.items.length} dishes</button></div>`;
  }
  if(!grp.items.length){
    html += '<p class="empty-note">No items in this group yet.' + (isAdmin ? ' Use “Add items” above.' : '') + '</p>';
  }
  return html;
}

function renderSearch(){
  const terms = searchQ.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = [];
  const seen = new Set();
  MENU.forEach(c => c.groups.forEach(g => g.items.forEach(it => {
    const hay = it.name.toLowerCase();
    if(!terms.every(t => hay.includes(t))) return;
    const key = it.name.toLowerCase();
    if(seen.has(key)) return;
    seen.add(key);
    hits.push({it, path: c.name + ' › ' + g.name});
  })));
  if(!hits.length) return `<p class="empty-note">No dishes match “${esc(searchQ)}”. Try a shorter or different word.</p>`;
  const LIMIT = 150;
  const shown = hits.slice(0, LIMIT);
  return `<p class="search-count">${hits.length} dish${hits.length !== 1 ? 'es' : ''} found${hits.length > LIMIT ? ` — showing the first ${LIMIT}` : ''}</p>
    <div class="menu-grid">${shown.map(h => itemCard(h.it, 0, false, h.path)).join('')}</div>`;
}

function saveStatusText(what){
  if(CLOUD){
    return saveState === 'saving' ? 'Saving…' :
      saveState === 'error' ? '⚠ The last change was NOT saved online, so visitors cannot see it yet. Check your connection and repeat the change.' :
      'Changes are saved online and appear for every visitor.';
  }
  return 'Shared storage is not connected, so ' + what + ' edits stay in this browser only (see FIREBASE_SETUP.md to share them with every visitor).';
}
function updateAdminBar(){
  const note = document.getElementById('menuDraftNote');
  const discard = document.getElementById('discardBtn');
  const failed = CLOUD && saveState === 'error';
  document.getElementById('menuAdminBar').classList.toggle('has-error', failed);
  document.getElementById('eventAdminBar').classList.toggle('has-error', failed);
  document.getElementById('eventDraftNote').textContent = saveStatusText('event');
  if(CLOUD){
    note.textContent = saveStatusText('menu');
    discard.textContent = 'Restore original menu';
    discard.dataset.act = 'restore';
    discard.hidden = false;
    return;
  }
  discard.textContent = 'Discard my changes';
  discard.dataset.act = 'discard';
  note.textContent = hasDraft
    ? 'Shared storage is not connected, so these edits are only in this browser. Download the menu file and replace menu-data.js in your GitHub repository to show them to every visitor.'
    : 'Shared storage is not connected yet, so edits are saved in this browser only (see FIREBASE_SETUP.md to share them with every visitor).';
  discard.hidden = !hasDraft;
}

function renderMenu(){
  if(menuLoading){
    tabsEl.innerHTML = '';
    panelsEl.innerHTML = '<p class="empty-note">Loading the menu…</p>';
    return;
  }
  if(activeCat >= MENU.length) activeCat = Math.max(0, MENU.length - 1);
  tabsEl.innerHTML = MENU.map((c, i) =>
    `<button type="button" class="menu-tab${i === activeCat && !searchQ ? ' active' : ''}" data-act="cat" data-i="${i}" aria-pressed="${i === activeCat && !searchQ}">${esc(c.name)}</button>`
  ).join('') + (isAdmin ? '<button type="button" class="menu-tab add-tab" data-act="add-cat">+ Add section</button>' : '');
  panelsEl.innerHTML = searchQ ? renderSearch() : renderPanel();
  updateAdminBar();
  /* On phones the tab rows scroll sideways: keep the chosen tab in view (rebuilding a row resets its scroll) */
  centerTab(tabsEl, tabsEl.querySelector('.menu-tab.active'));
  centerTab(panelsEl.querySelector('.group-tabs'), panelsEl.querySelector('.group-tab.active'));
}
function centerTab(row, tab){
  if(!row || !tab || row.scrollWidth <= row.clientWidth) return;
  const offset = tab.getBoundingClientRect().left - row.getBoundingClientRect().left + row.scrollLeft;
  row.scrollLeft = Math.max(0, offset - (row.clientWidth - tab.offsetWidth) / 2);
}

/* One dish per line. Leading bullets are ignored, and anything after a "|" is dropped (menus are names only). */
function parseItemLines(text){
  return text.split('\n')
    .map(l => l.trim().replace(/^[♦•*\-–]\s*/, '').split('|')[0].trim())
    .filter(Boolean)
    .map(name => ({name}));
}

function serializeMenu(){
  const q = JSON.stringify;
  const cats = MENU.map(c => {
    const groups = c.groups.map(g => {
      const items = g.items.map(it => '            ' + q(it.name)).join(',\n');
      return '        {\n          "name": ' + q(g.name) + ',\n' +
        (g.sub ? '          "sub": ' + q(g.sub) + ',\n' : '') +
        '          "items": [\n' + items + '\n          ]\n        }';
    }).join(',\n');
    return '    {\n      "name": ' + q(c.name) + ',\n      "groups": [\n' + groups + '\n      ]\n    }';
  }).join(',\n');
  return '/* Sheetal Caterers & Events — menu data.\n' +
    '   Each item is a dish name. Sections with a single group show a plain list.\n' +
    '   To publish menu changes made through the Admin panel, download the updated\n' +
    '   file from the panel and replace this file in the repository. */\n' +
    'window.MENU_DATA = {\n  "version": ' + q(new Date().toISOString()) + ',\n  "categories": [\n' + cats + '\n  ]\n};\n';
}
function downloadMenuFile(){
  const blob = new Blob([serializeMenu()], {type: 'text/javascript'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'menu-data.js';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Downloaded menu-data.js — upload it to your GitHub repository to replace the old one.');
}

const menuSection = document.getElementById('menu');
menuSection.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if(!el) return;
  const act = el.dataset.act;
  const i = +el.dataset.i;
  const cat = MENU[activeCat];
  const gi = Math.min(activeGroup[activeCat] || 0, cat ? Math.max(cat.groups.length - 1, 0) : 0);
  const grp = cat && cat.groups[gi];

  switch(act){
    case 'cat':
      searchQ = ''; searchEl.value = '';
      activeCat = i; renderMenu(); break;
    case 'grp':
      activeGroup[activeCat] = i; renderMenu(); break;
    case 'more':
      expanded[activeCat + ':' + gi] = true; renderMenu(); break;

    case 'add-cat':
      openForm({
        title: 'Add a menu section',
        hint: 'A section appears as a tab, for example “Live Counters”. Groups inside it split it into smaller lists.',
        fields: [
          {id:'name', label:'Section name', placeholder:'e.g. Live Counters'},
          {id:'group', label:'First group name (optional)', placeholder:'e.g. Starters'}
        ],
        submit: 'Add section',
        onSubmit: v => {
          if(!v.name) return 'Please enter a section name.';
          mutate('Section “' + v.name + '” added.', () => {
            MENU.push({name: v.name, groups: [{name: v.group || 'All items', sub: '', items: []}]});
            activeCat = MENU.length - 1; activeGroup[activeCat] = 0;
          });
        }
      }); break;
    case 'rename-cat':
      if(!cat) break;
      openForm({
        title: 'Rename section',
        fields: [{id:'name', label:'Section name', value: cat.name}],
        submit: 'Save',
        onSubmit: v => {
          if(!v.name) return 'Please enter a section name.';
          mutate('Section renamed.', () => { cat.name = v.name; });
        }
      }); break;
    case 'del-cat': {
      if(!cat) break;
      const n = cat.groups.reduce((s, g) => s + g.items.length, 0);
      if(!confirm(`Delete the section “${cat.name}” and its ${n} item${n !== 1 ? 's' : ''}?`)) break;
      mutate('Section “' + cat.name + '” deleted.', () => { MENU.splice(activeCat, 1); activeCat = 0; });
      break;
    }

    case 'add-grp':
      if(!cat) break;
      openForm({
        title: 'Add a group to “' + cat.name + '”',
        fields: [
          {id:'name', label:'Group name', placeholder:'e.g. Live Chaat'},
          {id:'sub', label:'Short line under the name (optional)', placeholder:'e.g. Served fresh at the counter'}
        ],
        submit: 'Add group',
        onSubmit: v => {
          if(!v.name) return 'Please enter a group name.';
          mutate('Group “' + v.name + '” added.', () => {
            cat.groups.push({name: v.name, sub: v.sub, items: []});
            activeGroup[activeCat] = cat.groups.length - 1;
          });
        }
      }); break;
    case 'rename-grp':
      if(!grp) break;
      openForm({
        title: 'Edit group',
        fields: [
          {id:'name', label:'Group name', value: grp.name},
          {id:'sub', label:'Short line under the name (optional)', value: grp.sub}
        ],
        submit: 'Save',
        onSubmit: v => {
          if(!v.name) return 'Please enter a group name.';
          mutate('Group updated.', () => { grp.name = v.name; grp.sub = v.sub; });
        }
      }); break;
    case 'del-grp': {
      if(!grp) break;
      const n = grp.items.length;
      if(!confirm(`Delete the group “${grp.name}” and its ${n} item${n !== 1 ? 's' : ''}?`)) break;
      mutate('Group “' + grp.name + '” deleted.', () => { cat.groups.splice(gi, 1); activeGroup[activeCat] = 0; });
      break;
    }

    case 'add-items':
      if(!grp) break;
      openForm({
        title: 'Add items to “' + grp.name + '”',
        hint: 'One dish name per line. You can paste a whole list.',
        fields: [{id:'lines', type:'textarea', label:'Dishes', rows: 9, placeholder:'Kaju Katli\nGulab Jamun\nRaj Kachori'}],
        submit: 'Add items',
        onSubmit: v => {
          const items = parseItemLines(v.lines);
          if(!items.length) return 'Please enter at least one dish name.';
          mutate(items.length + ' item' + (items.length !== 1 ? 's' : '') + ' added.', () => { grp.items.push(...items); });
        }
      }); break;
    case 'edit-item': {
      const it = grp && grp.items[i];
      if(!it) break;
      openForm({
        title: 'Rename item',
        fields: [{id:'name', label:'Dish name', value: it.name}],
        submit: 'Save',
        onSubmit: v => {
          if(!v.name) return 'Please enter a dish name.';
          mutate('Item renamed.', () => { it.name = v.name; });
        }
      }); break;
    }
    case 'del-item': {
      const it = grp && grp.items[i];
      if(!it) break;
      mutate('“' + it.name + '” deleted.', () => { grp.items.splice(i, 1); });
      break;
    }

    case 'export': downloadMenuFile(); break;
    case 'restore':
      if(!confirm('Replace the online menu with the original menu from the website files? Everything added or changed since then will be removed (you can undo straight after).')) break;
      mutate('Original menu restored.', () => { MENU = normalizeMenu(window.MENU_DATA); activeCat = 0; activeGroup = {}; });
      break;
    case 'discard':
      if(!confirm('Discard all menu changes made in this browser and go back to the published menu?')) break;
      try{ localStorage.removeItem(MENU_DRAFT_KEY); }catch(err){}
      MENU = normalizeMenu(window.MENU_DATA); hasDraft = false; activeCat = 0; activeGroup = {};
      renderMenu(); showToast('Changes discarded.');
      break;
    case 'logout': setAdmin(false); break;
  }
});

let searchTimer;
searchEl.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { searchQ = searchEl.value.trim(); renderMenu(); }, 120);
});
renderMenu();

/* ---------------- EVENTS ---------------- */
const MEAL_TYPES = ['Breakfast','Brunch','Lunch','Hi-Tea','Snacks','Dinner','Late Night'];
/* Default menu sections shown for a meal when the admin has not written a menu for it */
const MEAL_MENU_MAP = {
  'Breakfast': ['Hi-Tea','Bakery','24x7 Section'],
  'Brunch': ['Hi-Tea','Bakery','Curries & Sabzi','Breads'],
  'Lunch': ['Curries & Sabzi','Dal','Rice','Breads','Indian Sweets'],
  'Hi-Tea': ['Hi-Tea','Bakery','Mocktails'],
  'Snacks': ['Hi-Tea','Bakery','Mocktails'],
  'Dinner': ['Curries & Sabzi','Dal','Rice','Breads','Hi-Tea','Indian Sweets'],
  'Late Night': ['24x7 Section','Mocktails','Indian Sweets']
};
function defaultMealSections(type){
  const names = MEAL_MENU_MAP[type] || [];
  return MENU.filter(c => names.includes(c.name)).map(c => c.name);
}

function cleanStr(v, max){ return typeof v === 'string' ? v.trim().slice(0, max || 200) : ''; }
function newId(){ return 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
/* Accepts what is stored online or in the browser (including older listings without a venue) and returns a safe, consistent shape. */
function normalizeEvents(list){
  if(!Array.isArray(list)) return [];
  return list.map(ev => {
    if(!ev || typeof ev !== 'object') return null;
    const date = cleanStr(ev.date, 10);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
    return {
      id: cleanStr(ev.id, 40) || newId(),
      client: cleanStr(ev.client, 120) || 'Private event',
      date,
      venue: cleanStr(ev.venue, 160),
      address: cleanStr(ev.address, 240),
      meals: (Array.isArray(ev.meals) ? ev.meals : []).map(m => {
        if(!m || typeof m !== 'object') return null;
        return {
          type: cleanStr(m.type, 40) || 'Meal',
          start: cleanStr(m.start, 20),
          end: cleanStr(m.end, 20),
          venue: cleanStr(m.venue, 160),
          note: cleanStr(m.note, 240),
          items: (Array.isArray(m.items) ? m.items : []).map(x => cleanStr(String(x), 160)).filter(Boolean)
        };
      }).filter(Boolean)
    };
  }).filter(Boolean);
}
function loadEvents(){
  try{
    const raw = localStorage.getItem('sheetal-events');
    if(raw) return normalizeEvents(JSON.parse(raw));
  }catch(e){}
  return [];
}
function saveEvents(evts, silent){
  if(CLOUD){
    /* `silent` keeps the success toast from replacing a toast that carries an Undo button */
    cloudSave('events', evts).then(ok => { if(ok && !silent) showToast('Schedule saved online — visible to everyone.'); });
    return;
  }
  try{ localStorage.setItem('sheetal-events', JSON.stringify(evts)); }
  catch(e){ showToast('This browser blocked saving, so the event was not kept.'); }
}
let events = CLOUD ? [] : loadEvents();

/* Times are stored as 24h "HH:MM" (what a phone's time picker gives). Older listings used text like "12:30 PM", which still works. */
function to24h(v){
  if(!v) return '';
  let m = /^(\d{1,2}):(\d{2})$/.exec(v);
  if(m) return String(+m[1]).padStart(2,'0') + ':' + m[2];
  m = /^(\d{1,2})(?:[:.](\d{2}))?\s*([ap])\.?m\.?$/i.exec(v.trim());
  if(!m) return '';
  let h = +m[1] % 12;
  if(m[3].toLowerCase() === 'p') h += 12;
  return String(h).padStart(2,'0') + ':' + (m[2] || '00');
}
function to12h(v){
  const t = to24h(v);
  if(!t) return v || '';
  let h = +t.slice(0,2);
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return h + ':' + t.slice(3) + ' ' + ap;
}
function timeRange(m){
  if(!m.start) return m.end ? 'Until ' + to12h(m.end) : '';
  return to12h(m.start) + (m.end ? ' – ' + to12h(m.end) : '');
}
function mapsUrl(venue, address){
  const q = [venue, address].filter(Boolean).join(', ');
  return q ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q) : '';
}
function todayStr(){
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

const monthNames = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function eventCardHtml(ev, today){
  const [y, mo, da] = ev.date.split('-').map(Number);
  const d = new Date(y, mo - 1, da);
  const isToday = ev.date === today, isPast = ev.date < today;
  const meals = ev.meals.map((m, mi) => ({m, mi}))
    .sort((a, b) => (to24h(a.m.start) || '99').localeCompare(to24h(b.m.start) || '99'))
    .map(({m, mi}) => `<button type="button" class="meal-chip" data-ev="${esc(ev.id)}" data-mi="${mi}" aria-label="View ${esc(m.type)} menu">
        <b>${esc(m.type)}</b><span>${esc(timeRange(m))}</span>${chevSvg}</button>`).join('');
  const link = mapsUrl(ev.venue, ev.address);
  const venue = (ev.venue || ev.address) ? `<div class="event-venue">${pinSvg}<div>
      ${ev.venue ? `<b>${esc(ev.venue)}</b>` : ''}${ev.venue && ev.address ? ' · ' : ''}${ev.address ? `<span>${esc(ev.address)}</span>` : ''}
      ${link ? `<a class="map-link" href="${esc(link)}" target="_blank" rel="noopener">Open in Maps</a>` : ''}</div></div>` : '';
  return `<article class="event-card${isToday ? ' is-today' : ''}${isPast ? ' is-past' : ''}">
      <div class="event-date"><div class="day">${da}</div><div><div class="mon">${monthNames[mo - 1]} ${y}</div><div class="dow">${dayNames[d.getDay()]}</div></div></div>
      <div class="event-body">
        <h4>${esc(ev.client)}${isToday ? '<span class="today-badge">Today</span>' : ''}</h4>
        ${venue}
        <div class="meal-row">${meals || '<span class="hint">Meal timings will be added soon.</span>'}</div>
      </div>
      <div class="event-actions">${isAdmin ? `<button type="button" class="icon-btn edit-ev" data-id="${esc(ev.id)}" aria-label="Edit ${esc(ev.client)}" title="Edit">${penSvg}</button>` : ''}</div>
    </article>`;
}

function renderEvents(){
  const list = document.getElementById('eventList');
  if(eventsLoading){ list.innerHTML = '<p class="empty-note">Loading the schedule…</p>'; return; }
  if(eventsFailed && !events.length){ list.innerHTML = '<p class="empty-note">The schedule could not be loaded right now. Please refresh in a moment.</p>'; return; }
  const today = todayStr();
  const upcoming = events.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = events.filter(e => e.date < today).sort((a, b) => b.date.localeCompare(a.date));
  let html = '';
  if(!upcoming.length){
    html += isAdmin
      ? '<p class="empty-note">No upcoming events. Use “+ Add event” above to add one.</p>'
      : '<p class="empty-note">No events are scheduled right now — check back soon, or <a href="#contact">get in touch</a> to plan yours.</p>';
  } else {
    html += upcoming.map(ev => eventCardHtml(ev, today)).join('');
  }
  /* Past events are kept for the admin to look back on, but visitors never see them */
  if(isAdmin && past.length){
    html += `<details class="past-events"><summary>Past events (${past.length})</summary><div class="event-list">${past.map(ev => eventCardHtml(ev, today)).join('')}</div></details>`;
  }
  list.innerHTML = html;
}
renderEvents();

document.getElementById('eventList').addEventListener('click', e => {
  const edit = e.target.closest('.edit-ev');
  if(edit){ openEventModal(edit.dataset.id); return; }
  const chip = e.target.closest('.meal-chip');
  if(chip){
    const ev = events.find(x => x.id === chip.dataset.ev);
    const meal = ev && ev.meals[+chip.dataset.mi];
    if(ev && meal) openMealMenu(ev, meal);
  }
});

/* ---- Meal menu viewer ---- */
const mealMenuBackdrop = document.getElementById('mealMenuBackdrop');
function openMealMenu(ev, meal){
  document.getElementById('mealMenuKicker').textContent = meal.type + ' menu';
  document.getElementById('mealMenuTitle').textContent = ev.client;
  document.getElementById('mealMenuTime').textContent = timeRange(meal);
  const venueName = meal.venue || ev.venue;
  const venueAddr = meal.venue ? '' : ev.address;
  const vEl = document.getElementById('mealMenuVenue');
  if(venueName || venueAddr){
    const link = mapsUrl(venueName, venueAddr);
    vEl.innerHTML = pinSvg + '<span>' + (venueName ? '<b>' + esc(venueName) + '</b>' : '') + (venueName && venueAddr ? ', ' : '') + esc(venueAddr || '') +
      (link ? ' <a class="map-link" href="' + esc(link) + '" target="_blank" rel="noopener">Open in Maps</a>' : '') + '</span>';
    vEl.hidden = false;
  } else { vEl.hidden = true; }
  const nEl = document.getElementById('mealMenuNote');
  nEl.textContent = meal.note || ''; nEl.hidden = !meal.note;

  const target = document.getElementById('mealMenuItems');
  if(meal.items && meal.items.length){
    target.innerHTML = meal.items.map(line => /:$/.test(line)
      ? `<div class="dish-head">${esc(line.replace(/:+$/, ''))}</div>`
      : `<div class="dish">${leafSvg}<span>${esc(line)}</span></div>`
    ).join('');
  } else {
    const sections = defaultMealSections(meal.type);
    target.innerHTML = sections.length
      ? '<p class="fallback">The dishes for this meal are chosen from these sections of our menu:</p>' +
        sections.map(name => `<div class="dish">${leafSvg}<span>${esc(name)}</span></div>`).join('')
      : '<p class="fallback">The menu for this meal will be shared by our team. Please contact us for details.</p>';
  }
  openModal(mealMenuBackdrop);
}
function closeMealMenu(){ closeModal(mealMenuBackdrop); }
document.getElementById('closeMealMenu').addEventListener('click', closeMealMenu);
mealMenuBackdrop.addEventListener('click', e => { if(e.target === mealMenuBackdrop) closeMealMenu(); });
modalClosers.mealMenuBackdrop = closeMealMenu;

/* ---- Add / edit event (admin) ---- */
const eventModalBackdrop = document.getElementById('eventModalBackdrop');
const mealRowsEl = document.getElementById('mealRows');
const eventErrorEl = document.getElementById('eventError');
let editingId = null;

function menuFillOptions(){
  return '<option value="">+ Add dishes from our menu…</option>' + MENU.map((c, ci) => {
    const opts = c.groups.map((g, gi) => g.items.length
      ? `<option value="${ci}:${gi}">${esc(g.name)} (${g.items.length})</option>` : '').join('');
    return opts ? `<optgroup label="${esc(c.name)}">${opts}</optgroup>` : '';
  }).join('');
}
function mealRowHtml(m){
  m = m || {type: 'Lunch'};
  const preset = MEAL_TYPES.includes(m.type);
  const typeOpts = MEAL_TYPES.map(t => `<option value="${esc(t)}"${preset && m.type === t ? ' selected' : ''}>${esc(t)}</option>`).join('') +
    `<option value="__custom"${!preset ? ' selected' : ''}>Custom meal…</option>`;
  return `<div class="meal-row-edit">
    <div class="meal-row-head"><strong class="meal-row-title">Meal</strong><button type="button" class="link-btn danger" data-rm>Remove</button></div>
    <div class="grid-2">
      <div class="field"><label>Meal</label><select class="mealType">${typeOpts}</select></div>
      <div class="field mealCustomWrap"${preset ? ' hidden' : ''}><label>Meal name</label><input type="text" class="mealCustom" maxlength="40" value="${preset ? '' : esc(m.type)}" placeholder="e.g. Sangeet Dinner" autocomplete="off"></div>
    </div>
    <div class="grid-2 keep">
      <div class="field"><label>Start time</label><input type="time" class="mealStart" value="${esc(to24h(m.start))}"></div>
      <div class="field"><label>End time (optional)</label><input type="time" class="mealEnd" value="${esc(to24h(m.end))}"></div>
    </div>
    <div class="field"><label>Venue for this meal (only if different from the event venue)</label><input type="text" class="mealVenue" maxlength="160" value="${esc(m.venue || '')}" placeholder="Leave blank to use the event venue" autocomplete="off"></div>
    <div class="field"><label>Menu — write your own, one dish per line</label>
      <textarea class="mealItems" rows="6" placeholder="Starters:&#10;Paneer Tikka&#10;Hara Bhara Kebab&#10;&#10;Main Course:&#10;Dal Makhani&#10;Tandoori Roti">${esc((m.items || []).join('\n'))}</textarea></div>
    <div class="field"><select class="mealFill" aria-label="Add dishes from our menu">${menuFillOptions()}</select></div>
    <p class="hint">Tip: end a line with a colon to make a heading, like “Live Counters:”. Leave the menu empty to show our standard menu sections for this meal.</p>
    <div class="field"><label>Note for guests (optional)</label><input type="text" class="mealNote" maxlength="240" value="${esc(m.note || '')}" placeholder="e.g. Live chaat counters open from 8 PM" autocomplete="off"></div>
  </div>`;
}
function renumberMealRows(){
  const rows = mealRowsEl.querySelectorAll('.meal-row-edit');
  rows.forEach((row, i) => { row.querySelector('.meal-row-title').textContent = 'Meal ' + (i + 1); });
  rows.forEach(row => { row.querySelector('[data-rm]').hidden = rows.length < 2; });
}
function parseMealItems(text){
  let lines = text.split('\n');
  if(lines.length === 1 && text.includes(',')) lines = text.split(',');       // a single comma-separated line still works
  return lines.map(l => l.trim().replace(/^[♦•*\-–]\s*/, '').trim()).filter(Boolean).map(l => l.slice(0, 160));
}

mealRowsEl.addEventListener('change', e => {
  const row = e.target.closest('.meal-row-edit');
  if(!row) return;
  if(e.target.classList.contains('mealType')){
    const custom = e.target.value === '__custom';
    row.querySelector('.mealCustomWrap').hidden = !custom;
    if(custom) row.querySelector('.mealCustom').focus();
  }
  if(e.target.classList.contains('mealFill') && e.target.value){
    const [ci, gi] = e.target.value.split(':').map(Number);
    const grp = MENU[ci] && MENU[ci].groups[gi];
    if(grp){
      const ta = row.querySelector('.mealItems');
      const have = new Set(parseMealItems(ta.value).map(s => s.toLowerCase()));
      const add = grp.items.map(it => it.name).filter(n => !have.has(n.toLowerCase()));
      const cur = ta.value.replace(/\s+$/, '');
      ta.value = (cur ? cur + '\n' : '') + add.join('\n');
      showToast(add.length ? add.length + ' dish' + (add.length !== 1 ? 'es' : '') + ' added from ' + grp.name + '.' : 'Those dishes are already in the list.');
    }
    e.target.value = '';
  }
});
mealRowsEl.addEventListener('click', e => {
  const rm = e.target.closest('[data-rm]');
  if(!rm) return;
  const row = rm.closest('.meal-row-edit');
  if(mealRowsEl.children.length > 1){ row.remove(); renumberMealRows(); }
});

function openEventModal(id){
  editingId = id;
  eventErrorEl.hidden = true;
  const deleteBtn = document.getElementById('deleteEventBtn');
  const ev = id ? events.find(e => e.id === id) : null;
  if(id && !ev){ editingId = null; return; }
  document.getElementById('eventModalTitle').textContent = ev ? 'Edit event' : 'Add event';
  document.getElementById('evClient').value = ev ? ev.client : '';
  document.getElementById('evDate').value = ev ? ev.date : '';
  document.getElementById('evVenue').value = ev ? ev.venue : '';
  document.getElementById('evAddress').value = ev ? ev.address : '';
  mealRowsEl.innerHTML = ev && ev.meals.length ? ev.meals.map(mealRowHtml).join('') : mealRowHtml({type: 'Lunch'});
  renumberMealRows();
  deleteBtn.hidden = !ev;
  openModal(eventModalBackdrop);
  eventModalBackdrop.querySelector('.modal').scrollTop = 0;
  setTimeout(() => document.getElementById('evClient').focus(), 50);
}
function closeEventModal(){ closeModal(eventModalBackdrop); }
document.getElementById('addEventBtn').addEventListener('click', () => openEventModal(null));
document.getElementById('closeEventModal').addEventListener('click', closeEventModal);
document.getElementById('cancelEventBtn').addEventListener('click', closeEventModal);
eventModalBackdrop.addEventListener('click', e => { if(e.target === eventModalBackdrop) closeEventModal(); });
modalClosers.eventModalBackdrop = closeEventModal;
document.getElementById('addMealRow').addEventListener('click', () => {
  mealRowsEl.insertAdjacentHTML('beforeend', mealRowHtml({type: 'Dinner'}));
  renumberMealRows();
  const rows = mealRowsEl.querySelectorAll('.meal-row-edit');
  const last = rows[rows.length - 1];
  last.scrollIntoView({behavior: 'smooth', block: 'nearest'});
});

document.getElementById('saveEventBtn').addEventListener('click', () => {
  const fail = msg => { eventErrorEl.textContent = msg; eventErrorEl.hidden = false; eventErrorEl.scrollIntoView({block: 'nearest'}); };
  eventErrorEl.hidden = true;
  const client = document.getElementById('evClient').value.trim();
  const date = document.getElementById('evDate').value;
  const venue = document.getElementById('evVenue').value.trim();
  const address = document.getElementById('evAddress').value.trim();
  if(!client) return fail('Please enter the family or client name.');
  if(!date) return fail('Please choose the event date.');

  const meals = [];
  const rows = [...mealRowsEl.querySelectorAll('.meal-row-edit')];
  for(let i = 0; i < rows.length; i++){
    const row = rows[i];
    const sel = row.querySelector('.mealType').value;
    const type = sel === '__custom' ? row.querySelector('.mealCustom').value.trim() : sel;
    const start = row.querySelector('.mealStart').value;
    if(!type) return fail('Meal ' + (i + 1) + ': please type a name for the custom meal.');
    if(!start) return fail('Meal ' + (i + 1) + ' (' + type + '): please choose a start time.');
    meals.push({
      type: type.slice(0, 40),
      start,
      end: row.querySelector('.mealEnd').value,
      venue: row.querySelector('.mealVenue').value.trim(),
      note: row.querySelector('.mealNote').value.trim(),
      items: parseMealItems(row.querySelector('.mealItems').value)
    });
  }
  if(!meals.length) return fail('Please add at least one meal.');

  if(editingId){
    const ev = events.find(e => e.id === editingId);
    if(!ev){ closeEventModal(); return; }
    Object.assign(ev, {client, date, venue, address, meals});
  } else {
    events.push({id: newId(), client, date, venue, address, meals});
  }
  saveEvents(events);
  renderEvents();
  closeEventModal();
});

document.getElementById('deleteEventBtn').addEventListener('click', () => {
  const ev = events.find(e => e.id === editingId);
  if(!ev) return;
  if(!confirm('Delete the event for “' + ev.client + '”?')) return;
  const copy = JSON.parse(JSON.stringify(ev));
  events = events.filter(e => e.id !== editingId);
  saveEvents(events, true);
  renderEvents();
  closeEventModal();
  showToast('Event deleted.', () => { events.push(copy); saveEvents(events, true); renderEvents(); showToast('Event restored.'); });
});

/* ---------------- SHARED STORAGE: first load + keep open pages current ---------------- */
if(CLOUD){
  syncFromCloud();
  setInterval(() => { if(document.visibilityState === 'visible') syncFromCloud(); }, 90000);
  document.addEventListener('visibilitychange', () => { if(document.visibilityState === 'visible') syncFromCloud(); });
}
/* The date can roll over while a page stays open: refresh "Today" / past status when the tab comes back */
document.addEventListener('visibilitychange', () => { if(document.visibilityState === 'visible') renderEvents(); });
