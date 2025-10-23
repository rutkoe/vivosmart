import { getState, callService } from './api.js';
import { setContainerLoading, showToast } from './helpers.js';

const lightGroups = [
  {
    title: 'Woonkamer',
    entities: [
      'light.group_woonkamer',
      'light.ledstrip_tv',
      'light.ledstrip_vensterbank',
      'light.kamerlamp',
      'light.bureaulamp',
      'switch.smartplug_1'
    ]
  },
  {
    title: 'Plafondlampen',
    entities: [
      'light.group_woonkamer_plafond',
      'light.plafondlamp',
      'light.plafondlamp1'
    ]
  },
  {
    title: 'Slaapkamer',
    entities: [
      'light.extended_color_light_23',
      'light.cct_slaapkamer',
      'light.rgb_slaapkamer'
    ]
  },
  {
    title: 'Hobbykamer',
    entities: [
      'light.hobbykamer_lamp',
      'light.lightbar_hobbykamer',
      'switch.smartplug_2'
    ]
  },
  {
    title: 'Keuken',
    entities: [
      'light.group_verlichting_afzuigkap',
      'light.hue_ledstrip',
      'light.keukenlamp'
    ]
  },
  {
    title: 'Overige ruimtes',
    entities: [
      'light.overlooplamp',
      'light.entreelamp',
      'light.badkamerlamp',
      'light.toiletlamp'
    ]
  }
];

export async function loadLights() {
  const lightsContainer = document.getElementById('lights');
  if (!lightsContainer) return;

  setContainerLoading(lightsContainer, 'Verlichting laden...');
  const fragment = document.createDocumentFragment();

  for (const group of lightGroups) {
    const card = document.createElement('div');
    card.className = 'card glass';
    card.innerHTML = `<h2>${group.title}</h2>`;

    const grid = document.createElement('div');
    grid.className = 'light-grid';
    card.appendChild(grid);

    const states = await Promise.all(
      group.entities.map(async entity => ({ entity, state: await getState(entity) }))
    );

    for (const { entity, state } of states) {
      if (!state) continue;
      const name = state.attributes.friendly_name || entity;
      const isOn = state.state === 'on';

      const button = document.createElement('button');
      button.className = `light-btn ${isOn ? 'on' : 'off'}`;
      button.dataset.entity = entity;
      button.dataset.state = state.state;
      button.innerHTML = `<span>${name}</span>`;

      button.addEventListener('click', async () => {
        const currentState = button.dataset.state;
        const targetService = currentState === 'on' ? 'turn_off' : 'turn_on';
        const domain = entity.split('.')[0];
        button.disabled = true;
        button.classList.add('busy');
        showToast(`${name} ${targetService === 'turn_on' ? 'aan' : 'uit'}...`, 'info');
        try {
          await callService(domain, targetService, { entity_id: entity });
          showToast(`${name} ${targetService === 'turn_on' ? 'ingeschakeld' : 'uitgeschakeld'}`, 'success');
        } catch (error) {
          showToast('Actie mislukt', 'error');
        } finally {
          setTimeout(loadLights, 800);
        }
      });

      grid.appendChild(button);
    }

    if (!grid.children.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'Geen lampen gevonden';
      card.appendChild(empty);
    }

    fragment.appendChild(card);
  }

  lightsContainer.innerHTML = '';
  lightsContainer.appendChild(fragment);
}
