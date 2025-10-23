const toast = document.getElementById('toast');
let toastTimeout = null;

export function showToast(message, type = 'info') {
  if (!toast) return;
  toast.textContent = message;
  toast.dataset.type = type;
  toast.classList.remove('hidden');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.add('hidden'), 3000);
}

export function setContainerLoading(container, message = 'Laden...') {
  if (!container) return;
  container.innerHTML = `<div class="loading">${message}</div>`;
}

export function formatStateValue(state) {
  if (!state) return '-';
  const unit = state.attributes && state.attributes.unit_of_measurement ? ` ${state.attributes.unit_of_measurement}` : '';
  return `${state.state}${unit}`;
}
