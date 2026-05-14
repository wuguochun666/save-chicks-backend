const Storage = {
  KEYS: {
    CHICKS: 'sc_chicks',
    PROGRESS: 'sc_progress',
    SCORE: 'sc_score',
    VOCAB: 'sc_vocab',
    CHECKIN: 'sc_checkin',
    SETTINGS: 'sc_settings',
    PLAYED: 'sc_played',
    USER_ID: 'sc_user_id',
    USER_TOKEN: 'sc_user_token',
    USER_PHONE: 'sc_user_phone',
    USER_NAME: 'sc_user_name',
    USER_SCHOOL: 'sc_user_school',
    WRONG_ANSWERS: 'sc_wrong_answers',   // v36 错题本
    DAILY_REWARD: 'sc_daily_reward',       // v36 每日奖励
    COINS: 'sc_coins',                     // v36 金币
    CHICK_STATES: 'sc_chick_states',        // v36 小鸡花园2.0
    VOCAB_REVIEW: 'sc_vocab_review',          // v37 词汇复习进度
    ACHIEVEMENTS: 'sc_achievements',            // v37 成就系统
    QUIZ_STREAK: 'sc_quiz_streak',                 // v86 quiz streak counter
    CLICKED_WORDS: 'sc_clicked_words',          // v43 点击单词记录
    READING_QUIZ_HISTORY: 'sc_reading_quiz_history',  // v44 阅读理解闯关答题记录
    VOCAB_BOOK: 'sc_vocab_book',                     // v47 生词本
    DAILY_GOAL: 'sc_daily_goal',                       // v50 每日学习目标
    DAILY_PROGRESS: 'sc_daily_progress',               // v50 当日学习进度
    STREAK_DATA: 'sc_streak_data'                      // v50 连续打卡数据                     // v47 生词本
  },
  init() {
    if (!this.get(this.KEYS.CHICKS)) {
      this.set(this.KEYS.CHICKS, Array(10).fill(false));
      this.set(this.KEYS.PROGRESS, Array(30).fill(null).map(() => ({ passed: false, score: 0, stars: 0 })));
      this.set(this.KEYS.SCORE, 0);
      this.set(this.KEYS.VOCAB, []);
      this.set(this.KEYS.CHECKIN, { lastDate: null, streak: 0, history: [] });
      this.set(this.KEYS.SETTINGS, { sound: true });
      this.set(this.KEYS.WRONG_ANSWERS, []);
      this.set(this.KEYS.DAILY_REWARD, { lastDate: null, streak: 0, totalDays: 0 });
      this.set(this.KEYS.COINS, 0);
      this.set(this.KEYS.CHICK_STATES, {});
      this.set(this.KEYS.VOCAB_REVIEW, {});
      this.set(this.KEYS.ACHIEVEMENTS, {});
      this.set(this.KEYS.CLICKED_WORDS, {});
      this.set(this.KEYS.READING_QUIZ_HISTORY, []);
      this.set(this.KEYS.VOCAB_BOOK, []);
      this.set(this.KEYS.DAILY_GOAL, { articles: 3, words: 10 });
      this.set(this.KEYS.DAILY_PROGRESS, { date: null, articles: 0, words: 0, goalMet: false });
      this.set(this.KEYS.STREAK_DATA, { currentStreak: 0, maxStreak: 0, history: [] });
    }
  },
  get(key) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch(e) { return null; }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getChicksSaved() {
    return (this.get(this.KEYS.CHICKS) || Array(10).fill(false)).filter(c => c).length;
  },
  rescueChick(index) {
    const chicks = this.get(this.KEYS.CHICKS) || Array(10).fill(false);
    chicks[index] = true;
    this.set(this.KEYS.CHICKS, chicks);
  },
  getLevelProgress(levelIndex) {
    const progress = this.get(this.KEYS.PROGRESS) || [];
    return progress[levelIndex] || { passed: false, score: 0, stars: 0 };
  },
  setLevelProgress(levelIndex, data) {
    const progress = this.get(this.KEYS.PROGRESS) || Array(30).fill(null).map(() => ({ passed: false, score: 0, stars: 0 }));
    const current = progress[levelIndex] || { passed: false, score: 0, stars: 0 };
    // 保留最高分，只有当新分数更高时才更新
    progress[levelIndex] = {
      passed: data.passed || current.passed,  // 只要通过过就算通过
      score: Math.max(data.score || 0, current.score || 0),  // 保留最高分
      stars: Math.max(data.stars || 0, current.stars || 0)   // 保留最高星
    };
    this.set(this.KEYS.PROGRESS, progress);
  },
  getTotalScore() {
    return this.get(this.KEYS.SCORE) || 0;
  },
  addScore(points) {
    const s = this.getTotalScore() + points;
    this.set(this.KEYS.SCORE, s);
    return s;
  },
  getVocab() {
    return this.get(this.KEYS.VOCAB) || [];
  },
  addVocab(word, meaning) {
    const vocab = this.getVocab();
    if (!vocab.find(v => v.word === word)) {
      vocab.push({ word, meaning, addedAt: Date.now() });
      this.set(this.KEYS.VOCAB, vocab);
    }
  },
  getSettings() {
    return this.get(this.KEYS.SETTINGS) || { sound: true, music: false, musicVolume: 50, soundVolume: 70 };
  },
  updateSettings(data) {
    this.set(this.KEYS.SETTINGS, { ...this.getSettings(), ...data });
  },
  reset() {
    Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
    this.init();
  },

  // ============== 用户登录相关 ==============
  saveUser(user) {
    this.set(this.KEYS.USER_ID, user.id || user.userId);
    this.set(this.KEYS.USER_TOKEN, user.token);
    this.set(this.KEYS.USER_PHONE, user.phone);
    this.set(this.KEYS.USER_NAME, user.name || user.nickname);
    this.set(this.KEYS.USER_SCHOOL, user.school || '');
  },
  getUserId() { return this.get(this.KEYS.USER_ID); },
  getToken() { return this.get(this.KEYS.USER_TOKEN); },
  getPhone() { return this.get(this.KEYS.USER_PHONE); },
  getName() { return this.get(this.KEYS.USER_NAME) || ''; },
  getSchool() { return this.get(this.KEYS.USER_SCHOOL) || ''; },
  isLoggedIn() {
    return !!this.get(this.KEYS.USER_TOKEN);
  },
  logout() {
    localStorage.removeItem(this.KEYS.USER_ID);
    localStorage.removeItem(this.KEYS.USER_TOKEN);
    localStorage.removeItem(this.KEYS.USER_PHONE);
    localStorage.removeItem(this.KEYS.USER_NAME);
    localStorage.removeItem(this.KEYS.USER_SCHOOL);
  },

  // ============== v36 错题本 ==============
  getWrongAnswers() {
    return this.get(this.KEYS.WRONG_ANSWERS) || [];
  },
  addWrongAnswer(levelIndex, question, userAnswer, correctAnswer, options, explanation) {
    var wrong = this.getWrongAnswers();
    var id = levelIndex + '_' + (question.q || question.question || '').substring(0, 20);
    // 去重：同题只保留最新记录
    var existing = wrong.findIndex(function(w) { return w.id === id; });
    var entry = {
      id: id,
      levelIndex: levelIndex,
      question: question.q || question.question || '',
      userAnswer: userAnswer,
      correctAnswer: correctAnswer,
      options: options || [],
      explanation: explanation || '',
      timestamp: Date.now()
    };
    if (existing >= 0) {
      wrong[existing] = entry;
    } else {
      wrong.push(entry);
    }
    this.set(this.KEYS.WRONG_ANSWERS, wrong);
  },
  clearWrongAnswers() {
    this.set(this.KEYS.WRONG_ANSWERS, []);
  },
  removeWrongAnswer(id) {
    var wrong = this.getWrongAnswers().filter(function(w) { return w.id !== id; });
    this.set(this.KEYS.WRONG_ANSWERS, wrong);
  },

  // ============== v36 每日登录奖励 ==============
  getDailyRewardStatus() {
    return this.get(this.KEYS.DAILY_REWARD) || { lastDate: null, streak: 0, totalDays: 0 };
  },
  canClaimDailyReward() {
    var status = this.getDailyRewardStatus();
    var today = new Date().toISOString().substring(0, 10); // YYYY-MM-DD
    return status.lastDate !== today;
  },
  claimDailyReward() {
    var status = this.getDailyRewardStatus();
    var today = new Date().toISOString().substring(0, 10);
    var yesterday = new Date(Date.now() - 86400000).toISOString().substring(0, 10);
    var streak = (status.lastDate === yesterday) ? (status.streak || 0) + 1 : 1;
    var totalDays = (status.lastDate === today) ? status.totalDays : (status.totalDays || 0) + 1;
    status = { lastDate: today, streak: streak, totalDays: totalDays };
    this.set(this.KEYS.DAILY_REWARD, status);
    // 计算奖励金币：基础10，每连续1天+5，上限30
    var coins = Math.min(10 + (streak - 1) * 5, 30);
    this.addCoins(coins);
    return { coins: coins, streak: streak };
  },

  // ============== v36 金币系统 ==============
  getCoins() {
    return this.get(this.KEYS.COINS) || 0;
  },
  addCoins(amount) {
    var coins = this.getCoins() + amount;
    this.set(this.KEYS.COINS, coins);
    return coins;
  },
  spendCoins(amount) {
    var coins = this.getCoins();
    if (coins < amount) return false;
    this.set(this.KEYS.COINS, coins - amount);
    return true;
  },

  // 获取所有进度数据，用于提交到服务器
  getAllProgress() {
    return {
      progress: this.get(this.KEYS.PROGRESS) || [],
      totalScore: this.getTotalScore(),
      chicksSaved: this.getChicksSaved(),
      chicks: this.get(this.KEYS.CHICKS) || Array(10).fill(false),
      coins: this.getCoins()
    };
  },

  // ============== v36 小鸡花园2.0 ==============
  // 获取小鸡状态
  getChickStates() {
    return this.get(this.KEYS.CHICK_STATES) || {};
  },
  // 获取单只小鸡状态
  getChickState(index) {
    var states = this.getChickStates();
    return states[index] || { name: null, hunger: 100, costume: null };
  },
  // 设置小鸡名字
  setChickName(index, name) {
    var states = this.getChickStates();
    if (!states[index]) states[index] = { name: null, hunger: 100, costume: null };
    states[index].name = name.substring(0, 8); // 最多8个字符
    this.set(this.KEYS.CHICK_STATES, states);
  },
  // 喂食（增加饱食度）
  feedChick(index, amount) {
    var states = this.getChickStates();
    if (!states[index]) states[index] = { name: null, hunger: 100, costume: null };
    states[index].hunger = Math.min(100, (states[index].hunger || 100) + amount);
    this.set(this.KEYS.CHICK_STATES, states);
  },
  // 消耗饱食度（每小时-5，最低10）
  decreaseHunger(index, amount) {
    var states = this.getChickStates();
    if (!states[index]) return;
    states[index].hunger = Math.max(10, (states[index].hunger || 100) - amount);
    this.set(this.KEYS.CHICK_STATES, states);
  },
  // 设置装扮
  setChickCostume(index, costume) {
    var states = this.getChickStates();
    if (!states[index]) states[index] = { name: null, hunger: 100, costume: null };
    states[index].costume = costume;
    this.set(this.KEYS.CHICK_STATES, states);
  },

  // ============== v37 词汇复习（艾宾浩斯遗忘曲线） ==============
  // 复习间隔（小时）：1h, 6h, 1d, 2d, 4d, 7d, 15d, 30d
  REVIEW_INTERVALS: [1, 6, 24, 48, 96, 168, 360, 720],
  getVocabReview() {
    return this.get(this.KEYS.VOCAB_REVIEW) || {};
  },
  // 标记单词需要复习
  markVocabForReview(word) {
    var reviews = this.getVocabReview();
    if (!reviews[word]) {
      reviews[word] = { level: 0, nextReview: Date.now() + 3600000, correctCount: 0 };
    }
    this.set(this.KEYS.VOCAB_REVIEW, reviews);
  },
  // 答对复习词 → 推迟下次复习时间
  reviewVocabCorrect(word) {
    var reviews = this.getVocabReview();
    var r = reviews[word];
    if (!r) return;
    r.level = Math.min(r.level + 1, this.REVIEW_INTERVALS.length - 1);
    r.correctCount = (r.correctCount || 0) + 1;
    r.nextReview = Date.now() + this.REVIEW_INTERVALS[r.level] * 3600000;
    this.set(this.KEYS.VOCAB_REVIEW, reviews);
  },
  // 答错复习词 → 重新开始
  reviewVocabWrong(word) {
    var reviews = this.getVocabReview();
    var r = reviews[word];
    if (!r) return;
    r.level = 0;
    r.nextReview = Date.now() + 3600000; // 1小时后再复习
    this.set(this.KEYS.VOCAB_REVIEW, reviews);
  },
  // 获取今天需要复习的词汇
  getDueReviewWords() {
    var reviews = this.getVocabReview();
    var vocab = this.getVocab();
    var now = Date.now();
    var due = [];
    for (var word in reviews) {
      if (reviews[word].nextReview <= now) {
        var v = vocab.find(function(item) { return item.word === word; });
        if (v) {
          due.push({ word: v.word, meaning: v.meaning, level: reviews[word].level, correctCount: reviews[word].correctCount || 0 });
        }
      }
    }
    return due;
  },
  // 获取词汇掌握程度统计
  getVocabMastery() {
    var reviews = this.getVocabReview();
    var vocab = this.getVocab();
    var mastered = 0, learning = 0, newWords = 0;
    vocab.forEach(function(v) {
      var r = reviews[v.word];
      if (!r || r.level === 0) newWords++;
      else if (r.level >= 5) mastered++;
      else learning++;
    });
    return { total: vocab.length, mastered: mastered, learning: learning, newWords: newWords };
  },

  // ============== v37 成就系统 ==============
  ACHIEVEMENT_DEFS: [
    { id: 'first_login', name: '初来乍到', desc: '首次登录游戏', icon: '👋' },
    { id: 'first_star', name: '第一颗星', desc: '获得第一颗星', icon: '⭐' },
    { id: 'star_10', name: '星星收集者', desc: '累计获得10颗星', icon: '🌟' },
    { id: 'star_30', name: '星光闪耀', desc: '累计获得30颗星', icon: '💫' },
    { id: 'star_60', name: '星河璀璨', desc: '累计获得60颗星', icon: '✨' },
    { id: 'chick_1', name: '初次救援', desc: '救回第1只小鸡', icon: '🐤' },
    { id: 'chick_5', name: '半数营救', desc: '救回5只小鸡', icon: '🐔' },
    { id: 'chick_10', name: '全部救回', desc: '救回全部10只小鸡', icon: '🏆' },
    { id: 'perfect', name: '完美通关', desc: '任意关卡满分三星', icon: '💯' },
    { id: 'vocab_10', name: '词汇新手', desc: '词汇本收集10个词', icon: '📖' },
    { id: 'vocab_30', name: '词汇达人', desc: '词汇本收集30个词', icon: '📚' },
    { id: 'vocab_master', name: '词汇大师', desc: '掌握10个词汇', icon: '🎓' },
    { id: 'streak_3', name: '连续打卡3天', desc: '连续登录3天', icon: '🔥' },
    { id: 'streak_7', name: '一周不懈', desc: '连续登录7天', icon: '🔥' },
    { id: 'coins_100', name: '小有积蓄', desc: '累计获得100金币', icon: '💰' },
    { id: 'coins_500', name: '金库满满', desc: '累计获得500金币', icon: '💎' },
    { id: 'articles_read_5', name: '阅读新手', desc: '累计阅读5篇文章', icon: '📰' },
    { id: 'articles_read_20', name: '阅读达人', desc: '累计阅读20篇文章', icon: '📑' },
    { id: 'articles_read_50', name: '阅读大师', desc: '累计阅读50篇文章', icon: '📚' },
    { id: 'streak_30', name: '月度坚持', desc: '连续打卡30天', icon: '🔥' },
    { id: 'streak_100', name: '百日战士', desc: '连续打卡100天', icon: '💪' },
    { id: 'vocab_50', name: '词汇积累者', desc: '词汇本收集50个词', icon: '📝' },
    { id: 'vocab_200', name: '词汇专家', desc: '词汇本收集200个词', icon: '🖊️' },
    { id: 'vocab_500', name: '词汇王者', desc: '词汇本收集500个词', icon: '👑' },
    { id: 'quiz_streak_10', name: '答题新星', desc: '连续答对10题', icon: '🎯' },
    { id: 'quiz_streak_30', name: '答题高手', desc: '连续答对30题', icon: '🎯' },
    { id: 'quiz_streak_50', name: '答题王者', desc: '连续答对50题', icon: '🏅' }
  ],
  getAchievements() {
    return this.get(this.KEYS.ACHIEVEMENTS) || {};
  },
  unlockAchievement(id) {
    var ach = this.getAchievements();
    if (ach[id]) return null; // 已解锁
    ach[id] = { unlockedAt: Date.now() };
    this.set(this.KEYS.ACHIEVEMENTS, ach);
    // 返回成就信息用于弹窗通知
    var def = this.ACHIEVEMENT_DEFS.find(function(d) { return d.id === id; });
    return def || null;
  },
  isAchievementUnlocked(id) {
    return !!(this.getAchievements()[id]);
  },
  // 检查并触发所有可能的成就
  checkAchievements() {
    var newlyUnlocked = [];
    var self = this;
    var totalStars = 0;
    var prog = this.get(this.KEYS.PROGRESS) || [];
    prog.forEach(function(p) { if (p) totalStars += (p.stars || 0); });
    var chicksSaved = this.getChicksSaved();
    var vocabCount = (this.getVocab() || []).length;
    var mastery = this.getVocabMastery();
    var daily = this.getDailyRewardStatus();
    var coins = this.getCoins();
    var hasPerfect = prog.some(function(p) { return p && p.stars === 3 && p.score === 100; });

    var checks = [
      { id: 'first_login', cond: this.isLoggedIn() },
      { id: 'first_star', cond: totalStars >= 1 },
      { id: 'star_10', cond: totalStars >= 10 },
      { id: 'star_30', cond: totalStars >= 30 },
      { id: 'star_60', cond: totalStars >= 60 },
      { id: 'chick_1', cond: chicksSaved >= 1 },
      { id: 'chick_5', cond: chicksSaved >= 5 },
      { id: 'chick_10', cond: chicksSaved >= 10 },
      { id: 'perfect', cond: hasPerfect },
      { id: 'vocab_10', cond: vocabCount >= 10 },
      { id: 'vocab_30', cond: vocabCount >= 30 },
      { id: 'vocab_master', cond: mastery.mastered >= 10 },
      { id: 'streak_3', cond: (daily.streak || 0) >= 3 },
      { id: 'streak_7', cond: (daily.streak || 0) >= 7 },
      { id: 'coins_100', cond: coins >= 100 },
      { id: 'coins_500', cond: coins >= 500 },
      { id: 'articles_read_5', cond: (self.getArticlesRead() || 0) >= 5 },
      { id: 'articles_read_20', cond: (self.getArticlesRead() || 0) >= 20 },
      { id: 'articles_read_50', cond: (self.getArticlesRead() || 0) >= 50 },
      { id: 'streak_30', cond: (daily.streak || 0) >= 30 },
      { id: 'streak_100', cond: (daily.streak || 0) >= 100 },
      { id: 'vocab_50', cond: vocabCount >= 50 },
      { id: 'vocab_200', cond: vocabCount >= 200 },
      { id: 'vocab_500', cond: vocabCount >= 500 },
      { id: 'quiz_streak_10', cond: (self.getQuizStreak() || 0) >= 10 },
      { id: 'quiz_streak_30', cond: (self.getQuizStreak() || 0) >= 30 },
      { id: 'quiz_streak_50', cond: (self.getQuizStreak() || 0) >= 50 }
    ];

    checks.forEach(function(c) {
      if (c.cond && !self.isAchievementUnlocked(c.id)) {
        var result = self.unlockAchievement(c.id);
        if (result) newlyUnlocked.push(result);
      }
    });

    return newlyUnlocked;
  },
  
  // v86: getArticlesRead - count passed articles
  getArticlesRead: function() {
    var prog = this.get(this.KEYS.PROGRESS) || [];
    return prog.filter(function(p) { return p && p.passed; }).length;
  },
  
  // v86: Quiz streak tracking
  getQuizStreak: function() {
    return this.get(this.KEYS.QUIZ_STREAK) || 0;
  },
  setQuizStreak: function(val) {
    this.set(this.KEYS.QUIZ_STREAK, val);
  },
  resetQuizStreak: function() {
    this.set(this.KEYS.QUIZ_STREAK, 0);
  },
  incrementQuizStreak: function() {
    var current = this.getQuizStreak();
    this.setQuizStreak(current + 1);
    return current + 1;
  }
};

