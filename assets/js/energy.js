import { getState } from './api.js';
import { setContainerLoading, formatStateValue } from './helpers.js';

const energySensors = [
  { id: 'sensor.p1_meter_3c39e728ca42_energy_consumption_tariff_1', label: 'Tarief 1' },
  { id: 'sensor.p1_meter_3c39e728ca42_energy_consumption_tariff_2', label: 'Tarief 2' },
  { id: 'sensor.daily_energy', label: 'Dag verbruik' },
  { id: 'sensor.monthly_energy', label: 'Maand verbruik' },
  { id: 'sensor.p1_meter_3c39e728ca42_gas_consumption', label: 'Gas' }
];

export async function loadEnergy() {
  const container = document.getElementById('energy');
  if (!container) return;
  setContainerLoading(container, 'Energiegegevens laden...');

  const states = await Promise.all(
    energySensors.map(async sensor => ({ sensor, state: await getState(sensor.id) }))
  );

  container.innerHTML = '';
  for (const { sensor, state } of states) {
    if (!state) continue;
    const div = document.createElement('div');
    div.className = 'sensor-tile energy';
    div.innerHTML = `
      <div class="sensor-name">${sensor.label || state.attributes.friendly_name || sensor.id}</div>
      <div class="sensor-state">${formatStateValue(state)}</div>
    `;
    container.appendChild(div);
  }

  if (!container.children.length) {
    container.innerHTML = '<div class="empty">Geen energiegegevens beschikbaar</div>';
  }
}
