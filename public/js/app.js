
// ==================== API 配置 ====================
// Railway 后端地址（部署后替换）
const API_BASE = 'https://save-chicks-backend-production.up.railway.app';

function apiFetch(path, options) {
  return new Promise(function(resolve, reject) {
    var token = Storage.getToken();
    var headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    fetch(API_BASE + path, Object.assign({ headers: headers }, options || {}))
      .then(function(r) { return r.json(); })
      .then(function(data) { resolve(data); })
      .catch(function(e) { reject(e); });
  });
}

// 发送验证码
function sendVerifyCode(phone) {
  return apiFetch('/api/send-code', {
    method: 'POST',
    body: JSON.stringify({ phone: phone })
  });
}

// 注册
function registerUser(phone, password, name, school, birthdate) {
  return apiFetch('/api/register', {
    method: 'POST',
    body: JSON.stringify({ phone: phone, password: password, name: name, school: school, birthdate: birthdate })
  });
}

// 提交分数
function submitScore(phone, totalScore, totalStars, chicksSaved, progress) {
  return apiFetch('/api/score', {
    method: 'POST',
    body: JSON.stringify({
      phone: phone,
      totalScore: totalScore,
      totalStars: totalStars,
      chicksSaved: chicksSaved,
      progress: progress
    })
  });
}

// 获取排行榜
function getLeaderboard() {
  return apiFetch('/api/leaderboard');
}

