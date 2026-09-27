// Microsoft → Xbox Live → XSTS → Minecraft sign-in (device-code flow: the user approves in their browser).
// Needs an Azure app registration (public client, personal accounts) that Mojang approved for the Minecraft API.
const https = require('https');

function request(url, { method = 'GET', headers = {}, body, form } = {}) {
  return new Promise((resolve, reject) => {
    const data = form ? new URLSearchParams(form).toString() : body !== undefined ? JSON.stringify(body) : null;
    const req = https.request(url, {
      method,
      headers: { Accept: 'application/json', ...(data ? { 'Content-Type': form ? 'application/x-www-form-urlencoded' : 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}), ...headers }
    }, res => {
      let raw = '';
      res.setEncoding('utf8');
      res.on('data', c => { raw += c; });
      res.on('end', () => { let json = null; try { json = raw ? JSON.parse(raw) : null; } catch { } resolve({ status: res.statusCode, json, raw }); });
    });
    req.on('error', reject);
    req.setTimeout(20000, () => req.destroy(new Error('timeout')));
    if (data) req.write(data);
    req.end();
  });
}
const MS = 'https://login.microsoftonline.com/consumers/oauth2/v2.0';
const SCOPE = 'XboxLive.signin offline_access';

// step 1: a short code the user types at microsoft.com/link
async function startDeviceLogin(clientId) {
  const r = await request(`${MS}/devicecode`, { method: 'POST', form: { client_id: clientId, scope: SCOPE } });
  if (r.status !== 200) throw new Error(r.json && r.json.error_description ? r.json.error_description.split('\r\n')[0] : 'device_code_failed');
  return { userCode: r.json.user_code, verificationUri: r.json.verification_uri, deviceCode: r.json.device_code, interval: r.json.interval || 5, expiresIn: r.json.expires_in || 900 };
}
// step 2: wait until the user approved, returns Microsoft tokens
async function pollDeviceLogin(clientId, dev, isCancelled = () => false) {
  const until = Date.now() + dev.expiresIn * 1000;
  let wait = dev.interval * 1000;
  while (Date.now() < until) {
    await new Promise(r => setTimeout(r, wait));
    if (isCancelled()) throw new Error('cancelled');
    const r = await request(`${MS}/token`, { method: 'POST', form: { grant_type: 'urn:ietf:params:oauth:grant-type:device_code', client_id: clientId, device_code: dev.deviceCode } });
    if (r.status === 200) return r.json;
    const err = r.json && r.json.error;
    if (err === 'authorization_pending') continue;
    if (err === 'slow_down') { wait += 5000; continue; }
    throw new Error(err || 'login_failed');
  }
  throw new Error('expired');
}
async function refreshMicrosoft(clientId, refreshToken) {
  const r = await request(`${MS}/token`, { method: 'POST', form: { grant_type: 'refresh_token', client_id: clientId, refresh_token: refreshToken, scope: SCOPE } });
  if (r.status !== 200) throw new Error('refresh_failed');
  return r.json;
}
// step 3: Microsoft token → Minecraft token + profile
async function minecraftLogin(msAccessToken) {
  const xbl = await request('https://user.auth.xboxlive.com/user/authenticate', { method: 'POST', body: { Properties: { AuthMethod: 'RPS', SiteName: 'user.auth.xboxlive.com', RpsTicket: `d=${msAccessToken}` }, RelyingParty: 'http://auth.xboxlive.com', TokenType: 'JWT' } });
  if (xbl.status !== 200) throw new Error('xbox_failed');
  const uhs = xbl.json.DisplayClaims.xui[0].uhs;
  const xsts = await request('https://xsts.auth.xboxlive.com/xsts/authorize', { method: 'POST', body: { Properties: { SandboxId: 'RETAIL', UserTokens: [xbl.json.Token] }, RelyingParty: 'rp://api.minecraftservices.com/', TokenType: 'JWT' } });
  if (xsts.status !== 200) {
    const code = xsts.json && xsts.json.XErr;
    throw new Error(code === 2148916233 ? 'no_xbox_account' : code === 2148916238 ? 'child_account' : code === 2148916235 ? 'xbox_region' : 'xsts_failed');
  }
  const mc = await request('https://api.minecraftservices.com/authentication/login_with_xbox', { method: 'POST', body: { identityToken: `XBL3.0 x=${uhs};${xsts.json.Token}` } });
  if (mc.status === 403) throw new Error('app_not_approved');
  if (mc.status !== 200) throw new Error('minecraft_login_failed');
  const token = mc.json.access_token;
  const prof = await request('https://api.minecraftservices.com/minecraft/profile', { headers: { Authorization: `Bearer ${token}` } });
  if (prof.status === 404) throw new Error('no_minecraft');
  if (prof.status !== 200) throw new Error('profile_failed');
  const skin = (prof.json.skins || []).find(s => s.state === 'ACTIVE');
  return { accessToken: token, expiresAt: Date.now() + (mc.json.expires_in || 86400) * 1000, uuid: prof.json.id, name: prof.json.name, xuid: (xbl.json.DisplayClaims.xui[0].xid) || '', skin: skin ? skin.url : '' };
}
module.exports = { startDeviceLogin, pollDeviceLogin, refreshMicrosoft, minecraftLogin };
