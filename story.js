// story.js
// Story scenes and branching, attaches functions to window

window.startScene = function(playerState, renderScene, showMessage, renderChoices) {
  playerState.scene = "start";
  showMessage("You awaken in a dimly lit tavern, rumors of goblins attacking nearby villages spread quickly. What do you do?");
  renderChoices([
    { text: "Go investigate the goblin attacks", action: () => window.startCombat("goblin", playerState, renderScene) },
    { text: "Rest and prepare", action: () => {
        showMessage("You spend some time resting and preparing your gear.");
        renderChoices([
          { text: "Investigate goblin attacks", action: () => window.startCombat("goblin", playerState, renderScene) },
          { text: "Visit the village elder", action: () => window.visitElder(playerState, renderScene, showMessage, renderChoices) }
        ]);
    }},
    { text: "Visit the village elder", action: () => window.visitElder(playerState, renderScene, showMessage, renderChoices) }
  ]);
};

window.visitElder = function(playerState, renderScene, showMessage, renderChoices) {
  playerState.scene = "elderQuest";
  showMessage("The village elder asks for your help to defeat a Fire Spirit terrorizing the forest.");
  renderChoices([
    { text: "Accept the quest", action: () => window.startCombat("fireSpirit", playerState, renderScene) },
    { text: "Decline", action: () => {
        showMessage("You declined the quest. The village remains in danger.");
        renderChoices([
          { text: "Return to tavern", action: () => window.startScene(playerState, renderScene, showMessage, renderChoices) }
        ]);
    }}
  ]);
};

window.startCombat = function(enemyKey, playerState, renderScene) {
  playerState.enemy = window.spawnEnemy(enemyKey);
  playerState.inCombat = true;
  playerState.scene = "combat";
  renderScene();
};

window.startScene;
