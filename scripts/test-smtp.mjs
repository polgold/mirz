#!/usr/bin/env node
/**
 * Prueba SMTP Hostinger (465 SSL) desde Node. Uso: SMTP_PASS=tu-pass node scripts/test-smtp.mjs
 */
import tls from 'node:tls';
import { once } from 'node:events';

const host = 'smtp.hostinger.com';
const port = 465;
const user = 'hola@mirtazaliauskas.com';
const pass = process.env.SMTP_PASS;

if (!pass) {
  console.error('Usá: SMTP_PASS=tu-contraseña node scripts/test-smtp.mjs');
  process.exit(1);
}

function send(sock, cmd) {
  return new Promise((resolve, reject) => {
    let buf = '';
    const onData = (chunk) => {
      buf += chunk.toString();
      if (buf.includes('\n')) {
        sock.removeListener('data', onData);
        sock.removeListener('error', onError);
        resolve(buf);
      }
    };
    const onError = reject;
    sock.on('data', onData);
    sock.once('error', onError);
    if (cmd) sock.write(cmd + '\r\n');
  });
}

function read(sock) {
  return new Promise((resolve, reject) => {
    let buf = '';
    const onData = (chunk) => {
      buf += chunk.toString();
      if (buf.includes('\n')) {
        sock.removeListener('data', onData);
        sock.removeListener('error', onError);
        resolve(buf);
      }
    };
    const onError = reject;
    sock.on('data', onData);
    sock.once('error', onError);
  });
}

async function main() {
  console.log('Conectando a', host + ':' + port, '...');
  const sock = tls.connect({
    host,
    port,
    servername: host,
    rejectUnauthorized: false,
  });
  await once(sock, 'secureConnect');

  await send(sock, 'EHLO ' + host);
  await send(sock, 'AUTH LOGIN');
  await send(sock, Buffer.from(user, 'utf8').toString('base64'));
  await send(sock, Buffer.from(pass, 'utf8').toString('base64'));
  const auth = await read(sock); // respuesta al password (235 = ok, 535 = failed)

  if (!auth.includes('235')) {
    console.error('ERROR: SMTP auth failed');
    console.error(auth.trim());
    sock.destroy();
    process.exit(1);
  }

  console.log('Auth OK. Enviando correo de prueba...');

  await send(sock, 'MAIL FROM:<' + user + '>');
  await send(sock, 'RCPT TO:<' + user + '>');
  await send(sock, 'DATA');
  const body = 'Subject: Prueba SMTP (Node)\r\nFrom: ' + user + '\r\n\r\nPrueba desde script Node. Si llegó, el SMTP está bien.\r\n';
  await send(sock, body + '\r\n.');
  await send(sock, 'QUIT');
  sock.destroy();

  console.log('OK. Correo enviado a', user);
}

main().catch((err) => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
