// ==========================================
// 1. GAME STATE & CONFIGURATION
// ==========================================

const gameData = {
  score: 0,
  clickPower: 1,
  pointsPerSecond: 0,
  lastTick: Date.now(),
  autoClickers: [
    {
      id: "static",
      baseCost: 15,
      rate: 1,
      count: 0,
    },
    {
      id: "potato",
      baseCost: 50,
      rate: 5,
      count: 0,
    },
    {
      id: "hamster",
      baseCost: 250,
      rate: 10,
      count: 0,
    },
    {
      id: "solar",
      baseCost: 1000,
      rate: 25,
      count: 0,
    },
    {
      id: "nuclear",
      baseCost: 3000,
      rate: 50,
      count: 0,
    },
  ],
};

/* =========================================
   2. MAIN ENTRY POINT
   This is where the game actually starts.
   ========================================= */
function main() {
  console.log("Game Starting...");

  // A. Setup the Main Click Button
  const clickBtn = document.getElementById("click-btn");
  clickBtn.addEventListener("click", function () {
    gameData.score += gameData.clickPower;
    updateUI();
  });

  // B. Setup Shop Buttons (Loop through the data)
  for (let i = 0; i < gameData.autoClickers.length; i++) {
    let item = gameData.autoClickers[i];
    let btn = document.getElementById("btn-" + item.id);

    // Only attach listener if the button exists in HTML
    if (btn) {
      btn.addEventListener("click", function () {
        console.log("Attempting to buy " + item.id);
        buyAutoClicker(item);
      });
    }
  }

  // C. Initialize the Time and Start the Loop
  lastTime = Date.now();
  requestAnimationFrame(gameLoop);
}

/* =========================================
   3. GAME ENGINE (The Loop)
   ========================================= */
function gameLoop() {
  // 1. Calculate time passed (Delta Time)
  let currentTime = Date.now();
  let deltaTime = currentTime - gameData.lastTick;
  gameData.lastTick = currentTime;

  // 2. Add points (Convert ms to seconds by dividing by 1000)
  gameData.score += gameData.pointsPerSecond * (deltaTime / 1000);

  // 3. Update Screen
  updateUI();

  // 4. Loop
  // This is a builtin method will generally match the display rate of the system monitor
  requestAnimationFrame(gameLoop);
}

/* =========================================
   4. HELPER FUNCTIONS
   ========================================= */
function buyAutoClicker(item) {
  let cost = Math.floor(item.baseCost * Math.pow(1.15, item.count));

  if (gameData.score >= cost) {
    gameData.score -= cost;
    item.count++;
  }

  calculatePPS();
  updateUI();
}

function calculatePPS() {
  let pps = 0;
  for (let i = 0; i < gameData.autoClickers.length; i++) {
    let item = gameData.autoClickers[i];
    pps += item.count * item.rate;
  }
  gameData.pointsPerSecond = pps;
}

function updateUI() {
  // Update Score
  document.getElementById("score").innerText = Math.floor(gameData.score);

  // Update PPS
  document.getElementById("pps").innerText = gameData.pointsPerSecond;

  // Update Shop Text
  for (let i = 0; i < gameData.autoClickers.length; i++) {
    let item = gameData.autoClickers[i];

    // Recalculate cost dynamically
    let cost = Math.floor(item.baseCost * Math.pow(1.15, item.count));

    // Update HTML elements
    let costSpan = document.getElementById("cost-" + item.id);
    let countSpan = document.getElementById("count-" + item.id);

    if (costSpan) costSpan.innerText = cost;
    if (countSpan) countSpan.innerText = item.count;
  }
}

// START THE GAME
main();