// ============== v43 点击单词记录（词汇复习模式） ==============
(function() {
  Storage.getClickedWords = function() {
    return this.get(this.KEYS.CLICKED_WORDS) || {};
  };
  
  // 获取某关卡的点击单词
  Storage.getClickedWordsForLevel = function(levelIndex) {
    var clicked = this.getClickedWords();
    return clicked[levelIndex] || [];
  };
  
  // 添加点击的单词
  Storage.addClickedWord = function(levelIndex, word, meaning) {
    var clicked = this.getClickedWords();
    if (!clicked[levelIndex]) {
      clicked[levelIndex] = [];
    }
    // 去重
    var exists = clicked[levelIndex].some(function(item) {
      return item.word === word;
    });
    if (!exists && word && word.length > 1) {
      clicked[levelIndex].push({
        word: word,
        meaning: meaning || '',
        clickedAt: Date.now()
      });
      this.set(this.KEYS.CLICKED_WORDS, clicked);
    }
  };
  
  // 清空某关卡的点击记录
  Storage.clearClickedWordsForLevel = function(levelIndex) {
    var clicked = this.getClickedWords();
    delete clicked[levelIndex];
    this.set(this.KEYS.CLICKED_WORDS, clicked);
  };
  
  // 获取所有点击过的单词（用于复习模式）
  Storage.getAllClickedWords = function() {
    var clicked = this.getClickedWords();
    var allWords = [];
    for (var levelIndex in clicked) {
      if (clicked.hasOwnProperty(levelIndex)) {
        clicked[levelIndex].forEach(function(item) {
          // 去重
          var exists = allWords.some(function(w) {
            return w.word === item.word;
          });
          if (!exists) {
            allWords.push(item);
          }
        });
      }
    }
    return allWords;
  };
  
  // v44 阅读理解闯关历史记录
  Storage.saveReadingQuizResult = function(result) {
    var history = this.get(this.KEYS.READING_QUIZ_HISTORY) || [];
    history.unshift(result);
    // 保留最近50条记录
    if (history.length > 50) {
      history = history.slice(0, 50);
    }
    this.set(this.KEYS.READING_QUIZ_HISTORY, history);
  };
  
  Storage.getReadingQuizHistory = function() {
    return this.get(this.KEYS.READING_QUIZ_HISTORY) || [];
  };
  
  Storage.getReadingQuizStats = function(levelIndex) {
    var history = this.getReadingQuizHistory();
    var filtered = levelIndex !== undefined ? history.filter(function(r) { return r.levelIndex === levelIndex; }) : history;
    var total = filtered.length;
    var passed = filtered.filter(function(r) { return r.passed; }).length;
    var totalCorrect = filtered.reduce(function(sum, r) { return sum + (r.correctCount || 0); }, 0);
    var totalQuestions = filtered.reduce(function(sum, r) { return sum + (r.totalQuestions || 0); }, 0);
    return {
      total: total,
      passed: passed,
      passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
      avgCorrect: totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) + '%' : '0%'
    };
  };

  // v45 学习数据统计
  Storage.getLearningStats = function() {
    var prog = this.get(this.KEYS.PROGRESS) || [];
    var passedCount = prog.filter(function(p) { return p && p.passed; }).length;
    var totalLevels = 30;
    var starsPerLevel = prog.map(function(p) { return p ? (p.stars || 0) : 0; });
    var totalStars = starsPerLevel.reduce(function(sum, s) { return sum + s; }, 0);
    var avgStars = totalLevels > 0 ? (totalStars / totalLevels).toFixed(1) : '0';

    // 词汇
    var clickedWords = this.getAllClickedWords();
    var vocabCount = clickedWords.length;

    // 连续学习天数
    var checkIn = this.get(this.KEYS.CHECKIN) || { streak: 0 };
    var streakDays = checkIn.streak || 0;

    // 金币
    var coins = this.getCoins();

    // 获取段位
    var rank = 'Lv.1';
    if (totalStars >= 90) rank = '王者';
    else if (totalStars >= 75) rank = '钻石';
    else if (totalStars >= 60) rank = '铂金';
    else if (totalStars >= 45) rank = '黄金';
    else if (totalStars >= 30) rank = '白银';
    else if (totalStars >= 15) rank = '青铜';
    else rank = 'Lv.1';

    // 阅读理解近7天数据
    var history = this.getReadingQuizHistory();
    var last7Days = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      var dateStr = d.toISOString().split('T')[0];
      var dayData = history.filter(function(r) { return r.timestamp && r.timestamp.startsWith(dateStr); });
      var correct = dayData.reduce(function(sum, r) { return sum + (r.correctCount || 0); }, 0);
      var total = dayData.reduce(function(sum, r) { return sum + (r.totalQuestions || 0); }, 0);
      last7Days.push(total > 0 ? Math.round((correct / total) * 100) : 0);
    }

    return {
      articlesRead: passedCount,
      totalArticles: totalLevels,
      vocabMastered: vocabCount,
      streakDays: streakDays,
      totalCoins: coins,
      totalStars: totalStars,
      avgStars: avgStars,
      rank: rank,
      quizAccuracyLast7Days: last7Days
    };
  };


  // v47 生词本
  getVocabBook() {
    return this.get(this.KEYS.VOCAB_BOOK) || [];
  },
  addToVocabBook(word, meaning, sentence, levelIndex, articleTitle) {
    var book = this.getVocabBook();
    if (book.some(function(w) { return w.word === word; })) return false;
    book.unshift({
      word: word,
      meaning: meaning || '',
      sentence: sentence || '',
      articleTitle: articleTitle || '',
      levelIndex: levelIndex,
      addedAt: new Date().toISOString(),
      mastered: false
    });
    this.set(this.KEYS.VOCAB_BOOK, book);
    return true;
  },
  isInVocabBook(word) {
    var book = this.getVocabBook();
    return book.some(function(w) { return w.word === word; });
  },
  removeFromVocabBook(word) {
    var book = this.getVocabBook();
    book = book.filter(function(w) { return w.word !== word; });
    this.set(this.KEYS.VOCAB_BOOK, book);
  },
  toggleVocabMastered(word) {
    var book = this.getVocabBook();
    book.forEach(function(w) { if (w.word === word) w.mastered = !w.mastered; });
    this.set(this.KEYS.VOCAB_BOOK, book);
  },
  getVocabBookByLevel(levelIndex) {
    return this.getVocabBook().filter(function(w) { return w.levelIndex === levelIndex; });
  },
  exportVocabBook(format) {
    var book = this.getVocabBook();
    var lines = book.map(function(w) {
      if (format === 'csv') {
        return '"' + w.word + '","' + (w.meaning||'') + '","' + (w.sentence||'') + '","' + (w.articleTitle||'') + '","' + (w.mastered?'已掌握':'未掌握') + '"';
      } else {
        return (w.mastered?'[已] ':'[ ] ') + w.word + ' ' + (w.meaning||'') + (w.sentence?' - '+w.sentence:'');
      }
    });
    return (format==='csv'?'单词,释义,例句,文章来源,状态
':'') + lines.join('
');
  }

  // ============== v50 每日学习目标与连续打卡 ==============
  getDailyGoal() {
    return this.get(this.KEYS.DAILY_GOAL) || { articles: 3, words: 10 };
  },
  setDailyGoal(articles, words) {
    this.set(this.KEYS.DAILY_GOAL, { articles: articles || 3, words: words || 10 });
  },
  getTodayProgress() {
    var today = new Date().toISOString().split('T')[0];
    var progress = this.get(this.KEYS.DAILY_PROGRESS);
    if (!progress || progress.date !== today) {
      progress = { date: today, articles: 0, words: 0, goalMet: false };
      this.set(this.KEYS.DAILY_PROGRESS, progress);
    }
    return progress;
  },
  recordArticleRead() {
    var progress = this.getTodayProgress();
    progress.articles++;
    this.set(this.KEYS.DAILY_PROGRESS, progress);
    this.checkAndUpdateStreak();
    return progress;
  },
  recordWordLearned() {
    var progress = this.getTodayProgress();
    progress.words++;
    this.set(this.KEYS.DAILY_PROGRESS, progress);
    this.checkAndUpdateStreak();
    return progress;
  },
  checkAndUpdateStreak() {
    var today = new Date().toISOString().split('T')[0];
    var progress = this.get(this.KEYS.DAILY_PROGRESS);
    var goal = this.getDailyGoal();
    var streak = this.get(this.KEYS.STREAK_DATA) || { currentStreak: 0, maxStreak: 0, history: [] };
    
    var alreadyMetToday = streak.history && streak.history.find(function(h) { return h.date === today; });
    if (!alreadyMetToday && progress.articles >= goal.articles && progress.words >= goal.words) {
      progress.goalMet = true;
      this.set(this.KEYS.DAILY_PROGRESS, progress);
      streak.currentStreak++;
      if (streak.currentStreak > streak.maxStreak) {
        streak.maxStreak = streak.currentStreak;
      }
      streak.history.unshift({ date: today, articles: progress.articles, words: progress.words });
      if (streak.history.length > 30) streak.history.pop();
      this.set(this.KEYS.STREAK_DATA, streak);
    }
  },
  getStreakData() {
    return this.get(this.KEYS.STREAK_DATA) || { currentStreak: 0, maxStreak: 0, history: [] };
  },
  getStreak() {
    var streak = this.getStreakData();
    var today = new Date().toISOString().split('T')[0];
    var yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    var lastHistory = streak.history && streak.history[0];
    if (lastHistory) {
      if (lastHistory.date !== today && lastHistory.date !== yesterday) {
        streak.currentStreak = 0;
        this.set(this.KEYS.STREAK_DATA, streak);
      }
    }
    return streak.currentStreak;
  },
  getMaxStreak() {
    return this.getStreakData().maxStreak || 0;
  },
  getCheckinCalendar(days) {
    var streak = this.getStreakData();
    var history = streak.history || [];
    if (days && days > 0) {
      return history.slice(0, days);
    }
    return history;
  },
  checkMissedDays() {
    var today = new Date().toISOString().split('T')[0];
    var yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    var streak = this.getStreakData();
    var lastHistory = streak.history && streak.history[0];
    if (lastHistory && lastHistory.date !== today && lastHistory.date !== yesterday) {
      streak.currentStreak = 0;
      this.set(this.KEYS.STREAK_DATA, streak);
    }
  }

})();
