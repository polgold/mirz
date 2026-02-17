<?php
/**
 * Formulario de contacto → envía a hola@mirtazaliauskas.com
 * SMTP Hostinger: smtp.hostinger.com, puerto 587, STARTTLS
 *
 * Config: busca contact_config.php en este directorio o en el padre (../).
 * Poniendo la config en el directorio padre no se pierde al hacer deploy.
 * Contenido: <?php define('SMTP_PASS', 'tu-contraseña-del-correo');
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

$name = isset($_POST['name']) ? trim((string) $_POST['name']) : '';
$email = isset($_POST['email']) ? trim((string) $_POST['email']) : '';
$message = isset($_POST['message']) ? trim((string) $_POST['message']) : '';

if ($name === '' || $email === '' || $message === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Missing fields']);
  exit;
}

$to = 'hola@mirtazaliauskas.com';
$smtp_host = 'smtp.hostinger.com';
$smtp_user = $to;

$pass = null;
$config_paths = [__DIR__ . '/contact_config.php', __DIR__ . '/../contact_config.php'];
foreach ($config_paths as $path) {
  if (file_exists($path)) {
    include $path;
    $pass = defined('SMTP_PASS') ? SMTP_PASS : null;
    if ($pass !== null && $pass !== '') break;
  }
}
if ($pass === null || $pass === '') {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Server config missing']);
  exit;
}

$subject = 'Contacto web: ' . mb_substr($name, 0, 50);
$body = "Nombre: $name\nEmail: $email\n\nMensaje:\n$message";
$headers = "From: $to\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";

function smtp_line($sock) {
  $line = '';
  while (($c = fgetc($sock)) !== false) {
    $line .= $c;
    if ($c === "\n") break;
  }
  return $line;
}

function smtp_cmd($sock, $cmd) {
  fwrite($sock, $cmd . "\r\n");
  return smtp_line($sock);
}

// Puerto 587 + STARTTLS (más fiable en Hostinger que 465 SSL)
$errno = 0;
$errstr = '';
$sock = @stream_socket_client(
  "tcp://$smtp_host:587",
  $errno,
  $errstr,
  15,
  STREAM_CLIENT_CONNECT
);

if (!$sock) {
  http_response_code(502);
  echo json_encode(['ok' => false, 'error' => 'SMTP connection failed']);
  exit;
}

$w = smtp_line($sock);
smtp_cmd($sock, "EHLO " . $smtp_host);
$starttls = smtp_cmd($sock, "STARTTLS");
if (strpos($starttls, '220') === false) {
  fclose($sock);
  http_response_code(502);
  echo json_encode(['ok' => false, 'error' => 'SMTP STARTTLS failed']);
  exit;
}

$ctx = stream_context_create(['ssl' => ['verify_peer' => true]]);
if (!stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
  fclose($sock);
  http_response_code(502);
  echo json_encode(['ok' => false, 'error' => 'SMTP TLS failed']);
  exit;
}

smtp_cmd($sock, "EHLO " . $smtp_host);
smtp_cmd($sock, "AUTH LOGIN");
smtp_cmd($sock, base64_encode($smtp_user));
$auth = smtp_cmd($sock, base64_encode($pass));
if (strpos($auth, '235') === false) {
  fclose($sock);
  http_response_code(503);
  echo json_encode(['ok' => false, 'error' => 'SMTP auth failed']);
  exit;
}

smtp_cmd($sock, "MAIL FROM:<$smtp_user>");
smtp_cmd($sock, "RCPT TO:<$to>");
$r = smtp_cmd($sock, "DATA");
fwrite($sock, "Subject: $subject\r\n$headers\r\n\r\n$body\r\n.\r\n");
smtp_line($sock);
smtp_cmd($sock, "QUIT");
fclose($sock);

echo json_encode(['ok' => true]);
exit;
