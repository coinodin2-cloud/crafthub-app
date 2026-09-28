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
    upd_available: 'עדכון זמין: {x}', upd_days: 'נשארו {x} ימים לעדכן', upd_now: 'עדכן עכשיו', upd_downloading: 'מוריד… {x}%', install_ok: 'הותקן ✓', install_err: 'ההתקנה נכשלה', uninstalled: 'הוסר',
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
    upd_available: 'Update available: {x}', upd_days: '{x} days left to update', upd_now: 'Update now', upd_downloading: 'Downloading… {x}%', install_ok: 'Installed ✓', install_err: 'Install failed', uninstalled: 'Removed',
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
  // a 404 without a JSON error means the site runs an older server.js that doesn't have this endpoint yet
  if (r.status >= 400) throw Object.assign(new Error((r.data && r.data.error) || (r.status === 404 ? (LANG === 'he' ? 'השרת לא מעודכן — הפיצ\'ר הזה עוד לא קיים בשרת' : 'The server is out of date — this feature is not on it yet') : t('error'))), { status: r.status, data: r.data });
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
  } catch (err) {
    btn.disabled = false; btn.innerHTML = orig;
    // say why, not just "failed"
    const m = String(err && err.message || ''), he = LANG === 'he';
    const why = /http_503/.test(m) ? (he ? 'האתר בתחזוקה — ההורדות סגורות כרגע' : 'The site is in maintenance — downloads are closed')
      : /http_404/.test(m) ? (he ? 'הקובץ לא נמצא בשרת' : 'The file was not found on the server')
      : /http_40[13]/.test(m) ? (he ? 'אין לך הרשאה להוריד את זה' : 'You are not allowed to download this')
      : /timeout|ERR_|ENOTFOUND|ECONN/.test(m) ? (he ? 'אין חיבור לשרת' : 'No connection to the server')
      : /EPERM|EACCES|EBUSY/.test(m) ? (he ? 'אין גישה לתיקייה (אולי מיינקראפט פתוח?)' : 'No access to the folder (is Minecraft open?)') : '';
    toast(t('install_err') + (why ? ' — ' + why : ''), 'err');
  }
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
  const o = $('#outBtn'); if (o) o.onclick = async () => { if (!(await confirmLogout())) return; await B.logout(); await loadMe(); go('settings', {}, true); };
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
  bar.innerHTML = `${ic('download', 'sm')}<b>${t('upd_available', (st.label || 'v' + st.version))}</b><span class="faint">${st.progress && !st.downloaded ? t('upd_downloading', st.progress) : ''}</span><span class="spacer"></span><span class="days">${t('upd_days', st.daysLeft)}</span><button class="btn sm primary" id="updGo" ${st.progress && !st.downloaded ? 'disabled' : ''}>${t('upd_now')}</button>`;
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
        <div class="full"><label class="lbl">${t('yt_video')}</label><input type="text" name="video" class="ltr" placeholder="https://www.youtube.com/watch?v=…" value="${esc(p.video || '')}"></div>
        <div class="full"><label class="lbl">${t('long')}</label><textarea name="description" rows="12">${esc(p.description || '')}</textarea></div>
        <label class="row full"><label class="tgl"><input type="checkbox" name="visible" ${p.visible !== false ? 'checked' : ''}><span></span></label> ${t('show_on')}</label>
        <div class="full"><button class="btn primary lg">${ic('check', 'sm')} ${t('save')}</button></div></div></form>
      <aside class="stack">
        <div class="card"><div class="card-h">${ic('upload')}<h3>${t('new_version_up')}</h3></div><div class="card-b stack" style="gap:10px"><input type="text" id="nvVer" class="ltr" placeholder="${t('version_n')} (auto)"><textarea id="nvNotes" rows="3" placeholder="${t('notes')}"></textarea><button class="btn primary" id="nvUp">${ic('upload', 'sm')} ${t('choose_file')}</button></div></div>
        <div class="card card-b stack" style="gap:10px"><button class="btn" id="icUp">${ic('image', 'sm')} ${t('change_icon')}</button><button class="btn" id="galUp">${ic('image', 'sm')} ${t('add_image')} (${(p.gallery || []).length}/8)</button></div>
        <button class="btn danger lg" id="delP">${ic('trash', 'sm')} ${t('delete_project')}</button>
      </aside></div>`);
  $('#edF').onsubmit = async e => { e.preventDefault(); const f = e.target; try { await api(base, { method: 'PUT', body: { name: f.name.value.trim(), category: f.category.value, short: f.short.value.trim(), tags: f.tags.value, description: f.description.value, video: f.video.value.trim(), visible: f.visible.checked } }); toast(t('saved')); S.projectsAt = 0; } catch (err) { toast(err.message, 'err'); } };
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
// (the app starts at the very end of this file, after every layer below has replaced its views)

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
      ${TX_LANG === 'he' ? field(t('t_discord'), inp('discordInvite', site.discordInvite, 'class="ltr"'), true) + field(t('t_questions'), `<textarea name="creatorQuestions" rows="6">${esc((site.creatorQuestions || []).join('\n'))}</textarea>`, true) + field(t('t_credits'), `<textarea name="credits" rows="5" placeholder="${esc(t('t_credits_ph'))}">${esc(site.credits || '')}</textarea>`, true) : ''}
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
    <div class="card"><div class="card-h">${ic('phone')}<h3>${LANG === 'he' ? 'שיחות — שרת ממסר (TURN, לא חובה)' : 'Calls — relay server (TURN, optional)'}</h3></div><div class="card-b form2">${field('TURN URL', inp('turnUrl', c.turnUrl, 'class="ltr" placeholder="turn:crafthubs.net:3478"'), true)}${field('TURN user', inp('turnUser', c.turnUser, 'class="ltr"'))}${field('TURN password', secretInp('turnPass', c.turnPassSet))}<p class="faint full" style="margin:0;font-size:13px">${LANG === 'he' ? 'רוב השיחות מתחברות בלי זה. אם יש משתמשים ששיחות אצלם לא מתחברות — מתקינים coturn על ה-VPS וממלאים כאן.' : 'Most calls connect without it. If some users cannot connect, install coturn on the VPS and fill this in.'}</p></div></div>
    <div class="card"><div class="card-h"><b style="font-size:15px">GIF</b><h3>${LANG === 'he' ? 'גיפים בצ׳אט (GIPHY)' : 'GIFs in chat (GIPHY)'}</h3></div><div class="card-b form2">${field('GIPHY API key', secretInp('giphyKey', c.giphyKeySet), true)}<p class="faint full" style="margin:0;font-size:13px">${LANG === 'he' ? 'מפתח חינמי: נרשמים ב-developers.giphy.com ← Create an App ← API, ומדביקים כאן.' : 'Free key: sign up at developers.giphy.com → Create an App → API, and paste it here.'}</p></div></div>
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

/* ================= people (search, friends, favorite servers) + staff area ================= */
Object.assign(ICONS, {
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  userplus: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4ZM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7Z"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
  ban: '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
  msg: '<path d="M4 5h16v11H8l-4 4Z"/>'
});
Object.assign(I18N.he, {
  people: 'אנשים', people_sub: 'מצא אנשים, עקוב אחריהם, הוסף חברים וראה את התוכן והשרתים שלהם', p_search: 'חיפוש', p_friends: 'חברים', p_following: 'אני עוקב', p_favs: 'שרתים מועדפים',
  people_ph: 'חפש שם של משתמש או קרייטור…', people_hint: 'תקליד לפחות 2 אותיות', online: 'מחובר', last_seen: 'נראה {x}',
  add_friend: 'הוסף חבר', friends_btn: 'חברים', request_sent: 'בקשה נשלחה', accept_friend: 'אשר חברות', decline: 'דחה', remove_friend: 'הסר חבר', confirm_unfriend: 'להסיר את {x} מהחברים?',
  friend_requests: 'בקשות חברות', sent_requests: 'בקשות ששלחתי', no_friends: 'עוד אין לך חברים — חפש אנשים והוסף אותם', no_following_people: 'אתה עוד לא עוקב אחרי אף אחד', no_favs: 'עוד אין שרתים מועדפים — לחץ על הלב בדף של שרת',
  fav: 'מועדף', add_fav: 'הוסף למועדפים', their_servers: 'השרתים שלו', their_favs: 'שרתים מועדפים', their_friends: 'חברים', their_projects: 'פרויקטים', friends_n: 'חברים', joined: 'הצטרף',
  report: 'דיווח', report_title: 'דיווח לצוות', report_reason: 'סיבה', report_text: 'פרטים (לא חובה)', report_sent: 'הדיווח נשלח לצוות ✓', suspended: 'החשבון שלך מושעה', suspended_until: 'עד {x}',
  reasons: { spam: 'ספאם', malware: 'וירוס / קוד זדוני', stolen: 'תוכן גנוב', offensive: 'תוכן פוגעני', broken: 'לא עובד', scam: 'הונאה', other: 'אחר' },
  a_me: 'הלוח שלי', a_guide: 'מדריך לצוות', a_reports: 'דיווחים', a_reviews: 'ביקורות', a_users: 'משתמשים', a_tasks: 'משימות', a_log: 'יומן פעולות',
  st_waiting: 'טיקטים מחכים', st_open_reports: 'דיווחים פתוחים', st_my_tasks: 'המשימות שלי', st_replies: 'תשובות שלי בטיקטים', st_week: '{x} השבוע', st_claimed: 'טיקטים שלקחתי', st_reports: 'דיווחים שטיפלתי', st_actions: 'פעולות ביומן',
  staff_today: 'מה עושים היום?', staff_todo: ['לענות לטיקטים שמחכים', 'לטפל בדיווחים פתוחים', 'לעבור על ביקורות חדשות', 'לבדוק פרויקטים ושרתים חדשים', 'לסיים את המשימות שלך'],
  go_tickets: 'לטיקטים', go_reports: 'לדיווחים', go_tasks: 'למשימות', read_guide: 'למדריך',
  r_open: 'פתוחים', r_done: 'טופלו', r_all: 'הכל', resolve: 'טופל', dismiss: 'דחה', reopen: 'פתח מחדש', note_opt: 'הערה (לא חובה)', reported_by: 'דווח ע"י {x}', handled_by: 'טופל ע"י {x}', type_project: 'פרויקט', type_server: 'שרת', type_user: 'משתמש', type_review: 'ביקורת',
  u_search: 'חיפוש משתמש לפי שם או ID…', u_banned_only: 'מושעים', warn: 'אזהרה', warn_reason: 'סיבת האזהרה', ban: 'השעיה', unban: 'הסר השעיה', ban_reason: 'סיבת ההשעיה', ban_days: 'ימים (0 = לצמיתות)', forever: 'לצמיתות', warnings: 'אזהרות', staff_notes: 'הערות צוות', add_note: 'הוסף הערה', view_profile: 'לפרופיל', tickets_n: 'טיקטים', reports_n: 'דיווחים', banned_chip: 'מושעה',
  t_todo: 'לביצוע', t_doing: 'בתהליך', t_done: 'בוצע', task_new: 'משימה חדשה', task_title: 'כותרת', task_text: 'פרטים', assignee: 'אחראי', nobody: '— אף אחד —', prio: 'עדיפות', prio_low: 'נמוכה', prio_normal: 'רגילה', prio_high: 'גבוהה', done_by: 'בוצע ע"י {x}',
  guide_edit: 'עריכת המדריך', guide_save: 'שמירת המדריך', guide_add: 'הוסף פרק', guide_updated: 'עודכן {x} ע"י {y}', sec_title: 'כותרת הפרק', sec_body: 'תוכן (Markdown: ## כותרת, - רשימה, **מודגש**)',
  perm_moderation: 'מודרציה (דיווחים, ביקורות, משתמשים)', cancel: 'ביטול'
});
Object.assign(I18N.en, {
  people: 'People', people_sub: 'Find people, follow them, add friends and see their content and servers', p_search: 'Search', p_friends: 'Friends', p_following: 'Following', p_favs: 'Favorite servers',
  people_ph: 'Search a user or creator name…', people_hint: 'Type at least 2 letters', online: 'Online', last_seen: 'Seen {x}',
  add_friend: 'Add friend', friends_btn: 'Friends', request_sent: 'Request sent', accept_friend: 'Accept', decline: 'Decline', remove_friend: 'Remove friend', confirm_unfriend: 'Remove {x} from friends?',
  friend_requests: 'Friend requests', sent_requests: 'Sent requests', no_friends: 'No friends yet — search people and add them', no_following_people: 'You don\'t follow anyone yet', no_favs: 'No favorite servers yet — tap the heart on a server page',
  fav: 'Favorite', add_fav: 'Add to favorites', their_servers: 'Servers', their_favs: 'Favorite servers', their_friends: 'Friends', their_projects: 'Projects', friends_n: 'friends', joined: 'Joined',
  report: 'Report', report_title: 'Report to staff', report_reason: 'Reason', report_text: 'Details (optional)', report_sent: 'Report sent to the staff ✓', suspended: 'Your account is suspended', suspended_until: 'until {x}',
  reasons: { spam: 'Spam', malware: 'Virus / malware', stolen: 'Stolen content', offensive: 'Offensive', broken: 'Broken', scam: 'Scam', other: 'Other' },
  a_me: 'My desk', a_guide: 'Staff guide', a_reports: 'Reports', a_reviews: 'Reviews', a_users: 'Users', a_tasks: 'Tasks', a_log: 'Activity log',
  st_waiting: 'Tickets waiting', st_open_reports: 'Open reports', st_my_tasks: 'My tasks', st_replies: 'My ticket replies', st_week: '{x} this week', st_claimed: 'Tickets claimed', st_reports: 'Reports handled', st_actions: 'Logged actions',
  staff_today: 'What to do today?', staff_todo: ['Answer waiting tickets', 'Handle open reports', 'Go over new reviews', 'Check new projects and servers', 'Finish your tasks'],
  go_tickets: 'Tickets', go_reports: 'Reports', go_tasks: 'Tasks', read_guide: 'Guide',
  r_open: 'Open', r_done: 'Handled', r_all: 'All', resolve: 'Resolved', dismiss: 'Dismiss', reopen: 'Reopen', note_opt: 'Note (optional)', reported_by: 'Reported by {x}', handled_by: 'Handled by {x}', type_project: 'Project', type_server: 'Server', type_user: 'User', type_review: 'Review',
  u_search: 'Search a user by name or ID…', u_banned_only: 'Suspended', warn: 'Warn', warn_reason: 'Warning reason', ban: 'Suspend', unban: 'Lift suspension', ban_reason: 'Suspension reason', ban_days: 'Days (0 = permanent)', forever: 'Permanent', warnings: 'Warnings', staff_notes: 'Staff notes', add_note: 'Add note', view_profile: 'Profile', tickets_n: 'tickets', reports_n: 'reports', banned_chip: 'Suspended',
  t_todo: 'To do', t_doing: 'In progress', t_done: 'Done', task_new: 'New task', task_title: 'Title', task_text: 'Details', assignee: 'Assignee', nobody: '— nobody —', prio: 'Priority', prio_low: 'Low', prio_normal: 'Normal', prio_high: 'High', done_by: 'Done by {x}',
  guide_edit: 'Edit guide', guide_save: 'Save guide', guide_add: 'Add section', guide_updated: 'Updated {x} by {y}', sec_title: 'Section title', sec_body: 'Content (Markdown: ## heading, - list, **bold**)',
  perm_moderation: 'Moderation (reports, reviews, users)', cancel: 'Cancel'
});
I18N.he.perm_names.moderation = I18N.he.perm_moderation;
I18N.en.perm_names.moderation = I18N.en.perm_moderation;
// servers outside the ranking (favorites, a profile) have no #rank
const srvRow = s => s.rank ? serverRow(s) : serverRow(s).replace(/<div class="rank[^>]*>#undefined<\/div>/, '');
// the guide also uses numbered steps (1. 2. 3.)
const mdSteps = src => md(String(src || '').replace(/^(\d+)\. (.*)$/gm, '- **$1.** $2'));
const avatarOf = u => esc(siteImg(u.avatar) || u.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png');
const seenTxt = u => u.online ? `<span class="online-dot"></span> ${t('online')}` : u.lastSeen ? t('last_seen', timeAgo(u.lastSeen)) : '';

// one row for a person: avatar, name, badges, and whatever buttons the caller adds
function personRow(u, right = '') {
  return `<div class="person" data-go="user:id:${esc(u.id)}"><div class="av-wrap"><img class="av" src="${avatarOf(u)}" alt="">${u.online ? '<span class="online-dot abs"></span>' : ''}</div>
    <div class="body"><b>${esc(u.name)}</b><div class="faint">${[u.creator ? `<span class="chip accent">${t('creator')}</span>` : '', u.staff ? `<span class="chip">${ic('shield', 'sm')}</span>` : '', u.followers != null ? `${fmtNum(u.followers)} ${t('followers')}` : '', seenTxt(u)].filter(Boolean).join(' · ')}</div></div>${right}</div>`;
}

let PEOPLE_TAB = 'search', PEOPLE_Q = '';
async function vPeople(p, stale) {
  const me = S.me && S.me.user;
  if (p.tab) PEOPLE_TAB = p.tab;
  if (!me && PEOPLE_TAB !== 'search') PEOPLE_TAB = 'search';
  const tabs = [['search', 'search'], ['friends', 'users'], ['following', 'bell'], ['favs', 'heart']].filter(x => me || x[0] === 'search');
  put(`<div class="head"><div><h1>${ic('users', 'lg')} ${t('people')}</h1><p class="faint" style="margin:6px 0 0">${t('people_sub')}</p></div></div>
    <div class="tabs big" style="margin-bottom:20px">${tabs.map(([k, i]) => `<button data-pt="${k}" class="${k === PEOPLE_TAB ? 'on' : ''}">${ic(i, 'sm')} ${t('p_' + k)}<span class="pt-n" data-n="${k}"></span></button>`).join('')}</div><div id="pBody"><div class="spin"></div></div>`);
  view.querySelectorAll('[data-pt]').forEach(b => b.onclick = () => { PEOPLE_TAB = b.dataset.pt; go('people', {}, true); });
  const body = $('#pBody');
  if (me) api('/api/friends').then(f => { const n = view.querySelector('[data-n="friends"]'); if (n && f.incoming.length) n.textContent = f.incoming.length; }).catch(() => { });
  if (PEOPLE_TAB === 'search') {
    body.innerHTML = `<div class="searchbar big">${ic('search')}<input type="text" id="pQ" placeholder="${t('people_ph')}" value="${esc(PEOPLE_Q)}" autocomplete="off"></div><div id="pRes" class="people-grid" style="margin-top:18px"></div>`;
    const q = $('#pQ'), res = $('#pRes');
    let timer, n = 0;
    const run = async () => {
      PEOPLE_Q = q.value.trim();
      const my = ++n;
      if (PEOPLE_Q.length < 2) {
        // nothing typed yet: show the recommended creators
        const list = await api('/api/creators').catch(() => []);
        if (my !== n || stale()) return;
        res.innerHTML = list.slice(0, 24).map(c => personRow({ ...c, creator: true })).join('') || `<p class="faint">${t('people_hint')}</p>`;
      } else {
        const list = await api('/api/search/users?q=' + encodeURIComponent(PEOPLE_Q)).catch(() => []);
        if (my !== n || stale()) return;
        res.innerHTML = list.map(u => personRow(u)).join('') || emptyBox('search', t('no_results'));
      }
      bindCommon(res);
    };
    q.oninput = () => { clearTimeout(timer); timer = setTimeout(run, 250); };
    q.focus(); run();
  } else if (PEOPLE_TAB === 'friends') {
    const draw = async () => {
      const f = await api('/api/friends');
      if (stale()) return;
      const btns = (u, kind) => kind === 'in' ? `<span class="row" data-stop style="gap:8px"><button class="btn sm primary" data-acc="${esc(u.id)}">${ic('check', 'sm')} ${t('accept_friend')}</button><button class="btn sm" data-rm="${esc(u.id)}">${t('decline')}</button></span>`
        : kind === 'out' ? `<span class="chip" data-stop>${t('request_sent')}</span><button class="icon-btn" data-stop data-rm="${esc(u.id)}">✕</button>` : `<button class="icon-btn" data-stop data-rmf="${esc(u.id)}" data-name="${esc(u.name)}" title="${t('remove_friend')}">${ic('trash', 'sm')}</button>`;
      body.innerHTML = `${f.incoming.length ? `<div class="card" style="border-color:var(--accent-line);margin-bottom:18px"><div class="card-h">${ic('userplus')}<h3>${t('friend_requests')}</h3><span class="chip accent">${f.incoming.length}</span></div><div class="card-b people-grid">${f.incoming.map(u => personRow(u, btns(u, 'in'))).join('')}</div></div>` : ''}
        <div class="people-grid">${f.friends.map(u => personRow(u, btns(u))).join('') || emptyBox('users', t('no_friends'))}</div>
        ${f.outgoing.length ? `<h3 class="sec-t">${t('sent_requests')}</h3><div class="people-grid">${f.outgoing.map(u => personRow(u, btns(u, 'out'))).join('')}</div>` : ''}`;
      bindCommon(body);
      const act = (sel, fn) => body.querySelectorAll(sel).forEach(b => b.onclick = async e => { e.stopPropagation(); try { await fn(b); draw(); } catch (err) { toast(err.message, 'err'); } });
      act('[data-acc]', b => api('/api/friends/' + encodeURIComponent(b.dataset.acc), { method: 'POST', body: {} }));
      act('[data-rm]', b => api('/api/friends/' + encodeURIComponent(b.dataset.rm), { method: 'DELETE' }));
      act('[data-rmf]', async b => { if (confirm(t('confirm_unfriend', b.dataset.name))) await api('/api/friends/' + encodeURIComponent(b.dataset.rmf), { method: 'DELETE' }); });
    };
    await draw();
  } else if (PEOPLE_TAB === 'following') {
    const list = await api('/api/me/following');
    if (stale()) return;
    body.innerHTML = `<div class="people-grid">${list.map(u => personRow(u)).join('') || emptyBox('bell', t('no_following_people'))}</div>`;
  } else {
    const list = await api('/api/me/favorite-servers');
    if (stale()) return;
    body.innerHTML = `<div class="stack" style="gap:10px">${list.map(srvRow).join('') || emptyBox('heart', t('no_favs'))}</div>`;
  }
  bindCommon(body);
}

// report anything to the staff
function reportModal(type, target, targetName) {
  if (!(S.me && S.me.user)) return doLogin();
  const reasons = I18N[LANG].reasons;
  const m = document.createElement('div'); m.className = 'modal-back';
  m.innerHTML = `<form class="card tk-modal"><div class="card-h">${ic('flag')}<h3>${t('report_title')}</h3><span class="faint">${esc(targetName || '')}</span><span class="spacer"></span><button type="button" class="icon-btn" data-x>✕</button></div><div class="card-b stack">
    <div><label class="lbl">${t('report_reason')}</label><div class="chips" style="margin:0">${Object.entries(reasons).filter(([k]) => type === 'project' || !['malware', 'broken'].includes(k)).map(([k, v], i) => `<label class="chip-r"><input type="radio" name="reason" value="${k}" ${i === 0 ? 'checked' : ''}><span>${esc(v)}</span></label>`).join('')}</div></div>
    <div><label class="lbl">${t('report_text')}</label><textarea name="text" rows="4" maxlength="1500"></textarea></div>
    <button class="btn primary lg">${ic('send', 'sm')} ${t('send')}</button></div></form>`;
  document.body.appendChild(m);
  m.querySelector('[data-x]').onclick = () => m.remove();
  m.onclick = e => { if (e.target === m) m.remove(); };
  m.querySelector('form').onsubmit = async e => {
    e.preventDefault(); const f = e.target;
    try { await api('/api/reports', { method: 'POST', body: { type, target, targetName, reason: f.reason.value, text: f.text.value } }); m.remove(); toast(t('report_sent')); } catch (err) { toast(err.message, 'err'); }
  };
}

// profile: friend button, report, online, their servers / favorite servers / friends
const _vUserP = vUser;
vUser = async function (params, stale) {
  await _vUserP(params, stale);
  if (stale()) return;
  const id = params.id;
  const x = await api('/api/users/' + encodeURIComponent(id) + '/extra').catch(() => null);
  if (stale() || !x) return;
  const me = S.me && S.me.user, mine = me && me.id === id;
  const head = view.querySelector('.phead');
  const stats = head && head.querySelector('.meta .row');
  if (stats) stats.insertAdjacentHTML('beforeend', `<span><b>${fmtNum(x.friendsCount)}</b> ${t('friends_n')}</span>${x.joinedAt ? `<span class="faint">${t('joined')} ${fmtDate(x.joinedAt)}</span>` : ''}${seenTxt(x) ? `<span class="faint">${seenTxt(x)}</span>` : ''}`);
  if (head && me && !mine) {
    const box = document.createElement('div'); box.className = 'row'; box.style.gap = '10px'; box.style.flexWrap = 'wrap';
    const flw = $('#flw'); if (flw) box.appendChild(flw);
    box.insertAdjacentHTML('beforeend', `<button class="btn" id="frB"></button><button class="icon-btn" id="repU" title="${t('report')}">${ic('flag', 'sm')}</button>`);
    head.appendChild(box);
    const drawFr = st => {
      const b = $('#frB'); x.friend = st;
      b.className = 'btn ' + (st === 'friends' ? 'ok' : st === 'incoming' ? 'primary' : '');
      b.innerHTML = st === 'friends' ? `${ic('users', 'sm')} ${t('friends_btn')}` : st === 'outgoing' ? `${ic('clock', 'sm')} ${t('request_sent')}` : st === 'incoming' ? `${ic('check', 'sm')} ${t('accept_friend')}` : `${ic('userplus', 'sm')} ${t('add_friend')}`;
    };
    drawFr(x.friend);
    $('#frB').onclick = async () => {
      try {
        if (x.friend === 'friends' && !confirm(t('confirm_unfriend', view.querySelector('.phead h1').textContent))) return;
        const r = await api('/api/friends/' + encodeURIComponent(id), { method: x.friend === 'friends' || x.friend === 'outgoing' ? 'DELETE' : 'POST', body: {} });
        drawFr(r.state);
      } catch (err) { toast(err.message, 'err'); }
    };
    $('#repU').onclick = () => reportModal('user', id, view.querySelector('.phead h1').textContent);
  }
  const grid = view.querySelector('.view-in > .grid');
  if (grid && grid.children.length) grid.insertAdjacentHTML('beforebegin', `<h3 class="sec-t">${ic('box', 'sm')} ${t('their_projects')}</h3>`);
  let extra = '';
  if (x.servers.length) extra += `<h3 class="sec-t">${ic('globe', 'sm')} ${t('their_servers')}</h3><div class="stack" style="gap:10px">${x.servers.map(srvRow).join('')}</div>`;
  if (x.favServers.length) extra += `<h3 class="sec-t">${ic('heart', 'sm')} ${t('their_favs')}</h3><div class="stack" style="gap:10px">${x.favServers.map(srvRow).join('')}</div>`;
  if (x.friends.length) extra += `<h3 class="sec-t">${ic('users', 'sm')} ${t('their_friends')}</h3><div class="people-grid">${x.friends.map(u => personRow(u)).join('')}</div>`;
  if (extra) { view.querySelector('.view-in').insertAdjacentHTML('beforeend', `<div id="uExtra">${extra}</div>`); bindCommon($('#uExtra')); }
};

// server page: favorite + report
const _vServerP = vServer;
vServer = async function (params, stale) {
  await _vServerP(params, stale);
  if (stale()) return;
  const row = view.querySelector('.srv-hero .row:last-child');
  if (!row) return;
  row.insertAdjacentHTML('beforeend', `<button class="btn" id="favB">${ic('heart', 'sm')} <span>${t('add_fav')}</span></button><button class="icon-btn" id="repS" title="${t('report')}">${ic('flag', 'sm')}</button>`);
  const drawFav = r => { const b = $('#favB'); if (!b) return; b.classList.toggle('ok', r.favorite); b.querySelector('span').textContent = `${r.favorite ? t('fav') : t('add_fav')} · ${fmtNum(r.count)}`; };
  api(`/api/servers/${encodeURIComponent(params.slug)}/favorite`).then(drawFav).catch(() => { });
  $('#favB').onclick = async () => { if (!(S.me && S.me.user)) return doLogin(); try { drawFav(await api(`/api/servers/${encodeURIComponent(params.slug)}/favorite`, { method: 'POST', body: {} })); } catch (err) { toast(err.message, 'err'); } };
  $('#repS').onclick = () => reportModal('server', params.slug, view.querySelector('.srv-hero h1').textContent);
};
// project page: report
const _vProjectP = vProject;
vProject = async function (params, stale) {
  await _vProjectP(params, stale);
  if (stale() || !S.params.project) return;
  const acts = view.querySelector('.phead .acts'), p = S.params.project;
  if (!acts || (S.me && S.me.user && S.me.user.id === p.ownerId)) return;
  acts.insertAdjacentHTML('beforeend', `<button class="icon-btn lg" id="repP" title="${t('report')}">${ic('flag', 'sm')}</button>`);
  $('#repP').onclick = () => reportModal('project', p.slug, p.name);
};

/* ---------- staff area ---------- */
const hasPerm = p => ((S.me && S.me.perms) || []).includes(p);
vAdmin = async function (p, stale) {
  const perms = (S.me && S.me.perms) || [];
  if (!perms.length) return put(emptyBox('shield', t('no_access')));
  if (p.tab) ADM_TAB = p.tab;
  const groups = [
    [null, [['me', 'home', null], ['guide', 'book', null], ['tasks', 'list', null], ['tickets', 'ticket', 'tickets.view']]],
    ['mod', [['reports', 'flag', 'moderation'], ['reviews', 'star', 'moderation'], ['users', 'user', 'moderation']]],
    ['content', [['overview', 'chart', null], ['apps', 'badge', 'creators'], ['creators', 'users', 'creators'], ['projects', 'box', 'projects'], ['servers', 'globe', 'projects'], ['updates', 'megaphone', 'content'], ['partners', 'handshake', 'content'], ['look', 'image', 'content'], ['texts', 'edit', 'content'], ['limits', 'tool', 'creators']]],
    ['manage', [['staff', 'shield', 'staff'], ['log', 'clock', 'staff'], ['backups', 'database', 'settings'], ['maint', 'tool', 'settings'], ['settings', 'settings', 'settings']]]
  ].map(([g, tabs]) => [g, tabs.filter(x => !x[2] || perms.includes(x[2]))]).filter(g => g[1].length);
  const all = groups.flatMap(g => g[1]);
  if (!all.some(x => x[0] === ADM_TAB)) ADM_TAB = 'me';
  const gName = { mod: LANG === 'he' ? 'מודרציה' : 'Moderation', content: LANG === 'he' ? 'ניהול תוכן' : 'Content', manage: LANG === 'he' ? 'הנהלה' : 'Management' };
  put(`<div class="head"><h1>${ic('shield', 'lg')} ${t('admin')}</h1></div>
    <div class="adm-shell"><nav class="adm-nav">${groups.map(([g, tabs]) => `${g ? `<div class="adm-g">${gName[g]}</div>` : ''}${tabs.map(([k, i]) => `<button data-atab="${k}" class="${k === ADM_TAB ? 'on' : ''}">${ic(i, 'sm')} ${t('a_' + k)}<span class="adm-n" data-an="${k}"></span></button>`).join('')}`).join('')}</nav><div id="aBody" class="adm-body"><div class="spin"></div></div></div>`);
  view.querySelectorAll('[data-atab]').forEach(b => b.onclick = () => { if (b.dataset.atab === 'tickets') { TK_SCOPE = 'all'; return go('support'); } ADM_TAB = b.dataset.atab; go('admin', {}, true); });
  api('/api/admin/my-stats').then(s => { const set = (k, n) => { const el = view.querySelector(`[data-an="${k}"]`); if (el && n) el.textContent = n; }; set('tickets', s.waiting); set('reports', s.openReports); set('tasks', s.myTasks); }).catch(() => { });
  const body = $('#aBody');
  const fn = { me: aMe, guide: aGuide, tasks: aTasks, reports: aReports, reviews: aReviewsMod, users: aUsers, log: aLog, overview: aOverview, apps: aApps, creators: aCreators, projects: aProjects, servers: aServers, updates: aUpdates, partners: aPartners, look: aLook, texts: aTexts, limits: aLimits, staff: aStaff, backups: aBackups, maint: aMaint, settings: aSettings }[ADM_TAB];
  try { await fn(body, stale); } catch (err) { if (!stale()) body.innerHTML = emptyBox('wifi', t('error'), err.message); }
  bindCommon(body);
};
const admGo = tab => { if (tab === 'tickets') { TK_SCOPE = 'all'; return go('support'); } ADM_TAB = tab; go('admin', {}, true); };

async function aMe(body, stale) {
  const s = await api('/api/admin/my-stats');
  if (stale()) return;
  const me = S.me.user;
  const k = (icon, n, label, sub, tab) => `<div class="kpi ${tab ? 'click' : ''}" ${tab ? `data-jump="${tab}"` : ''}>${ic(icon)}<b>${fmtNum(n)}</b><span>${label}</span>${sub ? `<small>${sub}</small>` : ''}</div>`;
  body.innerHTML = `<div class="card me-hero"><img class="av" src="${avatarOf(me)}" alt=""><div><h2 style="margin:0">${LANG === 'he' ? 'היי' : 'Hi'} ${esc(me.globalName || '')} 👋</h2><p class="faint" style="margin:4px 0 0">${t('staff_today')}</p></div><span class="spacer"></span><button class="btn" data-jump="guide">${ic('book', 'sm')} ${t('read_guide')}</button></div>
    <div class="kpis" style="margin-top:18px">
      ${hasPerm('tickets.view') ? k('ticket', s.waiting, t('st_waiting'), '', 'tickets') : ''}${hasPerm('moderation') ? k('flag', s.openReports, t('st_open_reports'), '', 'reports') : ''}${k('list', s.myTasks, t('st_my_tasks'), '', 'tasks')}
      ${k('msg', s.replies, t('st_replies'), t('st_week', s.repliesWeek))}${k('ticket', s.claimed, t('st_claimed'), s.openClaimed ? `${s.openClaimed} ${t('r_open')}` : '')}${k('check', s.reports, t('st_reports'))}${k('clock', s.actions, t('st_actions'), t('st_week', s.actionsWeek))}</div>
    <div class="card" style="margin-top:18px"><div class="card-h">${ic('check')}<h3>${t('staff_today')}</h3></div><div class="card-b todo-list">${I18N[LANG].staff_todo.map((x, i) => {
      const tab = ['tickets', 'reports', 'reviews', 'projects', 'tasks'][i], need = ['tickets.view', 'moderation', 'moderation', 'projects', null][i];
      return need && !hasPerm(need) ? '' : `<button class="todo" data-jump="${tab}"><span class="num">${i + 1}</span>${esc(x)}<span class="spacer"></span>${ic(flip(), 'sm')}</button>`;
    }).join('')}</div></div>`;
  body.querySelectorAll('[data-jump]').forEach(b => b.onclick = () => admGo(b.dataset.jump));
}

let GUIDE_SEC = null;
async function aGuide(body, stale, editing) {
  const g = await api('/api/admin/guide');
  if (stale()) return;
  if (!g.sections.some(s => s.id === GUIDE_SEC)) GUIDE_SEC = g.sections[0] && g.sections[0].id;
  if (editing) {
    const secs = g.sections.map(s => ({ ...s }));
    const draw = () => {
      body.innerHTML = `<div class="stack" id="gEd">${secs.map((s, i) => `<div class="card" data-i="${i}"><div class="card-h">${ic(s.icon || 'book')}<input type="text" class="g-title" value="${esc(s.title)}" placeholder="${t('sec_title')}" style="flex:1"><button class="icon-btn" data-up="${i}" ${i ? '' : 'disabled'}>▲</button><button class="icon-btn" data-dn="${i}" ${i < secs.length - 1 ? '' : 'disabled'}>▼</button><button class="icon-btn" data-del="${i}">${ic('trash', 'sm')}</button></div>
        <div class="card-b"><label class="lbl">${t('sec_body')}</label><textarea class="g-body" rows="10">${esc(s.body)}</textarea></div></div>`).join('')}
        <div class="row" style="gap:10px"><button class="btn lg" id="gAdd">${ic('plus', 'sm')} ${t('guide_add')}</button><span class="spacer"></span><button class="btn lg ghost" id="gCancel">${t('cancel')}</button><button class="btn primary lg" id="gSave">${ic('check', 'sm')} ${t('guide_save')}</button></div></div>`;
      const sync = () => body.querySelectorAll('[data-i]').forEach(c => { const s = secs[c.dataset.i]; s.title = c.querySelector('.g-title').value; s.body = c.querySelector('.g-body').value; });
      body.querySelectorAll('[data-up]').forEach(b => b.onclick = () => { sync(); const i = +b.dataset.up; [secs[i - 1], secs[i]] = [secs[i], secs[i - 1]]; draw(); });
      body.querySelectorAll('[data-dn]').forEach(b => b.onclick = () => { sync(); const i = +b.dataset.dn; [secs[i + 1], secs[i]] = [secs[i], secs[i + 1]]; draw(); });
      body.querySelectorAll('[data-del]').forEach(b => b.onclick = () => { sync(); if (confirm(t('confirm_delete', secs[+b.dataset.del].title))) { secs.splice(+b.dataset.del, 1); draw(); } });
      $('#gAdd').onclick = () => { sync(); secs.push({ id: 's' + Date.now().toString(36), icon: 'book', title: '', body: '' }); draw(); };
      $('#gCancel').onclick = () => aGuide(body, stale);
      $('#gSave').onclick = async () => { sync(); try { await api('/api/admin/guide', { method: 'PUT', body: { sections: secs } }); toast(t('saved')); aGuide(body, stale); } catch (err) { toast(err.message, 'err'); } };
    };
    return draw();
  }
  const cur = g.sections.find(s => s.id === GUIDE_SEC) || g.sections[0];
  body.innerHTML = `<div class="guide"><aside class="card guide-toc">${g.sections.map((s, i) => `<button data-sec="${esc(s.id)}" class="${s.id === GUIDE_SEC ? 'on' : ''}"><span class="num">${i + 1}</span>${esc(s.title)}</button>`).join('')}
      ${g.canEdit ? `<button class="btn" id="gEdit" style="margin-top:10px">${ic('edit', 'sm')} ${t('guide_edit')}</button>` : ''}</aside>
    <article class="card card-b guide-body">${cur ? `<h1 style="margin-top:0">${ic(cur.icon || 'book', 'lg')} ${esc(cur.title)}</h1><div class="md">${mdSteps(cur.body)}</div>` : ''}
      ${g.updatedAt ? `<p class="faint" style="font-size:12.5px;margin:24px 0 0">${t('guide_updated', timeAgo(g.updatedAt)).replace('{y}', esc(g.updatedBy))}</p>` : ''}</article></div>`;
  body.querySelectorAll('[data-sec]').forEach(b => b.onclick = () => { GUIDE_SEC = b.dataset.sec; aGuide(body, stale); });
  if ($('#gEdit')) $('#gEdit').onclick = () => aGuide(body, stale, true);
}

async function aTasks(body, stale) {
  const d = await api('/api/admin/tasks');
  if (stale()) return;
  const staffBy = Object.fromEntries(d.staff.map(s => [s.id, s]));
  const cols = ['todo', 'doing', 'done'];
  const card = x => { const a = staffBy[x.assignee]; const i = cols.indexOf(x.status);
    return `<div class="task prio-${x.priority}"><b>${esc(x.title)}</b>${x.text ? `<p>${esc(x.text)}</p>` : ''}
      <div class="row" style="gap:8px;margin-top:10px;font-size:12.5px">${a ? `<img class="av xs" src="${avatarOf(a)}" alt="" title="${esc(a.name)}"><span>${esc(a.name)}</span>` : `<span class="faint">${t('nobody')}</span>`}<span class="spacer"></span>
        ${i > 0 ? `<button class="icon-btn" data-mv="${x.id}" data-to="${cols[i - 1]}">${ic(LANG === 'he' ? 'fwd' : 'back', 'sm')}</button>` : ''}${i < 2 ? `<button class="icon-btn" data-mv="${x.id}" data-to="${cols[i + 1]}">${ic(LANG === 'he' ? 'back' : 'fwd', 'sm')}</button>` : ''}<button class="icon-btn" data-del="${x.id}">${ic('trash', 'sm')}</button></div>
      ${x.status === 'done' && x.doneBy ? `<div class="faint" style="font-size:12px;margin-top:6px">${t('done_by', esc(x.doneBy))} · ${timeAgo(x.doneAt)}</div>` : `<div class="faint" style="font-size:12px;margin-top:6px">${esc(x.by)} · ${timeAgo(x.at)}</div>`}</div>`; };
  body.innerHTML = `<form class="card" id="tkF"><div class="card-b row" style="gap:10px;flex-wrap:wrap;align-items:flex-end">
      <div style="flex:2;min-width:200px"><label class="lbl">${t('task_title')}</label><input type="text" name="title" required maxlength="120"></div>
      <div style="flex:1;min-width:150px"><label class="lbl">${t('assignee')}</label><select name="assignee"><option value="">${t('nobody')}</option>${d.staff.map(s => `<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('')}</select></div>
      <div style="min-width:120px"><label class="lbl">${t('prio')}</label><select name="priority"><option value="normal">${t('prio_normal')}</option><option value="high">${t('prio_high')}</option><option value="low">${t('prio_low')}</option></select></div>
      <div style="flex:3;min-width:240px"><label class="lbl">${t('task_text')}</label><input type="text" name="text" maxlength="2000"></div>
      <button class="btn primary lg">${ic('plus', 'sm')} ${t('task_new')}</button></div></form>
    <div class="board">${cols.map(c => { const list = d.tasks.filter(x => x.status === c); return `<div class="col col-${c}"><div class="col-h">${t('t_' + c)} <span class="chip">${list.length}</span></div>${list.map(card).join('') || '<p class="faint" style="text-align:center;margin:18px 0">—</p>'}</div>`; }).join('')}</div>`;
  $('#tkF').onsubmit = async e => { e.preventDefault(); const f = e.target; try { await api('/api/admin/tasks', { method: 'POST', body: { title: f.title.value, text: f.text.value, assignee: f.assignee.value, priority: f.priority.value } }); aTasks(body, stale); } catch (err) { toast(err.message, 'err'); } };
  body.querySelectorAll('[data-mv]').forEach(b => b.onclick = async () => { try { await api('/api/admin/tasks/' + b.dataset.mv, { method: 'PUT', body: { status: b.dataset.to } }); aTasks(body, stale); } catch (err) { toast(err.message, 'err'); } });
  body.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => { if (!confirm(t('confirm_delete', ''))) return; try { await api('/api/admin/tasks/' + b.dataset.del, { method: 'DELETE' }); aTasks(body, stale); } catch (err) { toast(err.message, 'err'); } });
}

