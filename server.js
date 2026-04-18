const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
// Railway requires listening on PORT env var
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Admin from env (Railway persistent) or fallback
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const ADMIN_HASH = process.env.ADMIN_HASH || bcrypt.hashSync(ADMIN_PASS, 10);
let data = { users: [], scores: {}, admins: [{username:ADMIN_USER, passwordHash:ADMIN_HASH, token:''}], tokens: {} };

function loadDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      if (!data.tokens) data.tokens = {};
      console.log('[DB] Loaded from', DB_FILE);
    } catch(e) {
      console.log('[DB] Load error:', e.message);
      data = { users: [], scores: {}, admins: [], tokens: {} };
    }
  } else {
    data = { users: [], scores: {}, admins: [], tokens: {} };
    saveDB();
    console.log('[DB] Created new DB');
  }
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 0), 'utf8');
  } catch(e) {
    console.error('[DB] Save error:', e.message);
  }
}

process.on('SIGTERM', () => { saveDB(); process.exit(0); });
process.on('SIGINT', () => { saveDB(); process.exit(0); });

loadDB();
const defaultAdmin = data.admins.find(a => a.username === 'admin');
if (!defaultAdmin) {
  data.admins.push({ id: 1, username: 'admin', passwordHash: bcrypt.hashSync('admin123', 10) });
  saveDB();
}

function isValidPhone(p) { return /^1[3-9]\d{9}$/.test(p); }
function isValidPassword(p) { return p && p.length >= 6; }

function maskName(name) {
  if (!name || name.length < 2) return '*';
  if (name.length === 2) return name[0] + '*';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

function calcChicks(stars) {
  // 与前端一致：RESCUE_LEVELS = [2,5,8,11,14,17,20,23,26,29]，每3关救1只
  // 对应的starsPerLevel索引处有3星才算救回
  const RESCUE = [2,5,8,11,14,17,20,23,26,29];
  if (!Array.isArray(stars)) return 0;
  let count = 0;
  RESCUE.forEach(idx => { if (stars[idx] >= 3) count++; });
  return Math.min(count, 10);
}

function calcTotalStars(userId) {
  const s = data.scores[userId];
  if (!s || !Array.isArray(s.stars)) return 0;
  return s.stars.reduce((a, b) => a + (b || 0), 0);
}

function updateScore(userId, starsPerLevel) {
  if (!data.scores[userId]) data.scores[userId] = { stars: [], totalStars: 0, totalChicks: 0 };
  const score = data.scores[userId];
  starsPerLevel.forEach((v, i) => {
    if (!score.stars[i] || v > score.stars[i]) score.stars[i] = v;
  });
  score.totalStars = calcTotalStars(userId);
  score.totalChicks = calcChicks(score.stars);
  score.updatedAt = new Date().toISOString();
  saveDB();
  return { totalStars: score.totalStars, totalChicks: score.totalChicks };
}

function getUser(id) { return data.users.find(u => u.id === id); }
function getScore(userId) { return data.scores[userId] || { stars: [], totalStars: 0, totalChicks: 0 }; }

function getTopScores(limit) {
  return Object.entries(data.scores)
    .map(([uid, s]) => {
      const u = getUser(parseInt(uid));
      if (!u) return null;
      return { userId: parseInt(uid), name: maskName(u.name), school: u.school,
               totalStars: s.totalStars, totalChicks: s.totalChicks };
    })
    .filter(Boolean)
    .sort((a, b) => b.totalStars - a.totalStars)
    .slice(0, limit);
}

function makeToken(userId) {
  const token = crypto.randomBytes(24).toString('hex');
  data.tokens[token] = { userId, createdAt: Date.now() };
  saveDB();
  return token;
}

function verifyToken(token) {
  if (!token || !data.tokens[token]) return null;
  const t = data.tokens[token];
  if (Date.now() - t.createdAt > 30 * 24 * 60 * 60 * 1000) {
    delete data.tokens[token];
    return null;
  }
  return t.userId;
}

function getUserIdFromReq(req) {
  const auth = req.headers['authorization'] || req.headers['x-token'] || '';
  const token = auth.replace('Bearer ', '').replace('bearer ', '');
  if (!token) return null;
  return verifyToken(token);
}

const limiter = require('express-rate-limit')({
  windowMs: 60 * 1000, max: 60,
  message: { success: false, error: 'request too fast' }
});

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization', 'x-token'] }));
app.use(express.json({ limit: '1mb' }));
app.use(limiter);
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ==================== API ====================

// Health check for Railway
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), version: '2.0' });
});