// ==================== 音效系统 ====================
var Sound = {
  enabled: true,
  _ctx: null,
  init: function() {
    this.enabled = Storage.getSettings().sound;
  },
  _getCtx: function() {
    if (!this._ctx) {
      try { this._ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
    }
    if (this._ctx && this._ctx.state === 'suspended') this._ctx.resume();
    return this._ctx;
  },
  play: function(type) {
    if (!this.enabled) return;
    var ctx = this._getCtx();
    if (!ctx) return;
    try {
      var now = ctx.currentTime;
      var pt = function(f, d, v, s) {
        s = s || 0; v = v || 0.3;
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = f;
        g.gain.setValueAtTime(v, now + s);
        g.gain.exponentialRampToValueAtTime(0.001, now + s + d);
        o.start(now + s); o.stop(now + s + d);
      };
      if (type === 'win') {
        [523,659,784,1047].forEach(function(f, i) { pt(f, 0.25, 0.25, i * 0.15); });
      } else if (type === 'rescue') {
        [523,659,784,880,1047,1175,1319,1568].forEach(function(f, i) { pt(f, 0.35, 0.25, i * 0.08); });
        var self2 = this;
        setTimeout(function() {
          [1047,1319,1568].forEach(function(f, i) { pt(f, 0.5, 0.3, i * 0.03); });
        }, 700);
      } else if (type === 'click') {
        pt(880, 0.04, 0.08, 0);
      } else if (type === 'fail') {
        pt(300, 0.3, 0.2, 0); pt(250, 0.3, 0.2, 0.2); pt(200, 0.4, 0.2, 0.4);
      } else if (type === 'read') {
        [400,500,600].forEach(function(f, i) { pt(f, 0.2, 0.15, i * 0.2); });
      } else if (type === 'type') {
        pt(180 + (Math.random() * 40 - 20), 0.06, 0.2, 0);
      } else if (type === 'tension_bg') {
        (function() {
          var now2 = ctx.currentTime;
          pt(80, 0.35, 0.14, 0);
          pt(80, 0.35, 0.14, 0.5);
          pt(80, 0.35, 0.14, 1.0);
          pt(200, 1.2, 0.06, 0);
          pt(267, 1.2, 0.05, 0.05);
          pt(356, 1.2, 0.04, 0.1);
          pt(300, 0.8, 0.07, 0);
          pt(500, 0.8, 0.07, 0);
          pt(800, 0.15, 0.04, 0.2);
          pt(1000, 0.15, 0.03, 0.5);
        })();
      }
    } catch(e) {}
  },
  setEnabled: function(val) {
    this.enabled = val;
    Storage.updateSettings({ sound: val });
  },
  _bgPulseCount: 0,
  _bgIntervalId: null,
  _introBgTimer: null,
  playBgMusicIntro: function() {
    if (!this.enabled) return;
    var self = this;
    var count = 0;
    this._bgPulseCount = 0;
    function schedulePulse() {
      if (!self.enabled || count >= 8) { self._introBgTimer = null; return; }
      self.play('tension_bg');
      count++;
      self._bgPulseCount = count;
      self._introBgTimer = setTimeout(schedulePulse, 2000);
    }
    schedulePulse();
  },
  stopBgMusicIntro: function() {
    if (this._introBgTimer) { clearTimeout(this._introBgTimer); this._introBgTimer = null; }
  }
};

// ==================== 全局变量 ====================
var currentLevel = 0;
var currentQuestionIndex = 0;
var answers = [];
var selectedAnswers = [];

// RESCUE_LEVELS: 每3关救1只小鸡（关卡索引从0开始：2,5,8...）
var RESCUE_LEVELS = [2,5,8,11,14,17,20,23,26,29];
var TOTAL_LEVELS = 30;
var LEVELS_PER_CHICK = 3;
var screenHistory = [];

// ==================== 页面导航 ====================
function showScreen(id, skipPush) {
  if (!skipPush && id !== screenHistory[screenHistory.length - 1]) {
    screenHistory.push(id);
  }
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
  var target = document.getElementById(id);
  if (target) target.classList.add('active');
  // 隐藏键盘
  document.querySelectorAll('input').forEach(function(inp) { inp.blur(); });
  // 更新用户信息显示
  updateUserDisplay();
}

function goBack() {
  if (screenHistory.length <= 1) {
    // 尝试返回上一个screen
    navigator.app && navigator.app.backHistory && navigator.app.backHistory();
    return;
  }
  screenHistory.pop();
  var prev = screenHistory[screenHistory.length - 1] || 'home';
  if (prev === 'quiz-screen' || prev === 'entry-screen') {
    prev = 'level-map';
  }
  showScreen(prev, true);
}

// ==================== 更新用户信息显示 ====================
function updateUserDisplay() {
  var phone = Storage.getPhone();
  var name = Storage.getName();
  var userEls = document.querySelectorAll('.user-name-display');
  userEls.forEach(function(el) {
    el.textContent = name || (phone ? phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '未登录');
  });
}

// ==================== 开场动画 ====================
function showIntro() {
  var saved = Storage.getChicksSaved();
  var remaining = 10 - saved;
  var html = '<h2>紧急求助！</h2><p>老鹰抓走了<strong>' + remaining + '只</strong>小鸡！</p>';
  html += '<p>快来帮母鸡妈妈，<br>通过英语阅读闯关，<br>每救回1只小鸡！</p>';
  html += '<p style="margin-top:20px;color:#ff6b6b;">点击任意位置开始</p>';
  document.getElementById('intro-content').innerHTML = html;
  showScreen('intro-screen');
}

function finishIntro() {
  if (!Storage.get(Storage.KEYS.PLAYED)) {
    Storage.set(Storage.KEYS.PLAYED, true);
  }
  // 提交本地数据到服务器（异步，不阻塞）
  if (Storage.isLoggedIn()) {
    syncToServer();
  }
  Sound.stopBgMusicIntro();
  showReturnScreen();
}

// ==================== 归来提示页 ====================
function showReturnScreen() {
  Sound.stopBgMusicIntro();
  var saved = Storage.getChicksSaved();
  var remaining = 10 - saved;
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
  document.getElementById('return-screen').classList.add('active');
  var chicks = Storage.get(Storage.KEYS.CHICKS) || Array(10).fill(false);
  var html = chicks.map(function(c, i) {
    return '<div class="return-chick ' + (c ? 'rescued' : 'missing') + '">' +
      (c ? '🐤' : '💤') + '</div>';
  }).join('');
  document.getElementById('return-chicks-list').innerHTML = html;
  document.getElementById('return-status').innerHTML =
    '<p>已救回 <strong style="color:#4CAF50">' + saved + '</strong> 只，还差 <strong style="color:#ff6b6b">' + remaining + '</strong> 只</p>';
  updateUserDisplay();
}

// ==================== 关卡地图 ====================
function renderLevelMap() {
  var progress = Storage.get(Storage.KEYS.PROGRESS) || Array(TOTAL_LEVELS).fill(null).map(function() { return { passed: false, score: 0, stars: 0 }; });
  var chicks = Storage.get(Storage.KEYS.CHICKS) || Array(10).fill(false);
  var html = '<h2 class="map-title">🌟 拯救小鸡之旅 🌟</h2>';
  html += '<div class="level-grid">';
  for (var i = 0; i < TOTAL_LEVELS; i++) {
    var p = progress[i] || { passed: false, score: 0, stars: 0 };
    var isRescue = RESCUE_LEVELS.indexOf(i) !== -1;
    var chickIdx = RESCUE_LEVELS.indexOf(i);
    var chickRescued = chickIdx !== -1 && chicks[chickIdx];
    var prevPassed = i === 0 || (progress[i - 1] && progress[i - 1].passed);
    var isLocked = !prevPassed;
    var typeLabel = '';
    if (STORIES[i] && STORIES[i].type === 'grammar') {
      typeLabel = '📝语法';
    }
    var chickIcon = chickRescued ? '🐤' : (isRescue ? '🏆' : '');
    var starsStr = p.stars > 0 ? '<span class="lstar">' + '⭐'.repeat(p.stars) + '</span>' : '';
    var badge = isRescue && !chickRescued ? '🏆' : '';
    var lockIcon = isLocked ? '🔒' : '';
    var cls = 'level-node';
    if (p.passed) cls += ' passed';
    else if (isLocked) cls += ' locked';
    if (isRescue) cls += ' rescue-level';
    if (chickRescued) cls += ' chick-rescued';
    html += '<div class="' + cls + '"' + (isLocked ? '' : ' onclick="startLevel(' + i + ')"') + '>' +
      '<span class="lnum">' + (i + 1) + '</span>' +
      '<span class="ltype">' + typeLabel + '</span>' +
      (chickIcon ? '<span class="lchick">' + chickIcon + '</span>' : '') +
      (badge ? '<span class="lbadge">' + badge + '</span>' : '') +
      (lockIcon ? '<span class="llock">' + lockIcon + '</span>' : '') +
      (starsStr ? '<span class="lstars">' + starsStr + '</span>' : '') +
      '</div>';
  }
  html += '</div>';
  document.getElementById('level-grid-container').innerHTML = html;
  updateUserDisplay();
}

// ==================== 进入关卡（带开场动画） ====================
var _pendingLevel = 0;
function startLevel(levelIndex) {
  _pendingLevel = levelIndex;
  currentLevel = levelIndex;
  currentQuestionIndex = 0;
  answers = [];
  selectedAnswers = [];
  var story = STORIES[levelIndex];
  var isRescue = RESCUE_LEVELS.indexOf(levelIndex) !== -1;
  var chickIdx = RESCUE_LEVELS.indexOf(levelIndex);
  var chickRescued = chickIdx !== -1 && (Storage.get(Storage.KEYS.CHICKS) || Array(10).fill(false))[chickIdx];
  // 生成动画文字
  var messages = [];
  messages.push('第 ' + (levelIndex + 1) + ' 关');
  if (story.type === 'grammar') {
    messages.push('语法加油站 📝');
    messages.push('认真学习，进步更大！');
  } else {
    messages.push(story.titleCN || '阅读理解');
    if (story.titleEN) messages.push(story.titleEN.substring(0, 40));
  }
  if (isRescue && !chickRescued) {
    messages.push('⏰ 即将营救！');
    messages.push('通关后救回第 ' + (chickIdx + 1) + ' 只小鸡！');
  }
  messages.push('准备好开始答题了吗？');
  playEntryAnimation(messages, function() {
    showScreen('quiz-screen');
    renderQuestion();
  });
}

function playEntryAnimation(messages, callback) {
  var container = document.getElementById('entry-screen');
  if (!container) { callback && callback(); return; }
  showScreen('entry-screen', true);
  var content = document.getElementById('entry-content');
  var progressFill = document.getElementById('entry-progress-fill');
  var progressText = document.getElementById('entry-progress-text');
  if (!content || !progressFill) { callback && callback(); return; }
  content.innerHTML = '';
  if (progressFill) progressFill.style.width = '0%';
  if (progressText) progressText.textContent = '0%';
  var elapsed = 0;
  var totalTime = messages.length * 2000 + 1500;
  var lastType = 0;
  var rafId = null;
  var typeCount = 0;
  var complete = false;
  var msgIdx = 0;
  var charIdx = 0;
  var line = '';
  function typeNextChar() {
    if (complete) return;
    if (msgIdx >= messages.length) { complete = true; return; }
    if (charIdx === 0 && msgIdx > 0) {
      // 间隔后开始下一条
      setTimeout(function() { charIdx = 0; line = ''; typeNextChar(); }, 400);
      msgIdx++;
      return;
    }
    if (charIdx < messages[msgIdx].length) {
      line += messages[msgIdx][charIdx];
      charIdx++;
      content.innerHTML = '<p>' + line + '<span class="blink-cursor">|</span></p>';
      // 打字音效（限速）
      if (typeCount === 0 || (Date.now() - lastType > 80)) {
        Sound.play('type');
        lastType = Date.now();
        typeCount = 0;
      }
      typeCount++;
      setTimeout(typeNextChar, 100);
    } else {
      // 整条消息打完
      content.innerHTML = '<p>' + line + '</p>';
      msgIdx++;
      charIdx = 0;
      line = '';
      if (msgIdx < messages.length) {
        setTimeout(typeNextChar, 500);
      } else {
        complete = true;
      }
    }
  }
  typeNextChar();
  function animate(ts) {
    if (!startTime) startTime = ts;
    elapsed = ts - startTime;
    var pct = Math.min(100, Math.round((elapsed / totalTime) * 100));
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressText) progressText.textContent = pct + '%';
    if (elapsed < totalTime) {
      rafId = requestAnimationFrame(animate);
    } else {
      if (progressFill) progressFill.style.width = '100%';
      if (progressText) progressText.textContent = '100%';
      setTimeout(function() {
        cancelAnimationFrame(rafId);
        callback && callback();
      }, 800);
    }
  }
  var startTime = null;
  rafId = requestAnimationFrame(animate);
}

