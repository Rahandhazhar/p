// game.js

// ====== Game State ======
let gameState = {
  hp: 30,
  maxHp: 30,
  level: 1,
  xp: 0,
  xpToNext: 100,
  attack: 5,
  defense: 2,
  inCombat: false,
  enemy: null,
  statusEffects: [],
  inventory: [
    { id: "herb", name: "Herb", type: "material", description: "A medicinal herb." },
    { id: "vial", name: "Vial", type: "material", description: "An empty glass vial." }
  ],
  skills: [],
  goodWill: 0,
  badWill: 0,
  scene: "start"  // immediately launch story
};

// ====== DOM Elements ======
const storyEl = document.getElementById("story");
const choicesEl = document.getElementById("choices");
const statsEl = document.getElementById("stats");
const inventoryListEl = document.getElementById("inventoryList");
const skillListEl = document.getElementById("skillList");

// ====== Helpers ======
function showMessage(text) {
  storyEl.innerHTML = `<p>${text}</p>`;
}

function renderChoices(choices) {
  choicesEl.innerHTML = "";
  choices
    .filter(c => (c.visible ? c.visible() : true))
    .forEach(choice => {
      const btn = document.createElement("button");
      btn.textContent = choice.text;
      btn.className = "choice-button";
      btn.onclick = () => choice.action();
      choicesEl.appendChild(btn);
    });
}

function adjustGoodWill(n) {
  gameState.goodWill = Math.max(0, gameState.goodWill + n);
  renderStats();
}
function adjustBadWill(n) {
  gameState.badWill = Math.max(0, gameState.badWill + n);
  renderStats();
}

// ====== Renderers ======
function renderStats() {
  statsEl.innerHTML = `
    <p>HP: ${gameState.hp} / ${gameState.maxHp}</p>
    <p>Level: ${gameState.level} | XP: ${gameState.xp} / ${gameState.xpToNext}</p>
    <p>Attack: ${gameState.attack} | Defense: ${gameState.defense}</p>
    <p>Good Will: ${gameState.goodWill} | Bad Will: ${gameState.badWill}</p>
    <p>Location: ${map.locations[map.current].name}</p>
    <p>Time: ${timeSystem.getTimeString()} | Weather: ${timeSystem.weather}</p>
    <p>Reputation: Villagers ${reputation.scores.villagers}, Merchants ${reputation.scores.merchants}, Bandits ${reputation.scores.bandits}</p>
  `;
}

