// ==========================================
// 1. GAME STATE & CONFIGURATION
// ==========================================

const gameData = {
  score: 0,
  clickPower: 1,
  lastTick: Date.now(),
  autoClickers: [
    {
      id: "auto1",
      cost: 15,
      rate: 1,
      count: 0,
    },
    {
      id: "auto2",
      cost: 50,
      rate: 5,
      count: 0,
    },
    {
      id: "auto3",
      cost: 250,
      rate: 10,
      count: 0,
    },
    {
      id: "auto4",
      cost: 1000,
      rate: 25,
      count: 0,
    },
    {
      id: "auto5",
      cost: 3000,
      rate: 50,
      count: 0,
    },
    {
      id: "auto6",
      cost: 5000,
      rate: 100,
      count: 0,
    },
    {
      id: "auto7",
      cost: 10000,
      rate: 250,
      count: 0,
    },
    {
      id: "auto8",
      cost: 45000,
      rate: 1500,
      count: 0,
    },
  ],
};

/* =========================================
   2. MAIN ENTRY POINT
   This is where the game actually starts.
   ========================================= */

function addToScore() {
  gameData.score += 1;
}

function main() {
  console.log("Game Starting...");
  // E.Load previous game data
  loadGame();

  // A. Setup the Main Click Button
  const clickBtn = document.getElementById("click-btn");
  clickBtn.addEventListener("click", addToScore);

  // B. Setup Shop Buttons (Loop through the data)
  for (let i = 0; i < gameData.autoClickers.length; i++) {
    let autoClicker = gameData.autoClickers[i];
    let btn = document.getElementById("btn-" + autoClicker.id);

    // Only attach listener if the button exists in HTML
    if (btn) {
      btn.addEventListener("click", function () {
        console.log("Buying " + autoClicker.id);
        buyAutoClicker(autoClicker);
      });
    }
  }

  // Add to save the game every 10 seconds
  setInterval(saveGame, 10000);

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
  gameData.score += calculatePPS() * (deltaTime / 1000);

  // 3. Update Screen
  updateUI();

  // 4. Loop
  // This is a builtin method will generally match the display rate of the system monitor
  requestAnimationFrame(gameLoop);
}

/* =========================================
   4. HELPER FUNCTIONS
   ========================================= */
function buyAutoClicker(autoClicker) {
  if (gameData.score >= autoClicker.cost) {
    gameData.score -= autoClicker.cost;
    autoClicker.count++;
    autoClicker.cost = Math.ceil(autoClicker.cost * 1.2);
  }
}

function calculatePPS() {
  let pps = 0;
  for (let i = 0; i < gameData.autoClickers.length; i++) {
    let item = gameData.autoClickers[i];
    pps += item.count * item.rate;
  }
  return pps;
}

function updateUI() {
  // Update Score
  document.getElementById("score").innerText = Math.floor(gameData.score);

  // Update PPS
  document.getElementById("pps").innerText = calculatePPS();

  // Update Shop Text
  for (let i = 0; i < gameData.autoClickers.length; i++) {
    let autoClicker = gameData.autoClickers[i];

    // Update HTML elements
    let costSpan = document.getElementById("cost-" + autoClicker.id);
    let countSpan = document.getElementById("count-" + autoClicker.id);

    if (costSpan) costSpan.innerText = autoClicker.cost;
    if (countSpan) countSpan.innerText = autoClicker.count;

    // Check to buy auto clicker
    let btn = document.getElementById("btn-" + autoClicker.id);
    if (gameData.score >= autoClicker.cost) {
      btn.disabled = false; // Enable
      btn.style.opacity = "1.0";
    } else {
      btn.disabled = true; // Disable
      btn.style.opacity = "0.5";
    }
  }
}

function saveGame() {
  const gameString = JSON.stringify(gameData);
  localStorage.setItem("myClickerGame", gameString);
  console.log("Game Saved!");
}

function loadGame() {
  const savedGame = localStorage.getItem("myClickerGame");
  if (savedGame === null) {
    return;
  }
  const parsedGame = JSON.parse(savedGame);
  Object.assign(gameData, parsedGame);
}

// START THE GAME
main();
