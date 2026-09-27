// Minecraft installer + launcher: versions (Vanilla / Fabric / Quilt / Forge / NeoForge), libraries, assets, Java, launch.
// Works on the user's .minecraft folder, so it shares files with the official launcher.
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const { spawn, execFile } = require('child_process');
const AdmZip = require('adm-zip');

const OS = process.platform === 'win32' ? 'windows' : process.platform === 'darwin' ? 'osx' : 'linux';
const ARCH = process.arch === 'x64' ? 'x86_64' : process.arch;
const SEP = process.platform === 'win32' ? ';' : ':';
const UA = 'CraftHubApp';
const ALLOWED_HOSTS = /(^|\.)(mojang\.com|minecraft\.net|piston-meta\.mojang\.com|piston-data\.mojang\.com|launchermeta\.mojang\.com|launcher\.mojang\.com|resources\.download\.minecraft\.net|libraries\.minecraft\.net|fabricmc\.net|quiltmc\.org|minecraftforge\.net|neoforged\.net|maven\.neoforged\.net|adoptium\.net|github\.com|githubusercontent\.com|objects\.githubusercontent\.com)$/i;

function get(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    if (u.protocol !== 'https:' || !ALLOWED_HOSTS.test(u.hostname)) return reject(new Error('blocked host ' + u.hostname));
    https.get(url, { headers: { 'User-Agent': UA } }, res => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 6) { res.resume(); return resolve(get(new URL(res.headers.location, url).toString(), redirects + 1)); }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`http ${res.statusCode} ${url}`)); }
      resolve(res);
    }).on('error', reject);
  });
}
async function getJson(url) {
  const res = await get(url);
  let raw = ''; res.setEncoding('utf8');
  for await (const c of res) raw += c;
  return JSON.parse(raw);
}
const sha1File = f => crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex');
function fileOk(f, size, sha1) {
  try {
    const st = fs.statSync(f);
    if (size && st.size !== size) return false;
    if (sha1 && st.size < 50 * 1048576 && sha1File(f) !== sha1) return false;
    return st.size > 0 || size === 0;
  } catch { return false; }
}
async function downloadTo(url, dest, onBytes) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await get(url);
  const tmp = dest + '.part';
  await new Promise((resolve, reject) => {
    const out = fs.createWriteStream(tmp);
    res.on('data', c => onBytes && onBytes(c.length));
    res.pipe(out); out.on('finish', resolve); out.on('error', reject); res.on('error', reject);
  });
  fs.renameSync(tmp, dest);
}
// run many downloads, a few at a time, with retries
async function downloadAll(jobs, onProgress, concurrency = 12) {
  let done = 0, i = 0;
  const total = jobs.length;
  const worker = async () => {
    while (i < jobs.length) {
      const j = jobs[i++];
      for (let attempt = 0; ; attempt++) {
        try { await downloadTo(j.url, j.path); if (j.sha1 && sha1File(j.path) !== j.sha1) throw new Error('bad hash'); break; }
        catch (err) { if (attempt >= 2) throw new Error(`download failed: ${j.url} (${err.message})`); await new Promise(r => setTimeout(r, 800)); }
      }
      done++; onProgress(done, total);
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, worker));
}

function rulesAllow(rules, features = {}) {
  if (!rules || !rules.length) return true;
  let allow = false;
  for (const r of rules) {
    let match = true;
    if (r.os) {
      if (r.os.name && r.os.name !== OS) match = false;
      if (r.os.arch === 'x86' && process.arch !== 'ia32') match = false;
    }
    if (r.features) for (const [k, v] of Object.entries(r.features)) if (!!features[k] !== v) match = false;
    if (match) allow = r.action === 'allow';
  }
  return allow;
}
// "group:artifact:version[:classifier]" → group/path/artifact/version/artifact-version[-classifier].jar
function mavenPath(name) {
  const [g, a, v, cl] = name.split('@')[0].split(':');
  const ext = name.includes('@') ? name.split('@')[1] : 'jar';
  return `${g.replace(/\./g, '/')}/${a}/${v}/${a}-${v}${cl ? '-' + cl : ''}.${ext}`;
}

class Launcher {
  constructor({ root, runtimeDir, log }) { this.root = root; this.runtimeDir = runtimeDir; this.log = log || (() => { }); }
  p(...a) { return path.join(this.root, ...a); }

