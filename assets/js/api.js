const API_BASE = 'ha_proxy.php';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

export async function getState(entity) {
  try {
    const res = await fetch(`${API_BASE}?entity=${encodeURIComponent(entity)}`);
    if (!res.ok) throw new Error(`HA returned ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn(`Error fetching ${entity}:`, error);
    return null;
  }
}

export async function callService(domain, service, payload = {}) {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ domain, service, payload })
    });
    if (!res.ok) {
      const err = new Error(`Service error ${res.status}`);
      err.status = res.status;
      throw err;
    }
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (parseError) {
      return text;
    }
  } catch (error) {
    console.error('Service call failed', error);
    throw error;
  }
}
