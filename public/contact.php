<?php
/**
 * Formulario de contacto → envía a hola@mirtazaliauskas.com
 * Usa PHPMailer con SMTP Hostinger (smtp.hostinger.com:465) si está disponible.
 *
 * Config: contact_config.php en este directorio o en el padre (../).
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

// PHPMailer (recomendado por Hostinger)
$autoload = __DIR__ . '/vendor/autoload.php';
if (file_exists($autoload)) {
  require_once $autoload;
  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\SMTP;
  use PHPMailer\PHPMailer\Exception;

  $mail = new PHPMailer(true);
  try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = $to;
    $mail->Password   = $pass;
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($to, 'Sitio web');
    $mail->addAddress($to);
    $mail->addReplyTo($email, $name);
    $mail->Subject = $subject;
    $mail->Body    = $body;
    $mail->AltBody = $body;

    $mail->send();
    echo json_encode(['ok' => true]);
    exit;
  } catch (Exception $e) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'SMTP failed: ' . $mail->ErrorInfo]);
    exit;
  }
}

// Fallback: SMTP manual (si no hay PHPMailer)
$smtp_host = 'smtp.hostinger.com';
$smtp_user = $to;
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

$ctx = stream_context_create(['ssl' => ['verify_peer' => false, 'verify_peer_name' => false]]);
$sock = @stream_socket_client("ssl://$smtp_host:465", $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);

if (!$sock) {
  http_response_code(502);
  echo json_encode(['ok' => false, 'error' => 'SMTP connection failed']);
  exit;
}

smtp_line($sock);
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
smtp_cmd($sock, "DATA");
fwrite($sock, "Subject: $subject\r\n$headers\r\n\r\n$body\r\n.\r\n");
smtp_line($sock);
smtp_cmd($sock, "QUIT");
fclose($sock);

echo json_encode(['ok' => true]);
