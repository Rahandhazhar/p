// systemsMenu.js
// Comprehensive Systems Menu with improved UI and music toggle

// Music toggle state
let musicPlaying = true;

/**
 * Toggles background music playback on/off and shows status message.
 */
function toggleMusic() {
  const music = document.getElementById("Music");
  if (!music) return;

  if (musicPlaying) {
    music.pause();
    showMessage("🔇 Music stopped.");
  } else {
    music.play();
    showMessage("🎵 Music resumed.");
  }
  musicPlaying = !musicPlaying;
}

/**
 * Renders the main Systems Menu with all available game systems.
 */
function renderSystemsMenu() {
  showMessage("<strong>🎮 World Systems Interface:</strong><br>Select a system to manage or explore:");

  renderChoices([
    // Base Building submenu
    {
      text: "🏠 Build Your Base",
      action: () => {
        showMessage("<strong>🏗️ Base Upgrades:</strong><br>Choose a structure to build or upgrade.");
        // Assuming `base.listOptions()` returns an array of build options with {text, action}
        renderChoices(base.listOptions().concat({
          text: "⬅️ Back to Systems Menu",
          action: renderSystemsMenu
        }));
      }
    },

    // Disguise System submenu
    {
      text: "🎭 Manage Disguise",
      action: () => {
        showMessage("<strong>🕵️ Disguise Options:</strong><br>Assume a false identity to sneak past threats.");
        renderChoices([
          { text: "🕶️ Become 'Shadow'", action: () => { disguise.wear("Shadow"); renderSystemsMenu(); } },
          { text: "🎩 Become 'No Name'", action: () => { disguise.wear("No Name"); renderSystemsMenu(); } },
          { text: "❌ Remove Disguise", action: () => { disguise.remove(); renderSystemsMenu(); } },
          { text: "⬅️ Back to Systems Menu", action: renderSystemsMenu }
        ]);
      }
    },

    // Bounty System submenu
    {
      text: `⚖️ Check Bounty (${bounty.level})`,
      action: () => {
        bounty.check();
        renderChoices([
          { text: "💰 Clear Bounty (Pay Gold)", action: () => { bounty.clear(); renderSystemsMenu(); } },
          { text: "⬅️ Back to Systems Menu", action: renderSystemsMenu }
        ]);
      }
    },

    // Corruption submenu
    {
      text: `💀 Corruption Level (${corruption.value})`,
      action: () => {
        showMessage(`<strong>🩸 Dark Influence:</strong><br>Your corruption level is <strong>${corruption.value}</strong>. Be careful—high corruption has serious consequences.`);
        renderChoices([
          { text: "🕊️ Cleanse Soul", action: () => { corruption.reset(); renderSystemsMenu(); } },
          { text: "⬅️ Back to Systems Menu", action: renderSystemsMenu }
        ]);
      }
    },

    // Music Toggle button
    {
      text: musicPlaying ? "🔇 Stop Music" : "🔊 Play Music",
      action: () => { toggleMusic(); renderSystemsMenu(); }
    },

    // Return to Main Menu
    {
      text: "⬅️ Return to Main Menu",
      action: () => {
        gameState.scene = "mainMenu";
        renderScene();
      }
    }
  ]);
}