  // ---------- versions ----------
  async manifest() {
    if (!this._manifest || Date.now() - this._manifestAt > 3600000) { this._manifest = await getJson('https://piston-meta.mojang.com/mc/game/version_manifest_v2.json'); this._manifestAt = Date.now(); }
    return this._manifest;
  }
  async releases() { return (await this.manifest()).versions.filter(v => v.type === 'release').map(v => v.id); }
  async versionJson(id) {
    const f = this.p('versions', id, id + '.json');
    if (!fs.existsSync(f)) {
      const entry = (await this.manifest()).versions.find(v => v.id === id);
      if (!entry) throw new Error('unknown_version ' + id);
      await downloadTo(entry.url, f);
    }
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  }
  // version json with its parent (inheritsFrom) merged in
  async resolved(id) {
    const v = await this.versionJson(id);
    if (!v.inheritsFrom) return v;
    const parent = await this.resolved(v.inheritsFrom);
    const merged = { ...parent, ...v, id: v.id };
    merged.libraries = [...(v.libraries || []), ...(parent.libraries || [])];
    merged.jarId = parent.jarId || parent.id;
    if (parent.arguments || v.arguments) merged.arguments = { game: [...((parent.arguments || {}).game || []), ...((v.arguments || {}).game || [])], jvm: [...((parent.arguments || {}).jvm || []), ...((v.arguments || {}).jvm || [])] };
    if (v.minecraftArguments) merged.minecraftArguments = v.minecraftArguments;
    merged.assetIndex = parent.assetIndex; merged.assets = parent.assets; merged.downloads = parent.downloads; merged.javaVersion = v.javaVersion || parent.javaVersion;
    return merged;
  }

