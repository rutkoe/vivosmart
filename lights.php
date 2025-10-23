<?php
include('token.php');

if (!isset($_POST['entity_id'])) exit;

$entity = $_POST['entity_id'];
$apiUrl = 'http://192.168.2.101:8123/api/services/light/toggle';

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "Authorization: Bearer $accessToken",
  "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["entity_id" => $entity]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

echo $response;
