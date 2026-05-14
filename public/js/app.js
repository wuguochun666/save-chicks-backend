
// ==================== API 配置 ====================
// Railway 后端地址(部署后替换)
const API_BASE = 'https://save-chicks-backend-production.up.railway.app';

// ==================== 通用工具函数 ====================
function showToast(message, duration) {
  duration = duration || 2000;
  var toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:12px 24px;border-radius:24px;font-size:14px;z-index:9999;animation:toastFadeIn 0.3s;';
  document.body.appendChild(toast);
  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(function() { toast.remove(); }, 300);
  }, duration);
}

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

// 登录(已有用户)
function loginUser(phone, password) {
  return apiFetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ phone: phone, password: password })
  });
}

// 提交分数
function submitScore(starsPerLevel) {
  // apiFetch 自动附加 Authorization: Bearer <token>
  return apiFetch('/api/score', {
    method: 'POST',
    body: JSON.stringify({ starsPerLevel: starsPerLevel })
  });
}

// 获取排行榜
function getLeaderboard() {
  return apiFetch('/api/leaderboard');
}

// ==================== 权限检查 ====================
function checkLogin(actionName) {
  if (!Storage.isLoggedIn()) {
    showLogin();
    return false;
  }
  return true;
}

// 统一导航入口(带权限检查)
function navTo(screen) {
  if (screen === 'garden') { if (!checkLogin()) return; renderGarden(); }
  else if (screen === 'vocab') { if (!checkLogin()) return; renderVocab(); }
  else if (screen === 'wrong-answers') { renderWrongAnswers(); return; }
  else if (screen === 'leaderboard') { if (!checkLogin()) return; showLeaderboard(); return; }
  else if (screen === 'achievements') { if (!checkLogin()) return; renderAchievements(); return; }
  showScreen(screen);
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
}
// v81: Background Music System
var Music = {
  enabled: false,
  volume: 50,
  _audio: null,
  _tracks: [
    { name: 'Piano Dreams', freqs: [262, 330, 392, 523, 392, 330, 262, 294, 349, 440, 349, 294] },
    { name: 'Ocean Waves', freqs: [196, 220, 262, 294, 262, 220, 196, 175, 196, 220, 262, 220] },
    { name: 'Forest Calm', freqs: [330, 392, 440, 523, 440, 392, 330, 294, 330, 392, 440, 392] },
    { name: 'Morning Light', freqs: [392, 440, 494, 523, 494, 440, 392, 349, 392, 440, 494, 440] },
    { name: 'Study Focus', freqs: [262, 294, 330, 349, 392, 440, 494, 523, 494, 440, 392, 349] }
  ],
  _currentTrack: 0,
  _isPlaying: false,
  _ctx: null,
  _gainNode: null,
  _loopInterval: null,
  
  init: function() {
    var settings = Storage.getSettings();
    this.enabled = settings.music || false;
    this.volume = settings.musicVolume || 50;
    this._currentTrack = 0;
  },
  
  _getCtx: function() {
    if (!this._ctx) {
      try { this._ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { return null; }
    }
    if (this._ctx && this._ctx.state === 'suspended') this._ctx.resume();
    return this._ctx;
  },
  
  play: function() {
    if (!this.enabled) return;
    var ctx = this._getCtx();
    if (!ctx) return;
    
    this._isPlaying = true;
    var track = this._tracks[this._currentTrack];
    var self = this;
    
    function playNote(freq, startTime, duration) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      var vol = (self.volume / 100) * 0.15;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    }
    
    function playTrack() {
      if (!self._isPlaying || !self.enabled) return;
      var now = ctx.currentTime;
      var noteLen = 0.8;
      track.freqs.forEach(function(freq, i) {
        playNote(freq, now + i * noteLen, noteLen * 0.9);
      });
      // Schedule next loop
      self._loopInterval = setTimeout(playTrack, track.freqs.length * noteLen * 1000);
    }
    
    playTrack();
  },
  
  stop: function() {
    this._isPlaying = false;
    if (this._loopInterval) {
      clearTimeout(this._loopInterval);
      this._loopInterval = null;
    }
  },
  
  toggle: function() {
    if (this._isPlaying) {
      this.stop();
    } else {
      this.play();
    }
    this.enabled = this._isPlaying;
    Storage.updateSettings({ music: this.enabled });
    return this.enabled;
  },
  
  setVolume: function(vol) {
    this.volume = Math.max(0, Math.min(100, vol));
    Storage.updateSettings({ musicVolume: this.volume });
  },
  
  nextTrack: function() {
    this._currentTrack = (this._currentTrack + 1) % this._tracks.length;
    if (this._isPlaying) {
      this.stop();
      this.play();
    }
    return this._tracks[this._currentTrack].name;
  },
  
  getTrackName: function() {
    return this._tracks[this._currentTrack].name;
  }
};

;

// ==================== 全局变量 ====================
var currentLevel = 0;
var currentQuestionIndex = 0;
var answers = [];
var selectedAnswers = [];
var _isPaused = false;
var _pendingNextQuestion = false;
var _nextQuestionTimer = null;

// v44 阅读理解闯关状态
var readingQuizState = {
  active: false,
  questions: [],
  currentIndex: 0,
  correctCount: 0,
  streakCount: 0,
  timerInterval: null,
  timeLeft: 0,
  levelIndex: null,
  results: []
};

// RESCUE_LEVELS: 每3关救1只小鸡(关卡索引从0开始:2,5,8...)
var RESCUE_LEVELS = [2,5,8,11,14,17,20,23,26,29];
var TOTAL_LEVELS = 30;
var LEVELS_PER_CHICK = 3;
var screenHistory = [];

// v43 词汇复习模式状态
var vocabReviewState = {
  words: [],
  currentIndex: 0,
  levelIndex: null
};

// 全屏阅读状态
var _isFullscreenArticle = false;

// ==================== 页面导航 ====================
// 首页按钮 - 显示主页
function goHome() {
  showScreen('home');
}

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

// 更新导航栏登录/注册按钮状态
function updateNavButtons() {
  var loggedIn = Storage.isLoggedIn();
  var loginBtn = document.getElementById('nav-login-btn');
  var logoutBtn = document.getElementById('nav-logout-btn');
  if (loginBtn) {
    loginBtn.style.display = loggedIn ? 'none' : '';
  }
  if (logoutBtn) {
    logoutBtn.style.display = loggedIn ? '' : 'none';
  }
}

// ==================== 开场动画 ====================
function showIntro() {
  // 首次进入:播放视频动画
  // 非首次:跳过直接到归来页
  var played = Storage.get(Storage.KEYS.PLAYED);
  if (played) {
    finishIntro();
    return;
  }

  var html = '<video id="intro-video" autoplay playsinline ' +
    'style="width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;z-index:1;">' +
    '<source src="assets/intro.mp4" type="video/mp4">' +
    '</video>' +
    '<div id="intro-overlay" style="position:absolute;bottom:0;left:0;right:0;z-index:2;display:flex;flex-direction:column;align-items:center;gap:12px;padding-bottom:24px;">' +
    '<p id="intro-hint" style="color:#ffd700;font-size:1.1em;text-shadow:1px 1px 2px rgba(0,0,0,0.8);"></p>' +
    '<button id="intro-skip-btn" style="padding:12px 28px;background:rgba(255,255,255,0.25);border:2px solid #fff;border-radius:24px;color:#fff;font-size:1em;cursor:pointer;backdrop-filter:blur(4px);">跳过动画</button>' +
    '</div>';
  document.getElementById('intro-content').innerHTML = html;
  showScreen('intro-screen');

  var video = document.getElementById('intro-video');
  var skipBtn = document.getElementById('intro-skip-btn');
  var hint = document.getElementById('intro-hint');

  // 视频播放结束自动跳转
  video.addEventListener('ended', function() {
    finishIntro();
  });

  // 视频可以播放时,尝试取消静音(某些浏览器允许)
  video.addEventListener('canplay', function() {
    video.muted = false;
    video.play().catch(function(){
      // 如果自动播放带声音失败,保持静音等用户交互
      video.muted = true;
      video.play();
    });
  });

  // 点击屏幕取消静音
  document.getElementById('intro-screen').addEventListener('click', function(e) {
    if (e.target === skipBtn) return; // 跳过按钮单独处理
    video.muted = false;
    video.play().catch(function(){});
  }, { once: true });

  // 跳过按钮
  skipBtn.addEventListener('click', function() {
    video.pause();
    finishIntro();
  });

  // 更新提示文字
  video.addEventListener('playing', function() {
    hint.textContent = '点击屏幕开启声音';
  });
}

function finishIntro() {
  if (!Storage.get(Storage.KEYS.PLAYED)) {
    Storage.set(Storage.KEYS.PLAYED, true);
  }
  // 提交本地数据到服务器(异步,不阻塞)
  if (Storage.isLoggedIn()) {
    syncToServer();
  }
  Sound.stopBgMusicIntro();
  // 根据登录状态决定跳转页面
  if (Storage.isLoggedIn()) {
    showReturnScreen();
  } else {
    showLogin();
  }
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
    '<p>已救回 <strong style="color:#4CAF50">' + saved + '</strong> 只,还差 <strong style="color:#ff6b6b">' + remaining + '</strong> 只</p>';
  updateUserDisplay();
  updateNavButtons();
}

// ==================== 关卡地图 ====================
function renderLevelMap() {
  var progress = Storage.get(Storage.KEYS.PROGRESS) || Array(TOTAL_LEVELS).fill(null).map(function() { return { passed: false, score: 0, stars: 0 }; });
  var chicks = Storage.get(Storage.KEYS.CHICKS) || Array(10).fill(false);
  var maxUnlocked = getUnlockedUntil();

  var html = '<h2 class="map-title" style="text-align:center;font-size:1.3em;color:#4a3728;padding:8px;">🌟 拯救小鸡之旅 🌟</h2>';
  html += '<div class="map-path">';

  for (var i = 0; i < TOTAL_LEVELS; i++) {
    var p = progress[i] || { passed: false, score: 0, stars: 0 };
    var isRescue = RESCUE_LEVELS.indexOf(i) !== -1;
    var chickIdx = RESCUE_LEVELS.indexOf(i);
    var chickRescued = chickIdx !== -1 && chicks[chickIdx];
    var isLocked = i > maxUnlocked;
    var story = STORIES[i];
    var typeLabel = '';
    if (story && story.type === 'grammar') typeLabel = '📝';
    else if (story && story.type === 'fill') typeLabel = '✏️';

    var title = story ? (story.titleCN || story.title || '') : '';
    if (title.length > 6) title = title.substring(0, 6) + '...';

    // 蛇形路径:每行5个,交替左右方向
    var row = Math.floor(i / 5);
    var col = i % 5;
    var isEvenRow = row % 2 === 0;
    var posCol = isEvenRow ? col : (4 - col);

    var cls = 'map-node';
    if (p.passed) cls += ' passed';
    else if (!isLocked) cls += ' available';
    else cls += ' locked';
    if (isRescue) cls += ' rescue';
    if (chickRescued) cls += ' rescued';

    html += '<div class="' + cls + '" style="grid-column:' + (posCol + 1) + ';grid-row:' + (row + 1) + ';"' +
      (isLocked ? '' : ' onclick="startLevel(' + i + ')"') + '>';

    // 连接线(非首节点)
    if (i > 0) {
      html += '<div class="map-connector"></div>';
    }

    html += '<div class="map-node-circle">';
    if (isLocked) {
      html += '<span class="map-lock">🔒</span>';
    } else if (isRescue && !chickRescued) {
      html += '<span class="map-chick-goal">🏆</span>';
    } else if (chickRescued) {
      html += '<span class="map-chick-done">🐤</span>';
    } else if (p.passed) {
      html += '<span class="map-check">✅</span>';
    } else {
      html += '<span class="map-num">' + (i + 1) + '</span>';
    }
    html += '</div>';

    // 关卡名
    html += '<div class="map-node-label">' + title + '</div>';

    // 星星
    if (p.stars > 0) {
      html += '<div class="map-stars">' + '⭐'.repeat(p.stars) + '</div>';
    }

    // 类型标签
    if (typeLabel && !isLocked) {
      html += '<div class="map-type">' + typeLabel + '</div>';
    }

    html += '</div>';
  }

  html += '</div>';
  document.getElementById('level-grid-container').innerHTML = html;
  updateUserDisplay();
}

// ==================== 进入关卡(带开场动画) ====================
var _pendingLevel = 0;
// ==================== v36 跳级解锁 ====================
// 前3关全3星 → 自动解锁第4-6关(前3关跳级)
// 每连续3关全3星 → 再解锁后续3关(最多一次跳6关)
function getUnlockedUntil() {
  var progress = Storage.get(Storage.KEYS.PROGRESS) || [];
  var unlocked = 3; // 默认解锁前3关(0,1,2)
  var skip = false;
  // 检查每连续3关是否全3星
  for (var i = 0; i < TOTAL_LEVELS - 1; i += 3) {
    var block = [];
    for (var j = i; j < i + 3 && j < TOTAL_LEVELS; j++) {
      var p = progress[j];
      block.push(p && p.stars === 3);
    }
    // 如果这个3关块全3星 → 下一块解锁
    if (block.length === 3 && block.every(function(b) { return b; })) {
      if (i + 3 < TOTAL_LEVELS) {
        unlocked = i + 6; // 解锁到 i+6 关(即下一个block全部解锁)
      } else {
        unlocked = TOTAL_LEVELS;
      }
    } else {
      break; // 遇到非全3星块,停止
    }
  }
  return Math.min(unlocked, TOTAL_LEVELS);
}

function startLevel(levelIndex) {
  // v36 初始化答题数据
  answers = [];
  selectedAnswers = [];
  _isPaused = false;
  _pendingNextQuestion = false;
  if (_nextQuestionTimer) { clearTimeout(_nextQuestionTimer); _nextQuestionTimer = null; }
  // v36 跳级:检查是否已解锁
  var maxUnlocked = getUnlockedUntil();
  if (levelIndex > maxUnlocked) {
    // 计算跳级条件提示
    var blockStart = Math.floor(levelIndex / 3) * 3;
    var hint = '需要第 ' + (blockStart + 1) + '-' + (blockStart + 3) + ' 关全部获得三星才能解锁此关!';
    alert(hint);
    return;
  }
  if (!checkLogin('闯关')) return;
  // 检查登录状态
  if (!checkLogin('闯关')) return;

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
    messages.push('认真学习,进步更大!');
  } else {
    messages.push(story.titleCN || story.title || '阅读理解');
    if (story.title) messages.push(story.title.substring(0, 40));
  }
  if (isRescue && !chickRescued) {
    messages.push('⏰ 即将营救!');
    messages.push('通关后救回第 ' + (chickIdx + 1) + ' 只小鸡!');
  }
  messages.push('准备好开始答题了吗?');
  playEntryAnimation(messages, function() {
    showScreen('quiz-screen');
    renderQuestion();
  });
}

function playEntryAnimation(messages, callback) {
  var container = document.getElementById('entry-screen');
  if (!container) { callback && callback(); return; }
  // 入场动画期间隐藏底部导航栏
  var bottomNav = document.querySelector('.bottom-nav');
  if (bottomNav) bottomNav.style.display = 'none';
  showScreen('entry-screen', true);
  var content = document.getElementById('entry-content');
  var progressFill = document.getElementById('entry-progress-fill');
  var progressText = document.getElementById('entry-progress-text');
  if (!content || !progressFill) { callback && callback(); return; }
  content.innerHTML = '';
  if (progressFill) progressFill.style.width = '0%';
  if (progressText) progressText.textContent = '0%';
  var elapsed = 0;
  var totalTime = 5000;
  var lastType = 0;
  var rafId = null;
  var typeCount = 0;
  var complete = false;
  var msgIdx = 0;
  var charIdx = 0;
  var line = '';
  function typeNextChar() {
    if (complete) return;
    if (msgIdx >= messages.length) {
      // 所有消息打完 → 延迟触发 callback
      complete = true;
      if (progressFill) progressFill.style.width = '100%';
      if (progressText) progressText.textContent = '100%';
      setTimeout(function() {
        cancelAnimationFrame(rafId);
        // 恢复底部导航栏
        var bottomNav = document.querySelector('.bottom-nav');
        if (bottomNav) bottomNav.style.display = '';
        callback && callback();
      }, 400);
      return;
    }
    if (waitingNext) {
      // 消息间间隔,刚显示完上一条,等 400ms 后开始下一条
      waitingNext = false;
      charIdx = 0;
      line = '';
      setTimeout(typeNextChar, 400);
      return;
    }
    if (charIdx < messages[msgIdx].length) {
      // 打字
      line += messages[msgIdx][charIdx];
      charIdx++;
      content.innerHTML = '<p>' + line + '<span class="blink-cursor">|</span></p>';
      if (typeCount === 0 || (Date.now() - lastType > 80)) {
        try { Sound.play('type'); } catch(e) {}
        lastType = Date.now();
        typeCount = 0;
      }
      typeCount++;
      setTimeout(typeNextChar, 100);
    } else {
      // 当前消息打完
      content.innerHTML = '<p>' + line + '</p>';
      msgIdx++;
      if (msgIdx < messages.length) {
        // 还有下一条:等 500ms 后进入下一条
        waitingNext = true;
        setTimeout(typeNextChar, 500);
      } else {
        // 全部打完
        typeNextChar(); // 立即递归,会进入上面的 complete 块
      }
    }
  }
  var waitingNext = false;
  typeNextChar();
  function animate(ts) {
    if (!startTime) startTime = ts;
    elapsed = ts - startTime;
    var pct = Math.min(100, Math.round((elapsed / totalTime) * 100));
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressText) progressText.textContent = pct + '%';
    if (elapsed < totalTime && !complete) {
      rafId = requestAnimationFrame(animate);
    }
  }
  var startTime = null;
  rafId = requestAnimationFrame(animate);
}

// ==================== 答题界面 ====================
// ==================== v36 多题型答题引擎 ====================
// 题目类型: 'choice'(选择题,默认)| 'truefalse'(判断题)| 'fill'(填空题)
// 题目结构:
//   choice:   { q: '...', options: [...], answer: 0 }
//   truefalse: { q: '...', answer: true/false, explanation: '...' }
//   fill:      { q: '...', answer: 'word', explanation: '...' }  // q中含占位符___会被替换

