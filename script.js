const items = [
  { type: "papel", image: "caixa_de_suco.png" },
    { type: "papel", image: "papel_amassado.png" },
  { type: "plastico", image: "garrafa_plastica.png" },
   { type: "plastico", image: "caneta.png" },
  { type: "metal", image: "clip_de_papel.png" },
  { type: "metal", image: "lata_refrigerante.png" },
  { type: "vidro", image: "copo_de_vidro.png" }
];

let score = 0;
let errors = 0;
let correctStreak = 0;
let currentItem = null;

const trashItem = document.getElementById("trash-item");
const scoreDisplay = document.getElementById("score");
const errorDisplay = document.getElementById("errors");
const gameOverDisplay = document.getElementById("gameOverDisplay");
const finalScore = document.getElementById("finalScore");
const restartButton = document.getElementById("restartButton");
const bins = document.querySelectorAll(".bin");

function getRandomItem() {
  return items[Math.floor(Math.random() * items.length)];
}

function loadNewItem() {
  currentItem = getRandomItem();
  trashItem.style.backgroundImage = `url(${currentItem.image})`;

  // Reset posição caso tenha ficado fixa no drag anterior
  trashItem.style.position = "relative";
  trashItem.style.left = "";
  trashItem.style.top = "";
  trashItem.style.zIndex = "";
}

// Floating points animation
function showFloatingPoints(text) {
  const float = document.getElementById("points-float");
  float.textContent = text;
  float.style.left = trashItem.offsetLeft + 30 + "px";
  float.style.top = trashItem.offsetTop - 10 + "px";
  float.style.display = "block";
  float.style.animation = "none";
  void float.offsetWidth;
  float.style.animation = "floatUp 1s ease-out forwards";

  setTimeout(() => {
    float.style.display = "none";
  }, 1000);
}

// Variáveis para drag personalizado
let dragging = false;
let offsetX = 0;
let offsetY = 0;

function startDrag(e) {
  dragging = true;
  const rect = trashItem.getBoundingClientRect();

  let clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
  let clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;

  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;

  trashItem.style.position = "fixed";
  trashItem.style.zIndex = 1000;
  moveAt(clientX, clientY);

  e.preventDefault();
}

function moveAt(clientX, clientY) {
  trashItem.style.left = clientX - offsetX + "px";
  trashItem.style.top = clientY - offsetY + "px";
}

function onDrag(e) {
  if (!dragging) return;

  let clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
  let clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;

  moveAt(clientX, clientY);

  e.preventDefault();
}

function endDrag(e) {
  if (!dragging) return;
  dragging = false;

  const rect = trashItem.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  let droppedInBin = false;

  bins.forEach(bin => {
    const binRect = bin.getBoundingClientRect();

    if (
      centerX > binRect.left &&
      centerX < binRect.right &&
      centerY > binRect.top &&
      centerY < binRect.bottom
    ) {
      const binType = bin.getAttribute("data-type");
      if (currentItem.type === binType) {
        score += 100;
        correctStreak++;
        showFloatingPoints("100");
        if (correctStreak % 5 === 0) {
          score += 200;
          showFloatingPoints("Bônus! +200");
        }
        scoreDisplay.textContent = score;
      } else {
        errors++;
        correctStreak = 0;
        errorDisplay.textContent = errors;

        if (errors >= 5) {
          trashItem.style.display = "none";
          finalScore.textContent = `Sua pontuação: ${score} pontos`;
          gameOverDisplay.style.display = "block";
          return;
        }
      }

      droppedInBin = true;
      loadNewItem();
    }
  });

  if (!droppedInBin) {
    // Voltar para posição inicial
    trashItem.style.left = "";
    trashItem.style.top = "";
    trashItem.style.position = "relative";
    trashItem.style.zIndex = "";
  }

  e.preventDefault();
}

// Eventos mouse e touch para drag personalizado
trashItem.addEventListener("mousedown", startDrag);
trashItem.addEventListener("touchstart", startDrag);

document.addEventListener("mousemove", onDrag);
document.addEventListener("touchmove", onDrag, { passive: false });

document.addEventListener("mouseup", endDrag);
document.addEventListener("touchend", endDrag);
document.addEventListener("touchcancel", endDrag);

restartButton.addEventListener("click", () => {
  score = 0;
  errors = 0;
  correctStreak = 0;
  scoreDisplay.textContent = score;
  errorDisplay.textContent = errors;
  trashItem.style.display = "block";
  gameOverDisplay.style.display = "none";
  loadNewItem();
});

loadNewItem();