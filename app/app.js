// Craft Hub desktop app — the interface. Data comes from crafthubs.net through the bridge (preload.js).
'use strict';
const B = window.craftHubApp;
const $ = s => document.querySelector(s);
const view = $('#view');
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- i18n ---------- */
let LANG = localStorage.getItem('lang') || 'he';
const I18N = {
  he: {
    home: 'בית', discover: 'גלה', library: 'ספרייה', play: 'שחק', servers: 'שרתים', settings: 'הגדרות', search: 'חיפוש מודים, טקסטורות, שיידרים…',
    login: 'התחברות', logout: 'התנתקות', guest: 'אורח', login_hint: 'התחבר כדי להצביע ולקבל התראות', all: 'הכל',
    install: 'התקנה', installed: 'מותקן', update: 'עדכון', installing: 'מתקין…', uninstall: 'הסרה', open_site: 'באתר', open_folder: 'פתח תיקייה',
    downloads: 'הורדות', by: 'מאת {x}', trending: 'טרנדי עכשיו', newest: 'חדש באתר', top_servers: 'שרתים מובילים', see_all: 'הכל ←',
    sort_downloads: 'הכי מורדים', sort_likes: 'הכי אהובים', sort_updated: 'עודכנו לאחרונה', sort_newest: 'חדשים', no_results: 'לא נמצאו תוצאות', results: '{x} תוצאות',
    description: 'תיאור', gallery: 'גלריה', changelog: 'שינויים', details: 'פרטים', version: 'גרסה', type: 'סוג', category: 'קטגוריה', updated: 'עודכן', file: 'קובץ', no_desc: 'אין תיאור.',
    offline: 'אין חיבור ל-Craft Hub — מציג מה שנשמר. מנסה שוב…', retry: 'נסה שוב',
    play_title: 'שחק מיינקראפט', play_btn: 'שחק', play_started: 'פותח את מיינקראפט עם {x} — לחץ Play בלאנצ׳ר', play_failed: 'לא הצלחתי לפתוח את מיינקראפט',
    mods_on: '{x} מודים פעילים', vanilla_mods: 'בגרסה רגילה המודים לא ייטענו — בחר Fabric / Forge', no_versions: 'לא נמצאו גרסאות — פתח את מיינקראפט פעם אחת או הוסף Fabric',
    add_loader: 'הוספת Fabric / Quilt', add_loader_sub: 'יוצר גרסה עם טוען מודים — הלאנצ׳ר הרשמי יוריד את השאר.', add: 'הוסף', loader_added: 'נוספה הגרסה {x} ✓', forge_hint: 'Forge ו-NeoForge מהאתר הרשמי:',
    my_mods: 'המודים שלי', mods_empty: 'אין מודים בתיקייה', from_app: 'הותקן דרך Craft Hub', nothing: 'עוד לא התקנת כלום', update_all: 'עדכן הכל', updates_n: '{x} עדכונים זמינים', up_to_date: 'הכל מעודכן ✓', updated_n: 'עודכנו {x} ✓',
    servers_sub: 'שרתי מיינקראפט מהקהילה — הצביעו וקבלו פרס במשחק', votes_month: 'הצבעות החודש', votes_total: 'סה״כ הצבעות', copy_ip: 'העתק IP', ip_copied: 'הכתובת הועתקה ✓', offline_srv: 'לא מחובר',
    vote: 'הצבעה', vote_for: 'הצבעה ל-{x}', mc_name: 'שם המשתמש במיינקראפט', vote_btn: 'הצבע!', vote_ok: 'ההצבעה נקלטה! 🎉', voted: 'הצבעת היום ✓', vote_again: 'אפשר להצביע שוב בעוד {x}', vote_login: 'צריך להתחבר כדי להצביע', top_voters: 'המצביעים המובילים', no_voters: 'עוד אין הצבעות',
    account: 'חשבון', language: 'שפה', mc_folder: 'תיקיית מיינקראפט', plugins_folder: 'תיקיית plugins של שרת', change: 'שינוי', app_version: 'גרסת האפליקציה', check_updates: 'בדיקת עדכונים', up_to_date_app: 'יש לך את הגרסה האחרונה ✓', update_found: 'נמצאה גרסה {x} — מורידה ברקע',
    website: 'האתר', discord: 'דיסקורד', notifications: 'התראות', no_notifs: 'אין התראות', mark_read: 'סמן הכל כנקרא',
    upd_available: 'עדכון זמין: v{x}', upd_days: 'נשארו {x} ימים לעדכן', upd_now: 'עדכן עכשיו', upd_downloading: 'מוריד… {x}%', install_ok: 'הותקן ✓', install_err: 'ההתקנה נכשלה', uninstalled: 'הוסר',
    confirm_uninstall: 'להסיר את {x}?', error: 'שגיאה', welcome: 'ברוך הבא{x} 👋', welcome_sub: 'מה משחקים היום?', mc_missing: 'תיקיית מיינקראפט לא נמצאה — בחר אותה בהגדרות',
    types: { plugin: 'פלאגינים', mod: 'מודים', resourcepack: 'טקסטורות', shader: 'שיידרים', datapack: 'דאטהפאקים', modpack: 'מודפאקים', world: 'עולמות' }
  },
  en: {
    home: 'Home', discover: 'Discover', library: 'Library', play: 'Play', servers: 'Servers', settings: 'Settings', search: 'Search mods, packs, shaders…',
    login: 'Sign in', logout: 'Sign out', guest: 'Guest', login_hint: 'Sign in to vote and get notifications', all: 'All',
    install: 'Install', installed: 'Installed', update: 'Update', installing: 'Installing…', uninstall: 'Remove', open_site: 'Website', open_folder: 'Open folder',
    downloads: 'downloads', by: 'by {x}', trending: 'Trending now', newest: 'New on Craft Hub', top_servers: 'Top servers', see_all: 'See all →',
    sort_downloads: 'Most downloaded', sort_likes: 'Most liked', sort_updated: 'Recently updated', sort_newest: 'Newest', no_results: 'No results', results: '{x} results',
    description: 'Description', gallery: 'Gallery', changelog: 'Changelog', details: 'Details', version: 'Version', type: 'Type', category: 'Category', updated: 'Updated', file: 'File', no_desc: 'No description.',
    offline: 'Can\'t reach Craft Hub — retrying…', retry: 'Retry',
    play_title: 'Play Minecraft', play_btn: 'Play', play_started: 'Opening Minecraft with {x} — press Play in the launcher', play_failed: 'Could not open Minecraft',
    mods_on: '{x} mods enabled', vanilla_mods: 'Vanilla won\'t load mods — pick Fabric / Forge', no_versions: 'No versions found — run Minecraft once or add Fabric',
    add_loader: 'Add Fabric / Quilt', add_loader_sub: 'Creates a mod-loader version — the official launcher downloads the rest.', add: 'Add', loader_added: 'Added {x} ✓', forge_hint: 'Forge & NeoForge from their sites:',
    my_mods: 'My mods', mods_empty: 'No mods in the folder', from_app: 'Installed with Craft Hub', nothing: 'Nothing installed yet', update_all: 'Update all', updates_n: '{x} updates available', up_to_date: 'Everything is up to date ✓', updated_n: 'Updated {x} ✓',
    servers_sub: 'Community Minecraft servers — vote and get in-game rewards', votes_month: 'Votes this month', votes_total: 'Total votes', copy_ip: 'Copy IP', ip_copied: 'Address copied ✓', offline_srv: 'Offline',
    vote: 'Vote', vote_for: 'Vote for {x}', mc_name: 'Minecraft username', vote_btn: 'Vote!', vote_ok: 'Vote counted! 🎉', voted: 'You voted today ✓', vote_again: 'Vote again in {x}', vote_login: 'Sign in to vote', top_voters: 'Top voters', no_voters: 'No votes yet',
    account: 'Account', language: 'Language', mc_folder: 'Minecraft folder', plugins_folder: 'Server plugins folder', change: 'Change', app_version: 'App version', check_updates: 'Check for updates', up_to_date_app: 'You have the latest version ✓', update_found: 'Version {x} found — downloading',
    website: 'Website', discord: 'Discord', notifications: 'Notifications', no_notifs: 'No notifications', mark_read: 'Mark all read',
    upd_available: 'Update available: v{x}', upd_days: '{x} days left to update', upd_now: 'Update now', upd_downloading: 'Downloading… {x}%', install_ok: 'Installed ✓', install_err: 'Install failed', uninstalled: 'Removed',
    confirm_uninstall: 'Remove {x}?', error: 'Error', welcome: 'Welcome{x} 👋', welcome_sub: 'What are we playing today?', mc_missing: 'Minecraft folder not found — pick it in Settings',
    types: { plugin: 'Plugins', mod: 'Mods', resourcepack: 'Texture packs', shader: 'Shaders', datapack: 'Datapacks', modpack: 'Modpacks', world: 'Worlds' }
  }
};
const t = (k, x) => String((I18N[LANG] && I18N[LANG][k]) || I18N.he[k] || k).replace('{x}', x == null ? '' : x);
const typeName = tp => (I18N[LANG].types || {})[tp] || tp;
function applyLang() { document.documentElement.lang = LANG; document.documentElement.dir = LANG === 'he' ? 'rtl' : 'ltr'; $('#searchIn').placeholder = t('search'); }

/* ---------- icons ---------- */
const ICONS = {
  home: '<path d="M3 11 12 3l9 8v10H3Z"/>', grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5Z"/><path d="m3 8 9 5 9-5M12 13v8"/>', play: '<path d="M7 4v16l13-8Z"/>', globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', back: '<path d="M15 18l-6-6 6-6"/>', fwd: '<path d="m9 18 6-6-6-6"/>', bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>', check: '<path d="M20 6 9 17l-5-5"/>', trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
  ext: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>', heart: '<path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.3 3 4.5 6.7 4.5c2.1 0 3.6 1.1 5.3 3 1.7-1.9 3.2-3 5.3-3 3.7 0 5.8 3.8 4.3 7.3C19.5 16.4 12 21 12 21Z"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/>', copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>', refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', flame: '<path d="M12 22c4 0 7-2.8 7-7 0-4.5-3.5-7-4.5-11-2 1.5-3.5 4-3.5 6.5-1-1-1.5-2.3-1.5-3.5C7 9 5 11.8 5 15c0 4.2 3 7 7 7Z"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>', crown: '<path d="M3 7l4 4 5-7 5 7 4-4-2 12H5Z"/>', logout: '<path d="M15 4h4v16h-4M10 17l5-5-5-5M15 12H3"/>', wifi: '<path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01M2 9a15 15 0 0 1 20 0"/>'
};
const ic = (n, c = '') => `<svg class="i ${c}" viewBox="0 0 24 24">${ICONS[n] || ''}</svg>`;
const flip = () => LANG === 'he' ? 'fwd' : 'back';

