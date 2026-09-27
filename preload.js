// The bridge between the app's interface (app/) and the computer / crafthubs.net API.
const { contextBridge, ipcRenderer } = require('electron');

const listeners = new Set();
const updListeners = new Set();
ipcRenderer.on('update-state', (e, st) => updListeners.forEach(fn => { try { fn(st); } catch { } }));
ipcRenderer.on('install-progress', (e, data) => listeners.forEach(fn => { try { fn(data); } catch { } }));

contextBridge.exposeInMainWorld('craftHubApp', {
  isApp: true,
  site: ipcRenderer.sendSync('site-url'),
  api: (path, opts = {}) => ipcRenderer.invoke('api', { path, method: opts.method, body: opts.body }),
  login: () => ipcRenderer.invoke('login'),
  logout: () => ipcRenderer.invoke('logout'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  openSiteWindow: (p) => ipcRenderer.invoke('open-site-window', p),
  onNotificationClick: (fn) => ipcRenderer.on('notif-click', (e, link) => fn(link)),
  platform: process.platform,
  install: (opts) => ipcRenderer.invoke('install', opts),
  uninstall: (opts) => ipcRenderer.invoke('uninstall', opts),
  installed: () => ipcRenderer.invoke('installed'),
  settings: () => ipcRenderer.invoke('settings'),
  chooseDir: (which) => ipcRenderer.invoke('choose-dir', which),
  openFolder: (type) => ipcRenderer.invoke('open-folder', type),
  checkUpdate: () => ipcRenderer.invoke('check-update'),
  retry: () => ipcRenderer.send('offline-retry'),
  mcVersions: () => ipcRenderer.invoke('mc-versions'),
  modsList: () => ipcRenderer.invoke('mods-list'),
  modsToggle: (file) => ipcRenderer.invoke('mods-toggle', file),
  loaderGameVersions: (loader) => ipcRenderer.invoke('loader-game-versions', loader),
  installLoader: (opts) => ipcRenderer.invoke('install-loader', opts),
  launch: (versionId) => ipcRenderer.invoke('launch', versionId),
  notify: (n) => ipcRenderer.send('notify', n),
  updateState: () => ipcRenderer.invoke('update-state'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  onUpdateState: (fn) => { updListeners.add(fn); return () => updListeners.delete(fn); },
  onProgress: (fn) => { listeners.add(fn); return () => listeners.delete(fn); }
});
