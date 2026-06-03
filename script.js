// ============================================
// AI 表情猜谜王 — 前端游戏逻辑（成语版）
// ============================================

// ---------- 后端 API 地址 ----------
const API_BASE = "http://localhost:3000";

// ---------- 游戏状态 ----------
const state = {
  // 玩家
  nickname: "",
  // 当前页面
  currentPage: "start",
  // 计分
  score: 0,
  combo: 0,
  maxCombo: 0,
  round: 0,
  correctCount: 0,
  // 当前谜题
  currentPuzzle: null,
  // 计时器
  timerInterval: null,
  timeLeft: 0,
  // 是否正在等待 API
  loading: false,
  // 本轮题目数
  totalRounds: 5,
  // 去重：已出现过的答案列表
  usedAnswers: [],
  // 提示系统
  hintsRemaining: 3,   // 剩余提示次数（整局游戏共 3 次）
  hintsUsed: 0,        // 已使用提示次数（用于计分扣减）
  currentHintLevel: 0, // 当前题目已使用的提示级别（0=未用, 1=首字, 2=末字, 3=前两字）
};

// ---------- 榜单存储 ----------
const LEADERBOARD_KEY = "emoji_game_leaderboard";

function loadLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLeaderboard(entry) {
  const board = loadLeaderboard();

  // 同名玩家：只保留最高分
  const existingIndex = board.findIndex((e) => e.name === entry.name);
  if (existingIndex !== -1) {
    if (entry.score > board[existingIndex].score) {
      board[existingIndex] = entry;
    }
  } else {
    board.push(entry);
  }

  board.sort((a, b) => b.score - a.score);
  const top = board.slice(0, 20);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top));
  return top;
}

// ---------- DOM 元素引用 ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// 页面
const pages = {
  start: $("#page-start"),
  game: $("#page-game"),
  result: $("#page-result"),
  leaderboard: $("#page-leaderboard"),
};

// ---------- 页面切换 ----------
function showPage(pageName) {
  Object.values(pages).forEach((p) => p.classList.remove("active"));
  pages[pageName].classList.add("active");
  state.currentPage = pageName;
}

// ---------- Toast 提示 ----------
function showToast(msg, duration = 2000) {
  const existing = $(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.85);
    color: #fff;
    padding: 10px 24px;
    border-radius: 20px;
    font-size: 14px;
    z-index: 999;
    animation: fadeInUp 0.3s ease;
    pointer-events: none;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ============================================
// 开始页逻辑
// ============================================
const inputNickname = $("#input-nickname");
const btnStart = $("#btn-start");
const btnGotoLeaderboard = $("#btn-goto-leaderboard");

inputNickname.addEventListener("input", () => {
  btnStart.disabled = inputNickname.value.trim().length === 0;
});

inputNickname.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !btnStart.disabled) {
    btnStart.click();
  }
});

btnStart.addEventListener("click", () => {
  const name = inputNickname.value.trim();
  if (!name) return;
  state.nickname = name;
  startGame();
});

btnGotoLeaderboard.addEventListener("click", () => {
  renderLeaderboard();
  showPage("leaderboard");
});

// ============================================
// 游戏核心逻辑
// ============================================
function resetGameState() {
  state.score = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.round = 0;
  state.correctCount = 0;
  state.currentPuzzle = null;
  state.loading = false;
  state.usedAnswers = [];
  state.hintsRemaining = 3;
  state.hintsUsed = 0;
  state.currentHintLevel = 0;
  clearTimer();
}

async function startGame() {
  resetGameState();
  showPage("game");
  updateGameHeader();
  updateHintUI();
  await nextRound();
}

async function nextRound() {
  state.round++;
  if (state.round > state.totalRounds) {
    return endGame();
  }

  state.currentHintLevel = 0;
  updateGameHeader();

  // 重置 UI
  $("#emoji-display").innerHTML = '<span class="loading-text">🤔 AI 正在出题...</span>';
  $("#emoji-display").classList.remove("shake", "pop");
  $("#input-answer").value = "";
  $("#input-answer").disabled = true;
  $("#btn-submit").disabled = true;
  $("#feedback").classList.add("hidden");
  $("#hint-display").classList.add("hidden");
  $("#hint-text").textContent = "";
  state.loading = true;

  updateHintUI();

  // 获取谜题（带去重重试）
  try {
    let puzzle = null;
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      puzzle = await fetchPuzzle(state.usedAnswers);

      if (state.usedAnswers.includes(puzzle.answer)) {
        retries++;
        console.warn(`⚠️ 题目重复: "${puzzle.answer}"，自动重试 ${retries}/${maxRetries}`);
        continue;
      }
      break;
    }

    state.currentPuzzle = puzzle;
    state.loading = false;
    state.usedAnswers.push(puzzle.answer);

    // 显示 emoji
    $("#emoji-display").textContent = puzzle.emoji;
    $("#emoji-display").classList.add("pop");

    // 始终显示首字提示（免费，不计入次数）
    if (puzzle.hint) {
      $("#hint-text").textContent = `首字是「${puzzle.hint}」`;
      $("#hint-display").classList.remove("hidden");
    }

    $("#input-answer").disabled = false;
    $("#btn-submit").disabled = false;
    $("#input-answer").focus();

    // 启动计时器（每题 40 秒）
    startTimer(40);
  } catch (err) {
    state.loading = false;
    $("#emoji-display").innerHTML =
      '<span style="color:var(--danger);font-size:18px;">😵 AI 服务暂时不可用<br><small>请确认后端已启动</small></span>';
    console.error("获取谜题失败:", err);
    setTimeout(() => {
      if (state.currentPage === "game" && state.round <= state.totalRounds) {
        nextRound();
      }
    }, 5000);
  }
}

