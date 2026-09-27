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
const APP_TYPES = ['mod', 'resourcepack', 'shader', 'datapack', 'world', 'plugin'];
function installState(p) {
  const x = S.installed[p.slug];
  if (!x) return 'none';
  return p.file && p.file.name && p.file.name !== x.file ? 'update' : 'installed';
}
function installBtn(p, cls = 'sm') {
  if (!APP_TYPES.includes(p.type || 'plugin') || !p.file) return `<button class="btn ${cls}" data-site="/project/${esc(p.slug)}">${ic('ext', 'sm')} ${t('open_site')}</button>`;
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
  $('#nav').innerHTML = NAV.map(([k, i]) => `<a href="#" data-go="${k}" class="${r === k ? 'on' : ''}">${ic(i)} ${t(k)}</a>`).join('')
    + `<a href="#" data-go="play" class="play ${r === 'play' ? 'on' : ''}">${ic('play', 'fill')} ${t('play')}</a>`;
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
  const fn = { home: vHome, discover: vDiscover, project: vProject, library: vLibrary, play: vPlay, servers: vServers, server: vServer, settings: vSettings }[route] || vHome;
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
      <div class="row"><button class="btn primary lg" data-go="play">${ic('play', 'fill')} ${t('play')}</button><button class="btn lg" data-go="discover">${ic('grid', 'sm')} ${t('discover')}</button></div>
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
        <button class="btn lg" data-site="/project/${esc(p.slug)}" title="${t('open_site')}">${ic('ext', 'sm')}</button>
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

async function vPlay(p, stale) {
  const [ver, mods, s] = await Promise.all([B.mcVersions(), B.modsList(), B.settings()]);
  if (stale()) return;
  const vs = ver.versions || [];
  let chosen = localStorage.getItem('play_version') || (vs[0] && vs[0].id) || '';
  if (!vs.some(v => v.id === chosen) && vs[0]) chosen = vs[0].id;
  const cur = vs.find(v => v.id === chosen);
  const on = mods.filter(m => m.enabled).length;
  const groups = ['Fabric', 'Quilt', 'Forge', 'NeoForge', 'OptiFine', 'Vanilla'].map(l => [l, vs.filter(v => v.loader === l)]).filter(g => g[1].length);
  put(`
    <div class="play-hero">
      <h1>${ic('play', 'fill lg')} ${t('play_title')}</h1>
      ${vs.length ? `<div class="play-row"><select id="verSel">${groups.map(([l, list]) => `<optgroup label="${l}">${list.map(v => `<option value="${esc(v.id)}" ${v.id === chosen ? 'selected' : ''}>${esc(v.id)}</option>`).join('')}</optgroup>`).join('')}</select><button class="btn primary play-btn" id="playBtn">${ic('play', 'fill')} ${t('play_btn')}</button></div>
      <div class="play-meta">${cur ? `<span class="ld ${cur.loader}">${cur.loader}</span> <span class="mono">${esc(cur.base)}</span>` : ''}${cur && !['Vanilla', 'OptiFine'].includes(cur.loader) ? ` · ${t('mods_on', on)}` : on ? ` · <span style="color:var(--warn)">${t('vanilla_mods')}</span>` : ''}</div>`
      : `<p class="faint">${s.mcExists ? t('no_versions') : t('mc_missing')}</p>`}
    </div>
    <div class="play-layout">
      <div class="card"><div class="card-h">${ic('grid')}<h3>${t('my_mods')}</h3><span class="faint">${on}/${mods.length}</span><span class="spacer"></span><a class="link" data-go="library">${t('library')} ${ic(flip(), 'sm')}</a></div><div class="card-b">
        ${mods.length ? mods.slice(0, 12).map(m => `<div class="lrow ${m.enabled ? '' : 'off'}"><label class="tgl"><input type="checkbox" data-mod="${esc(m.file)}" ${m.enabled ? 'checked' : ''}><span></span></label><b class="mono ltr" style="flex:1">${esc(m.name)}</b></div>`).join('') : emptyBox('grid', t('mods_empty'))}
      </div></div>
      <div class="card"><div class="card-h">${ic('plus')}<h3>${t('add_loader')}</h3></div><div class="card-b stack" style="gap:10px">
        <p class="faint" style="margin:0;font-size:13px">${t('add_loader_sub')}</p>
        <div class="tabs" style="margin:0"><button data-ld="fabric" class="on">Fabric</button><button data-ld="quilt">Quilt</button></div>
        <select id="ldMc"><option>…</option></select>
        <button class="btn primary" id="ldGo">${ic('plus', 'sm')} ${t('add')}</button>
        <span class="faint" style="font-size:12px">${t('forge_hint')} <a data-ext="https://files.minecraftforge.net" class="link">Forge</a> · <a data-ext="https://neoforged.net" class="link">NeoForge</a></span>
      </div></div>
    </div>`);
  const sel = $('#verSel');
  if (sel) sel.onchange = () => { localStorage.setItem('play_version', sel.value); go('play', {}, true); };
  const pb = $('#playBtn');
  if (pb) pb.onclick = async () => { pb.disabled = true; const r = await B.launch(sel.value); toast(r.ok ? t('play_started', sel.value) : t('play_failed'), r.ok ? '' : 'err'); setTimeout(() => { pb.disabled = false; }, 4000); };
  view.querySelectorAll('[data-mod]').forEach(c => c.onchange = async () => { await B.modsToggle(c.dataset.mod); go('play', {}, true); });
  let ld = 'fabric';
  const loadMc = async () => { const box = $('#ldMc'); box.innerHTML = '<option>…</option>'; try { box.innerHTML = (await B.loaderGameVersions(ld)).map(v => `<option>${esc(v)}</option>`).join(''); } catch { box.innerHTML = `<option value="">${t('error')}</option>`; } };
  view.querySelectorAll('[data-ld]').forEach(b => b.onclick = () => { ld = b.dataset.ld; view.querySelectorAll('[data-ld]').forEach(x => x.classList.toggle('on', x === b)); loadMc(); });
  loadMc();
  $('#ldGo').onclick = async () => { const mc = $('#ldMc').value; if (!mc) return; $('#ldGo').disabled = true; try { const r = await B.installLoader({ loader: ld, mc }); localStorage.setItem('play_version', r.id); toast(t('loader_added', r.id)); go('play', {}, true); } catch { toast(t('error'), 'err'); $('#ldGo').disabled = false; } };
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
        <button class="btn" id="updBtn">${ic('refresh', 'sm')} ${t('check_updates')}</button><button class="btn" data-ext="${esc(B.site)}">${ic('ext', 'sm')} ${t('website')}</button><button class="btn" data-ext="https://discord.gg/ZW4uCt4yQ">${t('discord')}</button>
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
async function loadMe() { try { S.me = await api('/api/me'); } catch { S.me = S.me || null; } renderNav(); drawBell(); }
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
  if (mp) go('project', { slug: mp[1] }); else if (ms) go('server', { slug: ms[1] }); else if (l) B.openExternal(B.site + l);
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
  else if (l) B.openExternal(B.site + l);
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
api('/api/site').then(x => { S.site = x; applyAppearance(); if (S.route === 'discover') go('discover', {}, true); }).catch(() => { });
loadMe();
