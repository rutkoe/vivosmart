<?php
include('token.php'); // bevat $accessToken
$haUrl = 'http://192.168.2.101:8123';
?>
<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VivoConnect Dashboard</title>
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
      <div class="card glass">
        <h2>The Crew</h2>
        <div class="avatars">
          <div class="avatar"><img src="assets/img/rtgr.jpg"><span>Rutger</span></div>
          <div class="avatar"><img src="assets/img/cindy.jpg"><span>Cindy</span></div>
          <div class="avatar"><img src="assets/img/sia.jpg"><span>Sia</span></div>
          <div class="avatar"><img src="assets/img/neo.jpg"><span>Neo</span></div>
        </div>
      </div>
      <div class="card glass">
        <h2>Deuren & Ramen</h2>
        <div id="doors" class="sensor-grid"></div>
      </div>
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
        <button class="action" data-service="switch.samsung_tv" data-type="toggle"><i class="mdi mdi-television"></i></button>
        <button class="action" data-service="switch.soundbar_volume_down" data-type="toggle"><i class="mdi mdi-volume-minus"></i></button>
        <button class="action" data-service="switch.soundbar_volume_up" data-type="toggle"><i class="mdi mdi-volume-plus"></i></button>
        <button class="action" data-service="rest_command.spectrum_goodnight" data-type="call"><i class="mdi mdi-sleep"></i></button>
      </div>
    </div>
  </section>

  <!-- LIGHTS -->
  <section id="tab-lights" class="tab-content">
    <div class="card glass">
      <h2>Lampen</h2>
      <div id="lights" class="light-grid"></div>
    </div>
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

<script src="assets/scripts.js"></script>
<script src="assets/stars.js"></script>
</body>
</html>
