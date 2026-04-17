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
    USER_SCHOOL: 'sc_user_school'
  },
  init() {
    if (!this.get(this.KEYS.CHICKS)) {
      this.set(this.KEYS.CHICKS, Array(10).fill(false));
      this.set(this.KEYS.PROGRESS, Array(30).fill(null).map(() => ({ passed: false, score: 0, stars: 0 })));
      this.set(this.KEYS.SCORE, 0);
      this.set(this.KEYS.VOCAB, []);
      this.set(this.KEYS.CHECKIN, { lastDate: null, streak: 0, history: [] });
      this.set(this.KEYS.SETTINGS, { sound: true });
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
    progress[levelIndex] = { ...progress[levelIndex], ...data };
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
    return this.get(this.KEYS.SETTINGS) || { sound: true };
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

  // 获取所有进度数据，用于提交到服务器
  getAllProgress() {
    return {
      progress: this.get(this.KEYS.PROGRESS) || [],
      totalScore: this.getTotalScore(),
      chicksSaved: this.getChicksSaved(),
      chicks: this.get(this.KEYS.CHICKS) || Array(10).fill(false)
    };
  }
};