let REP_F = 'open';
async function aReports(body, stale) {
  const list = await api('/api/admin/reports');
  if (stale()) return;
  const shown = list.filter(r => REP_F === 'all' || (REP_F === 'open' ? r.status === 'open' : r.status !== 'open'));
  const reasons = I18N[LANG].reasons;
  const goTo = r => r.link ? r.link.replace(/^(project|server):/, '$1:slug:').replace(/^user:/, 'user:id:') : '';
  body.innerHTML = `<div class="tabs" style="margin-bottom:14px">${['open', 'done', 'all'].map(k => `<button data-rf="${k}" class="${REP_F === k ? 'on' : ''}">${t('r_' + k)} ${k === 'open' ? `<span class="chip">${list.filter(r => r.status === 'open').length}</span>` : ''}</button>`).join('')}</div>
    <div class="stack" style="gap:12px">${shown.map(r => `<div class="card rep ${r.status}"><div class="card-h">${ic('flag')}<span class="chip">${t('type_' + r.type)}</span><b style="flex:1;min-width:0">${esc(r.targetName || r.target)}</b><span class="chip ${r.reason === 'malware' || r.reason === 'scam' ? 'danger' : 'accent'}">${esc(reasons[r.reason] || r.reason)}</span></div>
      <div class="card-b">${r.text ? `<p style="margin:0 0 10px;white-space:pre-wrap">${esc(r.text)}</p>` : ''}<div class="faint" style="font-size:13px">${t('reported_by', `<a href="#" data-go="user:id:${esc(r.by)}">${esc(r.byName)}</a>`)} · ${timeAgo(r.at)}${r.handledBy ? ` · ${t('handled_by', esc(r.handledBy))}${r.note ? ` — ${esc(r.note)}` : ''}` : ''}</div>
        <div class="row" style="gap:8px;margin-top:12px;flex-wrap:wrap">${goTo(r) ? `<button class="btn sm" data-go="${esc(goTo(r))}">${ic('eye', 'sm')} ${LANG === 'he' ? 'פתח' : 'Open'}</button>` : ''}${r.type === 'user' ? `<button class="btn sm" data-user="${esc(r.target)}">${ic('user', 'sm')} ${t('a_users')}</button>` : ''}
          <span class="spacer"></span>${r.status === 'open' ? `<input type="text" class="rep-note" placeholder="${t('note_opt')}" style="max-width:260px;height:36px"><button class="btn sm primary" data-ra="resolve" data-id="${r.id}">${ic('check', 'sm')} ${t('resolve')}</button><button class="btn sm" data-ra="dismiss" data-id="${r.id}">${t('dismiss')}</button>` : `<span class="chip ${r.status === 'resolved' ? 'accent' : ''}">${r.status === 'resolved' ? t('resolve') : t('dismiss')}</span><button class="btn sm ghost" data-ra="reopen" data-id="${r.id}">${t('reopen')}</button>`}</div></div></div>`).join('') || emptyBox('flag', t('no_results'))}</div>`;
  body.querySelectorAll('[data-rf]').forEach(b => b.onclick = () => { REP_F = b.dataset.rf; aReports(body, stale); });
  body.querySelectorAll('[data-ra]').forEach(b => b.onclick = async () => { const note = b.closest('.card').querySelector('.rep-note'); try { await api(`/api/admin/reports/${b.dataset.id}/${b.dataset.ra}`, { method: 'POST', body: { note: note ? note.value : '' } }); toast(t('saved')); aReports(body, stale); } catch (err) { toast(err.message, 'err'); } });
  body.querySelectorAll('[data-user]').forEach(b => b.onclick = () => { USER_OPEN = b.dataset.user; admGo('users'); });
  bindCommon(body);
}

async function aReviewsMod(body, stale) {
  let list = await api('/api/admin/reviews');
  if (stale()) return;
  const draw = () => {
    body.innerHTML = `<div class="card card-b">${list.map((r, i) => `<div class="lrow big" style="align-items:flex-start"><img class="av" src="${avatarOf(r)}" alt="" data-go="user:id:${esc(r.uid)}" style="cursor:pointer"><div style="flex:1;min-width:0"><div class="row" style="gap:8px;flex-wrap:wrap"><b>${esc(r.name)}</b><span class="stars">${'★'.repeat(r.rating)}<span class="faint">${'★'.repeat(5 - r.rating)}</span></span><span class="faint">→</span><a href="#" data-go="${r.kind}:slug:${esc(r.target)}">${esc(r.targetName)}</a><span class="chip">${t('type_' + r.kind)}</span><span class="faint" style="font-size:12.5px">${timeAgo(r.at)}</span></div>${r.text ? `<p style="margin:6px 0 0;white-space:pre-wrap">${esc(r.text)}</p>` : ''}</div><button class="icon-btn" data-del="${i}">${ic('trash', 'sm')}</button></div>`).join('') || emptyBox('star', t('no_reviews'))}</div>`;
    body.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => { const r = list[+b.dataset.del]; if (!confirm(t('confirm_delete', r.name))) return; try { await api(`/api/admin/reviews/${r.kind}/${encodeURIComponent(r.target)}/${r.id}`, { method: 'DELETE' }); list = list.filter(x => x !== r); draw(); toast(t('deleted')); } catch (err) { toast(err.message, 'err'); } });
    bindCommon(body);
  };
  draw();
}

let USER_OPEN = null, USER_Q = '', USER_BANNED = false;
async function aUsers(body, stale) {
  body.innerHTML = `<div class="row" style="gap:10px;margin-bottom:14px"><div class="searchbar" style="flex:1">${ic('search')}<input type="text" id="uQ" placeholder="${t('u_search')}" value="${esc(USER_Q)}"></div><button class="btn ${USER_BANNED ? 'primary' : ''}" id="uBan">${ic('ban', 'sm')} ${t('u_banned_only')}</button></div><div class="users-split"><div class="card card-b" id="uList"><div class="spin"></div></div><div id="uCard"></div></div>`;
  const load = async () => {
    const list = await api('/api/admin/users?' + new URLSearchParams(USER_Q ? { q: USER_Q } : USER_BANNED ? { filter: 'banned' } : {}));
    if (stale()) return;
    $('#uList').innerHTML = list.map(u => `<div class="lrow big u-row ${u.id === USER_OPEN ? 'on' : ''}" data-u="${esc(u.id)}"><div class="av-wrap"><img class="av" src="${avatarOf(u)}" alt="">${u.online ? '<span class="online-dot abs"></span>' : ''}</div><div style="flex:1;min-width:0"><b>${esc(u.name)}</b><div class="faint" style="font-size:12.5px">${[u.banned ? `<span class="chip danger">${u.banned.full ? t('full_ban_chip') : t('banned_chip')}</span>` : '', u.staff ? `<span class="chip">${ic('shield', 'sm')}</span>` : '', u.warnings ? `⚠️ ${u.warnings}` : '', u.lastSeen ? timeAgo(u.lastSeen) : ''].filter(Boolean).join(' · ')}</div></div></div>`).join('') || emptyBox('user', t('no_results'));
    $('#uList').querySelectorAll('[data-u]').forEach(r => r.onclick = () => { USER_OPEN = r.dataset.u; $('#uList').querySelectorAll('.u-row').forEach(x => x.classList.toggle('on', x === r)); openUser(); });
  };
  const openUser = async () => {
    const box = $('#uCard');
    if (!USER_OPEN) { box.innerHTML = ''; return; }
    box.innerHTML = '<div class="spin"></div>';
    let u;
    try { u = await api('/api/admin/users/' + encodeURIComponent(USER_OPEN)); } catch (err) { box.innerHTML = emptyBox('user', err.message); return; }
    if (stale()) return;
    box.innerHTML = `<div class="card"><div class="card-h"><img class="av" src="${avatarOf(u)}" alt="" style="width:52px;height:52px"><div style="flex:1;min-width:0"><h3 style="margin:0">${esc(u.name)}</h3><div class="faint mono ltr" style="font-size:12px">${esc(u.id)} · ${esc(u.provider)}</div></div><button class="btn sm" data-go="user:id:${esc(u.id)}">${ic('eye', 'sm')} ${t('view_profile')}</button></div>
      <div class="card-b stack" style="gap:16px">
        <div class="row" style="gap:14px;flex-wrap:wrap;font-size:13.5px"><span>${t('joined')} <b>${u.firstLogin ? fmtDate(u.firstLogin) : '—'}</b></span><span>${seenTxt(u)}</span><span><b>${u.projects}</b> ${t('projects')}</span><span><b>${u.servers}</b> ${t('servers')}</span><span><b>${u.tickets}</b> ${t('tickets_n')}</span><span><b>${u.reports}</b> ${t('reports_n')}</span></div>
        ${u.banned ? `<div class="ban-box">${ic('ban')}<div style="flex:1"><b>${u.banned.full ? t('full_ban_chip') : t('banned_chip')}</b> — ${esc(u.banned.reason)}<div class="faint" style="font-size:12.5px">${esc(u.banned.by)} · ${timeAgo(u.banned.at)} · ${u.banned.until ? t('suspended_until', fmtDate(u.banned.until)) : t('forever')}</div></div><button class="btn sm" id="uUnban">${t('unban')}</button></div>` : ''}
        ${u.staff ? '' : `<div class="row" style="gap:10px;flex-wrap:wrap"><button class="btn" id="uWarn">⚠️ ${t('warn')}</button>${u.banned ? '' : `<button class="btn danger" id="uBanB">${ic('ban', 'sm')} ${t('ban_btn')}</button>`}</div>`}
        <div id="uForm"></div>
        <div><h4 style="margin:0 0 8px">${t('warnings')} (${u.warnings.length})</h4>${u.warnings.slice().reverse().map(w => `<div class="note">⚠️ ${esc(w.text)}<div class="faint" style="font-size:12px">${esc(w.by)} · ${timeAgo(w.at)}</div></div>`).join('') || '<p class="faint" style="margin:0">—</p>'}</div>
        <div><h4 style="margin:0 0 8px">${t('staff_notes')}</h4>${u.notes.slice().reverse().map(n => `<div class="note">${esc(n.text)}<div class="faint row" style="font-size:12px">${esc(n.by)} · ${timeAgo(n.at)}<span class="spacer"></span><button class="icon-btn" data-dn="${n.id}">${ic('trash', 'sm')}</button></div></div>`).join('')}
          <div class="row" style="gap:8px;margin-top:8px"><input type="text" id="uNote" placeholder="${t('add_note')}…" maxlength="1000"><button class="btn" id="uNoteB">${ic('plus', 'sm')}</button></div></div>
      </div></div>`;
    bindCommon(box);
    const done = async (p, opts) => { try { await api(`/api/admin/users/${encodeURIComponent(u.id)}${p}`, opts); toast(t('saved')); openUser(); load(); } catch (err) { toast(err.message, 'err'); } };
    const form = (label, extra, cb) => { $('#uForm').innerHTML = `<form class="card card-b stack" style="gap:10px;background:var(--surface-2)"><div><label class="lbl">${label}</label><input type="text" name="reason" required minlength="3" maxlength="500"></div>${extra}<div class="row" style="gap:8px"><button class="btn primary">${ic('check', 'sm')} ${t('save')}</button><button type="button" class="btn ghost" data-c>${t('cancel')}</button></div></form>`; const f = $('#uForm form'); f.reason.focus(); f.querySelector('[data-c]').onclick = () => { $('#uForm').innerHTML = ''; }; f.onsubmit = e => { e.preventDefault(); cb(f); }; };
    if ($('#uWarn')) $('#uWarn').onclick = () => form(t('warn_reason'), '', f => done('/warn', { method: 'POST', body: { text: f.reason.value } }));
    if ($('#uBanB')) $('#uBanB').onclick = () => form(t('ban_reason'), banFields(), f => done('/ban', { method: 'PUT', body: banBody(f) }));
    if ($('#uUnban')) $('#uUnban').onclick = () => done('/ban', { method: 'DELETE' });
    $('#uNoteB').onclick = () => { const v = $('#uNote').value.trim(); if (v) done('/notes', { method: 'POST', body: { text: v } }); };
    box.querySelectorAll('[data-dn]').forEach(b => b.onclick = () => done('/notes/' + b.dataset.dn, { method: 'DELETE' }));
  };
  let timer;
  $('#uQ').oninput = () => { clearTimeout(timer); timer = setTimeout(() => { USER_Q = $('#uQ').value.trim(); load(); }, 250); };
  $('#uBan').onclick = () => { USER_BANNED = !USER_BANNED; USER_Q = ''; aUsers(body, stale); };
  await load(); openUser();
}

async function aLog(body, stale) {
  const list = await api('/api/admin/log');
  if (stale()) return;
  body.innerHTML = `<div class="card card-b">${list.slice(0, 300).map(l => `<div class="lrow" style="align-items:flex-start"><img class="av" src="${avatarOf(l)}" alt=""><div style="flex:1;min-width:0"><div class="row" style="gap:8px;flex-wrap:wrap"><b>${esc(l.by)}</b><span>${esc(l.title)}</span><span class="spacer"></span><span class="faint" style="font-size:12.5px">${timeAgo(l.at)}</span></div>${l.text ? `<div class="faint" style="font-size:13px;white-space:pre-wrap;word-break:break-word">${esc(l.text.replace(/<@[^>]+>/g, '').replace(/\*\*/g, ''))}</div>` : ''}</div></div>`).join('') || emptyBox('clock', t('no_results'))}</div>`;
}

// suspended accounts see a bar at the top
function drawBanBar() {
  let bar = $('#banBar');
  const b = S.me && S.me.banned;
  if (!b) { if (bar) bar.remove(); return; }
  if (!bar) { bar = document.createElement('div'); bar.id = 'banBar'; document.body.appendChild(bar); }
  bar.innerHTML = `${ic('ban')} <b>${t('suspended')}</b>${b.until ? ` ${t('suspended_until', fmtDate(b.until))}` : ''}${b.reason ? ` — ${esc(b.reason)}` : ''}`;
}