// ==================== v38 单词点击发音(答题界面) ====================
function initArticleClickToSpeak() {
  var articleEl = document.getElementById('quiz-article');
  if (!articleEl) return;
  // 移除旧的事件监听器,防止重复绑定
  articleEl.removeEventListener('click', handleArticleClick);
  articleEl.addEventListener('click', handleArticleClick);
  articleEl.addEventListener('contextmenu', handleArticleClick);
  var longTimer = null;
  articleEl.addEventListener('touchstart', function(e) {
    var self = this;
    longTimer = setTimeout(function() {
      longTimer = null;
      if (!document.elementFromPoint) return;
      var el2 = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
      if (!el2 || el2 === articleEl) return;
      var tn = findTextNode(el2);
      if (!tn) return;
      var w = getWordFromElement(el2, tn);
      if (w && w.length > 1 && w.length <= 30) {
        var fe = { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY, type: 'contextmenu', preventDefault: function(){}, stopPropagation: function(){}, longPress: true };
        showWordContextMenu(fe, w, '', '');
      }
    }, 600);
  }, { passive: true });
  articleEl.addEventListener('touchend', function() { if (longTimer) { clearTimeout(longTimer); longTimer = null; } });
  articleEl.addEventListener('touchmove', function() { if (longTimer) { clearTimeout(longTimer); longTimer = null; } });
}


