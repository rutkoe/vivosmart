import { getState } from './api.js';
import { setContainerLoading } from './helpers.js';

const doorSensors = [
  'binary_sensor.openclose_voordeur',
  'binary_sensor.openclose_achterdeur',
  'binary_sensor.openclose_tussendeur',
  'binary_sensor.openclose_slaapkamerraam',
  'binary_sensor.openclose_kattenkamerraam',
  'binary_sensor.openclose_keukenraam',
  'binary_sensor.openclose_kantoordeur'
];

const motionSensors = [
  'binary_sensor.presence_woonkamer',
  'binary_sensor.presence_toilet',
  'binary_sensor.presence_overloop',
  'binary_sensor.presence_badkamer',
  'binary_sensor.presence_keuken'
];

const persons = [
  { id: 'person.cindy', name: 'Cindy' },
  { id: 'person.sia', name: 'Sia' },
  { id: 'person.neo', name: 'Neo' },
  { id: 'person.homehub', name: 'Rutger' }
];

export async function loadHomeSensors() {
  const doorsContainer = document.getElementById('doors');
  const motionContainer = document.getElementById('motion');
  if (!doorsContainer || !motionContainer) return;

  setContainerLoading(doorsContainer, 'Sensoren laden...');
  setContainerLoading(motionContainer, 'Sensoren laden...');

  const doorStates = [];
  for (const entity of doorSensors) {
    const state = await getState(entity);
    if (state) doorStates.push({ entity, state });
  }

  doorsContainer.innerHTML = '';
  for (const { entity, state } of doorStates) {
    const name = state.attributes.friendly_name || entity;
    const isOpen = state.state === 'on';
    const div = document.createElement('div');
    div.className = `sensor-tile ${isOpen ? 'alert' : 'ok'}`;
    div.innerHTML = `
      <div class="sensor-name">${name}</div>
      <div class="sensor-state">${isOpen ? 'Open' : 'Dicht'}</div>
    `;
    doorsContainer.appendChild(div);
  }

  if (!doorsContainer.children.length) {
    doorsContainer.innerHTML = '<div class="empty">Geen sensoren gevonden</div>';
  }

  const motionStates = [];
  for (const entity of motionSensors) {
    const state = await getState(entity);
    if (state) motionStates.push({ entity, state });
  }

  motionContainer.innerHTML = '';
  for (const { entity, state } of motionStates) {
    const name = state.attributes.friendly_name || entity;
    const active = state.state === 'on';
    const div = document.createElement('div');
    div.className = `sensor-tile ${active ? 'alert' : 'ok'}`;
    div.innerHTML = `
      <div class="sensor-name">${name}</div>
      <div class="sensor-state">${active ? 'Beweging' : 'Rustig'}</div>
    `;
    motionContainer.appendChild(div);
  }

  if (!motionContainer.children.length) {
    motionContainer.innerHTML = '<div class="empty">Geen sensoren gevonden</div>';
  }
}

export async function loadPersons() {
  for (const person of persons) {
    const data = await getState(person.id);
    if (!data) continue;
    const el = document.querySelector(`.avatar[data-name="${person.name}"] .location`);
    if (!el) continue;

    const state = data.state;
    const geo = data.attributes.geocoded_location || '';
    let text = '';

    if (state === 'home') text = 'Thuis';
    else if (state === 'not_home') text = geo ? geo : 'Onderweg';
    else text = state;

    el.textContent = text;
  }
}
