// Craft Hub desktop app — its own interface (app/), data from crafthubs.net, installs straight into Minecraft.
const { app, BrowserWindow, ipcMain, dialog, shell, Menu, nativeTheme, net, session } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const { autoUpdater } = require('electron-updater');
const AdmZip = require('adm-zip');

const SITE = process.env.CRAFTHUB_URL || 'https://crafthubs.net';
const SITE_ORIGIN = new URL(SITE).origin;
const SETTINGS_FILE = path.join(app.getPath('userData'), 'settings.json');
let win = null;

// ---------- settings ----------
const defaultMcDir = () => process.platform === 'win32' ? path.join(process.env.APPDATA || '', '.minecraft')
  : process.platform === 'darwin' ? path.join(app.getPath('home'), 'Library', 'Application Support', 'minecraft')
  : path.join(app.getPath('home'), '.minecraft');
function readSettings() {
  try { return { mcDir: defaultMcDir(), pluginsDir: '', ...JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')) }; }
  catch { return { mcDir: defaultMcDir(), pluginsDir: '' }; }
}
function writeSettings(s) { fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true }); fs.writeFileSync(SETTINGS_FILE, JSON.stringify(s, null, 2)); }

// where each content type goes inside .minecraft
const TARGETS = { mod: 'mods', resourcepack: 'resourcepacks', shader: 'shaderpacks', world: 'saves', datapack: 'saves', plugin: null, modpack: null };
function targetDir(type, s = readSettings()) {
  if (type === 'plugin') return s.pluginsDir || '';
  const sub = TARGETS[type];
  return sub ? path.join(s.mcDir, sub) : '';
}
const safeName = n => String(n || 'file').replace(/[<>:"/\\|?*\u0000-\u001f]/g, '').replace(/^\.+/, '').slice(0, 150) || 'file';

// ---------- window ----------
// The window shows the app's own interface (app/index.html). crafthubs.net is only used as an API.
const APP_DIR = path.join(__dirname, 'app');
function createWindow() {
  nativeTheme.themeSource = 'dark';
  win = new BrowserWindow({
    width: 1320, height: 860, minWidth: 960, minHeight: 620,
    backgroundColor: '#09090d',
    title: 'Craft Hub',
    icon: path.join(__dirname, 'build', 'icon.png'),
    titleBarStyle: 'hidden',
    titleBarOverlay: { color: '#09090d', symbolColor: '#e3b341', height: 38 },
    show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false }
  });
  Menu.setApplicationMenu(null);
  win.once('ready-to-show', () => win.show());
  loadApp();
  // an update ignored for 3 weeks locks the app
  win.webContents.on('did-finish-load', () => enforceBlock());
  // links never navigate the app window — web links open in the normal browser
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/i.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!isAppPage(url)) { e.preventDefault(); if (/^https?:/i.test(url)) shell.openExternal(url); } });
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F5') win.webContents.reload();
    if (input.control && input.shift && input.key.toLowerCase() === 'i') win.webContents.toggleDevTools();
  });
}
function loadApp() { win.loadFile(path.join(APP_DIR, 'index.html')); }
const isSite = url => { try { return new URL(url).origin === SITE_ORIGIN; } catch { return false; } };
// our own local pages (app/, blocked.html, offline.html)
function isAppPage(url) {
  try { return url.startsWith('file://') && path.resolve(decodeURIComponent(new URL(url).pathname).replace(/^\/([A-Za-z]:)/, '$1')).startsWith(__dirname); } catch { return false; }
}
const trusted = e => isAppPage(e.senderFrame.url);

