const el = (id) => document.getElementById(id);

// ===== 取得元素 =====
const home = el("home");
const startBtn = el("start");
const character = el("character");
const textEl = el("text");
const nextBtn = el("next");
const choices = el("choices");
const speakerEl = el("speaker");

// ===== 資源設定 =====
const outfits = {
  base: "assets/平.png",
  red: "assets/平1.png",
  sailor: "assets/平2.png",
  leaf: "assets/平3.png",
};

// 你可以自由改台詞
const script = [
  { speaker: "平蘋", text: "別誤會，只是因為情人節才……" },
  { speaker: "平蘋", text: "先選一套衣服吧。", action: "openChoices" },
  { speaker: "平蘋", text: "想看？那就近些。" },
  { speaker: "平蘋", text: "別鬧了，小戲伶。" },
];

// ===== 打字機 =====
let idx = 0;
let typing = false;
let typeTimer = null;

function typeText(str, speed = 28) {
  typing = true;
  textEl.textContent = "";
  let i = 0;

  clearInterval(typeTimer);
  typeTimer = setInterval(() => {
    textEl.textContent += str[i] ?? "";
    i++;
    if (i >= str.length) {
      clearInterval(typeTimer);
      typing = false;
    }
  }, speed);
}

function showLine(line) {
  speakerEl.textContent = line.speaker ?? "";

  if (line.action === "openChoices") {
    choices.classList.remove("hidden");
  } else {
    choices.classList.add("hidden");
  }

  typeText(line.text ?? "");
}

function next() {
  // 正在打字：按一下直接補完
  if (typing) {
    clearInterval(typeTimer);
    textEl.textContent = script[idx]?.text ?? "";
    typing = false;
    return;
  }

  // 已經最後一句：就停住（你也可以改成回首頁或顯示「END」）
  if (idx >= script.length - 1) return;

  idx++;
  showLine(script[idx]);
}

// ===== 互動 =====

// 點角色：抖動（你的 CSS 要有 .shake 動畫）
character.addEventListener("click", () => {
  character.classList.remove("shake");
  void character.offsetWidth; // 觸發 reflow 讓動畫可重播
  character.classList.add("shake");
});

// 點選項：換裝 + 關選單 + 進下一句
choices.addEventListener("click", (e) => {
  const btn = e.target.closest(".choice");
  if (!btn) return;

  const key = btn.dataset.outfit;
  const src = outfits[key];
  if (!src) return;

  character.src = src;
  choices.classList.add("hidden");
  next();
});

// 下一句按鈕
nextBtn.addEventListener("click", next);

// 開始
startBtn.addEventListener("click", () => {
  home.style.display = "none";
  idx = 0;
  character.src = outfits.base;
  showLine(script[idx]);
});

// 預設顯示第一句（即使還沒按 START 也會顯示；你想要的話也可以註解掉）
showLine(script[0]);

// ===== 舞台縮放：只留一套，永遠置中 =====
const DESIGN_W = 1080;
const DESIGN_H = 1920;

function fitStage() {
  const stage = el("stage");
  if (!stage) return;

  const scale = Math.min(
    window.innerWidth / DESIGN_W,
    window.innerHeight / DESIGN_H
  );

  stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

window.addEventListener("resize", fitStage);
fitStage();