// Register: phone + password (auto-login for existing users)
app.post('/api/register', (req, res) => {
  const { phone, password, name, school, birthdate } = req.body || {};
  if (!isValidPhone(phone)) return res.json({ success: false, error: 'phone format wrong' });
  if (!isValidPassword(password)) return res.json({ success: false, error: 'password min 6 chars' });
  if (!name || name.trim().length < 2) return res.json({ success: false, error: 'name min 2 chars' });

  const existing = data.users.find(u => u.phone === phone);
  if (existing) {
    // Existing user: login only (password needed)
    if (!bcrypt.compareSync(password, existing.passwordHash))
      return res.json({ success: false, error: 'password wrong' });
    const token = makeToken(existing.id);
    const score = getScore(existing.id);
    saveDB();
    console.log(`[LOGIN] ${existing.name} (${phone})`);
    return res.json({
      success: true, isNew: false, token,
      user: { id: existing.id, phone: existing.phone, name: maskName(existing.name),
               school: existing.school, totalStars: score.totalStars, totalChicks: score.totalChicks }
    });
  }

  // New user: register
  const userId = data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1;
  const user = {
    id: userId, phone, name: name.trim(),
    passwordHash: bcrypt.hashSync(password, 10),
    school: school ? school.trim() : '',
    birthdate: birthdate || '',
    createdAt: new Date().toISOString()
  };
  data.users.push(user);
  data.scores[userId] = { stars: [], totalStars: 0, totalChicks: 0 };
  const token = makeToken(userId);
  saveDB();
  console.log(`[REG] ${name} (${phone})`);
  res.json({
    success: true, isNew: true, token,
    user: { id: userId, phone, name: maskName(name), school: user.school, totalStars: 0, totalChicks: 0, starsPerLevel: [] }
  });
});

// Login: phone + password
app.post('/api/login', (req, res) => {
  const { phone, password } = req.body || {};
  if (!isValidPhone(phone)) return res.json({ success: false, error: 'phone format wrong' });
  if (!password) return res.json({ success: false, error: 'password required' });
  const user = data.users.find(u => u.phone === phone);
  if (!user) return res.json({ success: false, error: 'user not found, please register first' });
  if (!user.passwordHash || !bcrypt.compareSync(password, user.passwordHash))
    return res.json({ success: false, error: 'password wrong' });
  const token = makeToken(user.id);
  const score = getScore(user.id);
  saveDB();
  console.log(`[LOGIN] ${user.name} (${phone})`);
  res.json({
    success: true, token,
    user: { id: user.id, phone: user.phone, name: maskName(user.name),
             school: user.school, totalStars: score.totalStars, totalChicks: score.totalChicks,
             starsPerLevel: (score && score.stars) ? score.stars : [] }
  });
});

// Get current user
app.get('/api/me', (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.json({ success: false, error: 'not logged in' });
  const user = getUser(userId);
  if (!user) return res.json({ success: false, error: 'user not found' });
  const score = getScore(userId);
  res.json({ success: true, user: {
    id: user.id, phone: user.phone, name: maskName(user.name),
    school: user.school, birthdate: user.birthdate,
    totalStars: score.totalStars, totalChicks: score.totalChicks
  }});
});

// Submit score
app.post('/api/score', (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.json({ success: false, error: 'not logged in' });
  const { starsPerLevel } = req.body || {};
  if (!Array.isArray(starsPerLevel) || !starsPerLevel.every(s => typeof s === 'number' && s >= 0 && s <= 3))
    return res.json({ success: false, error: 'invalid score' });
  const r = updateScore(userId, starsPerLevel);
  res.json({ success: true, totalStars: r.totalStars, totalChicks: r.totalChicks });
});

// Reset progress (keep registration, only clear progress/score/chicks)
app.post('/api/reset-progress', (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.json({ success: false, error: 'not logged in' });
  const user = data.users.find(u => u.id === userId);
  if (!user) return res.json({ success: false, error: 'user not found' });
  // Keep: phone, password, name, school, birthdate, createdAt
  // Reset: scores data (used by leaderboard), user progress
  if (data.scores[userId]) {
    data.scores[userId] = { stars: Array(30).fill(0), totalStars: 0, totalChicks: 0 };
  }
  user.starsPerLevel = Array(30).fill(0);
  user.totalStars = 0;
  user.totalChicks = 0;
  user.progress = Array(30).fill(null).map(() => ({ passed: false, score: 0, stars: 0 }));
  saveDB();
  res.json({ success: true });
});