/* ---------- routes + sidebar ---------- */
const _go4 = go;
go = function (route, params, noHistory) {
  if (route !== 'people') return _go4(route, params, noHistory);
  params = params || {};
  if (!noHistory && (S.route !== route || JSON.stringify(S.params) !== JSON.stringify(params))) S.history.push([S.route, S.params]);
  S.route = route; S.params = params;
  $('#backBtn').disabled = !S.history.length;
  renderNav(); view.scrollTop = 0; view.innerHTML = '<div class="spin"></div>';
  const seq = ++go.seq;
  Promise.resolve(vPeople(params, () => seq !== go.seq)).catch(err => { if (seq === go.seq) view.innerHTML = `<div class="view-in">${emptyBox('wifi', t('error'), err.message)}</div>`; });
};
go.seq = _go4.seq;
const _renderNav4 = renderNav;
renderNav = function () {
  _renderNav4();
  const nav = $('#nav');
  const r = S.route === 'user' ? 'people' : S.route;
  const anchor = nav.querySelector('[data-go="creators"]');
  if (anchor && !nav.querySelector('[data-go="people"]')) {
    anchor.insertAdjacentHTML('afterend', `<a href="#" data-go="people" class="${r === 'people' ? 'on' : ''}">${ic('users')} ${t('people')}</a>`);
    anchor.classList.remove('on');
    if (S.route === 'creators') anchor.classList.add('on');
    const a = nav.querySelector('[data-go="people"]'); a._b = 0; bindCommon(nav);
  }
  drawBanBar();
};

/* ---------- app update: bar + popup (fixed) ---------- */
Object.assign(I18N.he, { au_title: 'גרסה חדשה של Craft Hub!', au_text: 'גרסה {x} מוכנה להורדה — עם שיפורים ותיקונים.', au_later: 'אחר כך', au_ready: 'העדכון מוכן — {x}', au_restart: 'הפעל מחדש ועדכן', au_failed: 'הורדת העדכון נכשלה', au_retry: 'נסה שוב', au_dl_toast: 'מוריד את העדכון… האפליקציה תופעל מחדש לבד בסוף', au_installing: 'מתקין…', au_starting: 'מתחיל הורדה…' });
Object.assign(I18N.en, { au_title: 'A new Craft Hub version!', au_text: 'Version {x} is ready — with improvements and fixes.', au_later: 'Later', au_ready: 'Update ready — {x}', au_restart: 'Restart & update', au_failed: 'The update download failed', au_retry: 'Try again', au_dl_toast: 'Downloading the update… the app restarts by itself when done', au_installing: 'Installing…', au_starting: 'Starting download…' });
let AU_POP = false;
function startUpdate() { B.installUpdate().then(r => { if (r && r.ok === false && r.error !== 'dev') toast(t('au_failed') + (r.error ? ': ' + r.error : ''), 'err'); }).catch(() => { }); }
drawUpdate = function (st) {
  const bar = $('#updBar');
  if (!st || !st.available || st.blocked) { bar.hidden = true; return; }
  bar.hidden = false;
  bar.classList.toggle('urgent', st.daysLeft <= 3 && !st.downloaded);
  const busy = st.downloading && !st.downloaded;
  let label, btn;
  if (st.error && !busy && !st.downloaded) { label = `<b>${t('au_failed')}</b><span class="faint upd-err">${esc(String(st.error).slice(0, 90))}</span>`; btn = `<button class="btn sm primary" id="updGo">${ic('refresh', 'sm')} ${t('au_retry')}</button>`; }
  else if (st.downloaded) { label = `<b>${t('au_ready', (st.label || 'v' + st.version))}</b>`; btn = `<button class="btn sm primary" id="updGo" ${st.installing ? 'disabled' : ''}>${ic('refresh', 'sm')} ${st.installing ? t('au_installing') : t('au_restart')}</button>`; }
  else if (busy || st.installing) { label = `<b>${t('upd_available', (st.label || 'v' + st.version))}</b><span class="upd-prog"><i style="width:${st.progress || 0}%"></i></span><span class="faint">${st.progress ? st.progress + '%' : t('au_starting')}</span>`; btn = `<button class="btn sm primary" disabled>${t('upd_downloading', st.progress || 0)}</button>`; }
  else { label = `<b>${t('upd_available', (st.label || 'v' + st.version))}</b>`; btn = `<button class="btn sm primary" id="updGo">${ic('download', 'sm')} ${t('upd_now')}</button>`; }
  bar.innerHTML = `${ic('download', 'sm')}${label}<span class="spacer"></span>${st.downloaded ? '' : `<span class="days">${t('upd_days', st.daysLeft)}</span>`}${btn}`;
  const go_ = $('#updGo');
  if (go_) go_.onclick = () => { go_.disabled = true; if (!st.downloaded) toast(t('au_dl_toast')); startUpdate(); };
  if (AU_POP || st.downloading || st.downloaded || st.installing) return;
  AU_POP = true;
  const m = document.createElement('div');
  m.className = 'modal-back';
  m.innerHTML = `<div class="card upd-modal"><div class="upd-ic">${ic('download', 'xl')}</div><h2>${t('au_title')}</h2><p>${esc(t('au_text', (st.label || 'v' + st.version)))}</p><p class="faint" style="font-size:13px">${esc(t('upd_days', st.daysLeft))}</p>
    <div class="row" style="justify-content:center;margin-top:18px"><button class="btn primary lg" id="updPopGo">${ic('download', 'sm')} ${t('upd_now')}</button><button class="btn lg ghost" id="updPopLater">${t('au_later')}</button></div></div>`;
  document.body.appendChild(m);
  $('#updPopLater').onclick = () => m.remove();
  $('#updPopGo').onclick = () => { m.remove(); toast(t('au_dl_toast')); startUpdate(); };
};
updPopupShown = true; // the old popup is replaced by the one above
B.updateState().then(st => drawUpdate(st)).catch(() => { });

/* ================= home page (showcase design) ================= */
Object.assign(ICONS, {
  puzzle: '<path d="M10 3h4v3a2 2 0 1 0 4 0V3h3v7h-3a2 2 0 1 0 0 4h3v7h-7v-3a2 2 0 1 0-4 0v3H3v-7h3a2 2 0 1 0 0-4H3V3h7Z"/>',
  gear: '<circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.9 1.2-1.8-.6-1.3.3-2.7 1.7-2.7H17a4 4 0 0 0 4-4c0-5-4-9.5-9-9.5Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5"/>',
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2Z"/><path d="M9 4v14M15 6v14"/>'
});
Object.assign(I18N.he, {
  h_hello: 'שלום', h_sub: 'פלאגינים, מודים, טקסטורות ושיידרים מהקהילה — מתקינים בלחיצה אחת.',
  h_search: 'מה מחפשים היום? פלאגין, מוד, טקסטורה…', h_projects: 'פרויקטים', h_downloads: 'הורדות', h_creators: 'קרייטורים', h_servers: 'שרתים',
  h_spotlight: 'בזרקור', h_explore: 'לגלות תוכן', h_t_trending: 'טרנדי', h_t_new: 'חדש', h_t_top: 'הכי מורדים', h_t_liked: 'הכי אהובים', h_votes: 'הצבעות החודש',
  h_top_creators: 'הקרייטורים שלנו', h_become: 'רוצה לפרסם תוכן?', h_become_sub: 'העלה את הפלאגין או המוד שלך והגע לאלפי שחקנים.', h_upload: 'העלאת פרויקט', h_add_server: 'הוספת שרת', h_view: 'לצפייה',
  bg_change: 'שנה רקע', bg_title: 'רקע', bg_for_home: 'דף הבית', bg_for_all: 'כל האפליקציה', bg_upload: 'העלאת תמונה מהמחשב', bg_link: 'או הדבק קישור לתמונה', bg_use_link: 'השתמש בקישור', bg_remove: 'הסר רקע', bg_dim: 'הכהייה', bg_none: 'אין רקע — משתמשים ברקע הרגיל', bg_saved: 'הרקע עודכן ✓', bg_tip: 'מומלץ: תמונה רחבה (1920×1080 ומעלה), עד 15MB'
});
Object.assign(I18N.en, {
  h_hello: 'Hi', h_sub: 'Plugins, mods, texture packs and shaders from the community — installed in one click.',
  h_search: 'What are you looking for? A plugin, mod, texture pack…', h_projects: 'Projects', h_downloads: 'Downloads', h_creators: 'Creators', h_servers: 'Servers',
  h_spotlight: 'Spotlight', h_explore: 'Explore', h_t_trending: 'Trending', h_t_new: 'New', h_t_top: 'Most downloaded', h_t_liked: 'Most liked', h_votes: 'votes this month',
  h_top_creators: 'Our creators', h_become: 'Want to publish?', h_become_sub: 'Upload your plugin or mod and reach thousands of players.', h_upload: 'Upload a project', h_add_server: 'Add a server', h_view: 'View',
  bg_change: 'Change background', bg_title: 'Background', bg_for_home: 'Home page', bg_for_all: 'Whole app', bg_upload: 'Upload an image', bg_link: 'or paste an image link', bg_use_link: 'Use link', bg_remove: 'Remove background', bg_dim: 'Dim', bg_none: 'No background — the regular one is used', bg_saved: 'Background updated ✓', bg_tip: 'Tip: a wide image (1920×1080 or more), up to 15MB'
});
const TYPE_ICON = { plugin: 'puzzle', mod: 'gear', resourcepack: 'palette', shader: 'sun', datapack: 'layers', modpack: 'box', world: 'map' };
// backgrounds can be a link or an image uploaded to the site (/icons/...)
const okBg = u => typeof u === 'string' && (/^https:\/\//.test(u) || /^\/icons\/[\w.-]+$/.test(u));
const bgUrl = u => okBg(u) ? siteImg(u) : '';
let HOME_TAB = 'trending', HOME_SLIDE = 0, homeTimer = null;

vHome = async function (p, stale) {
  clearInterval(homeTimer);
  const me = S.me && S.me.user;
  const [projects, srv, creators] = await Promise.all([loadProjects(), api('/api/servers').catch(() => ({ servers: [] })), api('/api/creators').catch(() => []), refreshInstalled()]);
  if (stale()) return;
  const servers = srv.servers || [];
  const a = (S.site && S.site.appearance) || {};
  const heroImg = bgUrl(a.homeBackgroundUrl) || bgUrl(a.backgroundUrl);
  const sorts = {
    trending: (x, y) => (y.week || 0) - (x.week || 0) || (y.downloads || 0) - (x.downloads || 0),
    new: (x, y) => y.createdAt - x.createdAt, top: (x, y) => (y.downloads || 0) - (x.downloads || 0), liked: (x, y) => (y.likes || 0) - (x.likes || 0)
  };
  const slides = [...projects.filter(x => x.featured), ...projects.slice().sort(sorts.trending)].filter((x, i, l) => l.indexOf(x) === i).slice(0, 4);
  const totalDl = projects.reduce((s, x) => s + (x.downloads || 0), 0);
  const counts = {}; projects.forEach(x => { const k = x.type || 'plugin'; counts[k] = (counts[k] || 0) + 1; });
  const types = Object.keys(S.site.projectTypes || { plugin: 1, mod: 1, resourcepack: 1, shader: 1 });
  const canBg = hasPerm('content');
  const medal = ['🥇', '🥈', '🥉'];
  if (HOME_SLIDE >= slides.length) HOME_SLIDE = 0;

  put(`
    <section class="sh-hero" ${heroImg ? `style="--hero:url('${esc(heroImg)}')"` : ''}>
      ${canBg ? `<button class="sh-bgbtn" id="bgBtn">${ic('image', 'sm')} ${t('bg_change')}</button>` : ''}
      <div class="sh-in">
        <div class="sh-mark">${ic('grid')}</div>
        <h1>${me ? `${t('h_hello')}, <span>${esc(me.globalName || me.username)}</span>` : esc(S.site.title || 'Craft Hub')}</h1>
        <p>${t('h_sub')}</p>
        <form class="sh-search" id="hSearch">${ic('search')}<input type="text" name="q" placeholder="${t('h_search')}" autocomplete="off"><button class="btn primary lg">${LANG === 'he' ? 'חפש' : 'Search'}</button></form>
        <div class="sh-pills">${types.map(k => `<button data-type="${k}">${ic(TYPE_ICON[k] || 'box', 'sm')} ${esc(typeName(k))}<small>${counts[k] || 0}</small></button>`).join('')}</div>
      </div>
    </section>

    <div class="sh-stats">
      ${[['box', projects.length, 'h_projects'], ['download', totalDl, 'h_downloads'], ['users', creators.length, 'h_creators'], ['globe', servers.length, 'h_servers']].map(([i, n, k]) => `<div>${ic(i)}<b>${fmtNum(n)}</b><span>${t(k)}</span></div>`).join('')}
    </div>

    ${slides.length ? `<section class="sh-spot">
      <div class="sh-spot-h">${ic('star')}<h2>${t('h_spotlight')}</h2><span class="spacer"></span><div class="sh-dots">${slides.map((x, i) => `<button data-slide="${i}" class="${i === HOME_SLIDE ? 'on' : ''}"></button>`).join('')}</div></div>
      <div class="sh-track" id="shTrack">${slides.map((x, i) => `<article class="sh-slide ${i === HOME_SLIDE ? 'on' : ''}" data-go="project:slug:${esc(x.slug)}">
        <div class="sh-slide-pic">${pic(x, 'xl')}</div>
        <div class="sh-slide-body"><span class="chip accent">${esc(typeName(x.type || 'plugin'))}</span><h3>${esc(x.name)}</h3><p>${esc(x.short || '')}</p>
          <div class="row" style="gap:14px;flex-wrap:wrap"><span class="stat">${ic('download', 'sm')} ${fmtNum(x.downloads)}</span>${x.likes ? `<span class="stat">${ic('heart', 'sm')} ${fmtNum(x.likes)}</span>` : ''}${x.owner && x.owner.name ? `<span class="faint">${esc(t('by', x.owner.name))}</span>` : ''}</div>
          <div class="row" style="gap:10px;margin-top:18px">${installBtn(x, 'lg')}<button class="btn lg">${t('h_view')} ${ic(flip(), 'sm')}</button></div></div></article>`).join('')}</div>
    </section>` : ''}

    <section class="section">
      <div class="section-h">${ic('grid')}<h2>${t('h_explore')}</h2><span class="spacer"></span><div class="tabs">${['trending', 'new', 'top', 'liked'].map(k => `<button data-ht="${k}" class="${k === HOME_TAB ? 'on' : ''}">${t('h_t_' + k)}</button>`).join('')}</div></div>
      <div class="grid" id="hGrid"></div>
      <div style="text-align:center;margin-top:16px"><button class="btn lg" data-go="discover">${t('see_all')}</button></div>
    </section>

    ${servers.length ? `<section class="section"><div class="section-h">${ic('globe')}<h2>${t('top_servers')}</h2><span class="spacer"></span><a class="link" href="#" data-go="servers">${t('see_all')}</a></div>
      <div class="sh-podium">${servers.slice(0, 3).map((s, i) => { const icon = siteImg(s.icon), banner = siteImg(s.banner); return `<div class="sh-srv r${i + 1}" data-go="server:slug:${esc(s.slug)}" ${banner ? `style="--bn:url('${esc(banner)}')"` : ''}>
        <span class="sh-medal">${medal[i]}</span><div class="pic lg">${icon ? `<img src="${esc(icon)}" alt="">` : esc(s.name.charAt(0))}</div><b>${esc(s.name)}</b>
        <button class="btn sm mono ltr" data-copy="${esc(s.address)}">${ic('copy', 'sm')} ${esc(s.address)}</button><span class="faint">${fmtNum(s.votesMonth || 0)} ${t('h_votes')}</span></div>`; }).join('')}</div></section>` : ''}

    ${creators.length ? `<section class="section"><div class="section-h">${ic('crown')}<h2>${t('h_top_creators')}</h2><span class="spacer"></span><a class="link" href="#" data-go="creators">${t('see_all')}</a></div>
      <div class="sh-creators">${creators.slice(0, 10).map(c => `<button class="sh-cr" data-go="user:id:${esc(c.id)}"><img src="${esc(siteImg(c.avatar) || c.avatar || '')}" alt="">${c.recommended ? `<span class="sh-cr-star">${ic('star', 'sm')}</span>` : ''}<b>${esc(c.name)}</b><small>${fmtNum(c.projectCount)} ${t('projects')}</small></button>`).join('')}</div></section>` : ''}

    <section class="sh-cta"><div><h3>${t('h_become')}</h3><p>${t('h_become_sub')}</p></div><span class="spacer"></span><button class="btn primary lg" data-go="studio">${ic('upload', 'sm')} ${t('h_upload')}</button><button class="btn lg" data-go="srvedit">${ic('globe', 'sm')} ${t('h_add_server')}</button></section>`);

  const drawGrid = () => { $('#hGrid').innerHTML = projects.slice().sort(sorts[HOME_TAB]).slice(0, 8).map(projectCard).join(''); bindCommon($('#hGrid')); };
  drawGrid();
  view.querySelectorAll('[data-ht]').forEach(b => b.onclick = () => { HOME_TAB = b.dataset.ht; view.querySelectorAll('[data-ht]').forEach(x => x.classList.toggle('on', x === b)); drawGrid(); });
  $('#hSearch').onsubmit = e => { e.preventDefault(); go('discover', { q: e.target.q.value.trim() }); };
  view.querySelectorAll('[data-type]').forEach(b => b.onclick = () => { DISC.cat = ''; go('discover', { type: b.dataset.type, q: '' }); });
  // spotlight: rotates every 6 seconds, dots jump to a slide
  const show = i => { HOME_SLIDE = i; view.querySelectorAll('.sh-slide').forEach((x, j) => x.classList.toggle('on', j === i)); view.querySelectorAll('[data-slide]').forEach((x, j) => x.classList.toggle('on', j === i)); };
  view.querySelectorAll('[data-slide]').forEach(b => b.onclick = () => { show(+b.dataset.slide); });
  if (slides.length > 1) homeTimer = setInterval(() => { if (stale() || !document.querySelector('.sh-slide')) return clearInterval(homeTimer); show((HOME_SLIDE + 1) % slides.length); }, 6000);
  if ($('#bgBtn')) $('#bgBtn').onclick = () => bgModal('home');
};

/* ---------- change the background (staff with the "content" permission) ---------- */
function bgModal(kind) {
  const m = document.createElement('div'); m.className = 'modal-back';
  const draw = () => {
    const a = (S.site && S.site.appearance) || {};
    const key = kind === 'home' ? 'homeBackgroundUrl' : 'backgroundUrl', dimKey = kind === 'home' ? 'homeBackgroundDim' : 'backgroundDim';
    const cur = a[key] || '', dim = a[dimKey] ?? (kind === 'home' ? 55 : 70);
    m.innerHTML = `<div class="card bg-modal"><div class="card-h">${ic('image')}<h3>${t('bg_title')}</h3><span class="spacer"></span><button class="icon-btn" data-x>✕</button></div><div class="card-b stack" style="gap:16px">
      <div class="tabs">${['home', 'all'].map(k => `<button data-k="${k}" class="${(kind === 'home') === (k === 'home') ? 'on' : ''}">${t(k === 'home' ? 'bg_for_home' : 'bg_for_all')}</button>`).join('')}</div>
      <div class="bg-prev2" style="${okBg(cur) ? `background-image:linear-gradient(rgba(0,0,0,${dim / 100}),rgba(0,0,0,${dim / 100})),url('${esc(bgUrl(cur))}')` : ''}">${okBg(cur) ? '' : `<span class="faint">${t('bg_none')}</span>`}</div>
      <div class="row" style="gap:10px;flex-wrap:wrap"><button class="btn primary lg" id="bgUp">${ic('upload', 'sm')} ${t('bg_upload')}</button>${okBg(cur) ? `<button class="btn lg danger" id="bgRm">${ic('trash', 'sm')} ${t('bg_remove')}</button>` : ''}</div>
      <p class="faint" style="margin:-6px 0 0;font-size:12.5px">${t('bg_tip')}</p>
      <div><label class="lbl">${t('bg_link')}</label><div class="row" style="gap:8px"><input type="text" id="bgLink" class="ltr" placeholder="https://…" value="${/^https:/.test(cur) ? esc(cur) : ''}"><button class="btn" id="bgLinkB">${t('bg_use_link')}</button></div></div>
      <div><label class="lbl">${t('bg_dim')} <b id="bgDimV">${dim}%</b></label><input type="range" id="bgDim" min="0" max="95" value="${dim}" style="width:100%;accent-color:var(--accent)"></div>
    </div></div>`;
    const done = site => { if (site) S.site = site; applyAppearance(); toast(t('bg_saved')); draw(); if (S.route === 'home') vHomeRefreshHero(); };
    const put_ = async body => { try { done(await api('/api/admin/appearance', { method: 'PUT', body })); } catch (err) { toast(err.message, 'err'); } };
    m.querySelector('[data-x]').onclick = () => m.remove();
    m.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { kind = b.dataset.k === 'home' ? 'home' : 'all'; draw(); });
    m.querySelector('#bgUp').onclick = async () => {
      const r = await B.uploadFile({ apiPath: `/api/admin/appearance/background/${kind === 'home' ? 'home' : 'main'}`, field: 'image', filters: [{ name: 'Image', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] }] });
      if (r.canceled) return;
      if (r.status !== 200) return toast(upErr(r), 'err');
      done(r.data);
    };
    if (m.querySelector('#bgRm')) m.querySelector('#bgRm').onclick = () => put_({ [key]: '' });
    m.querySelector('#bgLinkB').onclick = () => put_({ [key]: m.querySelector('#bgLink').value.trim() });
    const r = m.querySelector('#bgDim');
    r.oninput = () => { m.querySelector('#bgDimV').textContent = r.value + '%'; const p = m.querySelector('.bg-prev2'); if (okBg(cur)) p.style.backgroundImage = `linear-gradient(rgba(0,0,0,${r.value / 100}),rgba(0,0,0,${r.value / 100})),url('${bgUrl(cur)}')`; };
    r.onchange = () => put_({ [dimKey]: Number(r.value) });
  };
  document.body.appendChild(m);
  m.onclick = e => { if (e.target === m) m.remove(); };
  draw();
}
// after a background change on the home page, update the hero picture without reloading everything
function vHomeRefreshHero() {
  const a = (S.site && S.site.appearance) || {}, hero = view.querySelector('.sh-hero');
  if (!hero) return;
  const img = bgUrl(a.homeBackgroundUrl) || bgUrl(a.backgroundUrl);
  if (img) hero.style.setProperty('--hero', `url('${img.replace(/'/g, '')}')`); else hero.style.removeProperty('--hero');
}

/* ---------- a separate background for the home page ---------- */
Object.assign(I18N.he, { home_bg: 'תמונת רקע לדף הבית (קישור)', home_bg_hint: 'השאר ריק כדי להשתמש ברקע הרגיל גם בדף הבית', home_dim: 'הכהיית הרקע של דף הבית', bg_all: 'רקע לכל האפליקציה', bg_home: 'רקע לדף הבית' });
Object.assign(I18N.en, { home_bg: 'Home page background (URL)', home_bg_hint: 'Leave empty to use the regular background on the home page too', home_dim: 'Home background dim', bg_all: 'App background', bg_home: 'Home page background' });
function applyBg() {
  const a = (S.site && S.site.appearance) || {}, bg = $('#bgimg');
  if (!bg) return;
  const home = S.route === 'home' && okBg(a.homeBackgroundUrl);
  const url = home ? a.homeBackgroundUrl : a.backgroundUrl, dim = home ? (a.homeBackgroundDim ?? 55) : (a.backgroundDim ?? 70);
  if (!okBg(url)) { bg.hidden = true; bg.dataset.url = ''; return; }
  const css = `url("${bgUrl(url).replace(/"/g, '')}")`;
  bg.hidden = false;
  bg.style.opacity = String(1 - Math.min(95, Math.max(0, dim)) / 100);
  if (bg.dataset.url !== url) { bg.dataset.url = url; bg.style.backgroundImage = css; }
}
const _applyAppearanceH = applyAppearance;
applyAppearance = function () { _applyAppearanceH(); applyBg(); };
const _renderNavH = renderNav;
renderNav = function () { _renderNavH(); applyBg(); };

aLook = async function (body, stale) {
  const site = await api('/api/site');
  if (stale()) return;
  const a = site.appearance || {};
  const dimField = (name, label, v) => field(`${label} <b data-dv="${name}">${v}%</b>`, `<input type="range" name="${name}" min="0" max="95" value="${v}" style="accent-color:var(--accent)">`);
  body.innerHTML = `<form class="stack" id="lkF">
    <div class="card"><div class="card-h">${ic('image')}<h3>${t('bg_all')}</h3></div><div class="card-b form2">
      ${field(t('bg_url'), inp('backgroundUrl', a.backgroundUrl, 'class="ltr" placeholder="https://"'), true)}
      ${dimField('backgroundDim', t('bg_dim'), a.backgroundDim ?? 70)}
      ${field(t('accent'), `<input type="color" name="accentColor" value="${esc(a.accentColor || '#e3b341')}" style="height:48px;width:120px;padding:4px">`)}</div></div>
    <div class="card"><div class="card-h">${ic('home')}<h3>${t('bg_home')}</h3></div><div class="card-b form2">
      ${field(t('home_bg'), inp('homeBackgroundUrl', a.homeBackgroundUrl, 'class="ltr" placeholder="https://"'), true)}
      <p class="faint full" style="margin:-6px 0 0;font-size:13px">${t('home_bg_hint')}</p>
      ${dimField('homeBackgroundDim', t('home_dim'), a.homeBackgroundDim ?? 55)}
      <div class="bg-prev" id="hbPrev"></div></div></div>
    <div class="card"><div class="card-h">${ic('settings')}<h3>${t('a_look')}</h3></div><div class="card-b form2">
      ${toggle('announcementEnabled', a.announcementEnabled, t('announce_on'))}
      ${field(t('announce_text'), inp('announcement', site.announcement), true)}
      ${toggle('ticketsEnabled', a.ticketsEnabled !== false, t('feat_tickets'))}${toggle('creatorsEnabled', a.creatorsEnabled !== false, t('feat_creators'))}${toggle('downloadsEnabled', a.downloadsEnabled !== false, t('feat_downloads'))}</div></div>
    <button class="btn primary lg" style="align-self:flex-start">${ic('check', 'sm')} ${t('save')}</button></form>`;
  const f = $('#lkF');
  f.querySelectorAll('input[type=range]').forEach(r => r.oninput = () => { f.querySelector(`[data-dv="${r.name}"]`).textContent = r.value + '%'; prev(); });
  const prev = () => { const u = f.homeBackgroundUrl.value.trim(); $('#hbPrev').style.backgroundImage = okBg(u) ? `linear-gradient(rgba(0,0,0,${f.homeBackgroundDim.value / 100}),rgba(0,0,0,${f.homeBackgroundDim.value / 100})),url("${bgUrl(u).replace(/"/g, '')}")` : ''; $('#hbPrev').hidden = !okBg(u); };
  f.homeBackgroundUrl.oninput = prev; prev();
  f.onsubmit = async e => {
    e.preventDefault();
    try {
      await api('/api/admin/appearance', { method: 'PUT', body: { backgroundUrl: f.backgroundUrl.value.trim(), backgroundDim: Number(f.backgroundDim.value), homeBackgroundUrl: f.homeBackgroundUrl.value.trim(), homeBackgroundDim: Number(f.homeBackgroundDim.value), accentColor: f.accentColor.value, announcementEnabled: f.announcementEnabled.checked, ticketsEnabled: f.ticketsEnabled.checked, creatorsEnabled: f.creatorsEnabled.checked, downloadsEnabled: f.downloadsEnabled.checked } });
      await api('/api/admin/site', { method: 'PUT', body: { lang: 'he', announcement: f.announcement.value } });
      S.site = await api('/api/site'); applyAppearance(); toast(t('saved'));
    } catch (err) { toast(err.message, 'err'); }
  };
};

