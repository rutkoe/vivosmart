// ====== GLOBAL SETTINGS ======
const headers = {
  "Authorization": `Bearer ${TOKEN}`,
  "Content-Type": "application/json"
};

// ====== CLOCK ======
function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();
  clock.textContent = now.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
}
setInterval(updateClock, 1000);
updateClock();

// ====== API HELPER ======
async function getState(entity) {
  try {
    const res = await fetch(`${HA_URL}/api/states/${entity}`, { headers });
    if (!res.ok) throw new Error(`HA returned ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn(`Error fetching ${entity}:`, e);
    return null;
  }
}

// ====== TABS ======
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(`tab-${tab.dataset.tab}`).classList.add("active");
    if (tab.dataset.tab === "lights") loadLights();
    if (tab.dataset.tab === "home") {
      loadHomeSensors();
      loadPersons();
    }
  });
});

// ====== HOME SENSORS ======
const doorSensors = [
  "binary_sensor.openclose_voordeur",
  "binary_sensor.openclose_achterdeur",
  "binary_sensor.openclose_tussendeur",
  "binary_sensor.openclose_slaapkamerraam",
  "binary_sensor.openclose_kattenkamerraam",
  "binary_sensor.openclose_keukenraam",
  "binary_sensor.openclose_kantoordeur"
];

const motionSensors = [
  "binary_sensor.presence_woonkamer",
  "binary_sensor.presence_toilet",
  "binary_sensor.presence_overloop",
  "binary_sensor.presence_badkamer",
  "binary_sensor.presence_keuken"
];

async function loadHomeSensors() {
  const doorsContainer = document.getElementById("doors");
  const motionContainer = document.getElementById("motion");
  if (!doorsContainer || !motionContainer) return;

  doorsContainer.innerHTML = "";
  motionContainer.innerHTML = "";

  for (const entity of doorSensors) {
    const state = await getState(entity);
    if (!state) continue;
    const name = state.attributes.friendly_name || entity;
    const isOpen = state.state === "on";
    const div = document.createElement("div");
    div.className = `sensor-tile ${isOpen ? "alert" : "ok"}`;
    div.innerHTML = `
      <div class="sensor-name">${name}</div>
      <div class="sensor-state">${isOpen ? "Open" : "Dicht"}</div>
    `;
    doorsContainer.appendChild(div);
  }

  for (const entity of motionSensors) {
    const state = await getState(entity);
    if (!state) continue;
    const name = state.attributes.friendly_name || entity;
    const active = state.state === "on";
    const div = document.createElement("div");
    div.className = `sensor-tile ${active ? "alert" : "ok"}`;
    div.innerHTML = `
      <div class="sensor-name">${name}</div>
      <div class="sensor-state">${active ? "Beweging" : "Rustig"}</div>
    `;
    motionContainer.appendChild(div);
  }
}

loadHomeSensors();

// ====== PERSON LOCATIONS ======
const persons = [
  { id: "person.rutger", name: "Rutger" },
  { id: "person.cindy", name: "Cindy" },
  { id: "person.sia", name: "Sia" },
  { id: "person.neo", name: "Neo" },
  { id: "person.homehub", name: "HomeHub" }
];

async function loadPersons() {
  for (const p of persons) {
    const data = await getState(p.id);
    if (!data) continue;
    const el = document.querySelector(`.avatar[data-name="${p.name}"] .location`);
    if (!el) continue;

    const state = data.state;
    const geo = data.attributes.geocoded_location || "";
    let text = "";

    if (state === "home") text = "Thuis";
    else if (state === "not_home") text = geo ? geo : "Onderweg";
    else text = state;

    el.textContent = text;
  }
}

loadPersons();
setInterval(loadPersons, 60000);

// ====== LIGHTS ======
async function loadLights() {
  const lightsContainer = document.getElementById("lights");
  if (!lightsContainer) return;

  const lightEntities = [
    "light.group_woonkamer",
    "light.ledstrip_tv",
    "light.ledstrip_vensterbank",
    "light.kamerlamp",
    "light.bureaulamp",
    "light.cct_slaapkamer",
    "light.rgb_slaapkamer",
    "switch.smartplug_1",
    "light.group_woonkamer_plafond",
    "light.plafondlamp",
    "light.plafondlamp1",
    "light.extended_color_light_23",
    "light.hobbykamer_lamp",
    "light.lightbar_hobbykamer",
    "switch.smartplug_2",
    "light.group_verlichting_afzuigkap",
    "light.hue_ledstrip",
    "light.keukenlamp",
    "light.overlooplamp",
    "light.entreelamp",
    "light.badkamerlamp",
    "light.toiletlamp"
  ];

  lightsContainer.innerHTML = "";

  for (const entity of lightEntities) {
    const state = await getState(entity);
    if (!state) continue;

    const name = state.attributes.friendly_name || entity;
    const isOn = state.state === "on";

    const button = document.createElement("button");
    button.className = `light-btn ${isOn ? "on" : "off"}`;
    button.dataset.entity = entity;
    button.innerHTML = `<span>${name}</span>`;

    button.addEventListener("click", async () => {
      const serviceDomain = entity.split(".")[0];
      const newState = isOn ? "turn_off" : "turn_on";
      await fetch(`${HA_URL}/api/services/${serviceDomain}/${newState}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ entity_id: entity })
      });
      setTimeout(loadLights, 600);
    });

    lightsContainer.appendChild(button);
  }
}

// ====== SENSOR STATUS BAR ======
async function loadTopSensors() {
  const el = document.getElementById("sensorData");
  if (!el) return;
  const entities = [
    "weather.huis",
    "sensor.temperature_woonkamer",
    "sensor.humidity_woonkamer",
    "sensor.p1_meter_3c39e728ca42_active_power"
  ];
  el.innerHTML = "";

  for (const entity of entities) {
    const state = await getState(entity);
    if (!state) continue;
    const name = state.attributes.friendly_name || entity;
    const val = state.state;
    const div = document.createElement("div");
    div.className = "top-sensor";
    div.textContent = `${name}: ${val}`;
    el.appendChild(div);
  }
}
loadTopSensors();
setInterval(loadTopSensors, 60000);

// ====== STYLING HELPERS ======
document.addEventListener("mouseover", e => {
  if (e.target.classList.contains("light-btn")) e.target.style.transform = "translateY(-2px)";
});
document.addEventListener("mouseout", e => {
  if (e.target.classList.contains("light-btn")) e.target.style.transform = "";
});