// v47 生词本 - 右键/长按加入生词本
function showWordContextMenu(e, word, meaning, sentence) {
  var existing = document.getElementById('word-context-menu');
  if (existing) existing.remove();
  var menu = document.createElement('div');
  menu.id = 'word-context-menu';
  menu.style.cssText = 'position:fixed;z-index:99999;background:#fff;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.15);padding:8px 0;min-width:180px;font-size:0.95em;';
  menu.innerHTML = '<div onclick="handleAddToVocabBook(\'' + word.replace(/'/g, "\'") + '\')" style="padding:10px 16px;cursor:pointer;color:#4a3728;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background=''">📚 加入生词本</div><div onclick="playWordFromMenu(\'' + word.replace(/'/g, "\'") + '\')" style="padding:10px 16px;cursor:pointer;color:#666;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background=''">🔊 发音</div><div onclick="hideWordContextMenu()" style="padding:10px 16px;cursor:pointer;color:#999;border-top:1px solid #eee;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background=''">取消</div>';
  document.body.appendChild(menu);
  var x = e.clientX || e.pageX || 100;
  var y = e.clientY || e.pageY || 100;
  menu.style.left = Math.min(x, window.innerWidth - 200) + 'px';
  menu.style.top = Math.min(y, window.innerHeight - 120) + 'px';
  e.preventDefault();
  e.stopPropagation();
}
function hideWordContextMenu() {
  var m = document.getElementById('word-context-menu');
  if (m) m.remove();
}
function handleAddToVocabBook(word) {
  var story = STORIES[currentLevel];
  var meaning = '';
  if (story && story.vocabulary) {
    var vocabItem = story.vocabulary.find(function(v) { return v.word.toLowerCase() === word.toLowerCase(); });
    if (vocabItem) meaning = vocabItem.meaning || '';
  }
  var articleTitle = story ? story.title : '';
  var added = Storage.addToVocabBook(word, meaning, '', currentLevel, articleTitle);
  if (added) Storage.recordWordLearned(); // v50 记录学习单词
  hideWordContextMenu();
  showToast(added ? '已加入生词本 📖' : '生词本已有该单词');
}
function playWordFromMenu(word) {
  var utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  utterance.rate = 0.85;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
  hideWordContextMenu();
}

function handleArticleClick(e) {
  // 如果点击的是词汇区的单词,已由 vocab-item-inline 处理,跳过
  if (e.target.closest('.vocab-item-inline')) return;
  var el = e.target;
  // 向上找到最近的文字节点元素(span / strong / em 等,或纯文字节点包裹的父元素)
  var textNode = findTextNode(el);
  if (!textNode) return;
  var word = getWordFromElement(el, textNode);
  if (word && word.length > 1 && word.length <= 30) {
    // right-click or longPress: show vocab book menu
    if (e.type === 'contextmenu' || e.longPress) {
      var story2 = STORIES[currentLevel];
      var m2 = '';
      if (story2 && story2.vocabulary) {
        var vi = story2.vocabulary.find(function(v) { return v.word.toLowerCase() === word.toLowerCase(); });
        if (vi) m2 = vi.meaning || '';
      }
      showWordContextMenu(e, word, m2, '');
      return;
    }
    speakWord(word);
    // v43 记录点击的单词
    var story = STORIES[currentLevel];
    var meaning = '';
    if (story && story.vocabulary) {
      var vocabItem = story.vocabulary.find(function(v) { return v.word.toLowerCase() === word.toLowerCase(); });
      if (vocabItem) meaning = vocabItem.meaning;
    }
    Storage.addClickedWord(currentLevel, word, meaning);
  }
}

function findTextNode(el) {
  // 向上最近包含文字的 DOM 元素
  while (el && el !== document.body && el.id === 'quiz-article') el = el.parentElement;
  if (!el || el === document.body) return null;
  // 检查这个元素本身是否有文字内容
  if (el.childNodes.length === 0) return null;
  // 如果是文本节点直接返回
  if (el.nodeType === Node.TEXT_NODE) return el;
  // 返回元素本身(包含文字)
  return el;
}

function getWordFromElement(el, textNode) {
  // 优先取 data-word 属性
  if (el.hasAttribute('data-word')) return el.getAttribute('data-word');
  // 取 data-vword 属性
  if (el.hasAttribute('data-vword')) return el.getAttribute('data-vword');
  // 如果是词汇区的 emoji 按钮,不触发(vocab-item-inline 已处理)
  if (el.classList && el.classList.contains('vocab-item-inline')) return null;
  // 取 textContent
  var text = el.textContent || '';
  text = text.trim();
  if (!text) return null;
  // 取最后一个纯英文单词
  var words = text.match(/[a-zA-Z]+/g);
  if (!words || words.length === 0) return null;
  return words[words.length - 1];
}

function renderQuestion() {
  var story = STORIES[currentLevel];
  if (!story || currentQuestionIndex >= story.questions.length) {
    finishLevel();
    return;
  }
  var q = story.questions[currentQuestionIndex];
  var qType = q.type || 'choice'; // 默认选择题

  // v44 修复: 添加 null 检查,防止在非答题页面调用时出错
  var levelInfoEl = document.getElementById('quiz-level-info');
  var articleEl = document.getElementById('quiz-article');
  var vocabAreaEl = document.getElementById('quiz-vocab-area');
  if (!levelInfoEl || !articleEl || !vocabAreaEl) {
    console.log('renderQuestion: elements not ready, skipping');
    return;
  }

  levelInfoEl.innerHTML =
    '<span class="qlevel">' + (currentQuestionIndex + 1) + ' / ' + story.questions.length + '</span>';

  // 显示文章(可点击英文单词发音)
  var article = story.text || story.article || '';
  articleEl.innerHTML = '<div class="article-text">' + article + '</div>';
  // v38 初始化文章点击发音
  initArticleClickToSpeak();

  // 显示词汇(点击发音)
  var vocabHtml = '';
  if (story.vocabulary && story.vocabulary.length > 0) {
    vocabHtml = '<div class="quiz-vocab"><h4>📝 本关词汇(点击🔊发音)</h4><div class="vocab-grid">';
    story.vocabulary.forEach(function(v) {
      vocabHtml += '<div class="vocab-item-inline" data-vword="' + v.word + '">' +
        '<span>🔊</span>' +
        '<span class="vocab-text-sm">' + v.word + '</span>' +
        '<span class="vocab-meaning-inline">' + v.meaning + '</span>' +
        '</div>';
    });
    vocabHtml += '</div></div>';
  }
  vocabAreaEl.innerHTML = vocabHtml;
  document.querySelectorAll('#quiz-vocab-area .vocab-item-inline').forEach(function(el) {
    el.onclick = function() { var w = this.getAttribute('data-vword'); if (w) speakWord(w); };
  });

  // 渲染题目(按类型)
  var qText = q.q || q.question || '';
  var html = '';

  if (qType === 'choice') {
    // 选择题:ABCDE 选项
    html += '<p class="qtext">' + qText + '</p><div class="options">';
    (q.options || []).forEach(function(opt, i) {
      html += '<div class="option-btn" data-opt-idx="' + i + '">' + ('ABCDE')[i] + '. ' + opt + '</div>';
    });
    html += '</div>';
  } else if (qType === 'truefalse') {
    // 判断题
    html += '<p class="qtext">' + qText + '</p><div class="options">';
    html += '<div class="option-btn" data-opt-idx="1">A. 正确 (True)</div>';
    html += '<div class="option-btn" data-opt-idx="0">B. 错误 (False)</div>';
    html += '</div>';
  } else if (qType === 'fill') {
    // 填空题:把 ___ 替换为输入框
    var filledText = qText.replace(/___+/g,
      '<input type="text" class="fill-blank-input" id="fill-input" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="_____">'
    );
    html += '<p class="qtext fill-blank-container">' + filledText + '</p>';
    html += '<div style="text-align:center;margin-top:16px;">' +
      '<button class="option-btn" style="display:inline-block;width:auto;padding:12px 32px;background:#4a90d9;color:white;border-color:#4a90d9;" id="fill-submit-btn">确定答案</button>' +
      '</div>';
  }

  document.getElementById('quiz-content').innerHTML = html;
  updateQuizProgress();
  animateNewDot(); // v51 highlight current dot

  // 绑定答题事件(innerHTML 不会执行 <script>,改用 eval)
  if (qType === 'choice' || qType === 'truefalse') {
    try {
      eval('document.querySelectorAll(".option-btn[data-opt-idx]").forEach(function(b){b.onclick=function(){selectAnswer(parseInt(this.getAttribute("data-opt-idx")));};});');
    } catch(e) {}
  } else if (qType === 'fill') {
    try {
      eval('(function(){var fillBtn=document.getElementById("fill-submit-btn");if(fillBtn){fillBtn.onclick=function(){var val=document.getElementById("fill-input");if(val){selectAnswer(val.value.trim());}}};var fillInp=document.getElementById("fill-input");if(fillInp){fillInp.onkeydown=function(e){if(e.key==="Enter"){selectAnswer(this.value.trim());}};fillInp.focus();}})();');
    } catch(e) {}
  }

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
  var story = STORIES[currentLevel];
  var article = story.text || story.article || '';
  if (!article) return;
  var text = article.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

  // 优先使用 Capacitor TTS 插件(Android/iOS 原生)
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.TextToSpeech) {
    Capacitor.Plugins.TextToSpeech.speak({
      text: text,
      lang: 'en-US',
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0
    }).catch(function(e) {
      console.log('Capacitor TTS failed, fallback to Web Speech API', e);
      webSpeak(text);
    });
  } else {
    webSpeak(text);
  }
}

// 全屏阅读文章
function toggleFullscreenArticle() {
  var articleEl = document.getElementById('quiz-article');
  var overlay = document.getElementById('fullscreen-article-overlay');
  if (!articleEl) return;

  if (_isFullscreenArticle) {
    // 退出全屏
    if (overlay) overlay.remove();
    _isFullscreenArticle = false;
    return;
  }

  // 进入全屏
  _isFullscreenArticle = true;
  var story = STORIES[currentLevel];
  var article = story.text || story.article || '';
  var title = story.titleCN || story.title || '';

  overlay = document.createElement('div');
  overlay.id = 'fullscreen-article-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#fff8e1;z-index:999;display:flex;flex-direction:column;padding:16px;overflow-y:auto;';
  overlay.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-shrink:0;">' +
      '<h3 style="color:#4a3728;font-size:1.1em;flex:1;">' + title + '</h3>' +
      '<button onclick="toggleFullscreenArticle()" style="background:#4a3728;color:white;border:none;border-radius:8px;padding:8px 16px;font-size:0.9em;cursor:pointer;">返回答题</button>' +
    '</div>' +
    '<div style="font-size:1.15em;color:#5d4037;line-height:2;flex:1;overflow-y:auto;">' + article + '</div>' +
    '<div style="flex-shrink:0;text-align:center;padding:8px 0;margin-top:8px;">' +
      '<button onclick="readArticle()" style="background:#ff9800;color:white;border:none;border-radius:8px;padding:8px 20px;font-size:0.9em;cursor:pointer;">🔊 朗读全文</button>' +
    '</div>';
  document.body.appendChild(overlay);
}

// Web Speech API 降级函数
function webSpeak(text) {
  var sp = window.speechSynthesis;
  if (!sp) {
    alert('您的设备不支持语音朗读');
    return;
  }
  sp.cancel();
  var u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.9;
  var voices = sp.getVoices();
  if (voices.length === 0) {
    sp.onvoiceschanged = function() {
      voices = sp.getVoices();
      var enVoice = voices.find(function(v) { return v.lang.indexOf('en') === 0; });
      if (enVoice) u.voice = enVoice;
      sp.speak(u);
    };
  } else {
    var enVoice = voices.find(function(v) { return v.lang.indexOf('en') === 0; });
    if (enVoice) u.voice = enVoice;
    sp.speak(u);
  }
}

// v36 selectAnswer:支持选择题/判断题/填空题 + 错题收集 + 答题反馈
function selectAnswer(userInput) {
  var story = STORIES[currentLevel];
  var q = story.questions[currentQuestionIndex];
  var qType = q.type || 'choice';

  var correct = false;
  var correctDisplay = '';
  var userDisplay = '';
  var options = [];

  if (qType === 'choice' || qType === 'truefalse') {
    // 选择/判断题:index 是选项序号
    var idx = parseInt(userInput);
    var correctIdx = (q.answer !== undefined) ? q.answer : q.correct;
    correct = (idx === Number(correctIdx));

    // 选项展示文字
    if (qType === 'choice') {
      options = q.options || [];
      correctDisplay = ('ABCDE')[correctIdx] + '. ' + (options[correctIdx] || '');
      userDisplay = ('ABCDE')[idx] + '. ' + (options[idx] || '');
    } else {
      Storage.resetQuizStreak(); // v86
      options = ['错误 (False)', '正确 (True)'];
      correctDisplay = Number(correctIdx) === 1 ? 'A. 正确 (True)' : 'B. 错误 (False)';
      userDisplay = idx === 1 ? 'A. 正确 (True)' : 'B. 错误 (False)';
    }

    // 高亮选项
    var opts = document.querySelectorAll('.option-btn');
    opts.forEach(function(opt, i) {
      opt.onclick = null;
      if (qType === 'choice') {
        if (i === correctIdx) opt.classList.add('correct');
        else if (i === idx && !correct) opt.classList.add('wrong');
      } else {
        // truefalse: idx1=A(正确), idx0=B(错误)
        if (i === correctIdx) opt.classList.add('correct');
        else if (i === idx && !correct) opt.classList.add('wrong');
      }
    });

  } else if (qType === 'fill') {
    // 填空题:userInput 是填入的文字
    var correctAns = (q.answer || '').toLowerCase().trim();
    var userAns = (userInput || '').toLowerCase().trim();
    correct = (userAns === correctAns);
    correctDisplay = correctAns;
    userDisplay = userAns;

    var inp = document.getElementById('fill-input');
    if (inp) {
      inp.readOnly = true;
      inp.onkeydown = null;
      inp.value = correctAns + (correct ? '' : ' ← 你的: ' + userAns);
      inp.classList.add(correct ? 'correct' : 'wrong');
    }
    var fillBtn = document.getElementById('fill-submit-btn');
    if (fillBtn) fillBtn.style.display = 'none';
  }

  answers.push(correct);
  updateQuizProgress(); // v51 update progress after each answer
  selectedAnswers.push(userInput);
  Sound.play(correct ? 'win' : 'fail');
  // v86: Track quiz streak
  if (correct) {
    Storage.incrementQuizStreak();
  } else {
    Storage.resetQuizStreak();
  }

  // === 答错:收集到错题本 + 加入词汇本 ===
  if (!correct) {
    var explanation = q.explanation || '';
    Storage.addWrongAnswer(
      currentLevel,
      q,
      userDisplay,
      correctDisplay,
      options,
      explanation
    );
    // 随机把一个生词加入词汇本
    if (story.vocabulary && story.vocabulary.length > 0) {
      var randomVocab = story.vocabulary[Math.floor(Math.random() * story.vocabulary.length)];
      Storage.addVocab(randomVocab.word, randomVocab.meaning);
      Storage.markVocabForReview(randomVocab.word);
    }
  }

  // === v36 答题反馈:显示正确答案 + 中文解析 ===
  var feedbackHtml = '';
  if (!correct) {
    feedbackHtml = '<div class="qa-feedback">' +
      '<div class="qa-wrong-text">❌ 你的答案:' + userDisplay + '</div>' +
      '<div class="qa-correct-text">✅ 正确答案:' + correctDisplay + '</div>';
    if (q.explanation) {
      feedbackHtml += '<div class="qa-explanation">📖 解析:' + q.explanation + '</div>';
    }
    feedbackHtml += '</div>';
  } else {
      Storage.resetQuizStreak(); // v86
    feedbackHtml = '<div class="qa-feedback" style="border-left-color:#4CAF50;background:#e8f5e9;">' +
      '<div class="qa-correct-text" style="font-size:1em;">✅ 正确!</div></div>';
  }

  // 插入反馈(追加到 quiz-content 底部)
  var quizContent = document.getElementById('quiz-content');
  if (quizContent) {
    quizContent.innerHTML += feedbackHtml;
    quizContent.scrollTop = quizContent.scrollHeight;
  }

  // 自动进入下一题(暂停时延迟执行)
  var delay = correct ? 1200 : 2500; // 答对快一点,答错给时间看解析
  _nextQuestionTimer = setTimeout(function() {
    if (_isPaused) {
      // 暂停中,等恢复后再跳转
      _pendingNextQuestion = true;
      return;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex >= story.questions.length) {
      finishLevel();
    } else {
      Storage.resetQuizStreak(); // v86
      renderQuestion();
    }
  }, delay);
}

function skipQuiz() {
  currentQuestionIndex = story.questions.length;
  finishLevel();
}

// ==================== v37 暂停功能 ====================

function togglePause() {
  if (!_isPaused) {
    // 暂停
    _isPaused = true;
    var overlay = document.createElement('div');
    overlay.id = 'pause-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9000;display:flex;flex-direction:column;align-items:center;justify-content:center;';
    overlay.innerHTML =
      '<div style="text-align:center;">' +
        '<div style="font-size:48px;margin-bottom:16px;">⏸️</div>' +
        '<div style="color:#fff;font-size:1.5em;font-weight:bold;margin-bottom:24px;">已暂停</div>' +
        '<button onclick="togglePause()" style="background:#4CAF50;color:white;border:none;border-radius:24px;padding:14px 40px;font-size:1.1em;cursor:pointer;margin:8px;">▶️ 继续答题</button>' +
        '<button onclick="quitFromPause()" style="background:#f44336;color:white;border:none;border-radius:24px;padding:14px 40px;font-size:1.1em;cursor:pointer;margin:8px;">🚪 退出本关</button>' +
      '</div>';
    document.body.appendChild(overlay);
    // 暂停语音朗读
    if (window.speechSynthesis) window.speechSynthesis.pause();
  } else {
    // 恢复
    _isPaused = false;
    var overlay = document.getElementById('pause-overlay');
    if (overlay) overlay.remove();
    // 恢复语音朗读
    if (window.speechSynthesis) window.speechSynthesis.resume();
    // 如果暂停时有待跳转的下一题,现在执行
    if (_pendingNextQuestion) {
      _pendingNextQuestion = false;
      var story = STORIES[currentLevel];
      currentQuestionIndex++;
      if (currentQuestionIndex >= story.questions.length) {
        finishLevel();
      } else {
        renderQuestion();
      }
    }
  }
}

function quitFromPause() {
  _isPaused = false;
  var overlay = document.getElementById('pause-overlay');
  if (overlay) overlay.remove();
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  showScreen('level-map');
}

// ==================== 完成关卡 ====================
function finishLevel() {
  // v76: find actual STORIES index (for recommended articles with id >= 100)
  var _actualIdx = (currentLevel >= 100) ? STORIES.findIndex(function(s){return s.id===currentLevel}) : currentLevel;
  if(_actualIdx < 0) _actualIdx = currentLevel;
  var story = STORIES[_actualIdx];
  var correctCount = answers.filter(function(a) { return a; }).length;
  var totalQ = story.questions.length;
  var score = Math.round((correctCount / totalQ) * 100);
  var stars = 0;
  if (score >= 100) stars = 3;
  else if (score >= 80) stars = 2;
  else if (score >= 60) stars = 1;
  var passed = stars === 3;
  if (passed) {
    Storage.setLevelProgress(_actualIdx, { passed: true, score: score, stars: stars });
    Storage.addScore(score);
    Storage.recordArticleRead(); // v50 记录阅读文章
  }
  // ===== 金币奖励 =====
  var coinsEarned = 0;
  if (passed) {
    coinsEarned = stars * 10; // 1星=10, 2星=20, 3星=30
    Storage.addCoins(coinsEarned);
  }
  // 救小鸡
  var chickIdx = (_actualIdx >= 0 && _actualIdx < TOTAL_LEVELS) ? RESCUE_LEVELS.indexOf(_actualIdx) : -1;
  var rescuedChick = false;
  if (passed && chickIdx !== -1) {
    var chicks = Storage.get(Storage.KEYS.CHICKS);
    if (!chicks[chickIdx]) {
      Storage.rescueChick(chickIdx);
      rescuedChick = true;
      Sound.play('rescue');
    }
  }
  // ===== 问题4修复:保存到服务器(包括排行榜更新) =====
  if (Storage.isLoggedIn()) {
    syncToServer();
  }
  // v37 检查成就
  var newlyUnlocked = Storage.checkAchievements();
  showLevelResult(score, stars, passed, rescuedChick, chickIdx, coinsEarned);
  if (newlyUnlocked.length > 0) {
    showAchievementToast(newlyUnlocked);
  }
}

function showLevelResult(score, stars, passed, rescuedChick, chickIdx, coinsEarned) {
  showScreen('level-result');
  startCelebration(passed, score); // v51 celebration effects
  document.getElementById('result-stars').innerHTML = passed ? '⭐'.repeat(stars) : '差一点点!💪';
  var coinsDisplay = '';
  if (passed && coinsEarned > 0) {
    coinsDisplay = '<p style="color:#FFD700;font-size:1.1em;margin-top:8px;">💰 获得金币 +' + coinsEarned + '</p>';
  } else if (!passed) {
    coinsDisplay = '<p style="color:#999;font-size:1em;margin-top:8px;">三星通关获得金币奖励哦 💰</p>';
  }
  var msg = passed ? '🎉 过关!' : '💪 加油!需要三星才能过关哦!';
  if (score >= 100) msg = '🌟 太棒了!满分通关!';
  else if (score >= 80) msg = '👍 差一点!再细心一点!';
  else if (score >= 60) msg = '💪 加油!多练习就能三星!';
  document.getElementById('result-msg').innerHTML = msg + coinsDisplay;
  document.getElementById('result-score').innerHTML = '得分:' + score + '%(' + answers.filter(function(a) { return a; }).length + '/' + answers.length + ')';
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
      nextBtn.textContent = '全部通关!🎊';
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
  if (rescuedChick) {
    var savedCount = Storage.getChicksSaved();
    var remaining = 10 - savedCount;
    document.getElementById('result-msg').innerHTML +=
      '<p style="color:#4CAF50;font-size:1.2em;margin-top:10px;">🐤 第 ' + (chickIdx + 1) + ' 只小鸡已救回!</p>' +
      '<p style="color:#ff6b6b;">还差 ' + remaining + ' 只,继续加油!</p>';
  }

  // v37 语法小贴士
  var story = STORIES[currentLevel];
  if (story && story.grammarTips && story.grammarTips.length > 0) {
    var tipsHtml = '<div class="grammar-tips-card"><h4>📚 本关语法小贴士</h4>';
    story.grammarTips.forEach(function(tip) {
      tipsHtml += '<div class="grammar-tip-item"><span class="grammar-tip-title">' + tip.title + '</span><span class="grammar-tip-content">' + tip.content + '</span></div>';
    });
    tipsHtml += '</div>';
    var resultMsg = document.getElementById('result-msg');
    if (resultMsg) resultMsg.innerHTML += tipsHtml;
  }

  // v43 词汇复习按钮
  var clickedWords = Storage.getClickedWordsForLevel(currentLevel);
  if (clickedWords && clickedWords.length > 0) {
    var reviewHtml = '<div style="margin-top:20px;text-align:center;">';
    reviewHtml += '<button class="result-btn" style="background:linear-gradient(135deg,#667eea,#764ba2);" onclick="startVocabReview(' + currentLevel + ')">📚 复习本关单词 (' + clickedWords.length + ')</button>';
    reviewHtml += '</div>';
    var resultScore = document.getElementById('result-score');
    if (resultScore) resultScore.innerHTML += reviewHtml;
  }

  // v47 生词本按钮
  var vbList = Storage.getVocabBook();
  var vbHtml = '<div style="margin-top:12px;text-align:center;">' +
    '<button class="result-btn" style="background:linear-gradient(135deg,#f093fb,#f5576c);" onclick="showVocabBook(\'level-result\')">📖 生词本 (' + vbList.length + ')</button>' +
    '</div>';
  var resultScoreVB = document.getElementById('result-score');
  if (resultScoreVB) resultScoreVB.innerHTML += vbHtml;

  // v44 阅读理解闯关答题入口
  var rqHtml = '<div style="margin-top:16px;text-align:center;">' +
    '<button class="result-btn" style="background:linear-gradient(135deg,#4a90d9,#2196F3);" onclick="startReadingQuiz(' + currentLevel + ')">📖 阅读理解闯关</button>' +
    '</div>';
  var resultScore2 = document.getElementById('result-score');
  if (resultScore2) resultScore2.innerHTML += rqHtml;
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
  var prog = Storage.get(Storage.KEYS.PROGRESS) || [];
  var starsPerLevel = prog.map(function(p) { return p ? (p.stars || 0) : 0; });
  submitScore(starsPerLevel)
    .then(function(r) { if (r && r.success) console.log('Synced: ' + r.totalStars + ' stars'); })
    .catch(function(e) { console.log('Sync failed:', e); });
}

// ==================== 小鸡花园2.0(v36 起名/喂食/换装) ====================
// 商店物品定义
var SHOP_ITEMS = {
  // 食物
  food: [
    { id: 'millet', name: '小米', emoji: '🌾', price: 5, hunger: 20, desc: '小鸡最爱的主食' },
    { id: 'corn', name: '玉米粒', emoji: '🌽', price: 10, hunger: 50, desc: '营养丰富的零食' },
    { id: 'worm', name: '小虫子', emoji: '🐛', price: 20, hunger: 80, desc: '高蛋白美味' }
  ],
  // 装扮
  costumes: [
    { id: 'hat_red', name: '小红帽', emoji: '🎀', price: 20, desc: '可爱的红色帽子' },
    { id: 'hat_party', name: '派对帽', emoji: '🎉', price: 25, desc: '生日派对必备' },
    { id: 'glasses', name: '酷墨镜', emoji: '😎', price: 15, desc: '帅气逼人' },
    { id: 'scarf', name: '围巾', emoji: '🧣', price: 30, desc: '温暖又时尚' },
    { id: 'bow', name: '蝴蝶结', emoji: '🎗️', price: 18, desc: '优雅的小装饰' },
    { id: 'crown', name: '小皇冠', emoji: '👑', price: 50, desc: '小鸡之王' }
  ]
};

function renderGarden() {
  var container = document.getElementById('garden-grid');
  var chicks = Storage.get(Storage.KEYS.CHICKS) || Array(10).fill(false);
  var rescued = chicks.filter(function(c) { return c; }).length;
  var coins = Storage.getCoins();

  // 顶部信息栏
  var countEl = document.getElementById('garden-count');
  if (countEl) {
    countEl.innerHTML = '🐤 已救回 ' + rescued + ' / 10 只 <span style="margin-left:12px;">💰 ' + coins + '</span>';
    countEl.style.display = 'block';
  }

  // 添加商店按钮
  var headerEl = document.querySelector('#garden header');
  if (headerEl && !document.getElementById('garden-shop-btn')) {
    var shopBtn = document.createElement('button');
    shopBtn.id = 'garden-shop-btn';
    shopBtn.className = 'garden-shop-btn';
    shopBtn.innerHTML = '🛒';
    shopBtn.onclick = function() { openGardenShop(); };
    headerEl.appendChild(shopBtn);
  }

  container.innerHTML = '';
  CHICKS.forEach(function(chick, index) {
    var state = Storage.getChickState(index);
    var card = document.createElement('div');
    card.className = 'chick-card' + (chicks[index] ? ' rescued' : ' locked');

    if (chicks[index]) {
      // 显示饱食度条
      var hungerBar = '<div class="hunger-bar"><div class="hunger-fill" style="width:' + (state.hunger || 100) + '%"></div></div>';
      var hungerText = state.hunger >= 80 ? '😊' : state.hunger >= 50 ? '😐' : '😢';
      // 显示装扮
      var costumeEmoji = state.costume ? (SHOP_ITEMS.costumes.find(function(c) { return c.id === state.costume; }) || {}).emoji : '';

      // 装扮叠加层:根据装扮类型放到不同位置
      var costumeOverlay = '';
      if (state.costume) {
        var costumeItem = SHOP_ITEMS.costumes.find(function(c) { return c.id === state.costume; });
        if (costumeItem) {
          var pos = 'costume-hat'; // 默认帽子位置
          if (state.costume === 'glasses') pos = 'costume-face';
          else if (state.costume === 'scarf') pos = 'costume-neck';
          else if (state.costume === 'bow') pos = 'costume-hat';
          costumeOverlay = '<span class="costume-overlay ' + pos + '">' + costumeItem.emoji + '</span>';
        }
      }

      card.innerHTML =
        '<div class="chick-avatar chick-bounce" style="background:' + chick.color + ';">' +
          chick.emoji +
          costumeOverlay +
        '</div>' +
        '<div class="chick-name">' + (state.name || chick.name) + '</div>' +
        '<div class="chick-hunger">' + hungerText + ' ' + (state.hunger || 100) + '%</div>' +
        hungerText +
        '<div class="chick-actions">' +
          '<button class="chick-action-btn" data-action="rename" data-idx="' + index + '">✏️</button>' +
          '<button class="chick-action-btn" data-action="feed" data-idx="' + index + '">🍖</button>' +
          '<button class="chick-action-btn" data-action="costume" data-idx="' + index + '">👕</button>' +
          '<button class="chick-action-btn" data-action="talk" data-idx="' + index + '">💬</button>' +
        '</div>';
    } else {
      card.innerHTML =
        '<div class="chick-avatar" style="background:#e0e0e0;font-size:44px;color:#aaa;display:flex;align-items:center;justify-content:center;border-radius:50%;width:56px;height:56px;margin:0 auto 8px;">🔒</div>' +
        '<div class="chick-name" style="color:#999;">???</div>' +
        '<div class="chick-level">通过第 ' + chick.rescueLevel + ' 关救回</div>';
    }
    container.appendChild(card);
  });

  // 绑定按钮事件
  container.querySelectorAll('.chick-action-btn').forEach(function(btn) {
    btn.onclick = function(e) {
      e.stopPropagation();
      var action = this.dataset.action;
      var idx = parseInt(this.dataset.idx);
      handleChickAction(action, idx);
    };
  });

  updateUserDisplay();
}

function handleChickAction(action, index) {
  switch (action) {
    case 'rename':
      var currentName = Storage.getChickState(index).name || CHICKS[index].name;
      var newName = prompt('给小鸡起个名字(最多8个字):', currentName);
      if (newName && newName.trim()) {
        Storage.setChickName(index, newName.trim());
        renderGarden();
      }
      break;
    case 'feed':
      openFeedModal(index);
      break;
    case 'costume':
      openCostumeModal(index);
      break;
    case 'talk':
      var chick = CHICKS[index];
      thankHero(chick.name, chick.action);
      break;
  }
}

function openFeedModal(index) {
  var state = Storage.getChickState(index);
  var coins = Storage.getCoins();

  var html = '<div class="modal-overlay" id="feed-modal" onclick="if(event.target===this)this.remove()">' +
    '<div class="modal-box">' +
      '<h3>🍖 喂食 ' + (state.name || CHICKS[index].name) + '</h3>' +
      '<p style="color:#888;margin:8px 0;">当前饱食度: ' + (state.hunger || 100) + '%</p>' +
      '<p style="color:#888;margin-bottom:16px;">💰 你的金币: ' + coins + '</p>' +
      '<div class="shop-items">';

  SHOP_ITEMS.food.forEach(function(item) {
    var canBuy = coins >= item.price;
    html += '<div class="shop-item ' + (canBuy ? '' : 'disabled') + '" data-type="food" data-id="' + item.id + '" data-idx="' + index + '">' +
      '<span class="shop-emoji">' + item.emoji + '</span>' +
      '<div class="shop-info">' +
        '<div class="shop-name">' + item.name + '</div>' +
        '<div class="shop-desc">+' + item.hunger + ' 饱食度</div>' +
      '</div>' +
      '<div class="shop-price">💰' + item.price + '</div>' +
    '</div>';
  });

  html += '</div><button class="modal-close" onclick="document.getElementById(\'feed-modal\').remove()">关闭</button></div></div>';

  document.body.insertAdjacentHTML('beforeend', html);

  // 绑定购买事件
  document.querySelectorAll('#feed-modal .shop-item:not(.disabled)').forEach(function(el) {
    el.onclick = function() {
      var foodId = this.dataset.id;
      var idx = parseInt(this.dataset.idx);
      buyAndFeed(idx, foodId);
    };
  });
}

function buyAndFeed(index, foodId) {
  var food = SHOP_ITEMS.food.find(function(f) { return f.id === foodId; });
  if (!food) return;

  if (!Storage.spendCoins(food.price)) {
    alert('金币不足!');
    return;
  }

  Storage.feedChick(index, food.hunger);
  document.getElementById('feed-modal') && document.getElementById('feed-modal').remove();
  renderGarden();
  showToast('喂食成功!' + food.emoji);
}

function openCostumeModal(index) {
  var state = Storage.getChickState(index);
  var coins = Storage.getCoins();

  var html = '<div class="modal-overlay" id="costume-modal" onclick="if(event.target===this)this.remove()">' +
    '<div class="modal-box">' +
      '<h3>👕 给 ' + (state.name || CHICKS[index].name) + ' 换装</h3>' +
      '<p style="color:#888;margin-bottom:16px;">💰 你的金币: ' + coins + '</p>' +
      '<div class="shop-items">';

  SHOP_ITEMS.costumes.forEach(function(item) {
    var owned = state.costume === item.id;
    var canBuy = coins >= item.price;
    html += '<div class="shop-item ' + (owned ? 'owned' : (canBuy ? '' : 'disabled')) + '" data-type="costume" data-id="' + item.id + '" data-idx="' + index + '">' +
      '<span class="shop-emoji">' + item.emoji + '</span>' +
      '<div class="shop-info">' +
        '<div class="shop-name">' + item.name + '</div>' +
        '<div class="shop-desc">' + item.desc + '</div>' +
      '</div>' +
      (owned ? '<div class="shop-owned">已装备</div>' : '<div class="shop-price">💰' + item.price + '</div>') +
    '</div>';
  });

  html += '</div><button class="modal-close" onclick="document.getElementById(\'costume-modal\').remove()">关闭</button></div></div>';

  document.body.insertAdjacentHTML('beforeend', html);

  // 绑定购买/装备事件
  document.querySelectorAll('#costume-modal .shop-item:not(.disabled)').forEach(function(el) {
    el.onclick = function() {
      var costumeId = this.dataset.id;
      var idx = parseInt(this.dataset.idx);
      buyOrEquipCostume(idx, costumeId);
    };
  });
}

function buyOrEquipCostume(index, costumeId) {
  var state = Storage.getChickState(index);
  var costume = SHOP_ITEMS.costumes.find(function(c) { return c.id === costumeId; });
  if (!costume) return;

  // 已拥有则直接装备
  if (state.costume === costumeId) {
    return;
  }

  // 购买并装备
  if (!Storage.spendCoins(costume.price)) {
    alert('金币不足!');
    return;
  }

  Storage.setChickCostume(index, costumeId);
  document.getElementById('costume-modal') && document.getElementById('costume-modal').remove();
  renderGarden();
  showToast('购买并装备成功!' + costume.emoji);
}

function openGardenShop() {
  var coins = Storage.getCoins();

  var html = '<div class="modal-overlay" id="garden-shop-modal" onclick="if(event.target===this)this.remove()">' +
    '<div class="modal-box" style="max-width:340px;">' +
      '<h3>🛒 花园商店</h3>' +
      '<p style="color:#888;margin-bottom:16px;">💰 你的金币: ' + coins + '</p>' +
      '<div style="display:flex;gap:8px;margin-bottom:16px;">' +
        '<button class="shop-tab active" data-tab="food" onclick="switchShopTab(\'food\')">🍖 食物</button>' +
        '<button class="shop-tab" data-tab="costumes" onclick="switchShopTab(\'costumes\')">👕 装扮</button>' +
      '</div>' +
      '<div class="shop-items" id="shop-items-container"></div>' +
      '<button class="modal-close" onclick="document.getElementById(\'garden-shop-modal\').remove()">关闭</button>' +
    '</div></div>';

  document.body.insertAdjacentHTML('beforeend', html);
  renderShopItems('food');
}

function renderShopItems(type) {
  var container = document.getElementById('shop-items-container');
  if (!container) return;

  var items = SHOP_ITEMS[type] || [];
  var html = '';

  if (type === 'food') {
    // 食物:点击后选择投喂的小鸡
    items.forEach(function(item) {
      html += '<div class="shop-item-preview" onclick="selectChickToFeed(\'' + item.id + '\')">' +
        '<span class="shop-emoji">' + item.emoji + '</span>' +
        '<div class="shop-info">' +
          '<div class="shop-name">' + item.name + '</div>' +
          '<div class="shop-desc">' + (item.desc || '') + '</div>' +
        '</div>' +
        '<div class="shop-price">💰' + item.price + '</div>' +
      '</div>';
    });
  } else {
    // 装扮:点击后选择装扮的小鸡
    items.forEach(function(item) {
      html += '<div class="shop-item-preview" onclick="selectChickForCostume(\'' + item.id + '\')">' +
        '<span class="shop-emoji">' + item.emoji + '</span>' +
        '<div class="shop-info">' +
          '<div class="shop-name">' + item.name + '</div>' +
          '<div class="shop-desc">' + (item.desc || '') + '</div>' +
        '</div>' +
        '<div class="shop-price">💰' + item.price + '</div>' +
      '</div>';
    });
  }

  container.innerHTML = html;
}

function switchShopTab(tab) {
  document.querySelectorAll('.shop-tab').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  renderShopItems(tab);
}

// ===== 选择小鸡投喂 =====
function selectChickToFeed(foodId) {
  var chicks = Storage.get(Storage.KEYS.CHICKS) || [];
  var rescuedIndices = [];
  chicks.forEach(function(c, i) { if (c) rescuedIndices.push(i); });

  if (rescuedIndices.length === 0) {
    alert('还没有救回小鸡,无法投喂!');
    return;
  }

  var html = '<div class="modal-overlay" id="feed-select-modal" onclick="if(event.target===this)this.remove()">' +
    '<div class="modal-box" style="max-width:320px;">' +
      '<h3>🍖 选择投喂的小鸡</h3>' +
      '<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:16px 0;">';

  var food = SHOP_ITEMS.food.find(function(f) { return f.id === foodId; });

  rescuedIndices.forEach(function(idx) {
    var state = Storage.getChickState(idx);
    html += '<button onclick="buyAndFeed(' + idx + ',\'' + foodId + '\')" style="width:80px;padding:12px 8px;border:none;background:#fff;border-radius:12px;box-shadow:0 2px8px rgba(0,0,0,0.1);cursor:pointer;">' +
      '<div style="font-size:28px;">' + CHICKS[idx].emoji + '</div>' +
      '<div style="font-size:12px;color:#666;margin-top:4px;">' + (state.name || CHICKS[idx].name) + '</div>' +
      '<div style="font-size:10px;color:#888;margin-top:2px;">饱食度 ' + (state.hunger || 100) + '%</div>' +
    '</button>';
  });

  html += '</div><button class="modal-close" onclick="document.getElementById(\'feed-select-modal\').remove()">取消</button></div></div>';

  document.getElementById('garden-shop-modal') && document.getElementById('garden-shop-modal').remove();
  document.body.insertAdjacentHTML('beforeend', html);
}

// ===== 选择小鸡换装 =====
function selectChickForCostume(costumeId) {
  var chicks = Storage.get(Storage.KEYS.CHICKS) || [];
  var rescuedIndices = [];
  chicks.forEach(function(c, i) { if (c) rescuedIndices.push(i); });

  if (rescuedIndices.length === 0) {
    alert('还没有救回小鸡,无法换装!');
    return;
  }

  var html = '<div class="modal-overlay" id="costume-select-modal" onclick="if(event.target===this)this.remove()">' +
    '<div class="modal-box" style="max-width:320px;">' +
      '<h3>👕 选择换装的小鸡</h3>' +
      '<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:16px 0;">';

  var costume = SHOP_ITEMS.costumes.find(function(c) { return c.id === costumeId; });

  rescuedIndices.forEach(function(idx) {
    var state = Storage.getChickState(idx);
    html += '<button onclick="buyOrEquipCostume(' + idx + ',\'' + costumeId + '\')" style="width:80px;padding:12px 8px;border:none;background:#fff;border-radius:12px;box-shadow:0 2px8px rgba(0,0,0,0.1);cursor:pointer;">' +
      '<div style="font-size:28px;">' + CHICKS[idx].emoji + '</div>' +
      '<div style="font-size:12px;color:#666;margin-top:4px;">' + (state.name || CHICKS[idx].name) + '</div>' +
    '</button>';
  });

  html += '</div><button class="modal-close" onclick="document.getElementById(\'costume-select-modal\').remove()">取消</button></div></div>';

  document.getElementById('garden-shop-modal') && document.getElementById('garden-shop-modal').remove();
  document.body.insertAdjacentHTML('beforeend', html);
}

function thankHero(chickName, chickAction) {
  var phrases = {
    '走来走去': ['Thank you, brave hero!', 'You saved me!', 'You are my hero!'],
    '吃小米': ['Thank you, hero!', 'I am so happy!', 'We love you!'],
    '开心玩耍': ['You are the bravest hero!', 'Thank you for saving us!', 'We are safe because of you!'],
    '晒太阳': ['Thank you so much!', 'You are amazing!', 'We love our hero!'],
    '睡觉觉': ['Thank you, brave hero!', 'You saved us all!', 'We are forever grateful!'],
    '唱歌': ['Thank you, hero!', 'You are a true hero!', 'We celebrate you!'],
    '跳舞': ['Hero! Hero!', 'Thank you for rescuing us!', 'You are the best!'],
    '看风景': ['Thank you, brave hero!', 'We are free because of you!', 'You are wonderful!'],
    '做运动': ['Thank you, strong hero!', 'You saved the day!', 'We are so happy!'],
    '荡秋千': ['You did it, hero!', 'We are free!', 'Thank you forever!']
  };
  var msgs = phrases[chickAction] || ['Thank you, hero!', 'You saved me!', 'I love you!'];
  var msg = msgs[Math.floor(Math.random() * msgs.length)];
  // 弹出对话气泡
  var bubble = document.createElement('div');
  bubble.className = 'chick-speech-bubble';
  bubble.innerHTML =
    '<div class="bubble-emoji">🐤</div>' +
    '<div class="bubble-name">' + chickName + '</div>' +
    '<div class="bubble-text">' + msg + '</div>' +
    '<button class="bubble-close">关闭</button>';
  document.body.appendChild(bubble);
  bubble.querySelector('.bubble-close').onclick = function() {
    bubble.remove();
  };
  // TTS 朗读英文
  speakWord(msg);
}

// ==================== 词汇本(问题5修复:修复发音) ====================
function renderVocab() {
  var vocab = Storage.getVocab() || [];
  var mastery = Storage.getVocabMastery();
  var dueWords = Storage.getDueReviewWords();
  var html = '<h2 class="vocab-title">词汇本 📖</h2>';

  // v37 掌握度统计
  html += '<div class="vocab-mastery-bar">';
  html += '<div class="mastery-stat"><span class="mastery-num mastered">' + mastery.mastered + '</span><span class="mastery-label">已掌握</span></div>';
  html += '<div class="mastery-stat"><span class="mastery-num learning">' + mastery.learning + '</span><span class="mastery-label">学习中</span></div>';
  html += '<div class="mastery-stat"><span class="mastery-num new-word">' + mastery.newWords + '</span><span class="mastery-label">新词</span></div>';
  html += '<div class="mastery-stat"><span class="mastery-num total">' + mastery.total + '</span><span class="mastery-label">总计</span></div>';
  html += '</div>';

  // v37 复习入口
  if (dueWords.length > 0) {
    html += '<button class="review-start-btn" id="start-review-btn">🔄 复习 ' + dueWords.length + ' 个待复习词汇</button>';
  } else if (vocab.length > 0) {
    html += '<div class="review-ok-msg">✅ 今日复习已完成,明天再来吧!</div>';
  }

  if (vocab.length === 0) {
    html += '<p style="text-align:center;padding:40px;color:#888;">答题过程中遇到的生词会保存在这里~</p>';
  } else {
    var reviews = Storage.getVocabReview();
    html += '<p style="color:#888;font-size:0.9em;margin-bottom:12px;">共 ' + vocab.length + ' 个词汇(点击🔊发音)</p>';
    html += '<div class="vocab-list">';
    vocab.forEach(function(v, idx) {
      var r = reviews[v.word];
      var levelBadge = '';
      if (!r || r.level === 0) {
        levelBadge = '<span class="vocab-level-badge new">新</span>';
      } else if (r.level >= 5) {
        levelBadge = '<span class="vocab-level-badge mastered">熟</span>';
      } else {
        levelBadge = '<span class="vocab-level-badge learning">学</span>';
      }
      html += '<div class="vocab-item" data-vocab-idx="' + idx + '">' +
        '<div class="vocab-word">' +
          '<span class="vocab-speak-btn" data-word="' + v.word + '">🔊</span> ' +
          '<span class="vocab-text">' + v.word + '</span>' +
          levelBadge +
        '</div>' +
        '<div class="vocab-meaning">' + v.meaning + '</div>' +
        '</div>';
    });
    html += '</div>';
  }
  document.getElementById('vocab-content').innerHTML = html;

  // 绑定发音事件
  document.querySelectorAll('.vocab-speak-btn').forEach(function(btn) {
    btn.onclick = function(e) {
      e.stopPropagation();
      var word = this.getAttribute('data-word');
      if (word) speakWord(word);
    };
  });

  // v37 绑定复习按钮
  var reviewBtn = document.getElementById('start-review-btn');
  if (reviewBtn) {
    reviewBtn.onclick = function() { startVocabReview(); };
  }

  updateUserDisplay();
}

// ==================== v37 词汇复习模式 ====================
var _reviewWords = [];
var _reviewIndex = 0;
var _reviewScore = 0;

function startVocabReview() {
  _reviewWords = Storage.getDueReviewWords();
  if (_reviewWords.length === 0) return;
  // 打乱顺序
  for (var i = _reviewWords.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = _reviewWords[i]; _reviewWords[i] = _reviewWords[j]; _reviewWords[j] = tmp;
  }
  _reviewIndex = 0;
  _reviewScore = 0;
  renderReviewQuestion();
}

function renderReviewQuestion() {
  if (_reviewIndex >= _reviewWords.length) {
    finishVocabReview();
    return;
  }
  var w = _reviewWords[_reviewIndex];
  // 随机选择复习方式:英→中 或 中→英
  var isEnToCn = Math.random() > 0.5;
  var allVocab = Storage.getVocab();

  var html = '<div class="review-header">';
  html += '<span class="review-progress">' + (_reviewIndex + 1) + ' / ' + _reviewWords.length + '</span>';
  html += '<button class="review-quit-btn" id="review-quit">退出复习</button>';
  html += '</div>';

  if (isEnToCn) {
    // 英→中:看英文选中文
    html += '<div class="review-prompt">选出这个单词的意思:</div>';
    html += '<div class="review-word">' + w.word + '</div>';
    html += '<div class="review-options">';
    // 正确答案 + 3个干扰项
    var options = [w.meaning];
    var others = allVocab.filter(function(v) { return v.word !== w.word; });
    for (var k = 0; k < 3 && others.length > 0; k++) {
      var ri = Math.floor(Math.random() * others.length);
      options.push(others[ri].meaning);
      others.splice(ri, 1);
    }
    // 打乱选项
    for (var i = options.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = options[i]; options[i] = options[j]; options[j] = tmp;
    }
    var correctIdx = options.indexOf(w.meaning);
    options.forEach(function(opt, i) {
      html += '<div class="review-option" data-opt="' + i + '" data-correct="' + (i === correctIdx ? '1' : '0') + '" data-word="' + w.word + '">' + opt + '</div>';
    });
    html += '</div>';
  } else {
    // 中→英:看中文选英文
    html += '<div class="review-prompt">选出对应的英文单词:</div>';
    html += '<div class="review-word">' + w.meaning + '</div>';
    html += '<div class="review-options">';
    var options = [w.word];
    var others = allVocab.filter(function(v) { return v.word !== w.word; });
    for (var k = 0; k < 3 && others.length > 0; k++) {
      var ri = Math.floor(Math.random() * others.length);
      options.push(others[ri].word);
      others.splice(ri, 1);
    }
    for (var i = options.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = options[i]; options[i] = options[j]; options[j] = tmp;
    }
    var correctIdx = options.indexOf(w.word);
    options.forEach(function(opt, i) {
      html += '<div class="review-option" data-opt="' + i + '" data-correct="' + (i === correctIdx ? '1' : '0') + '" data-word="' + w.word + '">' + opt + '</div>';
    });
    html += '</div>';
  }

  document.getElementById('vocab-content').innerHTML = html;

  // 绑定选项点击
  document.querySelectorAll('.review-option').forEach(function(opt) {
    opt.onclick = function() {
      var isCorrect = this.getAttribute('data-correct') === '1';
      var word = this.getAttribute('data-word');
      if (isCorrect) {
        this.classList.add('correct');
        _reviewScore++;
        Storage.reviewVocabCorrect(word);
      } else {
        this.classList.add('wrong');
        // 高亮正确答案
        document.querySelectorAll('.review-option').forEach(function(o) {
          if (o.getAttribute('data-correct') === '1') o.classList.add('correct');
        });
        Storage.reviewVocabWrong(word);
      }
      // 禁用所有选项
      document.querySelectorAll('.review-option').forEach(function(o) { o.onclick = null; });
      // 延迟进入下一题
      setTimeout(function() {
        _reviewIndex++;
        renderReviewQuestion();
      }, isCorrect ? 800 : 1500);
    };
  });

  // 退出按钮
  var quitBtn = document.getElementById('review-quit');
  if (quitBtn) quitBtn.onclick = function() { renderVocab(); };
}

function finishVocabReview() {
  var total = _reviewWords.length;
  var html = '<div class="review-result">';
  html += '<div style="font-size:48px;margin-bottom:16px;">🎉</div>';
  html += '<h3>复习完成!</h3>';
  html += '<p style="font-size:1.2em;">答对 <b style="color:#4CAF50;">' + _reviewScore + '</b> / ' + total + '</p>';
  if (_reviewScore === total) {
    html += '<p style="color:#FF9800;">🌟 全部正确,太棒了!</p>';
  } else if (_reviewScore >= total * 0.7) {
    html += '<p style="color:#4CAF50;">👍 不错,继续加油!</p>';
  } else {
    html += '<p style="color:#f44336;">💪 多复习几次就会记住的!</p>';
  }
  html += '<button class="review-start-btn" onclick="renderVocab()">返回词汇本</button>';
  html += '</div>';
  document.getElementById('vocab-content').innerHTML = html;
}

// ==================== v37 成就系统 ====================
function renderAchievements() {
  showScreen('achievements');
  // 先检查新成就
  var newlyUnlocked = Storage.checkAchievements();

  var defs = Storage.ACHIEVEMENT_DEFS;
  var unlocked = Storage.getAchievements();
  var unlockCount = Object.keys(unlocked).length;
  var total = defs.length;

  var html = '<div class="ach-summary">';
  html += '<div class="ach-progress-ring">';
  html += '<svg viewBox="0 0 36 36" class="ach-ring-svg">';
  html += '<path class="ach-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>';
  var pct = Math.round((unlockCount / total) * 100);
  html += '<path class="ach-ring-fill" stroke-dasharray="' + pct + ', 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>';
  html += '<text x="18" y="20.35" class="ach-ring-text">' + unlockCount + '/' + total + '</text>';
  html += '</svg>';
  html += '</div>';
  html += '<div class="ach-summary-text">已解锁 ' + unlockCount + ' / ' + total + ' 个成就</div>';
  html += '</div>';

  html += '<div class="ach-grid">';
  defs.forEach(function(def) {
    var isUnlocked = !!unlocked[def.id];
    var when = isUnlocked ? new Date(unlocked[def.id].unlockedAt).toLocaleDateString() : '';
    html += '<div class="ach-card ' + (isUnlocked ? 'unlocked' : 'locked') + '">';
    html += '<div class="ach-icon">' + (isUnlocked ? def.icon : '🔒') + '</div>';
    html += '<div class="ach-info">';
    html += '<div class="ach-name">' + (isUnlocked ? def.name : '???') + '</div>';
    html += '<div class="ach-desc">' + def.desc + '</div>';
    if (isUnlocked) html += '<div class="ach-date">' + when + '</div>';
    html += '</div></div>';
  });
  html += '</div>';

  document.getElementById('achievements-content').innerHTML = html;
  document.getElementById('ach-count').textContent = unlockCount + '/' + total;

  // 弹出新成就通知
  if (newlyUnlocked.length > 0) {
    showAchievementToast(newlyUnlocked);
  }
}

function showAchievementToast(achievements) {
  var toast = document.createElement('div');
  toast.className = 'ach-toast';
  var html = '';
  achievements.forEach(function(a) {
    html += '<div class="ach-toast-item">' + a.icon + ' 成就解锁:' + a.name + '</div>';
  });
  toast.innerHTML = html;
  document.body.appendChild(toast);
  setTimeout(function() { toast.classList.add('show'); }, 50);
  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() { toast.remove(); }, 400);
  }, 3000);
}