// ---------- crafthubs.net API (with the signed-in session's cookies) ----------
function siteRequest(p, { method = 'GET', body } = {}) {
  return new Promise(resolve => {
    let done = false;
    const finish = r => { if (!done) { done = true; resolve(r); } };
    let req;
    try { req = net.request({ method, url: SITE + p, useSessionCookies: true }); } catch { return finish({ status: 0 }); }
    req.setHeader('X-Requested-With', 'fetch');
    req.setHeader('Accept', 'application/json');
    if (body !== undefined) req.setHeader('Content-Type', 'application/json');
    const timer = setTimeout(() => { try { req.abort(); } catch { } finish({ status: 0 }); }, 15000);
    req.on('response', res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => { clearTimeout(timer); let data = null; try { data = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { } finish({ status: res.statusCode, data }); });
    });
    req.on('error', () => { clearTimeout(timer); finish({ status: 0 }); });
    if (body !== undefined) req.write(JSON.stringify(body));
    req.end();
  });
}
ipcMain.handle('api', (e, { path: p, method, body } = {}) => {
  if (!trusted(e) || !/^\/api\/[\w\-/.?=&%:]*$/.test(String(p))) return { status: 403, data: { error: 'forbidden' } };
  if (method && !['GET', 'POST', 'PUT', 'DELETE'].includes(method)) return { status: 400 };
  return siteRequest(p, { method, body });
});
// sign in: a small window with the real site's login (Discord / Google / email). Closes itself once signed in.
ipcMain.handle('login', e => new Promise(resolve => {
  if (!trusted(e)) return resolve(false);
  const w = new BrowserWindow({ parent: win, modal: true, width: 540, height: 760, backgroundColor: '#0b0b0f', autoHideMenuBar: true, title: 'Craft Hub', webPreferences: { contextIsolation: true, sandbox: true } });
  // Google refuses sign-in inside apps that announce themselves — use a plain Chrome user agent here
  w.webContents.setUserAgent(w.webContents.getUserAgent().replace(/\s(Electron|crafthub-app|Craft Hub)\/\S+/gi, ''));
  w.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/i.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  w.webContents.on('did-finish-load', () => { if (isSite(w.webContents.getURL())) w.webContents.executeJavaScript('setTimeout(() => { try { openLogin(); } catch (e) {} }, 700)').catch(() => { }); });
  let finished = false;
  const done = ok => { if (finished) return; finished = true; clearInterval(timer); if (!w.isDestroyed()) w.close(); resolve(ok); };
  const timer = setInterval(async () => { const r = await siteRequest('/api/me'); if (r.data && r.data.user) done(true); }, 1500);
  w.on('closed', () => done(false));
  w.loadURL(SITE + '/');
}));
ipcMain.handle('logout', async e => {
  if (!trusted(e)) return false;
  await siteRequest('/auth/logout', { method: 'POST', body: {} });
  await session.defaultSession.clearStorageData({ origin: SITE_ORIGIN, storages: ['cookies'] });
  return true;
});
ipcMain.handle('open-external', (e, url) => { if (trusted(e) && /^https?:\/\/[^\s]+$/i.test(String(url))) shell.openExternal(String(url)); });
ipcMain.on('site-url', e => { e.returnValue = SITE; });

// ---------- downloads ----------
function download(url, dest, onProgress, redirects = 0) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https:') ? https : http;
    const req = lib.get(url, { headers: { 'User-Agent': `CraftHubApp/${app.getVersion()}` } }, res => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 5) {
        res.resume();
        const next = new URL(res.headers.location, url).toString();
        if (!isSite(next)) return reject(new Error('redirect_outside'));
        return resolve(download(next, dest, onProgress, redirects + 1));
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error('http_' + res.statusCode)); }
      const total = Number(res.headers['content-length']) || 0;
      let got = 0;
      const cd = res.headers['content-disposition'] || '';
      const m = cd.match(/filename\*=UTF-8''([^;]+)/i) || cd.match(/filename="?([^";]+)"?/i);
      const fileName = m ? decodeURIComponent(m[1]) : '';
      const tmp = dest + '.part';
      const out = fs.createWriteStream(tmp);
      res.on('data', c => { got += c.length; if (total) onProgress(got / total); });
      res.pipe(out);
      out.on('finish', () => out.close(() => resolve({ tmp, fileName })));
      out.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(30000, () => req.destroy(new Error('timeout')));
  });
}

