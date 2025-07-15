window.enemies = {
  goblin: {
    name: "Goblin Raider",
    maxHp: 25,
    attack: 4,
    defense: 1,
    description: "A sneaky goblin wielding a jagged dagger.",
    ability(playerState, applyStatus, showMessage) {
      if (Math.random() < 0.3) {
        applyStatus("bleed", 3);
        showMessage("The Goblin inflicted Bleed on you!");
      }
    }
  },

  fireSpirit: {
    name: "Fire Spirit",
    maxHp: 40,
    attack: 6,
    defense: 2,
    description: "A searing elemental entity of flame.",
    ability(playerState, applyStatus, showMessage) {
      if (Math.random() < 0.4) {
        applyStatus("burn", 3);
        showMessage("The Fire Spirit sets you ablaze!");
      }
    }
  }
};

window.spawnEnemy = function(enemyKey) {
  const baseEnemy = window.enemies[enemyKey];
  if (!baseEnemy) throw new Error(`Enemy "${enemyKey}" does not exist.`);
  return {
    ...baseEnemy,
    hp: baseEnemy.maxHp,
  };
};
