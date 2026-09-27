// Development self-test (not shipped). Opens the app against a local site with a fake .minecraft,
// walks through every screen, installs a project and saves screenshots to SELFTEST_MC.
const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const MC = process.env.SELFTEST_MC, MODE = process.env.SELFTEST_MODE || 'tour';
app.setName('Craft Hub Selftest');
app.whenReady().then(() => {
  const settings = path.join(app.getPath('userData'), 'settings.json');
  fs.mkdirSync(path.dirname(settings), { recursive: true });
  const s = { mcDir: MC };
  if (MODE === 'block') s.pendingUpdate = { version: '99.0.0', seenAt: Date.now() - Number(process.env.SELFTEST_DAYS || 22) * 86400000 };
  fs.writeFileSync(settings, JSON.stringify(s));
});
const wait = ms => new Promise(r => setTimeout(r, ms));
const shot = (win, name) => win.webContents.capturePage().then(img => fs.writeFileSync(path.join(MC, name), img.toPNG()));
app.on('browser-window-created', (e, win) => {
  if (win.getParentWindow()) return; // login popup
  win.webContents.once('did-finish-load', async () => {
    try {
      await wait(3500);
      const js = code => win.webContents.executeJavaScript(code);
      if (MODE === 'block') { console.log('SELFTEST ' + JSON.stringify({ url: win.webContents.getURL().replace(/^.*\//, ''), bar: await js("(document.querySelector('#updBar') && !document.querySelector('#updBar').hidden) ? document.querySelector('#updBar').innerText : ''") })); await shot(win, 'block.png'); return app.quit(); }
      const out = {};
      await shot(win, '1-home.png');
      out.home = await js("document.querySelector('#view').innerText.slice(0,160)");
      await js("go('discover', { type: 'resourcepack' })"); await wait(1500); await shot(win, '2-discover.png');
      out.discover = await js("document.querySelectorAll('.pcard').length");
      await js(`go('project', { slug: ${JSON.stringify(process.env.SELFTEST_SLUG)} })`); await wait(2000);
      out.projectBtn = await js("document.querySelector('[data-inst]') && document.querySelector('[data-inst]').innerText");
      await js("document.querySelector('[data-inst]').click()"); await wait(3000); await shot(win, '3-project.png');
      out.afterInstall = await js("document.querySelector('[data-inst]') && document.querySelector('[data-inst]').innerText");
      await js("go('library')"); await wait(1500); await shot(win, '4-library.png');
      out.library = await js("document.querySelector('#view').innerText.slice(0,200)");
      await js("go('play')"); await wait(2500); await shot(win, '5-play.png');
      await js("go('servers')"); await wait(1500); await shot(win, '6-servers.png');
      out.servers = await js("document.querySelectorAll('.srv').length");
      await js("document.querySelector('.srv') && document.querySelector('.srv').click()"); await wait(2000); await shot(win, '7-server.png');
      await js("go('settings')"); await wait(1200); await shot(win, '8-settings.png');
      out.apiBlocked = await js("window.craftHubApp.api('/auth/../etc').then(r => r.status)");
      out.errors = await js('window.__errs || []');
      console.log('SELFTEST ' + JSON.stringify(out, null, 1));
    } catch (err) { console.log('SELFTEST ERROR ' + err.message); }
    app.quit();
  });
  win.webContents.on('console-message', (e, level, msg) => { if (level >= 3) console.log('CONSOLE ERROR ' + msg); });
});
require('./main.js');
