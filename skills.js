window.skillTree = {
  "Power Strike": {
    unlocked: false,
    description: "A powerful double damage attack.",
    use(playerState, enemy, showMessage) {
      const damage = (playerState.attack * 2) - enemy.defense;
      enemy.hp -= damage;
      showMessage(`You use Power Strike and deal ${damage} damage!`);
    }
  },

  "Heal": {
    unlocked: false,
    description: "Restore 25 HP.",
    use(playerState, enemy, showMessage) {
      playerState.hp = Math.min(playerState.maxHp, playerState.hp + 25);
      showMessage("You cast Heal and restore 25 HP!");
    }
  },

  "Fireball": {
    unlocked: false,
    description: "Cast a fireball to burn the enemy.",
    use(playerState, enemy, applyStatus, showMessage) {
      enemy.hp -= 15;
      applyStatus("burn", 3);
      showMessage("You cast Fireball and burn the enemy!");
    }
  }
};

window.unlockSkill = function(skillName, playerState, showMessage) {
  if (window.skillTree[skillName] && !window.skillTree[skillName].unlocked) {
    window.skillTree[skillName].unlocked = true;
    playerState.skills.push(skillName);
    showMessage(`New skill unlocked: ${skillName}!`);
  }
};