function speakWord(word) {
  if (!word) return;
  // v38 单词高亮反馈
  highlightClickedWord(word);
  // 优先使用 Capacitor TTS 插件(Android 原生发音)
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.TextToSpeech) {
    Capacitor.Plugins.TextToSpeech.speak({
      text: word,
      lang: 'en-US',
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0
    }).catch(function(e) {
      console.log('TTS failed, fallback', e);
      webSpeakWord(word);
    });
  } else {
    webSpeakWord(word);
  }
}

// v38 单词点击高亮反馈
function highlightClickedWord(word) {
  var articleEl = document.getElementById('quiz-article');
  if (!articleEl) return;
  // 遍历所有包含英文单词的元素
  var walker = document.createTreeWalker(articleEl, NodeFilter.SHOW_TEXT, null, false);
  var node;
  while (node = walker.nextNode()) {
    var text = node.textContent || '';
    var regex = new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
    if (regex.test(text)) {
      var parent = node.parentElement;
      if (parent && parent.style) {
        parent.classList.add('word-click-highlight');
        setTimeout(function() {
          if (parent.classList) parent.classList.remove('word-click-highlight');
        }, 400);
      }
      break; // 找到第一个匹配就停止
    }
  }
}

function webSpeakWord(word) {
  try {
    var sp = window.speechSynthesis;
    if (sp) {
      sp.cancel();
      var u = new SpeechSynthesisUtterance(word);
      u.lang = 'en-US';
      u.rate = 0.8;
      var voices = sp.getVoices();
      if (voices.length > 0) {
        var enVoice = voices.find(function(v) { return v.lang.indexOf('en') === 0; });
        if (enVoice) u.voice = enVoice;
      }
      sp.speak(u);
    }
  } catch(e) {}
}