// install a project file into the right Minecraft folder
ipcMain.handle('install', async (e, { slug, versionId, type, name }) => {
  if (!trusted(e)) throw new Error('forbidden');
  if (!/^[a-z0-9-]{1,64}$/.test(String(slug)) || (versionId && !/^[\w-]{1,40}$/.test(String(versionId)))) throw new Error('bad_request');
  const s = readSettings();
  let dir = targetDir(type, s);
  if (type === 'plugin' && !dir) {
    const r = await dialog.showOpenDialog(win, { title: 'בחר את תיקיית plugins של השרת', properties: ['openDirectory'] });
    if (r.canceled || !r.filePaths[0]) return { ok: false, error: 'canceled' };
    dir = r.filePaths[0]; writeSettings({ ...s, pluginsDir: dir });
  }
  if (type === 'datapack') {
    const saves = path.join(s.mcDir, 'saves');
    const r = await dialog.showOpenDialog(win, { title: 'בחר עולם (World) להתקנת הדאטהפאק', defaultPath: fs.existsSync(saves) ? saves : s.mcDir, properties: ['openDirectory'] });
    if (r.canceled || !r.filePaths[0]) return { ok: false, error: 'canceled' };
    dir = path.join(r.filePaths[0], 'datapacks');
  }
  if (!dir) { // modpacks and anything unknown: just save to Downloads
    dir = app.getPath('downloads');
  }
  fs.mkdirSync(dir, { recursive: true });
  const url = `${SITE}/dl/${encodeURIComponent(slug)}${versionId ? '/' + encodeURIComponent(versionId) : ''}`;
  const send = p => e.sender.send('install-progress', { slug, progress: p });
  const probe = path.join(dir, `.crafthub-${slug}`);
  const { tmp, fileName } = await download(url, probe, send);
  const finalName = safeName(fileName || `${slug}.jar`);
  let finalPath = path.join(dir, finalName);
  if (type === 'world' && /\.zip$/i.test(finalName)) {
    // worlds are zipped folders — unpack into saves/<name>
    const zip = new AdmZip(tmp);
    let worldDir = path.join(dir, safeName(name || slug));
    for (let k = 2; fs.existsSync(worldDir); k++) worldDir = path.join(dir, `${safeName(name || slug)} (${k})`);
    const entries = zip.getEntries();
    const root = entries.find(en => /(^|\/)level\.dat$/.test(en.entryName));
    const prefix = root ? root.entryName.replace(/level\.dat$/, '') : '';
    for (const en of entries) {
      if (en.isDirectory || !en.entryName.startsWith(prefix)) continue;
      const rel = en.entryName.slice(prefix.length);
      const target = path.join(worldDir, rel);
      if (!target.startsWith(worldDir + path.sep)) continue; // zip-slip guard
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, en.getData());
    }
    fs.rmSync(tmp, { force: true });
    finalPath = worldDir;
  } else {
    // replace older copies of the same project (installed earlier by the app)
    const index = readIndex(dir);
    if (index[slug] && index[slug] !== finalName) fs.rmSync(path.join(dir, index[slug]), { force: true });
    fs.renameSync(tmp, finalPath);
    index[slug] = finalName; writeIndex(dir, index);
  }
  return { ok: true, path: finalPath, dir };
});
// tiny index per folder: which file belongs to which project (for updates / uninstall)
const indexFile = dir => path.join(dir, '.crafthub.json');
const readIndex = dir => { try { return JSON.parse(fs.readFileSync(indexFile(dir), 'utf8')); } catch { return {}; } };
const writeIndex = (dir, idx) => { try { fs.writeFileSync(indexFile(dir), JSON.stringify(idx, null, 2)); } catch { } };

ipcMain.handle('installed', (e) => {
  if (!trusted(e)) throw new Error('forbidden');
  const s = readSettings(), out = {};
  for (const type of ['mod', 'resourcepack', 'shader']) {
    const dir = targetDir(type, s);
    const idx = readIndex(dir);
    for (const [slug, file] of Object.entries(idx)) if (fs.existsSync(path.join(dir, file))) out[slug] = { type, file };
  }
  return out;
});
ipcMain.handle('uninstall', (e, { slug, type }) => {
  if (!trusted(e)) throw new Error('forbidden');
  const dir = targetDir(type);
  const idx = readIndex(dir);
  if (!idx[slug]) return { ok: false };
  fs.rmSync(path.join(dir, idx[slug]), { force: true });
  delete idx[slug]; writeIndex(dir, idx);
  return { ok: true };
});
ipcMain.handle('settings', e => {
  if (!trusted(e)) throw new Error('forbidden');
  const s = readSettings();
  return { ...s, mcExists: fs.existsSync(s.mcDir), version: app.getVersion() };
});
ipcMain.handle('choose-dir', async (e, which) => {
  if (!trusted(e)) throw new Error('forbidden');
  const s = readSettings();
  const r = await dialog.showOpenDialog(win, { title: which === 'plugins' ? 'תיקיית plugins של השרת' : 'תיקיית מיינקראפט (.minecraft)', defaultPath: which === 'plugins' ? s.pluginsDir || undefined : s.mcDir, properties: ['openDirectory'] });
  if (r.canceled || !r.filePaths[0]) return readSettings();
  writeSettings({ ...s, [which === 'plugins' ? 'pluginsDir' : 'mcDir']: r.filePaths[0] });
  return readSettings();
});
ipcMain.handle('open-folder', (e, type) => {
  if (!trusted(e)) throw new Error('forbidden');
  const dir = type === 'minecraft' ? readSettings().mcDir : targetDir(type);
  if (dir) { fs.mkdirSync(dir, { recursive: true }); shell.openPath(dir); }
});
ipcMain.handle('check-update', async e => {
  if (!app.isPackaged) return { dev: true };
  try { const r = await autoUpdater.checkForUpdates(); return { version: r && r.updateInfo && r.updateInfo.version }; } catch (err) { return { error: err.message }; }
});
ipcMain.on('offline-retry', () => loadApp());


