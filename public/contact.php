<?php
declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0'); // en prod, no mostrar errores
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

// Honeypot (si tenés un input hidden llamado "website")
$honeypot = $_POST['website'] ?? '';
if (!empty($honeypot)) {
  echo json_encode(['ok' => true]);
  exit;
}

$name    = trim((string)($_POST['name'] ?? ''));
$email   = trim((string)($_POST['email'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Missing fields']);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Invalid email']);
  exit;
}

$to = 'hola@mirtazaliauskas.com'; // <-- CAMBIÁ si querés recibir en otro
$subject = "Nuevo mensaje desde mirtazaliauskas.com — $name";

$body =
"Nombre: $name\n" .
"Email: $email\n\n" .
"Mensaje:\n$message\n";

$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

// IMPORTANTE: el From debe ser del mismo dominio, para que no lo bloquee
$headers[] = 'From: Mirta Zaliauskas <hola@mirtazaliauskas.com>';
$headers[] = 'Reply-To: ' . $email;

$ok = @mail($to, $subject, $body, implode("\r\n", $headers));

if ($ok) {
  echo json_encode(['ok' => true]);
} else {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'mail() failed']);
}
