<?php
header('Content-Type: application/json');
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/token.php';

if (!isset($accessToken) || !$accessToken) {
  http_response_code(500);
  echo json_encode(['error' => 'Missing Home Assistant token']);
  exit;
}

function forwardRequest(string $url, array $options = []) {
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  foreach ($options as $option => $value) {
    curl_setopt($ch, $option, $value);
  }
  $response = curl_exec($ch);
  $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $error = curl_error($ch);
  curl_close($ch);

  if ($response === false || $status >= 400) {
    http_response_code($status ?: 502);
    echo json_encode([
      'error' => $error ?: 'Request failed',
      'status' => $status,
    ]);
    exit;
  }

  return $response;
}

$headers = [
  "Authorization: Bearer {$accessToken}",
  'Content-Type: application/json',
  'Accept: application/json',
];

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  if (isset($_GET['entity'])) {
    $entity = $_GET['entity'];
    $url = sprintf('%s/api/states/%s', $haUrl, rawurlencode($entity));
    $response = forwardRequest($url, [
      CURLOPT_HTTPHEADER => $headers,
    ]);
    echo $response;
    exit;
  }

  http_response_code(400);
  echo json_encode(['error' => 'Invalid request']);
  exit;
}

if ($method === 'POST') {
  $input = json_decode(file_get_contents('php://input'), true) ?: [];
  $domain = $input['domain'] ?? null;
  $service = $input['service'] ?? null;
  $payload = $input['payload'] ?? [];

  if (!$domain || !$service) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing domain or service']);
    exit;
  }

  $url = sprintf('%s/api/services/%s/%s', $haUrl, rawurlencode($domain), rawurlencode($service));
  $response = forwardRequest($url, [
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
  ]);

  echo $response ?: json_encode(['status' => 'ok']);
  exit;
}

http_response_code(405);
header('Allow: GET, POST');
echo json_encode(['error' => 'Method not allowed']);
