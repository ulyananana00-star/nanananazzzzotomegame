const el = (id) => document.getElementById(id);

// ===== 取得元素 =====
const home = el("home");
const startBtn = el("start");
const character = el("character");
const textEl = el("text");
const nextBtn = el("next");
const choices = el("choices");
const speakerEl = el("speaker");
const choiceArrow = el("choiceArrow"); 

// ===== 資源設定 =====
const outfits = {
  base: "material/平.png",
  red: "material/平1.png",
  sailor: "material/平2.png",
  leaf: "material/平3.png",
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

// ===== 箭頭移動（只在選項旁）=====
function moveArrowToChoice(btn) {
  if (!choiceArrow || !btn || !choices) return;

  // choices 是定位容器，所以用 offsetTop 最穩（不怕縮放）
  const y = btn.offsetTop + (btn.offsetHeight / 2) - (choiceArrow.offsetHeight / 2);

  choiceArrow.style.top = `${y}px`;
  choiceArrow.style.opacity = "1";
}

function showChoices() {
  choices.classList.remove("hidden");

  // ✅ 顯示箭頭並先指向第一個選項
  if (choiceArrow) {
    choiceArrow.style.opacity = "1";
    const first = choices.querySelector(".choice");
    // 等瀏覽器把 hidden 拿掉後再算位置
    requestAnimationFrame(() => moveArrowToChoice(first));
  }
}

function hideChoices() {
  choices.classList.add("hidden");

  // ✅ 隱藏箭頭
  if (choiceArrow) choiceArrow.style.opacity = "0";
}

function showLine(line) {
  speakerEl.textContent = line.speaker ?? "";

  if (line.action === "openChoices") {
    showChoices();
  } else {
    hideChoices();
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

  // 已經最後一句：就停住
  if (idx >= script.length - 1) return;

  idx++;
  showLine(script[idx]);

  if (!choices.classList.contains("hidden")) return;
}

// ===== 互動 =====

// 點角色：抖動
character.addEventListener("click", () => {
  character.classList.remove("shake");
  void character.offsetWidth;
  character.classList.add("shake");
});

// ✅ 滑過某個選項：箭頭跟過去
choices.addEventListener("mouseover", (e) => {
  const btn = e.target.closest(".choice");
  if (!btn) return;
  moveArrowToChoice(btn);
});

// 點選項：換裝 + 關選單 + 進下一句
choices.addEventListener("click", (e) => {
  const btn = e.target.closest(".choice");
  if (!btn) return;

  // 點了也讓箭頭對齊一下（可有可無）
  moveArrowToChoice(btn);

  const key = btn.dataset.outfit;
  const src = outfits[key];
  if (!src) return;

  character.src = src;
  hideChoices();
  next();
});

// 下一句按鈕
nextBtn.addEventListener("click", next);

// 開始
startBtn.addEventListener("click", () => {
  home.style.display = "none";
  idx = 0;
  character.src = outfits.base;
  hideChoices();
  showLine(script[idx]);
});


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
  stage.style.transformOrigin = "center center";

}

window.addEventListener("resize", fitStage);
fitStage();
