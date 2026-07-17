/* ============================================================
   Basic English 850 — 前端逻辑
   - 卡片网格渲染（按筛选 + 搜索）
   - 分类筛选 / 实时搜索
   - 练习模式：翻面抽卡（上一张 / 下一张 / 随机）
   ============================================================ */
(function () {
  "use strict";

  const WORDS = window.WORDS || [];

  // ---------- DOM ----------
  const grid = document.getElementById("cardGrid");
  const emptyState = document.getElementById("emptyState");
  const searchInput = document.getElementById("search");
  const filterGroup = document.getElementById("filterGroup");
  const practiceToggle = document.getElementById("practiceToggle");
  const gridView = document.getElementById("gridView");
  const practiceView = document.getElementById("practiceView");

  // practice elements
  const flashcard = document.getElementById("flashcard");
  const flashcardInner = document.getElementById("flashcardInner");
  const fcPosFront = document.getElementById("fcPosFront");
  const fcWord = document.getElementById("fcWord");
  const fcPhonetic = document.getElementById("fcPhonetic");
  const fcPosBack = document.getElementById("fcPosBack");
  const fcWordBack = document.getElementById("fcWordBack");
  const fcMeaning = document.getElementById("fcMeaning");
  const progressEl = document.getElementById("practiceProgress");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const flipBtn = document.getElementById("flipBtn");
  const randomBtn = document.getElementById("randomBtn");
  const exitBtn = document.getElementById("exitBtn");

  const countEls = {
    all: document.getElementById("count-all"),
    "n.": document.getElementById("count-n"),
    "adj.": document.getElementById("count-adj"),
    "v.": document.getElementById("count-v"),
  };

  // ---------- 状态 ----------
  let currentFilter = "all";
  let currentQuery = "";
  let filtered = [];          // 当前筛选+搜索结果
  let practiceIndex = 0;      // 练习模式指针

  // ---------- 工具 ----------
  const posClass = (pos) =>
    pos === "n." ? "pos-n" : pos === "adj." ? "pos-adj" : "pos-v";

  function matchesQuery(word, q) {
    if (!q) return true;
    const ql = q.toLowerCase();
    return (
      word.word.toLowerCase().includes(ql) ||
      word.meaning.toLowerCase().includes(ql)
    );
  }

  function computeFiltered() {
    return WORDS.filter(
      (w) =>
        (currentFilter === "all" || w.pos === currentFilter) &&
        matchesQuery(w, currentQuery)
    );
  }

  // ---------- 渲染：计数 ----------
  function renderCounts() {
    const byPos = { all: WORDS.length, "n.": 0, "adj.": 0, "v.": 0 };
    WORDS.forEach((w) => {
      if (byPos[w.pos] !== undefined) byPos[w.pos]++;
    });
    countEls.all.textContent = byPos.all;
    countEls["n."].textContent = byPos["n."];
    countEls["adj."].textContent = byPos["adj."];
    countEls["v."].textContent = byPos["v."];
  }

  // ---------- 渲染：网格 ----------
  function renderGrid() {
    filtered = computeFiltered();
    grid.innerHTML = "";

    if (filtered.length === 0) {
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;

    const frag = document.createDocumentFragment();
    filtered.forEach((w) => {
      const card = document.createElement("article");
      card.className = "word-card " + posClass(w.pos);

      const top = document.createElement("div");
      top.className = "card-top";
      const pos = document.createElement("span");
      pos.className = "pos-tag";
      pos.textContent = w.pos;
      top.appendChild(pos);

      const word = document.createElement("h3");
      word.className = "card-word";
      word.textContent = w.word;

      const ph = document.createElement("p");
      ph.className = "card-phonetic";
      ph.textContent = w.phonetic;

      const mean = document.createElement("p");
      mean.className = "card-meaning";
      mean.textContent = w.meaning;

      card.appendChild(top);
      card.appendChild(word);
      card.appendChild(ph);
      card.appendChild(mean);
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }

  // ---------- 事件：筛选 ----------
  filterGroup.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    currentFilter = btn.dataset.filter;
    filterGroup
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.toggle("is-active", b === btn));
    renderGrid();
  });

  // ---------- 事件：搜索 ----------
  searchInput.addEventListener("input", (e) => {
    currentQuery = e.target.value.trim();
    renderGrid();
  });

  // ---------- 练习模式 ----------
  function enterPractice() {
    practiceToggle.classList.add("is-on");
    practiceToggle.setAttribute("aria-pressed", "true");
    gridView.hidden = true;
    practiceView.hidden = false;
    filtered = computeFiltered();
    if (filtered.length === 0) {
      progressEl.textContent = "0 / 0";
      fcWord.textContent = "—";
      fcPhonetic.textContent = "";
      fcMeaning.textContent = "没有匹配的单词";
      fcPosFront.textContent = fcPosBack.textContent = "—";
      return;
    }
    practiceIndex = 0;
    showCard(0, false);
    flashcard.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function exitPractice() {
    practiceToggle.classList.remove("is-on");
    practiceToggle.setAttribute("aria-pressed", "false");
    practiceView.hidden = true;
    gridView.hidden = false;
  }

  function showCard(index, flipReset = true) {
    if (filtered.length === 0) return;
    practiceIndex = (index + filtered.length) % filtered.length;
    const w = filtered[practiceIndex];

    fcPosFront.textContent = w.pos;
    fcPosBack.textContent = w.pos;
    fcWord.textContent = w.word;
    fcWordBack.textContent = w.word;
    fcPhonetic.textContent = w.phonetic;
    fcMeaning.textContent = w.meaning;

    // 颜色随词性变化
    const accent =
      w.pos === "n." ? "#4f8a6b" : w.pos === "adj." ? "#c9792f" : "#b8472f";
    fcPosFront.style.setProperty("--accent", accent);
    fcPosBack.style.setProperty("--accent", accent);

    progressEl.textContent = practiceIndex + 1 + " / " + filtered.length;

    if (flipReset) {
      flashcard.classList.remove("is-flipped");
    }
  }

  function flipCard() {
    flashcard.classList.toggle("is-flipped");
  }

  practiceToggle.addEventListener("click", () => {
    if (practiceView.hidden) enterPractice();
    else exitPractice();
  });

  flashcard.addEventListener("click", flipCard);
  flipBtn.addEventListener("click", flipCard);
  prevBtn.addEventListener("click", () => showCard(practiceIndex - 1));
  nextBtn.addEventListener("click", () => showCard(practiceIndex + 1));
  randomBtn.addEventListener("click", () => {
    if (filtered.length === 0) return;
    let r = practiceIndex;
    if (filtered.length > 1) {
      while (r === practiceIndex) r = Math.floor(Math.random() * filtered.length);
    }
    showCard(r);
  });
  exitBtn.addEventListener("click", exitPractice);

  // 键盘：练习模式下 ← → 切换，空格/回车翻面
  document.addEventListener("keydown", (e) => {
    if (practiceView.hidden) return;
    if (e.key === "ArrowLeft") { showCard(practiceIndex - 1); e.preventDefault(); }
    else if (e.key === "ArrowRight") { showCard(practiceIndex + 1); e.preventDefault(); }
    else if (e.key === " " || e.key === "Enter") {
      if (document.activeElement !== searchInput) { flipCard(); e.preventDefault(); }
    }
  });

  // 搜索/筛选变化时，若处于练习模式则同步范围
  function syncPractice() {
    if (practiceView.hidden) return;
    filtered = computeFiltered();
    if (filtered.length === 0) { showCard(0); return; }
    if (practiceIndex >= filtered.length) practiceIndex = filtered.length - 1;
    showCard(practiceIndex, false);
  }
  searchInput.addEventListener("input", syncPractice);
  filterGroup.addEventListener("click", syncPractice);

  // ---------- 初始化 ----------
  renderCounts();
  renderGrid();
})();