// ==================== 答题界面 ====================
function renderQuestion() {
  var story = STORIES[currentLevel];
  if (!story || currentQuestionIndex >= story.questions.length) {
    finishLevel();
    return;
  }
  var q = story.questions[currentQuestionIndex];
  document.getElementById('quiz-level-info').innerHTML =
    '<span class="qlevel">' + (currentQuestionIndex + 1) + ' / ' + story.questions.length + '</span>';
  var article = story.article || '';
  document.getElementById('quiz-article').innerHTML = '<div class="article-text">' + article + '</div>';
  var qhtml = '<p class="qtext">' + q.question + '</p><div class="options">';
  q.options.forEach(function(opt, i) {
    qhtml += '<div class="option-btn" onclick="selectAnswer(' + i + ')">' + ('ABCDE')[i] + '. ' + opt + '</div>';
  });
  qhtml += '</div>';
  document.getElementById('quiz-content').innerHTML = qhtml;
  // 进度点
  var dotsHtml = '';
  for (var i = 0; i < story.questions.length; i++) {
    var cls = 'dot';
    if (i < currentQuestionIndex) cls += ' done';
    else if (i === currentQuestionIndex) cls += ' current';
    dotsHtml += '<div class="' + cls + '"></div>';
  }
  document.getElementById('quiz-dots').innerHTML = dotsHtml;
}

