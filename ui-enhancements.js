// ui-enhancements.js

// DOM elements
const themeToggleBtn = document.getElementById('themeToggle');
const musicToggleBtn = document.getElementById('musicToggle');
const musicElement = document.getElementById('Music');
const storyEl = document.getElementById('story');

// State
let musicPlaying = false;

// --- THEME TOGGLE ---
function setTheme(theme) {
  document.body.className = theme;
  localStorage.setItem('theme', theme);
  themeToggleBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
}

function toggleTheme() {
  const currentTheme = document.body.className || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

// --- MUSIC TOGGLE ---
function setMusicPlaying(playing) {
  musicPlaying = playing;
  if (musicPlaying) {
    musicElement.play();
    musicToggleBtn.textContent = '🔊';
  } else {
    musicElement.pause();
    musicToggleBtn.textContent = '🔇';
  }
}

function toggleMusic() {
  if (!musicElement) return;
  if (musicElement.paused) {
    setMusicPlaying(true);
  } else {
    setMusicPlaying(false);
  }
}

// --- STORY MESSAGE WITH FADE-IN ---
function showMessage(text) {
  // Add fade-in animation class to the paragraph
  storyEl.innerHTML = `<p class="fade-in">${text}</p>`;
}

// --- INITIALIZATION ---
function initUI() {
  // Set saved or default theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  // Music setup
  if (musicElement) {
    musicElement.loop = true;
    musicElement.volume = 0.15;
    setMusicPlaying(!musicElement.paused);
  }

  // Event listeners
  themeToggleBtn.addEventListener('click', toggleTheme);
  musicToggleBtn.addEventListener('click', toggleMusic);
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initUI();
});
