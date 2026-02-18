// ==========================================
// 1. GAME STATE & CONFIGURATION
// ==========================================

let game = {
  score: 0,
  clickPower: 1,
  wattsPerSecond: 0,
  costMultiplier: 1.15, // Experiment with different multipliers
};

// Item Configuration
// Keys (clicker, potato, etc.) must match HTML IDs (btn-clicker, cost-clicker)
const upgrades = {
  clicker: {
    name: "Cursor",
    type: "click",
    cost: 15,
    power: 1,
    count: 0,
  },
  potato: {
    name: "Potato Battery",
    type: "auto",
    cost: 50,
    power: 1,
    count: 0,
  },
  hamster: {
    name: "Hamster Wheel",
    type: "auto",
    cost: 250,
    power: 5,
    count: 0,
  },
  solar: {
    name: "Solar Panel",
    type: "auto",
    cost: 1000,
    power: 20,
    count: 0,
  },
};

let gameInterval;

// ==========================================
// 2. CORE LOGIC
// ==========================================

// Initialize
loadGame();

// Game Loop (Runs once per second)
gameInterval = setInterval(function () {
  game.score += game.wattsPerSecond;
  updateDisplay();
  saveGame();
}, 1000);

// Recalculate totals based on inventory
// This ensures math never drifts or gets buggy
function recalculateRates() {
  game.wattsPerSecond = 0;
  game.clickPower = 1; // Base power

  for (const key in upgrades) {
    const item = upgrades[key];
    if (item.type === "auto") {
      game.wattsPerSecond += item.count * item.power;
    } else if (item.type === "click") {
      game.clickPower += item.count * item.power;
    }
  }
}

// ==========================================
// 3. ACTIONS
// ==========================================

function clickWattson() {
  game.score += game.clickPower;
  updateDisplay();
}

function buyUpgrade(itemId) {
  const item = upgrades[itemId];

  if (item && game.score >= item.cost) {
    game.score -= item.cost;
    item.count++;
    item.cost = Math.round(item.cost * game.costMultiplier);

    recalculateRates();
    updateDisplay();
  }
}

// ==========================================
// 4. UI UPDATES
// ==========================================

function updateDisplay() {
  // Update Score & WPS
  document.getElementById("score").innerText = Math.floor(game.score);
  document.getElementById("wps-display").innerText = game.wattsPerSecond;

  // Loop through every item and update its specific HTML elements
  for (const key in upgrades) {
    const item = upgrades[key];

    // Update Count Text
    const countEl = document.getElementById(`count-${key}`);
    countEl.innerText = `x ${item.count}`;

    // Update Cost Text
    const costEl = document.getElementById(`cost-${key}`);
    if (costEl) costEl.innerText = item.cost + " Watts";

    // Update Button Disabled State (Gray out if too expensive)
    const btnEl = document.getElementById(`btn-${key}`);
    if (btnEl) btnEl.disabled = game.score < item.cost;
  }
}

// This is extra if participants want to learn how to save their games
// ==========================================
// 5. SAVE & LOAD
// ==========================================

function saveGame() {
  const data = {
    score: game.score,
    upgrades: upgrades,
  };
  localStorage.setItem("wattsonSave", JSON.stringify(data));
}

function loadGame() {
  const savedData = JSON.parse(localStorage.getItem("wattsonSave"));

  if (savedData) {
    if (savedData.score) game.score = savedData.score;

    // Merge saved upgrades into current config
    if (savedData.upgrades) {
      for (const key in savedData.upgrades) {
        if (upgrades[key]) {
          upgrades[key].count = savedData.upgrades[key].count;
          upgrades[key].cost = savedData.upgrades[key].cost;
        }
      }
    }
    recalculateRates();
  }
  updateDisplay();
}

function resetGame() {
  if (confirm("Restart game from 0?")) {
    clearInterval(gameInterval);
    localStorage.removeItem("wattsonSave");
    location.reload();
  }
}