async function fetchPuzzle(excludeAnswers) {
  const response = await fetch(`${API_BASE}/api/generate-puzzle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ excludeAnswers }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `API 返回错误: ${response.status}`);
  }

  return response.json();
}

// ---------- 提示系统（3 级，适配四字成语）----------
$("#btn-hint").addEventListener("click", () => {
  if (state.loading) return;
  if (!state.currentPuzzle) return;
  if (state.hintsRemaining <= 0) {
    showToast("提示次数已用完！😅");
    return;
  }

  state.hintsRemaining--;
  state.hintsUsed++;
  state.currentHintLevel++;

  const answer = state.currentPuzzle.answer;
  let hintText = "";

  if (state.currentHintLevel === 1) {
    // 第一级：首字
    hintText = `💡 首字是「${answer[0]}」`;
  } else if (state.currentHintLevel === 2) {
    // 第二级：末字
    hintText = `💡 末字是「${answer[answer.length - 1]}」`;
  } else {
    // 第三级：前两个字
    hintText = `💡 前两字是「${answer[0]}${answer[1]}」`;
  }

  // 扣分（逐级递增）
  const deduction = state.currentHintLevel === 1 ? 3 : state.currentHintLevel === 2 ? 5 : 8;
  state.score = Math.max(0, state.score - deduction);

  $("#hint-text").textContent = hintText + `（-${deduction}分）`;
  $("#hint-display").classList.remove("hidden");

  updateGameHeader();
  updateHintUI();
  showToast(`使用了第 ${state.hintsUsed} 次提示，扣除 ${deduction} 分`);
});

function updateHintUI() {
  const btn = $("#btn-hint");
  if (state.hintsRemaining <= 0) {
    btn.textContent = "💡 提示已用完";
    btn.disabled = true;
  } else {
    btn.textContent = `💡 提示 (${state.hintsRemaining}/3)`;
    btn.disabled = false;
  }
}

// ---------- 提交答案 ----------
$("#btn-submit").addEventListener("click", () => handleSubmit());
$("#input-answer").addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSubmit();
});

function handleSubmit() {
  if (state.loading) return;
  if (!state.currentPuzzle) return;

  const userAnswer = $("#input-answer").value.trim();
  if (!userAnswer) {
    showToast("请输入你的答案！");
    return;
  }

  clearTimer();

  const correctAnswer = state.currentPuzzle.answer;
  const isCorrect =
    userAnswer.toLowerCase().replace(/\s+/g, "") ===
    correctAnswer.toLowerCase().replace(/\s+/g, "");

  const feedback = $("#feedback");
  feedback.classList.remove("hidden", "correct", "wrong");

  if (isCorrect) {
    feedback.textContent = "✅ 答对了！太厉害了！";
    feedback.classList.add("correct");
    state.combo++;
    if (state.combo > state.maxCombo) state.maxCombo = state.combo;
    state.correctCount++;

    // 计分：20 分基础 + combo 加成
    const comboBonus = Math.min(state.combo - 1, 5) * 2;
    state.score += 20 + comboBonus;

    $("#emoji-display").classList.add("pop");
  } else {
    feedback.textContent = `❌ 答错了！正确答案是：${correctAnswer}`;
    feedback.classList.add("wrong");
    state.combo = 0;
    $("#emoji-display").classList.add("shake");
  }

  $("#input-answer").disabled = true;
  $("#btn-submit").disabled = true;
  updateGameHeader();

  setTimeout(() => {
    if (state.currentPage === "game") nextRound();
  }, 2000);
}

// ---------- 跳过 ----------
$("#btn-skip").addEventListener("click", () => {
  if (state.loading) return;
  clearTimer();
  state.combo = 0;
  updateGameHeader();

  const feedback = $("#feedback");
  feedback.textContent = `⏭️ 已跳过！答案是：${state.currentPuzzle?.answer || "?"}`;
  feedback.classList.remove("hidden", "correct");
  feedback.classList.add("wrong");

  $("#input-answer").disabled = true;
  $("#btn-submit").disabled = true;

  setTimeout(() => {
    if (state.currentPage === "game") nextRound();
  }, 1500);
});

// ---------- 计时器 ----------
function startTimer(seconds) {
  clearTimer();
  state.timeLeft = seconds;

  const timerBar = $("#timer-bar");
  const timerFill = $("#timer-fill");
  timerBar.classList.remove("hidden");
  timerFill.style.width = "100%";
  timerFill.classList.remove("warning", "danger");

  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    const pct = (state.timeLeft / seconds) * 100;
    timerFill.style.width = pct + "%";

    if (state.timeLeft <= 5) {
      timerFill.classList.add("danger");
    } else if (state.timeLeft <= 10) {
      timerFill.classList.add("warning");
    }

    if (state.timeLeft <= 0) {
      clearTimer();
      const feedback = $("#feedback");
      feedback.textContent = `⏰ 时间到！正确答案是：${state.currentPuzzle?.answer || "?"}`;
      feedback.classList.remove("hidden", "correct");
      feedback.classList.add("wrong");
      state.combo = 0;
      updateGameHeader();

      $("#input-answer").disabled = true;
      $("#btn-submit").disabled = true;

      setTimeout(() => {
        if (state.currentPage === "game") nextRound();
      }, 1500);
    }
  }, 1000);
}

function clearTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  $("#timer-bar").classList.add("hidden");
}

// ---------- 更新顶部信息 ----------
function updateGameHeader() {
  $("#game-score").textContent = `⭐ ${state.score} 分`;
  $("#game-round").textContent = `第 ${state.round} 题 / 共 ${state.totalRounds} 题`;

  const comboEl = $("#game-combo");
  if (state.combo > 1) {
    comboEl.textContent = `🔥 连击 x${state.combo}`;
    comboEl.classList.remove("hidden");
  } else {
    comboEl.classList.add("hidden");
  }

  $("#game-difficulty-badge").textContent = "🏮 四字成语";
}

// ============================================
// 结算页逻辑
// ============================================
function endGame() {
  clearTimer();
  showPage("result");

  let emoji, title;
  const rate = state.correctCount / state.totalRounds;
  if (rate >= 0.8) {
    emoji = "🎉"; title = "太棒了！你是成语达人！";
  } else if (rate >= 0.5) {
    emoji = "👍"; title = "不错哦，继续加油！";
  } else if (rate > 0) {
    emoji = "💪"; title = "再接再厉，你可以的！";
  } else {
    emoji = "🤗"; title = "别灰心，多读成语故事！";
  }

  $("#result-emoji").textContent = emoji;
  $("#result-title").textContent = title;
  $("#result-score").textContent = state.score;
  $("#result-correct").textContent = `${state.correctCount}/${state.totalRounds}`;
  $("#result-max-combo").textContent = state.maxCombo;

  saveLeaderboard({
    name: state.nickname,
    score: state.score,
    correct: `${state.correctCount}/${state.totalRounds}`,
    hintsUsed: state.hintsUsed,
    date: new Date().toLocaleDateString("zh-CN"),
  });
}

$("#btn-play-again").addEventListener("click", () => {
  startGame();
});

$("#btn-result-leaderboard").addEventListener("click", () => {
  renderLeaderboard();
  showPage("leaderboard");
});

$("#btn-result-home").addEventListener("click", () => {
  resetGameState();
  showPage("start");
});

// ============================================
// 排行榜页逻辑
// ============================================
function renderLeaderboard() {
  const board = loadLeaderboard();
  const list = $("#leaderboard-list");

  if (board.length === 0) {
    list.innerHTML = '<p class="empty-text">暂无记录，快来玩一局吧！🎮</p>';
    return;
  }

  list.innerHTML = board
    .map((entry, i) => {
      let rankClass = "normal";
      let rankDisplay = i + 1;
      if (i === 0) { rankClass = "gold"; rankDisplay = "👑"; }
      else if (i === 1) { rankClass = "silver"; rankDisplay = "🥈"; }
      else if (i === 2) { rankClass = "bronze"; rankDisplay = "🥉"; }

      const hintsInfo = entry.hintsUsed > 0 ? ` 💡x${entry.hintsUsed}` : "";

      return `
        <div class="leaderboard-item">
          <span class="leaderboard-rank ${rankClass}">${rankDisplay}</span>
          <span class="leaderboard-name">${escapeHtml(entry.name)}</span>
          <span class="leaderboard-difficulty">🏮${hintsInfo}</span>
          <span class="leaderboard-score">${entry.score} 分</span>
        </div>
      `;
    })
    .join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

$("#btn-leaderboard-back").addEventListener("click", () => {
  if (state.score > 0 || state.round > 0) {
    showPage("result");
  } else {
    showPage("start");
  }
});

// ============================================
// 初始化
// ============================================
function init() {
  showPage("start");

  fetch(`${API_BASE}/api/health`)
    .then((r) => r.json())
    .then((data) => console.log("✅ 后端连接成功:", data.message))
    .catch(() => {
      console.warn("⚠️ 后端未启动");
      console.warn("💡 请在终端运行: node server.js");
    });
}

init();
