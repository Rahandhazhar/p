// startScene.js
// Initial story + trait choice + game intro

function startScene(gameState, renderScene, showMessage, renderChoices) {
  showMessage("You awaken with no memory of the day before. The wind carries the scent of destiny. But who were you before all this?");

  renderChoices([
    {
      text: "Exiled Noble",
      action: () => {
        traits.choose("noble");
        gameState.scene = "mainMenu";
        renderScene();
      }
    },
    {
      text: "Street Thief",
      action: () => {
        traits.choose("thief");
        gameState.scene = "mainMenu";
        renderScene();
      }
    },
    {
      text: "Forgotten Scholar",
      action: () => {
        traits.choose("scholar");
        gameState.scene = "mainMenu";
        renderScene();
      }
    }
  ]);
}