// ---------- play: Minecraft versions, loaders, mods, launcher ----------
const { Notification } = require('electron');
const { spawn } = require('child_process');
function detectLoader(id, json) {
  const s = `${id} ${json.mainClass || ''}`.toLowerCase();
  if (s.includes('neoforge')) return 'NeoForge';
  if (s.includes('forge') || s.includes('fml')) return 'Forge';
  if (s.includes('fabric')) return 'Fabric';
  if (s.includes('quilt')) return 'Quilt';
  if (s.includes('optifine')) return 'OptiFine';
  return 'Vanilla';
}
ipcMain.handle('mc-versions', e => {
  if (!trusted(e)) throw new Error('forbidden');
  const dir = path.join(readSettings().mcDir, 'versions');
  const out = [];
  let names = [];
  try { names = fs.readdirSync(dir); } catch { return { versions: [], exists: false }; }
  for (const id of names) {
    const jf = path.join(dir, id, id + '.json');
    try {
      const j = JSON.parse(fs.readFileSync(jf, 'utf8'));
      out.push({ id, loader: detectLoader(id, j), base: j.inheritsFrom || (j.id || id), type: j.type || 'release', time: fs.statSync(jf).mtimeMs });
    } catch { /* not a version folder */ }
  }
  out.sort((a, b) => b.time - a.time);
  return { versions: out, exists: true };
});
// mods currently in the mods folder (enabled / disabled)
ipcMain.handle('mods-list', e => {
  if (!trusted(e)) throw new Error('forbidden');
  const dir = targetDir('mod');
  const idx = readIndex(dir), bySlug = Object.fromEntries(Object.entries(idx).map(([slug, f]) => [f, slug]));
  let files = [];
  try { files = fs.readdirSync(dir); } catch { return []; }
  return files.filter(f => /\.jar(\.disabled)?$/i.test(f)).map(f => {
    const enabled = !/\.disabled$/i.test(f), base = f.replace(/\.disabled$/i, '');
    return { file: f, name: base.replace(/\.jar$/i, ''), enabled, size: fs.statSync(path.join(dir, f)).size, slug: bySlug[base] || null };
  }).sort((a, b) => a.name.localeCompare(b.name));
});
ipcMain.handle('mods-toggle', (e, file) => {
  if (!trusted(e)) throw new Error('forbidden');
  const dir = targetDir('mod'), name = path.basename(String(file));
  const from = path.join(dir, name);
  if (!fs.existsSync(from) || !/\.jar(\.disabled)?$/i.test(name)) return { ok: false };
  const to = /\.disabled$/i.test(name) ? from.replace(/\.disabled$/i, '') : from + '.disabled';
  fs.renameSync(from, to);
  return { ok: true, file: path.basename(to) };
});
// fetch JSON from the loader metadata servers only
function getJson(url) {
  return new Promise((resolve, reject) => {
    const host = new URL(url).hostname;
    if (!['meta.fabricmc.net', 'meta.quiltmc.org'].includes(host)) return reject(new Error('host'));
    https.get(url, { headers: { 'User-Agent': `CraftHubApp/${app.getVersion()}` } }, res => {
      if (res.statusCode !== 200) { res.resume(); return reject(new Error('http_' + res.statusCode)); }
      let body = ''; res.setEncoding('utf8');
      res.on('data', c => { body += c; }); res.on('end', () => { try { resolve(JSON.parse(body)); } catch (err) { reject(err); } });
    }).on('error', reject);
  });
}
const LOADER_META = { fabric: 'https://meta.fabricmc.net/v2', quilt: 'https://meta.quiltmc.org/v3' };
ipcMain.handle('loader-game-versions', async (e, loader) => {
  if (!trusted(e)) throw new Error('forbidden');
  const base = LOADER_META[loader]; if (!base) throw new Error('bad_loader');
  const list = await getJson(`${base}/versions/game`);
  return list.filter(v => v.stable).map(v => v.version).slice(0, 60);
});
// adds a Fabric / Quilt version the official launcher can start (it downloads the libraries itself)
ipcMain.handle('install-loader', async (e, { loader, mc }) => {
  if (!trusted(e)) throw new Error('forbidden');
  const base = LOADER_META[loader];
  if (!base || !/^[\w.-]{1,32}$/.test(String(mc))) throw new Error('bad_request');
  const loaders = await getJson(`${base}/versions/loader/${encodeURIComponent(mc)}`);
  const pick = loaders.find(l => (l.loader || {}).stable !== false) || loaders[0];
  if (!pick) throw new Error('no_loader');
  const profile = await getJson(`${base}/versions/loader/${encodeURIComponent(mc)}/${encodeURIComponent(pick.loader.version)}/profile/json`);
  const id = String(profile.id || '');
  if (!/^[\w.+-]{1,80}$/.test(id)) throw new Error('bad_profile');
  const vdir = path.join(readSettings().mcDir, 'versions', id);
  fs.mkdirSync(vdir, { recursive: true });
  fs.writeFileSync(path.join(vdir, id + '.json'), JSON.stringify(profile, null, 2));
  if (!fs.existsSync(path.join(vdir, id + '.jar'))) fs.writeFileSync(path.join(vdir, id + '.jar'), '');
  return { ok: true, id };
});
// launcher profile "Craft Hub" set to the chosen version, then open the official launcher
ipcMain.handle('launch', async (e, versionId) => {
  if (!trusted(e)) throw new Error('forbidden');
  const s = readSettings();
  const id = String(versionId || '');
  if (!/^[\w.+ -]{1,80}$/.test(id) || !fs.existsSync(path.join(s.mcDir, 'versions', id, id + '.json'))) return { ok: false, error: 'no_version' };
  const now = new Date().toISOString();
  let wrote = 0;
  for (const f of ['launcher_profiles.json', 'launcher_profiles_microsoft_store.json']) {
    const fp = path.join(s.mcDir, f);
    if (!fs.existsSync(fp)) continue;
    try {
      const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
      j.profiles = j.profiles || {};
      j.profiles.crafthub = { ...(j.profiles.crafthub || {}), name: 'Craft Hub', type: 'custom', lastVersionId: id, lastUsed: now, created: (j.profiles.crafthub || {}).created || now, icon: 'Gold_Block' };
      fs.writeFileSync(fp, JSON.stringify(j, null, 2));
      wrote++;
    } catch { }
  }
  if (process.env.CRAFTHUB_NO_LAUNCH) return { ok: true, profile: wrote > 0, dry: true }; // tests: don't open the real launcher
  const pf86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', pf = process.env.ProgramFiles || 'C:\\Program Files';
  const exes = [path.join(pf86, 'Minecraft Launcher', 'MinecraftLauncher.exe'), path.join(pf, 'Minecraft Launcher', 'MinecraftLauncher.exe'), path.join(pf86, 'Minecraft', 'MinecraftLauncher.exe')];
  const exe = exes.find(p => fs.existsSync(p));
  if (exe) spawn(exe, [], { detached: true, stdio: 'ignore' }).unref();
  else if (process.platform === 'win32') spawn('explorer.exe', ['shell:AppsFolder\\Microsoft.4297127D64EC6_8wekyb3d8bbwe!Minecraft'], { detached: true, stdio: 'ignore' }).unref();
  else shell.openExternal('minecraft://');
  return { ok: true, profile: wrote > 0 };
});
// Windows notifications (clicking opens the link inside the app)
ipcMain.on('notify', (e, n) => {
  if (!trusted(e) || !Notification.isSupported()) return;
  if (win && win.isFocused() && !n.force) return;
  const note = new Notification({ title: String(n.title || 'Craft Hub').slice(0, 100), body: String(n.body || '').slice(0, 300), icon: path.join(__dirname, 'build', 'icon.png'), silent: false });
  note.on('click', () => {
    if (!win) return;
    if (win.isMinimized()) win.restore();
    win.show(); win.focus();
    if (n.link && /^\/[\w\-/?=&.%]*$/.test(n.link)) win.webContents.send('notif-click', n.link);
  });
  note.show();
});

