// ui-enhancements.js

// DOM elements
const themeToggleBtn = document.getElementById('themeToggle');
const musicToggleBtn = document.getElementById('musicToggle');
const musicElement = document.getElementById('Music');
const storyEl = document.getElementById('story');

// State
let musicPlaying = false;

// --- THEME TOGGLE ---
function toggleTheme() {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
  const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  themeToggleBtn.textContent = newTheme === 'dark' ? '🌙' : '☀️';
}

// --- MUSIC TOGGLE ---
function toggleMusic() {
  if (!musicElement) return;
  if (musicElement.paused) {
    musicElement.play();
    musicToggleBtn.textContent = '🔊';
    musicPlaying = true;
  } else {
    musicElement.pause();
    musicToggleBtn.textContent = '🔇';
    musicPlaying = false;
  }
}

// --- STORY MESSAGE WITH FADE-IN ---
function showMessage(text) {
  storyEl.innerHTML = `<p class="fade-in">${text}</p>`;
}

// --- COLLAPSIBLE PANELS ---
function initCollapsible() {
  document.querySelectorAll('.collapsible').forEach(section => {
    const header = section.querySelector('h2');
    if (!header) return;
    header.addEventListener('click', () => {
      section.classList.toggle('collapsed');
    });
  });
}

// --- INITIALIZATION ---
function initUI() {
  // Theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.classList.add(savedTheme);
  themeToggleBtn.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
  themeToggleBtn.addEventListener('click', toggleTheme);

  // Music
  if (musicElement) {
    musicElement.loop = true;
    musicElement.volume = 0.15;
    musicPlaying = !musicElement.paused;
    musicToggleBtn.textContent = musicPlaying ? '🔊' : '🔇';
    musicToggleBtn.addEventListener('click', toggleMusic);
  }

  // Collapsible inventory & skills
  initCollapsible();
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', initUI);
