import { loadHomeSensors, loadPersons } from './home.js';
import { loadLights } from './lights.js';
import { loadTopSensors } from './topbar.js';
import { loadEnergy } from './energy.js';
import { registerActionButtons } from './actions.js';

function updateClock() {
  const clock = document.getElementById('clock');
  if (!clock) return;
  const now = new Date();
  clock.textContent = now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}

function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');

      if (tab.dataset.tab === 'lights') loadLights();
      if (tab.dataset.tab === 'home') {
        loadHomeSensors();
        loadPersons();
      }
      if (tab.dataset.tab === 'energy') {
        loadEnergy();
      }
    });
  });

  const active = document.querySelector('.tab.active');
  if (active) {
    if (active.dataset.tab === 'lights') loadLights();
    if (active.dataset.tab === 'home') {
      loadHomeSensors();
      loadPersons();
    }
    if (active.dataset.tab === 'energy') loadEnergy();
  }
}

function initHoverEffects() {
  document.addEventListener('mouseover', e => {
    if (e.target.classList.contains('light-btn')) e.target.style.transform = 'translateY(-2px)';
  });
  document.addEventListener('mouseout', e => {
    if (e.target.classList.contains('light-btn')) e.target.style.transform = '';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 1000);

  initTabs();
  initHoverEffects();
  registerActionButtons();

  loadHomeSensors();
  loadPersons();
  loadTopSensors();
  loadEnergy();

  setInterval(loadHomeSensors, 60000);
  setInterval(loadPersons, 60000);
  setInterval(loadTopSensors, 60000);
  setInterval(loadEnergy, 300000);
});