// ---------- auto update (GitHub Releases) ----------
// A found update is shown as a bar at the bottom of the app. If it is not installed within
// UPDATE_GRACE_DAYS the app locks itself (blocked.html) until the user updates.
const UPDATE_GRACE_DAYS = 21;
const semverGt = (a, b) => {
  const pa = String(a).split(/[.-]/).map(n => parseInt(n, 10) || 0), pb = String(b).split(/[.-]/).map(n => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) { if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) > (pb[i] || 0); }
  return false;
};
let updateState = { available: false, version: '', downloaded: false, progress: 0, error: '' };
function pendingUpdate() {
  const p = readSettings().pendingUpdate;
  if (!p || !p.version || !semverGt(p.version, app.getVersion())) return null; // already on that version (or newer)
  const daysLeft = Math.max(0, Math.ceil(UPDATE_GRACE_DAYS - (Date.now() - p.seenAt) / 86400000));
  return { ...p, daysLeft, blocked: daysLeft <= 0 };
}
function publicUpdateState() {
  const p = pendingUpdate();
  return { ...updateState, available: !!p || updateState.available, version: (p && p.version) || updateState.version, daysLeft: p ? p.daysLeft : UPDATE_GRACE_DAYS, blocked: !!(p && p.blocked), current: app.getVersion() };
}
function pushUpdateState() { if (win && !win.isDestroyed()) win.webContents.send('update-state', publicUpdateState()); }
function enforceBlock() {
  const p = pendingUpdate();
  if (p && p.blocked && win && !win.isDestroyed() && !win.webContents.getURL().endsWith('blocked.html')) win.loadFile(path.join(__dirname, 'blocked.html'));
  return !!(p && p.blocked);
}
ipcMain.handle('update-state', e => {
  if (!trusted(e)) throw new Error('forbidden');
  return publicUpdateState();
});
ipcMain.handle('install-update', async e => {
  if (!trusted(e)) throw new Error('forbidden');
  if (updateState.downloaded) { setImmediate(() => autoUpdater.quitAndInstall(false, true)); return { ok: true }; }
  if (!app.isPackaged) return { ok: false, error: 'dev' };
  try { await autoUpdater.checkForUpdates(); return { ok: true, downloading: true }; } catch (err) { return { ok: false, error: err.message }; }
});
function setupUpdates() {
  // the lock also works offline and before the update server answers
  setInterval(enforceBlock, 60 * 60000);
  if (!app.isPackaged) return;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('update-available', info => {
    const s = readSettings();
    // the 3 weeks start the first time a given version is seen
    if (!s.pendingUpdate || s.pendingUpdate.version !== info.version) writeSettings({ ...s, pendingUpdate: { version: info.version, seenAt: (s.pendingUpdate && s.pendingUpdate.seenAt) || Date.now() } });
    updateState = { ...updateState, available: true, version: info.version, error: '' };
    pushUpdateState();
  });
  autoUpdater.on('download-progress', p => { updateState.progress = Math.round(p.percent || 0); pushUpdateState(); });
  autoUpdater.on('update-downloaded', info => { updateState = { ...updateState, available: true, version: info.version, downloaded: true, progress: 100 }; pushUpdateState(); });
  autoUpdater.on('update-not-available', () => {
    const s = readSettings();
    if (s.pendingUpdate && !semverGt(s.pendingUpdate.version, app.getVersion())) { delete s.pendingUpdate; writeSettings(s); }
    updateState = { ...updateState, available: false }; pushUpdateState();
  });
  autoUpdater.on('error', err => { updateState.error = err.message; pushUpdateState(); });
  autoUpdater.checkForUpdates().catch(() => { });
  setInterval(() => autoUpdater.checkForUpdates().catch(() => { }), 4 * 3600000);
}

// one window only
if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.whenReady().then(() => { createWindow(); setupUpdates(); });
  app.on('window-all-closed', () => app.quit());
}