/* ================= bans: suspension or a full ban from the site ================= */
Object.assign(I18N.he, {
  ban_btn: 'באן / השעיה', ban_type: 'סוג', ban_full: 'באן מהאתר', ban_full_sub: 'חסום לגמרי — מנותק ולא יכול להתחבר', ban_susp: 'השעיה', ban_susp_sub: 'יכול לגלוש, אבל לא לפרסם, להגיב או לכתוב',
  full_ban_chip: 'באן', banned_title: 'נחסמת מ-Craft Hub', banned_reason: 'סיבה', banned_until: 'הבאן יוסר ב-{x}', banned_forever: 'הבאן לצמיתות', banned_appeal: 'חושב שזו טעות? פנה אלינו בדיסקורד.', user_banned_ok: 'המשתמש קיבל באן ✓', unbanned_ok: 'הבאן הוסר ✓'
});
Object.assign(I18N.en, {
  ban_btn: 'Ban / suspend', ban_type: 'Type', ban_full: 'Ban from the site', ban_full_sub: 'Fully blocked — signed out and can\'t sign in', ban_susp: 'Suspension', ban_susp_sub: 'Can browse, but can\'t post, comment or write',
  full_ban_chip: 'Banned', banned_title: 'You were banned from Craft Hub', banned_reason: 'Reason', banned_until: 'The ban ends on {x}', banned_forever: 'The ban is permanent', banned_appeal: 'Think it\'s a mistake? Contact us on Discord.', user_banned_ok: 'User banned ✓', unbanned_ok: 'Ban lifted ✓'
});
const banFields = () => `<div><label class="lbl">${t('ban_type')}</label><div class="ban-types">
    <label class="ban-type"><input type="radio" name="full" value="1" checked><span><b>⛔ ${t('ban_full')}</b><small>${t('ban_full_sub')}</small></span></label>
    <label class="ban-type"><input type="radio" name="full" value=""><span><b>⏸️ ${t('ban_susp')}</b><small>${t('ban_susp_sub')}</small></span></label></div></div>
  <div><label class="lbl">${t('ban_days')}</label><div class="row" style="gap:6px;flex-wrap:wrap">${[1, 3, 7, 30, 0].map(d => `<button type="button" class="btn sm ${d === 7 ? 'primary' : ''}" data-days="${d}">${d ? d + (LANG === 'he' ? ' ימים' : 'd') : t('forever')}</button>`).join('')}<input type="text" name="days" value="7" class="ltr" style="max-width:90px;height:36px"></div></div>`;
const banBody = f => ({ reason: f.reason.value, days: f.days.value, full: !!f.querySelector('[name=full]:checked').value });
// quick-day buttons inside any ban form
document.addEventListener('click', e => {
  const b = e.target.closest('[data-days]'); if (!b) return;
  const f = b.closest('form'); if (!f || !f.days) return;
  f.days.value = b.dataset.days; f.querySelectorAll('[data-days]').forEach(x => x.classList.toggle('primary', x === b));
});

// ban straight from someone's profile (moderators)
const _vUserBan = vUser;
vUser = async function (params, stale) {
  await _vUserBan(params, stale);
  if (stale() || !hasPerm('moderation') || (S.me.user && S.me.user.id === params.id)) return;
  const head = view.querySelector('.phead');
  if (!head) return;
  let u;
  try { u = await api('/api/admin/users/' + encodeURIComponent(params.id)); } catch { return; }
  if (stale() || u.staff) return;
  const row = head.querySelector('.row:last-child') || head;
  row.insertAdjacentHTML('beforeend', u.banned ? `<button class="btn" id="pUnban">${ic('ban', 'sm')} ${t('unban')}</button>` : `<button class="btn danger" id="pBan">${ic('ban', 'sm')} ${t('ban_btn')}</button>`);
  if (u.banned) head.querySelector('h1').insertAdjacentHTML('afterend', `<span class="chip danger">${u.banned.full ? t('full_ban_chip') : t('banned_chip')}</span>`);
  if ($('#pUnban')) $('#pUnban').onclick = async () => { try { await api('/api/admin/users/' + encodeURIComponent(params.id) + '/ban', { method: 'DELETE' }); toast(t('unbanned_ok')); go('user', { id: params.id }, true); } catch (err) { toast(err.message, 'err'); } };
  if ($('#pBan')) $('#pBan').onclick = () => {
    const m = document.createElement('div'); m.className = 'modal-back';
    m.innerHTML = `<form class="card tk-modal"><div class="card-h">${ic('ban')}<h3>${t('ban_btn')}</h3><span class="faint">${esc(u.name)}</span><span class="spacer"></span><button type="button" class="icon-btn" data-x>✕</button></div><div class="card-b stack">
      ${banFields()}<div><label class="lbl">${t('ban_reason')}</label><input type="text" name="reason" required minlength="3" maxlength="500"></div>
      <button class="btn danger lg">${ic('ban', 'sm')} ${t('ban_btn')}</button></div></form>`;
    document.body.appendChild(m);
    m.querySelector('[data-x]').onclick = () => m.remove();
    m.onclick = e => { if (e.target === m) m.remove(); };
    m.querySelector('form').onsubmit = async e => {
      e.preventDefault();
      try { await api('/api/admin/users/' + encodeURIComponent(params.id) + '/ban', { method: 'PUT', body: banBody(e.target) }); m.remove(); toast(t('user_banned_ok')); go('user', { id: params.id }, true); } catch (err) { toast(err.message, 'err'); }
    };
  };
};

// the banned person's side: a full-screen notice
function showBanScreen(b) {
  if (!b || $('#banScreen')) return;
  const el = document.createElement('div'); el.id = 'banScreen';
  el.innerHTML = `<div class="card ban-card"><div class="ban-ic">${ic('ban', 'xl')}</div><h1>${t('banned_title')}</h1>
    ${b.reason ? `<p><b>${t('banned_reason')}:</b> ${esc(b.reason)}</p>` : ''}<p class="faint">${b.until ? t('banned_until', fmtDate(b.until)) : t('banned_forever')}</p>
    <p class="faint" style="font-size:13.5px">${t('banned_appeal')}</p>${S.site && S.site.discordInvite ? `<button class="btn primary lg" data-ext="${esc(S.site.discordInvite)}">Discord</button>` : ''}</div>`;
  document.body.appendChild(el);
  bindCommon(el);
}
const _loadMeBan = loadMe;
loadMe = async function () { await _loadMeBan(); if (S.me && S.me.bannedUser) showBanScreen(S.me.banned); };
const _apiBan = api;
api = async function (path, opts) {
  try { return await _apiBan(path, opts); }
  catch (err) { if (err.status === 403 && err.data && err.data.banned && err.data.banned.full) showBanScreen(err.data.banned); throw err; }
};

/* ================= credits + copyright page, footer with Discord, copy protection ================= */
Object.assign(ICONS, { discord: '<path d="M8.5 7.5c2.3-.7 4.7-.7 7 0M8.2 16.6c2.4.9 5.2.9 7.6 0M7.4 6.3 6 4.8C4.3 5.2 3 6 3 6 1.4 9.3 1.2 12.6 1.6 16c1.8 1.4 3.6 2.2 5.4 2.7l1.1-1.9m7.8-10.5L17.4 4.8c1.7.4 3 1.2 3 1.2 1.6 3.3 1.8 6.6 1.4 10-1.8 1.4-3.6 2.2-5.4 2.7l-1.1-1.9"/><circle cx="9" cy="12.2" r="1.3"/><circle cx="15" cy="12.2" r="1.3"/>' });
Object.assign(I18N.he, {
  legal: 'קרדיטים וזכויות', lg_credits: 'קרדיטים', lg_copyright: 'זכויות יוצרים', lg_team: 'הצוות', lg_thanks: 'תודה מיוחדת', lg_thanks_text: 'לכל {x} הקרייטורים שמעלים תוכן, ולכל הקהילה שמורידה, מדרגת ועוזרת לנו להשתפר 💛',
  lg_built: 'נבנה בעזרת', lg_license: 'רישיון', lg_version: 'גרסת האפליקציה', lg_updated: 'עודכן לאחרונה: 27.9.2026',
  t_credits: 'שמות נוספים בדף הקרדיטים (שורה לכל אחד: שם — תפקיד)', t_credits_ph: 'NOAM2509_S — פיתוח',
  ft_join: 'הצטרפו לשרת הדיסקורד שלנו', ft_join_sub: 'עדכונים, תמיכה, הגרלות ואנשים שאוהבים מיינקראפט', ft_btn: 'הצטרפות לדיסקורד', ft_rights: '© {x} Craft Hub · כל הזכויות שמורות', ft_mc: 'לא מוצר רשמי של Minecraft. לא מאושר על ידי Mojang או Microsoft ואינו קשור אליהן.',
  cp: [
    ['בעלות', 'האפליקציה Craft Hub, האתר crafthubs.net, העיצוב, הקוד, הלוגו, השם "Craft Hub", הטקסטים והגרפיקה — שייכים ל-Craft Hub. כל הזכויות שמורות.'],
    ['התוכן של הקרייטורים', 'כל פרויקט (פלאגין, מוד, טקסטורה, שיידר, מפה וכו\') שייך לקרייטור שהעלה אותו. בהעלאה, הקרייטור מאשר ל-Craft Hub להציג ולהפיץ את התוכן באפליקציה ובאתר בלבד, ומצהיר שיש לו את כל הזכויות עליו.'],
    ['מה אסור', '• להעתיק, לשכפל, להפיץ, למכור או לפרסם מחדש תוכן, עיצוב או קוד מ-Craft Hub בלי אישור בכתב.\n• להעלות תוכן של מישהו אחר כאילו הוא שלך, או בלי רשות היוצר.\n• להוריד פרויקטים מ-Craft Hub ולהעלות אותם מחדש לאתר אחר בלי רשות היוצר.\n• לעשות הנדסה לאחור (Reverse Engineering) לאפליקציה, לפרוץ, או לעקוף הגנות והגבלות.\n• לאסוף מידע או תוכן בצורה אוטומטית (בוטים, Scraping).\n• להשתמש בשם, בלוגו או בעיצוב של Craft Hub בלי אישור.'],
    ['דיווח על הפרה', 'חושב שמישהו העלה תוכן שלך בלי רשות? פתח טיקט מסוג "דיווח" (או לחץ על 🚩 בדף הפרויקט) וצרף הוכחה שהתוכן שלך. נבדוק ונסיר תוכן מפר בהקדם.'],
    ['מה קורה למי שמפר', 'התוכן המפר יוסר. בנוסף — לפי חומרת המקרה — אזהרה, השעיה, באן לצמיתות מ-Craft Hub, ובמקרים חמורים גם צעדים משפטיים.'],
    ['מיינקראפט', 'Craft Hub אינו מוצר רשמי של Minecraft, ואינו מאושר על ידי Mojang או Microsoft או קשור אליהן. "Minecraft" הוא סימן מסחרי של Mojang AB.'],
    ['שינויים', 'אנחנו רשאים לעדכן את הסעיפים האלה מדי פעם. המשך שימוש ב-Craft Hub אחרי עדכון מהווה הסכמה לסעיפים המעודכנים.']
  ]
});
Object.assign(I18N.en, {
  legal: 'Credits & rights', lg_credits: 'Credits', lg_copyright: 'Copyright', lg_team: 'The team', lg_thanks: 'Special thanks', lg_thanks_text: 'To all {x} creators who share their work, and to the whole community that downloads, rates and helps us improve 💛',
  lg_built: 'Built with', lg_license: 'License', lg_version: 'App version', lg_updated: 'Last updated: Sep 27, 2026',
  t_credits: 'Extra names on the credits page (one per line: name — role)', t_credits_ph: 'NOAM2509_S — development',
  ft_join: 'Join our Discord server', ft_join_sub: 'Updates, support, giveaways and people who love Minecraft', ft_btn: 'Join Discord', ft_rights: '© {x} Craft Hub · All rights reserved', ft_mc: 'Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.',
  cp: [
    ['Ownership', 'The Craft Hub app, the crafthubs.net site, the design, code, logo, the "Craft Hub" name, texts and graphics belong to Craft Hub. All rights reserved.'],
    ['Creators\' content', 'Every project (plugin, mod, texture pack, shader, map, etc.) belongs to the creator who uploaded it. By uploading, the creator lets Craft Hub show and distribute it in the app and on the site only, and declares they hold all rights to it.'],
    ['What is not allowed', '• Copying, duplicating, distributing, selling or republishing content, design or code from Craft Hub without written permission.\n• Uploading someone else\'s content as your own, or without the creator\'s permission.\n• Downloading projects from Craft Hub and re-uploading them elsewhere without the creator\'s permission.\n• Reverse engineering the app, hacking it, or bypassing protections and limits.\n• Automated collection of data or content (bots, scraping).\n• Using the Craft Hub name, logo or design without permission.'],
    ['Reporting infringement', 'Think someone uploaded your work without permission? Open a "report" ticket (or press 🚩 on the project page) with proof that it is yours. We will review it and remove infringing content quickly.'],
    ['Consequences', 'Infringing content is removed. Depending on severity: a warning, a suspension, a permanent ban from Craft Hub, and in serious cases legal action.'],
    ['Minecraft', 'Craft Hub is not an official Minecraft product and is not approved by or associated with Mojang or Microsoft. "Minecraft" is a trademark of Mojang AB.'],
    ['Changes', 'We may update these terms from time to time. Continuing to use Craft Hub after an update means you accept them.']
  ]
});
const DISCORD_FALLBACK = 'https://discord.gg/ZW4uCt4yQ';
const discordLink = () => (S.site && /^https:\/\//.test(S.site.discordInvite || '') ? S.site.discordInvite : DISCORD_FALLBACK);
const BUILT_WITH = [['Electron', 'MIT'], ['Node.js', 'MIT'], ['Express', 'MIT'], ['electron-updater', 'MIT'], ['adm-zip', 'MIT'], ['multer', 'MIT'], ['Nodemailer', 'MIT-0'], ['Heebo · Cinzel · JetBrains Mono', 'SIL OFL 1.1']];
let LEGAL_TAB = 'credits';
async function vLegal(p, stale) {
  if (p.tab) LEGAL_TAB = p.tab;
  put(`<div class="head"><div><h1>${ic('shield', 'lg')} ${t('legal')}</h1></div></div>
    <div class="tabs big" style="margin-bottom:20px"><button data-lt="credits" class="${LEGAL_TAB === 'credits' ? 'on' : ''}">${ic('star', 'sm')} ${t('lg_credits')}</button><button data-lt="copyright" class="${LEGAL_TAB === 'copyright' ? 'on' : ''}">${ic('lock', 'sm')} ${t('lg_copyright')}</button></div>
    <div id="lgBody"><div class="spin"></div></div>`);
  view.querySelectorAll('[data-lt]').forEach(b => b.onclick = () => go('legal', { tab: b.dataset.lt }, true));
  const body = $('#lgBody');
  if (LEGAL_TAB === 'copyright') {
    body.innerHTML = `<article class="card card-b legal-doc">${I18N[LANG].cp.map(([h, txt], i) => `<section><h3><span class="num">${i + 1}</span>${esc(h)}</h3><p>${esc(txt).replace(/\n/g, '<br>')}</p></section>`).join('')}<p class="faint" style="font-size:12.5px;margin:18px 0 0">${t('lg_updated')}</p></article>`;
    return;
  }
  const [team, creators, st] = await Promise.all([api('/api/team').catch(() => []), api('/api/creators').catch(() => []), B.updateState().catch(() => ({}))]);
  if (stale()) return;
  const extra = String((S.site && S.site.credits) || '').split('\n').map(l => l.trim()).filter(Boolean).map(l => { const [n, ...r] = l.split(/\s+[—-]\s+/); return { name: n, role: r.join(' — ') }; });
  body.innerHTML = `
    <section class="card credits-hero"><div class="sh-mark">${ic('grid')}</div><h2>Craft Hub</h2><p class="faint">${esc(S.site.subtitle || '')}</p>${st.current ? `<span class="chip">${t('lg_version')} ${esc(st.currentLabel || 'v' + st.current)}</span>` : ''}</section>
    ${team.length || extra.length ? `<h3 class="sec-t">${ic('users', 'sm')} ${t('lg_team')}</h3><div class="credit-grid">
      ${team.map(m => `<div class="credit" data-go="user:id:${esc(m.id)}"><img src="${esc(siteImg(m.avatar) || m.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png')}" alt="">${m.owner ? `<span class="credit-crown">${ic('crown', 'sm')}</span>` : ''}<b>${esc(m.name)}</b><small>${esc(m.title || (m.owner ? (LANG === 'he' ? 'מייסד' : 'Founder') : ''))}</small></div>`).join('')}
      ${extra.map(x => `<div class="credit"><div class="credit-av">${esc(x.name.charAt(0))}</div><b>${esc(x.name)}</b><small>${esc(x.role)}</small></div>`).join('')}</div>` : ''}
    <h3 class="sec-t">${ic('heart', 'sm')} ${t('lg_thanks')}</h3><div class="card card-b"><p style="margin:0;font-size:15.5px">${t('lg_thanks_text', fmtNum(creators.length))}</p>
      ${creators.length ? `<div class="credit-avs">${creators.slice(0, 24).map(c => `<img src="${esc(siteImg(c.avatar) || c.avatar || '')}" alt="" title="${esc(c.name)}" data-go="user:id:${esc(c.id)}">`).join('')}</div>` : ''}</div>
    <h3 class="sec-t">${ic('tool', 'sm')} ${t('lg_built')}</h3><div class="card card-b">${BUILT_WITH.map(([n, l]) => `<div class="lrow"><b style="flex:1">${n}</b><span class="chip">${t('lg_license')}: ${l}</span></div>`).join('')}</div>`;
  bindCommon(body);
}

// the bottom of every page: Discord button, rights, links
function footerHtml() {
  return `<footer class="app-foot"><div class="foot-dc"><span class="foot-dc-ic">${ic('discord', 'lg')}</span><div style="flex:1;min-width:0"><b>${t('ft_join')}</b><small>${t('ft_join_sub')}</small></div><button class="btn dc lg" data-ext="${esc(discordLink())}">${ic('discord', 'sm')} ${t('ft_btn')}</button></div>
    <div class="foot-row"><span>${t('ft_rights', new Date().getFullYear())}</span><span class="spacer"></span><a href="#" data-go="legal:tab:credits">${t('lg_credits')}</a><a href="#" data-go="legal:tab:copyright">${t('lg_copyright')}</a><a href="#" data-ext="${esc(discordLink())}">Discord</a></div>
    <p class="foot-mc">${t('ft_mc')}</p></footer>`;
}
new MutationObserver(() => {
  const v = view.querySelector(':scope > .view-in');
  if (!v) return;
  const f = v.querySelector(':scope > .app-foot');
  if (!f) { v.insertAdjacentHTML('beforeend', footerHtml()); bindCommon(v.querySelector(':scope > .app-foot')); }
  // parts of a page that arrive later (reviews, graphs…) go above the footer
  else if (v.lastElementChild !== f) v.appendChild(f);
}).observe(view, { childList: true, subtree: true });

// no copying: text can't be selected or dragged and there is no right-click menu (except in text fields)
const editable = el => el && el.closest && el.closest('input, textarea, [contenteditable="true"]');
document.addEventListener('contextmenu', e => { if (!editable(e.target)) e.preventDefault(); });
document.addEventListener('dragstart', e => { if (!editable(e.target)) e.preventDefault(); });
document.addEventListener('copy', e => { if (!editable(document.activeElement)) e.preventDefault(); });
document.addEventListener('cut', e => { if (!editable(document.activeElement)) e.preventDefault(); });

const _goLegal = go;
go = function (route, params, noHistory) {
  if (route !== 'legal') return _goLegal(route, params, noHistory);
  params = params || {};
  if (!noHistory && (S.route !== route || JSON.stringify(S.params) !== JSON.stringify(params))) S.history.push([S.route, S.params]);
  S.route = route; S.params = params;
  $('#backBtn').disabled = !S.history.length;
  renderNav(); view.scrollTop = 0; view.innerHTML = '<div class="spin"></div>';
  const seq = ++go.seq;
  Promise.resolve(vLegal(params, () => seq !== go.seq)).catch(err => { if (seq === go.seq) view.innerHTML = `<div class="view-in">${emptyBox('wifi', t('error'), err.message)}</div>`; });
};
go.seq = _goLegal.seq;

/* ================= messages, what's new, vote reminders, video, similar, player graph, events, leaderboard, verified ================= */
Object.assign(ICONS, {
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>',
  play2: '<path d="M8 5v14l11-7Z"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  vcheck: '<path d="M12 2.5l2.3 1.7 2.9-.1.9 2.7 2.4 1.7-.9 2.7.9 2.7-2.4 1.7-.9 2.7-2.9-.1L12 21.5l-2.3-1.7-2.9.1-.9-2.7-2.4-1.7.9-2.7-.9-2.7 2.4-1.7.9-2.7 2.9.1Z" fill="currentColor" stroke="none"/><path d="m8.6 12.2 2.3 2.3 4.5-4.8" stroke="#fff" stroke-width="2.2"/>'
});
Object.assign(I18N.he, {
  messages: 'הודעות', dm_empty: 'עוד אין שיחות — שלח הודעה לחבר מהפרופיל שלו', dm_pick: 'בחר שיחה', dm_ph: 'כתוב הודעה…', dm_send: 'שלח', dm_only_friends: 'אפשר לשלוח הודעות רק לחברים', dm_btn: 'הודעה', dm_new: 'הודעה חדשה מ-{x}',
  wn_title: 'מה חדש ב-Craft Hub', wn_ok: 'מגניב!',
  vr_ready: 'אפשר להצביע שוב ל-{x}', vr_go: 'להצבעה', vr_notif: '🗳️ אפשר להצביע שוב ל-{x}',
  yt_video: 'סרטון יוטיוב (קישור)', yt_title: 'סרטון',
  similar: 'אולי תאהב גם',
  pg_title: 'שחקנים — 7 ימים אחרונים', pg_peak: 'שיא', pg_avg: 'ממוצע', pg_uptime: 'זמינות', pg_none: 'עוד אין נתונים — המדידה מתעדכנת כל 15 דקות', pg_offline: 'כבוי',
  ev_title: 'אירועים', ev_upcoming: 'אירועים קרובים', ev_none: 'אין אירועים קרובים', ev_add: 'אירוע חדש', ev_name: 'שם האירוע', ev_when: 'מתי', ev_text: 'פרטים (לא חובה)', ev_live: 'עכשיו!', ev_in: 'בעוד {x}', ev_hint: 'מי שסימן את השרת כמועדף יקבל התראה, ותזכורת שעה לפני',
  leaders: 'מובילים', lb_sub: 'הכי חמים החודש', lb_creators: 'קרייטורים — הורדות החודש', lb_projects: 'פרויקטים — הורדות החודש', lb_servers: 'שרתים — הצבעות החודש', lb_voters: 'מצביעים — החודש', lb_empty: 'עוד אין נתונים החודש',
  verified: 'מאומת', verify_on: 'תן וי כחול', verify_off: 'הסר וי כחול'
});
Object.assign(I18N.en, {
  messages: 'Messages', dm_empty: 'No conversations yet — message a friend from their profile', dm_pick: 'Pick a conversation', dm_ph: 'Write a message…', dm_send: 'Send', dm_only_friends: 'You can only message friends', dm_btn: 'Message', dm_new: 'New message from {x}',
  wn_title: 'What\'s new in Craft Hub', wn_ok: 'Cool!',
  vr_ready: 'You can vote again for {x}', vr_go: 'Vote', vr_notif: '🗳️ You can vote again for {x}',
  yt_video: 'YouTube video (link)', yt_title: 'Video',
  similar: 'You might also like',
  pg_title: 'Players — last 7 days', pg_peak: 'Peak', pg_avg: 'Average', pg_uptime: 'Uptime', pg_none: 'No data yet — it is sampled every 15 minutes', pg_offline: 'Offline',
  ev_title: 'Events', ev_upcoming: 'Upcoming events', ev_none: 'No upcoming events', ev_add: 'New event', ev_name: 'Event name', ev_when: 'When', ev_text: 'Details (optional)', ev_live: 'Now!', ev_in: 'in {x}', ev_hint: 'Everyone who favorited the server gets notified, plus a reminder an hour before',
  leaders: 'Leaderboard', lb_sub: 'The hottest this month', lb_creators: 'Creators — downloads this month', lb_projects: 'Projects — downloads this month', lb_servers: 'Servers — votes this month', lb_voters: 'Voters — this month', lb_empty: 'No data this month yet',
  verified: 'Verified', verify_on: 'Give blue check', verify_off: 'Remove blue check'
});

/* ---------- blue check next to verified names ---------- */
const vcheck = () => `<span class="vcheck" title="${t('verified')}">${ic('vcheck', 'sm')}</span>`;
const _projectCardV = projectCard;
projectCard = function (p) { const h = _projectCardV(p); return p.owner && p.owner.verified ? h.replace(/(<div class="by">[^<]*)(<\/div>)/, `$1 ${vcheck()}$2`) : h; };
const _personRowV = personRow;
personRow = function (u, right) { const h = _personRowV(u, right); return u.verified ? h.replace('</b>', ` ${vcheck()}</b>`) : h; };

/* ---------- private messages ---------- */
let DM = { with: null, last: 0, timer: null, unread: 0 };
// (the private / group chat view is further down: "messages: private chats + group chats")
// unread counter on the sidebar + a desktop notification for new messages
async function pollDms() {
  if (!S.me || !S.me.user) return;
  try {
    const { unread } = await api('/api/dm/unread');
    if (unread > DM.unread && S.route !== 'messages') {
      const convs = await api('/api/dm').catch(() => []);
      const c = convs.find(x => x.unread);
      if (c) { const nm = c.group ? c.group.name : c.with.name, link = c.group ? '/messages/g/' + c.group.id : '/messages/' + c.with.id; if (document.hasFocus()) toast(t('dm_new', nm) + ': ' + c.last.text.slice(0, 60)); else B.notify({ title: t('dm_new', nm), body: c.last.text, link }); }
    }
    DM.unread = unread;
    const n = $('#nav [data-go="messages"] .nav-n'); if (n) n.textContent = unread || '';
  } catch { }
}
setInterval(pollDms, 20000);

/* ---------- what's new after an update ---------- */
const CHANGELOG = [
  { v: '1.12.0', items: ['📞 שיחות קוליות בין חברים', '🎙️ הגדרות מיקרופון ורמקולים', '🖥️ שיתוף מסך בשיחות (באישור הצוות)'] },
  { v: '1.12.1', items: ['🏷️ תיוג חברים עם @ בצ׳אט, בטיקטים ובביקורות', '🔇 השתקה (Ctrl+M) ודיפן (Ctrl+D) בשיחות', '🔒 פרטיות: מי יכול לשלוח לך הודעות ולהתקשר אליך'] },
  { v: '1.13.0', items: ['⚡ שיפורים ותיקונים'] },
  { v: '1.15.0', items: ['🎉 Craft Hub 1.0.0 Beta!', '😊 אימוג׳ים בצ׳אט', '📎 שליחת תמונות וקבצים בצ׳אט', '⌨️ רואים כשמישהו מקליד', '🟢 עיגול ירוק למי שמדבר בשיחה', '🖥️ שיתוף מסך נוח יותר — מסך מלא וגדילה אוטומטית', '🔔 צלצול חדש', '🛠️ שיחות יציבות יותר'] },
  { v: '1.14.0', items: ['👥 צ׳אטים קבוצתיים — יוצרים קבוצה עם חברים, מתייגים ומדברים', '📞 שיחות קבוצתיות — עד 6 אנשים, אפשר להוסיף חברים באמצע שיחה', '🔴 מספר אדום בשורת המשימות כשיש הודעות והתראות חדשות', '🛠️ שיחות יציבות יותר — חיבור שנופל מתחבר מחדש לבד'] },
  { v: '1.11.0', items: ['💬 הודעות פרטיות בין חברים', '🗳️ תזכורת כשאפשר להצביע שוב לשרת', '🎬 סרטון יוטיוב בדף פרויקט', '✨ "אולי תאהב גם" — פרויקטים דומים', '📈 גרף שחקנים לכל שרת', '📅 אירועים לשרתים, עם תזכורות', '🏆 טבלת מובילים', '✔️ וי כחול לקרייטורים מאומתים'] }
];
const verGt = (a, b) => { const x = String(a).split('.').map(Number), y = String(b).split('.').map(Number); for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); return false; };
async function whatsNew() {
  let cur;
  let curLabel = '';
  try { const st0 = await B.updateState(); cur = st0.current; curLabel = st0.currentLabel || 'v' + cur; } catch { return; }
  if (!cur) return;
  let seen = null; try { seen = localStorage.getItem('ch_seen_ver'); localStorage.setItem('ch_seen_ver', cur); } catch { return; }
  if (!seen || !verGt(cur, seen)) return; // first install (the tour covers it) or nothing new
  const items = CHANGELOG.filter(c => verGt(c.v, seen) && !verGt(c.v, cur)).flatMap(c => c.items);
  if (!items.length) return;
  const m = document.createElement('div'); m.className = 'modal-back';
  m.innerHTML = `<div class="card wn-modal"><div class="tour-logo">${ic('sparkle', 'xl')}</div><h2>${t('wn_title')}</h2><span class="chip accent">${esc(curLabel)}</span>
    <ul class="wn-list">${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul><button class="btn primary lg" data-x>${t('wn_ok')}</button></div>`;
  document.body.appendChild(m);
  m.querySelector('[data-x]').onclick = () => m.remove();
}

