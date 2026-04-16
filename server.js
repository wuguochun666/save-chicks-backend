/**
 * 拯救小鸡 - 后端 API 服务
 * 存储：JSON 文件（无需 SQLite / WASM，Railway 免费兼容）
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// ============================================================
// JSON 数据库
// ============================================================
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

let data = { users: [], smsCodes: [], scores: {}, admins: [] };

function loadDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      console.log('[DB] Loaded from', DB_FILE);
    } catch(e) {
      console.log('[DB] Load error, starting fresh:', e.message);
      data = { users: [], smsCodes: [], scores: {}, admins: [] };
    }
  } else {
    data = { users: [], smsCodes: [], scores: {}, admins: [] };
    saveDB();
    console.log('[DB] Created new DB at', DB_FILE);
  }
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 0), 'utf8');
  } catch(e) {
    console.error('[DB] Save error:', e.message);
  }
}

// 自动保存：每 30 秒 + 每次写操作后延迟保存
let saveTimer = null;
function debouncedSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(saveDB, 500);
}

// 确保默认管理员
loadDB();
const defaultAdmin = data.admins.find(a => a.username === 'admin');
if (!defaultAdmin) {
  data.admins.push({ id: 1, username: 'admin', passwordHash: bcrypt.hashSync('admin123', 10) });
  saveDB();
}

// 优雅退出
process.on('SIGTERM', () => { saveDB(); process.exit(0); });
process.on('SIGINT', () => { saveDB(); process.exit(0); });

// ============================================================
// DB 辅助
// ============================================================
function isValidPhone(p) { return /^1[3-9]\d{9}$/.test(p); }
function isValidDate(d) { return /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d)); }

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
  // 合并星星（每关只保留最高星）
  starsPerLevel.forEach((v, i) => {
    if (!score.stars[i] || v > score.stars[i]) score.stars[i] = v;
  });
  score.totalStars = calcTotalStars(userId);
  score.totalChicks = calcChicks(score.totalStars);
  score.updatedAt = new Date().toISOString();
  debouncedSave();
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

// ============================================================
// 中间件
// ============================================================
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-user-id', 'x-admin-token'] }));
app.use(express.json({ limit: '1mb' }));

// 全局限流
const limiter = require('express-rate-limit')({
  windowMs: 60 * 1000, max: 60,
  message: { success: false, error: '请求过于频繁，请稍后再试' },
  standardHeaders: true, legacyHeaders: false,
  keyGenerator: (req) => req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown'
});
app.use(limiter);

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================================
// API
// ============================================================

// 发送验证码
app.post('/api/send-code', (req, res) => {
  const { phone } = req.body || {};
  if (!isValidPhone(phone)) return res.json({ success: false, error: '手机号格式不正确' });
  const now = Date.now();
  const recent = data.smsCodes.find(s => s.phone === phone && !s.used && s.expiresAt > now);
  if (recent) return res.json({ success: false, error: '发送太频繁，请稍后再试' });
  const isDev = process.env.NODE_ENV !== 'production';
  const code = isDev ? '1234' : String(Math.floor(1000 + Math.random() * 9000));
  data.smsCodes = data.smsCodes.filter(s => s.expiresAt > now); // 清理过期
  data.smsCodes.push({ phone, code, expiresAt: now + 10 * 60 * 1000, used: false, createdAt: now });
  saveDB();
  console.log(`[SMS] ${code} → ${phone} (${isDev ? 'dev' : 'prod'})`);
  res.json({ success: true, message: isDev ? '开发模式，验证码为 1234' : '验证码已发送（10分钟有效）',
    code: isDev ? '1234' : undefined });
});

// 注册
app.post('/api/register', (req, res) => {
  const { phone, code, name, school, birthdate } = req.body || {};
  if (!isValidPhone(phone)) return res.json({ success: false, error: '手机号格式不正确' });
  if (!code || code.length !== 4) return res.json({ success: false, error: '验证码格式错误' });
  if (!name || name.trim().length < 2) return res.json({ success: false, error: '姓名至少2个字符' });
  if (!school || school.trim().length < 2) return res.json({ success: false, error: '学校名称至少2个字符' });
  if (!isValidDate(birthdate)) return res.json({ success: false, error: '出生日期格式错误' });

  const now = Date.now();
  const sms = data.smsCodes.find(s => s.phone === phone && s.code === code && !s.used && s.expiresAt > now);
  if (!sms) return res.json({ success: false, error: '验证码错误或已过期' });
  sms.used = true;

  if (data.users.find(u => u.phone === phone)) return res.json({ success: false, error: '该手机号已注册' });

  const userId = data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1;
  const user = { id: userId, phone, name: name.trim(), school: school.trim(), birthdate, createdAt: new Date().toISOString() };
  data.users.push(user);
  data.scores[userId] = { stars: [], totalStars: 0, totalChicks: 0 };
  saveDB();
  console.log(`[REG] ${name} (${phone}) ${school}`);
  res.json({ success: true, message: '注册成功', userId, user: { id: userId, phone, name: maskName(name), school, birthdate } });
});

// 登录
app.post('/api/login', (req, res) => {
  const { phone, code } = req.body || {};
  if (!isValidPhone(phone)) return res.json({ success: false, error: '手机号格式不正确' });
  if (!code || code.length !== 4) return res.json({ success: false, error: '验证码错误' });
  const now = Date.now();
  const sms = data.smsCodes.find(s => s.phone === phone && s.code === code && !s.used && s.expiresAt > now);
  if (!sms) return res.json({ success: false, error: '验证码错误或已过期' });
  sms.used = true;
  const user = data.users.find(u => u.phone === phone);
  if (!user) return res.json({ success: false, error: '用户不存在，请先注册' });
  const score = getScore(user.id);
  saveDB();
  res.json({ success: true, message: '登录成功', userId: user.id,
    user: { id: user.id, phone: user.phone, name: maskName(user.name), school: user.school,
             totalStars: score.totalStars, totalChicks: score.totalChicks } });
});

// 当前用户
app.get('/api/me', (req, res) => {
  const userId = parseInt(req.headers['x-user-id'] || '0');
  if (!userId) return res.json({ success: false, error: '未登录' });
  const user = getUser(userId);
  if (!user) return res.json({ success: false, error: '用户不存在' });
  const score = getScore(userId);
  res.json({ success: true, user: { id: user.id, phone: user.phone, name: maskName(user.name),
    school: user.school, birthdate: user.birthdate,
    totalStars: score.totalStars, totalChicks: score.totalChicks } });
});

// 提交成绩
app.post('/api/score', (req, res) => {
  const userId = parseInt(req.headers['x-user-id'] || '0');
  if (!userId) return res.json({ success: false, error: '未登录' });
  const { starsPerLevel } = req.body || {};
  if (!Array.isArray(starsPerLevel) || !starsPerLevel.every(s => typeof s === 'number' && s >= 0 && s <= 3))
    return res.json({ success: false, error: '参数错误' });
  const r = updateScore(userId, starsPerLevel);
  res.json({ success: true, totalStars: r.totalStars, totalChicks: r.totalChicks });
});

// 排行榜 Top 20
app.get('/api/leaderboard', (req, res) => {
  const list = getTopScores(20);
  res.json({ success: true, list: list.map((u, i) => ({ rank: i + 1, name: u.name, school: u.school,
    totalStars: u.totalStars, totalChicks: u.totalChicks })) });
});

// ============================================================
// 管理后台 API
// ============================================================

// 管理员登录
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.json({ success: false, error: '请输入账号密码' });
  const admin = data.admins.find(a => a.username === username);
  if (!admin || !bcrypt.compareSync(password, admin.passwordHash))
    return res.json({ success: false, error: '账号或密码错误' });
  const token = crypto.randomBytes(24).toString('hex');
  res.json({ success: true, token, username: admin.username });
});

function requireAdmin(req, res, next) {
  if (!req.headers['x-admin-token']) return res.json({ success: false, error: '未授权' });
  next();
}

// 用户列表
app.get('/api/admin/users', requireAdmin, (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || '1'));
  const pageSize = Math.min(50, parseInt(req.query.pageSize || '20'));
  const search = (req.query.search || '').trim().toLowerCase();
  const totalUsers = data.users.length;
  let users = data.users.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (search) {
    users = users.filter(u =>
      u.phone.includes(search) || u.name.toLowerCase().includes(search) || u.school.toLowerCase().includes(search));
  }
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

// 统计数据
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const totalUsers = data.users.length;
  const todayUsers = data.users.filter(u => u.createdAt.startsWith(today)).length;
  const allScores = Object.values(data.scores);
  const totalStars = allScores.reduce((s, sc) => s + (sc.totalStars || 0), 0);
  const totalChicks = allScores.reduce((s, sc) => s + (sc.totalChicks || 0), 0);

  // 近7天趋势
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 7);
  const weekDays = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart); d.setDate(d.getDate() + i + 1);
    weekDays[d.toISOString().split('T')[0]] = 0;
  }
  data.users.filter(u => new Date(u.createdAt) >= weekStart)
    .forEach(u => { const d = u.createdAt.split('T')[0]; if (weekDays[d] !== undefined) weekDays[d]++; });

  // 星星分布
  const distBuckets = { '0星': 0, '1-9星': 0, '10-29星': 0, '30-59星': 0, '60-89星': 0, '90+星': 0 };
  Object.values(data.scores).forEach(s => {
    const t = s.totalStars || 0;
    if (t === 0) distBuckets['0星']++;
    else if (t < 10) distBuckets['1-9星']++;
    else if (t < 30) distBuckets['10-29星']++;
    else if (t < 60) distBuckets['30-59星']++;
    else if (t < 90) distBuckets['60-89星']++;
    else distBuckets['90+星']++;
  });

  res.json({ success: true, stats: {
    totalUsers, todayUsers, totalStars, totalChicks,
    weekTrend: Object.entries(weekDays).map(([date, count]) => ({ date, count })),
    starDist: Object.entries(distBuckets).map(([bucket, count]) => ({ bucket, count }))
  }});
});

// 排行榜管理
app.get('/api/admin/leaderboard', requireAdmin, (req, res) => {
  const top = getTopScores(50);
  res.json({ success: true, list: top.map((u, i) => ({
    rank: i + 1, id: u.userId, name: u.name, phone: data.users.find(x => x.id === u.userId)?.phone || '',
    school: u.school, totalStars: u.totalStars, totalChicks: u.totalChicks,
    updated_at: data.scores[u.userId]?.updatedAt || ''
  }))});
});

// ============================================================
// 管理后台 + 静态文件
// ============================================================
app.use(express.static(path.join(__dirname, 'public')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/admin/users', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/admin/leaderboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// 健康检查端点（Railway 用）
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ name: '拯救小鸡 API', version: '1.0.0',
    endpoints: ['POST /api/send-code', 'POST /api/register', 'POST /api/login',
      'GET /api/leaderboard', 'POST /api/score', 'GET /admin'] });
});

// ============================================================
// 启动
// ============================================================
console.log('🐥 拯救小鸡后端启动中...');
console.log('   数据目录:', DATA_DIR);
console.log('   数据库文件:', DB_FILE);
loadDB();
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🐥 启动成功！端口: ${PORT}`);
  console.log(`   管理后台: http://localhost:${PORT}/admin`);
  console.log(`   管理员账号: admin / admin123\n`);
});