/* ---------- helpers ---------- */
function toast(msg, type) { const el = document.createElement('div'); el.className = 'toast ' + (type || ''); el.textContent = msg; $('#toasts').appendChild(el); setTimeout(() => el.remove(), 3400); }
const fmtNum = n => { n = Number(n || 0); return n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e4 ? Math.round(n / 1e3) + 'k' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'k' : String(n); };
const fmtSize = b => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB';
const fmtDate = ms => ms ? new Date(ms).toLocaleDateString(LANG === 'he' ? 'he-IL' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
function timeAgo(ms) { const s = (Date.now() - ms) / 1000, rtf = new Intl.RelativeTimeFormat(LANG === 'he' ? 'he' : 'en', { numeric: 'auto' }); if (s < 60) return rtf.format(0, 'second'); if (s < 3600) return rtf.format(-Math.floor(s / 60), 'minute'); if (s < 86400) return rtf.format(-Math.floor(s / 3600), 'hour'); if (s < 2592000) return rtf.format(-Math.floor(s / 86400), 'day'); return fmtDate(ms); }
const siteImg = u => !u ? '' : /^https:\/\//.test(u) ? u : /^\/(icons|public)\//.test(u) ? B.site + u : '';
const pic = (p, cls = '') => { const u = siteImg(p.icon); return `<div class="pic ${cls}">${u ? `<img src="${esc(u)}" alt="" loading="lazy">` : esc((p.name || '?').charAt(0).toUpperCase())}</div>`; };
async function api(path, opts = {}) {
  const r = await B.api(path, opts);
  if (r.status === 0) { setOffline(true); throw new Error('offline'); }
  setOffline(false);
  if (r.status >= 400) throw Object.assign(new Error((r.data && r.data.error) || t('error')), { status: r.status, data: r.data });
  return r.data;
}
let offline = false;
function setOffline(v) { if (offline === v) return; offline = v; const el = $('#offlineBar'); if (el) el.hidden = !v; }
// safe markdown: everything is escaped first, then a few patterns become tags
function md(src) {
  const blocks = [];
  let s = esc(src || '').replace(/```([\s\S]*?)```/g, (m, c) => { blocks.push(`<pre><code>${c.replace(/^\w*\n/, '')}</code></pre>`); return `\u0000${blocks.length - 1}\u0000`; });
  s = s.replace(/^### (.*)$/gm, '<h3>$1</h3>').replace(/^## (.*)$/gm, '<h2>$1</h2>').replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/!\[([^\]]*)\]\((https:\/\/[^\s)]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a data-ext="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<i>$2</i>').replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/^(?:[-*] .*(?:\n|$))+/gm, m => `<ul>${m.trim().split('\n').map(l => `<li>${l.replace(/^[-*] /, '')}</li>`).join('')}</ul>`);
  s = s.split(/\n{2,}/).map(p => /^\s*<(h\d|ul|pre)/.test(p) || /^\u0000/.test(p) ? p : `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  return s.replace(/\u0000(\d+)\u0000/g, (m, i) => blocks[i]);
}
const emptyBox = (icon, title, sub = '') => `<div class="empty">${ic(icon)}<b>${esc(title)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}</div>`;

/* ---------- state ---------- */
const S = { me: null, site: {}, projects: null, projectsAt: 0, installed: {}, route: 'home', params: {}, history: [] };
async function loadProjects(force) {
  if (!force && S.projects && Date.now() - S.projectsAt < 300000) return S.projects;
  try { S.projects = await api('/api/projects'); S.projectsAt = Date.now(); localStorage.setItem('cache_projects', JSON.stringify(S.projects)); }
  catch { if (!S.projects) { try { S.projects = JSON.parse(localStorage.getItem('cache_projects') || '[]'); } catch { S.projects = []; } } }
  return S.projects;
}
async function refreshInstalled() { try { S.installed = await B.installed(); } catch { S.installed = {}; } return S.installed; }
const APP_TYPES = ['mod', 'resourcepack', 'shader', 'datapack', 'world', 'plugin', 'modpack'];
function installState(p) {
  const x = S.installed[p.slug];
  if (!x) return 'none';
  return p.file && p.file.name && p.file.name !== x.file ? 'update' : 'installed';
}
function installBtn(p, cls = 'sm') {
  if (!APP_TYPES.includes(p.type || 'plugin') || !p.file) return "";
  const st = installState(p);
  return st === 'installed' ? `<button class="btn ${cls} ok" data-inst="${esc(p.slug)}">${ic('check', 'sm')} ${t('installed')}</button>`
    : `<button class="btn ${cls} primary" data-inst="${esc(p.slug)}">${ic('download', 'sm')} ${st === 'update' ? t('update') : t('install')}</button>`;
}
async function doInstall(slug, btn) {
  const p = (S.projects || []).find(x => x.slug === slug) || (S.params.project && S.params.project.slug === slug ? S.params.project : null);
  if (!p) return;
  if (installState(p) === 'installed') { go('project', { slug }); return; }
  const orig = btn.innerHTML;
  btn.disabled = true; btn.innerHTML = `${ic('download', 'sm')} ${t('installing')}`;
  const off = B.onProgress(d => { if (d.slug === slug) btn.innerHTML = `${ic('download', 'sm')} ${Math.round(d.progress * 100)}%`; });
  try {
    const r = await B.install({ slug, type: p.type || 'plugin', name: p.name });
    if (r.ok) { await refreshInstalled(); toast(t('install_ok')); btn.outerHTML = installBtn(p, btn.classList.contains('lg') ? 'lg' : 'sm'); bindCommon(); }
    else { btn.disabled = false; btn.innerHTML = orig; }
  } catch { btn.disabled = false; btn.innerHTML = orig; toast(t('install_err'), 'err'); }
  off();
}
function bindCommon(root = document) {
  root.querySelectorAll('[data-inst]').forEach(b => { if (b._b) return; b._b = 1; b.onclick = e => { e.stopPropagation(); doInstall(b.dataset.inst, b); }; });
  root.querySelectorAll('[data-site]').forEach(b => { if (b._b) return; b._b = 1; b.onclick = e => { e.stopPropagation(); B.openExternal(B.site + b.dataset.site); }; });
  root.querySelectorAll('[data-ext]').forEach(a => { if (a._b) return; a._b = 1; a.onclick = e => { e.preventDefault(); B.openExternal(a.dataset.ext); }; });
  root.querySelectorAll('[data-go]').forEach(a => { if (a._b) return; a._b = 1; a.onclick = e => { e.preventDefault(); const [r, k, v] = a.dataset.go.split(':'); go(r, k ? { [k]: v } : {}); }; });
  root.querySelectorAll('[data-copy]').forEach(b => { if (b._b) return; b._b = 1; b.onclick = e => { e.stopPropagation(); navigator.clipboard.writeText(b.dataset.copy).then(() => toast(t('ip_copied'))); }; });
}
function projectCard(p) {
  return `<div class="pcard" data-go="project:slug:${esc(p.slug)}">
    <div class="top">${pic(p)}<div style="min-width:0"><b>${esc(p.name)}</b><div class="by">${p.owner && p.owner.name ? esc(t('by', p.owner.name)) : esc(typeName(p.type || 'plugin'))}</div></div></div>
    <p>${esc(p.short || '')}</p>
    <div class="foot"><span class="stat">${ic('download', 'sm')} ${fmtNum(p.downloads)}</span>${p.likes ? `<span class="stat">${ic('heart', 'sm')} ${fmtNum(p.likes)}</span>` : ''}${installBtn(p)}</div>
  </div>`;
}

/* ---------- router ---------- */
const NAV = [['home', 'home'], ['discover', 'grid'], ['library', 'box'], ['servers', 'globe']];
function renderNav() {
  const r = S.route === 'project' ? 'discover' : S.route === 'server' ? 'servers' : S.route;
  $('#nav').innerHTML = NAV.map(([k, i]) => `<a href="#" data-go="${k}" class="${r === k ? 'on' : ''}">${ic(i)} ${t(k)}</a>`).join('');
  const u = S.me && S.me.user;
  $('#sideBottom').innerHTML = `
    <a href="#" data-go="settings" style="display:flex;align-items:center;gap:12px;height:40px;padding:0 12px;border-radius:11px;color:var(--text-2);font-weight:600" class="${r === 'settings' ? 'on' : ''}">${ic('settings')} ${t('settings')}</a>
    ${u ? `<div class="acct" data-go="settings"><img src="${esc(siteImg(u.avatar) || u.avatar || '')}" alt=""><div style="min-width:0"><b>${esc(u.globalName || u.username || '')}</b><small>Craft Hub</small></div></div>`
      : `<button class="btn primary" id="loginBtn">${ic('user', 'sm')} ${t('login')}</button>`}`;
  const lb = $('#loginBtn'); if (lb) lb.onclick = doLogin;
  bindCommon($('#side'));
}
function go(route, params = {}, noHistory) {
  if (!noHistory && (S.route !== route || JSON.stringify(S.params) !== JSON.stringify(params))) S.history.push([S.route, S.params]);
  S.route = route; S.params = params;
  $('#backBtn').disabled = !S.history.length;
  renderNav();
  view.scrollTop = 0;
  view.innerHTML = '<div class="spin"></div>';
  const fn = { home: vHome, discover: vDiscover, project: vProject, library: vLibrary, servers: vServers, server: vServer, settings: vSettings }[route] || vHome;
  const seq = ++go.seq;
  Promise.resolve(fn(params, () => seq !== go.seq)).catch(err => { if (seq === go.seq) view.innerHTML = `<div class="view-in">${emptyBox('wifi', t('error'), err.message)}</div>`; });
}
go.seq = 0;
const put = html => { view.innerHTML = `<div class="view-in"><div class="offline" id="offlineBar" ${offline ? '' : 'hidden'}>${ic('wifi')} ${t('offline')}</div>${html}</div>`; bindCommon(view); };

/* ---------- views ---------- */
async function vHome(p, stale) {
  const [projects, srv] = await Promise.all([loadProjects(), api('/api/servers').catch(() => ({ servers: [] })), refreshInstalled()]);
  if (stale()) return;
  const trending = projects.slice().sort((a, b) => (b.week || 0) - (a.week || 0) || (b.downloads || 0) - (a.downloads || 0)).slice(0, 6);
  const newest = projects.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
  const u = S.me && S.me.user;
  put(`
    <div class="play-hero" style="margin-bottom:6px">
      <h1>${esc(t('welcome', u ? ', ' + (u.globalName || u.username) : ''))}</h1>
      <p class="faint" style="margin:-10px 0 18px">${t('welcome_sub')}</p>
      <div class="row"><button class="btn primary lg" data-go="library">${ic('box', 'sm')} ${t('library')}</button><button class="btn lg" data-go="discover">${ic('grid', 'sm')} ${t('discover')}</button></div>
    </div>
    <div class="section"><div class="section-h">${ic('flame')}<h2>${t('trending')}</h2><span class="spacer"></span><a class="link" data-go="discover">${t('see_all')}</a></div><div class="grid">${trending.map(projectCard).join('')}</div></div>
    <div class="section"><div class="section-h">${ic('sparkle')}<h2>${t('newest')}</h2></div><div class="grid">${newest.map(projectCard).join('')}</div></div>
    ${(srv.servers || []).length ? `<div class="section"><div class="section-h">${ic('globe')}<h2>${t('top_servers')}</h2><span class="spacer"></span><a class="link" data-go="servers">${t('see_all')}</a></div><div class="stack" style="gap:10px">${srv.servers.slice(0, 3).map(serverRow).join('')}</div></div>` : ''}`);
}

let DISC = { type: '', q: '', sort: 'downloads', cat: '' };
async function vDiscover(p, stale) {
  if (p.q !== undefined) DISC.q = p.q;
  if (p.type !== undefined) DISC.type = p.type;
  const projects = await loadProjects();
  await refreshInstalled();
  if (stale()) return;
  const types = Object.keys(S.site.projectTypes || { plugin: 1, mod: 1, resourcepack: 1, shader: 1 });
  const cats = DISC.type ? ((S.site.projectTypes || {})[DISC.type] || {}).categories || [] : [];
  const draw = () => {
    const q = DISC.q.toLowerCase().trim();
    const sorters = { downloads: (a, b) => (b.downloads || 0) - (a.downloads || 0), likes: (a, b) => (b.likes || 0) - (a.likes || 0), updated: (a, b) => b.updatedAt - a.updatedAt, newest: (a, b) => b.createdAt - a.createdAt };
    const list = projects.filter(x => (!DISC.type || (x.type || 'plugin') === DISC.type) && (!DISC.cat || x.category === DISC.cat) && (!q || `${x.name} ${x.short} ${(x.tags || []).join(' ')} ${(x.genres || []).join(' ')} ${x.owner && x.owner.name}`.toLowerCase().includes(q))).sort(sorters[DISC.sort]);
    $('#dCount').textContent = t('results', list.length);
    $('#dGrid').innerHTML = list.length ? list.map(projectCard).join('') : emptyBox('search', t('no_results'));
    bindCommon($('#dGrid'));
  };
  put(`
    <div class="head"><h1>${t('discover')}</h1></div>
    <div class="tabs">${['', ...types].map(tp => `<button data-type="${tp}" class="${tp === DISC.type ? 'on' : ''}">${tp ? esc(typeName(tp)) : t('all')}</button>`).join('')}</div>
    <div class="filters"><select id="dSort">${['downloads', 'likes', 'updated', 'newest'].map(s => `<option value="${s}" ${s === DISC.sort ? 'selected' : ''}>${t('sort_' + s)}</option>`).join('')}</select><span class="faint" id="dCount"></span></div>
    ${cats.length ? `<div class="chips">${['', ...cats].map(c => `<button data-cat="${esc(c)}" class="${c === DISC.cat ? 'on' : ''}">${c ? esc(c) : t('all')}</button>`).join('')}</div>` : ''}
    <div class="grid" id="dGrid"></div>`);
  $('#searchIn').value = DISC.q;
  view.querySelectorAll('[data-type]').forEach(b => b.onclick = () => { DISC.type = b.dataset.type; DISC.cat = ''; go('discover', {}, true); });
  view.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => { DISC.cat = b.dataset.cat; view.querySelectorAll('[data-cat]').forEach(x => x.classList.toggle('on', x === b)); draw(); });
  $('#dSort').onchange = e => { DISC.sort = e.target.value; draw(); };
  draw();
}

async function vProject({ slug }, stale) {
  const [p] = await Promise.all([api('/api/projects/' + encodeURIComponent(slug)), refreshInstalled()]);
  if (stale()) return;
  S.params.project = p;
  let tab = 'desc';
  const inst = S.installed[p.slug];
  put(`
    <section class="phead">
      ${pic(p, 'xl')}
      <div class="meta">
        <h1>${esc(p.name)}</h1>
        <div class="sub">${esc(p.short || '')}</div>
        <div class="row" style="gap:12px;flex-wrap:wrap;font-size:13.5px;color:var(--text-2)">
          <span class="stat">${ic('download', 'sm')} <b>${fmtNum(p.downloads)}</b> ${t('downloads')}</span>
          ${p.likes ? `<span class="stat">${ic('heart', 'sm')} ${fmtNum(p.likes)}</span>` : ''}
          <span class="chip accent">${esc(typeName(p.type || 'plugin'))}</span>${p.category ? `<span class="chip">${esc(p.category)}</span>` : ''}
          ${p.owner && p.owner.name ? `<a class="link" data-go="user:id:${esc(p.owner.id)}">${esc(t('by', p.owner.name))}</a>` : ''}
        </div>
      </div>
      <div class="acts">
        ${installBtn(p, 'lg')}
        ${inst ? `<button class="btn lg" id="unBtn" title="${t('uninstall')}">${ic('trash', 'sm')}</button><button class="btn lg" id="folderBtn" title="${t('open_folder')}">${ic('folder', 'sm')}</button>` : ''}
      </div>
    </section>
    <div class="play-layout">
      <div>
        <div class="tabs"><button data-t="desc" class="on">${t('description')}</button>${(p.gallery || []).length ? `<button data-t="gal">${t('gallery')} <span class="faint">${p.gallery.length}</span></button>` : ''}${(p.changelog || []).length ? `<button data-t="log">${t('changelog')}</button>` : ''}</div>
        <div class="card card-b" id="ptab"></div>
      </div>
      <aside class="card card-b meta-list">
        <div><span>${t('version')}</span><b class="mono">${esc(p.version || '—')}</b></div>
        <div><span>${t('type')}</span><b>${esc(typeName(p.type || 'plugin'))}</b></div>
        ${p.mcVersion ? `<div><span>Minecraft</span><b class="mono">${esc(p.mcVersion)}</b></div>` : ''}
        ${p.file ? `<div><span>${t('file')}</span><b class="mono" style="font-size:12px">${fmtSize(p.file.size || 0)}</b></div>` : ''}
        <div><span>${t('updated')}</span><b>${fmtDate(p.updatedAt)}</b></div>
        ${inst ? `<div><span>${t('installed')}</span><b class="mono ltr" style="font-size:11.5px">${esc(inst.file)}</b></div>` : ''}
      </aside>
    </div>`);
  const drawTab = () => {
    view.querySelectorAll('[data-t]').forEach(b => b.classList.toggle('on', b.dataset.t === tab));
    $('#ptab').innerHTML = tab === 'gal' ? `<div class="gallery">${p.gallery.map((g, i) => `<img src="${esc(siteImg(g.url || g))}" data-zoom="${i}" alt="">`).join('')}</div>`
      : tab === 'log' ? `<div class="md">${p.changelog.map(c => `<h3 class="mono">v${esc(c.version)} <span class="faint" style="font-size:12px;font-weight:400">${fmtDate(c.at)}</span></h3>${c.notes ? md(c.notes) : ''}`).join('')}</div>`
      : `<div class="md">${p.description ? md(p.description) : `<p class="faint">${t('no_desc')}</p>`}</div>`;
    $('#ptab').querySelectorAll('[data-zoom]').forEach(img => img.onclick = () => { const m = document.createElement('div'); m.className = 'modal-back'; m.innerHTML = `<img src="${esc(img.src)}" alt="">`; m.onclick = () => m.remove(); document.body.appendChild(m); });
    bindCommon($('#ptab'));
  };
  view.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { tab = b.dataset.t; drawTab(); });
  drawTab();
  const un = $('#unBtn');
  if (un) un.onclick = async () => { if (!confirm(t('confirm_uninstall', p.name))) return; await B.uninstall({ slug: p.slug, type: inst.type }); toast(t('uninstalled')); go('project', { slug }, true); };
  const fb = $('#folderBtn'); if (fb) fb.onclick = () => B.openFolder(inst.type);
}

async function vLibrary(p, stale) {
  const [projects, mods] = await Promise.all([loadProjects(), B.modsList(), refreshInstalled()]);
  if (stale()) return;
  const bySlug = Object.fromEntries(projects.map(x => [x.slug, x]));
  const rows = Object.entries(S.installed).map(([slug, x]) => ({ slug, ...x, p: bySlug[slug] }));
  const upd = rows.filter(r => r.p && installState(r.p) === 'update');
  const on = mods.filter(m => m.enabled).length;
  put(`
    <div class="head"><h1>${t('library')}</h1><span class="spacer"></span>${upd.length ? `<button class="btn primary" id="updAll">${ic('refresh', 'sm')} ${t('update_all')} (${upd.length})</button>` : `<span class="chip">${ic('check', 'sm')} ${t('up_to_date')}</span>`}</div>
    <div class="play-layout">
      <div class="card"><div class="card-h">${ic('box')}<h3>${t('from_app')}</h3><span class="faint">${rows.length}</span></div><div class="card-b">
        ${rows.length ? rows.map(r => `<div class="lrow" ${r.p ? `data-go="project:slug:${esc(r.slug)}" style="cursor:pointer"` : ''}>${r.p ? pic(r.p, 'sm') : ''}<div style="flex:1;min-width:0"><b>${esc(r.p ? r.p.name : r.slug)}</b><div class="faint mono ltr" style="font-size:11.5px">${esc(r.file)}</div></div><span class="chip">${esc(typeName(r.type))}</span>${r.p && installState(r.p) === 'update' ? `<span class="chip accent">${t('update')}</span>` : ''}</div>`).join('') : emptyBox('box', t('nothing'))}
      </div></div>
      <div class="card"><div class="card-h">${ic('grid')}<h3>${t('my_mods')}</h3><span class="faint">${on}/${mods.length}</span><span class="spacer"></span><button class="icon-btn" id="modsFolder" title="${t('open_folder')}">${ic('folder', 'sm')}</button></div><div class="card-b">
        ${mods.length ? mods.map(m => `<div class="lrow ${m.enabled ? '' : 'off'}"><label class="tgl"><input type="checkbox" data-mod="${esc(m.file)}" ${m.enabled ? 'checked' : ''}><span></span></label><div style="flex:1;min-width:0"><b class="mono ltr">${esc(m.name)}</b><div class="faint" style="font-size:12px">${fmtSize(m.size)}</div></div></div>`).join('') : emptyBox('grid', t('mods_empty'))}
      </div></div>
    </div>`);
  view.querySelectorAll('[data-mod]').forEach(c => c.onchange = async () => { await B.modsToggle(c.dataset.mod); go('library', {}, true); });
  $('#modsFolder').onclick = () => B.openFolder('mod');
  const ua = $('#updAll');
  if (ua) ua.onclick = async () => {
    ua.disabled = true; let n = 0;
    for (const r of upd) { ua.innerHTML = `${ic('download', 'sm')} ${n + 1}/${upd.length}`; try { if ((await B.install({ slug: r.slug, type: r.type, name: r.p.name })).ok) n++; } catch { } }
    toast(t('updated_n', n)); go('library', {}, true);
  };
}

function serverRow(s) {
  const icon = siteImg(s.icon);
  return `<div class="srv" data-go="server:slug:${esc(s.slug)}"><div class="rank ${s.rank <= 3 ? 't' + s.rank : ''}">#${s.rank}</div>
    <div class="pic">${icon ? `<img src="${esc(icon)}" alt="">` : esc((s.name || '?').charAt(0))}</div>
    <div class="body"><div class="row" style="gap:8px"><b>${esc(s.name)}</b>${s.version ? `<span class="chip mono">${esc(s.version)}</span>` : ''}</div><p>${esc(s.short || '')}</p></div>
    <button class="btn sm mono ltr" data-copy="${esc(s.address)}">${ic('copy', 'sm')} ${esc(s.address)}</button>
    <div class="votes"><b>${fmtNum(s.votesMonth)}</b><span>${t('votes_month')}</span></div></div>`;
}
async function vServers(p, stale) {
  const data = await api('/api/servers');
  if (stale()) return;
  put(`<div class="head"><div><h1>${t('servers')}</h1><p>${t('servers_sub')}</p></div></div>
    <div class="stack" style="gap:10px">${data.servers.length ? data.servers.map(serverRow).join('') : emptyBox('globe', t('no_results'))}</div>`);
}
async function vServer({ slug }, stale) {
  const s = await api('/api/servers/' + encodeURIComponent(slug));
  const status = api(`/api/servers/${encodeURIComponent(slug)}/status`).catch(() => ({}));
  if (stale()) return;
  const banner = siteImg(s.banner), icon = siteImg(s.icon);
  let board = 'topMonth';
  const leftTxt = ms => { const h = Math.floor(ms / 3600000), m = Math.ceil(ms % 3600000 / 60000); return h ? `${h}h ${m}m` : `${m}m`; };
  const voteBox = () => {
    if (!S.me || !S.me.user) return `<p class="faint" style="margin:0 0 10px">${t('vote_login')}</p><button class="btn primary" id="vLogin">${ic('user', 'sm')} ${t('login')}</button>`;
    const left = (s.nextVoteAt || 0) - Date.now();
    if (left > 0) return `<div class="empty" style="padding:10px">${ic('check')}<b>${t('voted')}</b><span>${t('vote_again', leftTxt(left))}</span></div>`;
    return `<form id="vForm" class="stack" style="gap:10px"><label class="faint" style="font-size:13px">${t('mc_name')}</label><input type="text" name="u" class="ltr" maxlength="17" required value="${esc(s.mcName || '')}" placeholder="Steve"><button class="btn primary lg">${ic('star', 'sm')} ${t('vote_btn')}</button></form>`;
  };
  const boardHtml = () => { const list = s[board] || []; return list.length ? `<ol class="voters">${list.map((v, i) => `<li><b style="width:20px;color:var(--accent)">${i + 1}</b><img src="https://mc-heads.net/avatar/${encodeURIComponent(v.name)}/26" alt=""><span class="mono">${esc(v.name)}</span><span class="spacer"></span><span class="faint">${fmtNum(v.votes)}</span></li>`).join('')}</ol>` : `<p class="faint" style="margin:0">${t('no_voters')}</p>`; };
  put(`
    <section class="srv-hero ${banner ? 'banner' : ''}" ${banner ? `style="background-image:url('${esc(banner)}')"` : ''}><div class="in">
      <div class="pic xl">${icon ? `<img src="${esc(icon)}" alt="">` : esc(s.name.charAt(0))}</div>
      <div style="flex:1;min-width:0"><div class="row" style="gap:10px;flex-wrap:wrap"><h1>${esc(s.name)}</h1>${s.rank ? `<span class="chip accent">#${s.rank}</span>` : ''}${s.veteran ? `<span class="chip accent">${ic('crown', 'sm')}</span>` : ''}</div>
        <p class="faint" style="margin:6px 0 12px">${esc(s.short || '')}</p>
        <div class="row" style="flex-wrap:wrap"><button class="btn mono ltr" data-copy="${esc(s.address)}">${ic('copy', 'sm')} ${esc(s.address)}</button><span class="row" id="stat" style="gap:6px;font-size:13px"></span>${s.discord ? `<button class="btn" data-ext="${esc(s.discord)}">${t('discord')}</button>` : ''}${s.website ? `<button class="btn" data-ext="${esc(s.website)}">${ic('ext', 'sm')} ${t('website')}</button>` : ''}</div></div>
    </div></section>
    <div class="play-layout">
      <div class="card card-b"><div class="md">${s.description ? md(s.description) : `<p class="faint">${t('no_desc')}</p>`}</div></div>
      <aside class="stack">
        <div class="card" style="border-color:var(--accent-line)"><div class="card-h">${ic('star')}<h3>${esc(t('vote_for', s.name))}</h3></div><div class="card-b" id="vBox">${voteBox()}</div></div>
        <div class="card card-b meta-list"><div><span>${t('votes_month')}</span><b id="vm">${fmtNum(s.votesMonth)}</b></div><div><span>${t('votes_total')}</span><b>${fmtNum(s.votesTotal)}</b></div></div>
        <div class="card"><div class="card-h">${ic('crown')}<h3>${t('top_voters')}</h3></div><div class="card-b"><div class="tabs" style="margin-bottom:10px"><button data-b="topMonth" class="on">${t('votes_month')}</button><button data-b="topAll">${t('votes_total')}</button></div><div id="board">${boardHtml()}</div></div></div>
      </aside>
    </div>`);
  status.then(r => { const el = $('#stat'); if (el) el.innerHTML = r.online ? `<span class="dot on"></span>${fmtNum(r.players)}/${fmtNum(r.max)}` : `<span class="dot"></span>${t('offline_srv')}`; });
  view.querySelectorAll('[data-b]').forEach(b => b.onclick = () => { board = b.dataset.b; view.querySelectorAll('[data-b]').forEach(x => x.classList.toggle('on', x === b)); $('#board').innerHTML = boardHtml(); });
  const bind = () => {
    const l = $('#vLogin'); if (l) l.onclick = async () => { await doLogin(); go('server', { slug }, true); };
    const f = $('#vForm');
    if (f) f.onsubmit = async e => {
      e.preventDefault(); const btn = f.querySelector('button'); btn.disabled = true;
      try { const r = await api(`/api/servers/${encodeURIComponent(slug)}/vote`, { method: 'POST', body: { username: f.u.value.trim() } }); s.nextVoteAt = r.nextVoteAt; $('#vm').textContent = fmtNum(r.votesMonth); toast(t('vote_ok')); $('#vBox').innerHTML = voteBox(); }
      catch (err) { toast(err.message, 'err'); btn.disabled = false; }
    };
  };
  bind();
}

async function vSettings(p, stale) {
  const s = await B.settings();
  if (stale()) return;
  const u = S.me && S.me.user;
  put(`
    <div class="head"><h1>${t('settings')}</h1></div>
    <div class="stack" style="max-width:760px">
      <div class="card"><div class="card-h">${ic('user')}<h3>${t('account')}</h3></div><div class="card-b row">
        ${u ? `<img src="${esc(siteImg(u.avatar) || u.avatar || '')}" alt="" style="width:44px;height:44px;border-radius:50%"><div style="flex:1"><b>${esc(u.globalName || u.username)}</b><div class="faint" style="font-size:12.5px">crafthubs.net</div></div><button class="btn danger" id="outBtn">${ic('logout', 'sm')} ${t('logout')}</button>`
          : `<div style="flex:1" class="faint">${t('login_hint')}</div><button class="btn primary" id="inBtn">${ic('user', 'sm')} ${t('login')}</button>`}
      </div></div>
      <div class="card"><div class="card-h">${ic('globe')}<h3>${t('language')}</h3></div><div class="card-b"><div class="tabs" style="margin:0"><button data-lang="he" class="${LANG === 'he' ? 'on' : ''}">עברית</button><button data-lang="en" class="${LANG === 'en' ? 'on' : ''}">English</button></div></div></div>
      <div class="card"><div class="card-h">${ic('folder')}<h3>${t('mc_folder')}</h3></div><div class="card-b stack" style="gap:10px">
        <div class="row"><input type="text" readonly class="mono ltr" value="${esc(s.mcDir)}" style="font-size:12.5px"><button class="btn" id="mcDir">${t('change')}</button><button class="btn" data-open="minecraft">${ic('folder', 'sm')}</button></div>
        ${s.mcExists ? '' : `<span style="color:var(--warn);font-size:13px">${t('mc_missing')}</span>`}
        <div class="faint" style="font-size:12.5px">${t('plugins_folder')}</div>
        <div class="row"><input type="text" readonly class="mono ltr" value="${esc(s.pluginsDir || '—')}" style="font-size:12.5px"><button class="btn" id="plDir">${t('change')}</button></div>
      </div></div>
      <div class="card"><div class="card-h">${ic('refresh')}<h3>${t('app_version')}</h3><span class="chip mono">v${esc(s.version)}</span></div><div class="card-b row" style="flex-wrap:wrap">
        <button class="btn" id="updBtn">${ic('refresh', 'sm')} ${t('check_updates')}</button><button class="btn" data-ext="https://discord.gg/ZW4uCt4yQ">${t('discord')}</button>
      </div></div>
    </div>`);
  const i = $('#inBtn'); if (i) i.onclick = async () => { await doLogin(); go('settings', {}, true); };
  const o = $('#outBtn'); if (o) o.onclick = async () => { await B.logout(); await loadMe(); go('settings', {}, true); };
  view.querySelectorAll('[data-lang]').forEach(b => b.onclick = () => { LANG = b.dataset.lang; localStorage.setItem('lang', LANG); applyLang(); go('settings', {}, true); });
  view.querySelectorAll('[data-open]').forEach(b => b.onclick = () => B.openFolder(b.dataset.open));
  $('#mcDir').onclick = async () => { await B.chooseDir('minecraft'); go('settings', {}, true); };
  $('#plDir').onclick = async () => { await B.chooseDir('plugins'); go('settings', {}, true); };
  $('#updBtn').onclick = async () => { const r = await B.checkUpdate(); toast(r.dev ? 'dev build' : r.error ? t('error') : r.version && r.version !== s.version ? t('update_found', r.version) : t('up_to_date_app')); };
}

/* ---------- account + notifications ---------- */
async function loadMe() { try { S.me = await api('/api/me'); } catch { S.me = S.me || null; } renderNav(); drawBell(); if (typeof maintStaffBar === 'function') maintStaffBar(); }
async function doLogin() { const ok = await B.login(); if (ok) { await loadMe(); toast('✓'); } return ok; }
function drawBell() {
  const n = (S.me && S.me.counts && S.me.counts.notifications) || 0;
  $('#bellBtn').innerHTML = ic('bell') + (n ? `<span class="bell-dot">${n > 9 ? '9+' : n}</span>` : '');
  $('#bellBtn').style.display = S.me && S.me.user ? '' : 'none';
}
$('#bellBtn').onclick = async e => {
  e.stopPropagation();
  const m = $('#notifMenu');
  if (m.classList.toggle('open')) {
    m.innerHTML = '<div class="spin" style="margin:20px auto;width:24px;height:24px"></div>';
    const list = await api('/api/notifications').catch(() => []);
    m.innerHTML = `<div class="card-h"><b>${t('notifications')}</b><span class="spacer"></span>${list.some(x => !x.read) ? `<a class="link" id="readAll">${t('mark_read')}</a>` : ''}</div>`
      + (list.length ? list.map(x => `<div class="notif ${x.read ? '' : 'unread'}" data-l="${esc(x.link || '')}" data-id="${esc(x.id)}"><div><b>${esc(LANG === 'en' && x.textEn ? x.textEn : x.text)}</b><small>${timeAgo(x.at)}</small></div></div>`).join('') : `<div class="empty" style="padding:24px">${t('no_notifs')}</div>`);
    const ra = $('#readAll'); if (ra) ra.onclick = async ev => { ev.stopPropagation(); await api('/api/notifications/read', { method: 'POST', body: {} }).catch(() => { }); m.classList.remove('open'); loadMe(); };
    m.querySelectorAll('.notif').forEach(el => el.onclick = async () => {
      m.classList.remove('open');
      api('/api/notifications/read', { method: 'POST', body: { ids: [el.dataset.id] } }).then(loadMe).catch(() => { });
      openLink(el.dataset.l);
    });
  }
};
document.addEventListener('click', () => $('#notifMenu').classList.remove('open'));
function openLink(l) {
  const mp = String(l || '').match(/^\/project\/([\w-]+)/), ms = String(l || '').match(/^\/server\/([\w-]+)/);
  if (mp) go('project', { slug: mp[1] }); else if (ms) go('server', { slug: ms[1] });
}
setInterval(async () => {
  if (!S.me || !S.me.user) return;
  const before = (S.me.counts || {}).notifications || 0;
  await loadMe();
  const now = (S.me.counts || {}).notifications || 0;
  if (now > before) {
    try { const n = (await api('/api/notifications')).find(x => !x.read); if (n) { const text = LANG === 'en' && n.textEn ? n.textEn : n.text; toast('🔔 ' + text); B.notify({ title: 'Craft Hub', body: text, link: n.link || '' }); } } catch { }
  }
}, 45000);
B.onNotificationClick(link => openLink(link));

/* ---------- app update bar ---------- */
function drawUpdate(st) {
  const bar = $('#updBar');
  if (!st || !st.available || st.blocked) { bar.hidden = true; return; }
  bar.hidden = false;
  bar.classList.toggle('urgent', st.daysLeft <= 3);
  bar.innerHTML = `${ic('download', 'sm')}<b>${t('upd_available', st.version)}</b><span class="faint">${st.progress && !st.downloaded ? t('upd_downloading', st.progress) : ''}</span><span class="spacer"></span><span class="days">${t('upd_days', st.daysLeft)}</span><button class="btn sm primary" id="updGo" ${st.progress && !st.downloaded ? 'disabled' : ''}>${t('upd_now')}</button>`;
  $('#updGo').onclick = () => { $('#updGo').disabled = true; B.installUpdate(); };
}
B.updateState().then(drawUpdate).catch(() => { });
B.onUpdateState(drawUpdate);


/* ================= more screens: updates, support tickets, creators, profiles ================= */
Object.assign(I18N.he, {
  updates: 'עדכונים', updates_sub: 'מה חדש ב-Craft Hub', no_updates: 'עוד אין עדכונים', support: 'תמיכה', creators: 'קרייטורים', admin: 'פאנל ניהול', upload: 'העלאת פרויקט',
  tickets_sub: 'פתחו טיקט והצוות יענה לכם', new_ticket: 'טיקט חדש', my_tickets: 'הטיקטים שלי', all_tickets: 'כל הטיקטים', no_tickets: 'אין טיקטים', subject: 'נושא', message: 'הודעה', category: 'קטגוריה', project_opt: 'פרויקט (לא חובה)', send: 'שליחה', ticket_created: 'הטיקט נפתח ✓',
  st_open: 'פתוח', st_closed: 'סגור', claim: 'לקחתי', unclaim: 'שחרר', close: 'סגירה', reopen: 'פתיחה מחדש', note: 'הערה פנימית', reply_ph: 'כתוב תשובה…', claimed_by: 'בטיפול של {x}', rate: 'איך היה השירות?', rated: 'תודה על הדירוג!', staff: 'צוות', bot: 'בוט', you: 'אתה',
  cat_support: 'תמיכה', cat_bug: 'באג', cat_suggestion: 'הצעה', cat_report: 'דיווח', cat_other: 'אחר', need_login: 'צריך להתחבר', search_people: 'חיפוש משתמשים…', followers: 'עוקבים', following: 'במעקב', follow: 'עקוב', projects: 'פרויקטים', creator: 'קרייטור', member: 'משתמש',
  admin_hint: 'פאנל הניהול נפתח בחלון נפרד'
});
Object.assign(I18N.en, {
  updates: 'Updates', updates_sub: "What's new on Craft Hub", no_updates: 'No updates yet', support: 'Support', creators: 'Creators', admin: 'Admin panel', upload: 'Upload project',
  tickets_sub: 'Open a ticket and the team will answer', new_ticket: 'New ticket', my_tickets: 'My tickets', all_tickets: 'All tickets', no_tickets: 'No tickets', subject: 'Subject', message: 'Message', category: 'Category', project_opt: 'Project (optional)', send: 'Send', ticket_created: 'Ticket opened ✓',
  st_open: 'Open', st_closed: 'Closed', claim: 'Claim', unclaim: 'Unclaim', close: 'Close', reopen: 'Reopen', note: 'Internal note', reply_ph: 'Write a reply…', claimed_by: 'Handled by {x}', rate: 'How was the support?', rated: 'Thanks for rating!', staff: 'Staff', bot: 'Bot', you: 'You',
  cat_support: 'Support', cat_bug: 'Bug', cat_suggestion: 'Suggestion', cat_report: 'Report', cat_other: 'Other', need_login: 'Sign in first', search_people: 'Search users…', followers: 'Followers', following: 'Following', follow: 'Follow', projects: 'Projects', creator: 'Creator', member: 'Member',
  admin_hint: 'The admin panel opens in its own window'
});
Object.assign(ICONS, {
  megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1Z"/><path d="M15 8a5 5 0 0 1 0 8M18 5a9 9 0 0 1 0 14"/>',
  ticket: '<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4Z"/><path d="M13 6v12"/>',
  users: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-5-6.7"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z"/>', upload: '<path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 21h14"/>', send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z"/>', lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'
});

// sidebar: second group of screens
const NAV2 = [['creators', 'users'], ['updates', 'megaphone'], ['support', 'ticket']];
const _renderNav = renderNav;
renderNav = function () {
  _renderNav();
  const r = { ticket: 'support', user: 'creators' }[S.route] || S.route;
  const me = S.me || {};
  const extra = NAV2.map(([k, i]) => `<a href="#" data-go="${k}" class="${r === k ? 'on' : ''}">${ic(i)} ${t(k)}</a>`).join('')
    + (me.canUpload ? `<a href="#" data-sitewin="/dashboard/new">${ic('upload')} ${t('upload')}</a>` : '')
    + ((me.perms || []).length ? `<a href="#" data-sitewin="/admin">${ic('shield')} ${t('admin')}</a>` : '');
  $('#nav').insertAdjacentHTML('beforeend', `<div class="sep"></div>${extra}`);
  $('#nav').querySelectorAll('[data-sitewin]').forEach(a => a.onclick = e => { e.preventDefault(); B.openSiteWindow(a.dataset.sitewin); });
  bindCommon($('#nav'));
};
const _go = go;
go = function (route, params, noHistory) {
  const fn = { updates: vUpdates, support: vTickets, ticket: vTicket, creators: vCreators, user: vUser }[route];
  if (!fn) return _go(route, params, noHistory);
  params = params || {};
  if (!noHistory && (S.route !== route || JSON.stringify(S.params) !== JSON.stringify(params))) S.history.push([S.route, S.params]);
  S.route = route; S.params = params;
  $('#backBtn').disabled = !S.history.length;
  renderNav();
  view.scrollTop = 0;
  view.innerHTML = '<div class="spin"></div>';
  const seq = ++go.seq;
  Promise.resolve(fn(params, () => seq !== go.seq)).catch(err => { if (seq === go.seq) view.innerHTML = `<div class="view-in">${emptyBox('wifi', t('error'), err.message)}</div>`; });
};
go.seq = _go.seq;

// site look: background image, dim and the announcement line (set in the site's admin panel)
function applyAppearance() {
  const a = (S.site && S.site.appearance) || {};
  const bg = $('#bgimg');
  if (a.backgroundUrl && /^https:\/\//.test(a.backgroundUrl)) { bg.style.backgroundImage = `url("${a.backgroundUrl.replace(/"/g, '')}")`; bg.style.opacity = String(1 - Math.min(95, Math.max(0, a.backgroundDim ?? 70)) / 100); bg.hidden = false; }
  else bg.hidden = true;
  const ann = $('#announce');
  const text = S.site && (LANG === 'en' && S.site.translations && S.site.translations.en && S.site.translations.en.announcement || S.site.announcement);
  ann.hidden = !(a.announcementEnabled && text && localStorage.getItem('ann_x') !== text);
  if (!ann.hidden) { ann.innerHTML = `${ic('megaphone', 'sm')}<span>${esc(text)}</span><button class="icon-btn" id="annX">✕</button>`; $('#annX').onclick = () => { localStorage.setItem('ann_x', text); ann.hidden = true; }; }
}

async function vUpdates(p, stale) {
  const list = await api('/api/updates');
  if (stale()) return;
  const tagName = { new: LANG === 'he' ? 'חדש' : 'New', improve: LANG === 'he' ? 'שיפור' : 'Improvement', fix: LANG === 'he' ? 'תיקון' : 'Fix', announce: LANG === 'he' ? 'הכרזה' : 'Announcement', event: LANG === 'he' ? 'אירוע' : 'Event' };
  put(`<div class="head"><div><h1>${t('updates')}</h1><p>${t('updates_sub')}</p></div></div>
    <div class="stack" style="max-width:820px">${list.length ? list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.at - a.at).map(u => `
      <article class="card card-b"><div class="row"><span class="chip accent">${esc(tagName[u.tag] || u.tag)}</span>${u.pinned ? '<span class="chip">📌</span>' : ''}<span class="spacer"></span><span class="faint" style="font-size:12.5px">${fmtDate(u.at)}</span></div>
        <h2 style="margin:12px 0 8px">${esc(LANG === 'en' && u.titleEn ? u.titleEn : u.title)}</h2><div class="md">${md(LANG === 'en' && u.bodyEn ? u.bodyEn : u.body)}</div></article>`).join('') : emptyBox('megaphone', t('no_updates'))}</div>`);
}

const needLogin = () => put(`<div class="empty">${ic('lock')}<b>${t('need_login')}</b><button class="btn primary" id="nlBtn" style="margin-top:12px">${ic('user', 'sm')} ${t('login')}</button></div>`) || ($('#nlBtn').onclick = async () => { if (await doLogin()) go(S.route, S.params, true); });
let TK_SCOPE = 'mine';
async function vTickets(p, stale) {
  if (!S.me || !S.me.user) return needLogin();
  const staff = (S.me.perms || []).includes('tickets.view');
  const [list, projects] = await Promise.all([api('/api/tickets' + (staff && TK_SCOPE === 'all' ? '?scope=all' : '')), loadProjects()]);
  if (stale()) return;
  const cats = (S.site && S.site.ticketCategories) || ['support', 'bug', 'suggestion', 'report', 'other'];
  put(`<div class="head"><div><h1>${t('support')}</h1><p>${t('tickets_sub')}</p></div></div>
    <div class="play-layout">
      <div>
        ${staff ? `<div class="tabs"><button data-scope="mine" class="${TK_SCOPE === 'mine' ? 'on' : ''}">${t('my_tickets')}</button><button data-scope="all" class="${TK_SCOPE === 'all' ? 'on' : ''}">${t('all_tickets')}</button></div>` : ''}
        <div class="stack" style="gap:8px">${list.length ? list.map(tk => `<div class="srv" data-go="ticket:id:${tk.id}"><span class="chip ${tk.status === 'open' ? 'accent' : ''}">${t('st_' + tk.status)}</span><div class="body"><b>#${tk.id} · ${esc(tk.subject)}</b><p>${esc(tk.lastMessage ? tk.lastMessage.text : '')}</p></div><span class="faint" style="font-size:12px">${timeAgo(tk.updatedAt)}</span></div>`).join('') : emptyBox('ticket', t('no_tickets'))}</div>
      </div>
      <form class="card" id="tkForm"><div class="card-h">${ic('plus')}<h3>${t('new_ticket')}</h3></div><div class="card-b stack" style="gap:10px">
        <label class="faint" style="font-size:12.5px">${t('subject')}</label><input type="text" name="subject" maxlength="120" required>
        <label class="faint" style="font-size:12.5px">${t('category')}</label><select name="category">${cats.map(c => `<option value="${c}">${t('cat_' + c)}</option>`).join('')}</select>
        <label class="faint" style="font-size:12.5px">${t('project_opt')}</label><select name="project"><option value="">—</option>${projects.map(x => `<option value="${esc(x.slug)}">${esc(x.name)}</option>`).join('')}</select>
        <label class="faint" style="font-size:12.5px">${t('message')}</label><textarea name="message" rows="5" required style="height:auto;padding:10px 12px"></textarea>
        <button class="btn primary">${ic('send', 'sm')} ${t('send')}</button></div></form>
    </div>`);
  view.querySelectorAll('[data-scope]').forEach(b => b.onclick = () => { TK_SCOPE = b.dataset.scope; go('support', {}, true); });
  $('#tkForm').onsubmit = async e => {
    e.preventDefault(); const f = e.target, btn = f.querySelector('button'); btn.disabled = true;
    try { const r = await api('/api/tickets', { method: 'POST', body: { subject: f.subject.value.trim(), category: f.category.value, project: f.project.value, message: f.message.value.trim() } }); toast(t('ticket_created')); go('ticket', { id: String(r.id) }); }
    catch (err) { toast(err.message, 'err'); btn.disabled = false; }
  };
}
async function vTicket({ id }, stale) {
  if (!S.me || !S.me.user) return needLogin();
  let tk = await api('/api/tickets/' + encodeURIComponent(id));
  if (stale()) return;
  const draw = () => {
    const a = tk.actions || {};
    const who = m => m.role === 'staff' ? t('staff') : m.role === 'bot' ? t('bot') : m.role === 'note' ? t('note') : m.authorId === S.me.user.id ? t('you') : '';
    put(`<div class="head"><div><h1>#${tk.id} · ${esc(tk.subject)}</h1><p><span class="chip ${tk.status === 'open' ? 'accent' : ''}">${t('st_' + tk.status)}</span> <span class="chip">${t('cat_' + tk.category)}</span> ${tk.claimedBy ? `<span class="faint">${esc(t('claimed_by', tk.claimedBy.name))}</span>` : ''}</p></div><span class="spacer"></span>
        ${a.canClaim ? `<button class="btn" data-act="claim">${t('claim')}</button>` : ''}${a.canUnclaim ? `<button class="btn" data-act="unclaim">${t('unclaim')}</button>` : ''}${a.canClose ? `<button class="btn danger" data-act="close">${t('close')}</button>` : ''}${a.canReopen ? `<button class="btn" data-act="reopen">${t('reopen')}</button>` : ''}</div>
      <div class="chat">${tk.messages.filter(m => m.role !== 'system').map(m => `<div class="msg ${m.authorId === S.me.user.id ? 'mine' : ''} ${m.role}"><img src="${esc(siteImg(m.avatar) || m.avatar || '')}" alt=""><div class="bubble"><div class="mh"><b>${esc(m.authorName || who(m))}</b>${who(m) && m.authorName ? `<span class="chip">${who(m)}</span>` : ''}<span class="faint">${timeAgo(m.at)}</span></div><div class="mt">${esc(m.text).replace(/\n/g, '<br>')}</div></div></div>`).join('')}</div>
      ${a.canWrite || a.canNote ? `<form id="rForm" class="card card-b row" style="align-items:flex-end"><textarea name="text" rows="2" placeholder="${t('reply_ph')}" style="height:auto;padding:10px 12px;flex:1"></textarea>${a.canNote ? `<label class="row faint" style="gap:6px;font-size:12.5px;white-space:nowrap"><input type="checkbox" name="note"> ${t('note')}</label>` : ''}<button class="btn primary">${ic('send', 'sm')}</button></form>` : ''}
      ${a.canRate && !tk.rating ? `<div class="card card-b row" style="margin-top:12px"><b>${t('rate')}</b><span class="spacer"></span>${[1, 2, 3, 4, 5].map(n => `<button class="btn sm" data-rate="${n}">${'★'.repeat(n)}</button>`).join('')}</div>` : tk.rating ? `<p class="faint">${'★'.repeat(tk.rating)} ${t('rated')}</p>` : ''}`);
    const chat = view.querySelector('.chat'); if (chat) view.scrollTop = view.scrollHeight;
    view.querySelectorAll('[data-act]').forEach(b => b.onclick = async () => { try { tk = await api(`/api/tickets/${tk.id}/${b.dataset.act}`, { method: 'POST', body: {} }); draw(); } catch (err) { toast(err.message, 'err'); } });
    view.querySelectorAll('[data-rate]').forEach(b => b.onclick = async () => { try { tk = await api(`/api/tickets/${tk.id}/rate`, { method: 'POST', body: { rating: Number(b.dataset.rate) } }); draw(); } catch (err) { toast(err.message, 'err'); } });
    const f = $('#rForm');
    if (f) f.onsubmit = async e => { e.preventDefault(); const text = f.text.value.trim(); if (!text) return; try { tk = await api(`/api/tickets/${tk.id}/messages`, { method: 'POST', body: { text, note: !!(f.note && f.note.checked) } }); draw(); } catch (err) { toast(err.message, 'err'); } };
  };
  draw();
  // new replies show up while the ticket is open
  const poll = setInterval(async () => { if (S.route !== 'ticket' || S.params.id !== id) return clearInterval(poll); const f = $('#rForm'); if (f && f.text.value) return; try { const fresh = await api('/api/tickets/' + encodeURIComponent(id)); if (fresh.messages.length !== tk.messages.length || fresh.status !== tk.status) { tk = fresh; draw(); } } catch { } }, 10000);
}

function personRow(u) {
  return `<div class="srv" data-go="user:id:${esc(u.id)}"><img src="${esc(siteImg(u.avatar) || u.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png')}" alt="" style="width:44px;height:44px;border-radius:50%;object-fit:cover"><div class="body"><b>${esc(u.name)}</b><p>${u.creator ? t('creator') : t('member')}${u.projectCount != null ? ` · ${fmtNum(u.projectCount)} ${t('projects')}` : ''}</p></div><span class="faint" style="font-size:12.5px">${fmtNum(u.followers || 0)} ${t('followers')}</span></div>`;
}
async function vCreators(p, stale) {
  const list = await api('/api/creators');
  if (stale()) return;
  put(`<div class="head"><h1>${t('creators')}</h1><span class="spacer"></span><input type="search" id="pplQ" placeholder="${t('search_people')}" style="width:280px"></div>
    <div class="stack" style="gap:8px" id="pplList">${list.map(c => personRow({ ...c, creator: true })).join('') || emptyBox('users', t('no_results'))}</div>`);
  let timer;
  $('#pplQ').oninput = e => {
    clearTimeout(timer); const q = e.target.value.trim();
    timer = setTimeout(async () => {
      const res = q.length < 2 ? list.map(c => ({ ...c, creator: true })) : await api('/api/search/users?q=' + encodeURIComponent(q)).catch(() => []);
      $('#pplList').innerHTML = res.length ? res.map(personRow).join('') : emptyBox('search', t('no_results')); bindCommon($('#pplList'));
    }, 250);
  };
}
async function vUser({ id }, stale) {
  const [u] = await Promise.all([api('/api/users/' + encodeURIComponent(id)), refreshInstalled()]);
  if (stale()) return;
  const mine = S.me && S.me.user && S.me.user.id === u.id;
  put(`<section class="phead"><img src="${esc(siteImg(u.avatar) || u.avatar || '')}" alt="" style="width:96px;height:96px;border-radius:50%;object-fit:cover">
      <div class="meta"><h1>${esc(u.name)}</h1><div class="sub">${u.creator ? `<span class="chip accent">${t('creator')}</span>` : `<span class="chip">${t('member')}</span>`}</div>${u.bio ? `<p class="faint" style="margin:0">${esc(u.bio)}</p>` : ''}
        <div class="row" style="gap:16px;margin-top:10px;font-size:13.5px"><span><b id="fN">${fmtNum(u.followers || 0)}</b> ${t('followers')}</span><span><b>${fmtNum(u.projectCount || 0)}</b> ${t('projects')}</span><span class="stat">${ic('download', 'sm')} ${fmtNum(u.downloads || 0)}</span></div></div>
      ${!mine && S.me && S.me.user ? `<button class="btn ${u.following ? 'ok' : 'primary'}" id="flw">${u.following ? `${ic('check', 'sm')} ${t('following')}` : `${ic('plus', 'sm')} ${t('follow')}`}</button>` : ''}</section>
    <div class="grid">${(u.projects || []).map(projectCard).join('')}</div>`);
  const f = $('#flw');
  if (f) f.onclick = async () => { try { const r = await api(`/api/users/${encodeURIComponent(u.id)}/follow`, { method: 'POST', body: {} }); u.following = r.following; $('#fN').textContent = fmtNum(r.followers); f.className = 'btn ' + (r.following ? 'ok' : 'primary'); f.innerHTML = r.following ? `${ic('check', 'sm')} ${t('following')}` : `${ic('plus', 'sm')} ${t('follow')}`; } catch (err) { toast(err.message, 'err'); } };
}

// notification links: tickets and profiles open inside the app too
openLink = function (l) {
  const m = String(l || '').match(/^\/(project|server|ticket|user)\/([\w:.-]+)/);
  if (m) go(m[1], m[1] === 'ticket' || m[1] === 'user' ? { id: decodeURIComponent(m[2]) } : { slug: m[2] });
 
};



/* ================= admin dashboard (native) + bigger tickets ================= */
Object.assign(I18N.he, {
  a_overview: 'סקירה', a_apps: 'בקשות קרייטור', a_projects: 'פרויקטים', a_servers: 'שרתים', a_updates: 'עדכונים', a_maint: 'תחזוקה', a_advanced: 'פאנל מתקדם',
  k_users: 'משתמשים', k_active: 'פעילים היום', k_active7: 'פעילים השבוע', k_projects: 'פרויקטים', k_downloads: 'הורדות', k_week: 'השבוע', k_likes: 'לייקים', k_reviews: 'ביקורות', k_creators: 'קרייטורים',
  k_pending: 'ממתינים לאישור', k_servers: 'שרתים', k_votes: 'הצבעות החודש', k_open: 'טיקטים פתוחים', k_unclaimed: 'לא טופלו', k_rating: 'דירוג תמיכה', k_reply: 'זמן תגובה ראשונה', k_storage: 'נפח', k_backup: 'גיבוי אחרון', k_follows: 'מעקבים',
  c_downloads: 'הורדות — 30 יום', c_signups: 'משתמשים חדשים — 30 יום', c_votes: 'הצבעות לשרתים — 30 יום', c_tickets: 'טיקטים חדשים — 30 יום', c_types: 'פרויקטים לפי סוג', c_providers: 'התחברות לפי שירות', c_cats: 'קטגוריות מובילות',
  top_projects: 'הפרויקטים המובילים', top_creators: 'הקרייטורים המובילים', top_servers_a: 'השרתים המובילים', recent_users: 'נרשמו לאחרונה', trending_a: 'טרנדי השבוע', hours: 'שעות',
  approve: 'אישור', reject: 'דחייה', reject_reason: 'סיבת הדחייה (תישלח למשתמש)', pending: 'ממתין', approved: 'אושר', rejected: 'נדחה', no_apps: 'אין בקשות', approved_ok: 'הקרייטור אושר ✓', rejected_ok: 'הבקשה נדחתה',
  visible: 'מוצג', hidden: 'מוסתר', featured: 'מומלץ', delete: 'מחיקה', confirm_delete: 'למחוק את {x}? אי אפשר לבטל.', deleted: 'נמחק', saved: 'נשמר ✓', search_a: 'חיפוש…',
  upd_new: 'עדכון חדש', upd_title: 'כותרת', upd_body: 'תוכן', upd_tag: 'סוג', upd_mail: 'לשלוח במייל לנרשמים ({x})', publish: 'פרסום', published: 'פורסם ✓',
  maint_on: 'האתר והאפליקציה במצב תחזוקה', maint_off: 'הכל פתוח לכולם', maint_msg: 'הודעה למשתמשים', maint_toggle_on: 'הפעל תחזוקה', maint_toggle_off: 'כבה תחזוקה',
  advanced_hint: 'הגדרות, צוות, עיצוב, שותפים, מגבלות וגיבויים — בפאנל המתקדם.', no_access: 'אין לך גישה לפאנל הניהול',
  tk_all_open: 'פתוחים', tk_all_closed: 'סגורים', tk_new_title: 'פתיחת טיקט חדש', tk_empty_title: 'אין טיקטים', tk_empty_sub: 'צריך עזרה? פתח טיקט והצוות יענה', tk_waiting: 'מחכה לתשובה', tk_messages: '{x} הודעות', attach_hint: 'Enter לשליחה · Shift+Enter לשורה חדשה'
});
Object.assign(I18N.en, {
  a_overview: 'Overview', a_apps: 'Creator requests', a_projects: 'Projects', a_servers: 'Servers', a_updates: 'Updates', a_maint: 'Maintenance', a_advanced: 'Advanced panel',
  k_users: 'Users', k_active: 'Active today', k_active7: 'Active this week', k_projects: 'Projects', k_downloads: 'Downloads', k_week: 'this week', k_likes: 'Likes', k_reviews: 'Reviews', k_creators: 'Creators',
  k_pending: 'Pending', k_servers: 'Servers', k_votes: 'Votes this month', k_open: 'Open tickets', k_unclaimed: 'Unclaimed', k_rating: 'Support rating', k_reply: 'First reply time', k_storage: 'Storage', k_backup: 'Last backup', k_follows: 'Follows',
  c_downloads: 'Downloads — 30 days', c_signups: 'New users — 30 days', c_votes: 'Server votes — 30 days', c_tickets: 'New tickets — 30 days', c_types: 'Projects by type', c_providers: 'Sign-in by service', c_cats: 'Top categories',
  top_projects: 'Top projects', top_creators: 'Top creators', top_servers_a: 'Top servers', recent_users: 'Newest users', trending_a: 'Trending this week', hours: 'hours',
  approve: 'Approve', reject: 'Reject', reject_reason: 'Rejection reason (sent to the user)', pending: 'Pending', approved: 'Approved', rejected: 'Rejected', no_apps: 'No requests', approved_ok: 'Creator approved ✓', rejected_ok: 'Request rejected',
  visible: 'Visible', hidden: 'Hidden', featured: 'Featured', delete: 'Delete', confirm_delete: 'Delete {x}? This cannot be undone.', deleted: 'Deleted', saved: 'Saved ✓', search_a: 'Search…',
  upd_new: 'New update', upd_title: 'Title', upd_body: 'Content', upd_tag: 'Type', upd_mail: 'Email it to subscribers ({x})', publish: 'Publish', published: 'Published ✓',
  maint_on: 'The site and app are in maintenance', maint_off: 'Everything is open', maint_msg: 'Message to users', maint_toggle_on: 'Turn maintenance on', maint_toggle_off: 'Turn maintenance off',
  advanced_hint: 'Settings, staff, appearance, partners, limits and backups — in the advanced panel.', no_access: 'You have no access to the admin panel',
  tk_all_open: 'Open', tk_all_closed: 'Closed', tk_new_title: 'Open a new ticket', tk_empty_title: 'No tickets', tk_empty_sub: 'Need help? Open a ticket and the team will answer', tk_waiting: 'Waiting for reply', tk_messages: '{x} messages', attach_hint: 'Enter to send · Shift+Enter for a new line'
});
Object.assign(ICONS, {
  chart: '<path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="5" width="3" height="13"/>',
  badge: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14.5-1.5 7 5-3 5 3-1.5-7"/>', eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3.1 4.1M6.6 6.6A18 18 0 0 0 2 12s3.5 7 10 7a10.8 10.8 0 0 0 5.4-1.4"/>',
  tool: '<path d="M14.7 6.3a4 4 0 0 0 5 5L22 14l-8 8-2.3-2.3a4 4 0 0 0-5-5L3 11l8-8Z"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'
});

/* ---------- small chart helpers (SVG, no libraries) ---------- */
function barChart(values, days, h = 150) {
  const max = Math.max(1, ...values), W = 600, bw = W / values.length;
  return `<svg class="chart" viewBox="0 0 ${W} ${h + 20}" preserveAspectRatio="none">
    ${[0.5, 1].map(f => `<line x1="0" x2="${W}" y1="${h - h * f + 4}" y2="${h - h * f + 4}" class="grid"/>`).join('')}
    ${values.map((v, i) => { const bh = v ? Math.max(3, v / max * (h - 8)) : 0; return `<rect x="${i * bw + 2}" y="${h - bh + 4}" width="${bw - 4}" height="${bh}" rx="3"><title>${days[i]}: ${v}</title></rect>`; }).join('')}
    <text x="${W - 2}" y="${h + 18}" text-anchor="end">${days[0].slice(5)}</text><text x="2" y="${h + 18}">${days[days.length - 1].slice(5)}</text>
  </svg>`;
}
function hBars(entries, total) {
  const max = Math.max(1, ...entries.map(e => e[1]));
  return entries.length ? entries.map(([k, v]) => `<div class="hbar"><span>${esc(k)}</span><div class="hb"><i style="width:${v / max * 100}%"></i></div><b>${fmtNum(v)}</b>${total ? `<small>${Math.round(v / total * 100)}%</small>` : ''}</div>`).join('') : `<p class="faint">—</p>`;
}
const sum = a => a.reduce((s, x) => s + x, 0);
const kpi = (icon, value, label, sub) => `<div class="kpi">${ic(icon)}<div><b>${value}</b><span>${esc(label)}</span>${sub ? `<small>${sub}</small>` : ''}</div></div>`;

/* ---------- admin ---------- */
let ADM_TAB = 'overview';
async function vAdmin(p, stale) {
  const perms = (S.me && S.me.perms) || [];
  if (!perms.length) return put(emptyBox('shield', t('no_access')));
  if (p.tab) ADM_TAB = p.tab;
  const tabs = [['overview', 'chart', null], ['apps', 'badge', 'creators'], ['projects', 'box', 'projects'], ['servers', 'globe', 'projects'], ['updates', 'megaphone', 'content'], ['maint', 'tool', 'settings']].filter(x => !x[2] || perms.includes(x[2]));
  if (!tabs.some(x => x[0] === ADM_TAB)) ADM_TAB = 'overview';
  const head = `<div class="head"><div><h1>${ic('shield', 'lg')} ${t('admin')}</h1></div><span class="spacer"></span><button class="btn" id="advBtn">${ic('settings', 'sm')} ${t('a_advanced')}</button></div>
    <div class="tabs big">${tabs.map(([k, i]) => `<button data-atab="${k}" class="${k === ADM_TAB ? 'on' : ''}">${ic(i, 'sm')} ${t('a_' + k)}</button>`).join('')}</div><div id="aBody"><div class="spin"></div></div>`;
  put(head);
  view.querySelectorAll('[data-atab]').forEach(b => b.onclick = () => { ADM_TAB = b.dataset.atab; go('admin', {}, true); });
  $('#advBtn').onclick = () => B.openSiteWindow('/admin');
  const body = $('#aBody');
  const fn = { overview: aOverview, apps: aApps, projects: aProjects, servers: aServers, updates: aUpdates, maint: aMaint }[ADM_TAB];
  try { await fn(body, stale); } catch (err) { if (!stale()) body.innerHTML = emptyBox('wifi', t('error'), err.message); }
  bindCommon(body);
}
async function aOverview(body, stale) {
  const d = await api('/api/admin/insights');
  if (stale()) return;
  const T = d.totals, s = d.series;
  const typeEntries = Object.entries(d.byType).sort((a, b) => b[1] - a[1]).map(([k, v]) => [typeName(k), v]);
  const provNames = { discord: 'Discord', google: 'Google', email: 'Email', apple: 'Apple' };
  body.innerHTML = `
    <div class="kpis">
      ${kpi('users', fmtNum(T.users), t('k_users'), `${fmtNum(T.active1)} ${t('k_active')} · ${fmtNum(T.active7)} ${t('k_active7')}`)}
      ${kpi('download', fmtNum(T.downloads), t('k_downloads'), `+${fmtNum(T.downloadsWeek)} ${t('k_week')}`)}
      ${kpi('box', fmtNum(T.projects), t('k_projects'), T.hidden ? `${T.hidden} ${t('hidden')}` : '')}
      ${kpi('badge', fmtNum(T.creators), t('k_creators'), T.pendingApps ? `${T.pendingApps} ${t('k_pending')}` : '')}
      ${kpi('heart', fmtNum(T.likes), t('k_likes'), `${fmtNum(T.follows)} ${t('k_follows')}`)}
      ${kpi('star', T.avgReview != null ? T.avgReview + '★' : '—', t('k_reviews'), fmtNum(T.reviews))}
      ${kpi('globe', fmtNum(T.servers), t('k_servers'), `${fmtNum(T.votesMonth)} ${t('k_votes')}`)}
      ${kpi('ticket', fmtNum(T.ticketsOpen), t('k_open'), T.ticketsUnclaimed ? `${T.ticketsUnclaimed} ${t('k_unclaimed')}` : '')}
      ${kpi('star', T.ticketRating != null ? T.ticketRating + '★' : '—', t('k_rating'), T.firstReplyHours != null ? `${t('k_reply')}: ${T.firstReplyHours} ${t('hours')}` : '')}
      ${kpi('database', T.storageMB + ' MB', t('k_storage'), T.lastBackup ? `${t('k_backup')}: ${timeAgo(T.lastBackup)}` : '')}
    </div>
    <div class="charts">
      <div class="card"><div class="card-h">${ic('download')}<h3>${t('c_downloads')}</h3><span class="spacer"></span><b class="accent-num">${fmtNum(sum(s.downloads))}</b></div><div class="card-b">${barChart(s.downloads, d.days)}</div></div>
      <div class="card"><div class="card-h">${ic('users')}<h3>${t('c_signups')}</h3><span class="spacer"></span><b class="accent-num">${fmtNum(sum(s.signups))}</b></div><div class="card-b">${barChart(s.signups, d.days)}</div></div>
      <div class="card"><div class="card-h">${ic('globe')}<h3>${t('c_votes')}</h3><span class="spacer"></span><b class="accent-num">${fmtNum(sum(s.votes))}</b></div><div class="card-b">${barChart(s.votes, d.days)}</div></div>
      <div class="card"><div class="card-h">${ic('ticket')}<h3>${t('c_tickets')}</h3><span class="spacer"></span><b class="accent-num">${fmtNum(sum(s.tickets))}</b></div><div class="card-b">${barChart(s.tickets, d.days)}</div></div>
    </div>
    <div class="charts three">
      <div class="card"><div class="card-h">${ic('box')}<h3>${t('c_types')}</h3></div><div class="card-b">${hBars(typeEntries, T.projects)}</div></div>
      <div class="card"><div class="card-h">${ic('user')}<h3>${t('c_providers')}</h3></div><div class="card-b">${hBars(Object.entries(d.providers).sort((a, b) => b[1] - a[1]).map(([k, v]) => [provNames[k] || k, v]), T.users)}</div></div>
      <div class="card"><div class="card-h">${ic('grid')}<h3>${t('c_cats')}</h3></div><div class="card-b">${hBars(d.byCategory)}</div></div>
    </div>
    <div class="charts">
      <div class="card"><div class="card-h">${ic('flame')}<h3>${t('top_projects')}</h3></div><div class="card-b">${d.topProjects.map((x, i) => `<div class="lrow big" data-go="project:slug:${esc(x.slug)}"><span class="rk">${i + 1}</span>${pic(x, 'sm')}<div style="flex:1;min-width:0"><b>${esc(x.name)}</b><div class="faint">${esc(x.owner || '')} · ${esc(typeName(x.type))}</div></div><span class="stat">${ic('download', 'sm')} ${fmtNum(x.downloads)}</span>${x.week ? `<span class="chip accent">+${fmtNum(x.week)}</span>` : ''}</div>`).join('') || '<p class="faint">—</p>'}</div></div>
      <div class="card"><div class="card-h">${ic('badge')}<h3>${t('top_creators')}</h3></div><div class="card-b">${d.topCreators.map((c, i) => `<div class="lrow big" data-go="user:id:${esc(c.id)}"><span class="rk">${i + 1}</span><img class="av" src="${esc(siteImg(c.avatar) || c.avatar || '')}" alt=""><div style="flex:1;min-width:0"><b>${esc(c.name)}</b><div class="faint">${fmtNum(c.projectCount)} ${t('projects')} · ${fmtNum(c.followers)} ${t('followers')}</div></div><span class="stat">${ic('download', 'sm')} ${fmtNum(c.downloads)}</span></div>`).join('') || '<p class="faint">—</p>'}</div></div>
      <div class="card"><div class="card-h">${ic('globe')}<h3>${t('top_servers_a')}</h3></div><div class="card-b">${d.topServers.map((x, i) => `<div class="lrow big" data-go="server:slug:${esc(x.slug)}"><span class="rk">${i + 1}</span>${pic(x, 'sm')}<b style="flex:1">${esc(x.name)}</b><span class="stat">${ic('star', 'sm')} ${fmtNum(x.votesMonth)}</span><span class="faint">${fmtNum(x.votesTotal)}</span></div>`).join('') || '<p class="faint">—</p>'}</div></div>
      <div class="card"><div class="card-h">${ic('user')}<h3>${t('recent_users')}</h3></div><div class="card-b">${d.recentUsers.map(u => `<div class="lrow big" data-go="user:id:${esc(u.id)}"><img class="av" src="${esc(siteImg(u.avatar) || u.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png')}" alt=""><b style="flex:1">${esc(u.name || u.id)}</b><span class="chip">${esc(provNames[u.provider] || u.provider || '')}</span><span class="faint">${timeAgo(u.at)}</span></div>`).join('') || '<p class="faint">—</p>'}</div></div>
    </div>`;
}
async function aApps(body, stale) {
  const list = await api('/api/admin/applications');
  if (stale()) return;
  body.innerHTML = list.length ? `<div class="stack">${list.map(a => `
    <div class="card app-card ${a.status}">
      <div class="card-h"><img class="av" src="${esc(siteImg(a.avatar) || a.avatar || '')}" alt=""><div style="flex:1"><b style="font-size:17px">${esc(a.userName)}</b><div class="faint">${timeAgo(a.createdAt)}</div></div><span class="chip ${a.status === 'pending' ? 'accent' : ''}">${t(a.status)}</span></div>
      <div class="card-b">${(a.answers || []).map(x => `<div class="qa"><b>${esc(x.q)}</b><p>${esc(x.a)}</p></div>`).join('')}${a.reason ? `<p class="faint">${esc(a.reason)}</p>` : ''}
        ${a.status === 'pending' ? `<div class="row" style="margin-top:14px"><button class="btn primary lg" data-ap="${esc(a.id)}">${ic('check', 'sm')} ${t('approve')}</button><button class="btn danger lg" data-rj="${esc(a.id)}">${t('reject')}</button></div>` : ''}</div>
    </div>`).join('')}</div>` : emptyBox('badge', t('no_apps'));
  body.querySelectorAll('[data-ap]').forEach(b => b.onclick = async () => { b.disabled = true; try { await api(`/api/admin/applications/${b.dataset.ap}/approve`, { method: 'POST', body: {} }); toast(t('approved_ok')); go('admin', {}, true); } catch (e) { toast(e.message, 'err'); b.disabled = false; } });
  body.querySelectorAll('[data-rj]').forEach(b => b.onclick = async () => { const reason = prompt(t('reject_reason')); if (reason === null) return; try { await api(`/api/admin/applications/${b.dataset.rj}/reject`, { method: 'POST', body: { reason } }); toast(t('rejected_ok')); go('admin', {}, true); } catch (e) { toast(e.message, 'err'); } });
}
async function aProjects(body, stale) {
  let list = await api('/api/projects?all=1');
  if (stale()) return;
  let q = '';
  const draw = () => {
    const rows = list.filter(x => !q || `${x.name} ${x.owner && x.owner.name}`.toLowerCase().includes(q));
    $('#apList').innerHTML = rows.map(x => `<div class="lrow big"><div data-go="project:slug:${esc(x.slug)}" class="row" style="flex:1;min-width:0;cursor:pointer">${pic(x, 'sm')}<div style="min-width:0"><b>${esc(x.name)}</b><div class="faint">${esc(x.owner && x.owner.name || '')} · ${esc(typeName(x.type || 'plugin'))} · ${fmtNum(x.downloads)} ${t('downloads')}</div></div></div>
      <button class="btn sm ${x.visible ? '' : 'danger'}" data-vis="${esc(x.slug)}">${ic(x.visible ? 'eye' : 'eyeoff', 'sm')} ${x.visible ? t('visible') : t('hidden')}</button>
      <button class="btn sm ${x.featured ? 'primary' : ''}" data-feat="${esc(x.slug)}">${ic('star', 'sm')} ${t('featured')}</button>
      <button class="icon-btn" data-del="${esc(x.slug)}" title="${t('delete')}">${ic('trash', 'sm')}</button></div>`).join('') || emptyBox('box', t('no_results'));
    const upd = async (slug, patch) => { try { const r = await api('/api/studio/projects/' + encodeURIComponent(slug), { method: 'PUT', body: patch }); list = list.map(x => x.slug === slug ? { ...x, ...r } : x); draw(); toast(t('saved')); } catch (e) { toast(e.message, 'err'); } };
    $('#apList').querySelectorAll('[data-vis]').forEach(b => b.onclick = () => { const x = list.find(y => y.slug === b.dataset.vis); upd(x.slug, { visible: !x.visible }); });
    $('#apList').querySelectorAll('[data-feat]').forEach(b => b.onclick = () => { const x = list.find(y => y.slug === b.dataset.feat); upd(x.slug, { featured: !x.featured }); });
    $('#apList').querySelectorAll('[data-del]').forEach(b => b.onclick = async () => { const x = list.find(y => y.slug === b.dataset.del); if (!confirm(t('confirm_delete', x.name))) return; try { await api('/api/studio/projects/' + encodeURIComponent(x.slug), { method: 'DELETE' }); list = list.filter(y => y.slug !== x.slug); draw(); toast(t('deleted')); } catch (e) { toast(e.message, 'err'); } });
    bindCommon($('#apList'));
  };
  body.innerHTML = `<div class="filters"><input type="search" id="apQ" placeholder="${t('search_a')}" style="max-width:340px"><span class="faint">${list.length} ${t('projects')}</span></div><div class="card card-b" id="apList"></div>`;
  $('#apQ').oninput = e => { q = e.target.value.toLowerCase().trim(); draw(); };
  draw();
}
async function aServers(body, stale) {
  let list = await api('/api/admin/servers');
  if (stale()) return;
  const draw = () => {
    body.innerHTML = `<div class="card card-b">${list.map(x => `<div class="lrow big"><div data-go="server:slug:${esc(x.slug)}" class="row" style="flex:1;min-width:0;cursor:pointer">${pic(x, 'sm')}<div style="min-width:0"><b>${esc(x.name)}</b><div class="faint mono ltr">${esc(x.address)} · ${esc(x.owner || '')}</div></div></div>
      <span class="stat">${ic('star', 'sm')} ${fmtNum(x.votesMonth)}</span>
      <button class="btn sm ${x.visible ? '' : 'danger'}" data-vis="${esc(x.slug)}">${ic(x.visible ? 'eye' : 'eyeoff', 'sm')} ${x.visible ? t('visible') : t('hidden')}</button>
      <button class="icon-btn" data-del="${esc(x.slug)}">${ic('trash', 'sm')}</button></div>`).join('') || emptyBox('globe', t('no_results'))}</div>`;
    body.querySelectorAll('[data-vis]').forEach(b => b.onclick = async () => { const x = list.find(y => y.slug === b.dataset.vis); try { await api('/api/servers/' + encodeURIComponent(x.slug), { method: 'PUT', body: { visible: !x.visible } }); x.visible = !x.visible; draw(); toast(t('saved')); } catch (e) { toast(e.message, 'err'); } });
    body.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => { const x = list.find(y => y.slug === b.dataset.del); if (!confirm(t('confirm_delete', x.name))) return; try { await api('/api/servers/' + encodeURIComponent(x.slug), { method: 'DELETE' }); list = list.filter(y => y.slug !== x.slug); draw(); toast(t('deleted')); } catch (e) { toast(e.message, 'err'); } });
    bindCommon(body);
  };
  draw();
}
async function aUpdates(body, stale) {
  const d = await api('/api/admin/updates');
  if (stale()) return;
  const tags = ['new', 'improve', 'fix', 'announce', 'event'];
  body.innerHTML = `<div class="play-layout">
    <div class="stack">${d.updates.map(u => `<div class="card card-b"><div class="row"><span class="chip accent">${esc(u.tag)}</span><b style="flex:1;font-size:16px">${esc(u.title)}</b><span class="faint">${fmtDate(u.at)}</span><button class="icon-btn" data-del="${esc(u.id)}">${ic('trash', 'sm')}</button></div><div class="md" style="margin-top:8px">${md(u.body)}</div></div>`).join('') || emptyBox('megaphone', t('no_updates'))}</div>
    <form class="card" id="uForm"><div class="card-h">${ic('plus')}<h3>${t('upd_new')}</h3></div><div class="card-b stack" style="gap:12px">
      <input type="text" name="title" required maxlength="120" placeholder="${t('upd_title')}">
      <select name="tag">${tags.map(x => `<option>${x}</option>`).join('')}</select>
      <textarea name="body" rows="8" required placeholder="${t('upd_body')}" style="height:auto;padding:12px"></textarea>
      ${d.emailReady ? `<label class="row faint"><input type="checkbox" name="mail" style="width:auto"> ${t('upd_mail', d.subscribers)}</label>` : ''}
      <button class="btn primary lg">${ic('megaphone', 'sm')} ${t('publish')}</button></div></form></div>`;
  $('#uForm').onsubmit = async e => {
    e.preventDefault(); const f = e.target;
    try { await api('/api/admin/updates', { method: 'POST', body: { title: f.title.value.trim(), tag: f.tag.value, body: f.body.value, sendEmail: !!(f.mail && f.mail.checked) } }); toast(t('published')); go('admin', {}, true); } catch (err) { toast(err.message, 'err'); }
  };
  body.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => { if (!confirm(t('confirm_delete', ''))) return; try { await api('/api/admin/updates/' + b.dataset.del, { method: 'DELETE' }); go('admin', {}, true); } catch (e) { toast(e.message, 'err'); } });
}
async function aMaint(body, stale) {
  const m = await api('/api/admin/maintenance');
  if (stale()) return;
  body.innerHTML = `<div class="card maint ${m.enabled ? 'on' : ''}" style="max-width:720px"><div class="card-b stack">
    <div class="row"><div class="maint-dot"></div><b style="font-size:18px">${m.enabled ? t('maint_on') : t('maint_off')}</b></div>
    <label class="faint">${t('maint_msg')}</label><textarea id="mMsg" rows="3" style="height:auto;padding:12px">${esc(m.message || '')}</textarea>
    <div class="row"><button class="btn lg ${m.enabled ? '' : 'danger'}" id="mTog">${ic('tool', 'sm')} ${m.enabled ? t('maint_toggle_off') : t('maint_toggle_on')}</button><button class="btn lg" id="mSave">${t('saved').replace(' ✓', '')}</button></div>
    <p class="faint" style="margin:0">${t('advanced_hint')}</p></div></div>`;
  $('#mTog').onclick = async () => { try { await api('/api/admin/maintenance', { method: 'PUT', body: { enabled: !m.enabled, message: $('#mMsg').value } }); go('admin', {}, true); } catch (e) { toast(e.message, 'err'); } };
  $('#mSave').onclick = async () => { try { await api('/api/admin/maintenance', { method: 'PUT', body: { message: $('#mMsg').value } }); toast(t('saved')); } catch (e) { toast(e.message, 'err'); } };
}

/* ---------- tickets, bigger ---------- */
let TK_FILTER = 'open';
vTickets = async function (p, stale) {
  if (!S.me || !S.me.user) return needLogin();
  const staff = (S.me.perms || []).includes('tickets.view');
  const [list, projects] = await Promise.all([api('/api/tickets' + (staff && TK_SCOPE === 'all' ? '?scope=all' : '')), loadProjects()]);
  if (stale()) return;
  const cats = (S.site && S.site.ticketCategories) || ['support', 'bug', 'suggestion', 'report', 'other'];
  const shown = list.filter(x => TK_FILTER === 'open' ? x.status === 'open' : x.status !== 'open');
  put(`<div class="head"><div><h1>${ic('ticket', 'lg')} ${t('support')}</h1><p>${t('tickets_sub')}</p></div><span class="spacer"></span><button class="btn primary lg" id="tkNew">${ic('plus', 'sm')} ${t('new_ticket')}</button></div>
    <div class="row" style="margin-bottom:18px;flex-wrap:wrap">
      ${staff ? `<div class="tabs big" style="margin:0"><button data-scope="mine" class="${TK_SCOPE === 'mine' ? 'on' : ''}">${t('my_tickets')}</button><button data-scope="all" class="${TK_SCOPE === 'all' ? 'on' : ''}">${t('all_tickets')}</button></div><span style="width:12px"></span>` : ''}
      <div class="tabs big" style="margin:0"><button data-f="open" class="${TK_FILTER === 'open' ? 'on' : ''}">${t('tk_all_open')} <span class="faint">${list.filter(x => x.status === 'open').length}</span></button><button data-f="closed" class="${TK_FILTER === 'closed' ? 'on' : ''}">${t('tk_all_closed')} <span class="faint">${list.filter(x => x.status !== 'open').length}</span></button></div>
    </div>
    <div class="tk-list">${shown.length ? shown.map(tk => `<div class="tk-card ${tk.status}" data-go="ticket:id:${tk.id}">
        <div class="tk-num">#${tk.id}</div>
        <div class="tk-main"><div class="row" style="gap:8px;flex-wrap:wrap"><b class="tk-subj">${esc(tk.subject)}</b><span class="chip">${t('cat_' + tk.category)}</span>${tk.claimedBy ? `<span class="chip accent">${esc(t('claimed_by', tk.claimedBy.name))}</span>` : ''}</div>
          <p>${tk.lastMessage ? `<b>${esc(tk.lastMessage.authorName || '')}:</b> ${esc(tk.lastMessage.text)}` : ''}</p></div>
        <div class="tk-side"><span class="tk-status">${tk.status === 'open' ? t('st_open') : t('st_closed')}</span><span class="faint">${timeAgo(tk.updatedAt)}</span><span class="faint">${t('tk_messages', tk.messageCount || 0)}</span></div>
      </div>`).join('') : `<div class="tk-empty">${ic('ticket', 'xl')}<b>${t('tk_empty_title')}</b><span>${t('tk_empty_sub')}</span></div>`}</div>`);
  view.querySelectorAll('[data-scope]').forEach(b => b.onclick = () => { TK_SCOPE = b.dataset.scope; go('support', {}, true); });
  view.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { TK_FILTER = b.dataset.f; go('support', {}, true); });
  $('#tkNew').onclick = () => {
    const m = document.createElement('div'); m.className = 'modal-back';
    m.innerHTML = `<form class="card tk-modal"><div class="card-h">${ic('ticket')}<h3>${t('tk_new_title')}</h3><span class="spacer"></span><button type="button" class="icon-btn" data-x>✕</button></div><div class="card-b stack">
      <div><label class="lbl">${t('subject')}</label><input type="text" name="subject" maxlength="120" required></div>
      <div class="row" style="gap:12px;align-items:flex-start"><div style="flex:1"><label class="lbl">${t('category')}</label><select name="category">${cats.map(c => `<option value="${c}">${t('cat_' + c)}</option>`).join('')}</select></div>
        <div style="flex:1"><label class="lbl">${t('project_opt')}</label><select name="project"><option value="">—</option>${projects.map(x => `<option value="${esc(x.slug)}">${esc(x.name)}</option>`).join('')}</select></div></div>
      <div><label class="lbl">${t('message')}</label><textarea name="message" rows="7" required></textarea></div>
      <button class="btn primary lg">${ic('send', 'sm')} ${t('send')}</button></div></form>`;
    document.body.appendChild(m);
    m.querySelector('[data-x]').onclick = () => m.remove();
    m.onclick = e => { if (e.target === m) m.remove(); };
    m.querySelector('input').focus();
    m.querySelector('form').onsubmit = async e => {
      e.preventDefault(); const f = e.target, btn = f.querySelector('button.primary'); btn.disabled = true;
      try { const r = await api('/api/tickets', { method: 'POST', body: { subject: f.subject.value.trim(), category: f.category.value, project: f.project.value, message: f.message.value.trim() } }); m.remove(); toast(t('ticket_created')); go('ticket', { id: String(r.id) }); }
      catch (err) { toast(err.message, 'err'); btn.disabled = false; }
    };
  };
};
vTicket = async function ({ id }, stale) {
  if (!S.me || !S.me.user) return needLogin();
  let tk = await api('/api/tickets/' + encodeURIComponent(id));
  if (stale()) return;
  const draw = () => {
    const a = tk.actions || {};
    const who = m => m.role === 'staff' ? t('staff') : m.role === 'bot' ? t('bot') : m.role === 'note' ? t('note') : '';
    put(`<div class="tk-head card">
        <div style="flex:1;min-width:0"><div class="row" style="gap:10px;flex-wrap:wrap"><span class="tk-num big">#${tk.id}</span><h1 style="font-size:24px">${esc(tk.subject)}</h1></div>
          <div class="row" style="gap:8px;margin-top:10px;flex-wrap:wrap"><span class="tk-status ${tk.status}">${t('st_' + tk.status)}</span><span class="chip">${t('cat_' + tk.category)}</span>${tk.claimedBy ? `<span class="chip accent">${esc(t('claimed_by', tk.claimedBy.name))}</span>` : ''}<span class="faint">${fmtDate(tk.createdAt)}</span></div></div>
        <div class="row" style="flex-wrap:wrap">${a.canClaim ? `<button class="btn lg" data-act="claim">${t('claim')}</button>` : ''}${a.canUnclaim ? `<button class="btn lg" data-act="unclaim">${t('unclaim')}</button>` : ''}${a.canClose ? `<button class="btn lg danger" data-act="close">${t('close')}</button>` : ''}${a.canReopen ? `<button class="btn lg" data-act="reopen">${t('reopen')}</button>` : ''}</div>
      </div>
      <div class="chat big">${tk.messages.filter(m => m.role !== 'system').map(m => `<div class="msg ${m.authorId === S.me.user.id ? 'mine' : ''} ${m.role}"><img src="${esc(siteImg(m.avatar) || m.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png')}" alt=""><div class="bubble"><div class="mh"><b>${esc(m.authorName || who(m))}</b>${who(m) ? `<span class="chip">${who(m)}</span>` : ''}<span class="faint">${timeAgo(m.at)}</span></div><div class="mt">${esc(m.text).replace(/\n/g, '<br>')}</div></div></div>`).join('')}</div>
      ${a.canRate && !tk.rating ? `<div class="card card-b rate-box"><b>${t('rate')}</b><div class="row">${[1, 2, 3, 4, 5].map(n => `<button class="star-btn" data-rate="${n}" title="${n}">★</button>`).join('')}</div></div>` : tk.rating ? `<div class="card card-b rate-box"><span class="stars-big">${'★'.repeat(tk.rating)}${'☆'.repeat(5 - tk.rating)}</span> ${t('rated')}</div>` : ''}
      ${a.canWrite || a.canNote ? `<form id="rForm" class="composer"><textarea name="text" rows="3" placeholder="${t('reply_ph')}"></textarea><div class="composer-bar">${a.canNote ? `<label class="row faint" style="gap:6px"><input type="checkbox" name="note" style="width:auto"> ${t('note')}</label>` : ''}<span class="faint" style="font-size:12.5px">${t('attach_hint')}</span><span class="spacer"></span><button class="btn primary lg">${ic('send', 'sm')} ${t('send')}</button></div></form>` : ''}`);
    view.scrollTop = view.scrollHeight;
    view.querySelectorAll('[data-act]').forEach(b => b.onclick = async () => { try { tk = await api(`/api/tickets/${tk.id}/${b.dataset.act}`, { method: 'POST', body: {} }); draw(); } catch (err) { toast(err.message, 'err'); } });
    view.querySelectorAll('[data-rate]').forEach(b => b.onclick = async () => { try { tk = await api(`/api/tickets/${tk.id}/rate`, { method: 'POST', body: { rating: Number(b.dataset.rate) } }); draw(); } catch (err) { toast(err.message, 'err'); } });
    const f = $('#rForm');
    if (f) {
      const send = async () => { const text = f.text.value.trim(); if (!text) return; try { tk = await api(`/api/tickets/${tk.id}/messages`, { method: 'POST', body: { text, note: !!(f.note && f.note.checked) } }); draw(); } catch (err) { toast(err.message, 'err'); } };
      f.onsubmit = e => { e.preventDefault(); send(); };
      f.text.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
      f.text.focus();
    }
  };
  draw();
  const poll = setInterval(async () => { if (S.route !== 'ticket' || S.params.id !== id) return clearInterval(poll); const f = $('#rForm'); if (f && f.text.value) return; try { const fresh = await api('/api/tickets/' + encodeURIComponent(id)); if (fresh.messages.length !== tk.messages.length || fresh.status !== tk.status) { tk = fresh; draw(); } } catch { } }, 8000);
};

// admin screen in the router + sidebar (native instead of the web window)
const _go2 = go;
go = function (route, params, noHistory) {
  if (route !== 'admin') return _go2(route, params, noHistory);
  params = params || {};
  if (!noHistory && S.route !== 'admin') S.history.push([S.route, S.params]);
  S.route = 'admin'; S.params = params;
  $('#backBtn').disabled = !S.history.length;
  renderNav(); view.scrollTop = 0; view.innerHTML = '<div class="spin"></div>';
  const seq = ++go.seq;
  Promise.resolve(vAdmin(params, () => seq !== go.seq)).catch(err => { if (seq === go.seq) view.innerHTML = `<div class="view-in">${emptyBox('wifi', t('error'), err.message)}</div>`; });
};
go.seq = _go2.seq;
const _renderNav2 = renderNav;
renderNav = function () {
  _renderNav2();
  const a = $('#nav [data-sitewin="/admin"]');
  if (a) { const n = a.cloneNode(true); n.removeAttribute('data-sitewin'); n.dataset.go = 'admin'; n.classList.toggle('on', S.route === 'admin'); a.replaceWith(n); bindCommon($('#nav')); }
};

// a new app version: popup once per launch, plus the bar at the bottom
let updPopupShown = false;
const _drawUpdate = drawUpdate;
drawUpdate = function (st) {
  _drawUpdate(st);
  if (!st || !st.available || st.blocked || updPopupShown) return;
  updPopupShown = true;
  const m = document.createElement('div');
  m.className = 'modal-back';
  m.innerHTML = `<div class="card upd-modal"><div class="upd-ic">${ic('download', 'xl')}</div><h2>${t('upd_title')}</h2><p>${esc(t('upd_text', st.version))}</p><p class="faint" style="font-size:13px">${esc(t('upd_days', st.daysLeft))}</p>
    <div class="row" style="justify-content:center;margin-top:18px"><button class="btn primary lg" id="updPopGo">${ic('download', 'sm')} ${t('upd_now')}</button><button class="btn lg ghost" id="updPopLater">${t('upd_later')}</button></div></div>`;
  document.body.appendChild(m);
  $('#updPopLater').onclick = () => m.remove();
  $('#updPopGo').onclick = () => { $('#updPopGo').disabled = true; B.installUpdate(); m.remove(); };
};
B.updateState().then(drawUpdate).catch(() => { });
B.onUpdateState(st => drawUpdate(st));


/* ================= maintenance mode ================= */
// When the admin turns maintenance on, the server answers 503 {maintenance:true} to everyone except staff
// and people on the allow list. The app then shows a maintenance screen and checks back by itself.
Object.assign(I18N.he, { maint_title: 'Craft Hub בתחזוקה', maint_default: 'אנחנו משדרגים את Craft Hub — נחזור בקרוב. תודה על הסבלנות!', maint_check: 'בודק שוב…', maint_retry: 'נסה עכשיו', maint_auto: 'האפליקציה תחזור לבד כשהתחזוקה תסתיים', maint_staff: 'מצב תחזוקה פעיל — רק הצוות רואה את האפליקציה' });
Object.assign(I18N.en, { maint_title: 'Craft Hub is under maintenance', maint_default: "We're upgrading Craft Hub — back soon. Thanks for your patience!", maint_check: 'Checking…', maint_retry: 'Try now', maint_auto: 'The app comes back by itself when maintenance ends', maint_staff: 'Maintenance is on — only staff can see the app' });
const MAINT = { on: false, timer: null };
function showMaintenance() {
  if (MAINT.on) return;
  MAINT.on = true;
  const m = (S.site && S.site.maintenance) || {};
  const msg = (LANG === 'en' && m.messageEn) || m.message || t('maint_default');
  const el = document.createElement('div');
  el.id = 'maintScreen';
  el.innerHTML = `<div class="maint-in"><div class="maint-ic">${ic('tool', 'xl')}</div><h1>${t('maint_title')}</h1><p>${esc(msg)}</p>
    <button class="btn primary lg" id="maintRetry">${ic('refresh', 'sm')} ${t('maint_retry')}</button><div class="faint" id="maintSt" style="margin-top:14px;font-size:14px">${t('maint_auto')}</div>
    ${S.me && S.me.user ? '' : `<button class="btn ghost" id="maintLogin" style="margin-top:10px">${ic('user', 'sm')} ${t('login')}</button>`}</div>`;
  document.body.appendChild(el);
  $('#maintRetry').onclick = checkMaintenance;
  const ml = $('#maintLogin'); if (ml) ml.onclick = async () => { await doLogin(); checkMaintenance(); };
  MAINT.timer = setInterval(checkMaintenance, 30000);
}
async function checkMaintenance() {
  const st = $('#maintSt'); if (st) st.textContent = t('maint_check');
  const r = await B.api('/api/projects');
  if (r.status === 200) {
    MAINT.on = false; clearInterval(MAINT.timer);
    const el = $('#maintScreen'); if (el) el.remove();
    await loadMe(); go(S.route, S.params, true);
  } else if (st) setTimeout(() => { st.textContent = t('maint_auto'); }, 800);
}
const _apiM = api;
api = async function (path, opts) {
  try { return await _apiM(path, opts); }
  catch (e) { if (e.status === 503 && e.data && e.data.maintenance) showMaintenance(); throw e; }
};
// staff who can still get in see a small reminder bar
function maintStaffBar() {
  const on = S.site && S.site.maintenance && S.site.maintenance.enabled;
  // regular users: the maintenance screen right away; staff / allow list: a reminder bar
  if (on && S.me && !S.me.maintenanceAccess) { showMaintenance(); return; }
  if (MAINT.on && (!on || (S.me && S.me.maintenanceAccess))) { checkMaintenance(); return; }
  let bar = $('#maintStaffBar');
  if (on && !MAINT.on) { if (!bar) { bar = document.createElement('div'); bar.id = 'maintStaffBar'; bar.innerHTML = `${ic('tool', 'sm')} ${t('maint_staff')}`; $('#main').insertBefore(bar, $('#view')); } }
  else if (bar) bar.remove();
}
setInterval(() => api('/api/site').then(x => { S.site = x; maintStaffBar(); }).catch(() => { }), 60000);


/* ================= everything the website had: likes, reviews, follows, studio, creator apply, partners, profile ================= */
Object.assign(I18N.he, {
  like: 'לייק', liked: 'אהבת', follow_proj: 'עקוב', following_proj: 'במעקב', reviews_t: 'ביקורות', write_review: 'כתוב ביקורת', edit_review: 'ערוך את הביקורת שלך', review_ph: 'מה דעתך?', pick_stars: 'בחר כוכבים', review_saved: 'הביקורת נשמרה ✓', no_reviews: 'עוד אין ביקורות', login_to_review: 'התחבר כדי לכתוב ביקורת',
  following_page: 'עוקב', feed: 'חדש ממי שאני עוקב', feed_empty: 'אין עדיין עדכונים — עקוב אחרי קרייטורים ופרויקטים', feed_new: 'פרויקט חדש', feed_update: 'גרסה חדשה', people_i_follow: 'אנשים שאני עוקב אחריהם', projects_i_follow: 'פרויקטים שאני עוקב אחריהם',
  studio: 'הפרויקטים שלי', studio_sub: 'העלאה, עריכה וגרסאות חדשות', new_project: 'פרויקט חדש', pick_type: 'מה מעלים?', choose_file: 'בחירת קובץ', reading: 'קורא את הקובץ…', publish_p: 'פרסום', project_published: 'הפרויקט פורסם ✓',
  name: 'שם', short: 'תיאור קצר', long: 'תיאור מלא', tags: 'תגיות (מופרדות בפסיק)', notes: 'מה חדש בגרסה', version_n: 'מספר גרסה', edit_project: 'עריכת פרויקט', new_version_up: 'העלאת גרסה חדשה', change_icon: 'שינוי אייקון', add_image: 'הוספת תמונה לגלריה', show_on: 'מוצג לכולם', delete_project: 'מחיקת הפרויקט', version_ok: 'הגרסה עלתה ✓', no_my_projects: 'עוד לא העלית פרויקטים', limit_left: 'נשארו לך {x} העלאות',
  become_creator: 'להפוך לקרייטור', apply_sub: 'קרייטורים מעלים ללא הגבלה ומקבלים תג בפרופיל', apply_send: 'שליחת הבקשה', apply_sent: 'הבקשה נשלחה ✓', apply_pending: 'הבקשה שלך ממתינה לבדיקה', apply_rejected: 'הבקשה הקודמת נדחתה', already_creator: 'אתה כבר קרייטור 🎉', need_google: 'כדי להגיש בקשה צריך להתחבר עם Google',
  partners: 'שותפים', partners_sub: 'שרתים ואתרים שעובדים איתנו', team: 'הצוות', visit: 'כניסה', members: 'חברים',
  profile: 'הפרופיל שלי', display_name: 'שם תצוגה', bio: 'על עצמי', mc_user: 'שם במיינקראפט', socials: 'רשתות חברתיות', save: 'שמירה',
  add_server: 'הוספת שרת', my_servers: 'השרתים שלי', edit_server: 'עריכת שרת', server_address: 'כתובת השרת', srv_short: 'תיאור קצר', srv_desc: 'תיאור מלא', srv_version: 'גרסה', srv_discord: 'קישור דיסקורד', srv_website: 'אתר', votifier: 'חיבור הצבעות (Votifier)', vf_host: 'כתובת', vf_port: 'פורט', vf_key: 'מפתח ציבורי',
  upload_icon: 'אייקון', upload_banner: 'באנר', test_vote: 'הצבעת בדיקה', test_ok: 'הבדיקה הגיעה לשרת ✓', delete_server: 'מחיקת השרת', server_saved: 'השרת נשמר ✓', veteran: 'ותיק'
});
Object.assign(I18N.en, {
  like: 'Like', liked: 'Liked', follow_proj: 'Follow', following_proj: 'Following', reviews_t: 'Reviews', write_review: 'Write a review', edit_review: 'Edit your review', review_ph: 'What do you think?', pick_stars: 'Pick stars', review_saved: 'Review saved ✓', no_reviews: 'No reviews yet', login_to_review: 'Sign in to review',
  following_page: 'Following', feed: 'New from people I follow', feed_empty: 'Nothing yet — follow creators and projects', feed_new: 'New project', feed_update: 'New version', people_i_follow: 'People I follow', projects_i_follow: 'Projects I follow',
  studio: 'My projects', studio_sub: 'Upload, edit and release new versions', new_project: 'New project', pick_type: 'What are you uploading?', choose_file: 'Choose file', reading: 'Reading the file…', publish_p: 'Publish', project_published: 'Project published ✓',
  name: 'Name', short: 'Short description', long: 'Full description', tags: 'Tags (comma separated)', notes: "What's new in this version", version_n: 'Version number', edit_project: 'Edit project', new_version_up: 'Upload a new version', change_icon: 'Change icon', add_image: 'Add gallery image', show_on: 'Visible to everyone', delete_project: 'Delete project', version_ok: 'Version uploaded ✓', no_my_projects: "You haven't uploaded anything yet", limit_left: '{x} uploads left',
  become_creator: 'Become a creator', apply_sub: 'Creators upload without limits and get a profile badge', apply_send: 'Send request', apply_sent: 'Request sent ✓', apply_pending: 'Your request is waiting for review', apply_rejected: 'Your last request was rejected', already_creator: "You're a creator 🎉", need_google: 'Sign in with Google to apply',
  partners: 'Partners', partners_sub: 'Servers and sites that work with us', team: 'The team', visit: 'Visit', members: 'members',
  profile: 'My profile', display_name: 'Display name', bio: 'About me', mc_user: 'Minecraft username', socials: 'Social links', save: 'Save',
  add_server: 'Add server', my_servers: 'My servers', edit_server: 'Edit server', server_address: 'Server address', srv_short: 'Short description', srv_desc: 'Full description', srv_version: 'Version', srv_discord: 'Discord link', srv_website: 'Website', votifier: 'Vote connection (Votifier)', vf_host: 'Host', vf_port: 'Port', vf_key: 'Public key',
  upload_icon: 'Icon', upload_banner: 'Banner', test_vote: 'Test vote', test_ok: 'The test reached your server ✓', delete_server: 'Delete server', server_saved: 'Server saved ✓', veteran: 'Veteran'
});
Object.assign(ICONS, { image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>', edit: '<path d="M4 20h4L19 9l-4-4L4 16Z"/>', handshake: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a3 3 0 0 0-4.2 0l-.9.9a1 1 0 1 1-3-3l2.8-2.8a5.8 5.8 0 0 1 7-.9l.5.3a2 2 0 0 0 1.4.3L21 4"/><path d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3M3 4h8"/>' });
const upErr = r => (r && r.data && r.data.error) || t('error');

/* ---------- reviews (projects and servers share the same API shape) ---------- */
async function reviewsCard(box, base) {
  box.innerHTML = '<div class="spin" style="width:26px;height:26px;margin:20px auto"></div>';
  let d;
  try { d = await api(base + '/reviews'); } catch (e) { box.innerHTML = `<p class="faint">${esc(e.message)}</p>`; return; }
  const mine = d.reviews.find(r => r.mine);
  let pick = mine ? mine.rating : 0;
  const avg = d.reviews.length ? Math.round(d.reviews.reduce((s, r) => s + r.rating, 0) / d.reviews.length * 10) / 10 : null;
  box.innerHTML = `<div class="rv-top"><div class="rv-avg"><b>${avg != null ? avg : '—'}</b><span class="stars-big">${avg != null ? '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg)) : '☆☆☆☆☆'}</span><small class="faint">${d.reviews.length} ${t('reviews_t')}</small></div>
    ${d.canReview ? `<form class="rv-form" id="rvF"><b>${mine ? t('edit_review') : t('write_review')}</b><div class="row" id="rvS">${[1, 2, 3, 4, 5].map(n => `<button type="button" class="star-btn" data-n="${n}">★</button>`).join('')}</div><textarea name="text" rows="3" maxlength="1500" placeholder="${t('review_ph')}">${esc(mine ? mine.text : '')}</textarea><button class="btn primary">${ic('send', 'sm')} ${t('send')}</button></form>`
      : !(S.me && S.me.user) ? `<div class="rv-form"><span class="faint">${t('login_to_review')}</span><button class="btn primary" id="rvLogin">${ic('user', 'sm')} ${t('login')}</button></div>` : ''}</div>
    <div class="rv-list">${d.reviews.length ? d.reviews.map(r => `<div class="rv"><img class="av" src="${esc(siteImg(r.avatar) || r.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png')}" alt=""><div style="flex:1;min-width:0"><div class="row" style="gap:10px;flex-wrap:wrap"><b>${esc(r.name)}</b><span class="stars-sm">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span><span class="faint">${timeAgo(r.at)}</span>${r.canDelete ? `<button class="icon-btn" data-rdel="${esc(r.id)}">${ic('trash', 'sm')}</button>` : ''}</div>${r.text ? `<p>${esc(r.text)}</p>` : ''}</div></div>`).join('') : `<p class="faint">${t('no_reviews')}</p>`}</div>`;
  const paint = n => box.querySelectorAll('#rvS .star-btn').forEach(b => b.classList.toggle('on', Number(b.dataset.n) <= n));
  paint(pick);
  box.querySelectorAll('#rvS .star-btn').forEach(b => { b.onmouseenter = () => paint(Number(b.dataset.n)); b.onclick = () => { pick = Number(b.dataset.n); paint(pick); }; });
  const rs = box.querySelector('#rvS'); if (rs) rs.onmouseleave = () => paint(pick);
  const f = box.querySelector('#rvF');
  if (f) f.onsubmit = async e => { e.preventDefault(); if (!pick) return toast(t('pick_stars'), 'err'); try { await api(base + '/reviews', { method: 'POST', body: { rating: pick, text: f.text.value } }); toast(t('review_saved')); reviewsCard(box, base); } catch (err) { toast(err.message, 'err'); } };
  const rl = box.querySelector('#rvLogin'); if (rl) rl.onclick = async () => { if (await doLogin()) reviewsCard(box, base); };
  box.querySelectorAll('[data-rdel]').forEach(b => b.onclick = async () => { if (!confirm(t('confirm_delete', ''))) return; try { await api(`${base}/reviews/${b.dataset.rdel}`, { method: 'DELETE' }); reviewsCard(box, base); } catch (e) { toast(e.message, 'err'); } });
}

/* ---------- project page: like, follow, reviews ---------- */
const _vProject = vProject;
vProject = async function (params, stale) {
  await _vProject(params, stale);
  if (stale() || !S.params.project) return;
  const p = S.params.project;
  const acts = view.querySelector('.phead .acts');
  if (acts) {
    acts.insertAdjacentHTML('beforeend', `<button class="btn lg ${p.liked ? 'ok' : ''}" id="likeB">${ic('heart', 'sm')} <span>${fmtNum(p.likes || 0)}</span></button><button class="btn lg" id="pfB">${ic('bell', 'sm')} ${t('follow_proj')}</button>`);
    $('#likeB').onclick = async () => { if (!(S.me && S.me.user)) return doLogin(); try { const r = await api(`/api/projects/${encodeURIComponent(p.slug)}/like`, { method: 'POST', body: {} }); p.liked = r.liked; $('#likeB').classList.toggle('ok', r.liked); $('#likeB span').textContent = fmtNum(r.likes); } catch (e) { toast(e.message, 'err'); } };
    const drawF = r => { $('#pfB').classList.toggle('ok', r.following); $('#pfB').innerHTML = `${ic(r.following ? 'check' : 'bell', 'sm')} ${r.following ? t('following_proj') : t('follow_proj')} <span class="faint">${fmtNum(r.followers)}</span>`; };
    api(`/api/projects/${encodeURIComponent(p.slug)}/follow`).then(drawF).catch(() => { });
    $('#pfB').onclick = async () => { if (!(S.me && S.me.user)) return doLogin(); try { drawF(await api(`/api/projects/${encodeURIComponent(p.slug)}/follow`, { method: 'POST', body: {} })); } catch (e) { toast(e.message, 'err'); } };
  }
  view.querySelector('.view-in').insertAdjacentHTML('beforeend', `<div class="card" style="margin-top:22px"><div class="card-h">${ic('star')}<h3>${t('reviews_t')}</h3></div><div class="card-b" id="pRev"></div></div>`);
  reviewsCard($('#pRev'), '/api/projects/' + encodeURIComponent(p.slug));
};

/* ---------- following feed ---------- */
async function vFollowing(p, stale) {
  if (!S.me || !S.me.user) return needLogin();
  const [feed, people, projs] = await Promise.all([api('/api/me/feed').catch(() => []), api('/api/me/following').catch(() => []), api('/api/me/following-projects').catch(() => [])]);
  if (stale()) return;
  put(`<div class="head"><h1>${ic('bell', 'lg')} ${t('following_page')}</h1></div>
    <div class="play-layout"><div class="card"><div class="card-h">${ic('sparkle')}<h3>${t('feed')}</h3></div><div class="card-b">${feed.length ? feed.map(f => `<div class="lrow big" data-go="project:slug:${esc(f.id)}"><img class="av" src="${esc(siteImg(f.ownerAvatar) || f.ownerAvatar || '')}" alt=""><div style="flex:1;min-width:0"><b>${esc(f.ownerName)}</b> <span class="chip ${f.type === 'update' ? 'accent' : ''}">${f.type === 'update' ? t('feed_update') : t('feed_new')}</span><div class="faint">${esc(f.name)} · v${esc(f.version || '')}</div></div><span class="faint">${timeAgo(f.updatedAt)}</span></div>`).join('') : emptyBox('bell', t('feed_empty'))}</div></div>
    <aside class="stack"><div class="card"><div class="card-h">${ic('users')}<h3>${t('people_i_follow')}</h3></div><div class="card-b">${people.map(u => `<div class="lrow big" data-go="user:id:${esc(u.id)}"><img class="av" src="${esc(siteImg(u.avatar) || u.avatar || '')}" alt=""><b style="flex:1">${esc(u.name)}</b><span class="faint">${fmtNum(u.followers)}</span></div>`).join('') || '<p class="faint">—</p>'}</div></div>
      <div class="card"><div class="card-h">${ic('box')}<h3>${t('projects_i_follow')}</h3></div><div class="card-b">${projs.map(x => `<div class="lrow big" data-go="project:slug:${esc(x.slug)}">${pic(x, 'sm')}<b style="flex:1">${esc(x.name)}</b></div>`).join('') || '<p class="faint">—</p>'}</div></div></aside></div>`);
}

/* ---------- studio: my projects, upload, edit ---------- */
async function vStudio(p, stale) {
  if (!S.me || !S.me.user) return needLogin();
  if (p.slug) return studioEdit(p.slug, stale);
  if (p.new) return studioNew(stale);
  const [mine, cm] = await Promise.all([api('/api/studio/projects'), api('/api/creator/me').catch(() => ({}))]);
  if (stale()) return;
  const left = S.me.uploadLimit ? Math.max(0, S.me.uploadLimit - (S.me.myProjects || mine.length)) : null;
  put(`<div class="head"><div><h1>${ic('box', 'lg')} ${t('studio')}</h1><p>${t('studio_sub')}${left != null ? ` · ${t('limit_left', left)}` : ''}</p></div><span class="spacer"></span>
      ${!cm.isCreator ? `<button class="btn lg" data-go="apply">${ic('badge', 'sm')} ${t('become_creator')}</button>` : ''}<button class="btn primary lg" data-go="studio:new:1" ${left === 0 ? 'disabled' : ''}>${ic('upload', 'sm')} ${t('new_project')}</button></div>
    ${mine.length ? `<div class="grid">${mine.map(x => `<div class="pcard" data-go="studio:slug:${esc(x.slug)}"><div class="top">${pic(x)}<div style="min-width:0"><b>${esc(x.name)}</b><div class="by">${esc(typeName(x.type || 'plugin'))} · v${esc(x.version || '')}</div></div></div><p>${esc(x.short || '')}</p><div class="foot"><span class="stat">${ic('download', 'sm')} ${fmtNum(x.downloads)}</span><span class="stat">${ic('heart', 'sm')} ${fmtNum(x.likes || 0)}</span>${x.visible === false ? `<span class="chip">${t('hidden')}</span>` : ''}<span class="btn sm" style="margin-inline-start:auto">${ic('edit', 'sm')} ${t('edit_project')}</span></div></div>`).join('')}</div>` : emptyBox('box', t('no_my_projects'))}`);
}
async function studioNew(stale) {
  const types = Object.entries(S.site.projectTypes || { plugin: { exts: ['.jar'] } });
  put(`<div class="head"><h1>${ic('upload', 'lg')} ${t('new_project')}</h1></div><h2 style="margin-bottom:16px">${t('pick_type')}</h2>
    <div class="type-grid">${types.map(([k, v]) => `<button class="type-card" data-type="${esc(k)}"><b>${esc(typeName(k))}</b><span class="faint mono">${esc((v.exts || []).join(' / '))}</span></button>`).join('')}</div><div id="stNext"></div>`);
  view.querySelectorAll('[data-type]').forEach(b => b.onclick = async () => {
    const type = b.dataset.type, exts = ((S.site.projectTypes || {})[type] || {}).exts || ['.jar'];
    b.disabled = true; b.querySelector('b').textContent = t('reading');
    const r = await B.uploadFile({ apiPath: '/api/studio/draft', field: 'file', fields: { type }, filters: [{ name: typeName(type), extensions: exts.map(x => x.replace('.', '')) }] });
    b.disabled = false; b.querySelector('b').textContent = typeName(type);
    if (r.canceled) return;
    if (r.status !== 200) return toast(upErr(r), 'err');
    const d = r.data, cats = ((S.site.projectTypes || {})[type] || {}).categories || [];
    $('#stNext').innerHTML = `<form class="card" id="pubF" style="margin-top:22px"><div class="card-h">${d.info.icon ? `<img src="${esc(d.info.icon)}" class="av" style="border-radius:10px">` : ''}<h3>${esc(r.fileName)}</h3><span class="faint">${fmtSize(d.size)}</span></div><div class="card-b form2">
      <div><label class="lbl">${t('name')}</label><input type="text" name="name" required maxlength="60" value="${esc(d.info.name || '')}"></div>
      <div><label class="lbl">${t('category')}</label><select name="category">${cats.map(c => `<option ${c === d.info.category ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></div>
      <div class="full"><label class="lbl">${t('short')}</label><input type="text" name="short" required maxlength="200" value="${esc(d.info.short || '')}"></div>
      ${d.info.versionDetected ? '' : `<div><label class="lbl">${t('version_n')}</label><input type="text" name="version" value="1.0.0" required class="ltr"></div>`}
      <div class="full"><label class="lbl">${t('long')}</label><textarea name="description" rows="8">${esc(d.info.description || '')}</textarea></div>
      <div class="full"><button class="btn primary lg">${ic('upload', 'sm')} ${t('publish_p')}</button></div></div></form>`;
    $('#pubF').onsubmit = async e => {
      e.preventDefault(); const f = e.target;
      try { const pr = await api('/api/studio/projects', { method: 'POST', body: { token: d.token, name: f.name.value.trim(), category: f.category.value, short: f.short.value.trim(), description: f.description.value, version: f.version ? f.version.value.trim() : undefined, useDetectedIcon: true } }); toast(t('project_published')); S.projectsAt = 0; go('studio', { slug: pr.slug }); }
      catch (err) { toast(err.message, 'err'); }
    };
    $('#pubF').scrollIntoView({ behavior: 'smooth' });
  });
}
async function studioEdit(slug, stale) {
  const p = await api('/api/studio/projects/' + encodeURIComponent(slug));
  if (stale()) return;
  const cats = ((S.site.projectTypes || {})[p.type || 'plugin'] || {}).categories || [];
  const exts = ((S.site.projectTypes || {})[p.type || 'plugin'] || {}).exts || ['.jar'];
  const base = '/api/studio/projects/' + encodeURIComponent(slug);
  put(`<div class="head">${pic(p, 'xl')}<div><h1>${esc(p.name)}</h1><p>${esc(typeName(p.type || 'plugin'))} · v${esc(p.version || '')} · ${fmtNum(p.downloads)} ${t('downloads')}</p></div><span class="spacer"></span><button class="btn lg" data-go="project:slug:${esc(slug)}">${ic('eye', 'sm')}</button></div>
    <div class="play-layout">
      <form class="card" id="edF"><div class="card-h">${ic('edit')}<h3>${t('edit_project')}</h3></div><div class="card-b form2">
        <div><label class="lbl">${t('name')}</label><input type="text" name="name" required maxlength="60" value="${esc(p.name)}"></div>
        <div><label class="lbl">${t('category')}</label><select name="category">${cats.map(c => `<option ${c === p.category ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></div>
        <div class="full"><label class="lbl">${t('short')}</label><input type="text" name="short" maxlength="200" value="${esc(p.short || '')}"></div>
        <div class="full"><label class="lbl">${t('tags')}</label><input type="text" name="tags" value="${esc((p.tags || []).join(', '))}"></div>
        <div class="full"><label class="lbl">${t('long')}</label><textarea name="description" rows="12">${esc(p.description || '')}</textarea></div>
        <label class="row full"><label class="tgl"><input type="checkbox" name="visible" ${p.visible !== false ? 'checked' : ''}><span></span></label> ${t('show_on')}</label>
        <div class="full"><button class="btn primary lg">${ic('check', 'sm')} ${t('save')}</button></div></div></form>
      <aside class="stack">
        <div class="card"><div class="card-h">${ic('upload')}<h3>${t('new_version_up')}</h3></div><div class="card-b stack" style="gap:10px"><input type="text" id="nvVer" class="ltr" placeholder="${t('version_n')} (auto)"><textarea id="nvNotes" rows="3" placeholder="${t('notes')}"></textarea><button class="btn primary" id="nvUp">${ic('upload', 'sm')} ${t('choose_file')}</button></div></div>
        <div class="card card-b stack" style="gap:10px"><button class="btn" id="icUp">${ic('image', 'sm')} ${t('change_icon')}</button><button class="btn" id="galUp">${ic('image', 'sm')} ${t('add_image')} (${(p.gallery || []).length}/8)</button></div>
        <button class="btn danger lg" id="delP">${ic('trash', 'sm')} ${t('delete_project')}</button>
      </aside></div>`);
  $('#edF').onsubmit = async e => { e.preventDefault(); const f = e.target; try { await api(base, { method: 'PUT', body: { name: f.name.value.trim(), category: f.category.value, short: f.short.value.trim(), tags: f.tags.value, description: f.description.value, visible: f.visible.checked } }); toast(t('saved')); S.projectsAt = 0; } catch (err) { toast(err.message, 'err'); } };
  $('#nvUp').onclick = async () => { const r = await B.uploadFile({ apiPath: base + '/version', field: 'file', fields: { version: $('#nvVer').value.trim(), notes: $('#nvNotes').value }, filters: [{ name: typeName(p.type || 'plugin'), extensions: exts.map(x => x.replace('.', '')) }] }); if (r.canceled) return; if (r.status !== 200) return toast(upErr(r), 'err'); toast(t('version_ok')); S.projectsAt = 0; go('studio', { slug }, true); };
  const img = [{ name: 'Image', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] }];
  $('#icUp').onclick = async () => { const r = await B.uploadFile({ apiPath: base + '/icon', field: 'icon', filters: img }); if (r.canceled) return; if (r.status !== 200) return toast(upErr(r), 'err'); toast(t('saved')); go('studio', { slug }, true); };
  $('#galUp').onclick = async () => { const r = await B.uploadFile({ apiPath: base + '/gallery', field: 'image', filters: img }); if (r.canceled) return; if (r.status !== 200) return toast(upErr(r), 'err'); toast(t('saved')); go('studio', { slug }, true); };
  $('#delP').onclick = async () => { if (!confirm(t('confirm_delete', p.name))) return; try { await api(base, { method: 'DELETE' }); toast(t('deleted')); S.projectsAt = 0; go('studio', {}); } catch (err) { toast(err.message, 'err'); } };
}

/* ---------- become a creator ---------- */
async function vApply(p, stale) {
  if (!S.me || !S.me.user) return needLogin();
  const d = await api('/api/creator/me');
  if (stale()) return;
  if (d.isCreator) return put(emptyBox('badge', t('already_creator')));
  const a = d.application;
  put(`<div class="head"><div><h1>${ic('badge', 'lg')} ${t('become_creator')}</h1><p>${t('apply_sub')}</p></div></div>
    ${a && a.status === 'pending' ? `<div class="card card-b empty">${ic('clock')}<b>${t('apply_pending')}</b></div>` : `
    ${a && a.status === 'rejected' ? `<div class="offline" style="color:#ffb4b4">${t('apply_rejected')}${a.reason ? ': ' + esc(a.reason) : ''}</div>` : ''}
    ${S.me.user.provider !== 'google' ? `<div class="offline">${t('need_google')}</div>` : ''}
    <form class="card" id="apF" style="max-width:820px"><div class="card-b stack">${(d.questions || []).map((q, i) => `<div><label class="lbl">${esc(q)}</label><textarea name="q${i}" rows="3" required></textarea></div>`).join('')}<button class="btn primary lg">${ic('send', 'sm')} ${t('apply_send')}</button></div></form>`}`);
  const f = $('#apF');
  if (f) f.onsubmit = async e => { e.preventDefault(); try { await api('/api/creator/apply', { method: 'POST', body: { answers: (d.questions || []).map((q, i) => f['q' + i].value.trim()) } }); toast(t('apply_sent')); go('apply', {}, true); } catch (err) { toast(err.message, 'err'); } };
}

/* ---------- partners + team ---------- */
async function vPartners(p, stale) {
  const [list, team] = await Promise.all([api('/api/partners').catch(() => []), api('/api/team').catch(() => [])]);
  if (stale()) return;
  const card = x => `<div class="partner" data-ext="${esc(x.url)}"><div class="pic">${siteImg(x.logo) || /^https:/.test(x.logo || '') ? `<img src="${esc(siteImg(x.logo) || x.logo)}" alt="">` : esc((x.name || '?').charAt(0))}</div><div style="flex:1;min-width:0"><div class="row" style="gap:8px"><b>${esc(x.name)}</b><span class="chip ${x.type === 'discord' ? 'accent' : ''}">${x.type === 'discord' ? 'Discord' : t('website')}</span></div>${x.description ? `<p>${esc(x.description)}</p>` : ''}${x.members ? `<small class="faint">${ic('users', 'sm')} ${esc(x.members)} ${t('members')}</small>` : ''}</div><span class="btn sm">${ic('ext', 'sm')} ${t('visit')}</span></div>`;
  put(`<div class="head"><div><h1>${ic('handshake', 'lg')} ${t('partners')}</h1><p>${t('partners_sub')}</p></div></div>
    ${list.length ? `<div class="partners">${list.map(card).join('')}</div>` : emptyBox('handshake', t('no_results'))}
    ${team.length ? `<h2 style="margin:34px 0 16px">${ic('shield')} ${t('team')}</h2><div class="team">${team.map(m => `<div class="tm" data-go="user:id:${esc(m.id)}"><img src="${esc(siteImg(m.avatar) || m.avatar || '')}" alt=""><b>${esc(m.name || '')}</b>${m.title || m.owner ? `<span class="chip accent">${esc(m.title || 'Owner')}</span>` : ''}</div>`).join('')}</div>` : ''}`);
}

/* ---------- my profile (in settings) ---------- */
const _vSettings = vSettings;
vSettings = async function (p, stale) {
  await _vSettings(p, stale);
  if (stale() || !(S.me && S.me.user)) return;
  const [st, mc] = await Promise.all([api('/api/user/settings').catch(() => ({})), api('/api/me/minecraft').catch(() => ({}))]);
  if (stale()) return;
  const so = st.socials || {};
  const stack = view.querySelector('.view-in .stack');
  if (!stack) return;
  stack.insertAdjacentHTML('afterbegin', `<form class="card" id="profF"><div class="card-h">${ic('user')}<h3>${t('profile')}</h3></div><div class="card-b form2">
    <div><label class="lbl">${t('display_name')}</label><input type="text" name="customName" maxlength="32" value="${esc(st.customName || '')}"></div>
    <div><label class="lbl">${t('mc_user')}</label><input type="text" name="mc" maxlength="16" class="ltr" value="${esc(mc.username || '')}" placeholder="Steve"></div>
    <div class="full"><label class="lbl">${t('bio')}</label><textarea name="bio" rows="3" maxlength="500">${esc(st.bio || '')}</textarea></div>
    ${['discord', 'youtube', 'github', 'website'].map(k => `<div><label class="lbl">${k[0].toUpperCase() + k.slice(1)}</label><input type="text" name="so_${k}" class="ltr" value="${esc(so[k] || '')}" placeholder="https://"></div>`).join('')}
    <div class="full"><button class="btn primary lg">${ic('check', 'sm')} ${t('save')}</button></div></div></form>`);
  $('#profF').onsubmit = async e => {
    e.preventDefault(); const f = e.target;
    try {
      await api('/api/user/settings', { method: 'PUT', body: { customName: f.customName.value.trim(), bio: f.bio.value, theme: st.theme || '', socials: Object.fromEntries(['discord', 'youtube', 'github', 'website'].map(k => [k, f['so_' + k].value.trim()])) } });
      if (f.mc.value.trim() !== (mc.username || '')) await api('/api/me/minecraft', { method: 'PUT', body: { username: f.mc.value.trim() } });
      toast(t('saved')); loadMe();
    } catch (err) { toast(err.message, 'err'); }
  };
};

/* ---------- servers: add / edit my servers, reviews on the server page ---------- */
const _vServers = vServers;
vServers = async function (p, stale) {
  await _vServers(p, stale);
  if (stale()) return;
  const head = view.querySelector('.head');
  if (head) head.insertAdjacentHTML('beforeend', `<span class="spacer"></span>${S.me && S.me.user ? `<button class="btn lg" data-go="myservers">${ic('globe', 'sm')} ${t('my_servers')}</button>` : ''}<button class="btn primary lg" id="addSrv">${ic('plus', 'sm')} ${t('add_server')}</button>`);
  const a = $('#addSrv'); if (a) a.onclick = async () => { if (!(S.me && S.me.user) && !(await doLogin())) return; go('srvedit', {}); };
  bindCommon(view);
};
const _vServer = vServer;
vServer = async function (params, stale) {
  await _vServer(params, stale);
  if (stale()) return;
  view.querySelector('.view-in').insertAdjacentHTML('beforeend', `<div class="card" style="margin-top:22px"><div class="card-h">${ic('star')}<h3>${t('reviews_t')}</h3></div><div class="card-b" id="sRev"></div></div>`);
  reviewsCard($('#sRev'), '/api/servers/' + encodeURIComponent(params.slug));
  api('/api/servers/' + encodeURIComponent(params.slug)).then(s => {
    const h1 = view.querySelector('.srv-hero h1');
    if (s.veteran && h1 && !view.querySelector('.vet')) h1.insertAdjacentHTML('afterend', `<span class="chip accent vet">${ic('crown', 'sm')} ${t('veteran')}</span>`);
    if (s.canEdit) { const row = view.querySelector('.srv-hero .row:last-child'); if (row) { row.insertAdjacentHTML('beforeend', `<button class="btn" data-go="srvedit:slug:${esc(s.slug)}">${ic('edit', 'sm')} ${t('edit_server')}</button>`); bindCommon(row); } }
  }).catch(() => { });
};
async function vMyServers(p, stale) {
  if (!S.me || !S.me.user) return needLogin();
  const list = await api('/api/servers/mine');
  if (stale()) return;
  put(`<div class="head"><h1>${ic('globe', 'lg')} ${t('my_servers')}</h1><span class="spacer"></span><button class="btn primary lg" data-go="srvedit">${ic('plus', 'sm')} ${t('add_server')}</button></div>
    <div class="stack" style="gap:10px">${list.map(s => `<div class="srv" data-go="srvedit:slug:${esc(s.slug)}">${pic(s)}<div class="body"><b>${esc(s.name)}</b><p class="mono ltr">${esc(s.address)}</p></div><span class="stat">${ic('star', 'sm')} ${fmtNum(s.votesMonth)}</span><span class="btn sm">${ic('edit', 'sm')} ${t('edit_server')}</span></div>`).join('') || emptyBox('globe', t('no_results'))}</div>`);
}
async function vSrvEdit(p, stale) {
  if (!S.me || !S.me.user) return needLogin();
  const [s, all] = await Promise.all([p.slug ? api('/api/servers/' + encodeURIComponent(p.slug)) : Promise.resolve({ tags: [], votifier: { port: 8192 } }), api('/api/servers')]);
  if (stale()) return;
  const v = s.votifier || {}, sel = new Set(s.tags || []);
  put(`<div class="head"><h1>${ic('globe', 'lg')} ${p.slug ? t('edit_server') : t('add_server')}</h1>${p.slug ? `<span class="spacer"></span><button class="btn lg" data-go="server:slug:${esc(p.slug)}">${ic('eye', 'sm')}</button>` : ''}</div>
    <div class="play-layout"><form class="card" id="sF"><div class="card-b form2">
      <div><label class="lbl">${t('name')}</label><input type="text" name="name" required maxlength="50" value="${esc(s.name || '')}"></div>
      <div><label class="lbl">${t('server_address')}</label><input type="text" name="address" required class="ltr" value="${esc(s.address || '')}" placeholder="play.myserver.net"></div>
      <div class="full"><label class="lbl">${t('srv_short')}</label><input type="text" name="short" maxlength="160" value="${esc(s.short || '')}"></div>
      <div><label class="lbl">${t('srv_version')}</label><input type="text" name="version" value="${esc(s.version || '')}" placeholder="1.21.x"></div>
      <div><label class="lbl">${t('srv_discord')}</label><input type="text" name="discord" class="ltr" value="${esc(s.discord || '')}" placeholder="https://discord.gg/..."></div>
      <div class="full"><label class="lbl">${t('srv_website')}</label><input type="text" name="website" class="ltr" value="${esc(s.website || '')}" placeholder="https://"></div>
      <div class="full"><label class="lbl">${t('tags')}</label><div class="chips" style="margin:0">${(all.tags || []).map(x => `<button type="button" class="${sel.has(x) ? 'on' : ''}" data-tag="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>
      <div class="full"><label class="lbl">${t('srv_desc')}</label><textarea name="description" rows="8">${esc(s.description || '')}</textarea></div>
      <div class="full"><h3 style="margin:6px 0 0">${t('votifier')}</h3></div>
      <div><label class="lbl">${t('vf_host')}</label><input type="text" name="votifierHost" class="ltr" value="${esc(v.host || '')}"></div>
      <div><label class="lbl">${t('vf_port')}</label><input type="text" name="votifierPort" class="ltr" value="${esc(v.port || 8192)}"></div>
      <div class="full"><label class="lbl">${t('vf_key')}</label><textarea name="votifierKey" rows="3" class="ltr mono" style="font-size:12px">${esc(v.key || '')}</textarea></div>
      <div class="full"><button class="btn primary lg">${ic('check', 'sm')} ${t('save')}</button></div></div></form>
    <aside class="stack">${p.slug ? `<div class="card card-b stack" style="gap:10px"><button class="btn" id="sIc">${ic('image', 'sm')} ${t('upload_icon')}</button><button class="btn" id="sBn">${ic('image', 'sm')} ${t('upload_banner')}</button></div>
      <div class="card card-b stack" style="gap:10px"><b>${t('test_vote')}</b><input type="text" id="tvN" class="ltr" placeholder="Steve"><button class="btn" id="tvB">${ic('send', 'sm')} ${t('send')}</button></div>
      <button class="btn danger lg" id="sDel">${ic('trash', 'sm')} ${t('delete_server')}</button>` : ''}</aside></div>`);
  view.querySelectorAll('[data-tag]').forEach(b => b.onclick = () => b.classList.toggle('on'));
  $('#sF').onsubmit = async e => {
    e.preventDefault(); const f = e.target;
    const body = Object.fromEntries(['name', 'address', 'short', 'version', 'discord', 'website', 'description', 'votifierHost', 'votifierPort', 'votifierKey'].map(k => [k, f[k].value.trim()]));
    body.tags = [...view.querySelectorAll('[data-tag].on')].map(b => b.dataset.tag);
    try { const r = await api(p.slug ? '/api/servers/' + encodeURIComponent(p.slug) : '/api/servers', { method: p.slug ? 'PUT' : 'POST', body }); toast(t('server_saved')); if (!p.slug) go('srvedit', { slug: r.slug }, true); }
    catch (err) { toast(err.message, 'err'); }
  };
  if (!p.slug) return;
  const img = [{ name: 'Image', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] }];
  const up = kind => async () => { const r = await B.uploadFile({ apiPath: `/api/servers/${p.slug}/image/${kind}`, field: 'image', filters: img }); if (r.canceled) return; if (r.status !== 200) return toast(upErr(r), 'err'); toast(t('saved')); };
  $('#sIc').onclick = up('icon'); $('#sBn').onclick = up('banner');
  $('#tvB').onclick = async () => { try { const r = await api(`/api/servers/${encodeURIComponent(p.slug)}/test-vote`, { method: 'POST', body: { username: $('#tvN').value.trim() } }); toast(r.ok ? t('test_ok') : (r.error || t('error')), r.ok ? '' : 'err'); } catch (err) { toast(err.message, 'err'); } };
  $('#sDel').onclick = async () => { if (!confirm(t('confirm_delete', s.name))) return; try { await api('/api/servers/' + encodeURIComponent(p.slug), { method: 'DELETE' }); toast(t('deleted')); go('myservers', {}); } catch (err) { toast(err.message, 'err'); } };
}

/* ---------- routes + sidebar ---------- */
const _go3 = go;
go = function (route, params, noHistory) {
  const fn = { following: vFollowing, studio: vStudio, apply: vApply, partners: vPartners, myservers: vMyServers, srvedit: vSrvEdit }[route];
  if (!fn) return _go3(route, params, noHistory);
  params = params || {};
  if (!noHistory && (S.route !== route || JSON.stringify(S.params) !== JSON.stringify(params))) S.history.push([S.route, S.params]);
  S.route = route; S.params = params;
  $('#backBtn').disabled = !S.history.length;
  renderNav(); view.scrollTop = 0; view.innerHTML = '<div class="spin"></div>';
  const seq = ++go.seq;
  Promise.resolve(fn(params, () => seq !== go.seq)).catch(err => { if (seq === go.seq) view.innerHTML = `<div class="view-in">${emptyBox('wifi', t('error'), err.message)}</div>`; });
};
go.seq = _go3.seq;
const _renderNav3 = renderNav;
renderNav = function () {
  _renderNav3();
  const nav = $('#nav');
  const r = { srvedit: 'servers', myservers: 'servers', apply: 'studio' }[S.route] || S.route;
  // "upload project" opens the native studio now
  const up = nav.querySelector('[data-sitewin^="/dashboard"]');
  if (up) { const n = document.createElement('a'); n.href = '#'; n.dataset.go = 'studio'; n.className = r === 'studio' ? 'on' : ''; n.innerHTML = `${ic('box')} ${t('studio')}`; up.replaceWith(n); }
  const creators = nav.querySelector('[data-go="creators"]');
  if (creators) {
    creators.insertAdjacentHTML('afterend', `${S.me && S.me.user ? `<a href="#" data-go="following" class="${r === 'following' ? 'on' : ''}">${ic('bell')} ${t('following_page')}</a>` : ''}<a href="#" data-go="partners" class="${r === 'partners' ? 'on' : ''}">${ic('handshake')} ${t('partners')}</a>`);
  }
  if (S.me && S.me.user && !nav.querySelector('[data-go="studio"]')) nav.insertAdjacentHTML('beforeend', `<a href="#" data-go="studio" class="${r === 'studio' ? 'on' : ''}">${ic('box')} ${t('studio')}</a>`);
  nav.querySelectorAll('a').forEach(a => { a._b = 0; });
  bindCommon(nav);
};

/* ---------- start ---------- */
$('#backBtn').innerHTML = ic(flip());
$('#backBtn').onclick = () => { const h = S.history.pop(); if (h) go(h[0], h[1], true); $('#backBtn').disabled = !S.history.length; };
$('#searchForm').onsubmit = e => { e.preventDefault(); go('discover', { q: $('#searchIn').value }); };
$('#searchIn').oninput = e => { if (S.route === 'discover') { DISC.q = e.target.value; go('discover', {}, true); } };
document.querySelector('[data-ic="search"]').outerHTML = ic('search', 'sm');
document.addEventListener('keydown', e => { if (e.altKey && e.key === 'ArrowLeft') $('#backBtn').click(); if (e.ctrlKey && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#searchIn').focus(); } });
setInterval(() => { if (offline) api('/api/site').then(() => go(S.route, S.params, true)).catch(() => { }); }, 15000);
// start right away; account and site info arrive in the background
applyLang();
drawBell();
go('home', {}, true);
api('/api/site').then(x => { S.site = x; applyAppearance(); maintStaffBar(); if (S.route === 'discover') go('discover', {}, true); }).catch(() => { });
loadMe();

/* ================= the whole admin panel inside the app ================= */
Object.assign(I18N.he, {
  a_tickets: 'טיקטים', a_staff: 'צוות', a_creators: 'קרייטורים', a_look: 'עיצוב', a_texts: 'טקסטים', a_partners: 'שותפים', a_limits: 'מגבלות', a_backups: 'גיבויים', a_settings: 'הגדרות',
  perm_names: { 'tickets.view': 'צפייה בטיקטים', 'tickets.reply': 'מענה לטיקטים', 'tickets.manage': 'ניהול טיקטים', projects: 'פרויקטים ושרתים', creators: 'קרייטורים ומגבלות', content: 'תוכן ועיצוב', staff: 'צוות', settings: 'הגדרות' },
  add_staff: 'הוספת איש צוות', staff_id: 'ID של דיסקורד או מייל', staff_title: 'תפקיד', show_team: 'להציג בדף הצוות', owner_badge: 'בעלים', remove: 'הסרה', owner_only: 'רק הבעלים יכול לתת',
  recommend: 'מומלץ', revoke: 'הסרת תג קרייטור',
  bg_url: 'תמונת רקע (קישור)', bg_dim: 'הכהיית הרקע', accent: 'צבע ראשי', announce_on: 'הצגת הודעה למעלה', announce_text: 'טקסט ההודעה', feat_tickets: 'טיקטים פעילים', feat_creators: 'הרשמה לקרייטורים', feat_downloads: 'הורדות פעילות',
  t_title: 'שם', t_subtitle: 'תיאור ראשי', t_about: 'אודות', t_discord: 'קישור לדיסקורד', t_footer: 'טקסט תחתון', t_eyebrow: 'שורה קטנה', t_questions: 'שאלות לבקשת קרייטור (שאלה בכל שורה)', lang_he: 'עברית', lang_en: 'English',
  partner_new: 'שותף חדש', p_name: 'שם', p_type: 'סוג', p_url: 'קישור', p_desc: 'תיאור', p_members: 'חברים', p_logo: 'לוגו', website: 'אתר', move_up: 'למעלה', move_down: 'למטה',
  lim_defaults: 'ברירת מחדל', lim_file: 'גודל קובץ מקסימלי (MB)', lim_projects: 'פרויקטים למשתמש רגיל', lim_user: 'מגבלה אישית', lim_note: 'הערה', lim_list: 'מגבלות אישיות',
  backup_now: 'גבה עכשיו', backups_sub: 'גיבוי אוטומטי כל יום — נשמרים {x} אחרונים', backup_done: 'הגיבוי נוצר ✓',
  s_discord: 'Discord (התחברות ובוט)', s_google: 'Google', s_email: 'מייל (SMTP)', s_ai: 'עוזר AI', s_autoreply: 'מענה אוטומטי לטיקטים', client_id: 'Client ID', client_secret: 'Client Secret', bot_token: 'Bot Token', log_channel: 'ערוץ לוגים', secret_set: 'שמור ✓ — השאר ריק כדי לא לשנות', test_bot: 'בדיקת בוט',
  smtp_host: 'שרת', smtp_port: 'פורט', smtp_user: 'משתמש', smtp_pass: 'סיסמת אפליקציה', smtp_from: 'שולח', ai_on: 'עוזר AI פעיל', ai_provider: 'ספק', ai_key: 'מפתח', ai_model: 'מודל', ai_instr: 'הוראות לעוזר', ar_on: 'מענה אוטומטי פעיל', ar_minutes: 'אחרי כמה דקות', ar_he: 'הודעה בעברית', ar_en: 'הודעה באנגלית', redirect_hint: 'כתובת Redirect להגדרה אצל הספק:'
});
Object.assign(I18N.en, {
  a_tickets: 'Tickets', a_staff: 'Staff', a_creators: 'Creators', a_look: 'Appearance', a_texts: 'Texts', a_partners: 'Partners', a_limits: 'Limits', a_backups: 'Backups', a_settings: 'Settings',
  perm_names: { 'tickets.view': 'View tickets', 'tickets.reply': 'Reply to tickets', 'tickets.manage': 'Manage tickets', projects: 'Projects & servers', creators: 'Creators & limits', content: 'Content & look', staff: 'Staff', settings: 'Settings' },
  add_staff: 'Add staff member', staff_id: 'Discord ID or email', staff_title: 'Title', show_team: 'Show on the team page', owner_badge: 'Owner', remove: 'Remove', owner_only: 'Owner only',
  recommend: 'Recommended', revoke: 'Remove creator badge',
  bg_url: 'Background image (URL)', bg_dim: 'Background dim', accent: 'Accent color', announce_on: 'Show announcement', announce_text: 'Announcement text', feat_tickets: 'Tickets enabled', feat_creators: 'Creator applications', feat_downloads: 'Downloads enabled',
  t_title: 'Name', t_subtitle: 'Headline', t_about: 'About', t_discord: 'Discord invite', t_footer: 'Footer', t_eyebrow: 'Small line', t_questions: 'Creator application questions (one per line)', lang_he: 'עברית', lang_en: 'English',
  partner_new: 'New partner', p_name: 'Name', p_type: 'Type', p_url: 'Link', p_desc: 'Description', p_members: 'Members', p_logo: 'Logo', website: 'Website', move_up: 'Up', move_down: 'Down',
  lim_defaults: 'Defaults', lim_file: 'Max file size (MB)', lim_projects: 'Projects per regular user', lim_user: 'Per-user limit', lim_note: 'Note', lim_list: 'Per-user limits',
  backup_now: 'Back up now', backups_sub: 'Automatic daily backup — the last {x} are kept', backup_done: 'Backup created ✓',
  s_discord: 'Discord (sign-in & bot)', s_google: 'Google', s_email: 'Email (SMTP)', s_ai: 'AI assistant', s_autoreply: 'Ticket auto-reply', client_id: 'Client ID', client_secret: 'Client Secret', bot_token: 'Bot Token', log_channel: 'Log channel', secret_set: 'Saved ✓ — leave empty to keep', test_bot: 'Test bot',
  smtp_host: 'Host', smtp_port: 'Port', smtp_user: 'User', smtp_pass: 'App password', smtp_from: 'From', ai_on: 'AI assistant on', ai_provider: 'Provider', ai_key: 'Key', ai_model: 'Model', ai_instr: 'Assistant instructions', ar_on: 'Auto-reply on', ar_minutes: 'After minutes', ar_he: 'Hebrew message', ar_en: 'English message', redirect_hint: 'Redirect URL to set at the provider:'
});
const field = (label, html, full) => `<div class="${full ? 'full' : ''}"><label class="lbl">${label}</label>${html}</div>`;
const inp = (name, value, extra = '') => `<input type="text" name="${name}" value="${esc(value == null ? '' : value)}" ${extra}>`;
const toggle = (name, on, label) => `<div class="row full" style="gap:12px"><label class="tgl"><input type="checkbox" name="${name}" ${on ? 'checked' : ''}><span></span></label> ${label}</div>`;
const secretInp = (name, isSet) => `<input type="password" name="${name}" placeholder="${isSet ? t('secret_set') : ''}" autocomplete="off" class="ltr">`;

// the admin screen: every tab lives here now (the "advanced panel" web window is gone)
vAdmin = async function (p, stale) {
  const perms = (S.me && S.me.perms) || [];
  if (!perms.length) return put(emptyBox('shield', t('no_access')));
  if (p.tab) ADM_TAB = p.tab;
  const tabs = [['overview', 'chart', null], ['tickets', 'ticket', 'tickets.view'], ['apps', 'badge', 'creators'], ['creators', 'users', 'creators'], ['projects', 'box', 'projects'], ['servers', 'globe', 'projects'],
    ['updates', 'megaphone', 'content'], ['partners', 'handshake', 'content'], ['look', 'image', 'content'], ['texts', 'edit', 'content'], ['limits', 'tool', 'creators'], ['staff', 'shield', 'staff'],
    ['backups', 'database', 'settings'], ['maint', 'tool', 'settings'], ['settings', 'settings', 'settings']].filter(x => !x[2] || perms.includes(x[2]));
  if (!tabs.some(x => x[0] === ADM_TAB)) ADM_TAB = 'overview';
  put(`<div class="head"><h1>${ic('shield', 'lg')} ${t('admin')}</h1></div>
    <div class="adm-shell"><nav class="adm-nav">${tabs.map(([k, i]) => `<button data-atab="${k}" class="${k === ADM_TAB ? 'on' : ''}">${ic(i, 'sm')} ${t('a_' + k)}</button>`).join('')}</nav><div id="aBody" class="adm-body"><div class="spin"></div></div></div>`);
  view.querySelectorAll('[data-atab]').forEach(b => b.onclick = () => { if (b.dataset.atab === 'tickets') { TK_SCOPE = 'all'; return go('support'); } ADM_TAB = b.dataset.atab; go('admin', {}, true); });
  const body = $('#aBody');
  const fn = { overview: aOverview, apps: aApps, creators: aCreators, projects: aProjects, servers: aServers, updates: aUpdates, partners: aPartners, look: aLook, texts: aTexts, limits: aLimits, staff: aStaff, backups: aBackups, maint: aMaint, settings: aSettings }[ADM_TAB];
  try { await fn(body, stale); } catch (err) { if (!stale()) body.innerHTML = emptyBox('wifi', t('error'), err.message); }
  bindCommon(body);
};

async function aCreators(body, stale) {
  const list = await api('/api/creators');
  if (stale()) return;
  const draw = () => {
    body.innerHTML = `<div class="card card-b">${list.map(c => `<div class="lrow big"><img class="av" src="${esc(siteImg(c.avatar) || c.avatar || '')}" alt=""><div style="flex:1;min-width:0" data-go="user:id:${esc(c.id)}"><b>${esc(c.name)}</b><div class="faint">${fmtNum(c.projectCount)} ${t('projects')} · ${fmtNum(c.downloads)} ${t('downloads')} · ${fmtNum(c.followers || 0)} ${t('followers')}</div></div>
      <button class="btn sm ${c.recommended ? 'primary' : ''}" data-rec="${esc(c.id)}">${ic('star', 'sm')} ${t('recommend')}</button><button class="icon-btn" data-rv="${esc(c.id)}" title="${t('revoke')}">${ic('trash', 'sm')}</button></div>`).join('') || emptyBox('users', t('no_results'))}</div>`;
    body.querySelectorAll('[data-rec]').forEach(b => b.onclick = async () => { try { const r = await api(`/api/admin/creators/${encodeURIComponent(b.dataset.rec)}/recommend`, { method: 'POST', body: {} }); list.find(c => c.id === b.dataset.rec).recommended = r.recommended; draw(); } catch (e) { toast(e.message, 'err'); } });
    body.querySelectorAll('[data-rv]').forEach(b => b.onclick = async () => { const c = list.find(x => x.id === b.dataset.rv); if (!confirm(t('confirm_delete', c.name))) return; try { await api('/api/admin/creators/' + encodeURIComponent(c.id), { method: 'DELETE' }); list.splice(list.indexOf(c), 1); draw(); toast(t('deleted')); } catch (e) { toast(e.message, 'err'); } });
    bindCommon(body);
  };
  draw();
}
async function aStaff(body, stale) {
  let d = await api('/api/admin/staff');
  if (stale()) return;
  const pn = I18N[LANG].perm_names;
  const isOwner = S.me && S.me.isOwner;
  const draw = () => {
    body.innerHTML = `<form class="card" id="stF"><div class="card-h">${ic('plus')}<h3>${t('add_staff')}</h3></div><div class="card-b form2">
        ${field(t('staff_id'), inp('id', '', 'class="ltr" required'))}${field(t('staff_title'), inp('title', ''))}
        <div class="full perm-grid">${d.perms.map(pm => `<label class="perm"><input type="checkbox" name="perm" value="${pm}" ${d.ownerOnly.includes(pm) && !isOwner ? 'disabled' : ''}> ${esc(pn[pm] || pm)}${d.ownerOnly.includes(pm) ? ` <small class="faint">(${t('owner_only')})</small>` : ''}</label>`).join('')}</div>
        ${toggle('team', true, t('show_team'))}<div class="full"><button class="btn primary lg">${ic('plus', 'sm')} ${t('add_staff')}</button></div></div></form>
      <div class="stack" style="margin-top:18px">${[d.owner, ...d.staff].map(m => `<div class="card staff-card" data-id="${esc(m.id)}"><div class="card-h"><img class="av" src="${esc(siteImg(m.avatar) || m.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png')}" alt=""><div style="flex:1;min-width:0"><b>${esc(m.name || m.id)}</b><div class="faint mono ltr" style="font-size:12px">${esc(m.id)}</div></div>${m.id === d.ownerId ? `<span class="chip accent">${ic('crown', 'sm')} ${t('owner_badge')}</span>` : `<button class="btn sm danger" data-rm="${esc(m.id)}">${t('remove')}</button>`}</div>
        ${m.id === d.ownerId ? '' : `<div class="card-b"><div class="row" style="gap:12px;flex-wrap:wrap;margin-bottom:12px"><input type="text" class="st-title" value="${esc(m.title || '')}" placeholder="${t('staff_title')}" style="max-width:240px"><div class="row faint" style="gap:10px"><label class="tgl"><input type="checkbox" class="st-team" ${m.showOnTeam ? 'checked' : ''}><span></span></label> ${t('show_team')}</div></div>
          <div class="perm-grid">${d.perms.map(pm => `<label class="perm"><input type="checkbox" class="st-perm" value="${pm}" ${m.perms.includes(pm) ? 'checked' : ''} ${d.ownerOnly.includes(pm) && !isOwner ? 'disabled' : ''}> ${esc(pn[pm] || pm)}</label>`).join('')}</div>
          <button class="btn primary" data-save="${esc(m.id)}" style="margin-top:12px">${ic('check', 'sm')} ${t('save')}</button></div>`}</div>`).join('')}</div>`;
    $('#stF').onsubmit = async e => { e.preventDefault(); const f = e.target; try { await api('/api/admin/staff/' + encodeURIComponent(f.id.value.trim()), { method: 'PUT', body: { perms: [...f.querySelectorAll('[name=perm]:checked')].map(x => x.value), title: f.title.value.trim(), showOnTeam: f.team.checked } }); d = await api('/api/admin/staff'); toast(t('saved')); draw(); } catch (err) { toast(err.message, 'err'); } };
    body.querySelectorAll('[data-save]').forEach(b => b.onclick = async () => { const card = b.closest('.staff-card'); try { await api('/api/admin/staff/' + encodeURIComponent(b.dataset.save), { method: 'PUT', body: { perms: [...card.querySelectorAll('.st-perm:checked')].map(x => x.value), title: card.querySelector('.st-title').value.trim(), showOnTeam: card.querySelector('.st-team').checked } }); toast(t('saved')); } catch (err) { toast(err.message, 'err'); } });
    body.querySelectorAll('[data-rm]').forEach(b => b.onclick = async () => { if (!confirm(t('confirm_delete', b.dataset.rm))) return; try { await api('/api/admin/staff/' + encodeURIComponent(b.dataset.rm), { method: 'DELETE' }); d = await api('/api/admin/staff'); draw(); } catch (err) { toast(err.message, 'err'); } });
  };
  draw();
}
async function aLook(body, stale) {
  const site = await api('/api/site');
  if (stale()) return;
  const a = site.appearance || {};
  body.innerHTML = `<form class="card" id="lkF"><div class="card-b form2">
    ${field(t('bg_url'), inp('backgroundUrl', a.backgroundUrl, 'class="ltr" placeholder="https://"'), true)}
    ${field(t('bg_dim') + ` <b id="dimV">${a.backgroundDim ?? 70}%</b>`, `<input type="range" name="backgroundDim" min="0" max="95" value="${a.backgroundDim ?? 70}" style="accent-color:var(--accent)">`)}
    ${field(t('accent'), `<input type="color" name="accentColor" value="${esc(a.accentColor || '#e3b341')}" style="height:48px;width:120px;padding:4px">`)}
    ${toggle('announcementEnabled', a.announcementEnabled, t('announce_on'))}
    ${field(t('announce_text'), inp('announcement', site.announcement), true)}
    ${toggle('ticketsEnabled', a.ticketsEnabled !== false, t('feat_tickets'))}${toggle('creatorsEnabled', a.creatorsEnabled !== false, t('feat_creators'))}${toggle('downloadsEnabled', a.downloadsEnabled !== false, t('feat_downloads'))}
    <div class="full"><button class="btn primary lg">${ic('check', 'sm')} ${t('save')}</button></div></div></form>`;
  const f = $('#lkF');
  f.backgroundDim.oninput = () => { $('#dimV').textContent = f.backgroundDim.value + '%'; };
  f.onsubmit = async e => {
    e.preventDefault();
    try {
      await api('/api/admin/appearance', { method: 'PUT', body: { backgroundUrl: f.backgroundUrl.value.trim(), backgroundDim: Number(f.backgroundDim.value), accentColor: f.accentColor.value, announcementEnabled: f.announcementEnabled.checked, ticketsEnabled: f.ticketsEnabled.checked, creatorsEnabled: f.creatorsEnabled.checked, downloadsEnabled: f.downloadsEnabled.checked } });
      await api('/api/admin/site', { method: 'PUT', body: { lang: 'he', announcement: f.announcement.value } });
      S.site = await api('/api/site'); applyAppearance(); toast(t('saved'));
    } catch (err) { toast(err.message, 'err'); }
  };
}
let TX_LANG = 'he';
async function aTexts(body, stale) {
  const site = await api('/api/site');
  if (stale()) return;
  const src = TX_LANG === 'he' ? site : ((site.translations || {}).en || {});
  body.innerHTML = `<div class="tabs" style="margin-bottom:14px"><button data-tl="he" class="${TX_LANG === 'he' ? 'on' : ''}">${t('lang_he')}</button><button data-tl="en" class="${TX_LANG === 'en' ? 'on' : ''}">${t('lang_en')}</button></div>
    <form class="card" id="txF"><div class="card-b form2">
      ${['title', 'eyebrow'].map(k => field(t('t_' + k), inp(k, src[k]))).join('')}
      ${['subtitle', 'about', 'footer', 'announcement'].map(k => field(k === 'announcement' ? t('announce_text') : t('t_' + k), inp(k, src[k]), true)).join('')}
      ${TX_LANG === 'he' ? field(t('t_discord'), inp('discordInvite', site.discordInvite, 'class="ltr"'), true) + field(t('t_questions'), `<textarea name="creatorQuestions" rows="6">${esc((site.creatorQuestions || []).join('\n'))}</textarea>`, true) : ''}
      <div class="full"><button class="btn primary lg">${ic('check', 'sm')} ${t('save')}</button></div></div></form>`;
  body.querySelectorAll('[data-tl]').forEach(b => b.onclick = () => { TX_LANG = b.dataset.tl; aTexts(body, stale); });
  $('#txF').onsubmit = async e => { e.preventDefault(); const f = e.target; const data = { lang: TX_LANG }; for (const el of f.elements) if (el.name) data[el.name] = el.value; try { await api('/api/admin/site', { method: 'PUT', body: data }); S.site = await api('/api/site'); toast(t('saved')); } catch (err) { toast(err.message, 'err'); } };
}
async function aPartners(body, stale) {
  let list = await api('/api/admin/partners');
  if (stale()) return;
  const draw = () => {
    body.innerHTML = `<form class="card" id="paF"><div class="card-h">${ic('plus')}<h3>${t('partner_new')}</h3></div><div class="card-b form2">
        ${field(t('p_name'), inp('name', '', 'required'))}${field(t('p_type'), `<select name="type"><option value="discord">Discord</option><option value="website">${t('website')}</option></select>`)}
        ${field(t('p_url'), inp('url', '', 'class="ltr" required placeholder="https://"'), true)}${field(t('p_desc'), inp('description', ''), true)}${field(t('p_members'), inp('members', ''))}${field(t('p_logo'), inp('logo', '', 'class="ltr" placeholder="https://…png"'))}
        <div class="full"><button class="btn primary lg">${ic('plus', 'sm')} ${t('partner_new')}</button></div></div></form>
      <div class="card card-b" style="margin-top:18px">${list.map((x, i) => `<div class="lrow big"><div class="pic sm">${siteImg(x.logo) || /^https:/.test(x.logo || '') ? `<img src="${esc(siteImg(x.logo) || x.logo)}" alt="">` : esc(x.name.charAt(0))}</div><div style="flex:1;min-width:0"><b>${esc(x.name)}</b> <span class="chip">${x.type === 'discord' ? 'Discord' : t('website')}</span><div class="faint ltr" style="font-size:12.5px">${esc(x.url)}</div></div>
        <button class="icon-btn" data-up="${esc(x.id)}" ${i === 0 ? 'disabled' : ''} title="${t('move_up')}">▲</button><button class="icon-btn" data-dn="${esc(x.id)}" ${i === list.length - 1 ? 'disabled' : ''} title="${t('move_down')}">▼</button>
        <button class="icon-btn" data-logo="${esc(x.id)}" title="${t('p_logo')}">${ic('image', 'sm')}</button><button class="btn sm ${x.visible === false ? 'danger' : ''}" data-vis="${esc(x.id)}">${ic(x.visible === false ? 'eyeoff' : 'eye', 'sm')}</button><button class="icon-btn" data-del="${esc(x.id)}">${ic('trash', 'sm')}</button></div>`).join('') || emptyBox('handshake', t('no_results'))}</div>`;
    const reload = async () => { list = await api('/api/admin/partners'); draw(); };
    $('#paF').onsubmit = async e => { e.preventDefault(); const f = e.target; try { await api('/api/admin/partners', { method: 'POST', body: { name: f.name.value.trim(), type: f.type.value, url: f.url.value.trim(), description: f.description.value.trim(), members: f.members.value.trim(), logo: f.logo.value.trim() } }); toast(t('saved')); reload(); } catch (err) { toast(err.message, 'err'); } };
    const act = (sel, fn) => body.querySelectorAll(sel).forEach(b => b.onclick = async () => { try { await fn(b); reload(); } catch (err) { toast(err.message, 'err'); } });
    act('[data-up]', b => api(`/api/admin/partners/${b.dataset.up}/move`, { method: 'POST', body: { dir: 'up' } }));
    act('[data-dn]', b => api(`/api/admin/partners/${b.dataset.dn}/move`, { method: 'POST', body: { dir: 'down' } }));
    act('[data-vis]', b => { const x = list.find(y => y.id === b.dataset.vis); return api('/api/admin/partners/' + x.id, { method: 'PUT', body: { visible: x.visible === false } }); });
    act('[data-del]', async b => { if (confirm(t('confirm_delete', ''))) await api('/api/admin/partners/' + b.dataset.del, { method: 'DELETE' }); });
    body.querySelectorAll('[data-logo]').forEach(b => b.onclick = async () => { const r = await B.uploadFile({ apiPath: `/api/admin/partners/${b.dataset.logo}/logo`, field: 'logo', filters: [{ name: 'Image', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] }] }); if (r.canceled) return; if (r.status !== 200) return toast(upErr(r), 'err'); toast(t('saved')); reload(); });
  };
  draw();
}
async function aLimits(body, stale) {
  let d = await api('/api/admin/limits');
  if (stale()) return;
  const draw = () => {
    body.innerHTML = `<div class="charts"><form class="card" id="lmD"><div class="card-h">${ic('tool')}<h3>${t('lim_defaults')}</h3></div><div class="card-b stack" style="gap:12px">${field(t('lim_file'), inp('defaultFileMB', d.defaultFileMB, 'class="ltr"'))}${field(t('lim_projects'), inp('freeProjects', d.freeProjects, 'class="ltr"'))}<button class="btn primary">${ic('check', 'sm')} ${t('save')}</button></div></form>
      <form class="card" id="lmU"><div class="card-h">${ic('user')}<h3>${t('lim_user')}</h3></div><div class="card-b stack" style="gap:12px">${field(t('staff_id'), inp('id', '', 'class="ltr" required'))}<div class="row" style="gap:12px">${field(t('lim_file'), inp('fileMB', '', 'class="ltr"'))}${field(t('lim_projects'), inp('projects', '', 'class="ltr"'))}</div>${field(t('lim_note'), inp('note', ''))}<button class="btn primary">${ic('plus', 'sm')} ${t('save')}</button></div></form></div>
      <div class="card"><div class="card-h">${ic('users')}<h3>${t('lim_list')}</h3></div><div class="card-b">${d.users.map(u => `<div class="lrow"><img class="av" src="${esc(siteImg(u.avatar) || u.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png')}" alt=""><div style="flex:1;min-width:0"><b>${esc(u.name || u.id)}</b><div class="faint">${u.fileMB != null ? u.fileMB + 'MB' : '—'} · ${u.projects != null ? u.projects : '∞'} ${t('projects')} ${u.note ? '· ' + esc(u.note) : ''}</div></div><button class="icon-btn" data-del="${esc(u.id)}">${ic('trash', 'sm')}</button></div>`).join('') || '<p class="faint">—</p>'}</div></div>`;
    $('#lmD').onsubmit = async e => { e.preventDefault(); const f = e.target; try { d = await api('/api/admin/limits/default', { method: 'PUT', body: { defaultFileMB: f.defaultFileMB.value, freeProjects: f.freeProjects.value } }); toast(t('saved')); draw(); } catch (err) { toast(err.message, 'err'); } };
    $('#lmU').onsubmit = async e => { e.preventDefault(); const f = e.target; try { d = await api('/api/admin/limits/user/' + encodeURIComponent(f.id.value.trim()), { method: 'PUT', body: { fileMB: f.fileMB.value, projects: f.projects.value, note: f.note.value } }); toast(t('saved')); draw(); } catch (err) { toast(err.message, 'err'); } };
    body.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => { try { d = await api('/api/admin/limits/user/' + encodeURIComponent(b.dataset.del), { method: 'DELETE' }); draw(); } catch (err) { toast(err.message, 'err'); } });
  };
  draw();
}
async function aBackups(body, stale) {
  const d = await api('/api/admin/backups');
  if (stale()) return;
  body.innerHTML = `<div class="card"><div class="card-h">${ic('database')}<h3>${t('a_backups')}</h3><span class="spacer"></span><button class="btn primary" id="bkNow">${ic('database', 'sm')} ${t('backup_now')}</button></div><div class="card-b"><p class="faint" style="margin:0 0 12px">${t('backups_sub', d.keep)}</p>
    ${d.backups.map(b => `<div class="lrow"><span class="mono ltr" style="flex:1">${esc(b.name)}</span><span class="faint">${timeAgo(b.at)}</span><span class="chip">${fmtSize(b.size)}</span></div>`).join('') || '<p class="faint">—</p>'}</div></div>`;
  $('#bkNow').onclick = async () => { $('#bkNow').disabled = true; try { await api('/api/admin/backups', { method: 'POST', body: {} }); toast(t('backup_done')); aBackups(body, stale); } catch (err) { toast(err.message, 'err'); $('#bkNow').disabled = false; } };
}
async function aSettings(body, stale) {
  const c = await api('/api/admin/config');
  if (stale()) return;
  body.innerHTML = `<form id="cfgF" class="stack">
    <div class="card"><div class="card-h">${ic('user')}<h3>${t('s_discord')}</h3><span class="spacer"></span><button type="button" class="btn sm" id="testBot">${t('test_bot')}</button></div><div class="card-b form2">
      ${field(t('client_id'), inp('clientId', c.clientId, 'class="ltr"'))}${field(t('client_secret'), secretInp('clientSecret', c.clientSecretSet))}
      ${field(t('bot_token'), secretInp('botToken', c.botTokenSet))}${field(t('log_channel'), inp('logChannelId', c.logChannelId, 'class="ltr"'))}
      ${field('Redirect URI', inp('redirectUri', c.redirectUri, 'class="ltr"'), true)}</div></div>
    <div class="card"><div class="card-h">${ic('globe')}<h3>${t('s_google')}</h3></div><div class="card-b form2">${field(t('client_id'), inp('googleClientId', c.googleClientId, 'class="ltr"'))}${field(t('client_secret'), secretInp('googleClientSecret', c.googleSecretSet))}<p class="faint full" style="margin:0;font-size:13px">${t('redirect_hint')} <span class="mono ltr">${esc(c.googleRedirect)}</span></p></div></div>
    <div class="card"><div class="card-h">${ic('send')}<h3>${t('s_email')}</h3>${c.emailReady ? '<span class="chip accent">✓</span>' : ''}</div><div class="card-b form2">${field(t('smtp_host'), inp('smtpHost', c.smtpHost, 'class="ltr"'))}${field(t('smtp_port'), inp('smtpPort', c.smtpPort, 'class="ltr"'))}${field(t('smtp_user'), inp('smtpUser', c.smtpUser, 'class="ltr"'))}${field(t('smtp_pass'), secretInp('smtpPass', c.smtpPassSet))}${field(t('smtp_from'), inp('smtpFrom', c.smtpFrom, 'class="ltr"'), true)}</div></div>
    <div class="card"><div class="card-h">${ic('sparkle')}<h3>${t('s_ai')}</h3></div><div class="card-b form2">${toggle('aiEnabled', c.aiEnabled, t('ai_on'))}
      ${field(t('ai_provider'), `<select name="aiProvider"><option value="gemini" ${c.aiProvider !== 'anthropic' ? 'selected' : ''}>Gemini</option><option value="anthropic" ${c.aiProvider === 'anthropic' ? 'selected' : ''}>Claude</option></select>`)}
      ${field('Gemini ' + t('ai_model'), `<select name="aiGeminiModel">${(c.geminiModels || []).map(m => `<option ${m === c.aiGeminiModel ? 'selected' : ''}>${m}</option>`).join('')}</select>`)}
      ${field('Gemini ' + t('ai_key'), secretInp('aiGeminiKey', c.aiGeminiKeySet))}${field('Claude ' + t('ai_model'), `<select name="aiModel">${(c.aiModels || []).map(m => `<option ${m === c.aiModel ? 'selected' : ''}>${m}</option>`).join('')}</select>`)}
      ${field('Claude ' + t('ai_key'), secretInp('aiKey', c.aiKeySet))}${field(t('ai_instr'), `<textarea name="aiInstructions" rows="4">${esc(c.aiInstructions || '')}</textarea>`, true)}</div></div>
    <div class="card"><div class="card-h">${ic('clock')}<h3>${t('s_autoreply')}</h3></div><div class="card-b form2">${toggle('autoReplyEnabled', c.autoReplyEnabled, t('ar_on'))}${field(t('ar_minutes'), inp('autoReplyMinutes', c.autoReplyMinutes, 'class="ltr"'))}${field(t('ar_he'), `<textarea name="autoReplyHe" rows="3">${esc(c.autoReplyHe || '')}</textarea>`, true)}${field(t('ar_en'), `<textarea name="autoReplyEn" rows="3" class="ltr">${esc(c.autoReplyEn || '')}</textarea>`, true)}</div></div>
    <button class="btn primary lg" style="align-self:flex-start">${ic('check', 'sm')} ${t('save')}</button></form>`;
  $('#cfgF').onsubmit = async e => {
    e.preventDefault(); const f = e.target, data = {};
    for (const el of f.elements) { if (!el.name) continue; if (el.type === 'checkbox') data[el.name] = el.checked; else if (el.type === 'password') { if (el.value.trim()) data[el.name] = el.value.trim(); } else data[el.name] = el.value; }
    try { await api('/api/admin/config', { method: 'PUT', body: data }); toast(t('saved')); aSettings(body, stale); } catch (err) { toast(err.message, 'err'); }
  };
  $('#testBot').onclick = async () => { try { const r = await api('/api/admin/config/test-bot', { method: 'POST', body: {} }); toast('✓ ' + ((r.bot && (r.bot.username || r.bot.name)) || 'OK')); } catch (err) { toast(err.message, 'err'); } };
}
// the "advanced panel" window is not used any more
renderNav = (prev => function () { prev(); const x = $('#nav [data-sitewin]'); if (x) x.remove(); })(renderNav);