// 朗读文章
function readArticle() {
  Sound.play('read');
  var article = STORIES[currentLevel].article || '';
  if (!article) return;
  var text = article.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  // 降级：Web Speech API
  var sp = window.speechSynthesis;
  if (!sp) return;
  sp.cancel();
  var u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.9;
  sp.speak(u);
}

function selectAnswer(index) {
  var story = STORIES[currentLevel];
  var q = story.questions[currentQuestionIndex];
  var correct = index === q.correct;
  answers.push(correct);
  selectedAnswers.push(index);
  Sound.play(correct ? 'win' : 'fail');
  // 显示结果
  var opts = document.querySelectorAll('.option-btn');
  opts.forEach(function(opt, i) {
    opt.onclick = null;
    if (i === q.correct) opt.classList.add('correct');
    else if (i === index && !correct) opt.classList.add('wrong');
  });
  // 1.5秒后下一题
  setTimeout(function() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= story.questions.length) {
      finishLevel();
    } else {
      renderQuestion();
    }
  }, 1500);
}

function skipQuiz() {
  currentQuestionIndex = story.questions.length;
  finishLevel();
}

// ==================== 完成关卡 ====================
function finishLevel() {
  var story = STORIES[currentLevel];
  var correctCount = answers.filter(function(a) { return a; }).length;
  var totalQ = story.questions.length;
  var score = Math.round((correctCount / totalQ) * 100);
  var stars = 0;
  if (score >= 100) stars = 3;
  else if (score >= 80) stars = 2;
  else if (score >= 60) stars = 1;
  var passed = stars === 3;
  if (passed) {
    Storage.setLevelProgress(currentLevel, { passed: true, score: score, stars: stars });
    Storage.addScore(score);
  }
  // 救小鸡
  var chickIdx = RESCUE_LEVELS.indexOf(currentLevel);
  var rescuedChick = false;
  if (passed && chickIdx !== -1) {
    var chicks = Storage.get(Storage.KEYS.CHICKS);
    if (!chicks[chickIdx]) {
      Storage.rescueChick(chickIdx);
      rescuedChick = true;
      Sound.play('rescue');
    }
  }
  // 保存到服务器
  if (Storage.isLoggedIn()) {
    syncToServer();
  }
  showLevelResult(score, stars, passed, rescuedChick, chickIdx);
}