// ==================== v36 错题本 ====================
function renderWrongAnswers() {
  showScreen('wrong-answers');
  var wrongs = Storage.getWrongAnswers() || [];
  var container = document.getElementById('wrong-answers-content');
  var badge = document.getElementById('wa-count-badge');
  if (badge) badge.textContent = wrongs.length > 0 ? wrongs.length + ' 道错题' : '';

  if (wrongs.length === 0) {
    container.innerHTML =
      '<div class="wa-empty">' +
        '<span class="empty-icon">🎉</span>' +
        '<p>太棒了!暂无错题~</p>' +
        '<p style="font-size:0.85em;color:#aaa;margin-top:8px;">继续闯关,保持这个势头!</p>' +
        '<button class="home-btn" style="margin-top:20px;display:inline-block;" onclick="renderLevelMap(); showScreen(\'level-map\')">去闯关</button>' +
      '</div>';
    return;
  }

  var html = '<p style="color:#888;font-size:0.9em;margin-bottom:12px;text-align:center;">共 ' + wrongs.length + ' 道错题(答错后自动加入)</p>';
  wrongs.forEach(function(w, idx) {
    var story = STORIES[w.levelIndex];
    var levelName = story ? ('第 ' + (w.levelIndex + 1) + ' 关 · ' + (story.titleCN || story.title || '')) : ('第 ' + (w.levelIndex + 1) + ' 关');
    html += '<div class="wa-item">' +
      '<div class="wa-level">' + levelName + '</div>' +
      '<div class="wa-question">' + (idx + 1) + '. ' + w.question + '</div>' +
      '<div class="wa-wrong">❌ 你的答案:' + w.userAnswer + '</div>' +
      '<div class="wa-correct">✅ 正确答案:' + w.correctAnswer + '</div>';
    if (w.explanation) {
      html += '<div class="wa-explanation">📖 解析:' + w.explanation + '</div>';
    }
    html += '<button class="wa-retry-btn" onclick="retryWrongLevel(\'' + w.id + '\', ' + w.levelIndex + ')">🔄 重做此关</button>' +
      '<button class="wa-retry-btn" style="background:#e0e0e0;color:#666;margin-left:8px;" onclick="removeWrongAnswer(\'' + w.id + '\')">✓ 已掌握</button>' +
      '</div>';
  });

  html += '<div style="text-align:center;margin:20px 0 30px;">' +
    '<button class="wa-retry-btn" style="background:#e0e0e0;color:#888;padding:10px 24px;" onclick="clearAllWrongs()">清空全部错题</button>' +
    '</div>';
  container.innerHTML = html;
  updateUserDisplay();
}

function retryWrongLevel(wrongId, levelIndex) {
  Storage.removeWrongAnswer(wrongId);
  renderLevelMap();
  startLevel(levelIndex);
}

function removeWrongAnswer(id) {
  Storage.removeWrongAnswer(id);
  renderWrongAnswers(); // 刷新列表
}

function clearAllWrongs() {
  if (!confirm('确定清空全部错题记录?')) return;
  Storage.clearWrongAnswers();
  renderWrongAnswers();
}

// ==================== v36 每日登录奖励 ====================
function claimDailyReward() {
  if (!Storage.canClaimDailyReward()) {
    var status = Storage.getDailyRewardStatus();
    var streak = status.streak || 0;
    var coins = Storage.getCoins();
    showDailyRewardPopup(0, streak, false, coins);
    return;
  }
  var result = Storage.claimDailyReward();
  showDailyRewardPopup(result.coins, result.streak, true, Storage.getCoins());
  // v37 检查成就
  var ach = Storage.checkAchievements();
  if (ach.length > 0) showAchievementToast(ach);
}

function showDailyRewardPopup(coinsEarned, streak, isNewClaim, totalCoins) {
  var overlay = document.createElement('div');
  overlay.className = 'daily-reward-overlay';
  overlay.id = 'daily-reward-overlay';
  var emoji = isNewClaim ? '🎁' : '⏰';
  var title = isNewClaim ? '每日奖励到账!' : '今日已领取';
  var sub = isNewClaim ? ('连续登录 ' + streak + ' 天 · 明天继续来哦~') : ('已连续登录 ' + streak + ' 天,明天再来领更大奖励!');
  var coinDisplay = isNewClaim ? ('+' + coinsEarned) : ('💰 已有 ' + totalCoins + ' 金币');
  overlay.innerHTML =
    '<div class="daily-reward-box">' +
      '<div style="font-size:3em;margin-bottom:8px;">' + emoji + '</div>' +
      '<div class="daily-reward-title">' + title + '</div>' +
      '<div class="daily-reward-coins">' + coinDisplay + '</div>' +
      '<div class="daily-reward-streak">🔥 连续 ' + streak + ' 天</div>' +
      '<div class="daily-reward-sub">' + sub + '</div>' +
      '<button class="daily-reward-btn" onclick="document.getElementById(\'daily-reward-overlay\').remove()">知道了!</button>' +
    '</div>';
  document.body.appendChild(overlay);
  if (isNewClaim) Sound.play('win');
}

// ==================== 设置页 ====================
function showSettings() {
  showScreen('settings');
  var settings = Storage.getSettings();
  document.getElementById('sound-toggle').textContent = settings.sound ? '音效:开' : '音效:关';
  // 更新设置页的小鸡数量显示(从本地获取)
  var localChicks = Storage.getChicksSaved();
  var chickenCountEl = document.getElementById('chicken-count');
  if (chickenCountEl) {
    chickenCountEl.textContent = '已救回: ' + localChicks + '/10 只';
  }
  updateUserDisplay();
}

function toggleSound() {
  var settings = Storage.getSettings();
  settings.sound = !settings.sound;
  Sound.setEnabled(settings.sound);
  Storage.updateSettings({ sound: settings.sound });
  document.getElementById('sound-toggle').textContent = settings.sound ? '音效：开' : '音效：关';
}

// v46 深色模式
function toggleTheme() {
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('sc_theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('sc_theme', 'dark');
  }
  // Update toggle text
  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.textContent = '主题：' + (isDark ? '浅色' : '深色');
  }
}