function renderInventory() {
  inventoryListEl.innerHTML = "";
  gameState.inventory.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name}: ${item.description}`;
    inventoryListEl.appendChild(li);
  });
}

function renderSkills() {
  skillListEl.innerHTML = "";
  gameState.skills.forEach(skill => {
    const li = document.createElement("li");
    li.textContent = `${skill}: ${skillTree[skill].description}`;
    skillListEl.appendChild(li);
  });
}

// ====== Combat System (simple example) ======
function renderCombatUI() {
  const e = gameState.enemy;
  showMessage(
    `⦿ Enemy: ${e.name} (${e.hp}/${e.maxHp})<br>` +
    `⦿ Your HP: ${gameState.hp}/${gameState.maxHp}`
  );
  renderChoices([
    { text: "Attack", action: playerAttack },
    { text: "Defend", action: playerDefend },
    { text: "Use Item", action: useItemInCombat },
    { text: "Run", action: tryRun }
  ]);
}

function playerAttack() {
  const dmg = Math.max(1, gameState.attack - gameState.enemy.defense);
  gameState.enemy.hp -= dmg;
  showMessage(`You strike the ${gameState.enemy.name} for ${dmg} damage!`);
  if (gameState.enemy.hp <= 0) return winCombat();
  enemyTurn();
}

function playerDefend() {
  showMessage("You brace yourself (defense +2 this turn).");
  const savedDef = gameState.defense;
  gameState.defense += 2;
  enemyTurn();
  gameState.defense = savedDef;
}

function useItemInCombat() {
  if (!gameState.inventory.length) {
    showMessage("No items to use.");
    return renderCombatUI();
  }
  // simple: use first consumable
  const idx = gameState.inventory.findIndex(i => i.type === "heal" || i.type === "cure");
  if (idx === -1) { showMessage("No usable items."); return renderCombatUI(); }
  const item = gameState.inventory.splice(idx, 1)[0];
  if (item.type === "heal") {
    gameState.hp = Math.min(gameState.maxHp, gameState.hp + item.power);
    showMessage(`You used ${item.name}, healed ${item.power} HP.`);
  } else {
    showMessage(`You used ${item.name}.`);
  }
  renderStats();
  enemyTurn();
}

function tryRun() {
  if (Math.random() < 0.5) {
    showMessage("You fled combat!");
    gameState.inCombat = false;
    return renderScene();
  } else {
    showMessage("Failed to escape!");
    return enemyTurn();
  }
}

function enemyTurn() {
  const dmg = Math.max(1, gameState.enemy.attack - gameState.defense);
  gameState.hp -= dmg;
  showMessage(`The ${gameState.enemy.name} hits you for ${dmg} damage!`);
  if (gameState.hp <= 0) return gameOver();
  renderCombatUI();
}

function winCombat() {
  showMessage(`You defeated the ${gameState.enemy.name}! You gain 50 XP.`);
  gameState.xp += 50;
  checkLevelUp();
  gameState.inCombat = false;
  gameState.enemy = null;
  renderScene();
}

function gameOver() {
  showMessage("You have perished. Game Over.");
  renderChoices([{ text: "Restart", action: startGame }]);
}

// ====== Leveling ======
function checkLevelUp() {
  while (gameState.xp >= gameState.xpToNext) {
    gameState.xp -= gameState.xpToNext;
    gameState.level++;
    gameState.xpToNext = Math.floor(gameState.xpToNext * 1.5);
    gameState.maxHp += 5;
    gameState.attack += 2;
    gameState.defense += 1;
    gameState.hp = gameState.maxHp;
    showMessage(`Leveled up to ${gameState.level}!`);
  }
  renderStats();
}

// ====== Main Scene Render ======
function renderScene() {
  renderStats();
  renderInventory();
  renderSkills();

  if (gameState.inCombat) return renderCombatUI();

  switch (gameState.scene) {
    case "start":
      // Kick off your story
      startScene(gameState, renderScene, showMessage, renderChoices);
      break;

    case 'mainMenu':
  renderStats();
  showMessage("What will you do?");
  renderChoices([
    { text: "Explore", action: () => { gameState.scene = "travel"; renderScene(); } },
    { text: "Craft", action: () => { gameState.scene = "craft"; renderScene(); } },
    { text: "Systems", action: renderSystemsMenu },
    // Add more options as needed
  ]);
  break;


    case "travel":
      const neigh = map.getNeighbors();
      showMessage("Where to?");
      renderChoices(
        neigh.map(loc => ({
          text: loc.name,
          action: () => map.moveTo(loc.key)
        }))
        .concat({ text: "Back", action: () => { gameState.scene = "mainMenu"; renderScene(); }})
      );
      break;

    case "craft":
      showMessage("Choose a recipe:");
      renderChoices(
        Object.keys(crafting.recipes).map(key => ({
          text: crafting.recipes[key].result.name,
          action: () => crafting.craft(key)
        }))
        .concat({ text: "Back", action: () => { gameState.scene = "mainMenu"; renderScene(); }})
      );
      break;

    default:
      showMessage("Nothing to do here.");
      renderChoices([{ text: "Back", action: () => { gameState.scene = "mainMenu"; renderScene(); }}]);
      break;
  }
}

// ====== Start / Restart ======
function startGame() {
  // Reset core state
  gameState = {
    hp: 30, maxHp: 30,
    level: 1, xp: 0, xpToNext: 100,
    attack: 5, defense: 2,
    inCombat: false, enemy: null, statusEffects: [],
    inventory: [
      { id: "herb", name: "Herb", type: "material", description: "A medicinal herb." },
      { id: "vial", name: "Vial", type: "material", description: "An empty glass vial." }
    ],
    skills: [], goodWill: 0, badWill: 0,
    scene: "start"
  };
  map.current = "village";
  renderScene();
}

document.addEventListener("DOMContentLoaded", startGame);