/* ---------- vote reminders ---------- */
let VOTES = [];
async function checkVotes() {
  if (!S.me || !S.me.user) return;
  try { VOTES = await api('/api/me/votes'); } catch { return; }
  const now = Date.now();
  for (const v of VOTES) {
    const key = 'ch_vr_' + v.slug + '_' + v.votedAt;
    let done = false; try { done = !!localStorage.getItem(key); } catch { }
    if (v.nextVoteAt <= now && !done) { try { localStorage.setItem(key, '1'); } catch { } B.notify({ title: 'Craft Hub', body: t('vr_notif', v.name), link: '/server/' + v.slug }); }
  }
  drawVoteBar();
}
function drawVoteBar() {
  const ready = VOTES.filter(v => v.nextVoteAt <= Date.now());
  const host = view.querySelector('.sh-stats');
  const old = $('#voteBar'); if (old) old.remove();
  if (!ready.length || !host || S.route !== 'home') return;
  host.insertAdjacentHTML('afterend', `<div id="voteBar">${ready.slice(0, 3).map(v => `<div class="vote-rem"><div class="pic sm">${siteImg(v.icon) ? `<img src="${esc(siteImg(v.icon))}" alt="">` : esc(v.name.charAt(0))}</div><b style="flex:1">${esc(t('vr_ready', v.name))}</b><button class="btn primary" data-go="server:slug:${esc(v.slug)}">${ic('star', 'sm')} ${t('vr_go')}</button></div>`).join('')}</div>`);
  bindCommon($('#voteBar'));
}
setInterval(checkVotes, 5 * 60000);
const _vHomeV = vHome;
vHome = async function (p, stale) { await _vHomeV(p, stale); if (!stale()) drawVoteBar(); };