function applySavedTheme() {
  var theme = localStorage.getItem('sc_theme') || 'light';
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

function logoutUser() {
  if (!confirm('确定退出登录?本地数据会保留。')) return;
  Storage.logout();
  alert('已退出登录');
  showLogin();
  updateNavButtons();
}

function resetAll() {
  if (!confirm('确定重置所有数据?包括关卡进度、小鸡花园等全部清空!')) return;
  // 同步清空服务器数据(保留注册信息,只清进度和分数)
  if (Storage.isLoggedIn()) {
    apiFetch('/api/reset-progress', {
      method: 'POST'
    }).catch(function(e) { console.log('Server reset failed:', e); });
  }
  Storage.reset();
  Storage.logout();  // 清除token(不弹confirm)
  alert('数据已重置,请重新登录');
  showLogin();
  renderLevelMap();
  updateNavButtons();
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
          '<p style="text-align:center;padding:40px;color:#888;">还没有数据,<br>快去闯关成为第一个上榜的英雄吧!</p>';
      }
    })
    .catch(function(e) {
      document.getElementById('leaderboard-content').innerHTML =
        '<p style="text-align:center;padding:40px;color:#888;">加载失败,请检查网络连接</p>';
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
  var nameGroup = document.getElementById('login-name-group');
  if (nameGroup) nameGroup.style.display = 'none';
  var toggleBtn = document.getElementById('login-toggle');
  if (toggleBtn) toggleBtn.textContent = '还没有账号?点击去注册';
}

function translateError(err) {
  if (!err) return '操作失败,请重试';
  if (err.indexOf('min 2 chars') >= 0) return '姓名至少需要2个字';
  if (err.indexOf('not found') >= 0) return '用户不存在,请先注册';
  if (err.indexOf('invalid password') >= 0) return '密码错误';
  if (err.indexOf('already') >= 0) return '该手机号已注册,请直接登录';
  if (err.indexOf('invalid phone') >= 0) return '手机号格式不正确';
  if (err.indexOf('required') >= 0) return '请填写所有必填项';
  if (err.indexOf('school min') >= 0) return '学校名称至少需要2个字';
  if (err.indexOf('birthdate') >= 0) return '请选择出生日期';
  return err;
}

function toggleLoginMode() {
  var nameGroup = document.getElementById('login-name-group');
  var toggleBtn = document.getElementById('login-toggle');
  if (!nameGroup) return;
  var currentDisplay = nameGroup.style.display || '';
  if (currentDisplay === 'none') {
    nameGroup.style.display = 'block';
    if (toggleBtn) toggleBtn.textContent = '切换到账号登录';
  } else {
    nameGroup.style.display = 'none';
    if (toggleBtn) toggleBtn.textContent = '还没有账号?点击去注册';
  }
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
  var name = document.getElementById('login-name').value.trim();
  var school = document.getElementById('login-school').value.trim();
  var birthdate = document.getElementById('login-birthdate').value.trim();

  // 判断当前是注册模式还是登录模式
  var nameGroup = document.getElementById('login-name-group');
  var isRegisterMode = nameGroup && nameGroup.style.display !== 'none';

  if (isRegisterMode) {
    // 注册模式:校验姓名,调用 registerUser
    if (!name || name.length < 2) {
      document.getElementById('login-msg').textContent = '姓名至少需要2个字';
      return;
    }
    document.getElementById('login-msg').textContent = '注册中...';
    registerUser(phone, password, name, school, birthdate)
      .then(function(data) {
        if (data.success) {
          Storage.saveUser({ id: data.user.id, phone: data.user.phone, name: data.user.name, school: data.user.school, token: data.token, isNew: true });
          var serverChicks = data.user.totalChicks || 0;
          var localChicks = [];
          for (var i = 0; i < 10; i++) {
            localChicks[i] = i < serverChicks;
          }
          Storage.set(Storage.KEYS.CHICKS, localChicks);

          // 注册也可能返回已有进度(重复注册=自动登录)
          var starsPerLevel = data.user.starsPerLevel || [];
          var localProgress = [];
          for (var i = 0; i < 30; i++) {
            var s = (i < starsPerLevel.length) ? (starsPerLevel[i] || 0) : 0;
            localProgress[i] = { passed: s > 0, score: s === 3 ? 100 : s === 2 ? 80 : s === 1 ? 60 : 0, stars: s };
          }
          Storage.set(Storage.KEYS.PROGRESS, localProgress);
          document.getElementById('login-msg').textContent = data.isNew ? '注册成功!' : '登录成功!';
          setTimeout(function() {
            showReturnScreen();
            updateNavButtons();
          }, 500);
        } else {
          if (data.error) { document.getElementById('login-msg').textContent = translateError(data.error); }
        }
      })
      .catch(function(e) {
        document.getElementById('login-msg').textContent = '网络错误,请重试';
      });
    return;
  }

  document.getElementById('login-msg').textContent = '登录中...';
  loginUser(phone, password)
    .then(function(data) {
      if (data.success) {
        Storage.saveUser({ id: data.user.id, phone: data.user.phone, name: data.user.name, school: data.user.school, token: data.token, isNew: false });

        // 同步后端小鸡数据到本地(按顺序解锁)
        var serverChicks = data.user.totalChicks || 0;
        var localChicks = [];
        for (var i = 0; i < 10; i++) {
          localChicks[i] = i < serverChicks;
        }
        Storage.set(Storage.KEYS.CHICKS, localChicks);

        // 同步闯关进度到本地:用 starsPerLevel 恢复每关星级
        var starsPerLevel = data.user.starsPerLevel || [];
        var localProgress = [];
        for (var i = 0; i < 30; i++) {
          var s = (i < starsPerLevel.length) ? (starsPerLevel[i] || 0) : 0;
          localProgress[i] = { passed: s > 0, score: s === 3 ? 100 : s === 2 ? 80 : s === 1 ? 60 : 0, stars: s };
        }
        Storage.set(Storage.KEYS.PROGRESS, localProgress);

        document.getElementById('login-msg').textContent = '登录成功!';
        setTimeout(function() {
          showReturnScreen();
          updateNavButtons();
        }, 500);
      } else {
        if (data.error) { document.getElementById('login-msg').textContent = translateError(data.error); }
      }
    })
    .catch(function(e) {
      document.getElementById('login-msg').textContent = '网络错误,请重试';
    });
}

// ==================== 初始化 ====================
// ==================== v43 词汇复习模式 ====================
function startVocabReview(levelIndex) {
  var words = Storage.getClickedWordsForLevel(levelIndex);
  if (!words || words.length === 0) {
    showToast('本关没有点击过的单词');
    return;
  }
  vocabReviewState.words = words;
  vocabReviewState.currentIndex = 0;
  vocabReviewState.levelIndex = levelIndex;
  showScreen('vocab-review');
  renderVocabReviewCard();
}

function renderVocabReviewCard() {
  var container = document.getElementById('vocab-review-content');
  if (!container) return;

  var words = vocabReviewState.words;
  var idx = vocabReviewState.currentIndex;

  if (!words || words.length === 0 || idx >= words.length) {
    container.innerHTML = '<div class="review-empty"><div class="review-empty-icon">🎉</div><div class="review-empty-text">复习完成!</div><div class="review-empty-hint">点击返回继续闯关</div></div>';
    return;
  }

  var word = words[idx];
  var total = words.length;

  var html = '<div class="review-level-info">第 ' + (vocabReviewState.levelIndex + 1) + ' 关 · 点击过的单词</div>';
  html += '<div class="flashcard-container">';
  html += '<div class="flashcard" id="vocab-flashcard" onclick="flipVocabReviewCard()">';
  html += '<div class="flashcard-face flashcard-front">';
  html += '<div class="flashcard-word">' + word.word + '</div>';
  html += '<div class="flashcard-hint">点击翻转查看释义</div>';
  html += '</div>';
  html += '<div class="flashcard-face flashcard-back">';
  html += '<div class="flashcard-word">' + word.word + '</div>';
  if (word.meaning) {
    html += '<div class="flashcard-meaning">' + word.meaning + '</div>';
  } else {
    html += '<div class="flashcard-meaning">(暂无释义)</div>';
  }
  html += '<button class="flashcard-tts-btn" onclick="event.stopPropagation(); speakWord(\'' + word.word + '\')">🔊</button>';
  html += '</div>';
  html += '</div></div>';
  html += '<div class="flashcard-nav">';
  html += '<button class="flashcard-nav-btn" onclick="prevVocabReviewCard()" ' + (idx === 0 ? 'disabled' : '') + '>←</button>';
  html += '<div class="flashcard-progress">' + (idx + 1) + ' / ' + total + '</div>';
  html += '<button class="flashcard-nav-btn" onclick="nextVocabReviewCard()" ' + (idx >= total - 1 ? 'disabled' : '') + '>→</button>';
  html += '</div>';

  container.innerHTML = html;

  // 添加滑动手势
  initFlashcardSwipe();
}

function flipVocabReviewCard() {
  var card = document.getElementById('vocab-flashcard');
  if (card) {
    card.classList.toggle('flipped');
    Sound.play('click');
  }
}

function nextVocabReviewCard() {
  var words = vocabReviewState.words;
  if (vocabReviewState.currentIndex < words.length - 1) {
    vocabReviewState.currentIndex++;
    renderVocabReviewCard();
    Sound.play('click');
  }
}

function prevVocabReviewCard() {
  if (vocabReviewState.currentIndex > 0) {
    vocabReviewState.currentIndex--;
    renderVocabReviewCard();
    Sound.play('click');
  }
}

function exitVocabReview() {
  showScreen('level-result');
}

// v47 生词本
var _vocabBookBack = 'levels';
function showVocabBook(backTo) {
  _vocabBookBack = backTo || 'levels';
  renderVocabBook();
  showScreen('vocab-book');
}
function exitVocabBook() {
// v50 每日学习目标与连续打卡
function showDailyGoal(backTo) {
  var goal = Storage.getDailyGoal();
  var progress = Storage.getTodayProgress();
  var streak = Storage.getStreakData();
  var goalArticles = goal.articles || 3;
  var goalWords = goal.words || 10;
  var progressArticles = progress.articles || 0;
  var progressWords = progress.words || 0;
  var html = '<div class="daily-goal-page">' +
    '<div class="screen-header"><button class="back-btn" onclick="navTo(\'' + (backTo || 'home') + '\')">←</button><h1>每日学习目标</h1></div>' +
    '<div class="daily-goal-section"><h2>🎯 今日目标</h2>' +
    '<div class="goal-setting"><div class="goal-item"><label>阅读文章数：</label>' +
    '<input type="number" id="goal-articles" value="' + goalArticles + '" min="1" max="10"></div>' +
    '<div class="goal-item"><label>学习单词数：</label>' +
    '<input type="number" id="goal-words" value="' + goalWords + '" min="1" max="50"></div>' +
    '<button class="save-goal-btn" onclick="saveDailyGoal()">保存目标</button></div></div>' +
    '<div class="daily-progress-section"><h2>📊 今日进度</h2>' +
    '<div class="progress-item"><div class="progress-label">阅读文章</div>' +
    '<div class="progress-bar"><div class="progress-fill" style="width:' + Math.min(100, (progressArticles/goalArticles)*100) + '%">' + progressArticles + '/' + goalArticles + '</div></div></div>' +
    '<div class="progress-item"><div class="progress-label">学习单词</div>' +
    '<div class="progress-bar"><div class="progress-fill" style="width:' + Math.min(100, (progressWords/goalWords)*100) + '%">' + progressWords + '/' + goalWords + '</div></div></div>' +
    '<div class="progress-status">' + (progress.goalMet ? '✅ 今日目标已完成！' : '💪 继续加油！') + '</div></div>' +
    '<div class="streak-section"><h2>🔥 连续打卡</h2>' +
    '<div class="streak-stats"><div class="streak-item">当前连续：' + (streak.currentStreak||0) + ' 天</div>' +
    '<div class="streak-item">最长连续：' + (streak.maxStreak||0) + ' 天</div></div>' +
    '<button class="streak-btn" onclick="showStreakPage()">查看打卡日历</button></div></div>';
  document.getElementById('app').innerHTML = html;
}
function saveDailyGoal() {
  var articles = parseInt(document.getElementById('goal-articles').value) || 3;
  var words = parseInt(document.getElementById('goal-words').value) || 10;
  Storage.setDailyGoal(articles, words);
  showToast('目标已保存 📝');
}
function showStreakPage() {
  var streak = Storage.getStreakData();
  var history = Storage.getCheckinCalendar(30);
  var today = new Date().toISOString().split('T')[0];
  var html = '<div class="streak-page">' +
    '<div class="screen-header"><button class="back-btn" onclick="showDailyGoal()">←</button><h1>打卡日历</h1></div>' +
    '<div class="streak-summary"><div class="streak-stat">当前连续：' + (streak.currentStreak||0) + ' 天</div>' +
    '<div class="streak-stat">最长连续：' + (streak.maxStreak||0) + ' 天</div></div>' +
    '<div class="calendar"><div class="calendar-header">最近30天打卡记录</div><div class="calendar-grid">';
  for (var i = 29; i >= 0; i--) {
    var date = new Date(Date.now() - i * 86400000);
    var dateStr = date.toISOString().split('T')[0];
    var dayEntry = history.find(function(h) { return h.date === dateStr; });
    var isToday = dateStr === today;
    var goal = Storage.getDailyGoal();
    var isGoalMet = dayEntry && dayEntry.articles >= (goal.articles||3);
    html += '<div class="calendar-cell ' + (isToday?'today':'') + ' ' + (isGoalMet?'completed':'incomplete') + '">' +
      '<div class="calendar-date">' + date.getDate() + '</div>' +
      '<div class="calendar-status">' + (isGoalMet?'✓':(isToday?'🔥':'')) + '</div></div>';
  }
  html += '</div></div>' +
    '<div class="back-section"><button class="back-btn" onclick="showDailyGoal()">返回</button></div></div>';
  document.getElementById('app').innerHTML = html;
}
function renderHomeProgress() {
  var goal = Storage.getDailyGoal();
  var progress = Storage.getTodayProgress();
  var streak = Storage.getStreakData();
  var goalArticles = goal.articles || 3;
  var goalWords = goal.words || 10;
  var progressArticles = progress.articles || 0;
  var progressWords = progress.words || 0;
  var pctA = Math.min(100, (progressArticles/goalArticles)*100);
  var pctW = Math.min(100, (progressWords/goalWords)*100);
  var html = '<div class="home-progress" onclick="showDailyGoal()">' +
    '<div class="progress-title">今日进度</div>' +
    '<div class="progress-row"><span>阅读 ' + progressArticles + '/' + goalArticles + '</span>' +
    '<div class="progress-bar-tiny"><div class="progress-fill-tiny" style="width:' + pctA + '%"></div></div></div>' +
    '<div class="progress-row"><span>单词 ' + progressWords + '/' + goalWords + '</span>' +
    '<div class="progress-bar-tiny"><div class="progress-fill-tiny" style="width:' + pctW + '%"></div></div></div>' +
    '<div class="progress-streak">' + (progress.goalMet ? '✅ 已完成' : '🔥 ' + (streak.currentStreak||0) + '连击') + '</div></div>';
  return html;
}
  showScreen(_vocabBookBack);
function updateHomeProgress() {
  var container = document.getElementById('home-progress-container');
  if (!container) return;
  var goal = Storage.getDailyGoal();
  var progress = Storage.getTodayProgress();
  var streak = Storage.getStreakData();
  var ga = goal.articles || 3;
  var gw = goal.words || 10;
  var pa = progress.articles || 0;
  var pw = progress.words || 0;
  container.innerHTML = '<div class="home-progress-widget" onclick="showDailyGoal()">' +
    '<div class="hp-title">今日进度</div>' +
    '<div class="hp-row"><span>阅读 ' + pa + '/' + ga + '</span><div class="hp-bar"><div class="hp-fill" style="width:' + Math.min(100, pa/ga*100) + '%"></div></div></div>' +
    '<div class="hp-row"><span>单词 ' + pw + '/' + gw + '</span><div class="hp-bar"><div class="hp-fill" style="width:' + Math.min(100, pw/gw*100) + '%"></div></div></div>' +
    '<div class="hp-streak">' + (progress.goalMet ? '✅ 今日目标完成' : '🔥 ' + (streak.currentStreak||0) + '连击') + '</div></div>';
}
}
function renderVocabBook() {
  var book = Storage.getVocabBook();
  var filter = document.getElementById('vb-level-filter');
  var selectedLevel = filter ? filter.value : '';

  // Update stats
  var totalEl = document.getElementById('vb-total-count');
  var masteredEl = document.getElementById('vb-mastered-count');
  if (totalEl) totalEl.textContent = book.length;
  if (masteredEl) masteredEl.textContent = book.filter(function(w) { return w.mastered; }).length;

  // Populate level filter
  if (filter) {
    var levelMap = {};
    book.forEach(function(w) {
      if (w.levelIndex !== undefined) levelMap[w.levelIndex] = true;
    });
    var options = ['<option value="">全部文章</option>'];
    Object.keys(levelMap).sort().forEach(function(idx) {
      var title = STORIES[idx] ? STORIES[idx].title : ('第' + (parseInt(idx)+1) + '篇');
      options.push('<option value="' + idx + '">' + title + '</option>');
    });
    filter.innerHTML = options.join('');
    filter.value = selectedLevel;
  }

  // Filter
  var filtered = book;
  if (selectedLevel !== '') {
    filtered = book.filter(function(w) { return String(w.levelIndex) === selectedLevel; });
  }

  var listEl = document.getElementById('vocab-book-list');
  if (!listEl) return;
  if (filtered.length === 0) {
    listEl.innerHTML = '<div class="vocab-book-empty"><div class="vocab-book-empty-icon">📖</div><div>生词本为空</div><div style="font-size:0.85em;margin-top:8px;">点击文章中的单词可加入生词本</div></div>';
    return;
  }
  var html = [];
  filtered.forEach(function(w) {
    var masteredClass = w.mastered ? 'mastered' : '';
    var articleTitle = w.articleTitle || (STORIES[w.levelIndex] ? STORIES[w.levelIndex].title : '');
    var addDate = w.addedAt ? w.addedAt.split('T')[0] : '';
    var masterBtnText = w.mastered ? '取消掌握' : '标记掌握';
    var masterBtnClass = w.mastered ? 'vocab-book-btn-unmaster' : 'vocab-book-btn-master';
    html.push('<div class="vocab-book-card ' + masteredClass + '" data-word="' + encodeURIComponent(w.word) + '">');
    html.push('<div class="vocab-book-word-row">');
    html.push('<span class="vocab-book-word">' + w.word + '</span>');
    html.push('<button class="vocab-book-btn vocab-book-btn-play" onclick="playVocabWord('' + w.word.replace(/'/g, "\'") + '')">🔊 发音</button>');
    html.push('</div>');
    if (w.meaning) html.push('<div class="vocab-book-meaning">' + w.meaning + '</div>');
    if (w.sentence) html.push('<div class="vocab-book-sentence">' + w.sentence + '</div>');
    html.push('<div class="vocab-book-meta">' + articleTitle + (addDate ? ' | ' + addDate : '') + '</div>');
    html.push('<div class="vocab-book-actions">');
    html.push('<button class="vocab-book-btn ' + masterBtnClass + '" onclick="toggleWordMastered('' + w.word.replace(/'/g, "\'") + '')">' + masterBtnText + '</button>');
    html.push('<button class="vocab-book-btn vocab-book-btn-remove" onclick="removeFromVocabBook('' + w.word.replace(/'/g, "\'") + '')">删除</button>');
    html.push('</div></div>');
  });
  listEl.innerHTML = html.join('');
}
function playVocabWord(word) {
  var utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  utterance.rate = 0.85;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}
function toggleWordMastered(word) {
  Storage.toggleVocabMastered(decodeURIComponent(word));
  renderVocabBook();
}
function removeFromVocabBook(word) {
  Storage.removeFromVocabBook(decodeURIComponent(word));
  renderVocabBook();
  showToast('已从生词本移除');
}
function exportVocabBook(format) {
  var data = Storage.exportVocabBook(format);
  if (!data) {
    showToast('生词本为空');
    return;
  }
  var mimeType = format === 'csv' ? 'text/csv' : 'text/plain';
  var blob = new Blob([data], { type: mimeType + ';charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = '生词本_' + new Date().toISOString().split('T')[0] + '.' + format;
  a.click();
  URL.revokeObjectURL(url);
  showToast('已导出 ' + format.toUpperCase() + ' 文件');
}

// v44 阅读理解闯关答题
function startReadingQuiz(levelIndex) {
  var story = STORIES[levelIndex];
  if (!story || !story.questions || story.questions.length === 0) {
    showToast('暂无题目数据');
    return;
  }

  // 生成阅读理解题目(从关卡题目中抽取或生成)
  var allQs = story.questions.filter(function(q) { return q.type === 'choice' || q.type === 'truefalse'; });
  if (allQs.length === 0) {
    showToast('本关暂无阅读理解题目');
    return;
  }

  // 随机选3-5道题
  var shuffled = allQs.slice().sort(function() { return Math.random() - 0.5; });
  var count = Math.min(shuffled.length, Math.floor(Math.random() * 3) + 3); // 3-5道
  readingQuizState = {
    active: true,
    questions: shuffled.slice(0, count),
    currentIndex: 0,
    correctCount: 0,
    streakCount: 0,
    timerInterval: null,
    timeLeft: 30,
    levelIndex: levelIndex,
    results: []
  };

  showScreen('reading-quiz');
  renderReadingQuizQuestion();
}

function renderReadingQuizQuestion() {
  var rq = readingQuizState;
  if (!rq.active || rq.currentIndex >= rq.questions.length) {
    finishReadingQuiz();
    return;
  }

  var q = rq.questions[rq.currentIndex];
  var qText = q.q || q.question || '';
  var progress = ((rq.currentIndex) / rq.questions.length * 100).toFixed(0) + '%';
  var streakBadge = rq.streakCount >= 2 ? '<span class="rq-streak-badge">🔥 ' + rq.streakCount + '连击!</span>' : '';

  var html = '<div class="rq-question-text">' + qText + '</div>';
  html += '<div class="rq-options">';

  if (q.type === 'choice') {
    (q.options || []).forEach(function(opt, i) {
      html += '<div class="rq-option-btn" data-opt-idx="' + i + '">' + ('ABCDE')[i] + '. ' + opt + '</div>';
    });
  } else {
    html += '<div class="rq-option-btn" data-opt-idx="1">A. 正确 (True)</div>';
    html += '<div class="rq-option-btn" data-opt-idx="0">B. 错误 (False)</div>';
  }
  html += '</div>';

  document.getElementById('rq-progress-fill').style.width = progress;
  document.getElementById('rq-timer').className = 'rq-timer';
  document.getElementById('rq-timer').innerHTML = '⏱️ ' + rq.timeLeft + 's';
  document.getElementById('rq-content').innerHTML = html;

  // 绑定选项点击
  var opts = document.querySelectorAll('.rq-option-btn');
  opts.forEach(function(opt) {
    opt.onclick = function() {
      if (opt.classList.contains('correct') || opt.classList.contains('wrong')) return;
      selectReadingQuizAnswer(parseInt(opt.getAttribute('data-opt-idx')));
    };
  });

  // 启动计时器
  startReadingQuizTimer();
}

function startReadingQuizTimer() {
  var rq = readingQuizState;
  if (rq.timerInterval) clearInterval(rq.timerInterval);
  rq.timeLeft = 30;

  rq.timerInterval = setInterval(function() {
    rq.timeLeft--;
    var timerEl = document.getElementById('rq-timer');
    if (!timerEl) { clearInterval(rq.timerInterval); return; }
    timerEl.innerHTML = '⏱️ ' + rq.timeLeft + 's';

    if (rq.timeLeft <= 10) timerEl.className = 'rq-timer danger';
    else if (rq.timeLeft <= 15) timerEl.className = 'rq-timer warning';

    if (rq.timeLeft <= 0) {
      clearInterval(rq.timerInterval);
      // 超时视为答错
      selectReadingQuizAnswer(-1);
    }
  }, 1000);
}

function selectReadingQuizAnswer(userIdx) {
  var rq = readingQuizState;
  if (!rq.active || rq.currentIndex >= rq.questions.length) return;

  if (rq.timerInterval) clearInterval(rq.timerInterval);

  var q = rq.questions[rq.currentIndex];
  var correctIdx = Number(q.answer !== undefined ? q.answer : q.correct);
  var correct = userIdx === correctIdx;

  if (correct) {
    rq.correctCount++;
    rq.streakCount++;
    Sound.play('win');
  } else {
    rq.streakCount = 0;
    Sound.play('fail');
  }

  rq.results.push({
    question: q.q || q.question || '',
    userAnswer: userIdx,
    correctAnswer: correctIdx,
    correct: correct
  });

  // 高亮选项
  var opts = document.querySelectorAll('.rq-option-btn');
  opts.forEach(function(opt, i) {
    if (i === correctIdx) opt.classList.add('correct');
    else if (i === userIdx && !correct) opt.classList.add('wrong');
  });

  // 自动进入下一题
  setTimeout(function() {
    rq.currentIndex++;
    renderReadingQuizQuestion();
  }, correct ? 1200 : 2000);
}

function finishReadingQuiz() {
  var rq = readingQuizState;
  rq.active = false;
  if (rq.timerInterval) { clearInterval(rq.timerInterval); rq.timerInterval = null; }

  var total = rq.questions.length;
  var correct = rq.correctCount;
  var pass = correct >= Math.ceil(total * 0.6); // 60%及格
  var score = total > 0 ? Math.round((correct / total) * 100) : 0;
  var stars = score >= 100 ? 3 : score >= 80 ? 2 : 1;
  var streak = rq.streakCount;

  // 奖励
  var coins = 0;
  if (pass) {
    coins = stars * 5;
    var progress = Storage.get(Storage.KEYS.PROGRESS) || [];
    if (progress[rq.levelIndex]) {
      var existing = progress[rq.levelIndex];
      if (score > (existing.readingScore || 0)) {
        coins += Math.floor(score / 20);
      }
      existing.readingScore = score;
      existing.readingStars = Math.max(existing.readingStars || 0, stars);
    }
    Storage.addCoins(coins);
    Storage.save();
  }

  // 保存历史记录
  var historyResult = {
    levelIndex: rq.levelIndex,
    score: score,
    correctCount: correct,
    totalQuestions: total,
    passed: pass,
    stars: stars,
    streakCount: streak,
    timestamp: new Date().toISOString()
  };
  Storage.saveReadingQuizResult(historyResult);

  // 显示结果
  var resultHtml = '<div class="rq-result-header">';
  resultHtml += '<h2>' + (pass ? '🎉 过关!' : '💪 再接再厉!') + '</h2>';
  resultHtml += '<div class="rq-result-score ' + (pass ? 'pass' : 'fail') + '">' + score + '%</div>';
  resultHtml += '<div class="rq-result-stars">' + '⭐'.repeat(stars) + '</div>';
  if (streak >= 2) {
    resultHtml += '<div class="rq-result-streak">🔥 最高 ' + streak + ' 连击!</div>';
  }
  resultHtml += '<div style="font-size:0.9em;color:#666;">' + correct + '/' + total + ' 题正确</div>';
  if (pass && coins > 0) {
    resultHtml += '<div class="rq-result-reward">💰 +' + coins + ' 金币</div>';
  }
  resultHtml += '</div>';
  resultHtml += '<div class="rq-result-btns">';
  resultHtml += '<button class="rq-retry-btn primary" onclick="startReadingQuiz(' + rq.levelIndex + ')">🔄 再来一次</button>';
  resultHtml += '<button class="rq-retry-btn secondary" onclick="exitReadingQuiz(true)">返回关卡结果</button>';
  resultHtml += '</div>';

  document.getElementById('rq-content').innerHTML = resultHtml;
  document.getElementById('rq-progress-fill').style.width = '100%';
  document.getElementById('rq-timer').style.display = 'none';
}

function exitReadingQuiz(returnToResult) {
  var rq = readingQuizState;
  rq.active = false;
  if (rq.timerInterval) { clearInterval(rq.timerInterval); rq.timerInterval = null; }
  if (returnToResult) {
    showScreen('level-result');
  } else {
    showScreen('home');
    renderLevelMap();
  }
}

function initFlashcardSwipe() {
  var container = document.querySelector('.flashcard-container');
  if (!container) return;

  var startX = 0;
  var startY = 0;
  var isDragging = false;

  container.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  container.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    var deltaX = e.touches[0].clientX - startX;
    var deltaY = e.touches[0].clientY - startY;
    // 如果水平滑动大于垂直滑动,阻止默认行为
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
    }
  }, { passive: false });

  container.addEventListener('touchend', function(e) {
    if (!isDragging) return;
    isDragging = false;
    var endX = e.changedTouches[0].clientX;
    var deltaX = endX - startX;
    // 滑动距离大于50px才触发
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        prevVocabReviewCard();
      } else {
        nextVocabReviewCard();
      }
    }
  }, { passive: true });
}


