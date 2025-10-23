import { getState } from './api.js';
import { formatStateValue } from './helpers.js';

const topBarSensors = [
  'weather.huis',
  'sensor.temperature_woonkamer',
  'sensor.humidity_woonkamer',
  'sensor.p1_meter_3c39e728ca42_active_power'
];

export async function loadTopSensors() {
  const el = document.getElementById('sensorData');
  if (!el) return;
  el.innerHTML = '';

  const states = await Promise.all(
    topBarSensors.map(async entity => ({ entity, state: await getState(entity) }))
  );

  for (const { entity, state } of states) {
    if (!state) continue;
    const name = state.attributes.friendly_name || entity;
    const val = formatStateValue(state);
    const div = document.createElement('div');
    div.className = 'top-sensor';
    div.textContent = `${name}: ${val}`;
    el.appendChild(div);
  }
}