/* ---------- project page: video + similar projects ---------- */
const ytId = u => (String(u || '').match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{6,20})/) || [])[1];
const _vProjectV = vProject;
vProject = async function (params, stale) {
  await _vProjectV(params, stale);
  if (stale() || !S.params.project) return;
  const p = S.params.project, vin = view.querySelector('.view-in');
  const id = ytId(p.video);
  if (id && vin) {
    const anchor = vin.querySelector('.phead');
    const html = `<div class="card yt-card"><div class="card-h">${ic('play2')}<h3>${t('yt_title')}</h3></div><div class="yt-wrap" id="ytW"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt=""><button class="yt-play">${ic('play2', 'xl')}</button></div></div>`;
    if (anchor) anchor.insertAdjacentHTML('afterend', html); else vin.insertAdjacentHTML('afterbegin', html);
    $('#ytW').onclick = () => { $('#ytW').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`; };
  }
  const all = await loadProjects();
  if (stale()) return;
  const tags = new Set(p.tags || []);
  const score = x => ((x.type || 'plugin') === (p.type || 'plugin') ? 3 : 0) + (x.category === p.category ? 2 : 0) + (x.tags || []).filter(t2 => tags.has(t2)).length + (x.owner && p.owner && x.owner.id === p.owner.id ? 1 : 0);
  const sim = all.filter(x => x.slug !== p.slug).map(x => ({ x, s: score(x) })).filter(o => o.s >= 3).sort((a, b) => b.s - a.s || (b.x.downloads || 0) - (a.x.downloads || 0)).slice(0, 4).map(o => o.x);
  if (sim.length && vin) { vin.insertAdjacentHTML('beforeend', `<section class="section" style="margin-top:28px" id="simS"><div class="section-h">${ic('sparkle')}<h2>${t('similar')}</h2></div><div class="grid">${sim.map(projectCard).join('')}</div></section>`); bindCommon($('#simS')); }
};

/* ---------- server page: player graph + events ---------- */
function playerChart(points) {
  const W = 720, H = 180, P = 28;
  if (!points.length) return '';
  const t0 = points[0][0], t1 = points[points.length - 1][0] || t0 + 1, max = Math.max(4, ...points.map(p => p[1]));
  const x = t => P + (t - t0) / Math.max(1, t1 - t0) * (W - P * 2), y = n => H - P - Math.max(0, n) / max * (H - P * 2);
  let d = '', area = '', segStart = null;
  const segs = [];
  let cur = [];
  for (const p of points) { if (p[1] < 0) { if (cur.length) segs.push(cur); cur = []; } else cur.push(p); }
  if (cur.length) segs.push(cur);
  for (const s of segs) {
    d += s.map((p, i) => `${i ? 'L' : 'M'}${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join('');
    area += `M${x(s[0][0]).toFixed(1)},${H - P}` + s.map(p => `L${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join('') + `L${x(s[s.length - 1][0]).toFixed(1)},${H - P}Z`;
  }
  const days = []; for (let t = new Date(t0).setHours(0, 0, 0, 0) + 86400000; t < t1; t += 86400000) days.push(t);
  return `<svg viewBox="0 0 ${W} ${H}" class="pchart" preserveAspectRatio="none">
    <defs><linearGradient id="pgGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".35"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
    ${[0, .5, 1].map(f => `<line x1="${P}" x2="${W - P}" y1="${y(max * f)}" y2="${y(max * f)}" class="gl"/><text x="${P - 6}" y="${y(max * f) + 4}" class="gt" text-anchor="end">${Math.round(max * f)}</text>`).join('')}
    ${days.map(t => `<line x1="${x(t)}" x2="${x(t)}" y1="${P}" y2="${H - P}" class="gl v"/><text x="${x(t)}" y="${H - 8}" class="gt" text-anchor="middle">${new Date(t).toLocaleDateString(LANG === 'he' ? 'he-IL' : 'en-US', { weekday: 'short' })}</text>`).join('')}
    <path d="${area}" fill="url(#pgGrad)"/><path d="${d}" class="pl"/></svg>`;
}
const untilTxt = ms => { const m = Math.round(ms / 60000); return m < 60 ? `${m} ${LANG === 'he' ? 'דק׳' : 'min'}` : m < 1440 ? `${Math.round(m / 60)} ${LANG === 'he' ? 'שע׳' : 'h'}` : `${Math.round(m / 1440)} ${LANG === 'he' ? 'ימים' : 'd'}`; };
const eventRow = (e, canEdit, withServer) => { const now = Date.now(), live = e.startAt <= now;
  return `<div class="ev ${live ? 'live' : ''}"><div class="ev-date"><b>${new Date(e.startAt).getDate()}</b><small>${new Date(e.startAt).toLocaleDateString(LANG === 'he' ? 'he-IL' : 'en-US', { month: 'short' })}</small></div>
    <div style="flex:1;min-width:0"><b>${esc(e.title)}</b>${withServer ? ` <span class="faint">· <a href="#" data-go="server:slug:${esc(e.server.slug)}">${esc(e.server.name)}</a></span>` : ''}<div class="faint" style="font-size:13px">${new Date(e.startAt).toLocaleString(LANG === 'he' ? 'he-IL' : 'en-US', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}${e.text ? ' · ' + esc(e.text) : ''}</div></div>
    <span class="chip ${live ? 'danger' : 'accent'}">${live ? t('ev_live') : t('ev_in', untilTxt(e.startAt - now))}</span>${canEdit ? `<button class="icon-btn" data-evdel="${e.id}">${ic('trash', 'sm')}</button>` : ''}</div>`; };
const _vServerV = vServer;
vServer = async function (params, stale) {
  await _vServerV(params, stale);
  if (stale()) return;
  const vin = view.querySelector('.view-in'), slug = params.slug;
  const [h, ev] = await Promise.all([api(`/api/servers/${encodeURIComponent(slug)}/history`).catch(() => null), api(`/api/servers/${encodeURIComponent(slug)}/events`).catch(() => null)]);
  if (stale() || !vin) return;
  const layout = vin.querySelector('.play-layout') || vin;
  if (ev && (ev.events.length || ev.canEdit)) {
    layout.insertAdjacentHTML('afterend', `<div class="card" style="margin-top:22px" id="evCard"><div class="card-h">${ic('cal')}<h3>${t('ev_title')}</h3></div><div class="card-b stack" style="gap:10px">
      ${ev.events.map(e => eventRow(e, ev.canEdit)).join('') || `<p class="faint" style="margin:0">${t('ev_none')}</p>`}
      ${ev.canEdit ? `<form id="evF" class="ev-form"><input type="text" name="title" maxlength="80" required placeholder="${t('ev_name')}"><input type="datetime-local" name="when" required><input type="text" name="text" maxlength="1000" placeholder="${t('ev_text')}"><button class="btn primary">${ic('plus', 'sm')} ${t('ev_add')}</button><small class="faint" style="grid-column:1/-1">${t('ev_hint')}</small></form>` : ''}</div></div>`);
    bindCommon($('#evCard'));
    const f = $('#evF');
    if (f) f.onsubmit = async e => { e.preventDefault(); try { await api(`/api/servers/${encodeURIComponent(slug)}/events`, { method: 'POST', body: { title: f.title.value, text: f.text.value, startAt: new Date(f.when.value).getTime() } }); toast(t('saved')); go('server', { slug }, true); } catch (err) { toast(err.message, 'err'); } };
    $('#evCard').querySelectorAll('[data-evdel]').forEach(b => b.onclick = async () => { try { await api(`/api/servers/${encodeURIComponent(slug)}/events/${b.dataset.evdel}`, { method: 'DELETE' }); go('server', { slug }, true); } catch (err) { toast(err.message, 'err'); } });
  }
  if (h) {
    layout.insertAdjacentHTML('afterend', `<div class="card" style="margin-top:22px"><div class="card-h">${ic('chart')}<h3>${t('pg_title')}</h3><span class="spacer"></span>${h.points.length ? `<span class="chip">${t('pg_peak')}: ${h.peak}</span><span class="chip">${t('pg_avg')}: ${h.avg}</span>${h.uptime != null ? `<span class="chip accent">${t('pg_uptime')}: ${h.uptime}%</span>` : ''}` : ''}</div>
      <div class="card-b">${h.points.length > 1 ? playerChart(h.points) : `<p class="faint" style="margin:0">${t('pg_none')}</p>`}</div></div>`);
  }
};
// servers page: upcoming events across all servers
const _vServersV = vServers;
vServers = async function (p, stale) {
  await _vServersV(p, stale);
  if (stale()) return;
  const list = await api('/api/events').catch(() => []);
  const head = view.querySelector('.view-in > .head');
  if (stale() || !list.length || !head) return;
  head.insertAdjacentHTML('afterend', `<div class="card" style="margin-bottom:18px" id="evAll"><div class="card-h">${ic('cal')}<h3>${t('ev_upcoming')}</h3></div><div class="card-b stack" style="gap:10px">${list.slice(0, 5).map(e => eventRow(e, false, true)).join('')}</div></div>`);
  bindCommon($('#evAll'));
};

/* ---------- leaderboard ---------- */
async function vLeaders(p, stale) {
  const d = await api('/api/leaderboard');
  if (stale()) return;
  const medal = i => ['🥇', '🥈', '🥉'][i] || `<span class="num">${i + 1}</span>`;
  const board = (icon, title, rows) => `<div class="card lb"><div class="card-h">${ic(icon)}<h3>${title}</h3></div><div class="card-b">${rows || `<p class="faint" style="margin:0">${t('lb_empty')}</p>`}</div></div>`;
  put(`<div class="head"><div><h1>${ic('trophy', 'lg')} ${t('leaders')}</h1><p class="faint" style="margin:6px 0 0">${t('lb_sub')}</p></div></div>
    <div class="lb-grid">
      ${board('crown', t('lb_creators'), d.creators.map((c, i) => `<div class="lrow lb-row" data-go="user:id:${esc(c.id)}"><span class="lb-m">${medal(i)}</span><img class="av" src="${avatarOf(c)}" alt=""><b style="flex:1;min-width:0">${esc(c.name)}${c.verified ? ' ' + vcheck() : ''}</b><span class="stat">${ic('download', 'sm')} ${fmtNum(c.downloads)}</span></div>`).join(''))}
      ${board('box', t('lb_projects'), d.projects.map((x, i) => `<div class="lrow lb-row" data-go="project:slug:${esc(x.slug)}"><span class="lb-m">${medal(i)}</span>${pic(x, 'sm')}<b style="flex:1;min-width:0">${esc(x.name)}</b><span class="stat">${ic('download', 'sm')} ${fmtNum(x.monthDownloads)}</span></div>`).join(''))}
      ${board('globe', t('lb_servers'), d.servers.map((s, i) => `<div class="lrow lb-row" data-go="server:slug:${esc(s.slug)}"><span class="lb-m">${medal(i)}</span><div class="pic sm">${siteImg(s.icon) ? `<img src="${esc(siteImg(s.icon))}" alt="">` : esc(s.name.charAt(0))}</div><b style="flex:1;min-width:0">${esc(s.name)}</b><span class="stat">${ic('star', 'sm')} ${fmtNum(s.votes)}</span></div>`).join(''))}
      ${board('users', t('lb_voters'), d.voters.map((v, i) => `<div class="lrow lb-row"><span class="lb-m">${medal(i)}</span><img class="av" src="https://mc-heads.net/avatar/${encodeURIComponent(v.name)}/40" alt=""><b style="flex:1;min-width:0" class="mono">${esc(v.name)}</b><span class="stat">${ic('star', 'sm')} ${fmtNum(v.votes)}</span></div>`).join(''))}
    </div>`);
}

/* ---------- profile: message button, blue check, verify toggle ---------- */
const _vUserV = vUser;
vUser = async function (params, stale) {
  await _vUserV(params, stale);
  if (stale()) return;
  const x = await api('/api/users/' + encodeURIComponent(params.id) + '/extra').catch(() => null);
  if (stale() || !x) return;
  const h1 = view.querySelector('.phead h1');
  if (x.verified && h1 && !h1.querySelector('.vcheck')) h1.insertAdjacentHTML('beforeend', ' ' + vcheck());
  const me = S.me && S.me.user, mine = me && me.id === params.id;
  const frB = $('#frB');
  if (frB && x.friend === 'friends' && !$('#dmB')) { frB.insertAdjacentHTML('afterend', `<button class="btn primary" id="dmB">${ic('msg', 'sm')} ${t('dm_btn')}</button>`); $('#dmB').onclick = () => go('messages', { id: params.id }); }
  if (me && !mine && hasPerm('creators') && x.friend !== undefined) {
    const row = (frB && frB.parentElement) || view.querySelector('.phead');
    row.insertAdjacentHTML('beforeend', `<button class="btn" id="vfB">${ic('vcheck', 'sm')} ${x.verified ? t('verify_off') : t('verify_on')}</button>`);
    $('#vfB').onclick = async () => { try { await api('/api/admin/users/' + encodeURIComponent(params.id) + '/verify', { method: 'POST', body: {} }); S.projectsAt = 0; go('user', { id: params.id }, true); } catch (err) { toast(err.message, 'err'); } };
  }
};

/* ---------- routes + sidebar ---------- */
const _goS = go;
go = function (route, params, noHistory) {
  const fn = { messages: vMessages, leaders: vLeaders }[route];
  if (!fn) return _goS(route, params, noHistory);
  params = params || {};
  if (!noHistory && (S.route !== route || JSON.stringify(S.params) !== JSON.stringify(params))) S.history.push([S.route, S.params]);
  S.route = route; S.params = params;
  $('#backBtn').disabled = !S.history.length;
  renderNav(); view.scrollTop = 0; view.innerHTML = '<div class="spin"></div>';
  const seq = ++go.seq;
  Promise.resolve(fn(params, () => seq !== go.seq)).catch(err => { if (seq === go.seq) view.innerHTML = `<div class="view-in">${emptyBox('wifi', t('error'), err.message)}</div>`; });
};
go.seq = _goS.seq;
const _renderNavS = renderNav;
renderNav = function () {
  _renderNavS();
  const nav = $('#nav');
  const people = nav.querySelector('[data-go="people"]'), servers = nav.querySelector('[data-go="servers"]');
  if (people && S.me && S.me.user && !nav.querySelector('[data-go="messages"]')) people.insertAdjacentHTML('afterend', `<a href="#" data-go="messages" class="${S.route === 'messages' ? 'on' : ''}">${ic('msg')} ${t('messages')}<span class="nav-n">${DM.unread || ''}</span></a>`);
  if (servers && !nav.querySelector('[data-go="leaders"]')) servers.insertAdjacentHTML('afterend', `<a href="#" data-go="leaders" class="${S.route === 'leaders' ? 'on' : ''}">${ic('trophy')} ${t('leaders')}</a>`);
  nav.querySelectorAll('[data-go="messages"], [data-go="leaders"]').forEach(a => { a._b = 0; });
  bindCommon(nav);
};
// a notification about a message opens the chat
const _openLinkS = openLink;
openLink = function (l) { const m = String(l || '').match(/^\/messages\/([\w:.@-]+)/); if (m) return go('messages', { id: m[1] }); return _openLinkS(l); };

/* ================= voice calls (1-on-1 and groups) + group chats ================= */
Object.assign(ICONS, {
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
  video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3Z"/>',
  videooff: '<path d="M2 6h9M16 10l6-3v10l-6-3M16 12v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8M3 3l18 18"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/>',
  micoff: '<path d="M9 5a3 3 0 0 1 6 0v5M15 13a3 3 0 0 1-5.6 1.4M5 11a7 7 0 0 0 11.2 5.6M19 11a7 7 0 0 1-.6 2.9M12 18v4M3 3l18 18"/>',
  screen: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  hangup: '<path d="M3 15c5-5 13-5 18 0l-2 3-4-1v-3a10 10 0 0 0-6 0v3l-4 1Z" fill="currentColor"/>',
  expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M3 18a2 2 0 0 0 2 2h1v-7H5a2 2 0 0 0-2 2ZM21 18a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 2Z"/>',
  headoff: '<path d="M3 18v-6a9 9 0 0 1 15.4-6.4M21 12v6"/><path d="M3 18a2 2 0 0 0 2 2h1v-7H5a2 2 0 0 0-2 2ZM21 18a2 2 0 0 1-2 2h-1v-4M3 3l18 18"/>',
  clip: '<path d="m21 11-8.6 8.6a5.5 5.5 0 0 1-7.8-7.8l8.6-8.6a3.7 3.7 0 0 1 5.2 5.2l-8.6 8.6a1.8 1.8 0 0 1-2.6-2.6L15.5 7"/>',
  group: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2a5 5 0 0 1 5.5 5.8"/>',
  gear2: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>'
});
Object.assign(I18N.he, {
  call_voice: 'שיחה קולית', call_video: 'שיחת וידאו', call_calling: 'מתקשר…', call_ringing_in: 'מתקשר אליך', call_group_in: 'מזמין אותך לשיחה קבוצתית', call_answer: 'ענה', call_decline: 'דחה',
  call_connecting: 'מתחבר…', call_ended: 'השיחה הסתיימה', call_declined: 'השיחה נדחתה', call_missed: 'אין מענה', call_busy: 'לא הצלחתי לגשת למיקרופון', call_lost: 'החיבור עם {x} נותק', call_left: '{x} יצא מהשיחה', call_joined: '{x} הצטרף לשיחה',
  call_mute: 'השתק', call_share: 'שיתוף מסך', call_stop_share: 'הפסק שיתוף', call_hang: 'צא מהשיחה', call_share_perm: 'שיתוף מסך דורש אישור מהצוות', call_pick_screen: 'מה לשתף?', call_screen_whole: 'מסך', call_screen_window: 'חלון', call_sharing: 'משתף מסך', call_shares: '{x} משתף מסך',
  call_add: 'הוסף לשיחה', call_add_title: 'הוסף חבר לשיחה', call_add_none: 'אין חברים שאפשר להוסיף', call_ringing_m: 'מצלצל…', call_you: 'אתה', call_group: 'שיחה קבוצתית', call_n: '{x} משתתפים', call_skipped: '{x}: {y}',
  call_deaf: 'דיפן', call_deaf_on: 'במצב דיפן — לא שומעים אותך ואתה לא שומע · Ctrl+D', call_muted_on: 'המיקרופון מושתק — Ctrl+M להחזרה',
  av_title: 'קול', av_mic: 'מיקרופון', av_cam: 'מצלמה', av_spk: 'רמקולים / אוזניות', av_default: 'ברירת מחדל', av_test_mic: 'דבר כדי לבדוק את המיקרופון', av_test_spk: 'בדיקת רמקול', av_cam_on: 'הצג מצלמה', av_cam_off: 'כבה תצוגה', av_ns: 'סינון רעשי רקע', av_ec: 'ביטול הד', av_agc: 'כיוון עוצמה אוטומטי', av_perm: 'צריך לאשר גישה למיקרופון',
  pv_title: 'פרטיות', pv_dms: 'מי יכול לשלוח לי הודעות פרטיות', pv_calls: 'מי יכול להתקשר אליי', pv_friends: 'חברים', pv_none: 'אף אחד', pv_saved: 'נשמר ✓', pv_dm_off_other: 'המשתמש כיבה הודעות פרטיות',
  ss_perm: 'הרשאת שיתוף מסך', ss_on: 'תן שיתוף מסך', ss_off: 'הסר שיתוף מסך', ss_badge: 'משתף מסך',
  ch_gif_soon: 'GIF — בקרוב 🔒',
  ch_share_fail: 'לא הצלחתי לשתף את המסך/החלון שנבחר — נסה לבחור אחר',
  ty_one: '{x} מקליד…', ty_two: '{x} ו-{y} מקלידים…', ty_many: 'כמה אנשים מקלידים…',
  ch_emoji: 'אימוג׳י', ch_attach: 'צירוף קובץ או תמונה', ch_gif_search: 'חיפוש GIF…', ch_video_dev: '🎥 שיחות וידאו — בפיתוח 🔒', ch_fullscreen: 'מסך מלא',
  grp_new: 'קבוצה חדשה', grp_name: 'שם הקבוצה', grp_pick: 'בחר חברים', grp_create: 'צור קבוצה', grp_members: '{x} חברים', grp_manage: 'הגדרות קבוצה', grp_rename: 'שמור שם', grp_add: 'הוסף חבר', grp_leave: 'צא מהקבוצה', grp_leave_q: 'לצאת מהקבוצה "{x}"?', grp_remove: 'הוצא', grp_owner: 'מנהל', grp_no_friends: 'אין לך עדיין חברים — הוסף חברים בדף "אנשים"', grp_min: 'בחר לפחות חבר אחד', grp_call: 'שיחה קבוצתית'
});
Object.assign(I18N.en, {
  call_voice: 'Voice call', call_video: 'Video call', call_calling: 'Calling…', call_ringing_in: 'is calling you', call_group_in: 'invites you to a group call', call_answer: 'Answer', call_decline: 'Decline',
  call_connecting: 'Connecting…', call_ended: 'Call ended', call_declined: 'Call declined', call_missed: 'No answer', call_busy: 'Could not access the microphone', call_lost: 'Lost connection with {x}', call_left: '{x} left the call', call_joined: '{x} joined the call',
  call_mute: 'Mute', call_share: 'Share screen', call_stop_share: 'Stop sharing', call_hang: 'Leave call', call_share_perm: 'Screen sharing needs staff approval', call_pick_screen: 'What to share?', call_screen_whole: 'Screen', call_screen_window: 'Window', call_sharing: 'Sharing screen', call_shares: '{x} is sharing',
  call_add: 'Add to call', call_add_title: 'Add a friend to the call', call_add_none: 'No friends to add', call_ringing_m: 'Ringing…', call_you: 'You', call_group: 'Group call', call_n: '{x} people', call_skipped: '{x}: {y}',
  call_deaf: 'Deafen', call_deaf_on: 'Deafened — nobody hears you and you hear nobody · Ctrl+D', call_muted_on: 'Microphone muted — Ctrl+M to unmute',
  av_title: 'Voice', av_mic: 'Microphone', av_cam: 'Camera', av_spk: 'Speakers / headphones', av_default: 'Default', av_test_mic: 'Speak to test the microphone', av_test_spk: 'Test speaker', av_cam_on: 'Show camera', av_cam_off: 'Stop preview', av_ns: 'Noise suppression', av_ec: 'Echo cancellation', av_agc: 'Auto gain', av_perm: 'Allow access to the microphone',
  pv_title: 'Privacy', pv_dms: 'Who can send me private messages', pv_calls: 'Who can call me', pv_friends: 'Friends', pv_none: 'Nobody', pv_saved: 'Saved ✓', pv_dm_off_other: 'This user turned off private messages',
  ss_perm: 'Screen share permission', ss_on: 'Allow screen share', ss_off: 'Remove screen share', ss_badge: 'Can share screen',
  ch_gif_soon: 'GIFs — coming soon 🔒',
  ch_share_fail: 'Could not share that screen/window — try another one',
  ty_one: '{x} is typing…', ty_two: '{x} and {y} are typing…', ty_many: 'Several people are typing…',
  ch_emoji: 'Emoji', ch_attach: 'Attach a file or picture', ch_gif_search: 'Search GIFs…', ch_video_dev: '🎥 Video calls — in development 🔒', ch_fullscreen: 'Full screen',
  grp_new: 'New group', grp_name: 'Group name', grp_pick: 'Pick friends', grp_create: 'Create group', grp_members: '{x} members', grp_manage: 'Group settings', grp_rename: 'Save name', grp_add: 'Add friend', grp_leave: 'Leave group', grp_leave_q: 'Leave "{x}"?', grp_remove: 'Remove', grp_owner: 'Owner', grp_no_friends: 'No friends yet — add some on the People page', grp_min: 'Pick at least one friend', grp_call: 'Group call'
});
const tt = (k, x, y) => t(k, x).replace('{y}', y == null ? '' : y);

// saved devices + audio processing
const AV = (() => { let v = {}; try { v = JSON.parse(localStorage.getItem('ch_av') || '{}'); } catch { } return { mic: '', cam: '', spk: '', ns: true, ec: true, agc: true, ...v }; })();
const saveAV = () => { try { localStorage.setItem('ch_av', JSON.stringify(AV)); } catch { } };
const audioC = () => ({ deviceId: AV.mic ? { exact: AV.mic } : undefined, noiseSuppression: AV.ns, echoCancellation: AV.ec, autoGainControl: AV.agc });
const videoC = () => ({ deviceId: AV.cam ? { exact: AV.cam } : undefined, width: { ideal: 1280 }, height: { ideal: 720 } });

// ringtones made with WebAudio (no sound files):
// incoming = a soft melodic chime (E major arpeggio, bell-like), outgoing = a gentle "tuu… tuu…" while it rings
const RING = { ctx: null, timer: null };
function tone(c, freq, start, len, vol, type = 'sine') {
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(vol, start + 0.015);            // quick soft attack
  g.gain.exponentialRampToValueAtTime(0.0008, start + len);      // bell-like fade
  o.connect(g).connect(c.destination); o.start(start); o.stop(start + len + 0.05);
}
function ring(on, outgoing) {
  clearInterval(RING.timer); RING.timer = null;
  if (!on) { if (RING.ctx) { RING.ctx.close().catch(() => { }); RING.ctx = null; } return; }
  try { RING.ctx = RING.ctx || new AudioContext(); } catch { return; }
  const c = RING.ctx;
  const play = () => {
    const now = c.currentTime + 0.02;
    if (outgoing) {
      // two soft tones together, like a phone waiting for an answer
      tone(c, 440, now, 1.1, 0.05); tone(c, 480, now, 1.1, 0.04);
    } else {
      // E5 G#5 B5 E6 … B5 — a pleasant chime, with a quiet octave on top for sparkle
      [[659.3, 0], [830.6, .16], [987.8, .32], [1318.5, .48], [987.8, .78]].forEach(([f, d]) => { tone(c, f, now + d, 0.9, 0.09); tone(c, f * 2, now + d, 0.5, 0.012, 'triangle'); });
    }
  };
  play(); RING.timer = setInterval(play, outgoing ? 3000 : 2200);
}

/* ---------- the call: a mesh of peer connections, one per other member ---------- */
const CALL = { id: null, host: null, members: [], peers: new Map(), local: null, screen: null, since: 0, startedAt: 0, ice: null, muted: false, deaf: false, mutedBeforeDeaf: false, screenFrom: null, seenIncoming: new Set(), tick: null, title: '', everConnected: false, actx: null, meters: new Map(), speaking: new Set() };
async function iceConfig() { if (!CALL.ice) { try { CALL.ice = await api('/api/calls/ice'); } catch { CALL.ice = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }], canScreenShare: false, max: 6 }; } } return CALL.ice; }
const sigTo = (to, kind, data) => api(`/api/calls/${CALL.id}/signal`, { method: 'POST', body: { to, kind, data } });
const sigAll = (kind, data) => api(`/api/calls/${CALL.id}/signal`, { method: 'POST', body: { kind, data } });
const myId = () => S.me && S.me.user && S.me.user.id;
const memberCard = uid => CALL.members.find(m => m.id === uid) || (CALL.peers.get(uid) || {}).card || { id: uid, name: '…' };
const mediaState = () => ({ muted: CALL.muted, deaf: CALL.deaf });

async function getMic() { if (CALL.local) return true; try { CALL.local = await navigator.mediaDevices.getUserMedia({ audio: audioC(), video: false }); return true; } catch { toast(t('call_busy'), 'err'); return false; } }
function resetCall() {
  ring(false);
  for (const p of CALL.peers.values()) closePeerObj(p);
  CALL.peers.clear();
  [CALL.local, CALL.screen].forEach(st => st && st.getTracks().forEach(tr => tr.stop()));
  clearInterval(CALL.tick);
  CALL.speaking.clear(); TALK.until.clear(); TALK.last.clear();
  Object.assign(CALL, { id: null, host: null, members: [], local: null, screen: null, since: 0, startedAt: 0, muted: false, deaf: false, mutedBeforeDeaf: false, screenFrom: null, tick: null, title: '', everConnected: false });
  const box = $('#callBox'); if (box) box.remove();
  schedulePoll(2500);
}
// start a call with one friend or several
async function startCall(to, title) {
  if (CALL.id) return toast(LANG === 'he' ? 'אתה כבר בשיחה' : 'Already in a call', 'err');
  const ids = (Array.isArray(to) ? to : [to]).map(x => typeof x === 'object' ? x.id : x).filter(Boolean);
  if (!(await getMic())) return;
  let r;
  try { r = await api('/api/calls', { method: 'POST', body: { to: ids } }); }
  catch (err) { CALL.local.getTracks().forEach(tr => tr.stop()); CALL.local = null; return toast(err.message, 'err'); }
  (r.skipped || []).forEach(s => toast(tt('call_skipped', s.name, s.error), 'err'));
  Object.assign(CALL, { id: r.id, host: r.host, members: r.members, since: 0, title: title || '' });
  ring(true, true); drawCall(); schedulePoll(600);
}
async function answerCall(c, accept) {
  const box = $('#callIn'); if (box) box.remove(); ring(false);
  if (!accept) { api(`/api/calls/${c.id}/answer`, { method: 'POST', body: { accept: false } }).catch(() => { }); return; }
  if (CALL.id) return toast(LANG === 'he' ? 'אתה כבר בשיחה' : 'Already in a call', 'err');
  if (!(await getMic())) { api(`/api/calls/${c.id}/answer`, { method: 'POST', body: { accept: false } }).catch(() => { }); return; }
  let r;
  try { r = await api(`/api/calls/${c.id}/answer`, { method: 'POST', body: { accept: true } }); }
  catch (err) { CALL.local.getTracks().forEach(tr => tr.stop()); CALL.local = null; return toast(err.message, 'err'); }
  Object.assign(CALL, { id: c.id, host: r.host, members: r.members, since: 0, title: '' });
  drawCall(); schedulePoll(600);
  // the one who joins connects to everyone already in the call
  for (const p of r.peers) connectTo(p.id, p).catch(e => console.warn('connect', e));
}
function makePeer(uid, card, sess, offerer) {
  const cfg = CALL.ice || { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  const pc = new RTCPeerConnection({ iceServers: cfg.iceServers });
  const p = { uid, card: card || memberCard(uid), pc, stream: new MediaStream(), audio: new Audio(), pendingIce: [], muted: false, deaf: false, state: 'connecting', sess, offerer: !!offerer, restarts: 0 };
  p.audio.autoplay = true; p.audio.muted = CALL.deaf;
  if (AV.spk && p.audio.setSinkId) p.audio.setSinkId(AV.spk).catch(() => { });
  CALL.local.getAudioTracks().forEach(tr => pc.addTrack(tr, CALL.local));
  pc.onicecandidate = e => { if (e.candidate && CALL.id) sigTo(uid, 'ice', e.candidate.toJSON()).catch(() => { }); };
  pc.ontrack = e => {
    if (!p.stream.getTracks().includes(e.track)) p.stream.addTrack(e.track);
    if (e.track.kind === 'audio') { p.audio.srcObject = new MediaStream([e.track]); p.audio.play().catch(() => { }); }
    e.track.onunmute = e.track.onmute = () => drawCall();
    drawCall();
  };
  pc.onconnectionstatechange = () => {
    p.state = pc.connectionState;
    clearTimeout(p.repairT);
    if (pc.connectionState === 'connected') { p.restarts = 0; if (!CALL.everConnected) { CALL.everConnected = true; CALL.startedAt = Date.now(); ring(false); } }
    // a hiccup (Wi-Fi, a busy computer): the side that offered repairs the connection; give up only after a few tries
    if (pc.connectionState === 'disconnected') p.repairT = setTimeout(() => { if (['disconnected', 'failed'].includes(pc.connectionState)) repair(p); }, 3000);
    if (pc.connectionState === 'failed') {
      repair(p);
      p.giveUpT = p.giveUpT || setTimeout(() => { if (CALL.peers.get(uid) === p && pc.connectionState !== 'connected') { toast(t('call_lost', p.card.name), 'err'); closePeer(uid); } }, 25000);
    }
    if (pc.connectionState === 'connected') { clearTimeout(p.giveUpT); p.giveUpT = null; }
    drawCall();
  };
  CALL.peers.set(uid, p);
  return p;
}
// repair a broken link: the side that offered restarts it; the other side asks it to
function repair(p) {
  if (p.offerer) return iceRestart(p);
  if (Date.now() - (p.askedAt || 0) < 5000) return;
  p.askedAt = Date.now();
  sigTo(p.uid, 'repair', {}).catch(() => { });
}
async function iceRestart(p) {
  if (!p.offerer || p.restarting || !CALL.id || CALL.peers.get(p.uid) !== p || p.restarts >= 4) return;
  p.restarting = true; p.restarts++;
  try {
    const o = await p.pc.createOffer({ iceRestart: true });
    await p.pc.setLocalDescription(o);
    await sigTo(p.uid, 'offer', { ...p.pc.localDescription.toJSON(), sess: p.sess });
  } catch (e) { console.warn('ice restart', e); }
  setTimeout(() => { p.restarting = false; }, 4000);
}
function closePeerObj(p) { clearTimeout(p.repairT); clearTimeout(p.giveUpT); try { p.pc.close(); } catch { } try { p.audio.pause(); p.audio.srcObject = null; } catch { } }
function closePeer(uid) { const p = CALL.peers.get(uid); if (!p) return; closePeerObj(p); CALL.peers.delete(uid); if (CALL.screenFrom === uid) CALL.screenFrom = null; drawCall(); }
const videoSender = pc => { const tr = pc.getTransceivers().find(x => x.receiver && x.receiver.track && x.receiver.track.kind === 'video'); return tr && tr.sender; };
// we start the connection (offer) to someone who was already in the call
async function connectTo(uid, card) {
  await iceConfig();
  const p = makePeer(uid, card, Math.random().toString(36).slice(2) + Date.now().toString(36), true);
  const vt = p.pc.addTransceiver('video', { direction: 'sendrecv' }); // the screen-share slot
  if (CALL.screen) await vt.sender.replaceTrack(CALL.screen.getVideoTracks()[0]);
  await p.pc.setLocalDescription(await p.pc.createOffer());
  await sigTo(uid, 'offer', { ...p.pc.localDescription.toJSON(), sess: p.sess });
}
async function onOffer(from, desc, sess) {
  await iceConfig();
  const old = CALL.peers.get(from);
  if (old && sess && old.sess === sess && old.pc.signalingState !== 'closed') {
    await old.pc.setRemoteDescription(desc);
    await old.pc.setLocalDescription(await old.pc.createAnswer());
    await sigTo(from, 'answer', old.pc.localDescription.toJSON());
    return;
  }
  if (old) { closePeerObj(old); CALL.peers.delete(from); }
  const p = makePeer(from, null, sess, false);
  await p.pc.setRemoteDescription(desc);
  const s = videoSender(p.pc);
  const vt = p.pc.getTransceivers().find(x => x.sender === s);
  if (vt) { vt.direction = 'sendrecv'; if (CALL.screen) await s.replaceTrack(CALL.screen.getVideoTracks()[0]); }
  await p.pc.setLocalDescription(await p.pc.createAnswer());
  await sigTo(from, 'answer', p.pc.localDescription.toJSON());
  for (const c of p.pendingIce.splice(0)) await p.pc.addIceCandidate(c).catch(() => { });
  // tell the newcomer our mute/deaf + screen state
  if (CALL.muted || CALL.deaf) sigAll('media', mediaState()).catch(() => { });
  if (CALL.screen) sigAll('screen', { on: true }).catch(() => { });
}
async function handleSignal(s) {
  const d = s.data || {}, from = d.from;
  if (s.kind === 'offer') return onOffer(from, { type: d.type, sdp: d.sdp }, d.sess);
  if (s.kind === 'answer') { const p = CALL.peers.get(from); if (!p || p.pc.signalingState !== 'have-local-offer') return; await p.pc.setRemoteDescription({ type: d.type, sdp: d.sdp }); for (const c of p.pendingIce.splice(0)) await p.pc.addIceCandidate(c).catch(() => { }); return; }
  if (s.kind === 'ice') { const p = CALL.peers.get(from); const c = { candidate: d.candidate, sdpMid: d.sdpMid, sdpMLineIndex: d.sdpMLineIndex, usernameFragment: d.usernameFragment }; if (p && p.pc.remoteDescription) await p.pc.addIceCandidate(c).catch(() => { }); else if (p) p.pendingIce.push(c); return; }
  if (s.kind === 'repair') { const p = CALL.peers.get(from); if (p && p.offerer) { p.restarting = false; iceRestart(p); } return; }
  if (s.kind === 'peer-joined') { if (CALL.peers.has(d.uid)) closePeer(d.uid); ring(false); toast(t('call_joined', (d.card || {}).name || '')); if (CALL.screen) sigAll('screen', { on: true }).catch(() => { }); return drawCall(); }
  if (s.kind === 'peer-left') { const c = memberCard(d.uid); closePeer(d.uid); if (CALL.id) toast(t('call_left', c.name)); return; }
  if (s.kind === 'media') { const p = CALL.peers.get(from); if (p) { p.muted = !!d.muted; p.deaf = !!d.deaf; } return drawCall(); }
  if (s.kind === 'screen') { if (d.on) CALL.screenFrom = from; else if (CALL.screenFrom === from) CALL.screenFrom = null; return drawCall(); }
  if (s.kind === 'ended') { toast(CALL.everConnected ? t('call_ended') : t('call_missed')); return resetCall(); }
}
function leaveCall() { if (!CALL.id) return; api(`/api/calls/${CALL.id}/leave`, { method: 'POST', body: {} }).catch(() => { }); resetCall(); }
function hangUp() { leaveCall(); } // kept for older code paths

// who is talking: the audio level each connection reports (others) and our own microphone's level (us)
function watchLevel() { } // (kept for older code paths)
const TALK = { until: new Map(), last: new Map(), busy: false, at: 0 };
async function levels() {
  if (TALK.busy || !CALL.id) return;
  const now = Date.now();
  if (now - (TALK.at || 0) >= 450) {
    TALK.at = now; TALK.busy = true;
    // loudness = energy / time since the last reading, per voice
    const loud = (key, energy, dur) => { const prev = TALK.last.get(key); TALK.last.set(key, { energy, dur }); if (!prev || dur <= prev.dur) return 0; return Math.sqrt(Math.max(0, energy - prev.energy) / (dur - prev.dur)); };
    try {
      let mineDone = false;
      for (const p of CALL.peers.values()) {
        if (p.pc.connectionState !== 'connected') continue;
        const st = await within(p.pc.getStats(), 2000).catch(() => null);
        if (!st) continue;
        st.forEach(r => {
          if (r.type === 'inbound-rtp' && r.kind === 'audio' && typeof r.totalAudioEnergy === 'number' && loud(p.uid, r.totalAudioEnergy, r.totalSamplesDuration || 0) > 0.008) TALK.until.set(p.uid, now + 700);
          if (!mineDone && r.type === 'media-source' && r.kind === 'audio' && typeof r.totalAudioEnergy === 'number') { mineDone = true; if (!CALL.muted && loud('me', r.totalAudioEnergy, r.totalSamplesDuration || 0) > 0.008) TALK.until.set('me', now + 700); }
        });
      }
    } catch { }
    TALK.busy = false;
  }
  CALL.speaking.clear();
  for (const [uid, until] of TALK.until) if (until > now) CALL.speaking.add(uid);
}
async function toggleMute() {
  if (!CALL.id || !CALL.local) return;
  if (CALL.deaf) return toggleDeafen();
  CALL.muted = !CALL.muted;
  CALL.local.getAudioTracks().forEach(tr => { tr.enabled = !CALL.muted; });
  sigAll('media', mediaState()).catch(() => { });
  drawCall();
}
// deafen: hear nobody, and nobody hears you (like Discord). Undeafen brings the microphone back as it was.
function toggleDeafen() {
  if (!CALL.id || !CALL.local) return;
  CALL.deaf = !CALL.deaf;
  for (const p of CALL.peers.values()) p.audio.muted = CALL.deaf;
  if (CALL.deaf) { CALL.mutedBeforeDeaf = CALL.muted; CALL.muted = true; } else CALL.muted = !!CALL.mutedBeforeDeaf;
  CALL.local.getAudioTracks().forEach(tr => { tr.enabled = !CALL.muted; });
  sigAll('media', mediaState()).catch(() => { });
  drawCall();
}
function capBitrate(sender) { try { const prm = sender.getParameters(); if (!prm.encodings || !prm.encodings.length) prm.encodings = [{}]; prm.encodings[0].maxBitrate = 1500000; prm.encodings[0].maxFramerate = 15; sender.setParameters(prm).catch(() => { }); } catch { } }
async function toggleScreen() {
  const cfg = await iceConfig();
  if (CALL.screen) {
    CALL.screen.getTracks().forEach(tr => tr.stop()); CALL.screen = null;
    for (const p of CALL.peers.values()) { const s = videoSender(p.pc); if (s) await s.replaceTrack(null).catch(() => { }); }
    sigAll('screen', { on: false }).catch(() => { });
    return drawCall();
  }
  if (!cfg.canScreenShare) return toast(t('call_share_perm'), 'err');
  const id = await pickScreen(); if (!id) return;
  await B.screenPick(id);
  try { CALL.screen = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: { ideal: 12, max: 15 }, width: { max: 1920 }, height: { max: 1080 } }, audio: false }); } catch { CALL.screen = null; return toast(t('ch_share_fail'), 'err'); }
  try { await sigAll('screen', { on: true }); } catch (err) { CALL.screen.getTracks().forEach(tr => tr.stop()); CALL.screen = null; return toast(err.message, 'err'); }
  const tr = CALL.screen.getVideoTracks()[0];
  tr.onended = () => { if (CALL.screen) toggleScreen(); };
  for (const p of CALL.peers.values()) { const s = videoSender(p.pc); if (s) { await s.replaceTrack(tr).catch(() => { }); capBitrate(s); } }
  drawCall();
}
function pickScreen() {
  return new Promise(async resolve => {
    let list = [];
    try { list = await B.screenSources(); } catch { return resolve(null); }
    const m = document.createElement('div'); m.className = 'modal-back'; m.style.zIndex = 260;
    m.innerHTML = `<div class="card ss-pick"><div class="card-h">${ic('screen')}<h3>${t('call_pick_screen')}</h3><span class="spacer"></span><button class="icon-btn" data-x>✕</button></div>
      <div class="card-b ss-grid">${list.map(s => `<button class="ss-src" data-id="${esc(s.id)}"><img src="${s.thumb}" alt=""><span>${s.screen ? ic('screen', 'sm') + ' ' + t('call_screen_whole') : esc(s.name)}</span></button>`).join('')}</div></div>`;
    document.body.appendChild(m);
    const done = v => { m.remove(); resolve(v); };
    m.querySelector('[data-x]').onclick = () => done(null);
    m.onclick = e => { if (e.target === m) done(null); };
    m.querySelectorAll('[data-id]').forEach(b => b.onclick = () => done(b.dataset.id));
  });
}
async function addToCall() {
  const f = await api('/api/friends').catch(() => ({ friends: [] }));
  const inCall = new Set(CALL.members.map(m => m.id));
  const list = f.friends.filter(x => !inCall.has(x.id));
  const m = document.createElement('div'); m.className = 'modal-back'; m.style.zIndex = 260;
  m.innerHTML = `<div class="card tk-modal"><div class="card-h">${ic('plus')}<h3>${t('call_add_title')}</h3><span class="spacer"></span><button class="icon-btn" data-x>✕</button></div><div class="card-b stack" style="gap:6px;max-height:60vh;overflow-y:auto">
    ${list.map(u => `<button class="pick-row" data-u="${esc(u.id)}"><div class="av-wrap"><img class="av" src="${avatarOf(u)}" alt="">${u.online ? '<span class="online-dot abs"></span>' : ''}</div><b>${esc(u.name)}</b><span class="spacer"></span>${ic('phone', 'sm')}</button>`).join('') || `<p class="faint" style="margin:0">${t('call_add_none')}</p>`}</div></div>`;
  document.body.appendChild(m);
  m.querySelector('[data-x]').onclick = () => m.remove();
  m.onclick = e => { if (e.target === m) m.remove(); };
  m.querySelectorAll('[data-u]').forEach(b => b.onclick = async () => { try { const r = await api(`/api/calls/${CALL.id}/invite`, { method: 'POST', body: { to: b.dataset.u } }); CALL.members = r.members; m.remove(); drawCall(); } catch (err) { toast(err.message, 'err'); } });
}
const fmtDur = ms => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
function drawCall() {
  if (!CALL.id) return;
  let box = $('#callBox');
  if (!box) {
    box = document.createElement('div'); box.id = 'callBox';
    box.innerHTML = `<div class="cb-top"><b class="cb-title"></b><small class="cb-state"></small><span class="spacer"></span><button class="cb-mini" data-a="big">${ic('expand', 'sm')}</button></div>
      <div class="cb-screen" hidden><video autoplay playsinline muted></video><small class="cb-screen-l"></small><button class="cb-mini cb-fs" title="${t('ch_fullscreen')}">${ic('expand', 'sm')}</button></div><div class="cb-sharing" hidden>${ic('screen', 'sm')} <span>${t('call_sharing')}</span><button class="btn sm">${t('call_stop_share')}</button></div>
      <div class="cb-tiles"></div><div class="cb-banner"></div>
      <div class="cb-bar"><button class="cb-btn" data-a="deaf"></button><button class="cb-btn" data-a="mute"></button><button class="cb-btn" data-a="screen"></button><button class="cb-btn locked" data-a="video" title="${t('ch_video_dev')}">${ic('video', 'sm')}<span class="lk">🔒</span></button><button class="cb-btn" data-a="add" title="${t('call_add')}">${ic('plus', 'sm')}</button><span class="spacer"></span><button class="cb-btn red" data-a="hang" title="${t('call_hang')}">${ic('hangup')}</button></div>`;
    document.body.appendChild(box);
    const on = (a, fn) => { box.querySelector(`[data-a="${a}"]`).onclick = fn; };
    on('video', () => toast(t('ch_video_dev')));
    on('mute', toggleMute); on('deaf', toggleDeafen); on('screen', toggleScreen); on('add', addToCall); on('hang', leaveCall);
    on('big', () => box.classList.toggle('big'));
    const sv = box.querySelector('.cb-screen');
    const fs = () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => { }); else sv.requestFullscreen().catch(() => { }); };
    box.querySelector('.cb-fs').onclick = fs; sv.ondblclick = fs;
    box.querySelector('.cb-sharing .btn').onclick = () => { if (CALL.screen) toggleScreen(); };
    CALL.tick = setInterval(() => { levels(); drawCall(); }, 300);
  }
  const me = myId();
  const others = CALL.members.filter(m => m.id !== me);
  const title = CALL.title || (others.length === 1 ? others[0].name : others.length ? others.map(o => o.name).slice(0, 3).join(', ') : t('call_group'));
  box.querySelector('.cb-title').textContent = title;
  const joinedOthers = others.filter(m => m.state === 'joined');
  box.querySelector('.cb-state').textContent = !CALL.everConnected ? (joinedOthers.length ? t('call_connecting') : t('call_calling')) : fmtDur(Date.now() - CALL.startedAt) + (others.length > 1 ? ' · ' + t('call_n', joinedOthers.length + 1) : '');
  // screen share
  const sc = box.querySelector('.cb-screen'), sp = CALL.screenFrom && CALL.peers.get(CALL.screenFrom);
  const vtrack = sp && sp.stream.getVideoTracks().find(tr => tr.readyState === 'live');
  sc.hidden = !vtrack;
  if (vtrack) { const v = sc.querySelector('video'); if (!v.srcObject || v.srcObject.getVideoTracks()[0] !== vtrack) v.srcObject = new MediaStream([vtrack]); sc.querySelector('.cb-screen-l').textContent = t('call_shares', sp.card.name); }
  box.classList.toggle('has-screen', !!vtrack);
  // someone started sharing: make the call window big once (the user can shrink it again)
  if (vtrack && CALL.bigFor !== CALL.screenFrom) { CALL.bigFor = CALL.screenFrom; box.classList.add('big'); }
  if (!vtrack) CALL.bigFor = null;
  // tiles: me + everyone joined/ringing
  const tiles = [{ id: me, name: t('call_you'), avatar: (S.me.user || {}).avatar, state: 'joined', self: true }, ...others];
  const tilesHtml = tiles.map(m => {
    const p = CALL.peers.get(m.id);
    const muted = m.self ? CALL.muted : p && p.muted, deaf = m.self ? CALL.deaf : p && p.deaf;
    const speaking = !muted && (m.self ? CALL.speaking.has('me') : CALL.speaking.has(m.id));
    const ringingM = m.state === 'ringing', connecting = !m.self && m.state === 'joined' && (!p || p.state !== 'connected');
    return `<div class="cb-tile ${speaking ? 'speaking' : ''} ${ringingM ? 'ringing' : ''}"><div class="cb-av"><img src="${avatarOf(m)}" alt="">${deaf ? `<span class="cb-flag">${ic('headoff', 'sm')}</span>` : muted ? `<span class="cb-flag">${ic('micoff', 'sm')}</span>` : ''}</div><b>${esc(m.name)}</b>${ringingM ? `<small>${t('call_ringing_m')}</small>` : connecting ? `<small>${t('call_connecting')}</small>` : CALL.screenFrom === m.id || (m.self && CALL.screen) ? `<small>${ic('screen', 'sm')}</small>` : ''}</div>`;
  }).join('');
  const tb = box.querySelector('.cb-tiles'); if (tb._h !== tilesHtml) { tb.innerHTML = tilesHtml; tb._h = tilesHtml; }
  box.querySelector('.cb-sharing').hidden = !CALL.screen;
  box.querySelector('.cb-banner').innerHTML = CALL.deaf ? `<div class="cb-deaf">${ic('headoff', 'sm')} ${t('call_deaf_on')}</div>` : CALL.muted ? `<div class="cb-muted">${ic('micoff', 'sm')} ${t('call_muted_on')}</div>` : '';
  const b = a => box.querySelector(`[data-a="${a}"]`);
  b('mute').innerHTML = ic(CALL.muted ? 'micoff' : 'mic', 'sm'); b('mute').classList.toggle('off', CALL.muted); b('mute').title = t('call_mute') + ' (Ctrl+M)';
  b('deaf').innerHTML = ic(CALL.deaf ? 'headoff' : 'headphones', 'sm'); b('deaf').classList.toggle('off', CALL.deaf); b('deaf').title = t('call_deaf') + ' (Ctrl+D)';
  b('screen').innerHTML = ic('screen', 'sm'); b('screen').classList.toggle('on', !!CALL.screen); b('screen').title = CALL.screen ? t('call_stop_share') : t('call_share');
  b('screen').disabled = !CALL.peers.size;
  b('add').disabled = others.length >= ((CALL.ice && CALL.ice.max) || 6) - 1;
}
function showIncoming(c) {
  if ($('#callIn') || CALL.id) return;
  const m = document.createElement('div'); m.id = 'callIn';
  const group = c.others && c.others.length;
  m.innerHTML = `<div class="ci-card card"><img src="${avatarOf(c.from)}" alt="" class="pulse"><b>${esc(c.from.name)}${c.from.verified ? ' ' + vcheck() : ''}</b><small>${group ? t('call_group_in') : t('call_ringing_in')}</small>
    ${group ? `<div class="ci-others">${c.others.map(o => `<img src="${avatarOf(o)}" alt="" title="${esc(o.name)}">`).join('')}<span>${c.others.map(o => esc(o.name)).join(', ')}</span></div>` : ''}
    <div class="row" style="gap:14px;justify-content:center;margin-top:16px"><button class="cb-btn red lg" data-n title="${t('call_decline')}">${ic('hangup')}</button><button class="cb-btn green lg" data-y title="${t('call_answer')}">${ic('phone')}</button></div></div>`;
  document.body.appendChild(m);
  m.querySelector('[data-y]').onclick = () => answerCall(c, true);
  m.querySelector('[data-n]').onclick = () => answerCall(c, false);
  ring(true, false);
  if (!document.hasFocus()) B.notify({ title: c.from.name, body: group ? t('call_group_in') : t('call_ringing_in'), force: true });
}
// one loop: incoming calls while idle, setup messages while in a call
let callPollT = null, callPolling = false, callPollAt = 0;
const within = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
function schedulePoll(ms) { clearTimeout(callPollT); callPollT = setTimeout(pollCalls, ms); }
async function pollCalls() {
  if (callPolling && Date.now() - callPollAt < 20000) return schedulePoll(600);
  if (!S.me || !S.me.user) return schedulePoll(5000);
  callPolling = true; callPollAt = Date.now();
  try {
    const id = CALL.id;
    const r = await within(api('/api/calls/poll' + (id ? `?id=${id}&since=${CALL.since}` : '')), 12000);
    // one ring per invitation (being invited again to the same call rings again)
    const inc = r.incoming.find(c => !CALL.seenIncoming.has(c.id + ':' + c.at));
    if (!CALL.id && inc) { CALL.seenIncoming.add(inc.id + ':' + inc.at); showIncoming(inc); }
    if (!r.incoming.length && $('#callIn')) { $('#callIn').remove(); ring(false); }
    if (id && CALL.id === id) {
      for (const s of r.signals) { if (CALL.id !== id) break; CALL.since = Math.max(CALL.since, s.n); try { await within(handleSignal(s), 8000); } catch (e) { console.warn('signal', s.kind, e.message); } }
      if (CALL.id === id && r.call) {
        CALL.members = r.call.members;
        // peers the server says are gone
        for (const uid of [...CALL.peers.keys()]) if (!r.call.members.some(m => m.id === uid && m.state === 'joined')) closePeer(uid);
        if (r.call.status === 'ended' || !['joined'].includes(r.call.myState)) { if (CALL.id) { toast(CALL.everConnected ? t('call_ended') : t('call_missed')); resetCall(); } }
        else drawCall();
      }
    }
  } catch { }
  callPolling = false;
  schedulePoll(CALL.id ? 600 : 2500);
}
schedulePoll(3000);
window.addEventListener('beforeunload', () => { if (CALL.id) leaveCall(); });
// keyboard: Ctrl+M mute, Ctrl+D deafen
document.addEventListener('keydown', e => {
  if (!e.ctrlKey || e.shiftKey || e.altKey || !CALL.id || !CALL.local) return;
  const k = e.key.toLowerCase();
  if (k === 'm') { e.preventDefault(); toggleMute(); } else if (k === 'd') { e.preventDefault(); toggleDeafen(); }
});


/* ---------- messages: private chats + group chats ---------- */
async function vMessages(p, stale) {
  if (!S.me || !S.me.user) return needLogin();
  if (p.id) { DM.with = p.id; DM.group = null; }
  if (p.g) { DM.group = p.g; DM.with = null; }
  const list = await api('/api/dm').catch(() => []);
  if (stale()) return;
  put(`<div class="head"><h1>${ic('msg', 'lg')} ${t('messages')}</h1><span class="spacer"></span><button class="btn primary" id="grpNew">${ic('group', 'sm')} ${t('grp_new')}</button></div>
    <div class="dm-shell"><aside class="card dm-list" id="dmList"></aside><section class="card dm-chat" id="dmChat"></section></div>`);
  $('#grpNew').onclick = () => newGroupModal();
  const drawList = l => {
    $('#dmList').innerHTML = l.map(c => {
      const key = c.group ? 'g:' + c.group.id : c.with.id, on = c.group ? DM.group === c.group.id : DM.with === c.with.id;
      const av = c.group ? `<div class="grp-av">${(c.group.avatars || []).slice(0, 3).map(a => `<img src="${esc(siteImg(a) || a || 'https://cdn.discordapp.com/embed/avatars/0.png')}" alt="">`).join('')}</div>` : `<div class="av-wrap"><img class="av" src="${avatarOf(c.with)}" alt="">${c.with.online ? '<span class="online-dot abs"></span>' : ''}</div>`;
      const name = c.group ? `${ic('group', 'sm')} ${esc(c.group.name)}` : `${esc(c.with.name)}${c.with.verified ? ' ' + vcheck() : ''}`;
      return `<button class="dm-conv ${on ? 'on' : ''}" data-c="${esc(key)}">${av}<div style="flex:1;min-width:0;text-align:start"><b>${name}</b><small>${c.last.mine ? (LANG === 'he' ? 'אתה: ' : 'You: ') : ''}${esc(c.last.text || (c.group ? t('grp_members', c.group.count) : ''))}</small></div>${c.unread ? `<span class="dm-badge">${c.unread}</span>` : `<small class="faint">${c.last.at ? timeAgo(c.last.at) : ''}</small>`}</button>`;
    }).join('') || `<p class="faint" style="padding:14px;margin:0">${t('dm_empty')}</p>`;
    $('#dmList').querySelectorAll('[data-c]').forEach(b => b.onclick = () => { const k = b.dataset.c; go('messages', k.startsWith('g:') ? { g: k.slice(2) } : { id: k }, true); });
  };
  drawList(list);
  if (!DM.with && !DM.group && list[0]) { if (list[0].group) DM.group = list[0].group.id; else DM.with = list[0].with.id; }
  const chat = $('#dmChat');
  if (!DM.with && !DM.group) { chat.innerHTML = emptyBox('msg', t('dm_pick')); return; }
  const isGroup = !!DM.group, base = isGroup ? `/api/dm/g/${encodeURIComponent(DM.group)}` : '/api/dm/' + encodeURIComponent(DM.with);
  const d = await api(base).catch(err => ({ error: err.message }));
  if (stale()) return;
  if (d.error) { chat.innerHTML = emptyBox('msg', d.error); if (isGroup) DM.group = null; return; }
  DM.info = d;
  const me = myId();
  let head;
  if (isGroup) {
    const g = d.group;
    head = `<div class="dm-head" id="grpHead"><div class="grp-av">${g.members.slice(0, 3).map(m => `<img src="${avatarOf(m)}" alt="">`).join('')}</div><div><b>${esc(g.name)}</b><small class="faint">${t('grp_members', g.members.length)} · ${g.members.slice(0, 4).map(m => esc(m.name)).join(', ')}</small></div><span class="spacer"></span>
      <button class="icon-btn lg" id="grpCall" title="${t('grp_call')}">${ic('phone')}</button><button class="icon-btn lg" id="grpSet" title="${t('grp_manage')}">${ic('gear2')}</button></div>`;
  } else {
    const w = d.with;
    head = `<div class="dm-head" data-go="user:id:${esc(w.id)}"><img class="av" src="${avatarOf(w)}" alt=""><div><b>${esc(w.name)}${w.verified ? ' ' + vcheck() : ''}</b><small class="faint">${seenTxt(w)}</small></div>${d.friend === 'friends' && !d.callsOff ? `<span class="spacer"></span><button class="icon-btn lg" id="dmCall" title="${t('call_voice')}">${ic('phone')}</button><button class="icon-btn lg locked" id="dmVideo" title="${t('ch_video_dev')}">${ic('video')}<span class="lk">🔒</span></button>` : ''}</div>`;
  }
  const canWrite = isGroup || (d.friend === 'friends' && !d.dmsOff);
  chat.innerHTML = `${head}<div class="dm-msgs" id="dmMsgs"></div><div class="dm-typing" id="dmTyping"></div>
    ${canWrite ? `<form class="composer" id="dmF"><div class="cmp-tools"><button type="button" class="cmp-t" id="emoBtn" title="${t('ch_emoji')}">😊</button><button type="button" class="cmp-t gif locked" id="gifBtn" title="${t('ch_gif_soon')}">GIF<span class="lk">🔒</span></button><button type="button" class="cmp-t" id="attBtn" title="${t('ch_attach')}">${ic('clip', 'sm')}</button></div><textarea name="text" rows="1" maxlength="2000" placeholder="${t('dm_ph')}"></textarea><button class="btn primary">${ic('send', 'sm')} ${t('dm_send')}</button></form>`
      : `<p class="faint dm-off" style="text-align:center;padding:12px;margin:0">${d.friend === 'friends' && d.dmsOff ? t('pv_dm_off_other') : t('dm_only_friends')}</p>`}`;
  bindCommon(chat);
  if ($('#dmCall')) $('#dmCall').onclick = e => { e.stopPropagation(); startCall(d.with.id); };
  if ($('#dmVideo')) $('#dmVideo').onclick = e => { e.stopPropagation(); toast(t('ch_video_dev')); };
  if ($('#grpCall')) $('#grpCall').onclick = () => startCall(d.group.members.filter(m => m.id !== me).map(m => m.id), d.group.name);
  if ($('#grpSet')) $('#grpSet').onclick = () => groupModal(d.group);
  const box = $('#dmMsgs');
  let lastDay = '', lastAuthor = '';
  const add = ms => {
    const atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
    for (const m of ms) {
      if (box.querySelector(`[data-m="${m.id}"]`)) continue;
      const day = fmtDate(m.at);
      if (day !== lastDay) { box.insertAdjacentHTML('beforeend', `<div class="dm-day">${day}</div>`); lastDay = day; lastAuthor = ''; }
      if (m.system) { box.insertAdjacentHTML('beforeend', `<div class="dm-sys" data-m="${m.id}">${esc(LANG === 'en' && m.textEn ? m.textEn : m.text)}</div>`); lastAuthor = ''; }
      else {
        const showAuthor = isGroup && !m.mine && lastAuthor !== m.from;
        box.insertAdjacentHTML('beforeend', `<div class="dm-msg ${m.mine ? 'mine' : ''} ${isGroup && !m.mine ? 'grp' : ''}" data-m="${m.id}">${showAuthor && m.author ? `<div class="dm-author" data-go="user:id:${esc(m.from)}"><img src="${avatarOf(m.author)}" alt=""><b>${esc(m.author.name)}</b></div>` : ''}${msgBody(m)}<small>${new Date(m.at).toLocaleTimeString(LANG === 'he' ? 'he-IL' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</small></div>`);
        lastAuthor = m.from;
      }
      DM.last = Math.max(DM.last, m.at);
    }
    bindCommon(box);
    if (atBottom || ms.some(m => m.mine)) { box.scrollTop = box.scrollHeight; box.querySelectorAll('img:not([data-sc])').forEach(im => { im.dataset.sc = 1; if (!im.complete) im.addEventListener('load', () => { box.scrollTop = box.scrollHeight; }, { once: true }); }); }
  };
  const showTyping = names => { const el = $('#dmTyping'); if (!el) return; el.innerHTML = names && names.length ? `<span class="ty-dots"><i></i><i></i><i></i></span> ${esc(names.length === 1 ? t('ty_one', names[0]) : names.length === 2 ? t('ty_two', names[0]).replace('{y}', names[1]) : t('ty_many'))}` : ''; };
  DM.last = 0; add(d.messages); box.scrollTop = box.scrollHeight; showTyping(d.typing);
  const f = $('#dmF');
  if (f) {
    const ta = f.text; ta.focus();
    ta.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); f.requestSubmit(); } };
    let lastTy = 0;
    ta.addEventListener('input', () => { if (!ta.value.trim() || Date.now() - lastTy < 2500) return; lastTy = Date.now(); api(base + '/typing', { method: 'POST', body: {} }).catch(() => { }); });
    f.onsubmit = async e => { e.preventDefault(); const v = ta.value.trim(); if (!v) return; ta.value = ''; try { add([await api(base, { method: 'POST', body: { text: v } })]); api('/api/dm').then(drawList).catch(() => { }); } catch (err) { ta.value = v; toast(err.message, 'err'); } };
    $('#emoBtn').onclick = e => { e.stopPropagation(); emojiPicker($('#emoBtn'), em => { const p = ta.selectionStart ?? ta.value.length; ta.value = ta.value.slice(0, p) + em + ta.value.slice(p); ta.focus(); ta.setSelectionRange(p + em.length, p + em.length); }); };
    $('#gifBtn').onclick = () => toast(t('ch_gif_soon'));
    if (false) gifPicker(async gif => { try { add([await api(base, { method: 'POST', body: { text: '', gif } })]); api('/api/dm').then(drawList).catch(() => { }); } catch (err) { toast(err.message, 'err'); } });
    $('#attBtn').onclick = async () => {
      const r = await B.uploadFile({ apiPath: base + '/file', field: 'file', fields: { text: ta.value.trim() } });
      if (r.canceled) return;
      if (r.status !== 200) return toast(upErr(r), 'err');
      ta.value = ''; add([{ ...r.data, mine: true }]); api('/api/dm').then(drawList).catch(() => { });
    };
  }
  clearInterval(DM.timer);
  DM.tick = 0;
  const key = isGroup ? 'g' + DM.group : DM.with;
  DM.timer = setInterval(async () => {
    if (stale() || S.route !== 'messages' || (isGroup ? 'g' + DM.group : DM.with) !== key) return clearInterval(DM.timer);
    try { const n = await api(`${base}?since=${DM.last}`); if (n.messages.length) add(n.messages); showTyping(n.typing); if (++DM.tick % 3 === 0 || n.messages.length) drawList(await api('/api/dm')); } catch { }
  }, 1500);
}
// a chat message: text, a GIF, a picture or a file
function msgBody(m) {
  let h = '';
  if (m.gif) h += `<img class="dm-gif" src="${esc(m.gif.url)}" alt="GIF" data-zoom-src="${esc(m.gif.url)}">`;
  if (m.file) {
    const url = B.site + m.file.url;
    h += m.file.image ? `<img class="dm-img" src="${esc(url)}" alt="" data-zoom-src="${esc(url)}">`
      : `<button class="dm-file" data-ext="${esc(url)}">${ic('clip')}<span><b>${esc(m.file.name)}</b><small>${fmtSize(m.file.size || 0)}</small></span>${ic('download', 'sm')}</button>`;
  }
  if (m.text) h += `<div class="bubble">${esc(m.text).replace(/\n/g, '<br>')}</div>`;
  return h;
}
// click a picture / GIF in the chat to see it big
document.addEventListener('click', e => {
  const img = e.target.closest && e.target.closest('[data-zoom-src]');
  if (!img) return;
  const m = document.createElement('div'); m.className = 'modal-back'; m.innerHTML = `<img src="${esc(img.dataset.zoomSrc)}" alt="">`; m.onclick = () => m.remove(); document.body.appendChild(m);
});
const EMOJI = {
  '😀': '😀 😃 😄 😁 😆 😅 🤣 😂 🙂 😉 😊 😇 🥰 😍 🤩 😘 😋 😛 😜 🤪 😎 🤓 🥳 😏 😒 🙄 😬 😮‍💨 🤥 😌 😔 😪 🤤 😴 😷 🤒 🤕 🤢 🤮 🥵 🥶 🥴 😵 🤯 🤠 😱 😨 😰 😥 😢 😭 😤 😡 🤬 💀 👻 👽 🤖 💩 😈',
  '👍': '👍 👎 👌 🤌 ✌️ 🤞 🤟 🤘 🤙 👈 👉 👆 👇 ☝️ ✋ 🤚 🖐️ 👋 🤝 🙏 💪 👏 🙌 👐 🫶 🤲 ✍️ 💅 👀 🧠 🫡 🤫 🤭 🫢',
  '❤️': '❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝 🔥 ✨ ⭐ 🌟 💫 💥 💯 ✅ ❌ ⚠️ 💤 🎉 🎊 🏆 🥇 🥈 🥉',
  '🎮': '🎮 🕹️ ⛏️ 🪓 🗡️ ⚔️ 🛡️ 🏹 🧱 🪵 💎 🪙 💰 🍖 🍗 🍞 🍎 🍉 🎂 🐷 🐮 🐔 🐺 🐱 🐶 🐍 🕷️ 🧟 🧙 🐉 🌍 🌋 🏔️ 🏝️ 🏠 🏰 🚀 ⚡ 🌙 ☀️ 🌈 ❄️ 💧'
};
function emojiPicker(anchor, pick) {
  const old = $('#emojiPop'); if (old) { old.remove(); return; }
  const p = document.createElement('div'); p.id = 'emojiPop';
  const cats = Object.keys(EMOJI);
  const draw = c => { p.innerHTML = `<div class="emo-tabs">${cats.map(k => `<button type="button" data-cat="${k}" class="${k === c ? 'on' : ''}">${k}</button>`).join('')}</div><div class="emo-grid">${EMOJI[c].split(' ').map(x => `<button type="button" data-em="${x}">${x}</button>`).join('')}</div>`;
    p.querySelectorAll('[data-cat]').forEach(b => b.onclick = e => { e.stopPropagation(); draw(b.dataset.cat); });
    p.querySelectorAll('[data-em]').forEach(b => b.onclick = e => { e.stopPropagation(); pick(b.dataset.em); }); };
  draw(cats[0]);
  document.body.appendChild(p);
  const r = anchor.getBoundingClientRect();
  p.style.left = Math.max(8, Math.min(innerWidth - p.offsetWidth - 8, r.left)) + 'px';
  p.style.top = Math.max(8, r.top - p.offsetHeight - 8) + 'px';
  setTimeout(() => document.addEventListener('click', function off(e) { if (!p.contains(e.target)) { p.remove(); document.removeEventListener('click', off); } }), 0);
}
function gifPicker(send) {
  const m = document.createElement('div'); m.className = 'modal-back'; m.style.zIndex = 270;
  m.innerHTML = `<div class="card gif-modal"><div class="card-h"><b style="font-size:16px">GIF</b><input type="text" id="gifQ" placeholder="${t('ch_gif_search')}" style="flex:1"><button class="icon-btn" data-x>✕</button></div><div class="card-b"><div class="gif-grid" id="gifG"><div class="spin"></div></div><p class="faint" style="margin:10px 0 0;font-size:11.5px;text-align:center">Powered by GIPHY</p></div></div>`;
  document.body.appendChild(m);
  m.querySelector('[data-x]').onclick = () => m.remove();
  m.onclick = e => { if (e.target === m) m.remove(); };
  let timer, n = 0;
  const load = async q => {
    const my = ++n, g = m.querySelector('#gifG');
    try {
      const list = await api('/api/gifs' + (q ? '?q=' + encodeURIComponent(q) : ''));
      if (my !== n) return;
      g.innerHTML = list.map((x, i) => `<button class="gif-it" data-i="${i}"><img src="${esc(x.preview)}" alt="" loading="lazy"></button>`).join('') || `<p class="faint">${t('no_results')}</p>`;
      g.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { const x = list[+b.dataset.i]; m.remove(); send({ url: x.url, w: x.w, h: x.h }); });
    } catch (err) { if (my === n) g.innerHTML = `<p class="faint" style="grid-column:1/-1">${esc(err.message)}</p>`; }
  };
  const q = m.querySelector('#gifQ'); q.focus();
  q.oninput = () => { clearTimeout(timer); timer = setTimeout(() => load(q.value.trim()), 350); };
  load('');
}
// new group: a name + friends
async function newGroupModal() {
  const f = await api('/api/friends').catch(() => ({ friends: [] }));
  const m = document.createElement('div'); m.className = 'modal-back';
  m.innerHTML = `<form class="card tk-modal"><div class="card-h">${ic('group')}<h3>${t('grp_new')}</h3><span class="spacer"></span><button type="button" class="icon-btn" data-x>✕</button></div><div class="card-b stack">
    <div><label class="lbl">${t('grp_name')}</label><input type="text" name="name" maxlength="40" required></div>
    <div><label class="lbl">${t('grp_pick')}</label><div class="pick-list">${f.friends.map(u => `<label class="pick-row"><input type="checkbox" value="${esc(u.id)}"><img class="av" src="${avatarOf(u)}" alt=""><b>${esc(u.name)}</b></label>`).join('') || `<p class="faint" style="margin:0">${t('grp_no_friends')}</p>`}</div></div>
    <button class="btn primary lg">${ic('group', 'sm')} ${t('grp_create')}</button></div></form>`;
  document.body.appendChild(m);
  m.querySelector('[data-x]').onclick = () => m.remove();
  m.onclick = e => { if (e.target === m) m.remove(); };
  m.querySelector('form').onsubmit = async e => {
    e.preventDefault();
    const members = [...m.querySelectorAll('input[type=checkbox]:checked')].map(x => x.value);
    if (!members.length) return toast(t('grp_min'), 'err');
    try { const g = await api('/api/groups', { method: 'POST', body: { name: e.target.name.value, members } }); m.remove(); go('messages', { g: g.id }); } catch (err) { toast(err.message, 'err'); }
  };
}
// group settings: rename, members, add, leave
async function groupModal(g) {
  const me = myId(), owner = g.owner === me;
  const f = await api('/api/friends').catch(() => ({ friends: [] }));
  const addable = f.friends.filter(x => !g.members.some(mm => mm.id === x.id));
  const m = document.createElement('div'); m.className = 'modal-back';
  m.innerHTML = `<div class="card tk-modal"><div class="card-h">${ic('gear2')}<h3>${t('grp_manage')}</h3><span class="spacer"></span><button class="icon-btn" data-x>✕</button></div><div class="card-b stack">
    <div class="row" style="gap:8px"><input type="text" id="grpN" maxlength="40" value="${esc(g.name)}"><button class="btn" id="grpNB">${t('grp_rename')}</button></div>
    <div class="pick-list">${g.members.map(u => `<div class="pick-row"><img class="av" src="${avatarOf(u)}" alt=""><b>${esc(u.name)}</b>${u.id === g.owner ? `<span class="chip accent">${t('grp_owner')}</span>` : ''}<span class="spacer"></span>${owner && u.id !== me ? `<button class="btn sm" data-rm="${esc(u.id)}">${t('grp_remove')}</button>` : ''}</div>`).join('')}</div>
    ${addable.length ? `<div class="row" style="gap:8px"><select id="grpA">${addable.map(u => `<option value="${esc(u.id)}">${esc(u.name)}</option>`).join('')}</select><button class="btn" id="grpAB">${ic('plus', 'sm')} ${t('grp_add')}</button></div>` : ''}
    <button class="btn danger" id="grpL">${t('grp_leave')}</button></div></div>`;
  document.body.appendChild(m);
  const close = () => m.remove(), reload = () => { close(); go('messages', { g: g.id }, true); };
  m.querySelector('[data-x]').onclick = close;
  m.onclick = e => { if (e.target === m) close(); };
  const act = async (fn) => { try { await fn(); reload(); } catch (err) { toast(err.message, 'err'); } };
  m.querySelector('#grpNB').onclick = () => act(() => api(`/api/groups/${g.id}`, { method: 'PUT', body: { name: m.querySelector('#grpN').value } }));
  if (m.querySelector('#grpAB')) m.querySelector('#grpAB').onclick = () => act(() => api(`/api/groups/${g.id}/members`, { method: 'POST', body: { id: m.querySelector('#grpA').value } }));
  m.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => act(() => api(`/api/groups/${g.id}/members/${encodeURIComponent(b.dataset.rm)}`, { method: 'DELETE' })));
  m.querySelector('#grpL').onclick = async () => { if (!confirm(t('grp_leave_q', g.name))) return; try { await api(`/api/groups/${g.id}/members/${encodeURIComponent(me)}`, { method: 'DELETE' }); close(); DM.group = null; go('messages', {}, true); } catch (err) { toast(err.message, 'err'); } };
}
// links in notifications: /messages/g/<id> opens the group
const _openLinkG = openLink;
openLink = function (l) { const m = String(l || '').match(/^\/messages\/g\/(\w+)/); if (m) return go('messages', { g: m[1] }); return _openLinkG(l); };

/* ---------- call button on profiles + staff screen-share permission ---------- */
const _vUserC = vUser;
vUser = async function (params, stale) {
  await _vUserC(params, stale);
  if (stale()) return;
  const dmB = $('#dmB');
  if (dmB && !$('#callB')) {
    dmB.insertAdjacentHTML('afterend', `<button class="btn" id="callB" title="${t('call_voice')}">${ic('phone', 'sm')}</button>`);
    $('#callB').onclick = () => startCall(params.id);
  }
  if (hasPerm('moderation') && S.me.user.id !== params.id && !$('#ssB')) {
    const x = await api('/api/users/' + encodeURIComponent(params.id) + '/extra').catch(() => null);
    const row = ($('#frB') && $('#frB').parentElement) || view.querySelector('.phead');
    if (!x || !row || stale()) return;
    row.insertAdjacentHTML('beforeend', `<button class="btn ${x.screenShare ? 'ok' : ''}" id="ssB">${ic('screen', 'sm')} ${x.screenShare ? t('ss_off') : t('ss_on')}</button>`);
    $('#ssB').onclick = async () => { try { await api('/api/admin/users/' + encodeURIComponent(params.id) + '/screenshare', { method: 'POST', body: {} }); go('user', { id: params.id }, true); } catch (err) { toast(err.message, 'err'); } };
  }
};

/* ---------- settings: microphone, camera, speakers ---------- */
const _vSettingsAV = vSettings;
vSettings = async function (p, stale) {
  await _vSettingsAV(p, stale);
  if (stale()) return;
  const v = view.querySelector('.view-in'); if (!v) return;
  if (S.me && S.me.user) {
    const pv = await api('/api/me/privacy').catch(() => null);
    if (pv && !stale()) {
      const sel = (k, cur) => `<select data-pv="${k}"><option value="friends" ${cur === 'friends' ? 'selected' : ''}>${t('pv_friends')}</option><option value="none" ${cur === 'none' ? 'selected' : ''}>${t('pv_none')}</option></select>`;
      v.insertAdjacentHTML('beforeend', `<div class="card" style="margin-top:18px"><div class="card-h">${ic('lock')}<h3>${t('pv_title')}</h3></div><div class="card-b form2">
        <div><label class="lbl">${t('pv_dms')}</label>${sel('dms', pv.dms)}</div><div><label class="lbl">${t('pv_calls')}</label>${sel('calls', pv.calls)}</div></div></div>`);
      v.querySelectorAll('[data-pv]').forEach(x => x.onchange = async () => { try { await api('/api/me/privacy', { method: 'PUT', body: { [x.dataset.pv]: x.value } }); toast(t('pv_saved')); } catch (err) { toast(err.message, 'err'); } });
    }
  }
  v.insertAdjacentHTML('beforeend', `<div class="card" style="margin-top:18px" id="avCard"><div class="card-h">${ic('mic')}<h3>${t('av_title')}</h3></div><div class="card-b av-grid">
    <div><label class="lbl">${t('av_mic')}</label><select id="avMic"></select><div class="mic-meter"><i id="avLvl"></i></div><small class="faint">${t('av_test_mic')}</small></div>
    <div><label class="lbl">${t('av_spk')}</label><select id="avSpk"></select><button class="btn" id="avSpkT" style="margin-top:10px">${ic('play2', 'sm')} ${t('av_test_spk')}</button><button class="btn" id="avRingT" style="margin-top:10px;margin-inline-start:6px">🔔 ${LANG === 'he' ? 'שמע את הצלצול' : 'Hear the ringtone'}</button></div>
    <div><label class="lbl">${t('av_cam')}</label><select id="avCam"></select><button class="btn" id="avCamT" style="margin-top:10px">${ic('video', 'sm')} ${t('av_cam_on')}</button></div>
    <div class="av-prev"><video id="avPrev" autoplay playsinline muted hidden></video></div>
    <div class="full row" style="gap:18px;flex-wrap:wrap">${[['ns', 'av_ns'], ['ec', 'av_ec'], ['agc', 'av_agc']].map(([k, l]) => `<div class="row" style="gap:10px"><label class="tgl"><input type="checkbox" data-av="${k}" ${AV[k] ? 'checked' : ''}><span></span></label> ${t(l)}</div>`).join('')}</div>
  </div></div>`);
  let micStream = null, camStream = null, raf = 0, actx = null;
  const stopAll = () => { cancelAnimationFrame(raf); [micStream, camStream].forEach(s => s && s.getTracks().forEach(tr => tr.stop())); micStream = camStream = null; if (actx) actx.close().catch(() => { }); actx = null; };
  const meter = async () => {
    if (micStream) micStream.getTracks().forEach(tr => tr.stop());
    cancelAnimationFrame(raf);
    try { micStream = await navigator.mediaDevices.getUserMedia({ audio: audioC() }); } catch { $('#avLvl').parentElement.nextElementSibling.textContent = t('av_perm'); return; }
    actx = actx || new AudioContext();
    const an = actx.createAnalyser(); an.fftSize = 512; actx.createMediaStreamSource(micStream).connect(an);
    const data = new Uint8Array(an.fftSize);
    const loop = () => { if (!document.body.contains($('#avLvl') || document.createElement('i'))) return stopAll(); an.getByteTimeDomainData(data); let m = 0; for (const x of data) m = Math.max(m, Math.abs(x - 128)); $('#avLvl').style.width = Math.min(100, m / 128 * 180) + '%'; raf = requestAnimationFrame(loop); };
    loop();
  };
  const fill = async () => {
    const devs = await navigator.mediaDevices.enumerateDevices();
    const opt = (kind, cur) => `<option value="">${t('av_default')}</option>` + devs.filter(d => d.kind === kind && d.deviceId && d.deviceId !== 'default').map(d => `<option value="${esc(d.deviceId)}" ${d.deviceId === cur ? 'selected' : ''}>${esc(d.label || kind)}</option>`).join('');
    $('#avMic').innerHTML = opt('audioinput', AV.mic); $('#avSpk').innerHTML = opt('audiooutput', AV.spk); $('#avCam').innerHTML = opt('videoinput', AV.cam);
  };
  await meter(); await fill();
  $('#avMic').onchange = e => { AV.mic = e.target.value; saveAV(); meter(); };
  $('#avSpk').onchange = e => { AV.spk = e.target.value; saveAV(); };
  $('#avCam').onchange = e => { AV.cam = e.target.value; saveAV(); if (camStream) { camStream.getTracks().forEach(tr => tr.stop()); camStream = null; $('#avCamT').click(); } };
  view.querySelectorAll('[data-av]').forEach(c => c.onchange = () => { AV[c.dataset.av] = c.checked; saveAV(); meter(); });
  $('#avRingT').onclick = () => { if (CALL.id) return; ring(true, false); clearTimeout(RING.demo); RING.demo = setTimeout(() => { if (!CALL.id && !$('#callIn')) ring(false); }, 4600); };
  $('#avSpkT').onclick = () => { const a = new Audio(); const c = new AudioContext(), o = c.createOscillator(), g = c.createGain(), dst = c.createMediaStreamDestination(); o.frequency.value = 523; g.gain.value = .15; o.connect(g).connect(dst); o.start(); setTimeout(() => { o.stop(); c.close(); }, 700); a.srcObject = dst.stream; (AV.spk && a.setSinkId ? a.setSinkId(AV.spk) : Promise.resolve()).catch(() => { }).then(() => a.play()); };
  $('#avCamT').onclick = async () => {
    const vid = $('#avPrev');
    if (camStream) { camStream.getTracks().forEach(tr => tr.stop()); camStream = null; vid.hidden = true; $('#avCamT').innerHTML = `${ic('video', 'sm')} ${t('av_cam_on')}`; return; }
    try { camStream = await navigator.mediaDevices.getUserMedia({ video: videoC() }); } catch { return toast(t('av_perm'), 'err'); }
    vid.srcObject = camStream; vid.hidden = false; $('#avCamT').innerHTML = `${ic('videooff', 'sm')} ${t('av_cam_off')}`; fill();
  };
  // leaving the settings page releases the microphone / camera
  const stopOnLeave = setInterval(() => { if (S.route !== 'settings' || !document.body.contains($('#avCard') || document.createElement('i'))) { clearInterval(stopOnLeave); stopAll(); } }, 1000);
};

/* ================= @mentions ================= */
// in the text box people see "@Name"; when the form is sent it becomes @[Name](id), which the server turns into a notification
const MENTION_TOKEN = /@\[([^\]\n]{1,60})\]\(([\w:.@-]{3,80})\)/g;
const MENTION = { box: null, input: null, items: [], idx: 0, start: 0, friends: null, timer: null };
const mentionTargets = 'textarea, #rvF input[name="text"]';
function mentionBox() {
  if (!MENTION.box) { MENTION.box = document.createElement('div'); MENTION.box.id = 'mentionBox'; MENTION.box.hidden = true; document.body.appendChild(MENTION.box); }
  return MENTION.box;
}
function closeMention() { if (MENTION.box) MENTION.box.hidden = true; MENTION.input = null; MENTION.items = []; }
async function mentionCandidates(q) {
  if (!MENTION.friends) { MENTION.friends = S.me && S.me.user ? (await api('/api/friends').catch(() => ({ friends: [] }))).friends : []; setTimeout(() => { MENTION.friends = null; }, 60000); }
  const ql = q.toLowerCase();
  let list = MENTION.friends.filter(f => !ql || f.name.toLowerCase().includes(ql));
  if (q.length >= 2) { const more = await api('/api/search/users?q=' + encodeURIComponent(q)).catch(() => []); for (const u of more) if (!list.some(x => x.id === u.id)) list.push(u); }
  const me = S.me && S.me.user && S.me.user.id;
  return list.filter(u => u.id !== me && u.name).slice(0, 7);
}
function drawMention() {
  const box = mentionBox(), el = MENTION.input;
  if (!el || !MENTION.items.length) return (box.hidden = true);
  const r = el.getBoundingClientRect();
  box.innerHTML = MENTION.items.map((u, i) => `<button class="${i === MENTION.idx ? 'on' : ''}" data-i="${i}"><img src="${avatarOf(u)}" alt=""><b>${esc(u.name)}</b>${u.verified ? vcheck() : ''}${u.creator ? `<small>${t('creator')}</small>` : ''}</button>`).join('');
  box.hidden = false;
  const h = box.offsetHeight;
  box.style.left = Math.max(8, Math.min(innerWidth - box.offsetWidth - 8, r.left)) + 'px';
  box.style.top = (r.top - h - 6 > 8 ? r.top - h - 6 : r.bottom + 6) + 'px';
  box.querySelectorAll('[data-i]').forEach(b => b.onmousedown = e => { e.preventDefault(); pickMention(+b.dataset.i); });
}
function pickMention(i) {
  const u = MENTION.items[i], el = MENTION.input;
  if (!u || !el) return;
  const pos = el.selectionStart, before = el.value.slice(0, MENTION.start), after = el.value.slice(pos);
  const label = '@' + u.name.replace(/[\[\]()\n]/g, '').slice(0, 60);
  el.value = before + label + ' ' + after;
  const caret = (before + label + ' ').length;
  el.setSelectionRange(caret, caret);
  (el._mentions = el._mentions || {})[label] = u.id;
  closeMention(); el.focus();
}
document.addEventListener('input', e => {
  const el = e.target;
  if (!el.matches || !el.matches(mentionTargets)) return;
  const upto = el.value.slice(0, el.selectionStart), m = upto.match(/(^|\s)@([^\s@]{0,24})$/);
  if (!m) return closeMention();
  MENTION.input = el; MENTION.start = upto.length - m[2].length - 1;
  clearTimeout(MENTION.timer);
  MENTION.timer = setTimeout(async () => { const q = m[2]; const items = await mentionCandidates(q); if (MENTION.input !== el) return; MENTION.items = items; MENTION.idx = 0; drawMention(); }, 120);
});
// keys work while the list is open (capture: before the chat's own Enter-to-send)
document.addEventListener('keydown', e => {
  if (!MENTION.input || !MENTION.box || MENTION.box.hidden || e.target !== MENTION.input) return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); MENTION.idx = (MENTION.idx + (e.key === 'ArrowDown' ? 1 : -1) + MENTION.items.length) % MENTION.items.length; drawMention(); }
  else if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); e.stopImmediatePropagation(); pickMention(MENTION.idx); }
  else if (e.key === 'Escape') { e.preventDefault(); closeMention(); }
}, true);
document.addEventListener('focusout', e => { if (e.target === MENTION.input) setTimeout(closeMention, 150); });
// just before any form is sent: "@Name" -> "@[Name](id)" (capture runs before the form's own handler)
document.addEventListener('submit', e => {
  e.target.querySelectorAll(mentionTargets).forEach(el => {
    if (!el._mentions) return;
    for (const [label, id] of Object.entries(el._mentions)) el.value = el.value.split(label).join(`@[${label.slice(1)}](${id})`);
    el._mentions = null;
  });
}, true);
// the chat buttons in some screens send without a form submit — cover the ticket composer's send button too
document.addEventListener('click', e => {
  const btn = e.target.closest && e.target.closest('.composer button, .composer .btn');
  if (!btn) return;
  const f = btn.closest('.composer'); if (!f) return;
  f.querySelectorAll(mentionTargets).forEach(el => { if (!el._mentions) return; for (const [label, id] of Object.entries(el._mentions)) el.value = el.value.split(label).join(`@[${label.slice(1)}](${id})`); el._mentions = null; });
}, true);

// showing: @[Name](id) in any message / review becomes a link to the profile
function linkMentions(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => n.nodeValue.includes('@[') && !n.parentElement.closest('textarea, input, .mention, script') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP });
  const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const n of nodes) {
    const txt = n.nodeValue; MENTION_TOKEN.lastIndex = 0;
    if (!MENTION_TOKEN.test(txt)) continue;
    MENTION_TOKEN.lastIndex = 0;
    const frag = document.createDocumentFragment(); let last = 0, m;
    while ((m = MENTION_TOKEN.exec(txt))) {
      frag.appendChild(document.createTextNode(txt.slice(last, m.index)));
      const a = document.createElement('a'); a.href = '#'; a.className = 'mention'; a.dataset.go = 'user:id:' + m[2]; a.textContent = '@' + m[1];
      frag.appendChild(a); last = m.index + m[0].length;
    }
    frag.appendChild(document.createTextNode(txt.slice(last)));
    const parent = n.parentNode; parent.replaceChild(frag, n); bindCommon(parent);
  }
}
let mentionScan = 0;
new MutationObserver(() => { cancelAnimationFrame(mentionScan); mentionScan = requestAnimationFrame(() => linkMentions(view)); }).observe(view, { childList: true, subtree: true });
// a mention inside a notification opens the right place (tickets, projects, servers already do)

/* ================= loader (like the site) + sign-out confirmation ================= */
Object.assign(I18N.he, { lo_title: 'להתנתק?', lo_text: 'בטוח שאתה רוצה להתנתק מהחשבון?', lo_yes: 'כן, התנתק', lo_no: 'ביטול' });
Object.assign(I18N.en, { lo_title: 'Sign out?', lo_text: 'Are you sure you want to sign out of your account?', lo_yes: 'Yes, sign out', lo_no: 'Cancel' });
function confirmLogout() {
  return new Promise(resolve => {
    const m = document.createElement('div'); m.className = 'modal-back';
    m.innerHTML = `<div class="card lo-modal"><div class="lo-ic">${ic('logout', 'xl')}</div><h2>${t('lo_title')}</h2><p class="faint">${t('lo_text')}</p>
      <div class="row" style="gap:10px;justify-content:center;margin-top:18px"><button class="btn danger lg" data-y>${ic('logout', 'sm')} ${t('lo_yes')}</button><button class="btn lg" data-n>${t('lo_no')}</button></div></div>`;
    const close = v => { m.remove(); document.removeEventListener('keydown', key); resolve(v); };
    const key = e => { if (e.key === 'Escape') close(false); };
    m.querySelector('[data-y]').onclick = () => close(true);
    m.querySelector('[data-n]').onclick = () => close(false);
    m.onclick = e => { if (e.target === m) close(false); };
    document.addEventListener('keydown', key);
    document.body.appendChild(m);
    m.querySelector('[data-n]').focus();
  });
}
// the spinning Craft Hub loader: on launch, and for a moment when moving between pages
const PL = { shownAt: 0, timer: null };
function showLoader(ms) {
  const pl = $('#preloader'); if (!pl) return;
  clearTimeout(PL.timer);
  pl.classList.remove('out');
  PL.shownAt = Date.now();
  PL.timer = setTimeout(hideLoader, ms);
}
function hideLoader() { const pl = $('#preloader'); if (pl) pl.classList.add('out'); }
const _goPL = go;
go = function (route, params, noHistory) {
  // switching conversations inside Messages is instant — no loader
  const moving = route !== S.route || (route !== 'messages' && JSON.stringify(params || {}) !== JSON.stringify(S.params || {}));
  if (moving && S.started) showLoader(550);
  // leaving the home page closes the first-time tour (it points at things on the home page)
  if (route !== 'home' && $('#tourTip')) { try { localStorage.setItem(TOUR_KEY, '1'); } catch { } ['#tourBack', '#tourHole', '#tourTip'].forEach(q => { const el = $(q); if (el) el.remove(); }); }
  return _goPL(route, params, noHistory);
};
go.seq = _goPL.seq;

/* ================= first-time welcome + guided tour ================= */
Object.assign(I18N.he, {
  tr_welcome: 'ברוך הבא ל-Craft Hub! 👋', tr_welcome_sub: 'הבית של פלאגינים, מודים, טקסטורות ושיידרים מהקהילה. בוא נעשה סיבוב קצר — זה לוקח חצי דקה.',
  tr_start: 'בוא נתחיל', tr_skip: 'דלג', tr_next: 'הבא', tr_back: 'הקודם', tr_done: 'סיום', tr_of: '{x}',
  tr_search: ['חיפוש', 'מחפשים כל דבר — פלאגין, מוד, טקסטורה או קרייטור. פשוט מקלידים ולוחצים חפש.'],
  tr_cats: ['קטגוריות', 'קפיצה ישירה לסוג התוכן שמעניין אותך.'],
  tr_discover: ['גלה', 'כל התוכן באתר, עם סינון לפי סוג וקטגוריה ומיון לפי הורדות, לייקים או חדש.'],
  tr_library: ['הספרייה שלך', 'כל מה שהתקנת במקום אחד — עדכון, הסרה, והפעלה או כיבוי של מודים.'],
  tr_servers: ['שרתים', 'שרתי מיינקראפט מהקהילה. מצביעים כל 24 שעות ומקבלים פרסים בשרת.'],
  tr_people: ['אנשים', 'מחפשים אנשים, עוקבים אחריהם, מוסיפים חברים ורואים את התוכן והשרתים שלהם.'],
  tr_bell: ['התראות', 'כאן תראה תגובות, עדכונים לפרויקטים שאתה עוקב אחריהם ובקשות חברות.'],
  tr_settings: ['הגדרות וחשבון', 'התחברות, הפרופיל שלך, שפה ותיקיית מיינקראפט.'],
  tr_finish: 'זהו, אתה מוכן! 🎉', tr_finish_sub: 'התקנה בלחיצה אחת, עדכונים אוטומטיים, והכל במקום אחד. תהנה!', tr_login: 'התחברות', tr_replay: 'הצג שוב את המדריך', tr_card: 'מדריך למתחילים'
});
Object.assign(I18N.en, {
  tr_welcome: 'Welcome to Craft Hub! 👋', tr_welcome_sub: 'The home of community plugins, mods, texture packs and shaders. Let\'s take a quick tour — it takes half a minute.',
  tr_start: 'Let\'s go', tr_skip: 'Skip', tr_next: 'Next', tr_back: 'Back', tr_done: 'Done', tr_of: '{x}',
  tr_search: ['Search', 'Find anything — a plugin, mod, texture pack or creator. Just type and hit search.'],
  tr_cats: ['Categories', 'Jump straight to the kind of content you like.'],
  tr_discover: ['Discover', 'Everything on Craft Hub, filtered by type and category, sorted by downloads, likes or newest.'],
  tr_library: ['Your library', 'Everything you installed in one place — update, remove, and turn mods on or off.'],
  tr_servers: ['Servers', 'Community Minecraft servers. Vote every 24 hours and get rewards in game.'],
  tr_people: ['People', 'Find people, follow them, add friends and see their content and servers.'],
  tr_bell: ['Notifications', 'Replies, updates to projects you follow, and friend requests show up here.'],
  tr_settings: ['Settings & account', 'Sign in, your profile, language and the Minecraft folder.'],
  tr_finish: 'You\'re all set! 🎉', tr_finish_sub: 'One-click installs, automatic updates, all in one place. Enjoy!', tr_login: 'Sign in', tr_replay: 'Show the tour again', tr_card: 'Beginner tour'
});
const TOUR_KEY = 'ch_tour_v1';
const TOUR_STEPS = [
  ['.sh-search', 'tr_search'], ['.sh-pills', 'tr_cats'], ['#nav [data-go="discover"]', 'tr_discover'], ['#nav [data-go="library"]', 'tr_library'],
  ['#nav [data-go="servers"]', 'tr_servers'], ['#nav [data-go="people"]', 'tr_people'], ['#bellBtn', 'tr_bell'], ['#sideBottom [data-go="settings"]', 'tr_settings']
];
function startTour() {
  if ($('#tourBack')) return;
  if (S.route !== 'home') go('home', {}, true);
  const back = document.createElement('div'); back.id = 'tourBack';
  const hole = document.createElement('div'); hole.id = 'tourHole';
  const tip = document.createElement('div'); tip.id = 'tourTip'; tip.className = 'card';
  document.body.append(back, hole, tip);
  let i = -1; // -1 = welcome, TOUR_STEPS.length = finish
  const end = () => { try { localStorage.setItem(TOUR_KEY, '1'); } catch { } back.remove(); hole.remove(); tip.remove(); window.removeEventListener('resize', place); document.removeEventListener('keydown', key); };
  const steps = () => TOUR_STEPS.filter(([sel]) => document.querySelector(sel));
  const center = html => { hole.hidden = true; back.classList.add('dim'); tip.className = 'card tour-center'; tip.style.cssText = ''; tip.innerHTML = html; };
  function place() {
    const list = steps();
    if (i < 0 || i >= list.length) return;
    const el = document.querySelector(list[i][0]);
    if (!el) return;
    el.scrollIntoView({ block: 'nearest' });
    const r = el.getBoundingClientRect(), pad = 8;
    hole.hidden = false; back.classList.remove('dim');
    Object.assign(hole.style, { top: r.top - pad + 'px', left: r.left - pad + 'px', width: r.width + pad * 2 + 'px', height: r.height + pad * 2 + 'px' });
    tip.className = 'card tour-tip';
    const tw = tip.offsetWidth, th = tip.offsetHeight, vw = innerWidth, vh = innerHeight;
    // prefer below the target, else above, else beside it (the sidebar is on the side)
    let top = r.bottom + 16, left = r.left + r.width / 2 - tw / 2;
    if (r.width < 320 && r.height < 80 && (r.left > vw / 2 || r.right < vw / 2)) { top = r.top + r.height / 2 - th / 2; left = r.left > vw / 2 ? r.left - tw - 20 : r.right + 20; }
    else if (top + th > vh - 12) top = r.top - th - 16;
    tip.style.top = Math.max(12, Math.min(vh - th - 12, top)) + 'px';
    tip.style.left = Math.max(12, Math.min(vw - tw - 12, left)) + 'px';
  }
  function draw() {
    // the tour belongs to the home page; if something navigated away, close it
    if (S.route !== 'home') return end();
    const list = steps();
    if (i < 0) {
      center(`<div class="tour-logo">${ic('grid', 'xl')}</div><h2>${t('tr_welcome')}</h2><p>${t('tr_welcome_sub')}</p>
        <div class="row" style="gap:10px;justify-content:center;margin-top:20px"><button class="btn primary lg" data-t="next">${t('tr_start')} ${ic(flip(), 'sm')}</button><button class="btn lg ghost" data-t="skip">${t('tr_skip')}</button></div>`);
    } else if (i >= list.length) {
      const me = S.me && S.me.user;
      center(`<div class="tour-logo">${ic('check', 'xl')}</div><h2>${t('tr_finish')}</h2><p>${t('tr_finish_sub')}</p>
        <div class="row" style="gap:10px;justify-content:center;margin-top:20px">${me ? '' : `<button class="btn primary lg" data-t="login">${ic('user', 'sm')} ${t('tr_login')}</button>`}<button class="btn lg ${me ? 'primary' : ''}" data-t="skip">${t('tr_done')}</button></div>`);
    } else {
      const [title, text] = I18N[LANG][list[i][1]] || I18N.he[list[i][1]];
      tip.innerHTML = `<div class="row" style="gap:8px;margin-bottom:6px"><span class="num">${i + 1}</span><b style="font-size:17px">${esc(title)}</b><span class="spacer"></span><span class="faint" style="font-size:12.5px">${i + 1}/${list.length}</span></div>
        <p>${esc(text)}</p><div class="tour-bar"><i style="width:${(i + 1) / list.length * 100}%"></i></div>
        <div class="row" style="gap:8px;margin-top:14px"><button class="btn sm ghost" data-t="skip">${t('tr_skip')}</button><span class="spacer"></span>${i > 0 ? `<button class="btn sm" data-t="back">${t('tr_back')}</button>` : ''}<button class="btn sm primary" data-t="next">${i === list.length - 1 ? t('tr_done') : t('tr_next')}</button></div>`;
      requestAnimationFrame(place);
    }
    tip.querySelectorAll('[data-t]').forEach(b => b.onclick = async () => {
      const a = b.dataset.t;
      if (a === 'skip') return end();
      if (a === 'login') { end(); return doLogin(); }
      i += a === 'next' ? 1 : -1;
      if (i > steps().length) return end();
      draw();
    });
    const main = tip.querySelector('[data-t="next"], [data-t="skip"]'); if (main) main.focus();
  }
  const key = e => { if (e.key === 'Escape') end(); if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { const b = tip.querySelector(`[data-t="${(e.key === 'ArrowLeft') === (LANG === 'he') ? 'next' : 'back'}"]`); if (b) b.click(); } };
  window.addEventListener('resize', place);
  document.addEventListener('keydown', key);
  draw();
}
// replay from the settings page
const _vSettingsTour = vSettings;
vSettings = async function (p, stale) {
  await _vSettingsTour(p, stale);
  if (stale()) return;
  const v = view.querySelector('.view-in');
  if (v) { v.insertAdjacentHTML('beforeend', `<div class="card" style="margin-top:18px"><div class="card-h">${ic('sparkle')}<h3>${t('tr_card')}</h3><span class="spacer"></span><button class="btn" id="tourAgain">${ic('refresh', 'sm')} ${t('tr_replay')}</button></div></div>`); $('#tourAgain').onclick = () => startTour(); }
};

/* ================= sidebar: grouped and less crowded ================= */
Object.assign(ICONS, { chev: '<path d="m6 9 6 6 6-6"/>' });
Object.assign(I18N.he, { ng_community: 'קהילה', ng_mine: 'שלי', ng_more: 'עוד' });
Object.assign(I18N.en, { ng_community: 'Community', ng_mine: 'Mine', ng_more: 'More' });
const NAV_GROUPS = [
  [null, ['home', 'discover', 'library', 'servers']],
  ['ng_community', ['people', 'messages', 'creators', 'leaders']],
  ['ng_mine', ['following', 'studio', 'support', 'admin']],
  ['ng_more', ['partners', 'updates'], true]
];
let NAV_MORE_OPEN = false; try { NAV_MORE_OPEN = localStorage.getItem('ch_nav_more') === '1'; } catch { }
const _renderNavG = renderNav;
renderNav = function () {
  _renderNavG();
  const nav = $('#nav');
  const links = {};
  nav.querySelectorAll('a[data-go]').forEach(a => { links[a.dataset.go.split(':')[0]] = a; });
  const placed = new Set(), frag = document.createDocumentFragment();
  for (const [title, keys, collapsible] of NAV_GROUPS) {
    const items = keys.map(k => links[k]).filter(Boolean);
    if (!items.length) continue;
    const g = document.createElement('div'); g.className = 'nav-g';
    const open = !collapsible || NAV_MORE_OPEN || items.some(a => a.classList.contains('on'));
    if (title) {
      const h = document.createElement(collapsible ? 'button' : 'div');
      h.className = 'nav-h' + (collapsible ? ' tog' : '') + (open ? ' open' : '');
      h.innerHTML = `${t(title)}${collapsible ? ic('chev', 'sm') : ''}`;
      if (collapsible) h.onclick = () => { NAV_MORE_OPEN = !g.classList.contains('open'); try { localStorage.setItem('ch_nav_more', NAV_MORE_OPEN ? '1' : '0'); } catch { } g.classList.toggle('open', NAV_MORE_OPEN); h.classList.toggle('open', NAV_MORE_OPEN); };
      g.appendChild(h);
    }
    const box = document.createElement('div'); box.className = 'nav-items';
    items.forEach(a => { box.appendChild(a); placed.add(a); });
    g.appendChild(box);
    if (collapsible) g.classList.add('coll');
    g.classList.toggle('open', open);
    frag.appendChild(g);
  }
  // anything not in a group (future items) goes to the end of the first group
  nav.querySelectorAll('a[data-go]').forEach(a => { if (!placed.has(a)) frag.firstChild.querySelector('.nav-items').appendChild(a); });
  nav.innerHTML = '';
  nav.appendChild(frag);
};

/* ================= test windows (staff): a second copy of the app, signed in as another user ================= */
Object.assign(I18N.he, { tw_btn: 'חלון בדיקה', tw_title: 'חלונות בדיקה', tw_sub: 'פותח עוד עותק של האפליקציה עם חיבור נפרד — אפשר להתחבר בו למשתמש אחר ולבדוק דברים בין שני משתמשים (הודעות, שיחות, חברים). כל חלון זוכר את החשבון שלו.', tw_open: 'פתח חלון {x}', tw_badge: '🧪 חלון בדיקה {x}' });
Object.assign(I18N.en, { tw_btn: 'Test window', tw_title: 'Test windows', tw_sub: 'Opens another copy of the app with its own session — sign in as a different user and test things between two users (messages, calls, friends). Each window remembers its account.', tw_open: 'Open window {x}', tw_badge: '🧪 Test window {x}' });
const TESTER = (window.craftHubApp && window.craftHubApp.tester) || '';
if (TESTER) {
  document.title = 'Craft Hub — ' + t('tw_badge', TESTER);
  document.body.classList.add('tester');
  const b = document.createElement('div'); b.id = 'testerBadge'; b.textContent = t('tw_badge', TESTER); document.body.appendChild(b);
  try { localStorage.setItem('ch_tour_v1', '1'); localStorage.setItem('ch_seen_ver', '99.0.0'); } catch { } // no tour / what's new in test windows
}
// the admin panel: a card on "my desk" + a button in the header
const _aMeTW = aMe;
aMe = async function (body, stale) {
  await _aMeTW(body, stale);
  if (stale() || TESTER || !B.openTestWindow) return;
  body.insertAdjacentHTML('beforeend', `<div class="card" style="margin-top:18px"><div class="card-h">${ic('screen')}<h3>${t('tw_title')}</h3></div><div class="card-b"><p class="faint" style="margin:0 0 14px">${t('tw_sub')}</p>
    <div class="row" style="gap:10px;flex-wrap:wrap">${[2, 3, 4].map(n => `<button class="btn" data-tw="${n}">${ic('plus', 'sm')} ${t('tw_open', n)}</button>`).join('')}</div></div></div>`);
  body.querySelectorAll('[data-tw]').forEach(b => b.onclick = async () => { const r = await B.openTestWindow(+b.dataset.tw); if (r && r.error) toast(r.error, 'err'); });
};

/* ================= taskbar badge: red number for unread messages + notifications ================= */
function badgePng(n) {
  const c = document.createElement('canvas'); c.width = c.height = 32;
  const g = c.getContext('2d');
  g.fillStyle = '#e5484d'; g.beginPath(); g.arc(16, 16, 15, 0, Math.PI * 2); g.fill();
  g.lineWidth = 2; g.strokeStyle = '#ffffff'; g.stroke();
  const txt = n > 99 ? '99+' : String(n);
  g.fillStyle = '#fff'; g.font = `bold ${txt.length > 2 ? 13 : txt.length > 1 ? 17 : 20}px Segoe UI, Arial`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(txt, 16, 17);
  return c.toDataURL('image/png');
}
let BADGE_LAST = -1;
async function refreshBadge() {
  if (!B.setBadge) return;
  if (!S.me || !S.me.user) { if (BADGE_LAST !== 0) { B.setBadge(0); BADGE_LAST = 0; } return; }
  let me;
  try { me = await api('/api/me'); } catch { return; }
  if (!me || !me.user) return;
  S.me.counts = me.counts || S.me.counts;
  const c = me.counts || {}, total = (c.dms || 0) + (c.notifications || 0);
  if (total !== BADGE_LAST) {
    if (total > BADGE_LAST && BADGE_LAST >= 0) B.flash();
    B.setBadge(total, total ? badgePng(total) : null);
    BADGE_LAST = total;
    try { drawBell(); } catch { }
    DM.unread = c.dms || 0;
    const n = $('#nav [data-go="messages"] .nav-n'); if (n) n.textContent = DM.unread || '';
  }
}
setInterval(refreshBadge, 12000);
window.addEventListener('focus', () => setTimeout(refreshBadge, 800));
// reading messages / notifications clears the number quickly
const _goBadge = go;
go = function (route, params, noHistory) { const r = _goBadge(route, params, noHistory); if (route === 'messages') setTimeout(refreshBadge, 1500); return r; };
go.seq = _goBadge.seq;
// an incoming call makes the taskbar blink too
const _showIncomingB = showIncoming;
showIncoming = function (c) { _showIncomingB(c); if (B.flash) B.flash(); };

/* ================= start ================= */
// runs last, so every view above is the newest version. Start right away; account and site info arrive in the background,
// then the first screen is drawn again with them (home background, staff buttons).
applyLang();
drawBell();
go('home', {}, true);
Promise.all([
  api('/api/site').then(x => { S.site = x; applyAppearance(); maintStaffBar(); }).catch(() => { }),
  loadMe()
]).then(() => { if (['home', 'discover'].includes(S.route)) go(S.route, S.params, true); whatsNew(); checkVotes(); pollDms(); refreshBadge(); });
S.started = true;
PL.timer = setTimeout(hideLoader, 1000);
// first time in the app: the welcome + tour, after the loader is gone
let firstRun = false; try { firstRun = !localStorage.getItem(TOUR_KEY); } catch { }
// (not on top of the maintenance screen — wait until the site is back)
const tryTour = () => { if ($('#maintScreen') || S.route !== 'home') return setTimeout(tryTour, 5000); startTour(); };
if (firstRun) setTimeout(tryTour, 1700);
