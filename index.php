<?php
include('token.php'); // bevat $accessToken
$haUrl = 'http://192.168.2.101:8123';
?>
<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VivoSmart Dashboard</title>
<link rel="stylesheet" href="assets/styles.css">
<script>
const HA_URL = "<?php echo $haUrl; ?>";
const TOKEN = "<?php echo $accessToken; ?>";
</script>
</head>

<body>
<canvas id="stars"></canvas>

<header class="topbar glass">
  <div class="time" id="clock">--:--</div>
  <div class="sensors" id="sensorData"></div>
</header>

<nav class="navbar glass">
  <button class="tab active" data-tab="home">HOME</button>
  <button class="tab" data-tab="media">MEDIA</button>
  <button class="tab" data-tab="lights">LIGHTS</button>
  <button class="tab" data-tab="energy">ENERGY</button>
</nav>

<main>
  <!-- HOME -->
  <section id="tab-home" class="tab-content active">
    <div class="card-group">

      <!-- CREW -->
      <div class="card glass">
        <h2>The Crew</h2>
        <div class="avatars">
          <div class="avatar" data-entity="person.rutger" data-name="Rutger">
            <img src="assets/img/rtgr.jpg" alt="Rutger">
            <span>Rutger</span>
            <span class="location">Laden...</span>
          </div>
          <div class="avatar" data-entity="person.cindy" data-name="Cindy">
            <img src="assets/img/cindy.jpg" alt="Cindy">
            <span>Cindy</span>
            <span class="location">Laden...</span>
          </div>
          <div class="avatar" data-entity="person.sia" data-name="Sia">
            <img src="assets/img/sia.jpg" alt="Sia">
            <span>Sia</span>
            <span class="location">Laden...</span>
          </div>
          <div class="avatar" data-entity="person.neo" data-name="Neo">
            <img src="assets/img/neo.jpg" alt="Neo">
            <span>Neo</span>
            <span class="location">Laden...</span>
          </div>
          <div class="avatar" data-entity="person.homehub" data-name="HomeHub">
            <img src="assets/img/homehub.jpg" alt="HomeHub">
            <span>HomeHub</span>
            <span class="location">Laden...</span>
          </div>
        </div>
      </div>

      <!-- DEUREN EN RAMEN -->
      <div class="card glass">
        <h2>Deuren & Ramen</h2>
        <div id="doors" class="sensor-grid"></div>
      </div>

      <!-- BEWEGING -->
      <div class="card glass">
        <h2>Beweging</h2>
        <div id="motion" class="sensor-grid"></div>
      </div>
    </div>
  </section>

  <!-- MEDIA -->
  <section id="tab-media" class="tab-content">
    <div class="card glass">
      <h2>Media Control</h2>
      <div class="button-grid">
        <button class="action" data-service="switch.samsung_tv" data-type="toggle">TV Power</button>
        <button class="action" data-service="switch.soundbar_volume_down" data-type="toggle">Vol -</button>
        <button class="action" data-service="switch.soundbar_volume_up" data-type="toggle">Vol +</button>
        <button class="action" data-service="rest_command.spectrum_goodnight" data-type="call">Bedtijd</button>
      </div>
    </div>
  </section>

  <!-- LIGHTS -->
  <section id="tab-lights" class="tab-content">
    <!-- Woonkamer -->
    <div class="card glass">
      <h2>Woonkamer</h2>
      <div class="light-grid">
        <button class="light-btn" data-entity="light.group_woonkamer">Woonkamer</button>
        <button class="light-btn" data-entity="light.ledstrip_tv">Ledstrip TV</button>
        <button class="light-btn" data-entity="light.ledstrip_vensterbank">Ledstrip Vensterbank</button>
        <button class="light-btn" data-entity="light.kamerlamp">Kamerlamp</button>
        <button class="light-btn" data-entity="light.bureaulamp">Bureaulamp</button>
        <button class="light-btn" data-entity="switch.smartplug_1">Schemerlamp</button>
      </div>
    </div>

    <!-- Plafondlampen -->
    <div class="card glass">
      <h2>Plafondlampen</h2>
      <div class="light-grid">
        <button class="light-btn" data-entity="light.group_woonkamer_plafond">Woonkamer Plafond</button>
        <button class="light-btn" data-entity="light.plafondlamp">Plafondlamp</button>
        <button class="light-btn" data-entity="light.plafondlamp1">Plafondlamp 1</button>
      </div>
    </div>

    <!-- Slaapkamer -->
    <div class="card glass">
      <h2>Slaapkamer</h2>
      <div class="light-grid">
        <button class="light-btn" data-entity="light.extended_color_light_23">Slaapkamerlamp</button>
        <button class="light-btn" data-entity="light.cct_slaapkamer">CCT Lamp</button>
        <button class="light-btn" data-entity="light.rgb_slaapkamer">RGB Lamp</button>
      </div>
    </div>

    <!-- Hobbykamer -->
    <div class="card glass">
      <h2>Hobbykamer</h2>
      <div class="light-grid">
        <button class="light-btn" data-entity="light.hobbykamer_lamp">Hobbykamer Lamp</button>
        <button class="light-btn" data-entity="light.lightbar_hobbykamer">Lightbar</button>
        <button class="light-btn" data-entity="switch.smartplug_2">Schemerlamp</button>
      </div>
    </div>

    <!-- Keuken -->
    <div class="card glass">
      <h2>Keuken</h2>
      <div class="light-grid">
        <button class="light-btn" data-entity="light.group_verlichting_afzuigkap">Aanrecht Verlichting</button>
        <button class="light-btn" data-entity="light.hue_ledstrip">Ledstrip Keuken</button>
        <button class="light-btn" data-entity="light.keukenlamp">Keukenlamp</button>
      </div>
    </div>

    <!-- Overige ruimtes -->
    <div class="card glass">
      <h2>Overige ruimtes</h2>
      <div class="light-grid">
        <button class="light-btn" data-entity="light.overlooplamp">Overlooplamp</button>
        <button class="light-btn" data-entity="light.entreelamp">Entreelamp</button>
        <button class="light-btn" data-entity="light.badkamerlamp">Badkamerlamp</button>
        <button class="light-btn" data-entity="light.toiletlamp">Toiletlamp</button>
      </div>
    </div>

    <!-- Dynamic Scenes -->
    <div class="card glass">
      <h2>Dynamic Scenes</h2>
      <div class="button-grid">
        <button class="scene" data-service="rest_command.spectrum_ai">AI</button>
        <button class="scene" data-service="rest_command.spectrum_bluepurple">Blue Purple</button>
        <button class="scene" data-service="rest_command.spectrum_peachlavender">Peach Lavender</button>
        <button class="scene" data-service="rest_command.spectrum_clubloungevibes">Club Lounge</button>
        <button class="scene" data-service="rest_command.spectrum_oceandeep">Ocean Deep</button>
        <button class="scene" data-service="rest_command.spectrum_party">Party</button>
        <button class="scene" data-service="rest_command.spectrum_valentine">Love</button>
        <button class="scene stop" data-service="rest_command.spectrum_stop">STOP</button>
      </div>
    </div>
  </section>

  <!-- ENERGY -->
  <section id="tab-energy" class="tab-content">
    <div class="card glass">
      <h2>Energy</h2>
      <div id="energy" class="sensor-grid"></div>
    </div>
  </section>
</main>

<script src="assets/script.js"></script>
<script src="assets/stars.js"></script>
</body>
</html>
