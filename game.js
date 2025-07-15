// game.js

let stats = {
  mind: 0,
  power: 0,
  soul: 0,
  resonance: 0, // Hidden stat
};

function chooseOption(choice) {
  const storyBox = document.getElementById("story");
  const statsBox = document.getElementById("stats");

  let newStory = "";

  switch (choice) {
    case 1:
      newStory = `You climb to your feet, the ruins around you stretch into the mist. Crumbled towers, shattered altars, and distant howls. Your instincts sharpen.`;
      stats.mind += 1;
      break;
    case 2:
      newStory = `Your hand burns as you touch the mark. Visions flash — battles, shadows, a forgotten name. Energy flows through your body.`;
      stats.soul += 1;
      break;
    case 3:
      newStory = `You kneel and listen. Faint whispers curl into your mind. They speak of trials, of watchers, of ancient oaths. You feel your strength rising.`;
      stats.power += 1;
      break;
    default:
      newStory = "You wait, uncertain. The world watches in silence.";
  }

  // Update the story
  storyBox.innerHTML = `<p>${newStory}</p>`;

  // Update stats
  statsBox.innerHTML = `
    <p><strong>Mind:</strong> ${stats.mind}</p>
    <p><strong>Power:</strong> ${stats.power}</p>
    <p><strong>Soul:</strong> ${stats.soul}</p>
    <p><strong>Resonance:</strong> ???</p>
  `;

  // Optional: Disable choices or continue the story
  document.getElementById("choices").innerHTML = `
    <button onclick="nextScene()">Continue...</button>
  `;
}

function nextScene() {
  const storyBox = document.getElementById("story");
  const choicesBox = document.getElementById("choices");

  storyBox.innerHTML = `
    <p>A low hum vibrates through the ruins. Something awakens.</p>
    <p>Paths stretch before you: a broken stairway, a glowing doorway, and a descent into darkness.</p>
  `;

  choicesBox.innerHTML = `
    <button onclick="explorePath('stairs')">Climb the broken stairway</button>
    <button onclick="explorePath('door')">Enter the glowing doorway</button>
    <button onclick="explorePath('descent')">Descend into the dark</button>
  `;
}

function explorePath(path) {
  const storyBox = document.getElementById("story");
  let outcome = "";

  switch (path) {
    case 'stairs':
      outcome = `You climb the ancient stairs. Each step tests your balance. At the top, a statue with its eyes gouged out offers you a rusted blade.`;
      stats.power += 1;
      break;
    case 'door':
      outcome = `You enter the glowing doorway. Light pierces your mind. You remember something — a word, a name, a face.`;
      stats.mind += 1;
      break;
    case 'descent':
      outcome = `You descend into the dark. Shadows crawl along the walls. You whisper to them — and they whisper back.`;
      stats.soul += 1;
      break;
  }

  storyBox.innerHTML = `<p>${outcome}</p>`;

  document.getElementById("stats").innerHTML = `
    <p><strong>Mind:</strong> ${stats.mind}</p>
    <p><strong>Power:</strong> ${stats.power}</p>
    <p><strong>Soul:</strong> ${stats.soul}</p>
    <p><strong>Resonance:</strong> ???</p>
  `;

  document.getElementById("choices").innerHTML = `<button onclick="nextScene()">Continue...</button>`;
}
