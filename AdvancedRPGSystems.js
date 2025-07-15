// AdvancedRPGSystems.js
// Handles: Traits, Base Building, Disguise, Bounty, Corruption

// ====== Trait / Background System ======
window.traits = {
  options: {
    noble: {
      name: "Exiled Noble",
      description: "+Rep with nobles, -Rep with villagers. Unique quests.",
      apply() {
        reputation.scores.villagers -= 2;
        reputation.scores.bandits += 1;
      }
    },
    thief: {
      name: "Street Thief",
      description: "+Stealth, access bandit quests, start with lockpick",
      apply() {
        gameState.skills.push("Stealth");
        gameState.inventory.push({ id: 'lockpick', name: 'Lockpick', type: 'tool', description: 'Useful for locked doors.' });
      }
    },
    scholar: {
      name: "Forgotten Scholar",
      description: "+XP from lore/books, unique skill paths",
      apply() {
        gameState.skills.push("Lore Insight");
      }
    }
  },
  choose(key) {
    const trait = this.options[key];
    if (trait) trait.apply();
  }
};

// ====== Base Building System ======
window.base = {
  structures: {
    forge: { built: false, description: "Forge: improves weapon crafting." },
    library: { built: false, description: "Library: unlocks lore and scholar skills." },
    garden: { built: false, description: "Garden: regrows herbs over time." }
  },
  build(structure) {
    if (this.structures[structure] && !this.structures[structure].built) {
      this.structures[structure].built = true;
      showMessage(`${structure} built!`);
    } else {
      showMessage("You already built this or it's invalid.");
    }
  },
  listOptions() {
    return Object.keys(this.structures).map(s => ({
      text: `${this.structures[s].description}`,
      action: () => this.build(s)
    }));
  }
};

// ====== Disguise System ======
window.disguise = {
  active: false,
  identity: null,
  wear(alias) {
    this.active = true;
    this.identity = alias;
    showMessage(`You now go by the name '${alias}'.`);
  },
  remove() {
    this.active = false;
    this.identity = null;
    showMessage("You removed your disguise.");
  },
  getAlias() {
    return this.active ? this.identity : "Yourself";
  }
};

// ====== Bounty System ======
window.bounty = {
  level: 0,
  commitCrime(amount = 1) {
    this.level += amount;
    showMessage(`You committed a crime. Bounty is now ${this.level}.`);
  },
  clear(amount = null) {
    this.level = amount === null ? 0 : Math.max(0, this.level - amount);
    showMessage(`Bounty cleared. New level: ${this.level}`);
  },
  check() {
    if (this.level > 5) {
      showMessage("Bounty hunters are tracking you...");
    }
  }
};

// ====== Corruption / Doom Meter ======
window.corruption = {
  value: 0,
  increase(amount = 1) {
    this.value += amount;
    if (this.value >= 10) {
      showMessage("Something dark begins to awaken inside you...");
    }
  },
  reset() {
    this.value = 0;
    showMessage("Your soul feels lighter...");
  }
};
