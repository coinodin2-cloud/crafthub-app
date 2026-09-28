// Builds the installer and publishes it as a GitHub release that installed apps update from.
// Usage: bump "version" in package.json, then:  npm run release
// Needs the GitHub CLI logged in (gh auth login).
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const { owner, repo } = pkg.build.publish[0];
const version = pkg.version, tag = `v${version}`;
// what people see (e.g. "1.0.0 Beta"); the real version above only has to keep going up so updates work
const label = pkg.displayVersion || version;
const gh = process.platform === 'win32' && fs.existsSync('C:\\Program Files\\GitHub CLI\\gh.exe') ? 'C:\\Program Files\\GitHub CLI\\gh.exe' : 'gh';
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { cwd: root, stdio: 'inherit', shell: cmd === 'npx', ...opts });

try { execFileSync(gh, ['release', 'view', tag, '--repo', `${owner}/${repo}`], { stdio: 'ignore' }); console.error(`✗ ${tag} already exists — bump "version" in package.json first`); process.exit(1); } catch { /* good: new version */ }

console.log(`▶ building ${tag}`);
// each release builds into its own folder, so a running copy of the app never blocks it
const outDir = path.join(root, 'release', version);
fs.rmSync(outDir, { recursive: true, force: true });
run('npx', ['electron-builder', '--win', '--publish', 'never', '-c.directories.output=' + path.relative(root, outDir)]);

const exeName = `CraftHubSetup-${version}.exe`;
const exe = path.join(outDir, exeName);
const buf = fs.readFileSync(exe);
const sha512 = crypto.createHash('sha512').update(buf).digest('base64');
const latest = path.join(outDir, 'latest.yml');
fs.writeFileSync(latest, `version: ${version}\nfiles:\n  - url: ${exeName}\n    sha512: ${sha512}\n    size: ${buf.length}\npath: ${exeName}\nsha512: ${sha512}\nreleaseName: '${label.replace(/'/g, '')}'\nreleaseDate: '${new Date().toISOString()}'\n`);

const notes = process.argv.slice(2).join(' ') || `Craft Hub ${version}`;
console.log(`▶ publishing ${tag} to ${owner}/${repo}`);
run(gh, ['release', 'create', tag, exe, `${exe}.blockmap`, latest, '--repo', `${owner}/${repo}`, '--title', `Craft Hub ${label}`, '--notes', notes, '--latest']);
console.log(`✓ done — installed apps will offer ${tag} within a few hours`);
