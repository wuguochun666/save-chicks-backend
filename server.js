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

let data = { users: [], scores: {}, admins: [], tokens: {} };

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

function calcChicks(totalStars) { return Math.min(Math.floor(totalStars / 3), 10); }

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
  score.totalChicks = calcChicks(score.totalStars);
  score.updatedAt = new Date().toISOString();
  saveDB();
  return { totalStars: score.totalStars, totalChicks: score.totalChicks };
}

function getUser(id) { return data.users.find(u => u.id === id); }
function getScore(userId) { return data.scores[userId] || { totalStars: 0, totalChicks: 0 }; }

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
    user: { id: userId, phone, name: maskName(name), school: user.school, totalStars: 0, totalChicks: 0 }
  });
});

// Login: phone + password
app.post('/api/login', (req, res) => {
  const { phone, password } = req.body || {};
  if (!isValidPhone(phone)) return res.json({ success: false, error: 'phone format wrong' });
  if (!password) return res.json({ success: false, error: 'password required' });
  const user = data.users.find(u => u.phone === phone);
  if (!user) return res.json({ success: false, error: 'user not found, please register first' });
  if (!bcrypt.compareSync(password, user.passwordHash))
    return res.json({ success: false, error: 'password wrong' });
  const token = makeToken(user.id);
  const score = getScore(user.id);
  saveDB();
  console.log(`[LOGIN] ${user.name} (${phone})`);
  res.json({
    success: true, token,
    user: { id: user.id, phone: user.phone, name: maskName(user.name),
             school: user.school, totalStars: score.totalStars, totalChicks: score.totalChicks }
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
  admin.token = token; // store token for subsequent requests
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

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/', (req, res) => {
  res.json({ name: 'Save Chicks API', version: '2.0', note: 'phone + password auth' });
});

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
