// systems.js
// Implements: Branching Map, Crafting & Upgrades, Dynamic Weather & Day-Night Cycle, Reputation System

// ====== Branching Map ======
window.map = {
  locations: {
    village: { name: "Village", neighbors: ["forest", "mountain"] },
    forest:  { name: "Enchanted Forest", neighbors: ["village", "swamp"] },
    mountain:{ name: "Snowy Mountain", neighbors: ["village", "cave"] },
    swamp:   { name: "Haunted Swamp", neighbors: ["forest"] },
    cave:    { name: "Dark Cave", neighbors: ["mountain"] }
  },
  current: "village",
  moveTo(locKey) {
    const loc = this.locations[locKey];
    if (!loc || !this.locations[this.current].neighbors.includes(locKey)) {
      showMessage("You can't go there from here.");
      return;
    }
    this.current = locKey;
    showMessage(`You travel to the ${loc.name}.`);
    renderScene();
  },
  getNeighbors() {
    return this.locations[this.current].neighbors.map(k => ({ key: k, name: this.locations[k].name }));
  }
};

// ====== Crafting & Upgrades ======
window.crafting = {
  recipes: {
    "healingPotion": { ingredients: { herb: 2, vial: 1 }, result: { id: "potion", name: "Healing Potion", type: "heal", power: 20, description: "Restores 20 HP." } },
    "ironSword":    { ingredients: { iron: 3, wood: 1 }, result: { id: "ironSword", name: "Iron Sword", type: "weapon", stats: { attack: 8 }, description: "Sturdy iron blade." } }
  },
  craft(itemKey) {
    const recipe = this.recipes[itemKey];
    if (!recipe) return showMessage("Unknown recipe.");
    const inv = gameState.inventory;
    // check ingredients
    for (let mat in recipe.ingredients) {
      const needed = recipe.ingredients[mat];
      const have = inv.filter(i => i.id === mat).length;
      if (have < needed) return showMessage(`Not enough ${mat}.`);
    }
    // remove ingredients
    for (let mat in recipe.ingredients) {
      let count = recipe.ingredients[mat];
      for (let i = inv.length-1; i>=0 && count>0; i--) {
        if (inv[i].id === mat) { inv.splice(i,1); count--; }
      }
    }
    // add result
    gameState.inventory.push(JSON.parse(JSON.stringify(recipe.result)));
    showMessage(`You crafted a ${recipe.result.name}.`);
    renderInventory();
    renderStats();
  }
};

// ====== Dynamic Weather & Day-Night Cycle ======
window.timeSystem = {
  hour: 8,
  weather: "clear", // clear, rain, fog, storm
  tick() {
    this.hour = (this.hour + 1) % 24;
    const roll = Math.random();
    if (roll < 0.1) this.weather = "storm";
    else if (roll < 0.3) this.weather = "rain";
    else if (roll < 0.4) this.weather = "fog";
    else this.weather = "clear";
    showMessage(`It is now ${this.getTimeString()} and the weather is ${this.weather}.`);
    applyWeatherEffects();
    renderScene();
  },
  getTimeString() {
    const ampm = this.hour < 12 ? 'AM' : 'PM';
    const h = ((this.hour + 11) % 12 + 1);
    return `${h}:00 ${ampm}`;
  }
};

function applyWeatherEffects() {
  if (map.current === 'forest' && timeSystem.weather === 'fog') {
    showMessage("The fog in the forest makes it harder to spot enemies.");
  }
}

// ====== Reputation System ======
window.reputation = {
  scores: { villagers: 0, merchants: 0, bandits: 0 },
  adjust(faction, amount) {
    if (this.scores[faction] !== undefined) {
      this.scores[faction] += amount;
      showMessage(`Your reputation with ${faction} is now ${this.scores[faction]}.`);
    }
  },
  canAccess(option) {
    if (option === 'merchantShop') return this.scores.merchants >= 5;
    return true;
  }
};