// ===== v51 task-008: Animations & Effects =====
// --- Confetti / Fireworks celebration ---
function startCelebration(passed) {
  if (!passed) return;
  // Create overlay canvas
  var overlay = document.createElement('div');
  overlay.className = 'celebration-overlay';
  overlay.id = 'celebration-overlay';
  var canvas = document.createElement('canvas');
  canvas.className = 'celebration-canvas';
  canvas.id = 'celebration-canvas';
  overlay.appendChild(canvas);
  document.body.appendChild(overlay);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext('2d');
  // Create particles
  var particles = [];
  var colors = ['#FFD700','#FF6B6B','#667eea','#764ba2','#38ef7d','#f093fb','#00d2ff','#ff9a9e'];
  for (var i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 3 + 2,
      size: Math.random() * 8 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
      opacity: 1
    });
  }
  var startTime = Date.now();
  var duration = 3000;
  function animate() {
    var elapsed = Date.now() - startTime;
    if (elapsed > duration) {
      var el = document.getElementById('celebration-overlay');
      if (el) el.remove();
      var txt = document.getElementById('level-up-text');
      if (txt) txt.remove();
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var fadeStart = duration * 0.7;
    particles.forEach(function(p) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.rotation += p.rotationSpeed;
      if (elapsed > fadeStart) {
        p.opacity = Math.max(0, 1 - (elapsed - fadeStart) / (duration - fadeStart));
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    requestAnimationFrame(animate);
  }
  animate();
  // Show level-up text
  var textEl = document.createElement('div');
  textEl.className = 'level-up-text';
  textEl.id = 'level-up-text';
  var score = arguments[0] || 0;
  var mainText = score >= 100 ? 'Perfect!' : (score >= 80 ? 'Great!' : 'Level Up!');
  textEl.innerHTML = '<div class="main-text">' + mainText + '</div><div class="sub-text">' + (score >= 100 ? '满分通关!' : (score >= 80 ? '太棒了!' : '恭喜过关!')) + '</div>';
  document.body.appendChild(textEl);
  setTimeout(function() {
    var t = document.getElementById('level-up-text');
    if (t) t.remove();
  }, 3000);
}
function updateQuizProgress() {
  var story = STORIES[currentLevel];
  if (!story) return;
  var total = story.questions.length;
  var current = currentQuestionIndex + 1;
  var pct = Math.round((current / total) * 100);
  var bar = document.getElementById('reading-progress-bar');
  if (bar) {
    bar.style.width = pct + '%';
    if (current >= total) bar.classList.add('completed');
    else bar.classList.remove('completed');
  }
  // Update quiz dots with correct/wrong indicators
  for (var i = 0; i < answers.length; i++) {
    var dots = document.querySelectorAll('.quiz-dot');
    if (dots[i]) {
      dots[i].classList.remove('correct-dot', 'wrong-dot');
      if (answers[i]) dots[i].classList.add('correct-dot');
      else dots[i].classList.add('wrong-dot');
    }
  }
}
function animateNewDot() {
  var dots = document.querySelectorAll('.quiz-dot');
  if (dots[currentQuestionIndex]) {
    dots[currentQuestionIndex].classList.add('current');
  }
}


// ===== v76 task-009: Smart article recommendation =====
var _currentDifficulty = 'easy';

function getPlayerDifficulty() {
  // Calculate player level based on stats
  var stats = Storage.getLearningStats ? Storage.getLearningStats() : {};
  var correctRate = stats.correctRate || 0;
  var articlesRead = stats.articlesRead || 0;
  var wordsLearned = (stats.masteredWords || 0) + (stats.vocabCount || 0);
  var streakDays = stats.streak || 0;
  // Score: weighted combination
  var score = correctRate * 0.4 + Math.min(articlesRead / 20, 1) * 0.3 + Math.min(wordsLearned / 50, 1) * 0.2 + Math.min(streakDays / 14, 1) * 0.1;
  if (score >= 0.7) return 'hard';
  if (score >= 0.4) return 'medium';
  return 'easy';
}

function showRecommendationPage() {
  showScreen('recommend-page');
  var level = getPlayerDifficulty();
  _currentDifficulty = level;
  updatePlayerLevelCard(level);
  switchDifficulty(level);
}

function updatePlayerLevelCard(level) {
  var names = {'easy': '🌱 入门', 'medium': '📚 进阶', 'hard': '🔥 挑战'};
  var descs = {
    'easy': '基于你的学习数据，我们推荐从简单文章开始',
    'medium': '基于你的学习数据，我们推荐进阶难度文章',
    'hard': '基于你的学习数据，我们推荐挑战级文章'
  };
  document.getElementById('player-level-name').textContent = names[level] || names['easy'];
  document.getElementById('player-level-desc').textContent = descs[level] || descs['easy'];
}

function switchDifficulty(diff) {
  _currentDifficulty = diff;
  // Update tab active state
  document.querySelectorAll('.diff-tab').forEach(function(t) {
    t.classList.toggle('active', t.getAttribute('data-diff') === diff);
  });
  renderArticleList(diff);
}

function renderArticleList(diff) {
  // Filter new articles by difficulty
  var diffStories = STORIES.filter(function(s) { return s.difficulty === diff; });
  var existingProgress = Storage.get(Storage.KEYS.PROGRESS) || [];
  var html = '';
  diffStories.forEach(function(s) {
    // Check if this article was already completed
    var completed = existingProgress[s.id] && existingProgress[s.id].stars > 0;
    var starsDisplay = completed ? '⭐'.repeat(existingProgress[s.id].stars) : '';
    var topics = (s.topics || []).join(', ');
    var badgeClass = diff === 'easy' ? 'badge-easy' : (diff === 'medium' ? 'badge-medium' : 'badge-hard');
    var topicIcon = topics.indexOf('science') >= 0 ? '🔬' :
                    topics.indexOf('technology') >= 0 ? '💻' :
                    topics.indexOf('health') >= 0 ? '💚' :
                    topics.indexOf('environment') >= 0 ? '🌍' :
                    topics.indexOf('culture') >= 0 ? '🎭' :
                    topics.indexOf('life') >= 0 ? '🌿' :
                    topics.indexOf('nature') >= 0 ? '🌊' :
                    topics.indexOf('history') >= 0 ? '📜' :
                    '📖';
    html += '<li class="article-card" onclick="startRecommendedArticle(' + s.id + ')">' +
      '<div class="art-icon">' + topicIcon + '</div>' +
      '<div class="art-info">' +
        '<div class="art-title">' + (completed ? '✅ ' : '') + s.title + ' ' + starsDisplay + '</div>' +
        '<div class="art-meta">' +
          '<span>' + (s.vocabulary ? s.vocabulary.length : 0) + ' 词汇</span>' +
          '<span>' + s.questions.length + ' 题</span>' +
          '<span>' + (topics || '综合') + '</span>' +
        '</div>' +
      '</div>' +
      '<span class="art-badge ' + badgeClass + '">' + (diff === 'easy' ? '入门' : (diff === 'medium' ? '进阶' : '挑战')) + '</span>' +
    '</li>';
  });
  var listEl = document.getElementById('article-list');
  if (listEl) listEl.innerHTML = html;
  var countEl = document.getElementById('article-count');
  if (countEl) countEl.textContent = '共 ' + diffStories.length + ' 篇文章';
}

function startRecommendedArticle(storyId) {
  // Find the story in STORIES
  var story = STORIES.find(function(s) { return s.id === storyId; });
  if (!story) {
    showToast('文章未找到', 2000);
    return;
  }
  // Store as special currentLevel
  currentLevel = storyId;
  // Track that this article is being read (for stats)
  showScreen('quiz-screen');
  currentQuestionIndex = 0;
  answers = [];
  selectedAnswers = [];
  answers.push = answers.push; // Already handled
  startTimer();
  renderQuestion();
  showToast('开始阅读: ' + story.title, 2000);
}

// Hook: after finishLevel, record the recommended article as read
var _orig_finishLevel = finishLevel;
finishLevel = function() {
  var wasRecommended = currentLevel >= 100; // Recommended articles have id >= 100
  _orig_finishLevel.apply(this, arguments);
  if (wasRecommended && Storage.recordArticleRead) {
    // Don't double-record - finishLevel already calls recordArticleRead
  }
};

document.addEventListener('DOMContentLoaded', function() {
  // v81: Initialize music system
  Music.init();
  var settings = Storage.getSettings();
  document.getElementById('music-toggle').textContent = settings.music ? '音乐：开' : '音乐：关';
  document.getElementById('music-volume').value = settings.musicVolume || 50;
  Storage.init();
  Sound.init();
  applySavedTheme();
  Storage.checkMissedDays(); // v50 检查连续天数是否中断
  // Update theme toggle text
  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.textContent = '主题：' + (localStorage.getItem('sc_theme') === 'dark' ? '深色' : '浅色');
  }
  renderLevelMap();

  // Check if first time (show intro video) or returning user
  var played = Storage.get(Storage.KEYS.PLAYED);
  if (!played) {
    showIntro();
  } else if (Storage.isLoggedIn()) {
    showReturnScreen();
  } else {
    showLogin();
  }

  updateNavButtons();
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
    window.Capacitor.Plugins.App.addListener('backButton', function() {
      var active = document.querySelector('.screen.active');
      if (active && active.id === 'home') {
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

// v45 学习数据统计
function renderLearningStats() {
  showScreen('learning-stats');
  var stats = Storage.getLearningStats();

  // 更新段位徽章
  document.getElementById('stats-rank').textContent = stats.rank + ' | ' + stats.totalStars + ' ⭐';

  // 生成统计卡片
  var html = '';

  // 总星星数(突出显示)
  html += '<div class="stats-stars-display">';
  html += '<div class="stats-stars-value">' + stats.totalStars + '</div>';
  html += '<div class="stats-stars-label">累计获得 ⭐</div>';
  html += '</div>';

  // 统计网格
  html += '<div class="stats-grid">';
  html += '<div class="stats-card">';
  html += '<div class="stats-card-icon">📚</div>';
  html += '<div class="stats-card-value">' + stats.articlesRead + '/' + stats.totalArticles + '</div>';
  html += '<div class="stats-card-label">已读文章</div>';
  html += '</div>';

  html += '<div class="stats-card">';
  html += '<div class="stats-card-icon">📖</div>';
  html += '<div class="stats-card-value">' + stats.vocabMastered + '</div>';
  html += '<div class="stats-card-label">掌握词汇</div>';
  html += '</div>';

  html += '<div class="stats-card">';
  html += '<div class="stats-card-icon">🔥</div>';
  html += '<div class="stats-card-value">' + stats.streakDays + '</div>';
  html += '<div class="stats-card-label">连续学习天</div>';
  html += '</div>';

  html += '<div class="stats-card">';
  html += '<div class="stats-card-icon">💰</div>';
  html += '<div class="stats-card-value">' + stats.totalCoins + '</div>';
  html += '<div class="stats-card-label">拥有金币</div>';
  html += '</div>';
  html += '</div>';

  // 7天阅读理解正确率图表
  html += '<div class="stats-chart-container">';
  html += '<div class="stats-chart-title">📈 近7天阅读理解正确率</div>';
  html += '<canvas id="stats-chart-canvas" class="stats-chart-canvas"></canvas>';
  html += '</div>';

  document.getElementById('stats-content').innerHTML = html;

  // 绘制柱状图
  setTimeout(function() {
    drawStatsChart(stats.quizAccuracyLast7Days);
  }, 100);
}

function drawStatsChart(data) {
  var canvas = document.getElementById('stats-chart-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var w = canvas.offsetWidth || 300;
  var h = 150;
  canvas.width = w;
  canvas.height = h;
  ctx.clearRect(0, 0, w, h);

  var maxVal = Math.max.apply(null, data.concat([100]));
  var dayLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  var dayIndex = (new Date().getDay() + 6) % 7; // 0=Monday

  var barWidth = w / 7 - 8;
  var chartH = h - 20;

  for (var i = 0; i < 7; i++) {
    var val = data[i] || 0;
    var barH = (val / 100) * chartH;
    var x = i * (w / 7) + 4;
    var y = chartH - barH;

    // 柱子
    var gradient = ctx.createLinearGradient(x, y, x, chartH);
    gradient.addColorStop(0, val >= 60 ? '#4CAF50' : val >= 40 ? '#FF9800' : '#f44336');
    gradient.addColorStop(1, val >= 60 ? '#81C784' : val >= 40 ? '#FFB74D' : '#E57373');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barH);

    // 数值
    ctx.fillStyle = '#666';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(val + '%', x + barWidth / 2, y - 4);

    // 星期
    var labelI = (dayIndex - 6 + i + 7) % 7;
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.fillText(dayLabels[labelI], x + barWidth / 2, h - 4);
  }
}

// v81: Music control functions
function toggleMusic() {
  var enabled = Music.toggle();
  document.getElementById('music-toggle').textContent = enabled ? '音乐：开' : '音乐：关';
}

function setMusicVolume(vol) {
  Music.setVolume(parseInt(vol));
}

function nextTrack() {
  var name = Music.nextTrack();
  document.getElementById('track-name').textContent = '曲目：' + name;
}

// ============== v89 排行榜增强 ==============
var lbCurrentTab = 'national';
var lbCurrentPeriod = 'total';

function showLeaderboardEnhanced() {
  showScreen('leaderboard-enhanced');
  renderLeaderboardEnhanced();
}

function switchLeaderboardTab(tab) {
  lbCurrentTab = tab;
  document.querySelectorAll('.lb-tab').forEach(function(t) { t.classList.remove('active'); });
  event.target.classList.add('active');
  renderLeaderboardEnhanced();
}

function switchLeaderboardPeriod(period) {
  lbCurrentPeriod = period;
  document.querySelectorAll('.period-tab').forEach(function(t) { t.classList.remove('active'); });
  event.target.classList.add('active');
  renderLeaderboardEnhanced();
}

function renderLeaderboardEnhanced() {
  var data = lbCurrentTab === 'national' ? Storage.getNationalLeaderboard() : Storage.getFriendsLeaderboard();
  
  // Podium (top 3)
  var podiumHtml = '';
  var top3 = data.slice(0, 3);
  if (top3.length >= 3) {
    podiumHtml = '<div class="podium-item silver"><div class="podium-rank">🥈</div><div class="podium-name">' + top3[1].name + '</div><div class="podium-stars">⭐' + top3[1].stars + '</div></div>';
    podiumHtml += '<div class="podium-item gold"><div class="podium-rank">🥇</div><div class="podium-name">' + top3[0].name + '</div><div class="podium-stars">⭐' + top3[0].stars + '</div></div>';
    podiumHtml += '<div class="podium-item bronze"><div class="podium-rank">🥉</div><div class="podium-name">' + top3[2].name + '</div><div class="podium-stars">⭐' + top3[2].stars + '</div></div>';
  }
  document.getElementById('lb-podium').innerHTML = podiumHtml;
  
  // List (rest)
  var listHtml = '';
  data.slice(3).forEach(function(user, idx) {
    listHtml += '<div class="lb-item' + (user.isMe ? ' me' : '') + '">';
    listHtml += '<div class="lb-rank">#' + (idx + 4) + '</div>';
    listHtml += '<div class="lb-name">' + user.name + (user.isMe ? ' (我)' : '') + '</div>';
    listHtml += '<div class="lb-stars">⭐' + user.stars + '</div>';
    listHtml += '</div>';
  });
  document.getElementById('lb-list').innerHTML = listHtml;
}

// ============== v89 好友系统 ==============
var friendCurrentTab = 'list';

function showFriendsPage() {
  showScreen('friends-page');
  renderFriendsContent();
}

function switchFriendTab(tab) {
  friendCurrentTab = tab;
  document.querySelectorAll('.friend-tab').forEach(function(t) { t.classList.remove('active'); });
  event.target.classList.add('active');
  renderFriendsContent();
}

function renderFriendsContent() {
  var html = '';
  if (friendCurrentTab === 'list') {
    var friends = Storage.getFriends();
    if (friends.length === 0) {
      html = '<div style="text-align:center;padding:40px;color:var(--text-muted,#888);">暂无好友，去添加吧！</div>';
    } else {
      friends.forEach(function(f) {
        html += '<div class="friend-card">';
        html += '<div class="friend-avatar">' + f.name.charAt(0) + '</div>';
        html += '<div class="friend-info"><div class="friend-name">' + f.name + '</div><div class="friend-stars">⭐' + (f.stars || 0) + '</div></div>';
        html += '<div class="friend-actions">';
        html += '<button class="friend-btn battle" onclick="startBattleWith(\'' + f.id + '\',\'' + f.name + '\')">对战</button>';
        html += '<button class="friend-btn remove" onclick="removeFriend(\'' + f.id + '\')">删除</button>';
        html += '</div></div>';
      });
    }
  } else if (friendCurrentTab === 'requests') {
    var requests = Storage.getFriendRequests();
    document.getElementById('friend-request-count').textContent = requests.length;
    if (requests.length === 0) {
      html = '<div style="text-align:center;padding:40px;color:var(--text-muted,#888);">暂无好友申请</div>';
    } else {
      requests.forEach(function(r) {
        html += '<div class="friend-card">';
        html += '<div class="friend-avatar">' + r.fromName.charAt(0) + '</div>';
        html += '<div class="friend-info"><div class="friend-name">' + r.fromName + '</div><div class="friend-stars">⭐' + (r.fromStars || 0) + '</div></div>';
        html += '<div class="friend-actions">';
        html += '<button class="friend-btn battle" onclick="acceptFriend(\'' + r.fromId + '\',\'' + r.fromName + '\',' + (r.fromStars || 0) + ')">接受</button>';
        html += '<button class="friend-btn remove" onclick="rejectFriend(\'' + r.fromId + '\')">拒绝</button>';
        html += '</div></div>';
      });
    }
  } else if (friendCurrentTab === 'search') {
    html = '<input type="text" class="search-input" placeholder="搜索用户名或ID..." oninput="searchFriend(this.value)">';
    html += '<div class="search-results" id="search-results"></div>';
    setTimeout(function() { searchFriend(''); }, 100);
  }
  document.getElementById('friends-content').innerHTML = html;
  if (friendCurrentTab !== 'search') {
    var requests = Storage.getFriendRequests();
    var countEl = document.getElementById('friend-request-count');
    if (countEl) countEl.textContent = requests.length;
  }
}

function searchFriend(keyword) {
  var users = Storage.searchUsers(keyword);
  var friends = Storage.getFriends();
  var friendIds = friends.map(function(f) { return f.id; });
  var html = '';
  users.forEach(function(u) {
    if (u.id === 'me') return;
    var isFriend = friendIds.indexOf(u.id) >= 0;
    html += '<div class="friend-card">';
    html += '<div class="friend-avatar">' + u.name.charAt(0) + '</div>';
    html += '<div class="friend-info"><div class="friend-name">' + u.name + '</div><div class="friend-stars">⭐' + u.stars + '</div></div>';
    if (!isFriend) {
      html += '<button class="friend-btn battle" onclick="sendFriendRequest(\'' + u.id + '\',\'' + u.name + '\',' + u.stars + ')">添加</button>';
    } else {
      html += '<span style="color:var(--text-muted,#888);font-size:0.85em;">已好友</span>';
    }
    html += '</div>';
  });
  var el = document.getElementById('search-results');
  if (el) el.innerHTML = html;
}

function sendFriendRequest(id, name, stars) {
  Storage.addFriend({ id: id, name: name, stars: stars });
  showToast('已添加 ' + name + ' 为好友');
  searchFriend(document.querySelector('.search-input')?.value || '');
}

function acceptFriend(id, name, stars) {
  Storage.acceptFriendRequest(id, name, stars);
  showToast('已接受 ' + name + ' 的好友申请');
  renderFriendsContent();
}

function rejectFriend(id) {
  Storage.rejectFriendRequest(id);
  showToast('已拒绝好友申请');
  renderFriendsContent();
}

function removeFriend(id) {
  Storage.removeFriend(id);
  showToast('已删除好友');
  renderFriendsContent();
}

// ============== v89 对战系统 ==============
var battleState = {
  opponent: null,
  level: null,
  score: 0,
  opponentScore: 0,
  startTime: null
};

function startBattleWith(friendId, friendName) {
  battleState.opponent = { id: friendId, name: friendName };
  battleState.level = Math.floor(Math.random() * 10); // Random level 0-9
  battleState.score = 0;
  battleState.opponentScore = Math.floor(Math.random() * 5) + 3; // Simulated opponent score
  battleState.startTime = Date.now();
  
  showScreen('battle-invite');
  var html = '<div style="padding:20px;text-align:center;">';
  html += '<h3>⚔️ 对战 ' + friendName + '</h3>';
  html += '<p>关卡：第 ' + (battleState.level + 1) + ' 关</p>';
  html += '<button class="nav-btn" onclick="startBattleLevel()" style="margin-top:20px;background:linear-gradient(135deg,#ff6b6b,#ff8e53);">开始对战</button>';
  html += '</div>';
  document.getElementById('battle-content').innerHTML = html;
}

function startBattleLevel() {
  currentLevel = battleState.level;
  startLevel();
}

function finishBattle(correctCount, timeUsed) {
  var myScore = correctCount * 10 + Math.max(0, 100 - Math.floor(timeUsed / 1000));
  var result = myScore > battleState.opponentScore ? 'win' : (myScore < battleState.opponentScore ? 'lose' : 'draw');
  
  var battle = {
    opponentId: battleState.opponent.id,
    opponentName: battleState.opponent.name,
    myScore: myScore,
    opponentScore: battleState.opponentScore,
    result: result,
    playedAt: Date.now()
  };
  Storage.saveBattle(battle);
  
  var html = '<div style="padding:20px;text-align:center;">';
  html += '<h3>' + (result === 'win' ? '🎉 胜利！' : (result === 'lose' ? '😢 失败' : '🤝 平局')) + '</h3>';
  html += '<p>你的得分：' + myScore + '</p>';
  html += '<p>' + battleState.opponent.name + '：' + battleState.opponentScore + '</p>';
  html += '<button class="nav-btn" onclick="goHome()" style="margin-top:20px;">返回首页</button>';
  html += '</div>';
  document.getElementById('battle-content').innerHTML = html;
}

// ==================== v92 学习报告 PDF 导出 ====================
function showPdfReport() {
  showScreen('pdf-report');
  var container = document.getElementById('pdf-report-content');
  if (!container) return;
  container.innerHTML = '<div class="pdf-loading"><div class="spinner"></div><br>正在生成学习报告...</div>';
  
  // Collect data
  var stats = Storage.getLearningStats();
  var achievements = Storage.getAchievements();
  var achDefs = Storage.ACHIEVEMENT_DEFS;
  var vocabBook = Storage.getVocabBook();
  var masteredCount = vocabBook.filter(function(w) { return w.mastered; }).length;
  var streak = Storage.getStreakData();
  var progress = Storage.get(Storage.KEYS.PROGRESS) || [];
  var goal = Storage.getDailyGoal();
  var todayProg = Storage.getTodayProgress();
  var dailyReward = Storage.getDailyRewardStatus();
  var wrongAnswers = Storage.getWrongAnswers();
  var userName = Storage.getName() || '学习者';
  var totalStars = stats.totalStars || 0;
  var chicksSaved = Storage.getChicksSaved();
  var totalQuestions = 0;
  var totalCorrect = 0;
  
  // Calculate total questions answered
  progress.forEach(function(p) {
    if (p && p.passed) {
      totalQuestions += 5; // approx 5 questions per level
      totalCorrect += Math.round(5 * (p.stars || 0) / 3);
    }
  });
  var accuracy = totalQuestions > 0 ? Math.round(totalCorrect / totalQuestions * 100) : 0;
  
  // Build preview HTML
  var html = '<div class="pdf-report-preview">';
  
  // Title
  html += '<div style="text-align:center;margin-bottom:16px;">';
  html += '<h2 style="color:#4a3728;">🐤 拯救小鸡 - 学习报告</h2>';
  html += '<p style="color:#888;font-size:0.85em;">' + userName + ' | ' + new Date().toLocaleDateString('zh-CN') + '</p>';
  html += '</div>';
  
  // Section 1: Overview stats
  html += '<h3>📊 学习概览</h3>';
  html += '<div class="pdf-stat-grid">';
  html += '<div class="pdf-stat-item"><div class="label">学习天数</div><div class="value">' + (dailyReward.totalDays || 0) + '</div></div>';
  html += '<div class="pdf-stat-item"><div class="label">总答题数</div><div class="value">' + totalQuestions + '</div></div>';
  html += '<div class="pdf-stat-item"><div class="label">正确率</div><div class="value">' + accuracy + '%</div></div>';
  html += '<div class="pdf-stat-item"><div class="label">累计星星</div><div class="value">⭐' + totalStars + '</div></div>';
  html += '<div class="pdf-stat-item"><div class="label">已救小鸡</div><div class="value">🐤' + chicksSaved + '/10</div></div>';
  html += '<div class="pdf-stat-item"><div class="label">段位</div><div class="value">' + (stats.rank || 'Lv.1') + '</div></div>';
  html += '</div>';
  
  // Section 2: Achievements
  html += '<h3>🏆 成就列表</h3>';
  var unlockedCount = 0;
  achDefs.forEach(function(def) {
    var unlocked = achievements[def.id];
    if (unlocked) {
      unlockedCount++;
      var date = new Date(unlocked.unlockedAt).toLocaleDateString('zh-CN');
      html += '<div class="pdf-ach-item">';
      html += '<span class="ach-icon">' + def.icon + '</span>';
      html += '<span class="ach-name">' + def.name + '</span>';
      html += '<span class="ach-time">' + date + '</span>';
      html += '</div>';
    }
  });
  if (unlockedCount === 0) {
    html += '<p style="color:#888;font-size:0.85em;text-align:center;padding:10px;">暂无解锁成就</p>';
  } else {
    html += '<p style="color:#888;font-size:0.8em;text-align:right;">已解锁 ' + unlockedCount + '/' + achDefs.length + '</p>';
  }
  
  // Section 3: Vocabulary stats
  html += '<h3>📖 词汇统计</h3>';
  html += '<div class="pdf-stat-grid">';
  html += '<div class="pdf-stat-item"><div class="label">生词本单词</div><div class="value">' + vocabBook.length + '</div></div>';
  html += '<div class="pdf-stat-item"><div class="label">已掌握</div><div class="value">' + masteredCount + '</div></div>';
  html += '<div class="pdf-stat-item"><div class="label">未掌握</div><div class="value">' + (vocabBook.length - masteredCount) + '</div></div>';
  html += '<div class="pdf-stat-item"><div class="label">掌握率</div><div class="value">' + (vocabBook.length > 0 ? Math.round(masteredCount / vocabBook.length * 100) : 0) + '%</div></div>';
  html += '</div>';
  
  // Section 4: Check-in records
  html += '<h3>🔥 打卡记录</h3>';
  html += '<div class="pdf-stat-grid">';
  html += '<div class="pdf-stat-item"><div class="label">连续打卡</div><div class="value">' + (streak.currentStreak || 0) + '天</div></div>';
  html += '<div class="pdf-stat-item"><div class="label">最长连续</div><div class="value">' + (streak.maxStreak || 0) + '天</div></div>';
  html += '<div class="pdf-stat-item"><div class="label">今日阅读</div><div class="value">' + (todayProg.articles || 0) + '/' + (goal.articles || 3) + '</div></div>';
  html += '<div class="pdf-stat-item"><div class="label">今日单词</div><div class="value">' + (todayProg.words || 0) + '/' + (goal.words || 10) + '</div></div>';
  html += '</div>';
  
  // Section 5: Level progress (first 30)
  html += '<h3>🗺️ 关卡进度</h3>';
  for (var i = 0; i < Math.min(30, progress.length); i++) {
    var p = progress[i];
    if (!p) continue;
    var stars = '';
    for (var s = 0; s < 3; s++) {
      stars += s < (p.stars || 0) ? '⭐' : '☆';
    }
    var status = p.passed ? '✅' : '🔒';
    html += '<div class="pdf-level-row">';
    html += '<span>' + status + '</span>';
    html += '<span class="level-name">第' + (i + 1) + '关</span>';
    html += '<span>' + stars + '</span>';
    html += '</div>';
  }
  
  html += '</div>'; // close pdf-report-preview
  
  // Export button
  html += '<button class="pdf-export-btn" onclick="exportPdfReport()">📥 导出 PDF 报告</button>';
  html += '<p style="text-align:center;color:#aaa;font-size:0.75em;margin:10px 0 30px;">PDF 报告将自动下载到设备</p>';
  
  container.innerHTML = html;
}

function exportPdfReport() {
  try {
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF('p', 'mm', 'a4');
    
    // Collect data
    var stats = Storage.getLearningStats();
    var achievements = Storage.getAchievements();
    var achDefs = Storage.ACHIEVEMENT_DEFS;
    var vocabBook = Storage.getVocabBook();
    var masteredCount = vocabBook.filter(function(w) { return w.mastered; }).length;
    var streak = Storage.getStreakData();
    var progress = Storage.get(Storage.KEYS.PROGRESS) || [];
    var dailyReward = Storage.getDailyRewardStatus();
    var goal = Storage.getDailyGoal();
    var todayProg = Storage.getTodayProgress();
    var userName = Storage.getName() || 'Learner';
    var totalStars = stats.totalStars || 0;
    var chicksSaved = Storage.getChicksSaved();
    var totalQuestions = 0;
    var totalCorrect = 0;
    progress.forEach(function(p) {
      if (p && p.passed) {
        totalQuestions += 5;
        totalCorrect += Math.round(5 * (p.stars || 0) / 3);
      }
    });
    var accuracy = totalQuestions > 0 ? Math.round(totalCorrect / totalQuestions * 100) : 0;
    
    var pageW = 210;
    var margin = 15;
    var contentW = pageW - margin * 2;
    var y = 20;
    
    // Helper: add text with auto page break
    function addText(text, x, fontSize, style) {
      doc.setFontSize(fontSize || 12);
      if (style === 'bold') {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      doc.text(text, x, y);
    }
    
    function checkPage(needed) {
      if (y + needed > 280) {
        doc.addPage();
        y = 20;
      }
    }
    
    // Title
    doc.setFillColor(74, 55, 40);
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(255, 255, 255);
    addText('Save The Chicks - Learning Report', margin, 20, 'bold');
    y += 8;
    addText(userName + '  |  ' + new Date().toLocaleDateString('en-CA'), margin, 11);
    y += 20;
    
    // Section 1: Overview
    doc.setTextColor(74, 55, 40);
    addText('1. Learning Overview', margin, 14, 'bold');
    y += 8;
    doc.setTextColor(80, 80, 80);
    var overviewItems = [
      ['Total Days', '' + (dailyReward.totalDays || 0)],
      ['Total Questions', '' + totalQuestions],
      ['Accuracy', accuracy + '%'],
      ['Total Stars', '' + totalStars],
      ['Chicks Saved', chicksSaved + '/10'],
      ['Rank', stats.rank || 'Lv.1'],
      ['Coins', '' + (Storage.getCoins() || 0)]
    ];
    overviewItems.forEach(function(item) {
      checkPage(8);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(item[0] + ':', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text(item[1], margin + 50, y);
      y += 7;
    });
    y += 5;
    
    // Section 2: Achievements
    checkPage(15);
    doc.setTextColor(74, 55, 40);
    addText('2. Achievements', margin, 14, 'bold');
    y += 8;
    doc.setTextColor(80, 80, 80);
    var unlockedCount = 0;
    achDefs.forEach(function(def) {
      var unlocked = achievements[def.id];
      if (unlocked) {
        unlockedCount++;
        checkPage(8);
        var date = new Date(unlocked.unlockedAt).toLocaleDateString('en-CA');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(def.icon + ' ' + def.name, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.text(def.desc + '  (' + date + ')', margin + 55, y);
        y += 6;
      }
    });
    if (unlockedCount === 0) {
      doc.setFontSize(10);
      doc.text('No achievements unlocked yet.', margin, y);
      y += 7;
    }
    doc.setFontSize(9);
    doc.text('Unlocked: ' + unlockedCount + '/' + achDefs.length, margin, y);
    y += 10;
    
    // Section 3: Vocabulary
    checkPage(20);
    doc.setTextColor(74, 55, 40);
    addText('3. Vocabulary Stats', margin, 14, 'bold');
    y += 8;
    doc.setTextColor(80, 80, 80);
    var vocabItems = [
      ['Total Words', '' + vocabBook.length],
      ['Mastered', '' + masteredCount],
      ['Learning', '' + (vocabBook.length - masteredCount)],
      ['Mastery Rate', (vocabBook.length > 0 ? Math.round(masteredCount / vocabBook.length * 100) : 0) + '%']
    ];
    vocabItems.forEach(function(item) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(item[0] + ':', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text(item[1], margin + 50, y);
      y += 7;
    });
    y += 5;
    
    // Section 4: Streak & Check-in
    checkPage(20);
    doc.setTextColor(74, 55, 40);
    addText('4. Streak & Check-in', margin, 14, 'bold');
    y += 8;
    doc.setTextColor(80, 80, 80);
    var streakItems = [
      ['Current Streak', (streak.currentStreak || 0) + ' days'],
      ['Max Streak', (streak.maxStreak || 0) + ' days'],
      ['Daily Goal', (goal.articles || 3) + ' articles / ' + (goal.words || 10) + ' words'],
      ['Today Progress', (todayProg.articles || 0) + ' articles / ' + (todayProg.words || 0) + ' words']
    ];
    streakItems.forEach(function(item) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(item[0] + ':', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text(item[1], margin + 55, y);
      y += 7;
    });
    y += 5;
    
    // Section 5: Level Progress
    checkPage(15);
    doc.setTextColor(74, 55, 40);
    addText('5. Level Progress', margin, 14, 'bold');
    y += 8;
    doc.setTextColor(80, 80, 80);
    for (var i = 0; i < Math.min(30, progress.length); i++) {
      var p = progress[i];
      if (!p) continue;
      checkPage(7);
      var starStr = '';
      for (var s = 0; s < (p.stars || 0); s++) starStr += '*';
      for (var s2 = (p.stars || 0); s2 < 3; s2++) starStr += '-';
      var statusStr = p.passed ? '[P]' : '[L]';
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Lv.' + (i + 1) + '  ' + statusStr + '  ' + starStr + '  Score:' + (p.score || 0), margin, y);
      y += 5;
    }
    
    // Footer
    checkPage(15);
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageW - margin, y);
    y += 8;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by Save The Chicks App on ' + new Date().toISOString(), margin, y);
    
    // Save
    var filename = 'SaveTheChicks_Report_' + new Date().toISOString().split('T')[0] + '.pdf';
    doc.save(filename);
    
    showToast('PDF report exported: ' + filename);
  } catch(e) {
    console.error('PDF export error:', e);
    showToast('PDF export failed, please check jsPDF library is loaded');
  }
}