// Leaderboard
app.get('/api/leaderboard', (req, res) => {
  const list = getTopScores(20);
  res.json({ success: true, list: list.map((u, i) => ({
    rank: i + 1, name: u.name, school: u.school,
    totalStars: u.totalStars, totalChicks: u.totalChicks
  })) });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.json({ success: false, error: 'username and password required' });
  const admin = data.admins.find(a => a.username === username);
  if (!admin || !bcrypt.compareSync(password, admin.passwordHash))
    return res.json({ success: false, error: 'wrong credentials' });
  const token = crypto.randomBytes(24).toString('hex');
  admin.token = token; // store token in memory
  // persist token to db.json
  try { require('fs').writeFileSync(require('path').join(__dirname, 'db.json'), JSON.stringify(data, null, 2)); } catch(e) {}
  res.json({ success: true, token, username: admin.username });
});

function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token) return res.json({ success: false, error: 'no token' });
  const admin = data.admins.find(a => a.token === token);
  if (!admin) return res.json({ success: false, error: 'unauthorized' });
  next();
}

app.get('/api/admin/users', requireAdmin, (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || '1'));
  const pageSize = Math.min(50, parseInt(req.query.pageSize || '20'));
  const search = (req.query.search || '').trim().toLowerCase();
  let users = data.users.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (search) users = users.filter(u => u.phone.includes(search) || u.name.toLowerCase().includes(search));
  const total = users.length;
  const pageUsers = users.slice((page - 1) * pageSize, page * pageSize);
  res.json({
    success: true, total, page, pageSize, pages: Math.ceil(total / pageSize),
    users: pageUsers.map(u => {
      const score = getScore(u.id);
      return { id: u.id, phone: u.phone, name: maskName(u.name), school: u.school,
        birthdate: u.birthdate, created_at: u.createdAt,
        totalStars: score.totalStars, totalChicks: score.totalChicks };
    })
  });
});

app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const totalUsers = data.users.length;
  const allScores = Object.values(data.scores);
  res.json({ success: true, stats: {
    totalUsers,
    totalStars: allScores.reduce((s, sc) => s + (sc.totalStars || 0), 0),
    totalChicks: allScores.reduce((s, sc) => s + (sc.totalChicks || 0), 0)
  }});
});

app.get('/api/admin/leaderboard', requireAdmin, (req, res) => {
  const top = getTopScores(50);
  res.json({ success: true, list: top.map((u, i) => ({
    rank: i + 1, id: u.userId, name: u.name,
    phone: data.users.find(x => x.id === u.userId)?.phone || '',
    school: u.school, totalStars: u.totalStars, totalChicks: u.totalChicks
  }))});
});

// Admin: Reset user password
app.post('/api/admin/reset-password', requireAdmin, (req, res) => {
  const { userId, newPassword } = req.body || {};
  if (!userId || !newPassword) return res.json({ success: false, error: 'userId and newPassword required' });
  if (newPassword.length < 6) return res.json({ success: false, error: 'password min 6 chars' });
  const user = data.users.find(u => u.id === userId);
  if (!user) return res.json({ success: false, error: 'user not found' });
  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  saveDB();
  console.log(`[ADMIN] Password reset for user ${userId} by admin`);
  res.json({ success: true });
});

// Admin: Delete user
app.post('/api/admin/delete-user', requireAdmin, (req, res) => {
  const { userId } = req.body || {};
  if (!userId) return res.json({ success: false, error: 'userId required' });
  const idx = data.users.findIndex(u => u.id === userId);
  if (idx < 0) return res.json({ success: false, error: 'user not found' });
  // Delete user and related data
  data.users.splice(idx, 1);
  delete data.scores[userId];
  saveDB();
  console.log(`[ADMIN] User ${userId} deleted by admin`);
  res.json({ success: true });
});

// Static files
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0, etag: false }));