  // ---------- mod loaders ----------
  async installFabricLike(loader, mc) {
    const base = loader === 'quilt' ? 'https://meta.quiltmc.org/v3' : 'https://meta.fabricmc.net/v2';
    const loaders = await getJson(`${base}/versions/loader/${encodeURIComponent(mc)}`);
    const pick = loaders.find(l => (l.loader || {}).stable !== false) || loaders[0];
    if (!pick) throw new Error('no_loader');
    const prof = await getJson(`${base}/versions/loader/${encodeURIComponent(mc)}/${encodeURIComponent(pick.loader.version)}/profile/json`);
    const f = this.p('versions', prof.id, prof.id + '.json');
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, JSON.stringify(prof, null, 2));
    await this.versionJson(mc);
    return prof.id;
  }
  async forgeVersion(loader, mc) {
    if (loader === 'forge') {
      const promos = (await getJson('https://files.minecraftforge.net/net/minecraftforge/forge/promotions_slim.json')).promos;
      const v = promos[`${mc}-recommended`] || promos[`${mc}-latest`];
      if (!v) throw new Error('no_forge_for ' + mc);
      return { v: `${mc}-${v}`, url: `https://maven.minecraftforge.net/net/minecraftforge/forge/${mc}-${v}/forge-${mc}-${v}-installer.jar` };
    }
    // NeoForge: 1.21.1 → 21.1.x, 1.21 → 21.0.x
    const [, minor, patch = '0'] = mc.split('.');
    const prefix = `${minor}.${patch}.`;
    const list = (await getJson('https://maven.neoforged.net/api/maven/versions/releases/net/neoforged/neoforge')).versions || [];
    const v = list.filter(x => x.startsWith(prefix) && !/beta|alpha/i.test(x)).pop() || list.filter(x => x.startsWith(prefix)).pop();
    if (!v) throw new Error('no_neoforge_for ' + mc);
    return { v, url: `https://maven.neoforged.net/releases/net/neoforged/neoforge/${v}/neoforge-${v}-installer.jar` };
  }
  // Forge / NeoForge ship an installer that builds the version itself; it runs headless with our Java
  async installForgeLike(loader, mc, onStatus) {
    const { url } = await this.forgeVersion(loader, mc);
    const vanilla = await this.versionJson(mc);
    const java = await this.ensureJava(((vanilla.javaVersion || {}).majorVersion) || 21, onStatus);
    const inst = path.join(this.runtimeDir, 'installers', path.basename(url));
    onStatus({ stage: 'loader' });
    if (!fs.existsSync(inst)) await downloadTo(url, inst);
    const lp = this.p('launcher_profiles.json');
    if (!fs.existsSync(lp)) fs.writeFileSync(lp, JSON.stringify({ profiles: {} }));
    const before = new Set(fs.existsSync(this.p('versions')) ? fs.readdirSync(this.p('versions')) : []);
    const run = flag => new Promise((resolve, reject) => execFile(java, ['-jar', inst, flag, this.root], { cwd: path.dirname(inst), timeout: 15 * 60000, maxBuffer: 64 * 1048576, windowsHide: true }, (err, so, se) => err ? reject(new Error((se || so || err.message).slice(-400))) : resolve()));
    try { await run('--installClient'); } catch (e1) { this.log('installClient failed, trying --install-client: ' + e1.message); await run('--install-client'); }
    const after = fs.readdirSync(this.p('versions')).filter(x => !before.has(x) && fs.existsSync(this.p('versions', x, x + '.json')));
    const id = after.find(x => new RegExp(loader, 'i').test(x)) || after[0];
    if (!id) throw new Error('installer_no_version');
    return id;
  }
  async installVersion(loader, mc, onStatus = () => { }) {
    if (loader === 'vanilla') { await this.versionJson(mc); return mc; }
    if (loader === 'fabric' || loader === 'quilt') return this.installFabricLike(loader, mc);
    if (loader === 'forge' || loader === 'neoforge') return this.installForgeLike(loader, mc, onStatus);
    throw new Error('bad_loader');
  }

  // ---------- Java (Eclipse Temurin from Adoptium) ----------
  javaExe(major) {
    const dir = path.join(this.runtimeDir, `java-${major}`);
    if (!fs.existsSync(dir)) return null;
    const find = d => { for (const n of fs.readdirSync(d)) { const f = path.join(d, n); if (fs.statSync(f).isDirectory()) { const x = path.join(f, 'bin', process.platform === 'win32' ? 'javaw.exe' : 'java'); if (fs.existsSync(x)) return x; } } return null; };
    const direct = path.join(dir, 'bin', process.platform === 'win32' ? 'javaw.exe' : 'java');
    return fs.existsSync(direct) ? direct : find(dir);
  }
  async ensureJava(major, onStatus = () => { }) {
    const have = this.javaExe(major);
    if (have) return have.replace(/javaw\.exe$/, 'java.exe');
    onStatus({ stage: 'java', major });
    const os = process.platform === 'win32' ? 'windows' : process.platform === 'darwin' ? 'mac' : 'linux';
    const arch = process.arch === 'arm64' ? 'aarch64' : 'x64';
    const url = `https://api.adoptium.net/v3/binary/latest/${major}/ga/${os}/${arch}/jre/hotspot/normal/eclipse`;
    const zip = path.join(this.runtimeDir, `java-${major}.download`);
    let got = 0;
    await downloadTo(url, zip, n => { got += n; onStatus({ stage: 'java', major, bytes: got }); });
    const dir = path.join(this.runtimeDir, `java-${major}`);
    if (process.platform === 'win32') new AdmZip(zip).extractAllTo(dir, true);
    else await new Promise((res, rej) => execFile('tar', ['-xzf', zip, '-C', (fs.mkdirSync(dir, { recursive: true }), dir)], e => e ? rej(e) : res()));
    fs.rmSync(zip, { force: true });
    const exe = this.javaExe(major);
    if (!exe) throw new Error('java_install_failed');
    return exe.replace(/javaw\.exe$/, 'java.exe');
  }

  // ---------- game files ----------
  async prepare(id, onStatus = () => { }) {
    const v = await this.resolved(id);
    const jobs = [];
    const libs = [], natives = [];
    for (const lib of v.libraries || []) {
      if (!rulesAllow(lib.rules)) continue;
      const d = lib.downloads || {};
      if (d.artifact && d.artifact.url) {
        const f = this.p('libraries', d.artifact.path);
        if (!fileOk(f, d.artifact.size, d.artifact.sha1)) jobs.push({ url: d.artifact.url, path: f, sha1: d.artifact.sha1 });
        libs.push(f);
      } else if (d.artifact && !d.artifact.url) {
        libs.push(this.p('libraries', d.artifact.path)); // made by the Forge installer
      } else if (!d.artifact && !lib.natives && lib.name) {
        const rel = mavenPath(lib.name);
        const f = this.p('libraries', rel);
        if (!fs.existsSync(f)) jobs.push({ url: (lib.url || 'https://libraries.minecraft.net/').replace(/\/?$/, '/') + rel, path: f });
        libs.push(f);
      }
      // old style natives: a classifier jar that gets unzipped next to the game
      if (lib.natives && lib.natives[OS]) {
        const key = lib.natives[OS].replace('${arch}', process.arch === 'x64' ? '64' : '32');
        const c = d.classifiers && d.classifiers[key];
        if (c) { const f = this.p('libraries', c.path); if (!fileOk(f, c.size, c.sha1)) jobs.push({ url: c.url, path: f, sha1: c.sha1 }); natives.push(f); }
      }
      if (lib.name && /:natives-/.test(lib.name) && d.artifact) natives.push(this.p('libraries', d.artifact.path));
    }
    // the game jar
    const jarId = v.jarId || v.id;
    const jar = this.p('versions', jarId, jarId + '.jar');
    const cd = (v.downloads || {}).client;
    if (cd && !fileOk(jar, cd.size, cd.sha1)) jobs.push({ url: cd.url, path: jar, sha1: cd.sha1 });
    // assets
    const ai = v.assetIndex;
    const idxFile = this.p('assets', 'indexes', ai.id + '.json');
    if (!fileOk(idxFile, ai.size, ai.sha1)) await downloadTo(ai.url, idxFile);
    const index = JSON.parse(fs.readFileSync(idxFile, 'utf8'));
    for (const o of Object.values(index.objects || {})) {
      const f = this.p('assets', 'objects', o.hash.slice(0, 2), o.hash);
      if (!fileOk(f, o.size)) jobs.push({ url: `https://resources.download.minecraft.net/${o.hash.slice(0, 2)}/${o.hash}`, path: f, sha1: o.hash });
    }
    onStatus({ stage: 'files', done: 0, total: jobs.length });
    if (jobs.length) await downloadAll(jobs, (done, total) => onStatus({ stage: 'files', done, total }));
    // unpack natives
    const nativesDir = this.p('versions', v.id, 'natives');
    fs.mkdirSync(nativesDir, { recursive: true });
    for (const f of natives) {
      try {
        for (const en of new AdmZip(f).getEntries()) {
          if (en.isDirectory || en.entryName.startsWith('META-INF') || !/\.(dll|so|dylib|jnilib)$/i.test(en.entryName)) continue;
          const out = path.join(nativesDir, path.basename(en.entryName));
          if (!fs.existsSync(out)) fs.writeFileSync(out, en.getData());
        }
      } catch (e) { this.log('natives: ' + e.message); }
    }
    return { v, libs: [...new Set(libs)], jar, nativesDir };
  }

  // ---------- launch ----------
  buildArgs({ v, libs, jar, nativesDir }, account, opts) {
    const cp = [...libs.filter(f => fs.existsSync(f)), jar].join(SEP);
    const vars = {
      auth_player_name: account.name, version_name: v.id, game_directory: this.root, assets_root: this.p('assets'), game_assets: this.p('assets'),
      assets_index_name: v.assetIndex.id, auth_uuid: account.uuid, auth_access_token: account.accessToken, auth_session: account.accessToken, clientid: account.clientId || '',
      auth_xuid: account.xuid || '', user_type: 'msa', version_type: v.type || 'release', natives_directory: nativesDir, launcher_name: 'CraftHub', launcher_version: opts.appVersion || '1',
      classpath: cp, library_directory: this.p('libraries'), classpath_separator: SEP, user_properties: '{}', quickPlayPath: '', resolution_width: '1280', resolution_height: '720'
    };
    const sub = s => String(s).replace(/\$\{(\w+)\}/g, (m, k) => vars[k] !== undefined ? vars[k] : m);
    const flat = list => {
      const out = [];
      for (const a of list || []) {
        if (typeof a === 'string') out.push(sub(a));
        else if (rulesAllow(a.rules, {})) for (const x of [].concat(a.value)) out.push(sub(x));
      }
      return out;
    };
    const jvm = [`-Xmx${opts.ramMB || 4096}M`, `-Xms${Math.min(1024, opts.ramMB || 4096)}M`, '-XX:+UseG1GC', '-Dfml.ignoreInvalidMinecraftCertificates=true'];
    let game;
    if (v.arguments) { jvm.push(...flat(v.arguments.jvm)); game = flat(v.arguments.game); }
    else { jvm.push(`-Djava.library.path=${nativesDir}`, '-cp', cp); game = sub(v.minecraftArguments || '').split(' ').filter(Boolean); }
    if (!jvm.includes('-cp')) jvm.push('-cp', cp);
    if (opts.server) game.push('--server', opts.server.split(':')[0], '--port', opts.server.split(':')[1] || '25565');
    return [...jvm, v.mainClass, ...game];
  }
  async launch(id, account, opts = {}, onStatus = () => { }) {
    const prepared = await this.prepare(id, onStatus);
    const major = ((prepared.v.javaVersion || {}).majorVersion) || 8;
    const java = (await this.ensureJava(major, onStatus)).replace(/java\.exe$/, 'javaw.exe');
    const args = this.buildArgs(prepared, account, opts);
    if (opts.dryRun) return { java, args };
    onStatus({ stage: 'starting' });
    const logFile = path.join(this.runtimeDir, 'latest-game.log');
    const out = fs.openSync(logFile, 'w');
    const child = spawn(java, args, { cwd: this.root, detached: true, stdio: ['ignore', out, out], windowsHide: false });
    child.unref();
    return { pid: child.pid, logFile, child };
  }
}
module.exports = { Launcher, rulesAllow, mavenPath };