function showLevelResult(score, stars, passed, rescuedChick, chickIdx) {
  showScreen('level-result');
  document.getElementById('result-stars').innerHTML = passed ? '⭐'.repeat(stars) : '差一点点！💪';
  var msg = passed ? '🎉 过关！' : '💪 加油！需要三星才能过关哦！';
  if (score >= 100) msg = '🌟 太棒了！满分通关！';
  else if (score >= 80) msg = '👍 差一点！再细心一点！';
  else if (score >= 60) msg = '💪 加油！多练习就能三星！';
  document.getElementById('result-msg').innerHTML = msg;
  document.getElementById('result-score').innerHTML = '得分：' + score + '%（' + answers.filter(function(a) { return a; }).length + '/' + answers.length + '）';
  var nextBtn = document.getElementById('next-level-btn');
  if (nextBtn) {
    if (passed && currentLevel < TOTAL_LEVELS - 1) {
      nextBtn.textContent = '下一关 →';
      nextBtn.style.display = '';
      nextBtn.onclick = function() {
        renderLevelMap();
        startLevel(currentLevel + 1);
      };
    } else if (passed && currentLevel === TOTAL_LEVELS - 1) {
      nextBtn.textContent = '全部通关！🎊';
      nextBtn.style.display = '';
      nextBtn.onclick = function() {
        showScreen('home');
        renderLevelMap();
      };
    } else {
      nextBtn.textContent = '重新挑战';
      nextBtn.style.display = '';
      nextBtn.onclick = function() {
        renderLevelMap();
        startLevel(currentLevel);
      };
    }
  }
  // 救援动画
  if (rescuedChick) {
    var savedCount = Storage.getChicksSaved();
    var remaining = 10 - savedCount;
    document.getElementById('result-msg').innerHTML +=
      '<p style="color:#4CAF50;font-size:1.2em;margin-top:10px;">🐤 第 ' + (chickIdx + 1) + ' 只小鸡已救回！</p>' +
      '<p style="color:#ff6b6b;">还差 ' + remaining + ' 只，继续加油！</p>';
  }
}

function retryLevel() {
  currentQuestionIndex = 0;
  answers = [];
  selectedAnswers = [];
  startLevel(currentLevel);
}

// ==================== 同步数据到服务器 ====================
function syncToServer() {
  if (!Storage.isLoggedIn()) return;
  var data = Storage.getAllProgress();
  var totalStars = 0;
  (data.progress || []).forEach(function(p) { if (p && p.stars) totalStars += p.stars; });
  submitScore( data.totalScore, totalStars, data.chicksSaved, data.progress)
    .then(function(r) {
      if (r.success) console.log('Score synced:', r);
    })
    .catch(function(e) { console.log('Sync failed:', e); });
}