// Inline admin HTML (bypasses static file caching)
const ADMIN_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>拯救小鸡 - 管理后台</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'PingFang SC','Microsoft YaHei',sans-serif;background:#f0f2f5;color:#333}
.login-screen{display:flex;align-items:center;justify-content:center;min-height:100vh}
.login-box{background:#fff;padding:40px;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.1);width:360px}
.login-box h1{font-size:24px;margin-bottom:24px;color:#f59e0b;text-align:center}
.login-box input{width:100%;padding:12px 16px;margin-bottom:16px;border:1px solid #ddd;border-radius:8px;font-size:15px}
.login-box button{width:100%;padding:12px;background:#f59e0b;color:#fff;border:none;border-radius:8px;font-size:16px;cursor:pointer}
.login-box button:hover{background:#d97706}
.dashboard{display:none}
.topbar{background:#fff;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 2px 8px rgba(0,0,0,.06);position:sticky;top:0;z-index:100}
.topbar h1{font-size:18px;color:#f59e0b}
.logout{color:#999;cursor:pointer;font-size:14px}
.logout:hover{color:#333}
.nav{background:#fff;padding:0 24px;display:flex;gap:4px;border-bottom:1px solid #eee}
.nav button{padding:12px 20px;background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-size:14px;color:#666}
.nav button.active{color:#f59e0b;border-bottom-color:#f59e0b}
.content{padding:24px;max-width:1200px;margin:0 auto}
.stat-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-bottom:24px}
.stat-card{background:#fff;padding:20px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.06)}
.stat-card .label{color:#999;font-size:13px;margin-bottom:8px}
.stat-card .value{font-size:28px;font-weight:bold;color:#f59e0b}
.stat-card .sub{color:#999;font-size:12px;margin-top:4px}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06)}
th,td{padding:12px 16px;text-align:left;border-bottom:1px solid #f0f0f0;font-size:14px}
th{background:#fafafa;font-weight:600;color:#666}
tr:hover td{background:#fffbf0}
.badge{display:inline-block;padding:2px 8px;border-radius:12px;font-size:12px}
.b-star{background:#fef3c7;color:#d97706}
.b-chick{background:#d1fae5;color:#059669}
.search-bar{display:flex;gap:12px;margin-bottom:16px}
.search-bar input{flex:1;padding:10px 16px;border:1px solid #ddd;border-radius:8px;font-size:14px}
.search-bar button{padding:10px 24px;background:#f59e0b;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px}
.search-bar button:hover{background:#d97706}
.b-reset{padding:10px 24px;background:#e5e7eb;color:#666;border:none;border-radius:8px;cursor:pointer;font-size:14px}
.pagination{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:16px}
.pagination button{padding:6px 14px;border:1px solid #ddd;background:#fff;border-radius:6px;cursor:pointer;font-size:13px}
.pagination button.active{background:#f59e0b;color:#fff;border-color:#f59e0b}
.pagination button:disabled{opacity:.5;cursor:not-allowed}
.chart-bar{display:flex;align-items:flex-end;gap:8px;height:120px;padding:16px;background:#fff;border-radius:12px;margin-bottom:24px;flex-wrap:wrap}
.bar{flex:1;min-width:30px;background:#f59e0b;border-radius:4px 4px 0 0;min-height:4px;transition:height .3s;text-align:center;font-size:11px;color:#fff;display:flex;align-items:flex-end;justify-content:center;padding-bottom:4px;position:relative}
.bar:hover::after{content:attr(title);position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:#333;color:#fff;font-size:11px;padding:2px 6px;border-radius:4px;white-space:nowrap}
.medal{display:inline-block;width:24px;height:24px;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:bold}
.m1{background:linear-gradient(135deg,#f59e0b,#fbbf24);color:#fff}
.m2{background:linear-gradient(135deg,#94a3b8,#cbd5e1);color:#fff}
.m3{background:linear-gradient(135deg,#b45309,#d97706);color:#fff}
.mn{background:#f1f5f9;color:#64748b}
.error{color:#ef4444;font-size:13px;margin-top:8px;text-align:center}
h3{margin-bottom:12px;font-size:15px;color:#666}
.refresh-btn{padding:10px 24px;background:#f59e0b;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;margin-bottom:16px}
.refresh-btn:hover{background:#d97706}

      .ops-cell { white-space: nowrap; }
      .op-btn { padding:4px 10px; border-radius:4px; font-size:0.82em; cursor:pointer; margin-right:4px; }
      .op-reset { border:1px solid #1976d2; background:#e3f2fd; color:#1976d2; }
      .op-delete { border:1px solid #d32f2f; background:#ffebee; color:#d32f2f; }
</style>
</head>
<body>
<div class="login-screen" id="loginScreen">
  <div class="login-box">
    <h1>🐥 管理后台</h1>
    <input type="text" id="username" placeholder="管理员账号" autocomplete="off">
    <input type="password" id="password" placeholder="密码" autocomplete="off">
    <button onclick="doLogin()">登录</button>
    <div class="error" id="err"></div>
  </div>
</div>

<div class="dashboard" id="dashboard">
  <div class="topbar">
    <h1>🐥 拯救小鸡 · 管理后台</h1>
    <span class="logout" onclick="logout()">退出登录</span>
  </div>
  <div class="nav">
    <button class="active" onclick="switchTab('overview',this)">数据概览</button>
    <button onclick="switchTab('users',this)">用户管理</button>
    <button onclick="switchTab('leaderboard',this)">排行榜</button>
  </div>
  <div class="content" id="content"></div>
</div>

<script>
function resetPwd(uid, phone) {
  if (!confirm('确定重置该用户密码为 123456？')) return;
  fetch(API+'/api/admin/reset-password',{method:'POST',headers:ah(),body:JSON.stringify({userId:parseInt(uid),newPassword:'123456'})})
    .then(r=>r.json()).then(d=>{alert(d.success?'密码已重置为123456':('错误:'+(d.error||'')));if(d.success)loadUsers(1);});
}
function delUser(uid, name) {
  if (!confirm('确定删除用户 '+(name||'')+'？不可恢复！')) return;
  fetch(API+'/api/admin/delete-user',{method:'POST',headers:ah(),body:JSON.stringify({userId:parseInt(uid)})})
    .then(r=>r.json()).then(d=>{alert(d.success?'用户已删除':('错误:'+(d.error||'')));if(d.success)loadUsers(1);});
}


var API = location.origin;
var token = localStorage.getItem('at') || '';
var currentSearch = '';

function doLogin() {
  var u = document.getElementById('username').value;
  var p = document.getElementById('password').value;
  document.getElementById('err').textContent = '';
  fetch(API + '/api/admin/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username: u, password: p})
  }).then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.success) {
        token = d.token;
        localStorage.setItem('at', token);
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadTab('overview');
      } else {
        document.getElementById('err').textContent = d.error || '登录失败';
      }
    });
}

function logout() {
  localStorage.removeItem('at');
  token = '';
  location.reload();
}

function ah() {
  return {'x-admin-token': token, 'Content-Type': 'application/json'};
}

function switchTab(tab, btn) {
  document.querySelectorAll('.nav button').forEach(function(b){ b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  loadTab(tab);
}

function loadTab(tab) {
  if (tab === 'overview') loadOverview();
  else if (tab === 'users') loadUsers(1);
  else if (tab === 'leaderboard') loadLeaderboard();
}

function loadOverview() {
  fetch(API + '/api/admin/stats', {headers: ah()})
    .then(function(r){return r.json();})
    .then(function(d) {
      if (!d.success || !d.stats) {
        document.getElementById('content').innerHTML = '<div style="padding:40px;color:#999;text-align:center">加载失败: ' + (d.error||'') + '</div>';
        return;
      }
      var s = d.stats;
      document.getElementById('content').innerHTML =
        '<button class="refresh-btn" onclick="loadTab(\\"overview\\")">刷新数据</button>' +
        '<div class="stat-cards">' +
          '<div class="stat-card"><div class="label">总用户数</div><div class="value">' + s.totalUsers + '</div><div class="sub">累计注册</div></div>' +
          '<div class="stat-card"><div class="label">总星星数</div><div class="value">' + s.totalStars + '</div><div class="sub">全局用户</div></div>' +
          '<div class="stat-card"><div class="label">营救小鸡</div><div class="value">' + s.totalChicks + '</div><div class="sub">全局用户</div></div>' +
        '</div>';
    });
}

function loadUsers(page) {
  fetch(API + '/api/admin/users?page=' + page + '&search=' + encodeURIComponent(currentSearch), {headers: ah()})
    .then(function(r){return r.json();})
    .then(function(d) {
      if (!d.success) return;
      var rows = d.users.map(function(u, idx) {
          return '<tr data-uid="' + u.id + '" data-phone="' + (u.phone||'') + '" data-name="' + (u.name||'') + '">' +
            '<td>' + u.id + '</td>' +
            '<td>' + u.phone + '</td>' +
            '<td>' + u.name + '</td>' +
            '<td>' + u.school + '</td>' +
            '<td>' + u.birthdate + '</td>' +
            '<td>' + u.totalStars + '</td>' +
            '<td>' + u.totalChicks + '</td>' +
            '<td>' + (u.created_at ? u.created_at.split('T')[0] : '-') + '</td>' +
            '<td class="ops-cell">' +
              '<button class="op-btn op-reset" data-action="reset">' + '重置密码' + '</button>' +
              '<button class="op-btn op-delete" data-action="delete">' + '删除' + '</button>' +
            '</td></tr>';
        }).join('');

      var pages = '';
      for (var p = 1; p <= Math.min(d.pages, 5); p++) {
        pages += '<button ' + (p === d.page ? 'class="active"' : '') + ' onclick="loadUsers(' + p + ')">' + p + '</button>';
      }

      document.getElementById('content').innerHTML =
        '<div style="margin-bottom:8px;color:#e67e22;font-size:0.85em;">⚠️ 重置密码=设为123456 | 删除用户=清除所有数据</div>' +
        '<div class="search-bar">' +
          '<input type="text" id="searchInput" placeholder="搜索：手机号 / 姓名 / 学校" value="' + (currentSearch || '') + '">' +
          '<button onclick="doSearch()">搜索</button>' +
          '<button class="b-reset" onclick="doReset()">重置</button>' +
        '</div>' +
        '<table><thead><tr><th>ID</th><th>手机号</th><th>姓名</th><th>学校</th><th>生日</th><th>星星</th><th>小鸡</th><th>注册时间</th><th>操作</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<div class="pagination">' +
          '<button ' + (d.page <= 1 ? 'disabled' : '') + ' onclick="loadUsers(' + (d.page - 1) + ')">上一页</button>' +
          pages +
          '<span style="color:#999;font-size:13px;margin-left:8px">共 ' + d.total + ' 人</span>' +
          '<button ' + (d.page >= d.pages ? 'disabled' : '') + ' onclick="loadUsers(' + (d.page + 1) + ')">下一页</button>' +
        '</div>';
    });
}

function loadLeaderboard() {
  fetch(API + '/api/admin/leaderboard', {headers: ah()})
    .then(function(r){return r.json();})
    .then(function(d) {
      if (!d.success) return;
      var rows = d.list.map(function(u) {
        var medal = u.rank <= 3 ? '<span class="medal m' + u.rank + '">' + u.rank + '</span>' : '<span class="medal mn">' + u.rank + '</span>';
        return '<tr><td>' + medal + '</td><td>' + u.id + '</td><td>' + u.name + '</td><td>' + u.phone + '</td><td>' + u.school + '</td><td><span class="badge b-star">⭐ ' + u.totalStars + '</span></td><td><span class="badge b-chick">🐥 ' + u.totalChicks + '</span></td><td>' + (u.updated_at ? u.updated_at.replace('T',' ').slice(0,16) : '-') + '</td></tr>';
      }).join('');
      document.getElementById('content').innerHTML =
        '<button class="refresh-btn" onclick="loadTab(\\"leaderboard\\")">刷新排行榜</button>' +
        '<table><thead><tr><th>排名</th><th>ID</th><th>姓名</th><th>手机号</th><th>学校</th><th>星星</th><th>小鸡</th><th>更新时间</th></tr></thead><tbody>' + rows + '</tbody></table>';
    });
}

// 辅助函数：搜索和重置
function doSearch() {
  currentSearch = document.getElementById('searchInput').value;
  loadUsers(1);
}
function doReset() {
  currentSearch = '';
  var si = document.getElementById('searchInput');
  if (si) si.value = '';
  loadUsers(1);
}

// 事件委托：操作按钮（重置密码/删除用户）
document.addEventListener('click', function(e) {
  var btn = e.target.closest('.op-btn');
  if (!btn) return;
  var tr = btn.closest('tr');
  if (!tr) return;
  var uid = tr.getAttribute('data-uid');
  var phone = tr.getAttribute('data-phone');
  var uname = tr.getAttribute('data-name');
  var action = btn.getAttribute('data-action');
  if (action === 'reset') { resetPwd(uid, phone); }
  else if (action === 'delete') { delUser(uid, uname); }
});

// 启动时检查登录状态
if (token) {
  fetch(API + '/api/admin/stats', {headers: ah()})
    .then(function(r){return r.json();})
    .then(function(d) {
      if (d.success) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadTab('overview');
      } else {
        logout();
      }
    })
    .catch(function() { logout(); });
}
</script>
</body>
</html>
`;
app.get('/admin', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.send(ADMIN_HTML);
});
// Root served by express.static (public/index.html)

console.log('Starting Save Chicks Backend v2.0...');
console.log('PORT env:', process.env.PORT);
console.log('Using port:', PORT);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server on port ${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin (admin/admin123)`);
}).on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
