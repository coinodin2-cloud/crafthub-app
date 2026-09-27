// Development self-test (not shipped). Runs the app against a local site with a fake .minecraft folder.
//   SELFTEST_MODE=install  → installs SELFTEST_SLUG, checks the play page, mods toggle, Fabric install, launcher profile
//   SELFTEST_MODE=block    → pretends an update was ignored for 22 days and checks that the app locks
const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const MC = process.env.SELFTEST_MC, MODE = process.env.SELFTEST_MODE || 'install';
app.setName('Craft Hub Selftest');
app.whenReady().then(() => {
  const settings = path.join(app.getPath('userData'), 'settings.json');
  fs.mkdirSync(path.dirname(settings), { recursive: true });
  const s = { mcDir: MC };
  if (MODE === 'block') s.pendingUpdate = { version: '99.0.0', seenAt: Date.now() - Number(process.env.SELFTEST_DAYS || 22) * 86400000 };
  fs.writeFileSync(settings, JSON.stringify(s));
});
const shot = (win, name) => win.webContents.capturePage().then(img => fs.writeFileSync(path.join(MC, name), img.toPNG()));
app.on('browser-window-created', (e, win) => {
  win.webContents.once('did-finish-load', async () => {
    try {
      await new Promise(r => setTimeout(r, 3000));
      if (MODE === 'block') {
        console.log('SELFTEST ' + JSON.stringify({ url: win.webContents.getURL().replace(/^.*\//, ''), text: await win.webContents.executeJavaScript('document.body.innerText.slice(0,200)') }));
        await shot(win, 'blocked.png');
        return app.quit();
      }
      const res = await win.webContents.executeJavaScript(`(async () => {
        const out = {};
        out.install = (await window.craftHubApp.install({ slug: ${JSON.stringify(process.env.SELFTEST_SLUG)}, type: 'resourcepack', name: 'test' })).ok;
        out.versions = (await window.craftHubApp.mcVersions()).versions.map(v => v.id + ':' + v.loader);
        out.mods = (await window.craftHubApp.modsList()).map(m => m.name + ':' + m.enabled);
        out.toggle = (await window.craftHubApp.modsToggle('sodium.jar')).file;
        out.gameVersions = (await window.craftHubApp.loaderGameVersions('fabric')).slice(0, 3);
        out.fabric = (await window.craftHubApp.installLoader({ loader: 'fabric', mc: '1.21.4' })).id;
        out.launch = await window.craftHubApp.launch('1.21.4');
        out.badLaunch = await window.craftHubApp.launch('../../windows');
        history.pushState({}, '', '/app'); route();
        await new Promise(r => setTimeout(r, 3500));
        out.nav = [...document.querySelectorAll('.navlinks a')].map(a => a.textContent.trim()).slice(0, 3);
        out.page = document.querySelector('#app').innerText.slice(0, 400);
        return out;
      })()`);
      console.log('SELFTEST ' + JSON.stringify(res, null, 1));
      await shot(win, 'play.png');
    } catch (err) { console.log('SELFTEST ERROR ' + err.message); }
    app.quit();
  });
});
require('./main.js');