// ==================== 小鸡花园 ====================
function renderGarden() {
  var chicks = Storage.get(Storage.KEYS.CHICKS) || Array(10).fill(false);
  var html = '<h2 class="garden-title">小鸡花园 🐤</h2>';
  html += '<p class="garden-hint">点击已救回的小鸡打招呼！</p>';
  html += '<div class="garden-grid">';
  var phrases = [
    '谢谢英雄！🐤',
    '你是最棒的！⭐',
    '好开心！🎉',
    '加油加油！💪',
    '爱你哟！❤️',
    '太厉害啦！👏',
    '拯救小鸡！🏆',
    '英雄无敌！🦸',
    '继续努力！🌟',
    '太棒了！👍'
  ];
  chicks.forEach(function(c, i) {
    var cls = c ? 'garden-chick rescued' : 'garden-chick missing';
    var phrase = c ? phrases[i % phrases.length] : '🔒 第' + (i+1) + '只待救';
    html += '<div class="' + cls + '"' + (c ? ' onclick="thankHero(' + i + ')">' + phrase : '>🔒') + '</div>';
  });
  html += '</div>';
  html += '<p class="garden-progress">已救回：' + chicks.filter(function(c) { return c; }).length + ' / 10 只</p>';
  document.getElementById('garden-content').innerHTML = html;
  updateUserDisplay();
}

function thankHero(chickIdx) {
  var phrases = [
    '谢谢英雄！🐤',
    '你是最棒的！⭐',
    '好开心！🎉',
    '加油加油！💪',
    '爱你哟！❤️',
    '太厉害啦！👏',
    '拯救小鸡！🏆',
    '英雄无敌！🦸',
    '继续努力！🌟',
    '太棒了！👍'
  ];
  var phrase = phrases[chickIdx % phrases.length];
  alert(phrase);
  // TTS 朗读
  try {
    var sp = window.speechSynthesis;
    if (sp) {
      sp.cancel();
      var u = new SpeechSynthesisUtterance(phrase.replace(/[🐤⭐🎉💪❤️👏🏆🦸🌟👍🔒]/g, ''));
      u.lang = 'zh-CN';
      u.rate = 1.0;
      sp.speak(u);
    }
  } catch(e) {}
}

// ==================== 词汇本 ====================
function renderVocab() {
  var vocab = Storage.getVocab() || [];
  var html = '<h2 class="vocab-title">词汇本 📖</h2>';
  if (vocab.length === 0) {
    html += '<p style="text-align:center;padding:40px;color:#888;">答题过程中遇到的生词会保存在这里～</p>';
  } else {
    html += '<p style="color:#888;font-size:0.9em;margin-bottom:12px;">共 ' + vocab.length + ' 个词汇</p>';
    html += '<div class="vocab-list">';
    vocab.forEach(function(v) {
      html += '<div class="vocab-item">' +
        '<div class="vocab-word"><span onclick="speakWord(\'' + v.word + '\')">🔊</span> ' + v.word + '</div>' +
        '<div class="vocab-meaning">' + v.meaning + '</div></div>';
    });
    html += '</div>';
  }
  document.getElementById('vocab-content').innerHTML = html;
  updateUserDisplay();
}

function speakWord(word) {
  Sound.play('click');
  try {
    var sp = window.speechSynthesis;
    if (sp) {
      sp.cancel();
      var u = new SpeechSynthesisUtterance(word);
      u.lang = 'en-US';
      u.rate = 0.8;
      sp.speak(u);
    }
  } catch(e) {}
}

// ==================== 设置页 ====================
function showSettings() {
  showScreen('settings');
  var settings = Storage.getSettings();
  document.getElementById('sound-toggle').textContent = settings.sound ? '音效：开' : '音效：关';
  updateUserDisplay();
}

function toggleSound() {
  var settings = Storage.getSettings();
  settings.sound = !settings.sound;
  Sound.setEnabled(settings.sound);
  Storage.updateSettings({ sound: settings.sound });
  document.getElementById('sound-toggle').textContent = settings.sound ? '音效：开' : '音效：关';
}

function logoutUser() {
  if (!confirm('确定退出登录？本地数据会保留。')) return;
  Storage.logout();
  alert('已退出登录');
  showScreen('home');
  renderLevelMap();
}

function resetAll() {
  if (!confirm('确定重置所有数据？包括关卡进度、小鸡花园等全部清空！')) return;
  Storage.reset();
  alert('数据已重置');
  showScreen('home');
  renderLevelMap();
}

