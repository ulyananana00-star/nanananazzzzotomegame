const el = (id) => document.getElementById(id);

const home = el("home");
const startBtn = el("start");
const character = el("character");
const textEl = el("text");
const nextBtn = el("next");
const choices = el("choices");
const speakerEl = el("speaker");

const outfits = {
  base: "assets/平原.png",
  red: "assets/平1.png",
  sailor: "assets/平2-1.png",
  leaf: "assets/平三.png",
};

const script = [
  { speaker: "平蘋", text: "別誤會，只是因為情人節才……" },
  { speaker: "平蘋", text: "先選一套衣服吧。", action: "openChoices" },
  { speaker: "平蘋", text: "想看？那就近些。" },
  { speaker: "平蘋", text: "別鬧了，小戲伶。" },
];

let idx = 0;
let typing = false;
let typeTimer = null;

function typeText(str, speed = 28) {
  typing = true;
  textEl.textContent = "";
  let i = 0;

  clearInterval(typeTimer);
  typeTimer = setInterval(() => {
    textEl.textContent += str[i];
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
  // 正在打字時，按下一句就直接補完
  if (typing) {
    clearInterval(typeTimer);
    textEl.textContent = script[idx].text ?? "";
    typing = false;
    return;
  }

  idx++;
  if (idx >= script.length) idx = script.length - 1;
  showLine(script[idx]);
}

// 點角色：抖動
character.addEventListener("click", () => {
  character.classList.remove("shake"); // 讓重複點擊能重播
  void character.offsetWidth; // reflow
  character.classList.add("shake");
});

// 選項：換裝 + 關閉選項 + 下一句
choices.addEventListener("click", (e) => {
  const btn = e.target.closest(".choice");
  if (!btn) return;

  const key = btn.dataset.outfit;
  if (!outfits[key]) return;

  character.src = outfits[key];
  choices.classList.add("hidden");
  next(); // 選完直接進下一句
});

// 下一句
nextBtn.addEventListener("click", next);

// 開始
startBtn.addEventListener("click", () => {
  home.style.display = "none";
  idx = 0;
  character.src = outfits.base;
  showLine(script[idx]);
});

// 預設先顯示第一句（你也可以等 START 才顯示）
showLine(script[0]);

