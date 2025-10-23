import { callService } from './api.js';
import { showToast } from './helpers.js';

export function registerActionButtons() {
  document.querySelectorAll('button.action, button.scene').forEach(button => {
    button.addEventListener('click', async () => {
      const type = button.dataset.type || 'call';
      const serviceId = button.dataset.service;
      if (!serviceId) return;

      button.disabled = true;
      button.classList.add('busy');
      showToast('Bezig met uitvoeren...', 'info');

      try {
        if (type === 'toggle') {
          const domain = serviceId.split('.')[0];
          await callService(domain, 'toggle', { entity_id: serviceId });
        } else {
          const [domain, service] = serviceId.split('.');
          await callService(domain, service, {});
        }
        showToast('Actie voltooid', 'success');
      } catch (error) {
        showToast('Actie mislukt', 'error');
      } finally {
        button.disabled = false;
        button.classList.remove('busy');
      }
    });
  });
}