// ==================== 排行榜 ====================
function showLeaderboard() {
  showScreen('leaderboard');
  document.getElementById('leaderboard-content').innerHTML = '<p style="text-align:center;padding:30px;color:#888;">加载中...</p>';
  getLeaderboard()
    .then(function(data) {
      if (data.success && data.list && data.list.length > 0) {
        var html = '<h2 class="rank-title">🏆 英雄榜 TOP10 🏆</h2>';
        data.list.forEach(function(item, i) {
          var medal = i === 0 ? '🥇' : (i === 1 ? '🥈' : (i === 2 ? '🥉' : (i + 1 + '.')));
          var name = item.name || '无名英雄';
          html += '<div class="rank-item ' + (i < 3 ? 'top' : '') + '">' +
            '<span class="rank-medal">' + medal + '</span>' +
            '<span class="rank-name">' + name + '</span>' +
            '<span class="rank-stars">⭐' + item.totalStars + '</span>' +
            '<span class="rank-chicks">🐤' + item.totalChicks + '</span>' +
            '</div>';
        });
        document.getElementById('leaderboard-content').innerHTML = html;
      } else {
        document.getElementById('leaderboard-content').innerHTML =
          '<p style="text-align:center;padding:40px;color:#888;">还没有数据，<br>快去闯关成为第一个上榜的英雄吧！</p>';
      }
    })
    .catch(function(e) {
      document.getElementById('leaderboard-content').innerHTML =
        '<p style="text-align:center;padding:40px;color:#888;">加载失败，请检查网络连接</p>';
    });
  updateUserDisplay();
}

// ==================== 登录/注册页面 ====================
function showLogin() {
  showScreen('login');
  document.getElementById('login-phone').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-name').value = '';
  document.getElementById('login-school').value = '';
  document.getElementById('login-birthdate').value = '';
  document.getElementById('login-msg').textContent = '';
}

function requestCode() {
  var phone = document.getElementById('login-phone').value.trim();
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    document.getElementById('login-msg').textContent = '请输入正确的手机号';
    return;
  }
  document.getElementById('login-msg').textContent = '发送中...';
  sendVerifyCode(phone)
    .then(function(data) {
      if (data.success) {
        document.getElementById('login-msg').textContent = '验证码已发送（开发模式：1234）';
        // 开发模式：自动填入
        document.getElementById('login-code').value = '1234';
        document.getElementById('login-name-group').style = '';
      } else {
        document.getElementById('login-msg').textContent = (data.message || '发送失败');
      }
    })
    .catch(function(e) {
      document.getElementById('login-msg').textContent = '网络错误，请重试';
    });
}

function doLogin() {
  var phone = document.getElementById('login-phone').value.trim();
  var password = document.getElementById('login-password').value.trim();
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    document.getElementById('login-msg').textContent = '请输入正确的手机号';
    return;
  }
  if (!password || password.length < 6) {
    document.getElementById('login-msg').textContent = '密码至少6位';
    return;
  }
  // Get name/school/birthdate (optional for existing users)
  var name = document.getElementById('login-name').value.trim();
  var school = document.getElementById('login-school').value.trim();
  var birthdate = document.getElementById('login-birthdate').value.trim();
  document.getElementById('login-msg').textContent = '登录中...';
  registerUser(phone, password, name, school, birthdate)
    .then(function(data) {
      if (data.success) {
        Storage.saveUser({ id: data.user.id, phone: data.user.phone, name: data.user.name, school: data.user.school, token: data.token, isNew: data.isNew });
        document.getElementById('login-msg').textContent = '登录成功！';
        setTimeout(function() {
          if (data.isNew) {
            finishIntro();
          } else {
            showReturnScreen();
          }
        }, 500);
      } else {
        document.getElementById('login-msg').textContent = data.error || '登录失败，请重试';
      }
    })
    .catch(function(e) {
      document.getElementById('login-msg').textContent = '网络错误，请重试';
    });
}


// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
  Storage.init();
  Sound.init();
  renderLevelMap();
  // 检查是否登录
  if (Storage.isLoggedIn()) {
    showScreen('home');
  } else {
    showLogin();
  }
  // 返回键
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
    window.Capacitor.Plugins.App.addListener('backButton', function() {
      var active = document.querySelector('.screen.active');
      if (active && active.id === 'home') {
        // 最小化
        try { window.Capacitor.Plugins.App.minimize(); } catch(e) {}
      } else if (active) {
        goBack();
      }
    });
  } else if (document.addEventListener) {
    document.addEventListener('backbutton', function() {
      var active = document.querySelector('.screen.active');
      if (active && active.id === 'home') {
        try { navigator.app && navigator.app.minimize && navigator.app.minimize(); } catch(e) {}
      } else if (active) {
        goBack();
      }
    });
  }
});
